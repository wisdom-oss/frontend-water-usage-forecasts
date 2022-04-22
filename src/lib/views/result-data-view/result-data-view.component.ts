import {Component, OnDestroy, OnInit} from "@angular/core";

import {ForecastType} from "../../forecast-type";
import {WaterUsageForecastsService} from "../../water-usage-forecasts.service";
import {ActivatedRoute} from "@angular/router";
import {Forecast, ForecastResponse} from "../../forecast-response";
import {takeWhile} from "rxjs";
import {stringToColor} from "common";

@Component({
  selector: 'lib-result-data-view',
  templateUrl: './result-data-view.component.html'
})
export class ResultDataViewComponent implements OnInit, OnDestroy {

  constructor(
    private service: WaterUsageForecastsService,
    private route: ActivatedRoute
  ) {}

  /** @internal just a re-export of the type */
  regressionMethod = ForecastType;
  method: ForecastType = ForecastType.LINEAR;

  response?: Promise<ForecastResponse>;
  didFinish = false;
  data: Forecast[] = [];

  consumerGroupData: any = null;
  consumerAreaData: any = null;
  areaNames: string[] = [];

  private subscribeQuery = true;

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeWhile(() => this.subscribeQuery))
      .subscribe(({resolution, selection}) => {
        if (!resolution || !selection) return;
        this.service.fetchForecastData(resolution, selection, ForecastType.LINEAR)
          .subscribe(data => {
            this.updateConsumerGroups(data);
            this.updateAreas(data);
          })
      })
  }

  ngOnDestroy(): void {
    this.subscribeQuery = false;
  }

  updateConsumerGroups(data: ForecastResponse): void {
    let references: Record<string, Record<string, number>> = {};
    let forecasted: Record<string, Record<string, number>> = {};
    let years: Set<string> = new Set();

    for (let dEntry of data) {
      if ("error" in dEntry) continue;

      if (!references[dEntry.consumerGroup])
        references[dEntry.consumerGroup] = {};
      if (!forecasted[dEntry.consumerGroup])
        forecasted[dEntry.consumerGroup] = {}

      for (let i = 0; i < dEntry.forecastedUsages.usageAmounts.length; i++) {
        let year = "" + (dEntry.forecastedUsages.startYear + i);
        years.add(year);
        if (forecasted[dEntry.consumerGroup][year]) {
          forecasted[dEntry.consumerGroup][year]
            += dEntry.forecastedUsages.usageAmounts[i];
        }
        else {
          forecasted[dEntry.consumerGroup][year] = dEntry.forecastedUsages.usageAmounts[i];
        }
      }

      for (let i = 0; i < dEntry.referenceUsages.usageAmounts.length; i++) {
        let year = "" + (dEntry.referenceUsages.startYear + i);
        years.add(year);
        if (references[dEntry.consumerGroup][year]) {
          references[dEntry.consumerGroup][year]
            += dEntry.referenceUsages.usageAmounts[i];
        }
        else {
          references[dEntry.consumerGroup][year] = dEntry.referenceUsages.usageAmounts[i];
        }
      }

    }

    let datasets = [];
    for (let [consumerGroup, data] of Object.entries(forecasted)) {
      datasets.push({
        label: consumerGroup,
        data,
        backgroundColor: stringToColor(consumerGroup),
        borderWidth: 1.5,
        borderSkipped: "middle",
        borderColor: "red"
      })
    }
    for (let [consumerGroup, data] of Object.entries(references)) {
      datasets.push({
        label: consumerGroup,
        data,
        backgroundColor: stringToColor(consumerGroup),
        borderWidth: 1.5,
        borderSkipped: "middle",
        borderColor: "blue"
      })
    }

    this.consumerGroupData = {
      labels: Array.from(years.values()).sort(),
      datasets
    };
  }

  updateAreas(data: ForecastResponse): void {
    let references: Record<string, Record<string, number>> = {};
    let forecasted: Record<string, Record<string, number>> = {};
    let years: Set<string> = new Set();

    for (let dEntry of data) {
      if ("error" in dEntry) continue;

      if (!references[dEntry.name])
        references[dEntry.name] = {};
      if (!forecasted[dEntry.name])
        forecasted[dEntry.name] = {}

      for (let i = 0; i < dEntry.forecastedUsages.usageAmounts.length; i++) {
        let year = "" + (dEntry.forecastedUsages.startYear + i);
        years.add(year);
        if (forecasted[dEntry.name][year]) {
          forecasted[dEntry.name][year]
            += dEntry.forecastedUsages.usageAmounts[i];
        }
        else {
          forecasted[dEntry.name][year] = dEntry.forecastedUsages.usageAmounts[i];
        }
      }

      for (let i = 0; i < dEntry.referenceUsages.usageAmounts.length; i++) {
        let year = "" + (dEntry.referenceUsages.startYear + i);
        years.add(year);
        if (references[dEntry.name][year]) {
          references[dEntry.name][year]
            += dEntry.referenceUsages.usageAmounts[i];
        }
        else {
          references[dEntry.name][year] = dEntry.referenceUsages.usageAmounts[i];
        }
      }

      let datasets = [];
      for (let [name, data] of Object.entries(forecasted)) {
        datasets.push({
          label: name,
          data,
          backgroundColor: stringToColor(name),
          borderWidth: 1.5,
          borderSkipped: "middle",
          borderColor: "red"
        })
      }
      for (let [name, data] of Object.entries(references)) {
        datasets.push({
          label: name,
          data,
          backgroundColor: stringToColor(name),
          borderWidth: 1.5,
          borderSkipped: "middle",
          borderColor: "blue"
        })
      }

      this.areaNames = Object.keys(references).sort();

      this.consumerAreaData = {
        labels: Array.from(years.values()).sort(),
        datasets
      };
    }
  }

}
