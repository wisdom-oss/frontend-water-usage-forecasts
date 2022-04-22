import {HttpClient, HttpContext, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {USE_API_URL, USE_LOADER} from "common";
import {Observable} from "rxjs";

import {ForecastType} from "./forecast-type";
import {Router} from "@angular/router";
import {ForecastResponse} from "./forecast-response";

const API_URL = "water-usage-forecasts";

/**
 * Service to interact with server providing the data to display.
 */
@Injectable({
  providedIn: "root"
})
export class WaterUsageForecastsService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  fetchForecastData(
    spatialUnit: "districts" | "municipalities",
    district: string | string[],
    forecastModel: ForecastType,
    consumerGroup?:
      "businesses" |
      "households_and_small_businesses" |
      "farming_forestry_fishing_industry" |
      "public_institutions" |
      "all"
  ): Observable<ForecastResponse> {
    let url = this.router.parseUrl(`${API_URL}/${spatialUnit}/${forecastModel}`);
    if (consumerGroup) url.queryParams["consumerGroup"] = consumerGroup;
    url.queryParams["district"] = district;
    return this.http.get(url.toString(), {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
      responseType: "json",
      context: new HttpContext()
        .set(USE_API_URL, true)
        .set(USE_LOADER, "water-usage-forecasts.display.loading")
    }) as Observable<ForecastResponse>;
  }

}
