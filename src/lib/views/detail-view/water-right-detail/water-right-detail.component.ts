import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  WaterRightDetailResponse,
  WaterRightsService
} from "../../../services/water-rights.service";
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject, takeWhile} from "rxjs";
import {Marker, tupleSwap, MapComponent} from "common";
import {Content, Layer, LeafletMouseEvent, Tooltip} from "leaflet";
import * as L from "leaflet";
import {waterRightIcon} from "../../../map-icons";

@Component({
  selector: 'lib-water-right-detail',
  templateUrl: './water-right-detail.component.html'
})
export class WaterRightDetailComponent implements OnInit, OnDestroy, AfterViewInit {

  private alive = true;

  data: WaterRightDetailResponse = {};
  markers: Marker[] = [];

  @ViewChild("map") map!: MapComponent;
  bounds: BehaviorSubject<[[number, number], [number, number]]> =
    new BehaviorSubject([[NaN, NaN], [NaN, NaN]]);

  constructor(
    private route: ActivatedRoute,
    private service: WaterRightsService
  ) { }

  ngAfterViewInit(): void {
    this.bounds.subscribe(bounds => this.map.map?.flyToBounds(bounds));
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeWhile(() => this.alive))
      .subscribe(({waterRight}) => {
        if (!waterRight) return;
        this.service.fetchWaterRightDetails(waterRight)
          .subscribe(data => {
            this.data = data;

            let bounds: [number[], number[]] = [[], []];
            let markers: Marker[] = [];
            for (let location of data.locations ?? []) {
              if (!location?.location) continue;
              if (!location.real) continue;
              let coordinates = tupleSwap(location.location.coordinates);
              bounds[0].push(coordinates[0]);
              bounds[1].push(coordinates[1]);
              markers.push({
                coordinates,
                tooltip: location.name,
                onClick: (evt: LeafletMouseEvent) => {
                  document.getElementById(`${location?.id}`)?.scrollIntoView({
                    behavior: "smooth"
                  })
                },
                icon: waterRightIcon
              });
            }
            this.markers = markers;
            this.bounds.next([
              [Math.max(...bounds[0]), Math.max(...bounds[1])],
              [Math.min(...bounds[0]), Math.min(...bounds[1])]
            ]);
          });
      })
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

}
