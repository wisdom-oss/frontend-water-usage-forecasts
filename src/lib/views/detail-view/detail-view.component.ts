import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {takeWhile} from "rxjs";

enum DetailView {
  CONSUMER,
  WATER_RIGHT
}

@Component({
  selector: 'lib-detail-view',
  templateUrl: './detail-view.component.html'
})
export class DetailViewComponent implements OnInit, OnDestroy {

  DetailView = DetailView;
  selectedDetail?: DetailView;

  private alive = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeWhile(() => this.alive))
      .subscribe(({consumer, waterRight}) => {

        if (consumer) {
          this.selectedDetail = DetailView.CONSUMER;
          return;
        }

        if (waterRight) {
          this.selectedDetail = DetailView.WATER_RIGHT;
          return;
        }

        this.router
          .navigate(["."], {relativeTo: this.route})
          .catch(console.error);
      });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
