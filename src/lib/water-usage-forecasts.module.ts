import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {ChartModule, WisdomModule} from "common";

import {WaterUsageForecastsComponent} from "./water-usage-forecasts.component";

@NgModule({
  declarations: [
    WaterUsageForecastsComponent
  ],
  imports: [
    WisdomModule,
    ChartModule,
    CommonModule
  ],
  exports: [
    WaterUsageForecastsComponent
  ]
})
export class WaterUsageForecastsModule { }
