import {Component, OnDestroy, OnInit} from "@angular/core";

import {ForecastType} from "../../forecast-type";
import {WaterUsageForecastsService} from "../../water-usage-forecasts.service";
import {ActivatedRoute} from "@angular/router";
import {
  ForecastResponse, ForecastUsage
} from "../../forecast-response";
import {max, min, takeWhile} from "rxjs";
import {stringToColor, prettyPrintNum} from "common";
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

  /** @internal just a re-export of the type */
  regressionMethod = ForecastType;
  method: ForecastType = ForecastType.LINEAR;

  response?: Promise<ForecastResponse>;
  didFinish = false;

  consumerGroupData: any = null;
  consumerAreaData: any = null;
  areaComponents?: [string, string][];

  private subscribeQuery = true;

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeWhile(() => this.subscribeQuery))
      .subscribe(({key}) => {
        if (!key) return;
        this.service.fetchForecastData(key, ForecastType.LINEAR)
          .subscribe(data => {
            this.updateGraphs(data.accumulations);
            this.updateAreaComponents(data.partials);
          })
      })
  }

  ngOnDestroy(): void {
    this.subscribeQuery = false;
  }

  updateGraphs(forecast: ForecastResponse["accumulations"]): void {
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

  updateAreaComponents(forecast: ForecastResponse["partials"]): void {
    let components =  new Map();
    for (let entry of forecast) {
      components.set(entry.municipal.key, entry.municipal.name);
    }
    this.areaComponents = Array.from(components);
    console.log(this.areaComponents);
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
  chartTickFormat(value: number | string, index: number, ticks: Tick[]) {
    return prettyPrintNum(+value) + "m³";
  }

}
