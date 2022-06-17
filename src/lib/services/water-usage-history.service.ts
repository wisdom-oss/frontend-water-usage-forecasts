import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient, HttpContext, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {USE_LOADER, USE_API_URL} from "common";

const API_URL = "water-usage-history/";

export type HistoryResponse = {
  year: number,
  usage: number,
  recordedAt: Date
}[];

@Injectable({
  providedIn: 'root'
})
export class WaterUsageHistoryService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  fetchWaterUsageHistory(id: string): Observable<HistoryResponse> {
    let url = this.router.parseUrl(API_URL);
    url.queryParams["consumer"] = id;
    return this.http.get<{year: number, usage: number, recorded_at: string}[]>(url.toString(), {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
      responseType: "json",
      context: new HttpContext()
        .set(USE_API_URL, true)
        .set(USE_LOADER, true)
    }).pipe(map(
      data => data.map(
        ({
           year,
           usage,
           recorded_at
        }) => ({
          year,
          usage,
          recordedAt: new Date(recorded_at)
        })
      )
    ))
  }
}
