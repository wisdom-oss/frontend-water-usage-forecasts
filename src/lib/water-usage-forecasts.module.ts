import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {ChartModule, WisdomModule} from "common";

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
    ChartModule,
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  exports: [
    WaterUsageForecastsComponent
  ]
})
export class WaterUsageForecastsModule { }
