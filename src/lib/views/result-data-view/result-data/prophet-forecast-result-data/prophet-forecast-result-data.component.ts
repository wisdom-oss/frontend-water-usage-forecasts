import {
  OnChanges,
  SimpleChanges,
  ViewChildren,
  Component,
  OnInit,
  Input,
  QueryList,
  ElementRef
} from "@angular/core";
import {
  Chart,
  ActiveElement,
  LegendElement,
  ChartEvent,
  LegendItem
} from "chart.js";
import {BaseChartDirective} from "ng2-charts";
import {firstValueFrom} from "rxjs";

import {
  ForecastResponse,
  ProphetForecastService
} from "../../../../services/old/prophet-forecast.service";

enum PrognosisVariant {
  LOW,
  MEDIUM,
  HIGH
}

@Component({
  selector: 'lib-prophet-forecast-result-data',
  templateUrl: './prophet-forecast-result-data.component.html',
  styleUrls: ["./prophet-forecast-result-data.component.css"]
})
export class ProphetForecastResultDataComponent implements OnChanges {

  @Input()
  key!: string | string[];

  @Input()
  mapKeyNames: Record<string, string> = {};

  @ViewChildren(BaseChartDirective)
  chartElements!: QueryList<BaseChartDirective>;

  readonly PrognosisVariant = PrognosisVariant;

  data: [string, any][] = [];

  constructor(private service: ProphetForecastService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['key']) this.fetchData(this.key);
  }

  chartLabelUpdate(chart: Chart, variant: PrognosisVariant) {
    let settingsArray = (() => {
      switch (variant) {
        case PrognosisVariant.LOW:
          return [true, true, false, false, false, false];
        case PrognosisVariant.MEDIUM:
          return [false, false, true, true, false, false];
        case PrognosisVariant.HIGH:
          return [false, false, false, false, true, true];
      }
    })();
    // doing it in two runs makes the transition look a bit smoother
    for (let [i, show] of settingsArray.entries()) {
      if (show) chart.show(i);
    }
    for (let [i, show] of settingsArray.entries()) {
      if (!show) chart.hide(i);
    }
  }

  onLabelChange(event: Event, index: number) {
    let variant = +(event.target as any).dataset.prognosisVariant as PrognosisVariant;
    let chart = this.chartElements.get(index)!.chart!;
    this.chartLabelUpdate(chart, variant);
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
          bounds: [] as [number, number][],
          forecast: [] as number[]
        };
        for (let el of entry.lowMigrationPrognosis) {
          labels.push(el.ds.split("-")[0]);
          lowMigrationPrognosisData.bounds.push([el.lower, el.upper]);
          lowMigrationPrognosisData.forecast.push(el.forecast);
        }

        let mediumMigrationPrognosisData = {
          bounds: [] as [number, number][],
          forecast: [] as number[]
        };
        for (let el of entry.mediumMigrationPrognosis) {
          mediumMigrationPrognosisData.bounds.push([el.lower, el.upper]);
          mediumMigrationPrognosisData.forecast.push(el.forecast);
        }

        let highMigrationPrognosisData = {
          bounds: [] as [number, number][],
          forecast: [] as number[]
        };
        for (let el of entry.highMigrationPrognosis) {
          highMigrationPrognosisData.bounds.push([el.lower, el.upper]);
          highMigrationPrognosisData.forecast.push(el.forecast);
        }

        let chartDataset = [
          {
            type: "scatter",
            data: lowMigrationPrognosisData.forecast,
            borderColor: "#A37A00",
            borderWidth: 2,
            pointStyle: "line",
            grouped: false,
            hidden: true
          },
          {
            type: "bar",
            data: lowMigrationPrognosisData.bounds,
            backgroundColor: "#FFBF00",
            grouped: false,
            hidden: true
          },
          {
            type: "scatter",
            data: mediumMigrationPrognosisData.forecast,
            borderColor: "#0A758F",
            borderWidth: 2,
            pointStyle: "line",
            grouped: false
          },
          {
            type: "bar",
            data: mediumMigrationPrognosisData.bounds,
            backgroundColor: "#10BBE5",
            grouped: false
          },
          {
            type: "scatter",
            data: highMigrationPrognosisData.forecast,
            borderColor: "#B00058",
            borderWidth: 2,
            pointStyle: "line",
            grouped: false,
            hidden: true
          },
          {
            type: "bar",
            data: highMigrationPrognosisData.bounds,
            backgroundColor: "#FF0D86",
            grouped: false,
            hidden: true
          },
        ];
        this.data.push([key, {
          labels,
          datasets: chartDataset
        }]);
      }
    });
  }

}
