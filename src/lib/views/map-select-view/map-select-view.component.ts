import {Component} from "@angular/core";
import {MapComponent} from "common";

@Component({
  selector: 'lib-map-select-view',
  templateUrl: './map-select-view.component.html'
})
export class MapSelectViewComponent {

  // imported resolution from the map component
  Resolution = MapComponent.Resolution;

  keys?: string[];

  selectionReady = false;

  mapSelection(
    selection: {keys: string[]}
  ) {
    this.keys = selection.keys;
    this.selectionReady = !!selection.keys.length;
  }

}
