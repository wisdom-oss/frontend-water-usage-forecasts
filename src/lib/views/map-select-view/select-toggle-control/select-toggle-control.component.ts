import { Component } from '@angular/core';
import { Map2Control } from 'common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'lib-select-toggle-control',
  templateUrl: './select-toggle-control.component.html'
})
export class SelectToggleControlComponent implements Map2Control {

  private isVisibleSubject = new BehaviorSubject(true);
  isVisible = this.isVisibleSubject.asObservable();

  controlInit({show = true}) {
    this.isVisibleSubject.next(show);
  }

  onLayerAdd() { 
    this.isVisibleSubject.next(true);
  }

  onLayerRemove() {
    this.isVisibleSubject.next(false);
  }

}
