import {Component, Input, OnInit} from '@angular/core';
import type {ResultDataViewComponent} from "../result-data-view.component";
import {
  WaterRightDetailResponse,
  WaterRightsService
} from "../../../services/water-rights.service";

enum AgricultureClass {
  AnnualCropFarming = "Anbau einjähriger Pflanzen",
  PerennialCropFarming = "Anbau mehrjähriger Pflanzen",
  AnimalHusbandry = "Tierhaltung",
  MixedFarming = "Gemischte Landwirtschaft"
}

enum ManufacturingClass {
  FoodAndFeedProduction = "Herstellung von Nahrungs- und Futtermitteln",
  BeverageProduction = "Getränkeherstellung",
  ChemicalProductsManufacturing = "Herstellung von chemischen Erzeugnissen",
  PaperAndCardboardManufacturing = "Herstellung von Papier, Pappe und Waren daraus",
  EnergySupply = "Energieversorgung"
}

interface LargeCustomer<C> {
  name: string;
  district: string;
  municipality: string;
  class: C;
}

interface ResearchInstitution {
  name: string;
  district: string;
  municipality: string;
}

interface Clinic {
  name: string;
  waterConsumptionPerDay: number; // in Litern
  numberOfBeds: number;
}

@Component({
  selector: 'lib-mockup',
  templateUrl: './mockup.component.html'
})
export class MockupComponent implements OnInit {
  @Input("parent")
  resultDataViewComponent!: ResultDataViewComponent;

  // TODO: check, this is from mockup
  consumerGroups: [string, string][] = [
    ["Agriculture, Forestry, Fisheries", "sunny"],
    ["Businesses", "business"],
    ["Household", "home"],
    ["Public Institution", "library"],
    ["Small Businesses", "storefront"],
    ["Tourism", "ticket"]
  ];

  // TODO: check, this is from mockup
  detailConsumerGroup = this.consumerGroups[0];

  // TODO: check, this is from mockup
  eventSelection = Object.fromEntries(
    this.consumerGroups.map(([key, icon]) => [key, true])
  );

  detailHouseholdsSelection?: number = undefined;
  detailTourismSelection?: number = undefined;
  detailAgricultureSelection?: number = undefined;
  detailIndustrySelection?: number = undefined;
  detailPublicInstitutionSelection?: number = undefined;

  comparisonValues = {
    historicalConsumption: [
      {x: '2013', y: 4979.3},
      {x: '2014', y: 9809.5},
      {x: '2015', y: 14832.2},
      {x: '2016', y: 19972.8},
      {x: '2017', y: 24907.4},
      {x: '2018', y: 30102.9},
      {x: '2019', y: 35112.3},
      {x: '2020', y: 40305.6},
      {x: '2021', y: 45416.9},
      {x: '2022', y: 50606.4},
      {x: '2023', y: 55808.5}
    ],

    // Scenario 1 - Steady Growth
    scenario1: [
      {x: '2024', y: 57962.0},
      {x: '2025', y: 59121.6},
      {x: '2026', y: 60304.0},
      {x: '2027', y: 61509.1},
      {x: '2028', y: 62737.3},
      {x: '2029', y: 63988.8},
      {x: '2030', y: 65263.8},
      {x: '2031', y: 66562.7},
      {x: '2032', y: 67885.9},
      {x: '2033', y: 69233.6}
    ],

    // Scenario 2 - Fluctuating Growth
    scenario2: [
      {x: '2024', y: 58239.0},
      {x: '2025', y: 59929.5},
      {x: '2026', y: 61550.4},
      {x: '2027', y: 63496.2},
      {x: '2028', y: 65285.2},
      {x: '2029', y: 67336.6},
      {x: '2030', y: 69187.0},
      {x: '2031', y: 71429.1},
      {x: '2032', y: 73414.8},
      {x: '2033', y: 75739.4}
    ],

    // Scenario 3 - Decreasing Growth
    scenario3: [
      {x: '2024', y: 58407.4},
      {x: '2025', y: 59836.6},
      {x: '2026', y: 61011.8},
      {x: '2027', y: 61931.7},
      {x: '2028', y: 62595.2},
      {x: '2029', y: 63001.4},
      {x: '2030', y: 63149.4},
      {x: '2031', y: 63038.2},
      {x: '2032', y: 62666.9},
      {x: '2033', y: 62034.6}
    ],

    // Scenario 4 - Stagnant Growth
    scenario4: [
      {x: '2024', y: 58407.4},
      {x: '2025', y: 59836.6},
      {x: '2026', y: 61011.8},
      {x: '2027', y: 61931.7},
      {x: '2028', y: 62595.2},
      {x: '2029', y: 63001.4},
      {x: '2030', y: 63149.4},
      {x: '2031', y: 63038.2},
      {x: '2032', y: 62666.9},
      {x: '2033', y: 62034.6}
    ]
  };

  consumerGroupsPrognosisModelsExpanded = false;

  waterRights: WaterRightDetailResponse[] = [];

  agricultureCustomers: LargeCustomer<AgricultureClass>[] = [
    {
      name: "Bauerhof Müller",
      district: "Rosenheim",
      municipality: "Stephanskirchen",
      class: AgricultureClass.AnnualCropFarming
    },
    {
      name: "Grünland GmbH",
      district: "Traunstein",
      municipality: "Chieming",
      class: AgricultureClass.PerennialCropFarming
    },
    {
      name: "Tierwelt AG",
      district: "Miesbach",
      municipality: "Hausham",
      class: AgricultureClass.AnimalHusbandry
    },
    {
      name: "Naturhof Schmid",
      district: "Berchtesgadener Land",
      municipality: "Berchtesgaden",
      class: AgricultureClass.MixedFarming
    },
    {
      name: "Feldfrucht KG",
      district: "Rosenheim",
      municipality: "Bad Aibling",
      class: AgricultureClass.AnnualCropFarming
    },
    {
      name: "Bergbauernhof Alpen",
      district: "Traunstein",
      municipality: "Siegsdorf",
      class: AgricultureClass.PerennialCropFarming
    },
    {
      name: "EcoFarming Ltd.",
      district: "Mühldorf am Inn",
      municipality: "Ampfing",
      class: AgricultureClass.MixedFarming
    }
  ];

  manufacturingCustomers: LargeCustomer<ManufacturingClass>[] = [
    {
      name: "FoodPro GmbH",
      district: "München",
      municipality: "München",
      class: ManufacturingClass.FoodAndFeedProduction
    },
    {
      name: "Getränke König AG",
      district: "Leipzig",
      municipality: "Leipzig",
      class: ManufacturingClass.BeverageProduction
    },
    {
      name: "ChemTech Ltd.",
      district: "Dortmund",
      municipality: "Dortmund",
      class: ManufacturingClass.ChemicalProductsManufacturing
    },
    {
      name: "PapierWelt KG",
      district: "Stuttgart",
      municipality: "Stuttgart",
      class: ManufacturingClass.PaperAndCardboardManufacturing
    },
    {
      name: "EnergieNetz AG",
      district: "Hamburg",
      municipality: "Hamburg",
      class: ManufacturingClass.EnergySupply
    },
    {
      name: "BeveragePlus GmbH",
      district: "Frankfurt",
      municipality: "Frankfurt",
      class: ManufacturingClass.BeverageProduction
    },
    {
      name: "EcoPaper GmbH",
      district: "Berlin",
      municipality: "Berlin",
      class: ManufacturingClass.PaperAndCardboardManufacturing
    }
  ];

  researchInstitutions: ResearchInstitution[] = [
    { name: "Max-Planck-Institut für Astrophysik", district: "Garching", municipality: "München" },
    { name: "Deutsches Zentrum für Luft- und Raumfahrt", district: "Köln", municipality: "Köln" },
    { name: "Leibniz-Institut für Molekulare Pharmakologie", district: "Buch", municipality: "Berlin" },
    { name: "Fraunhofer-Institut für Solare Energiesysteme", district: "Freiburg", municipality: "Freiburg" },
    { name: "Helmholtz-Zentrum für Umweltforschung", district: "Leipzig", municipality: "Leipzig" },
    { name: "Institut für Weltwirtschaft", district: "Kiel", municipality: "Kiel" },
    { name: "Max-Planck-Institut für Informatik", district: "Saarbrücken", municipality: "Saarbrücken" }
  ];

  clinics: Clinic[] = [
    { name: "Universitätsklinikum Heidelberg", waterConsumptionPerDay: 50000, numberOfBeds: 1500 },
    { name: "Charité – Universitätsmedizin Berlin", waterConsumptionPerDay: 75000, numberOfBeds: 3000 },
    { name: "Klinikum Großhadern München", waterConsumptionPerDay: 40000, numberOfBeds: 2000 },
    { name: "Universitätsklinikum Hamburg-Eppendorf", waterConsumptionPerDay: 30000, numberOfBeds: 1400 },
    { name: "Universitätsklinikum Köln", waterConsumptionPerDay: 35000, numberOfBeds: 1500 },
    { name: "Universitätsklinikum Dresden", waterConsumptionPerDay: 25000, numberOfBeds: 1300 },
    { name: "Klinikum Stuttgart", waterConsumptionPerDay: 45000, numberOfBeds: 1800 }
  ];

  renderWithdrawalRates(rates?: {
    amount: number,
    unit: string,
    interval: string
  }[]) {
    let output = [];
    for (let {amount, unit, interval} of rates ?? []) {

      output.push(`${amount} ${unit}/${interval}`);
    }
    return output.join(", ");
  }

  constructor(private waterRightsService: WaterRightsService) {}

  ngOnInit(): void {
    this.waterRightsService.fetchWaterRightLocations({
      in: [this.resultDataViewComponent.key].flat(),
      isReal: true
    }).subscribe(data => {
      let waterRightSet = new Set((data ?? []).map(({waterRight}) => waterRight));
      let first50 = Array.from(waterRightSet.values()).sort().slice(0, 50);
      for (let wr of first50) {
        this
          .waterRightsService
          .fetchWaterRightDetails(wr)
          .subscribe(data => {
            if (data.locations?.some(location => location?.withdrawalRates?.length)) {
              this.waterRights.push(data);
            }
          });
      }
    });
  }
}
