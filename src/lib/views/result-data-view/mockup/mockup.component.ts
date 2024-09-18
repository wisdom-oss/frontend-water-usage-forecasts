import {Component, Input, OnInit} from '@angular/core';
import type {ResultDataViewComponent} from "../result-data-view.component";
import {
  WaterRightDetailResponse,
  WaterRightsService
} from "../../../services/old/water-rights.service";

enum AgricultureClass {
  AnnualCropFarming = "Anbau einjähriger Pflanzen",
  PerennialCropFarming = "Anbau mehrjähriger Pflanzen",
  AnimalHusbandry = "Tierhaltung",
  MixedFarming = "Gemischte Landwirtschaft"
}

enum ManufacturingClass {
  logistic = "52.29 Erbringung von sonstigen Dienstleistungen für den Verkehr",
  FoodAndFeedProduction = "Herstellung von Nahrungs- und Futtermitteln",
  BeverageProduction = "Getränkeherstellung",
  ChemicalProductsManufacturing = "Herstellung von chemischen Erzeugnissen",
  PaperAndCardboardManufacturing = "Herstellung von Papier, Pappe und Waren daraus",
  EnergySupply = "Energieversorgung",
  Bathhouses = "96.04 Saunas, Solarien, Bäder u. Ä.",
  milk = "10.51 Milchverarbeitung (ohne Herstellung von Speiseeis)",
  nursingHome = "87.30.0 Altenheime; Alten- und Behindertenwohnheime",
  gas = "28.29.0 Herstellung von sonstigen nicht wirtschaftszweigspezifischen Maschinen"

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
      {"x": "2013", "y": 121424},
      {"x": "2014", "y": 122299},
      {"x": "2015", "y": 123174},
      {"x": "2016", "y": 124049},
      {"x": "2017", "y": 124924},
      {"x": "2018", "y": 125799},
      {"x": "2019", "y": 126674},
      {"x": "2020", "y": 127549},
      {"x": "2021", "y": 128424},
      {"x": "2022", "y": 129299},
      {"x": "2023", "y": 130174}
    ],

    // Scenario 1 - Steady Growth
    scenario1: [{"x": "2013", "y": 117577},{"x": "2014", "y": 120370},{"x": "2015", "y": 122345},{"x": "2016", "y": 124089},{"x": "2017", "y": 125892},{"x": "2018", "y": 126852},{"x": "2019", "y": 128319},{"x": "2020", "y": 131525},{"x": "2021", "y": 128490},{"x": "2022", "y": 134987},{"x": "2023", "y": 129478},{"x": "2024", "y": 135432},{"x": "2025", "y": 134421},{"x": "2026", "y": 137396},{"x": "2027", "y": 130534},{"x": "2028", "y": 137585},{"x": "2029", "y": 138469},{"x": "2030", "y": 131123},{"x": "2031", "y": 137983},{"x": "2032", "y": 136591},{"x": "2033", "y": 140943},{"x": "2034", "y": 133367},{"x": "2035", "y": 139813},{"x": "2036", "y": 136704},{"x": "2037", "y": 144481},{"x": "2038", "y": 140937},{"x": "2039", "y": 141524},{"x": "2040", "y": 143512},{"x": "2041", "y": 138544},{"x": "2042", "y": 141604},{"x": "2043", "y": 141295},{"x": "2044", "y": 145973},{"x": "2045", "y": 142258},{"x": "2046", "y": 146034},{"x": "2047", "y": 144542},{"x": "2048", "y": 148604},{"x": "2049", "y": 145525},{"x": "2050", "y": 145525}],

    // Scenario 2 - Fluctuating Growth
    scenario2: [{"x": "2013", "y": 116968},{"x": "2014", "y": 120213},{"x": "2015", "y": 121480},{"x": "2016", "y": 126301},{"x": "2017", "y": 124653},{"x": "2018", "y": 128430},{"x": "2019", "y": 129090},{"x": "2020", "y": 129513},{"x": "2021", "y": 134967},{"x": "2022", "y": 134670},{"x": "2023", "y": 133539},{"x": "2024", "y": 135133},{"x": "2025", "y": 137512},{"x": "2026", "y": 134623},{"x": "2027", "y": 134279},{"x": "2028", "y": 139877},{"x": "2029", "y": 133343},{"x": "2030", "y": 135075},{"x": "2031", "y": 138533},{"x": "2032", "y": 138074},{"x": "2033", "y": 140511},{"x": "2034", "y": 139735},{"x": "2035", "y": 136724},{"x": "2036", "y": 140059},{"x": "2037", "y": 142953},{"x": "2038", "y": 138075},{"x": "2039", "y": 141723},{"x": "2040", "y": 142331},{"x": "2041", "y": 144358},{"x": "2042", "y": 143476},{"x": "2043", "y": 145622},{"x": "2044", "y": 143261},{"x": "2045", "y": 146090},{"x": "2046", "y": 145474},{"x": "2047", "y": 149591},{"x": "2048", "y": 145538},{"x": "2049", "y": 147438},{"x": "2050", "y": 145122}]
    ,

    // Scenario 3 - Decreasing Growth
    scenario3: [{"x": "2013", "y": 118856}, {"x": "2014", "y": 123626}, {"x": "2015", "y": 120594}, {"x": "2016", "y": 124022}, {"x": "2017", "y": 122665}, {"x": "2018", "y": 127160}, {"x": "2019", "y": 127762}, {"x": "2020", "y": 133578}, {"x": "2021", "y": 129685}, {"x": "2022", "y": 129100}, {"x": "2023", "y": 130554}, {"x": "2024", "y": 131997}, {"x": "2025", "y": 138035}, {"x": "2026", "y": 133675}, {"x": "2027", "y": 137850}, {"x": "2028", "y": 140754}, {"x": "2029", "y": 137167}, {"x": "2030", "y": 135946}, {"x": "2031", "y": 133763}, {"x": "2032", "y": 139575}, {"x": "2033", "y": 142452}, {"x": "2034", "y": 140080}, {"x": "2035", "y": 138684}, {"x": "2036", "y": 135600}, {"x": "2037", "y": 136328}, {"x": "2038", "y": 138664}, {"x": "2039", "y": 136765}, {"x": "2040", "y": 144926}, {"x": "2041", "y": 142231}, {"x": "2042", "y": 145066}, {"x": "2043", "y": 142094}, {"x": "2044", "y": 146141}, {"x": "2045", "y": 145246}, {"x": "2046", "y": 146967}, {"x": "2047", "y": 147431}, {"x": "2048", "y": 148020}, {"x": "2049", "y": 148436}, {"x": "2050", "y": 145325}]
    ,

    // Scenario 4 - Stagnant Growth
    scenario4: [{"x": "2013", "y": 117724}, {"x": "2014", "y": 119327}, {"x": "2015", "y": 122673}, {"x": "2016", "y": 125496}, {"x": "2017", "y": 122647}, {"x": "2018", "y": 129082}, {"x": "2019", "y": 128727}, {"x": "2020", "y": 134324}, {"x": "2021", "y": 130281}, {"x": "2022", "y": 129497}, {"x": "2023", "y": 130594}, {"x": "2024", "y": 132853}, {"x": "2025", "y": 134617}, {"x": "2026", "y": 133523}, {"x": "2027", "y": 138026}, {"x": "2028", "y": 141773}, {"x": "2029", "y": 135610}, {"x": "2030", "y": 136947}, {"x": "2031", "y": 133755}, {"x": "2032", "y": 139775}, {"x": "2033", "y": 140437}, {"x": "2034", "y": 141932}, {"x": "2035", "y": 137986}, {"x": "2036", "y": 137656}, {"x": "2037", "y": 136345}, {"x": "2038", "y": 141967}, {"x": "2039", "y": 140634}, {"x": "2040", "y": 145473}, {"x": "2041", "y": "142474"}, {"x": "2042", "y": "145623"}, {"x": "2043", "y": "144566"}, {"x": "2044", "y": "144057"}, {"x": "2045", "y": "145746"}, {"x": "2046", "y": "147030"}, {"x": "2047", "y": "147018"}, {"x": "2048", "y": "147617"}, {"x": "2049", "y": "148081"}, {"x": "2050", "y": "145125"}]

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
      name: "Logistik GmbH & Co. KG",
      district: "Ammerland",
      municipality: "Rastede",
      class: ManufacturingClass.logistic
    },
    {
      name: "Hallenbad Rastede",
      district: "Ammerland",
      municipality: "Rastede",
      class: ManufacturingClass.Bathhouses
    },
    {
      name: "Heizungsbau",
      district: "Ammerland",
      municipality: "Dortmund",
      class: ManufacturingClass.gas
    },
    {
      name: "Altenwohnanlage Rastede",
      district: "Ammerland",
      municipality: "Rastede",
      class: ManufacturingClass.nursingHome
    },
    {
      name: "Swembad Wiefelstede",
      district: "Ammerland",
      municipality: "Wiefelstede",
      class: ManufacturingClass.Bathhouses
    },
    {
      name: "Molkerei eG",
      district: "Ammerland",
      municipality: "Rastede",
      class: ManufacturingClass.milk
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
