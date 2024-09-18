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
import {
  ResultDataViewComponent
} from "./views/old/result-data-view/result-data-view.component";
import {
  ResultDataComponent
} from "./views/old/result-data-view/result-data/result-data.component";
import {
  ProphetForecastResultDataComponent
}
  from "./views/old/result-data-view/result-data/prophet-forecast-result-data/prophet-forecast-result-data.component";
import {
  WaterUsageForecastsResultDataComponent
}
  from "./views/old/result-data-view/result-data/water-usage-forecasts-result-data/water-usage-forecasts-result-data.component";
import { MockupComponent } from './views/old/result-data-view/mockup/mockup.component';
import { SelectToggleControlComponent } from './views/map-select-view/select-toggle-control/select-toggle-control.component';

@NgModule({
  declarations: [
    MapSelectViewComponent,
    ResultDataViewComponent,
    ConsumerDetailComponent,
    WaterRightDetailComponent,
    ResultDataComponent,
    WaterUsageForecastsResultDataComponent,
    ProphetForecastResultDataComponent,
    MockupComponent,
    SelectToggleControlComponent
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
