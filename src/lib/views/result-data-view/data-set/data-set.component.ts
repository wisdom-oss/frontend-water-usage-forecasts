import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {ForecastResponse} from "../../../forecast-response";

@Component({
  selector: 'lib-data-set',
  templateUrl: './data-set.component.html'
})
export class DataSetComponent implements OnChanges {

  @Input("data") data?: ForecastResponse[0];

  name: string = "";
  consumerGroup: string = "";
  forecastEquation: string = "";
  forecastType: string = "";
  forecastScore: number = 0;
  lineData: any;

  ngOnChanges(changes: SimpleChanges): void {
    // TODO: only update if changes are present
    if (!this.data) return;
    Object.assign(this, this.data);

    console.log(this.data);
    let labels = [];
    for (
      let y = this.data.referenceUsages.startYear;
      y < this.data.forecastedUsages.endYear;
      y++
    ) {
      labels.push("" + y);
    }

    this.lineData = {
      labels,
      datasets: [
        {
          label: "references",
          data: this.data.referenceUsages.usageAmounts,
          borderColor: "red"
        },
        {
          label: "usages",
          data: new Array(this.data.referenceUsages.usageAmounts.length)
            .concat(this.data.forecastedUsages.usageAmounts),
          borderColor: "blue"
        }
      ]
    }
  }


}
