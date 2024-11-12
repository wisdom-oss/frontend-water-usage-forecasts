import * as L from "leaflet";
import { Component } from '@angular/core';
import { Map2Control, SelectableGeoJSON } from 'common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'lib-select-toggle-control',
  templateUrl: './select-toggle-control.component.html',
  styleUrl: './select-toggle-control.component.scss'
})
export class SelectToggleControlComponent implements Map2Control {

  private layerGroup?: L.LayerGroup;

  private isVisibleSubject = new BehaviorSubject(true);
  isVisible = this.isVisibleSubject.asObservable();

  controlInit({show = true}, layerGroup: L.LayerGroup) {
    this.isVisibleSubject.next(show);
    this.layerGroup = layerGroup;
  }

  toggleSelection() {
    // the getLayers() method is not precise enough typed
    for (let layer of this.layerGroup!.getLayers() as SelectableGeoJSON[]) {
      layer.toggle();
    }
  }

  onLayerAdd() {
    this.isVisibleSubject.next(true);
  }

  onLayerRemove() {
    this.isVisibleSubject.next(false);
  }

}
