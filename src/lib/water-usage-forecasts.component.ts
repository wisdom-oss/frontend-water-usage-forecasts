import {Component, OnInit, AfterViewInit} from "@angular/core";
import {Chart, ChartData} from "chart.js";

// TODO: doc this

/**
 * Component displaying the request interface as well as the data provided by
 * the server for the water usage forecasts.
 */
@Component({
  selector: "lib-water-usage-forecasts",
  templateUrl: "./water-usage-forecasts.component.html"
})
export class WaterUsageForecastsComponent implements OnInit {

  barData?: ChartData<"bar">;
  lineData?: ChartData<"line">;

  ngOnInit(): void {
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

}
