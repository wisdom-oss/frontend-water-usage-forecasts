import {ViewChild, Component, OnInit, AfterViewInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ChartData} from "chart.js/auto";
import {MapComponent, Marker, BreadcrumbsService} from "common";
import {BehaviorSubject} from "rxjs";

import {
  ConsumerLocationsResponse,
  ConsumersService
} from "../../../services/consumers.service";
import {
  HistoryResponse,
  WaterUsageHistoryService
} from "../../../services/water-usage-history.service";
import {consumerIcon} from "../../../map-icons";

@Component({
  selector: 'lib-consumer-detail',
  templateUrl: './consumer-detail.component.html'
})
export class ConsumerDetailComponent implements OnInit, AfterViewInit {

  name: string = "";
  id: string = "";
  historyData: HistoryResponse = [];
  marker?: Marker;
  private coordinates: BehaviorSubject<[number, number]> =
    new BehaviorSubject([NaN, NaN]);
  chartData?: ChartData<"bar">;
  recordedAt: string = "";

  @ViewChild("map") mapComponent!: MapComponent;

  constructor(
    private route: ActivatedRoute,
    private cService: ConsumersService,
    private hService: WaterUsageHistoryService,
    private breadcrumbs: BreadcrumbsService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params["consumer"];
    this.cService.fetchConsumers({id: [this.id]})
      .subscribe(data => this.handleConsumerData(data ?? []));
    this.hService.fetchWaterUsageHistory(this.id)
      .subscribe(data => {
        this.chartData = {
          datasets: [{
            data: data.map(({usage}) => usage),
            backgroundColor: "blue"
          }],
          labels: data.map(({year}) => year)
        };
        this.recordedAt = data[data.length - 1].recordedAt.toISOString().substring(0, 10);
      });
  }

  handleConsumerData(data: ConsumerLocationsResponse) {
    for (let {id, name, geojson} of data) {
      this.name = name;
      this.breadcrumbs.set(2, {
        text: name,
        link: "#"
      });
      let coordinates = [geojson.coordinates[1], geojson.coordinates[0]] as [number, number];
      this.marker = {
        coordinates,
        tooltip: name,
        icon: consumerIcon
      }
      this.coordinates.next(coordinates);
    }
  }

  ngAfterViewInit(): void {
    this.coordinates.subscribe(coordinates => {
      if (coordinates[0] && coordinates[1]) this.mapComponent.map!.flyTo(coordinates);
    });
  }

}
