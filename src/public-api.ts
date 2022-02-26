/** Public API Surface of water-usage-forecasts. */

import {WisdomInterface} from "common";

import {
  WaterUsageForecastsComponent
} from "./lib/water-usage-forecasts.component";

/** Public interface for the wisdom core to inject this module. */
export const wisdomInterface: WisdomInterface = {
  path: "water-usage-forecasts",
  scopes: ["water-usage-forecasts"],
  entryComponent: WaterUsageForecastsComponent,
  translations: {
    de_DE: {
      "water-usage-forecasts": {
        "label": {
          "name": "Prognose"
        }
      }
    },
    en_US: {
      "water-usage-forecasts": {
        "label": {
          "name": "Prognosis"
        }
      }
    }
  }
}

export * from "./lib/water-usage-forecasts.service";
export * from "./lib/water-usage-forecasts.component";
export * from "./lib/water-usage-forecasts.module";
