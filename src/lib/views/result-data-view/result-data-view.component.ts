import {Component, OnDestroy, OnInit} from "@angular/core";

import {ForecastType} from "../../forecast-type";
import {WaterUsageForecastsService} from "../../water-usage-forecasts.service";
import {ActivatedRoute} from "@angular/router";
import {ForecastResponse, ForecastUsage} from "../../forecast-response";
import {takeWhile} from "rxjs";
import {prettyPrintNum, stringToColor} from "common";
import {ChartData, ChartEvent, LegendItem, Tick} from "chart.js/auto";

@Component({
  selector: 'lib-result-data-view',
  templateUrl: './result-data-view.component.html'
})
export class ResultDataViewComponent implements OnInit, OnDestroy {

  constructor(
    private service: WaterUsageForecastsService,
    private route: ActivatedRoute
  ) {}

  response?: Promise<ForecastResponse>;
  didFinish = false;

  consumerGroupData: any = null;
  consumerAreaData: any = null;
  areaComponents?: [string, string][];

  private key!: string | string[];
  private subscribeQuery = true;

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeWhile(() => this.subscribeQuery))
      .subscribe(({key}) => {
        if (!key) return;
        this.key = key;
        this.fetchData(key, this._method);
      })
  }

  ngOnDestroy(): void {
    this.subscribeQuery = false;
  }

  /** @internal just a re-export of the type */
  regressionMethod = ForecastType;
  set method(m: ForecastType) {
     this._method = m;
     this.fetchData(this.key, m);
  }
  get method() {
    return this._method;
  }
  private _method: ForecastType = ForecastType.LINEAR;

  private fetchData(key: string | string[], method: ForecastType): void {
    this.service.fetchForecastData(key, method)
      .subscribe(data => {
        this.updateGraphs(data.accumulations);
        this.updateAreaComponents(data.partials);
      });
  }

  private updateGraphs(forecast: ForecastResponse["accumulations"]): void {
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
      let borderColor = "";
      switch (type) {
        case "forecast":
          borderColor = "red";
          break;
        case "reference":
          borderColor = "blue";
          break;
      }
      return {
        label: usage.displayName,
        data: usage.usages.map((val, i) => ({x: i + usage.startYear, y: val})),
        borderWidth: 1.5,
        borderSkipped: "middle",
        borderColor,
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
