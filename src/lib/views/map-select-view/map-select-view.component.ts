import {Component} from "@angular/core";

@Component({
  selector: 'lib-map-select-view',
  templateUrl: './map-select-view.component.html'
})
export class MapSelectViewComponent {

  resolution?: string;

  keys?: string[];

  selectionReady = false;

  mapSelection(
    selection: {layerName: string, resolution: string, keys: string[]}
  ) {
    this.resolution = selection.resolution;
    this.keys = selection.keys;
    this.selectionReady = !!selection.keys.length;
  }

}
