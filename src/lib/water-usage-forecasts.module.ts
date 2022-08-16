import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {WisdomModule} from "common";
import {NgChartsModule} from "ng2-charts";

import {
  ConsumerDetailComponent
} from "./views/detail-view/consumer-detail/consumer-detail.component";
import {
  MapSelectViewComponent
} from "./views/map-select-view/map-select-view.component";
import {
  ResultDataViewComponent
} from "./views/result-data-view/result-data-view.component";
import { WaterRightDetailComponent } from './views/detail-view/water-right-detail/water-right-detail.component';

@NgModule({
  declarations: [
    MapSelectViewComponent,
    ResultDataViewComponent,
    ConsumerDetailComponent,
    WaterRightDetailComponent
  ],
  imports: [
    WisdomModule,
    NgChartsModule,
    CommonModule,
    RouterModule,
    TranslateModule
  ]
})
export class WaterUsageForecastsModule { }
