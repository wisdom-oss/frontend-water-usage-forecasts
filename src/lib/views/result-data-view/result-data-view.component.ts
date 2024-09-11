import {
  Component,
  DoCheck,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit
} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MapComponent, Resolution, BreadcrumbsService, MapService} from "common";
import {combineLatestWith} from "rxjs/operators";

import {
  ForecastType as ProphetForecastType
} from "../../services/prophet-forecast.service";
import {
  ForecastResponse,
  ForecastType as WaterUsageForecastType
} from "../../services/water-usage-forecasts.service";
import {WaterRightsService} from "../../services/water-rights.service";
import {ConsumersService} from "../../services/consumers.service";
import {consumerIcon, waterRightIcon} from "../../map-icons";

export type RegressionMethod = WaterUsageForecastType | ProphetForecastType;
export const RegressionMethod = {...WaterUsageForecastType, ...ProphetForecastType};

/** Component displaying the Results from the water right forecasts. */
@Component({
  selector: 'lib-result-data-view',
  templateUrl: './result-data-view.component.html'
})
export class ResultDataViewComponent implements OnInit, DoCheck {

  /**
   * Constructor.
   * @param waterRightService Service for water rights data
   * @param consumersService Service for consumer data
   * @param route Current route
   * @param router Router
   * @param mapService Service for map interactions
   * @param breadcrumbs Service to set breadcrumbs
   */
  constructor(
    private waterRightService: WaterRightsService,
    private consumersService: ConsumersService,
    private route: ActivatedRoute,
    private router: Router,
    private mapService: MapService,
    private breadcrumbs: BreadcrumbsService,
    private keyValueDiffers: KeyValueDiffers
  ) {}

  /**
   * Re-export of {@link Object}.
   * @internal
   */
  Object = Object;

  /**
   * Merged regression methods for {@link WaterRightsService} and
   * {@link ProphetForecastService}.
   *
   * Fully includes {@link ForecastType}.
   * @internal
   */
  regressionMethod = RegressionMethod;

  get regressionMethods() {
    return Object.values(this.regressionMethod);
  }

  /** The response from the forecast service. */
  response?: Promise<ForecastResponse>;
  /** Whether the request is done, used for the loader. */
  didFinish = false;

  /** Selected elements, used to display in info box. */
  selection: Record<Resolution, [string, string][]> = {
    state: [],
    district: [],
    administration: [],
    municipal: []
  };

  /** Differ to detect if {@link selection} changes. */
  private selectionDiffer!: KeyValueDiffer<string, any>;

  /**
   * Object entries of {@link selection}.
   * Will only be updated when {@link selection} has an update.
   *
   * This reduces unnecessary updates in the gui and allowing selecting
   * something of the selection.
   */
  selectionEntries = Object.entries(this.selection);

  /** Resolution for the map selection. */
  mapResolution: Resolution | null = null;

  /** Area components the results are based on. */
  areaComponents?: [string, string][];

  /** Array of all markers placed on the map. */
  markers: MapComponent["inputMarkers"] = [];

  /** The names of displayed shapes mapped by their keys. */
  mapKeyNames: Record<string, string> = {};

  /**
   * Set the forecast calculation method.
   * @param m Method for forecasting water usages
   */
  set method(m: RegressionMethod) {
    this.updateQueryParam("method", m);

    // update map resolution based on used method
    switch (m) {
      case ProphetForecastType.PROPHET:
        this.mapResolution = null;
        break;
      case WaterUsageForecastType.LINEAR:
      case WaterUsageForecastType.LOGARITHMIC:
      case WaterUsageForecastType.POLYNOMIAL:
        this.mapResolution = Resolution.MUNICIPAL;
        break;
    }
  }

  /** Get selected forecast calculation method. */
  get method() {
    return this.route.snapshot.queryParams["method"] ?? RegressionMethod.LINEAR;
  }

  /**
   * Set the area key.
   * @param k Key for the area.
   */
  set key(k: string | string[]) {
    this.updateQueryParam("key", k);
  }

  /** Get selected area keys. */
  get key(): string[] {
    return this.route.snapshot.queryParams["key"];
  }

  /** Call {@link this#fetchData}. */
  ngOnInit(): void {
    this.selectionDiffer = this.keyValueDiffers.find(this.selection).create();
    this.fetchData(this.key, this.method);
  }

  /** Update {@link selectionEntries} if {@link selection} changed. */
  ngDoCheck(): void {
    if (this.selectionDiffer.diff(this.selection)) {
      this.selectionEntries = Object.entries(this.selection);
    }
  }

  /**
   * Update a query parameter by requesting a router navigate.
   * @param name name of the parameter to update
   * @param value value of the parameter to update
   * @private
   */
  private updateQueryParam(name: string, value: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: Object.assign(
        {},
        this.route.snapshot.queryParams,
        Object.fromEntries([[name, value]])
      )
    }).catch(console.error);
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
  private fetchData(
    key: string | string[],
    method: RegressionMethod
  ): void {
    // TODO: split this into multiple subroutines
    // this.mapService.fetchLayerData(null, [key].flat())
    //   .then(data => {
    //     let selection: this["selection"] = {
    //       state: [],
    //       district: [],
    //       administration: [],
    //       municipal: []
    //     };
    //     for (let shape of data.shapes) {
    //       let res = Resolution.toEnum(shape.key.length);
    //       if (!res) continue;
    //       selection[res].push([shape.key, shape.name]);
    //     }
    //     this.selection = selection;
    //     this.setBreadCrumbs(key);
    //   });
    this.waterRightService.fetchWaterRightLocations({
        in: [key].flat(),
        isReal: true
      }
    ).pipe(combineLatestWith(this.consumersService.fetchConsumers({
      in: [key].flat(),
      // TODO: move this value elsewhere
      usageAbove: 10000
    }))).subscribe(data => {
      let markers = [];

      // iterate over locations of water rights
      for (let marker of data[0] ?? []) {
        if (!marker.location) continue;
        markers.push({
          coordinates: [
            // markers used here a calculated via location
            marker.location.coordinates[1],
            marker.location.coordinates[0]
          ] as [number, number],
          tooltip: `
            <b>Name</b>: ${marker.name}<br>
            <b>Water Right No</b>: ${marker.waterRight}
          `,
          icon: waterRightIcon,
          onClick: () => this.router.navigate(
            ["detail", "water-right", marker.waterRight],
            {relativeTo: this.route.parent}
          )
        });
      }

      // iterate over consumer locations
      for (let marker of data[1] ?? []) {
        markers.push({
          coordinates: [
            marker.location.coordinates[1],
            marker.location.coordinates[0]
          ] as [number, number],
          tooltip: marker.name,
          icon: consumerIcon,
          onClick: () => this.router.navigate(
            ["detail", "consumer", marker.id],
            {relativeTo: this.route.parent}
          )
        });
      }

      this.markers = markers;
    });
  }

  /**
   * Set breadcrumbs.
   *
   * This will set a generic breadcrumb text if more than one area was selected.
   * If only one area was selected the name of the selection will be set.
   * @param key Selected keys to create correct link
   * @private
   */
  private setBreadCrumbs(key: string | string[]) {
    let selected: any = [];
    for (let key of Object.keys(this.selection)) {
      for (let entry of this.selection[key as Resolution]) {
        selected.push([key, entry[1]]);
      }
    }
    let text: string | [string, string];
    if (selected.length > 1) text = "water-usage-forecasts.breadcrumbs.map-results";
    else text = ["common.map.resolution." + selected[0][0], selected[0][1]];

    this.breadcrumbs.set(1, {
      text,
      link: "/water-usage-forecasts/results",
      query: {key}
    });
  }
}
