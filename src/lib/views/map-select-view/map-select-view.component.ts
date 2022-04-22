import {Component} from "@angular/core";

@Component({
  selector: 'lib-map-select-view',
  templateUrl: './map-select-view.component.html'
})
export class MapSelectViewComponent {

  resolution?: string;

  shapes?: string[];

  selectionReady = false;

  mapSelection(
    selection: {layerName: string, resolution: string, shapes: string[]}
  ) {
    this.resolution = selection.resolution;
    this.shapes = selection.shapes;
    this.selectionReady = !!selection.shapes.length;
  }

}
