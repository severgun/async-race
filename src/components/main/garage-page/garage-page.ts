import "./garage-page.css";
import CarEditControls from "./car-edit-controls/car-edit-controls";
import PaginationControls from "../pagination-controls/pagination-controls";
import GarageControls from "./garage-controls/garage-controls";
import { AsyncRaceApi, Car } from "../../../app/async-race-api";
import RaceLane from "../race-lane/race-lane";

enum CssClasses {
  GARAGE_PAGE = "garage-page",
  GARAGE_PAGE_TITLE = "garage-page__title",
  RACE_LANE_CONTAINER = "race-lane-container",
}

const TITLE_TEXT = "Garage";

export default class GaragePage {
  private element;

  private carEditControls;

  private garageControls;

  private title;

  private paginationControls;

  private raceLanesContainer;

  private loadEventHandlerBound = this.loadEventHandler.bind(this);

  private updateGarageEventHandlerBound =
    this.updateGarageEventHandler.bind(this);

  constructor() {
    this.element = document.createElement("div");
    this.carEditControls = new CarEditControls();
    this.garageControls = new GarageControls();
    this.title = document.createElement("h2");
    this.paginationControls = new PaginationControls();
    this.raceLanesContainer = document.createElement("div");

    this.configureElement();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  setSelectedCar(car: Car): void {
    this.carEditControls.setSelectedCar(car);
  }

  updateRaceLanesContainer(cars: Car[]): void {
    this.raceLanesContainer.replaceChildren();
    cars.forEach((car) => {
      const raceLane = new RaceLane(this, car);
      this.raceLanesContainer.append(raceLane.getHtmlElement());
    });
  }

  private configureElement(): void {
    this.element.classList.add(CssClasses.GARAGE_PAGE);

    this.title.innerText = TITLE_TEXT;
    this.title.classList.add(CssClasses.GARAGE_PAGE_TITLE);

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
  }

  private async loadEventHandler(event: Event): Promise<void> {
    if (event.target === this.getHtmlElement()) {
      const cars = await AsyncRaceApi.getCars();
      this.updateRaceLanesContainer(cars);
      console.log("garage loadEventHandler", event, cars);
    }
  }

  private async updateGarageEventHandler(event: Event): Promise<void> {
    const cars = await AsyncRaceApi.getCars();
    this.updateRaceLanesContainer(cars);
    console.log("garage updateGarageEventHandler", event, cars);
  }
}
