import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProphetForecastResultDataComponent } from './prophet-forecast-result-data.component';

describe('ProphetForecastResultDataComponent', () => {
  let component: ProphetForecastResultDataComponent;
  let fixture: ComponentFixture<ProphetForecastResultDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProphetForecastResultDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProphetForecastResultDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
