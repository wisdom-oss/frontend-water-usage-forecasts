import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  ForecastResponse,
  ProphetForecastService
} from "../../../../services/prophet-forecast.service";
import {firstValueFrom} from "rxjs";
import {
  ActiveElement,
  Chart,
  ChartEvent,
  LegendElement,
  LegendItem
} from "chart.js";

@Component({
  selector: 'lib-prophet-forecast-result-data',
  templateUrl: './prophet-forecast-result-data.component.html'
})
export class ProphetForecastResultDataComponent implements OnChanges {

  @Input()
  key!: string | string[];

  @Input()
  mapKeyNames: Record<string, string> = {}

  data: [string, any][] = [];

  constructor(private service: ProphetForecastService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['key']) this.fetchData(this.key);
  }

  chartOnClick(
    event: ChartEvent,
    legendItem: LegendItem,
    legend: LegendElement<"bar">
  ): void {
    let datasetIndex = legendItem.datasetIndex!;
    let chart = legend.chart;
    if (chart.getDatasetMeta(datasetIndex).visible) {
      chart.hide(datasetIndex + 1);
      chart.hide(datasetIndex);
      chart.hide(datasetIndex - 1);
    }
    else {
      chart.show(datasetIndex + 1);
      chart.show(datasetIndex);
      chart.show(datasetIndex - 1);
    }
  }

  chartLabelFilter(item: LegendItem): boolean {
    return !!item.text?.length;
  }

  private fetchData(key: string | string[]): void {
    let res: Promise<[string, ForecastResponse]>[] = [];
    for (let currentKey of [key].flat()) {
      res.push(firstValueFrom(this.service.fetchForecastData(currentKey)).then(res => [currentKey, res]))
    }
    Promise.all(res).then(res => {
      this.data = [];
      for (let [key, entry] of res) {
        let labels = [];

        let lowMigrationPrognosisData = {
          lower: [] as number[],
          forecast: [] as number[],
          upper: [] as number[]
        };
        for (let el of entry.lowMigrationPrognosis) {
          labels.push(el.ds.split("-")[0]);
          lowMigrationPrognosisData.lower.push(el.lower);
          lowMigrationPrognosisData.forecast.push(el.forecast);
          lowMigrationPrognosisData.upper.push(el.upper);
        }

        let mediumMigrationPrognosisData = {
          lower: [] as number[],
          forecast: [] as number[],
          upper: [] as number[]
        };
        for (let el of entry.mediumMigrationPrognosis) {
          mediumMigrationPrognosisData.lower.push(el.lower);
          mediumMigrationPrognosisData.forecast.push(el.forecast);
          mediumMigrationPrognosisData.upper.push(el.upper);
        }

        let highMigrationPrognosisData = {
          lower: [] as number[],
          forecast: [] as number[],
          upper: [] as number[]
        };
        for (let el of entry.highMigrationPrognosis) {
          highMigrationPrognosisData.lower.push(el.lower);
          highMigrationPrognosisData.forecast.push(el.forecast);
          highMigrationPrognosisData.upper.push(el.upper);
        }

        let chartDatasets = [
          {
            data: lowMigrationPrognosisData.lower,
            backgroundColor: "#A37A00",
            stack: "lowMigrationPrognosis"
          },
          {
            label: "lowMigrationPrognosis",
            data: lowMigrationPrognosisData.forecast,
            backgroundColor: "#FFBF00",
            stack: "lowMigrationPrognosis"
          },
          {
            data: lowMigrationPrognosisData.upper,
            backgroundColor: "#FFD65C",
            stack: "lowMigrationPrognosis"
          },
          {
            data: mediumMigrationPrognosisData.lower,
            backgroundColor: "#0A758F",
            stack: "mediumMigrationPrognosis"
          },
          {
            label: "mediumMigrationPrognosis",
            data: mediumMigrationPrognosisData.forecast,
            backgroundColor: "#10BBE5",
            stack: "mediumMigrationPrognosis"
          },
          {
            data: mediumMigrationPrognosisData.upper,
            backgroundColor: "#5DD6F4",
            stack: "mediumMigrationPrognosis"
          },
          {
            data: highMigrationPrognosisData.lower,
            backgroundColor: "#B00058",
            stack: "highMigrationPrognosis"
          },
          {
            label: "highMigrationPrognosis",
            data: highMigrationPrognosisData.forecast,
            backgroundColor: "#FF0D86",
            stack: "highMigrationPrognosis"
          },
          {
            data: highMigrationPrognosisData.upper,
            backgroundColor: "#FF69B4",
            stack: "highMigrationPrognosis"
          },
        ];
        this.data.push([key, {
          labels,
          datasets: chartDatasets
        }]);
      }
    });
  }

}
