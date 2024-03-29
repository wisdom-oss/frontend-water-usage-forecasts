import {HttpClient, HttpContext, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {USE_API_URL, USE_LOADER} from "common";
import {Observable} from "rxjs";

const API_URL = "prophet-forecast/";

/** Possible forecast calculation methods. */
export enum ForecastType {
  PROPHET = "prophet"
}

export interface Datapoint {
  ds: string,
  lower: number,
  forecast: number,
  upper: number
}

export interface ForecastResponse {
  lowMigrationPrognosis: Datapoint[],
  mediumMigrationPrognosis: Datapoint[],
  highMigrationPrognosis: Datapoint[]
}

@Injectable({
  providedIn: 'root'
})
export class ProphetForecastService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  fetchForecastData(key: string): Observable<ForecastResponse> {
    let url = this.router.parseUrl(API_URL);
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
