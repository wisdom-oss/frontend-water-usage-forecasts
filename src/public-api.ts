/*
 * Public API Surface of water-usage-forecasts
 */

import {WisdomInterface} from "common";
import {
  WaterUsageForecastsComponent
} from "./lib/water-usage-forecasts.component";

export const wisdomInterface: WisdomInterface = {
  path: "water-usage-forecasts",
  scopes: ["water-usage-forecasts"],
  entryComponent: WaterUsageForecastsComponent,
  translations: {
    // empty for now
    de_DE: {},
    en_US: {}
  }
}

export * from './lib/water-usage-forecasts.service';
export * from './lib/water-usage-forecasts.component';
export * from './lib/water-usage-forecasts.module';
