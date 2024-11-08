import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { USE_API_URL, USE_CACHE, USE_LOADER } from 'common';
import { firstValueFrom } from 'rxjs';

const API_URL = "geodata";

export interface Identified {
  [key: string]: {
    [key: string]: {
      id: number,
      name: string,
      key: string,
      additionalProperties: Record<any, any>,
      geometry: GeoJSON.GeoJSON,
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class GeoDataService {

  constructor(private http: HttpClient) {}

  async identify(keys: Iterable<string>): Promise<Identified> {
    let params = new HttpParams();
    return firstValueFrom(this.http.get<Identified>(`${API_URL}/identify`, {
      params: {"key": Array.from(keys)},
      context: new HttpContext()
        .set(USE_API_URL, true)
        .set(USE_LOADER, "Identifying Geo Data...")
    }));
  }
}
