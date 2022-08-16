import {Component, OnInit} from "@angular/core";
import {Resolution, BreadcrumbsService, getResolvedUrl} from "common";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'lib-map-select-view',
  templateUrl: './map-select-view.component.html'
})
export class MapSelectViewComponent implements OnInit {

  // imported resolution from the map component
  Resolution = Resolution;

  keys?: string[];

  selectionReady = false;

  constructor(
    private breadcrumbs: BreadcrumbsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.breadcrumbs.set(0, {
      text: "Wasserverbrauchsprognose",
      link: "#"
    })
  }

  mapSelection(
    selection: {keys: string[]}
  ) {
    this.keys = selection.keys;
    this.selectionReady = !!selection.keys.length;
  }

}
