import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ChartData, ChartEvent, LegendItem} from "chart.js/auto";
import {stringToColor, MapComponent, Resolution, MapService, BreadcrumbsService, getResolvedUrl} from "common";
import {icon} from "leaflet";
import {combineLatest, takeWhile} from "rxjs";
import {combineLatestWith} from "rxjs/operators";

import {
  ForecastResponse,
  WaterUsageForecastsService,
  ForecastType,
  ForecastUsage
} from "../../services/water-usage-forecasts.service";
import {WaterRightsService} from "../../services/water-rights.service";
import {ConsumersService} from "../../services/consumers.service";
import {consumerIcon, waterRightIcon} from "../../map-icons";

@Component({
  selector: 'lib-result-data-view',
  templateUrl: './result-data-view.component.html'
})
export class ResultDataViewComponent implements OnInit, OnDestroy {

  constructor(
    private service: WaterUsageForecastsService,
    private waterRightService: WaterRightsService,
    private consumersService: ConsumersService,
    private route: ActivatedRoute,
    private router: Router,
    private mapService: MapService,
    private breadcrumbs: BreadcrumbsService
  ) {}

  Object = Object;
  Resolution = Resolution;

  response?: Promise<ForecastResponse>;
  didFinish = false;

  selection: Record<Resolution, [string, string][]> = {
    state: [],
    district: [],
    administration: [],
    municipal: []
  };

  consumerGroupData: any = null;
  consumerAreaData: any = null;
  areaComponents?: [string, string][];
  refProgSplit: number = 0;

  markers: MapComponent["inputMarkers"] = [];

  key: string[] = [];
  private subscribeQuery = true;

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeWhile(() => this.subscribeQuery))
      .subscribe(({key, method}) => {
        if (!key) return;
        this.key = [key].flat();
        this.fetchData(key, method ?? ForecastType.LINEAR);
      })
  }

  ngOnDestroy(): void {
    this.subscribeQuery = false;
  }

  /** @internal just a re-export of the type */
  regressionMethod = ForecastType;
  set method(m: ForecastType) {
     this.router.navigate([], {
       relativeTo: this.route,
       queryParams: Object.assign(
         {},
         this.route.snapshot.queryParams,
         {method: m}
       )
     }).catch(console.error);
  }
  get method() {
    return this.route.snapshot.queryParams["method"] ?? ForecastType.LINEAR;
  }

  private fetchData(key: string | string[], method: ForecastType): void {
    this.service.fetchForecastData(key, method)
      .subscribe(data => {
        this.updateGraphs(data.accumulations);
        this.updateAreaComponents(data.partials);
        this.breadcrumbs.set(1, {
          text: "Kartenergebnisse",
          link: "#"
        });
;      });
    this.mapService.fetchLayerData(null, [key].flat())
      .then(data => {
        let selection: this["selection"] = {
          state: [],
          district: [],
          administration: [],
          municipal: []
        };
        for (let shape of data.shapes) {
          let res = Resolution.toEnum(shape.key.length);
          if (!res) continue;
          selection[res].push([shape.key, shape.name]);
        }
        this.selection = selection;
      });
    this.waterRightService.fetchWaterRightLocations({
      in: [key].flat(),
      isReal: true}
    ).pipe(combineLatestWith(this.consumersService.fetchConsumers({
      in: [key].flat(),
      // TODO: move this value elsewhere
      usageAbove: 10000
    }))).subscribe(data => {
      let markers = [];

      // iterate over locations of water rights
      for (let marker of data[0] ?? []) {
        markers.push({
          coordinates: [
            marker.geojson.coordinates[1],
            marker.geojson.coordinates[0]
          ] as [number, number],
          tooltip: `
            <b>Name</b>: ${marker.name}<br>
            <b>Water Right No</b>: ${marker.waterRight}
          `,
          icon: waterRightIcon,
          onClick: () => this.router.navigate(
            ["detail", "water-right", marker.waterRight],
            {relativeTo: this.route.parent}
          )
        })
      }

      // iterate over consumer locations
      for (let marker of data[1] ?? []) {
        markers.push({
          coordinates: [
            marker.geojson.coordinates[1],
            marker.geojson.coordinates[0]
          ] as [number, number],
          tooltip: marker.name,
          icon: consumerIcon,
          onClick: () => this.router.navigate(
            ["detail", "consumer", marker.id],
            {relativeTo: this.route.parent}
          )
        })
      }

      this.markers = markers;
    });
  }

  private updateGraphs(forecast: ForecastResponse["accumulations"]): void {
    for (let ref of Object.values(forecast.municipal.reference)) {
      this.refProgSplit = ref.endYear - ref.startYear + 1;
      break;
    }
    const colorMap = {
      "Agriculture, Forestry, Fisheries": "green",
      "Businesses": "#bcd9e0",
      "Household": "#ba4c43",
      "Public Institution": "#5443ba",
      "Small Businesses": "#a9c940",
      "Tourism": "#e02abf"
    }
    let [minYear, maxYear] = [Infinity, -Infinity];
    function mapUsage(usage: ForecastUsage, type: "forecast" | "reference") {
      minYear = Math.min(usage.startYear, minYear);
      maxYear = Math.max(usage.endYear, maxYear);

      return {
        label: usage.displayName,
        data: usage.usages.map((val, i) => ({x: i + usage.startYear, y: val})),
        borderWidth: 1,
        borderSkipped: "middle",
        borderColor: "black",
        backgroundColor: stringToColor(usage.displayName, colorMap)
      }
    }
    this.consumerGroupData = {
      datasets: [
        Object
          .values(forecast.consumerGroup.reference)
          .map(el => mapUsage(el, "reference")),
        Object
          .values(forecast.consumerGroup.forecast)
          .map(el => mapUsage(el, "forecast"))
      ].flat()
    }
    this.consumerAreaData = {
      datasets: [
        Object
          .values(forecast.municipal.reference)
          .map(el => mapUsage(el, "reference")),
        Object
          .values(forecast.municipal.forecast)
          .map(el => mapUsage(el, "forecast"))
      ].flat()
    }
    let labels: number[] = [];
    for (let y = minYear; y <= maxYear; y++) labels.push(y);
    this.consumerGroupData.labels = labels;
    this.consumerAreaData.labels = labels;
  }

  private updateAreaComponents(forecast: ForecastResponse["partials"]): void {
    let components =  new Map();
    for (let entry of forecast) {
      components.set(entry.municipal.key, entry.municipal.name);
    }
    this.areaComponents = Array.from(components);
  }

  chartLegendFilter(item: LegendItem, data: ChartData): boolean {
    //console.log([item, data]);
    if (item.datasetIndex >= data.datasets.length / 2) return false;
    item.lineWidth = 0;
    return true;
  }
  chartLegendOnClick(event: ChartEvent, item: LegendItem, legend: any) {
    console.log([event, item, legend]);
    let chart = legend.chart;
    chart.getDatasetMeta(item.datasetIndex).hidden =
      !chart.getDatasetMeta(item.datasetIndex).hidden;
    chart.getDatasetMeta(item.datasetIndex + legend.legendItems.length).hidden =
      !chart.getDatasetMeta(item.datasetIndex + legend.legendItems.length).hidden;
    chart.update();
  }

}
