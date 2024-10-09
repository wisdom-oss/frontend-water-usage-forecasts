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
  WaterRightDetailComponent
} from "./views/detail-view/water-right-detail/water-right-detail.component";
import {
  MapSelectViewComponent
} from "./views/map-select-view/map-select-view.component";
import {ResultDataViewComponent} from "./views/result-data-view/result-data-view.component";
import { SelectToggleControlComponent } from './views/map-select-view/select-toggle-control/select-toggle-control.component';
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    MapSelectViewComponent,
    ResultDataViewComponent,
    ConsumerDetailComponent,
    WaterRightDetailComponent,
    SelectToggleControlComponent
  ],
  imports: [
    WisdomModule,
    NgChartsModule,
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule
  ]
})
export class WaterUsageForecastsModule { }
