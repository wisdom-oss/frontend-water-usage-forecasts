import {ForecastType} from "./forecast-type";

export interface Forecast {
  name: string,
  consumerGroup: string;
  forecastType: ForecastType,
  forecastEquation: string,
  forecastScore: number,
  forecastedUsages: {
    startYear: number,
    endYear: number,
    usageAmounts: number[]
  },
  referenceUsages: {
    startYear: number,
    endYear: number,
    usageAmounts: number[]
  }
}

export interface ForecastError {
  consumerGroup: string;
  error: string;
  name: string;
}

/** Response from the service for the forecast. */
export interface ForecastResponse extends Array<Forecast | ForecastError> {}
