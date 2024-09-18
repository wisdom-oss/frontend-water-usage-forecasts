import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { USE_API_URL, USE_LOADER } from 'common';
import { firstValueFrom } from 'rxjs';

const API_URL = "water-usage-forecasts";

export interface AvailableAlgorithm {
  identifier: string,
  description: string,
  parameters: Record<string, {
    defaultValue: any,
    description: string,
  }>
}

export type ConsumerGroup = "businesses" 
  | "households"
  | "small_businesses"
  | "agriculture_forestry_fisheries"
  | "public_institutions"
  | "standpipes"
  | "tourism"
  | "resellers"

export interface ProphetResult {
  meta: {
    rScores: Record<string, number>,
    realDataUntil: Record<any, number>,
  },
  data: {
    label: string,
    x: number,
    y: number,
    uncertainty: [number, number]
  }[]
}

export interface NumPyResult {
  meta: {
    rScores: Record<string, number>,
    realDataUntil: Record<any, number>,
    curves: Record<any, string>,
  },
  data: {
    label: string,
    x: number,
    y: number,
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class UsageForecastService {

  constructor(private http: HttpClient) {}

  fetchAvailableAlgorithms(): Promise<AvailableAlgorithm[]> {
    return firstValueFrom(this.http.get(`${API_URL}/`, {
      context: new HttpContext()
        .set(USE_API_URL, true)
    })) as Promise<AvailableAlgorithm[]>;
  }

  fetchForecast(
    scriptIdentifier: string,
    key: string | string[], 
    consumerGroup?: null | ConsumerGroup | ConsumerGroup[],
    parameters?: null | Record<string, any>
  ): Promise<ProphetResult | NumPyResult> {
    let params = new HttpParams();
    for (let paramKey of [key].flat()) params.append("key", paramKey);
    for (let consumerGroupKey of [consumerGroup ?? []].flat()) {
      params.append("consumerGroup", consumerGroupKey);
    }

    let context = new HttpContext().set(USE_API_URL, true);
    
    if (parameters && Object.values(parameters).length) {
      let formData = new FormData();
      for (let [key, value] of Object.entries(parameters)) {
        formData.append(key, value);
      }

      return firstValueFrom(this.http.post(
        `${API_URL}/${scriptIdentifier}`, 
        formData, 
        { params, context }
      )) as Promise<ProphetResult | NumPyResult>;
    }

    return firstValueFrom(this.http.get(
      `${API_URL}/${scriptIdentifier}`,
      { params, context }
    )) as Promise<ProphetResult | NumPyResult>;
  }
}
