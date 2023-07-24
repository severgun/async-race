import {
  AsyncRaceApi,
  ApiPath,
  Car,
  WinnersRequestParams,
  Winner,
} from "../../../app/async-race-api";
import PaginationControls from "../pagination-controls/pagination-controls";
import WinnersTable from "./winners-table/winners-table";
import carIcon from "../../../assets/tractor-side-view-svgrepo-com.svg";
import "./winners-page.css";

enum CssClasses {
  WINNERS_PAGE = "winners-page",
  WINNERS_TITLE = "winners__title",
  WINNERS_CAR_ICON = "winners__car-icon",
}
const TITLE_TEXT = "Winners";
const ITEMS_PER_PAGE = 10;

export default class WinnersPage {
  private element;

  private title;

  private paginationControls;

  private table;

  private currentPage;

  private totalWinnersCount: string | null;

  private currentPageChangedEventHandlerBound =
    this.currentPageChangedEventHandler.bind(this);

  constructor() {
    this.element = document.createElement("div");
    this.title = document.createElement("h2");
    this.paginationControls = new PaginationControls(
      ApiPath.WINNERS,
      ITEMS_PER_PAGE,
    );
    this.currentPage = 1;
    this.totalWinnersCount = "";
    this.table = new WinnersTable();

    this.configureElement();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  private configureElement(): void {
    this.element.classList.add(CssClasses.WINNERS_PAGE);

    this.element.append(
      this.title,
      this.paginationControls.getHtmlElement(),
      this.table.getHtmlElement(),
    );

    this.getHtmlElement().addEventListener(
      "currentPageChanged",
      this.currentPageChangedEventHandlerBound,
    );

    this.updateWinnersPageContent();
  }

  async updateWinnersPageContent(): Promise<void> {
    this.totalWinnersCount = await AsyncRaceApi.getWinnersTotalCount();
    this.title.innerText = `${TITLE_TEXT}(${this.totalWinnersCount})`;
    this.title.classList.add(CssClasses.WINNERS_TITLE);

    const requestParams: WinnersRequestParams = {
      limit: ITEMS_PER_PAGE,
      page: this.currentPage,
    };
    const winners = await AsyncRaceApi.getWinners(requestParams);
    this.updateWinnersTable(winners);
  }

  private async updateWinnersTable(winners: Winner[] | null): Promise<void> {
    this.table.clearTable();

    if (winners !== null) {
      const promises: Promise<Car | null>[] = [];
      winners.forEach((winner) => {
        promises.push(AsyncRaceApi.getCar(winner.id));
      });

      const cars = await Promise.all(promises);
      winners.forEach((winner, index) => {
        const car = cars[index];
        if (car !== null) {
          const carImg = document.createElement("div");
          carImg.classList.add(CssClasses.WINNERS_CAR_ICON);
          carImg.innerHTML = carIcon;
          carImg.style.fill = car.color;

          const tableRowTemplate = `
                <td>${index + 1}</td>
                <td>${carImg.outerHTML}</td>
                <td>${car.name}</td>
                <td>${winner.wins}</td>
                <td>${winner.time}</td>`;
          const newRow = this.table.getHtmlElement().insertRow();
          newRow.innerHTML = tableRowTemplate;
        }
      });
    }
  }

  private async currentPageChangedEventHandler(event: Event): Promise<void> {
    if (event instanceof CustomEvent) {
      this.currentPage = event.detail.currentPageNumValue;

      const requestParams: WinnersRequestParams = {
        limit: ITEMS_PER_PAGE,
        page: this.currentPage,
      };
      const winners = await AsyncRaceApi.getWinners(requestParams);
      AsyncRaceApi.getWinnersTotalCount();
      if (winners !== null) {
        this.updateWinnersTable(winners);
      }
    }
  }
}
