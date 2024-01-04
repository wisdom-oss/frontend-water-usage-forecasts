import {HttpClient, HttpContext, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {USE_API_URL, USE_LOADER, USE_ERROR_HANDLER} from "common";
import {map, Observable} from "rxjs";

const API_URL = "water-rights/";

export type WaterRightLocationResponse = {
  name?: string,
  id?: number,
  waterRight: number,
  active?: boolean,
  real?: boolean,
  location?: {
    type: "Point",
    coordinates: [number, number]
  }
}[];

export type WaterRightDetailResponse = Partial<{
  id: number,
  no: number,
  externalId: string,
  fileReference: string,
  legalTitle: string,
  state: "aktiv" | "inaktiv" | "Wasserbuchblatt",
  subject: string,
  address: string,
  annotation: string,
  bailee: string,
  dateOfChange: Date,
  valid: {
    from: Date,
    until: Date
  },
  grantingAuthority: string,
  registeringAuthority: string,
  waterAuthority: string,
  locations: Partial<{
    id: number,
    name: string,
    no: number,
    active: boolean,
    location: {
      type: "Point",
      coordinates: [number, number]
    },
    basinNo: {
      key: string,
      name: string
    },
    county: string,
    euSurveyArea: {
      key: string,
      name: string
    },
    field: number,
    groundwaterVolume: string,
    legalScope: string,
    localSubDistrict: string,
    maintenanceAssociation: {
      key: string,
      name: string
    },
    municipalArea: {
      key: number,
      name: string
    },
    plot: string,
    real: boolean,
    rivershed: string,
    serialNo: string,
    topMap1to25000: {
      key: number,
      name: string
    },
    waterBody: string,
    floodArea: string,
    waterProtectionArea: string,
    withdrawalRates: {
      amount: number,
      unit: string,
      duration: string
    }[],
    fluidDischarge: {
      amount: number,
      unit: string,
      duration: string
    }[],
    irrigationArea: {
      amount: number,
      unit: string
    },
    rainSupplement: {
      amount: number,
      unit: string,
      duration: string,
    }
  }[]>
}>;

type WaterRightDetailRawResponse =
  Omit<WaterRightDetailResponse, "dateOfChange" | "valid"> &
  Partial<{
    dateOfChange: string,
    valid: {
      from: string,
      until: string
    }
  }>;

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
  }> = {}): Observable<WaterRightLocationResponse | null> {
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
        .set(USE_ERROR_HANDLER, USE_ERROR_HANDLER.handler.TOAST)
    });
  }

  fetchWaterRightDetails(no: number): Observable<WaterRightDetailResponse> {
    let url = this.router.createUrlTree([API_URL, "details", no]);
    return this.http.get<WaterRightDetailRawResponse>(url.toString(), {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
      responseType: "json",
      context: new HttpContext()
        .set(USE_API_URL, true)
        .set(USE_LOADER, true)
    }).pipe(map((res: WaterRightDetailRawResponse) => {
      let cleaned = JSON.stringify(res)
        .replace(/"\s*([^"]+)\s*"/g, '"$1"')
        .replace(/'\s*([^']+)\s*'/g, "'$1'")
        .replace(/"'([^'"\s:,]+)'"/g, '"$1"')
        .replace(/'"([^'"\s:,]+)"'/g, "'$1'")
      return JSON.parse(cleaned) as WaterRightDetailRawResponse;
    })).pipe(map((raw: WaterRightDetailRawResponse) => {
      let res = JSON.parse(JSON.stringify(raw)) as WaterRightDetailResponse;
      if (raw.dateOfChange) res.dateOfChange = new Date(raw.dateOfChange);
      if (raw.valid) res.valid = {
        from: new Date(raw.valid.from),
        until: new Date(raw.valid.until)
      };
      return res;
    }));
  }
}
