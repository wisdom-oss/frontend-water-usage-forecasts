import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Resolution, BreadcrumbsService, LayoutService, ResizeDirective, LayerConfig} from "common";
import { Subscription, combineLatest } from "rxjs";

@Component({
  selector: 'lib-map-select-view',
  templateUrl: './map-select-view.component.html'
})
export class MapSelectViewComponent implements OnInit, AfterViewInit, OnDestroy {

  LAYERS: LayerConfig.Input = [[
    "view_nds_districts",
    "view_nds_municipals"
  ]];
  height = "500px";

  // imported resolution from the map component
  Resolution = Resolution;

  keys?: string[];

  selectionReady = false;

  subscriptions: Subscription[] = [];

  @ViewChild(ResizeDirective) buttonRow?: ResizeDirective;

  constructor(
    private breadcrumbs: BreadcrumbsService,
    private route: ActivatedRoute,
    private layoutService: LayoutService,
  ) {}

  ngOnInit(): void {
    this.breadcrumbs.set(0, {
      icon: "calendar",
      text: "water-usage-forecasts.breadcrumbs.water-consumption-prognosis",
      link: "/water-usage-forecasts"
    });
  }

  ngAfterViewInit(): void {
    this.fitMap();
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) sub.unsubscribe();
  }

  mapSelection(
    selection: {keys: string[]}
  ) {
    this.keys = selection.keys;
    this.selectionReady = !!selection.keys.length;
  }

  private fitMap() {
    this.subscriptions.push(combineLatest([
      this.layoutService.layout,
      this.buttonRow!.resize
    ]).subscribe(([{main}, buttonRow]) => {
      // this value is definitely not real
      if (buttonRow.height == 0) return;

      let pads = 4 * 0.75 * this.layoutService.rem;
      let restHeight = main!.height - (buttonRow.height + pads);
      this.height = restHeight + "px";
    }));
  }

}
