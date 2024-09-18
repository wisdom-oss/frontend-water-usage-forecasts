import {Component, Input} from "@angular/core";

import {
  ForecastType as ProphetForecastType
} from "../../../../services/old/prophet-forecast.service";
import {
  ForecastType as WaterUsageForecastType
} from "../../../../services/old/water-usage-forecasts.service";

enum ForecastService {
  WATER_USAGE,
  PROPHET
}

@Component({
  selector: '[lib-result-data]',
  templateUrl: './result-data.component.html'
})
export class ResultDataComponent {

  @Input("key")
  key!: string | string[];

  @Input("method")
  set method(method: WaterUsageForecastType | ProphetForecastType) {
    switch (method) {
      case WaterUsageForecastType.LINEAR:
      case WaterUsageForecastType.POLYNOMIAL:
      case WaterUsageForecastType.LOGARITHMIC:
        this.service = ForecastService.WATER_USAGE;
        break;
      case ProphetForecastType.PROPHET:
        this.service = ForecastService.PROPHET;
        break;
    }

    this._method = method;
  };

  @Input()
  mapKeyNames: Record<string, string> = {}

  get method() {
    return this._method;
  }

  private _method!: WaterUsageForecastType | ProphetForecastType;

  service?: ForecastService = undefined;
  ForecastService = ForecastService;

}
