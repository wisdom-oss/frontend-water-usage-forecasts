/** Public API Surface of water-usage-forecasts. */

import {WisdomInterface} from "common";

import de_DE from "./i18n/de_DE";
import en_US from "./i18n/en_US";
import {route} from "./lib/routing";

/** Public interface for the wisdom core to inject this module. */
export const wisdomInterface: WisdomInterface = {
  route,
  scopes: ["water-usage-forecasts"],
  translations: {
    de_DE,
    en_US
  }
}

export * from "./lib/services/old/consumers.service";
export * from "./lib/services/old/prophet-forecast.service";
export * from "./lib/services/old/water-rights.service";
export * from "./lib/services/old/water-usage-forecasts.service";
export * from "./lib/services/old/water-usage-history.service"

export {ForecastResponse, ForecastType} from "./lib/services/old/water-usage-forecasts.service";

export * from "./lib/water-usage-forecasts.module";
