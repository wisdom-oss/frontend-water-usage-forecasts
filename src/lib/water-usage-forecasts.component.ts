import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

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

  selectedView: "map-select" | "result-data" = "map-select";

  private resolution?: string;
  private selection?: string[];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // check for query parameters, upon change extract them and display correct
    // view
    this.route.queryParams.subscribe(({resolution, selection}) => {
      if (!(resolution && selection) || Array.isArray(resolution) || !selection.length) {
        // missing or invalid parameters, display the map selection
        this.selectedView = "map-select";
        this.resolution = undefined;
        this.selection = undefined;
        return;
      }

      this.resolution = resolution;
      this.selection = [selection].flat();
      this.selectedView = "result-data";
    });
  }

}
