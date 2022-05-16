export interface ForecastResponse {
  accumulations: {
    consumerGroup: ForecastEntry,
    municipal: ForecastEntry
  },
  partials: {
    consumerGroup: {
      key: string,
      name: string
    },
    municipal: ForecastResponse["partials"][0]["consumerGroup"],
    referenceUsages: {
      equation: string,
      float: number,
      model: "logarithmic" | "linear" | "polynomial",
      usages: {
        amounts: number[],
        end: number,
        start: number
      }
    },
    forecast: ForecastResponse["partials"][0]["referenceUsages"]
  }[]
}

export interface ForecastEntry {
  forecast: Record<string, ForecastUsage>,
  reference: Record<string, ForecastUsage>
}

export interface ForecastUsage {
  displayName: string,
  endYear: number,
  startYear: number,
  usages: number[]
}
