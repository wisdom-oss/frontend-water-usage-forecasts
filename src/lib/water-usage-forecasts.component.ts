import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {map, of, Observable} from "rxjs";
import {combineLatest, combineLatestWith} from "rxjs/operators";

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

  selectedView: "map-select" | "result-data" | "detail" = "map-select";

  private keys?: string[];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(combineLatestWith(this.route.firstChild?.url ?? of(null)))
      .pipe(map(([qp, url]) => Object.assign({}, qp, {url})))
      .subscribe(({key, url}) => {
        if (url && url.length && url[0].path === "detail") {
          this.selectedView = "detail";
          this.keys = undefined;
          return;
        }

        if (!key || !key.length) {
          // missing or invalid parameters, display the map selection
          this.selectedView = "map-select";
          this.keys = undefined;
          return;
        }

        this.keys = [key].flat();
        this.selectedView = "result-data";
      });
  }

}
