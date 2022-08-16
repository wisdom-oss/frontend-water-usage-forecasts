import {Route} from "@angular/router";
import {WaterUsageForecastsComponent} from "./water-usage-forecasts.component";
import {
  ResultDataViewComponent
} from "./views/result-data-view/result-data-view.component";
import {
  MapSelectViewComponent
} from "./views/map-select-view/map-select-view.component";
import {
  KeyQueryParameterGuard
} from "./views/result-data-view/key-query-parameter.guard";

export const route: Route = {
  path: "water-usage-forecasts",
  children: [
    {
      path: "",
      component: MapSelectViewComponent,
    },
    {
      path: "result",
      component: ResultDataViewComponent,
      canActivate: [KeyQueryParameterGuard]
    }
  ]
}
