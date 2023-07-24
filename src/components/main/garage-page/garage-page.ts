import "./garage-page.css";
import CarEditControls from "./car-edit-controls/car-edit-controls";
import GarageControls from "./garage-controls/garage-controls";
import {
  ApiPath,
  AsyncRaceApi,
  Car,
  CarsRequestParams,
} from "../../../app/async-race-api";
import { FinishedCar, RaceLane } from "../race-lane/race-lane";
import PaginationControls from "../pagination-controls/pagination-controls";
import WinnerPopup from "./winner-popup/winner-popup";

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

  private winnerPopup;

  private currentPage;

  private raceLanesOnPage: RaceLane[];

  private totalCarsCount: string | null;

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
    this.winnerPopup = new WinnerPopup();
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

    this.loadPageContent();

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

  private async loadPageContent(): Promise<void> {
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

  private async updateGarageEventHandler(): Promise<void> {
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

  private async currentPageChangedEventHandler(event: Event): Promise<void> {
    if (event instanceof CustomEvent) {
      this.currentPage = event.detail.currentPageNumValue;

      const requestParams: CarsRequestParams = {
        limit: ITEMS_PER_PAGE,
        page: this.currentPage,
      };
      const cars = await AsyncRaceApi.getCars(requestParams);
      AsyncRaceApi.getCarsTotalCount();
      if (cars !== null) {
        this.updateRaceLanesContainer(cars);
      }
    }
  }

  private async startRaceGarageEventHandler(): Promise<void> {
    this.garageControls.setDisableRaceButton(true);
    this.garageControls.setDisableResetButton(false);

    this.paginationControls.disableControls(true);

    const promises: Promise<FinishedCar | undefined>[] = [];
    this.raceLanesOnPage.forEach((lane) => {
      promises.push(lane.race());
    });

    Promise.any(promises)
      .then((winner) => {
        if (winner !== undefined) {
          this.setWinner(winner);
        }
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        console.log("All cars did not finish.");
      })
      .finally(() => {
        this.paginationControls.disableControls(false);
      });
  }

  private async stopRaceGarageEventHandler(): Promise<void> {
    this.garageControls.setDisableRaceButton(false);
    this.garageControls.setDisableResetButton(true);
    this.raceLanesOnPage.forEach((lane) => {
      lane.reset();
    });
  }

  private async setWinner(winner: FinishedCar): Promise<void> {
    const { car, time } = winner;
    const { id, color, name } = car;

    this.winnerPopup.showWinnerPopup(name, color);
    const winners = await AsyncRaceApi.getWinners();
    const recordInDb = winners?.find((element) => element.id === id);
    let wins = 1;
    const timeInSeconds = +(time / 1000).toFixed(2);
    if (recordInDb !== undefined) {
      wins = recordInDb.wins + 1;
      const recordTime =
        recordInDb.time < timeInSeconds ? recordInDb.time : timeInSeconds;
      AsyncRaceApi.updateWinner(id, { time: recordTime, wins });
    } else {
      AsyncRaceApi.createWinner({ id, time: timeInSeconds, wins });
    }
  }
}
