import {
  OnChanges,
  SimpleChanges,
  Component,
  EventEmitter,
  OnInit,
  Input,
  Output
} from "@angular/core";
import {ChartData, ChartEvent, LegendItem} from "chart.js";
import {stringToColor} from "common";
import {firstValueFrom} from "rxjs";

import {
  ForecastResponse,
  WaterUsageForecastsService,
  ForecastType,
  ForecastUsage
} from "../../../services/water-usage-forecasts.service";

@Component({
  selector: '[lib-result-data]',
  templateUrl: './result-data.component.html'
})
export class ResultDataComponent implements OnInit, OnChanges {

  @Input("key")
  key!: Parameters<WaterUsageForecastsService["fetchForecastData"]>[0];

  @Input("method")
  method!: Parameters<WaterUsageForecastsService["fetchForecastData"]>[1];

  @Input("colors")
  colorMap = {
    "Agriculture, Forestry, Fisheries": "green",
    "Businesses": "#bcd9e0",
    "Household": "#ba4c43",
    "Public Institution": "#5443ba",
    "Small Businesses": "#a9c940",
    "Tourism": "#e02abf"
  };

  /** Area components the results are based on. */
  @Output()
  areaComponents: EventEmitter<[string, string][]> = new EventEmitter();

  /** Consumer group data. */
  consumerGroupData: any = null;
  /** Consumer area data. */
  consumerAreaData: any = null;
  /** The year difference between the end year and the start year. */
  refProgSplit: number = 0;

  constructor(
    private service: WaterUsageForecastsService
  ) {}

  ngOnInit(): void {
    this.fetchData(this.key, this.method);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['method'] || changes['key']) this.fetchData(this.key, this.method);
  }

  /**
   * Fetch data from the service to display.
   *
   * When the data is received this will automatically update all displayed
   * data.
   * @param key Key(s) to fetch data for
   * @param method Forecast calculation method
   * @private
   */
  private fetchData(key: string | string[], method: ForecastType): void {
    firstValueFrom(this.service.fetchForecastData(key, method))
      .then(data => {
        this.updateGraphs(data.accumulations);
        this.updateAreaComponents(data.partials);
      });
  }

  /**
   * Update the graphs on the component with the received forecast data.
   * @param forecast Data received from service
   * @private
   */
  private updateGraphs(forecast: ForecastResponse["accumulations"]): void {
    for (let ref of Object.values(forecast.municipal.reference)) {
      this.refProgSplit = ref.endYear - ref.startYear + 1;
      break;
    }
    // TODO: make color map as @Input
    const colorMap = {
      "Agriculture, Forestry, Fisheries": "green",
      "Businesses": "#bcd9e0",
      "Household": "#ba4c43",
      "Public Institution": "#5443ba",
      "Small Businesses": "#a9c940",
      "Tourism": "#e02abf"
    };
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
      };
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
    };
    this.consumerAreaData = {
      datasets: [
        Object
          .values(forecast.municipal.reference)
          .map(el => mapUsage(el, "reference")),
        Object
          .values(forecast.municipal.forecast)
          .map(el => mapUsage(el, "forecast"))
      ].flat()
    };
    let labels: number[] = [];
    for (let y = minYear; y <= maxYear; y++) labels.push(y);
    this.consumerGroupData.labels = labels;
    this.consumerAreaData.labels = labels;
  }

  /**
   * Update area component graphs.
   * @param forecast Forecast data subset that is relevant for the area
   *                 component
   * @private
   */
  private updateAreaComponents(forecast: ForecastResponse["partials"]): void {
    let components = new Map();
    for (let entry of forecast) {
      components.set(entry.municipal.key, entry.municipal.name);
    }
    this.areaComponents.emit(Array.from(components));
  }


  /**
   * Show only the first half of chart legends.
   *
   * This is used because two different datasets should work as one.
   * @param item Legend item
   * @param data Chart data
   */
  chartLegendFilter(item: LegendItem, data: ChartData): boolean {
    if (!item.datasetIndex) return false;
    if (item.datasetIndex >= data.datasets.length / 2) return false;
    item.lineWidth = 0;
    return true;
  }

  /**
   * Function to toggle both datasets when one is clicked as the second part is
   * filtered out {@link chartLegendFilter}.
   * @param event Click event on the legend
   * @param item Legend item
   * @param legend The legend itself
   */
  chartLegendOnClick(event: ChartEvent, item: LegendItem, legend: any) {
    let chart = legend.chart;
    chart.getDatasetMeta(item.datasetIndex).hidden =
      !chart.getDatasetMeta(item.datasetIndex).hidden;
    chart.getDatasetMeta(item.datasetIndex + legend.legendItems.length).hidden =
      !chart.getDatasetMeta(item.datasetIndex + legend.legendItems.length).hidden;
    chart.update();
  }
}
