import {HttpClient, HttpContext, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {USE_API_URL, USE_LOADER} from "common";
import {map, Observable} from "rxjs";

const API_URL = "usages/";

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
    let url = this.router.parseUrl(API_URL + "by-consumer/" + id);
    console.log(url.toString())
    return this.http.get<{date: number, amount: number, recordedAt: number}[]>(url.toString(), {
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
           date,
           amount,
           recordedAt
        }) => ({
          year: new Date(date*1000).getFullYear(),
          usage: amount,
          recordedAt: new Date(recordedAt*1000)
        })
      )
    ))
  }
}
