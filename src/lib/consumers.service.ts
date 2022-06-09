import { Injectable } from '@angular/core';
import {HttpClient, HttpContext, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {USE_API_URL, USE_LOADER} from "common";

const API_URL = "consumers/";

export type ConsumerLocationsResponse = {
  id: number,
  name: string,
  geojson: {
    crs: {
      type: "name",
      properties: {
        name: string
      }
    },
    type: "Point",
    coordinates: [number, number]
  }
}[];

@Injectable({
  providedIn: 'root'
})
export class ConsumersService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  fetchConsumers(params: Partial<{
    usageAbove: number,
    id: string[],
    in: string[]
  }>): Observable<ConsumerLocationsResponse> {
    let url = this.router.parseUrl(API_URL);
    if (params.in) url.queryParams["in"] = params.in;
    if (params.id) url.queryParams["id"] = params.id;
    if (params.usageAbove) url.queryParams["usage_above"] = params.usageAbove;
    return this.http.get(url.toString(), {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
      responseType: "json",
      context: new HttpContext()
        .set(USE_API_URL, true)
        .set(USE_LOADER, true)
    }) as Observable<ConsumerLocationsResponse>;
  }
}
