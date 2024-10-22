import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, combineLatest, firstValueFrom } from 'rxjs';
import { AvailableAlgorithm, ConsumerGroup, NumPyResult, ProphetResult, UsageForecastService } from '../../services/usage-forecast.service';
import { LayoutService, LoaderInjector, ManualPromise, ResizeDirective } from 'common';
import { ChartDataset, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

type RgbaColor = [number, number, number, number];
const HISTORIC_DATA_COLOR: RgbaColor = [62, 120, 178, 0.4] as RgbaColor;
const FORECAST_DATA_COLOR: RgbaColor = [238, 66, 102, 0.4] as RgbaColor;
const HIGHLIGHT_DATA_COLOR: RgbaColor = [74, 82, 90, 0.4] as RgbaColor;

const HISTORIC_RGBA: string = rgbaToString(HISTORIC_DATA_COLOR);
const FORECAST_RGBA: string = rgbaToString(FORECAST_DATA_COLOR);
const HIGHLIGHT_RGBA: string = rgbaToString(HIGHLIGHT_DATA_COLOR);

const HISTORIC_HOVER_RGBA: string = rgbaToString(HISTORIC_DATA_COLOR.with(3, 1.0) as RgbaColor);
const FORECAST_HOVER_RGBA: string = rgbaToString(FORECAST_DATA_COLOR.with(3, 1.0) as RgbaColor);
const HIGHLIGHT_HOVER_RGBA: string = rgbaToString(HIGHLIGHT_DATA_COLOR.with(3, 1.0) as RgbaColor);

function rgbaToString(color: RgbaColor): string {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
}

@Component({
  selector: 'lib-result-data-view',
  templateUrl: './result-data-view.component.html'
})
export class ResultDataViewComponent implements OnInit, AfterViewInit {
  datasets: ChartDataset<"bar", {x: string, y: number}[]>[] = [{
    label: 'Sales 2023',
    data: [{x: 'Sales', y: 20}, {x: 'Revenue', y: 10}],
    backgroundColor: 'rgba(255, 99, 132, 0.2)',  // Red
    borderColor: 'rgba(255, 99, 132, 1)',
    borderWidth: 1
  }];

  options: ChartOptions<"bar"> = {
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Year"
        },
        grid: {
          display: false,
        }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Water Usage [m³]"
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      }
    }
  }
  
  @ViewChild(BaseChartDirective) chartCanvas?: BaseChartDirective;

  algorithms: AvailableAlgorithm[] = [];
  algorithm?: AvailableAlgorithm;
  parameters: Record<string, any> = {};

  private keys: string[] = [];
  private consumerGroups: ConsumerGroup[] = [];

  private subscriptions: Subscription[] = [];

  columnsHeight = "80vh";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: UsageForecastService,
    private loader: LoaderInjector,
    private layoutService: LayoutService,
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

  ngAfterViewInit(): void {
    this.fitColumns();
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
      function isForecast(ctx: any): boolean {
        let realUntil = forecast.meta['real-data-until'][current.label];
        let x = +((ctx.raw as {x: string, y: number}).x);
        return x > realUntil;
      }
      
      if (!datasets[current.label]) {
        datasets[current.label] = {
          backgroundColor(ctx) {
            if (isForecast(ctx)) return FORECAST_RGBA;
            return HISTORIC_RGBA;
          },
          hoverBackgroundColor(ctx, options) {
            if (isForecast(ctx)) return FORECAST_HOVER_RGBA;
            return HISTORIC_HOVER_RGBA;
            
          },
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

  private fitColumns() {
    this.subscriptions.push(this.layoutService.layout.subscribe(({main}) => {
      if (!main) return;
      let pads = 2 * 0.75 * this.layoutService.rem;
      this.columnsHeight = (main.height - pads) + "px";
      this.chartCanvas?.chart?.resize(100, 100);
      this.chartCanvas?.chart?.resize();
    }));
  }
}
