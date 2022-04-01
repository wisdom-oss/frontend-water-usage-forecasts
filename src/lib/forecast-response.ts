import {ForecastType} from "./forecast-type";

/** Response from the service for the forecast. */
export interface ForecastResponse extends Array<{
  name: string,
  consumerGroup: string |
    "businesses" |
    "households_and_small_businesses" |
    "farming_forestry_fishing_industry" |
    "public_institutions";
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
}> {}
