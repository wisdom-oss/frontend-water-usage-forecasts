import {Route} from "@angular/router";
import {QueryParameterGuard} from "common";

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
