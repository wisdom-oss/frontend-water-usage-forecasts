import {HttpClient, HttpContext, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {USE_API_URL, USE_LOADER} from "common";
import {Observable} from "rxjs";

import {Router} from "@angular/router";

const API_URL = "water-usage-forecasts";

export enum ForecastType {
  LOGARITHMIC = "logarithmic",
  LINEAR = "linear",
  POLYNOMIAL = "polynomial"
}

export interface ForecastResponse {
  accumulations: {
    consumerGroup: ForecastEntry,
    municipal: ForecastEntry
  },
  partials: {
    consumerGroup: {
      key: string,
      name: string
    },
    municipal: ForecastResponse["partials"][0]["consumerGroup"],
    referenceUsages: {
      equation: string,
      float: number,
      model: "logarithmic" | "linear" | "polynomial",
      usages: {
        amounts: number[],
        end: number,
        start: number
      }
    },
    forecast: ForecastResponse["partials"][0]["referenceUsages"]
  }[]
}

export interface ForecastEntry {
  forecast: Record<string, ForecastUsage>,
  reference: Record<string, ForecastUsage>
}

export interface ForecastUsage {
  displayName: string,
  endYear: number,
  startYear: number,
  usages: number[]
}

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
    key: string | string[],
    forecastModel: ForecastType,
    consumerGroup?:
      "businesses" |
      "households_and_small_businesses" |
      "farming_forestry_fishing_industry" |
      "public_institutions" |
      "all"
  ): Observable<ForecastResponse> {
    let url = this.router.parseUrl(`${API_URL}/${forecastModel}`);
    if (consumerGroup) url.queryParams["consumerGroup"] = consumerGroup;
    url.queryParams["key"] = key;
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
