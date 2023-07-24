import "./garage-page.css";
import CarEditControls from "./car-edit-controls/car-edit-controls";
import GarageControls from "./garage-controls/garage-controls";
import {
  ApiPath,
  AsyncRaceApi,
  Car,
  CarsRequestParams,
} from "../../../app/async-race-api";
import RaceLane from "../race-lane/race-lane";
import PaginationControls from "../pagination-controls/pagination-controls";

enum CssClasses {
  GARAGE_PAGE = "garage-page",
  GARAGE_PAGE_TITLE = "garage-page__title",
  RACE_LANE_CONTAINER = "race-lane-container",
}

const TITLE_TEXT = "Garage";
const ITEMS_PER_PAGE = 7;

export default class GaragePage {
  private element;

  private carEditControls;

  private garageControls;

  private title;

  private paginationControls;

  private raceLanesContainer;

  private currentPage;

  private raceLanesOnPage: RaceLane[];

  private totalCarsCount: string | null;

  private loadEventHandlerBound = this.loadEventHandler.bind(this);

  private updateGarageEventHandlerBound =
    this.updateGarageEventHandler.bind(this);

  private currentPageChangedEventHandlerBound =
    this.currentPageChangedEventHandler.bind(this);

  private startRaceGarageEventHandlerBound =
    this.startRaceGarageEventHandler.bind(this);

  private stopRaceGarageEventHandlerBound =
    this.stopRaceGarageEventHandler.bind(this);

  constructor() {
    this.element = document.createElement("div");
    this.carEditControls = new CarEditControls();
    this.garageControls = new GarageControls();
    this.title = document.createElement("h2");
    this.paginationControls = new PaginationControls(
      ApiPath.GARAGE,
      ITEMS_PER_PAGE,
    );
    this.raceLanesContainer = document.createElement("div");
    this.currentPage = 1;
    this.raceLanesOnPage = [];
    this.totalCarsCount = "";

    this.configureElement();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  updateRaceLanesContainer(cars: Car[]): void {
    this.raceLanesContainer.replaceChildren();
    this.raceLanesOnPage = [];
    cars.forEach((car) => {
      const raceLane = new RaceLane(car);
      this.raceLanesOnPage.push(raceLane);
      this.raceLanesContainer.append(raceLane.getHtmlElement());
    });
  }

  private configureElement(): void {
    this.element.classList.add(CssClasses.GARAGE_PAGE);

    this.raceLanesContainer.classList.add(CssClasses.RACE_LANE_CONTAINER);

    this.element.append(
      this.carEditControls.getHtmlElement(),
      this.garageControls.getHtmlElement(),
      this.title,
      this.paginationControls.getHtmlElement(),
      this.raceLanesContainer,
    );

    this.getHtmlElement().addEventListener(
      "DOMNodeInserted",
      this.loadEventHandlerBound,
    );

    this.getHtmlElement().addEventListener(
      "updateGarage",
      this.updateGarageEventHandlerBound,
    );

    this.getHtmlElement().addEventListener(
      "currentPageChanged",
      this.currentPageChangedEventHandlerBound,
    );

    this.getHtmlElement().addEventListener(
      "startRaceGarage",
      this.startRaceGarageEventHandlerBound,
    );

    this.getHtmlElement().addEventListener(
      "stopRaceGarage",
      this.stopRaceGarageEventHandlerBound,
    );
  }

  private async loadEventHandler(event: Event): Promise<void> {
    if (event.target === this.getHtmlElement()) {
      this.totalCarsCount = await AsyncRaceApi.getCarsTotalCount();
      this.title.innerText = `${TITLE_TEXT}(${this.totalCarsCount})`;
      this.title.classList.add(CssClasses.GARAGE_PAGE_TITLE);

      const requestParams: CarsRequestParams = {
        limit: ITEMS_PER_PAGE,
        page: this.currentPage,
      };
      const cars = await AsyncRaceApi.getCars(requestParams);
      if (cars !== null) {
        this.updateRaceLanesContainer(cars);
      }
    }
  }

  private async updateGarageEventHandler(event: Event): Promise<void> {
    this.totalCarsCount = await AsyncRaceApi.getCarsTotalCount();
    this.title.innerText = `${TITLE_TEXT}(${this.totalCarsCount})`;
    this.title.classList.add(CssClasses.GARAGE_PAGE_TITLE);

    const requestParams: CarsRequestParams = {
      limit: ITEMS_PER_PAGE,
      page: this.currentPage,
    };
    const cars = await AsyncRaceApi.getCars(requestParams);
    if (cars !== null) {
      this.updateRaceLanesContainer(cars);
    }
    console.log("garage updateGarageEventHandler", event, cars);
  }

  private async currentPageChangedEventHandler(event: Event): Promise<void> {
    if (event instanceof CustomEvent) {
      this.currentPage = event.detail.currentPageNumValue;

      const requestParams: CarsRequestParams = {
        limit: ITEMS_PER_PAGE,
        page: this.currentPage,
      };
      const cars = await AsyncRaceApi.getCars(requestParams);
      console.log("EVENT", event.detail, requestParams, cars);
      AsyncRaceApi.getCarsTotalCount();
      if (cars !== null) {
        this.updateRaceLanesContainer(cars);
      }
    }
  }

  private async startRaceGarageEventHandler(): Promise<void> {
    this.raceLanesOnPage.forEach((lane) => {
      lane.race();
    });
  }

  private async stopRaceGarageEventHandler(): Promise<void> {
    this.raceLanesOnPage.forEach((lane) => {
      lane.reset();
    });
  }
}
