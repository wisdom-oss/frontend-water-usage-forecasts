import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {Resolution, BreadcrumbsService, LayoutService, ResizeDirective, LayerConfig, LayerId, LayerContent, Map2Component, ShapeKey} from "common";
import { BehaviorSubject, Subscription, combineLatest, map } from "rxjs";
import { SelectToggleControlComponent } from "./select-toggle-control/select-toggle-control.component";

@Component({
  selector: 'lib-map-select-view',
  templateUrl: './map-select-view.component.html'
})
export class MapSelectViewComponent implements OnInit, AfterViewInit, OnDestroy {

  LAYERS: LayerConfig.Input = [[
    {
      layer: "view_nds_districts", 
      showNames: true,
      select: true,
      control: [
        [SelectToggleControlComponent, "topright"]
      ]
    },
    {
      layer: "view_nds_municipals",
      showNames: true,
      select: true, 
      control: [
        [SelectToggleControlComponent, "topright", {show: false}]
      ]
    }
  ]];
  height = "500px";

  subscriptions: Subscription[] = [];

  @ViewChild(Map2Component) map?: Map2Component;
  private selectionSubject = new BehaviorSubject<ShapeKey[]>([]);
  selection = this.selectionSubject.asObservable();
  selectionReady = this.selection.pipe(map(list => !!list.length));

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
    
    let map = this.map!;
    this.subscriptions.push(combineLatest(
      [map.selectedLayers, map.visibleLayers]
    ).subscribe(([selectedLayers, visibleLayers]) => {
      let selection = [];
      for (let layerId of visibleLayers) {
        for (let content of selectedLayers[layerId] ?? []) {
          selection.push(content.key);
        }
      }
      this.selectionSubject.next(selection);
    }));
  }

  ngOnDestroy(): void {
    for (let sub of this.subscriptions) sub.unsubscribe();
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
