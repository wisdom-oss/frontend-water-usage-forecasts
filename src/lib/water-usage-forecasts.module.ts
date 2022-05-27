import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {WisdomModule} from "common";
import {NgChartsModule} from "ng2-charts";

import {WaterUsageForecastsComponent} from "./water-usage-forecasts.component";
import {
  MapSelectViewComponent
} from "./views/map-select-view/map-select-view.component";
import {
  ResultDataViewComponent
} from "./views/result-data-view/result-data-view.component";

@NgModule({
  declarations: [
    WaterUsageForecastsComponent,
    MapSelectViewComponent,
    ResultDataViewComponent
  ],
  imports: [
    WisdomModule,
    NgChartsModule,
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  exports: [
    WaterUsageForecastsComponent
  ]
})
export class WaterUsageForecastsModule { }
