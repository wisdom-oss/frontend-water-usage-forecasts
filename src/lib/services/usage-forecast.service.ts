import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { USE_API_URL, USE_LOADER } from 'common';
import { firstValueFrom } from 'rxjs';

const API_URL = "water-usage-forecasts";

export interface AvailableAlgorithm {
  identifier: string,
  description: string,
  parameters: Record<string, {
    default: any,
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

  async fetchAvailableAlgorithms(): Promise<AvailableAlgorithm[]> {
    let algorithms = await firstValueFrom(this.http.get<AvailableAlgorithm[]>(
      `${API_URL}/`, 
      {
        context: new HttpContext()
          .set(USE_API_URL, true)
      }
    ));

    // ensure that "parameters" is set
    for (let algo of algorithms as any[]) {
      algo.parameters = algo.parameter;
      delete algo.parameter;
    }
    
    return algorithms;
  }

  fetchForecast(
    scriptIdentifier: string,
    key: string | string[], 
    consumerGroup?: null | ConsumerGroup | ConsumerGroup[],
    parameters?: null | Record<string, any>
  ): Promise<ProphetResult | NumPyResult> {
    let params = new HttpParams(); // remember, params operations are always copy
    for (let paramKey of [key].flat()) params = params.append("key", paramKey);
    for (let consumerGroupKey of [consumerGroup ?? []].flat()) {
      params = params.append("consumerGroup", consumerGroupKey);
    }

    let context = new HttpContext()
      .set(USE_API_URL, true)
      .set(USE_LOADER, "Calculating Forecast...");
    
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

    console.log(params);
    return firstValueFrom(this.http.get(
      `${API_URL}/${scriptIdentifier}`,
      { params, context }
    )) as Promise<ProphetResult | NumPyResult>;
  }
}
