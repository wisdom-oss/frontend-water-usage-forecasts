import {Route} from "@angular/router";
import {
  ResultDataViewComponent
} from "./views/result-data-view/result-data-view.component";
import {
  MapSelectViewComponent
} from "./views/map-select-view/map-select-view.component";
import {QueryParameterGuard} from "common";
import {
  WaterRightDetailComponent
} from "./views/detail-view/water-right-detail/water-right-detail.component";
import {
  ConsumerDetailComponent
} from "./views/detail-view/consumer-detail/consumer-detail.component";

export const route: Route = {
  path: "water-usage-forecasts",
  children: [
    {
      path: "",
      component: MapSelectViewComponent,
    },
    {
      path: "results",
      component: ResultDataViewComponent,
      data: {
        redirectTo: "/water-usage-forecasts",
        queryParams: "key"
      },
      canActivate: [QueryParameterGuard]
    },
    {
      path: "detail",
      children: [
        {
          path: "",
          pathMatch: "full",
          redirectTo: "/water-usage-forecasts"
        },
        {
          path: "water-right/:waterRight",
          component: WaterRightDetailComponent
        },
        {
          path: "consumer/:consumer",
          component: ConsumerDetailComponent
        }
      ]
    },
    {
      path: "**",
      redirectTo: "/water-usage-forecasts"
    }
  ]
}
