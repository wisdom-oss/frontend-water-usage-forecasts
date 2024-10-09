import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AvailableAlgorithm, ConsumerGroup, NumPyResult, ProphetResult, UsageForecastService } from '../../services/usage-forecast.service';
import { LoaderInjector, ManualPromise } from 'common';
import { ChartDataset } from 'chart.js';

@Component({
  selector: 'lib-result-data-view',
  templateUrl: './result-data-view.component.html'
})
export class ResultDataViewComponent implements OnInit {
  console = console;

  datasets: ChartDataset<"bar", {x: string, y: number}[]>[] = [{
    label: 'Sales 2023',
    data: [{x: 'Sales', y: 20}, {x: 'Revenue', y: 10}],
    backgroundColor: 'rgba(255, 99, 132, 0.2)',  // Red
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 1
  }];

  algorithms: AvailableAlgorithm[] = [];
  algorithm?: AvailableAlgorithm;
  parameters: Record<string, any> = {};

  private keys: string[] = [];
  private consumerGroups: ConsumerGroup[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: UsageForecastService,
    private loader: LoaderInjector,
  ) {}

  async ngOnInit(): Promise<void> {
    let loading = new ManualPromise();
    this.loader.addLoader(loading);
    
    this.algorithms = await this.service.fetchAvailableAlgorithms();
    
    let queryParamMap = await firstValueFrom(this.route.queryParamMap);
    this.keys = queryParamMap.getAll("key"); // ensured by QueryParamterGuard
    this.consumerGroups = queryParamMap.getAll("consumer-group") as ConsumerGroup[];
    this.parameters = JSON.parse(queryParamMap.get("params") || "{}");
    
    let algorithmIdentifier = queryParamMap.get("algorithm") || this.algorithms[0]!.identifier;
    this.algorithm = this.algorithms.find(algo => algo.identifier == algorithmIdentifier);
    if (!this.algorithm) throw new Error("unknown algorithm");
    await this.fetchForecast();

    loading.resolve();
  }

  async fetchForecast() {
    if (!this.algorithm) return;

    let queryParams: Record<string, string | string[] | null> = {
      key: this.keys,
      algorithm: this.algorithm.identifier,
      consumerGroups: this.consumerGroups,
      params: null
    };
    if (Object.values(this.parameters).length) {
      queryParams["params"] = JSON.stringify(this.parameters);
    }
    this.router.navigate([], {queryParams});

    let forecast = await this.service.fetchForecast(
      this.algorithm.identifier, 
      this.keys, 
      this.consumerGroups, 
      this.parameters
    );
    console.log(forecast.meta);

    this.datasets = Object.values(forecast.data.reduce((datasets: Record<string, this["datasets"][0]>, current) => {
      if (!datasets[current.label]) {
        datasets[current.label] = {
          label: current.label,
          data: []
        };
      }

      datasets[current.label].data.push({
        x: "" + current.x,
        y: current.y
      });

      return datasets;
    }, {}));
  }
}
