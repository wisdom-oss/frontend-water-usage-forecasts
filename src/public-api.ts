/** Public API Surface of water-usage-forecasts. */

import {WisdomInterface} from "common";

import de_DE from "./i18n/de_DE";
import en_US from "./i18n/en_US";
import {
  WaterUsageForecastsComponent
} from "./lib/water-usage-forecasts.component";

/** Public interface for the wisdom core to inject this module. */
export const wisdomInterface: WisdomInterface = {
  path: "water-usage-forecasts",
  scopes: ["water-usage-forecasts"],
  entryComponent: WaterUsageForecastsComponent,
  translations: {
    de_DE,
    en_US
  }
}

export * from "./lib/services/water-usage-forecasts.service";
export * from "./lib/water-usage-forecasts.component";
export * from "./lib/water-usage-forecasts.module";
