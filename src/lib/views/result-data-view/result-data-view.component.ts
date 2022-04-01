import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from "@angular/core";
import {ChartData} from "chart.js";

import {ForecastType} from "../../forecast-type";
import {WaterUsageForecastsService} from "../../water-usage-forecasts.service";
import {ActivatedRoute} from "@angular/router";
import {ForecastResponse} from "../../forecast-response";

@Component({
  selector: 'lib-result-data-view',
  templateUrl: './result-data-view.component.html'
})
export class ResultDataViewComponent implements OnInit, AfterViewInit {

  @ViewChild("pageLoader") pageLoader!: ElementRef<HTMLDivElement>;

  constructor(
    private service: WaterUsageForecastsService,
    private route: ActivatedRoute
  ) {}

  /** @internal just a re-export of the type */
  regressionMethod = ForecastType;
  method: ForecastType = ForecastType.LINEAR;

  barData?: ChartData<"bar">;
  lineData?: ChartData<"line">;

  response?: Promise<ForecastResponse>;
  didFinish = false;
  data: ForecastResponse = [];

  ngOnInit(): void {
    this.response = new Promise<ForecastResponse>(resolve => {
      this.route.queryParams.subscribe(({resolution, selection}) => {
        if (!resolution || !selection) return;
        this.service.fetchForecastData(resolution, selection, ForecastType.LINEAR)
          .subscribe(resolve);
      });
    });

    this.barData = {
      labels: ["Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange"],
      datasets: [{
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)"
        ],
        borderWidth: 1
      }]
    };
    this.lineData = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July"],
      datasets: [{
        label: "My First Dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1
      }]
    }
  }

  ngAfterViewInit(): void {
    this.response?.then(data => {
      //this.pageLoader.nativeElement.classList.remove("is-active");
      this.didFinish = true;
      this.data = data;
      console.log(data);
    });
  }

}
