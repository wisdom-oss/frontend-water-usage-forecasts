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

@Component({
  selector: 'lib-prophet-forecast-result-data',
  templateUrl: './prophet-forecast-result-data.component.html'
})
export class ProphetForecastResultDataComponent implements OnChanges {

  @Input("key")
  key!: string | string[];

  constructor(private service: ProphetForecastService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['key']) this.fetchData(this.key);
  }

  data: any[] = [];

  private fetchData(key: string | string[]): void {
    let res: Promise<ForecastResponse>[] = [];
    for (let currentKey of [key].flat()) {
      res.push(firstValueFrom(this.service.fetchForecastData(currentKey)))
    }
    Promise.all(res).then(res => {
      this.data = [];
      for (let entry of res) {
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
            label: "lowMigrationPrognosis.lower",
            data: lowMigrationPrognosisData.lower,
            backgroundColor: "#A37A00",
            stack: "lowMigrationPrognosis"
          },
          {
            label: "lowMigrationPrognosis.forecast",
            data: lowMigrationPrognosisData.forecast,
            backgroundColor: "#FFBF00",
            stack: "lowMigrationPrognosis"
          },
          {
            label: "lowMigrationPrognosis.upper",
            data: lowMigrationPrognosisData.upper,
            backgroundColor: "#FFD65C",
            stack: "lowMigrationPrognosis"
          },
          {
            label: "mediumMigrationPrognosis.lower",
            data: mediumMigrationPrognosisData.lower,
            backgroundColor: "#0A758F",
            stack: "mediumMigrationPrognosis"
          },
          {
            label: "mediumMigrationPrognosis.forecast",
            data: mediumMigrationPrognosisData.forecast,
            backgroundColor: "#10BBE5",
            stack: "mediumMigrationPrognosis"
          },
          {
            label: "mediumMigrationPrognosis.upper",
            data: mediumMigrationPrognosisData.upper,
            backgroundColor: "#5DD6F4",
            stack: "mediumMigrationPrognosis"
          },
          {
            label: "highMigrationPrognosis.lower",
            data: highMigrationPrognosisData.lower,
            backgroundColor: "#B00058",
            stack: "highMigrationPrognosis"
          },
          {
            label: "highMigrationPrognosis.forecast",
            data: highMigrationPrognosisData.forecast,
            backgroundColor: "#FF0D86",
            stack: "highMigrationPrognosis"
          },
          {
            label: "highMigrationPrognosis.upper",
            data: highMigrationPrognosisData.upper,
            backgroundColor: "#FF69B4",
            stack: "highMigrationPrognosis"
          },
        ];
        this.data.push({
          labels,
          datasets: chartDatasets
        });
      }
    });
  }

}
