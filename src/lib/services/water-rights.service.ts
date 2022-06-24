import {HttpClient, HttpContext, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {USE_API_URL, USE_LOADER} from "common";
import {map, Observable} from "rxjs";

const API_URL = "water-rights/";

export type WaterRightLocationResponse = {
  name: string,
  id: number,
  waterRight: number,
  active: boolean,
  real: boolean,
  geojson: {
    type: "Point",
    coordinates: [number, number]
  }
}[];

@Injectable({
  providedIn: 'root'
})
export class WaterRightsService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  fetchWaterRightLocations(params: Partial<{
    in: string[],
    isActive: boolean,
    isReal: boolean
  }>): Observable<WaterRightLocationResponse | null> {
    let url = this.router.parseUrl(API_URL);
    if (params.in) url.queryParams["in"] = params.in;
    if (params.isActive) url.queryParams["is_active"] = params.isActive;
    if (params.isReal) url.queryParams["is_real"] = params.isReal;
    return this.http.get<WaterRightLocationResponse>(url.toString(), {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
      responseType: "json",
      context: new HttpContext()
        .set(USE_API_URL, true)
        .set(USE_LOADER, true)
    }).pipe(map((
      res: any[]) => res.map(
        el => Object.assign({}, el, {waterRight: el.water_right})
      )
    ));
  }
}
