import {
  AsyncRaceApi,
  ApiPath,
  Car,
  WinnersRequestParams,
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

    this.loadPageContent();
  }

  private async loadPageContent(): Promise<void> {
    this.totalWinnersCount = await AsyncRaceApi.getWinnersTotalCount();
    this.title.innerText = `${TITLE_TEXT}(${this.totalWinnersCount})`;
    this.title.classList.add(CssClasses.WINNERS_TITLE);

    this.updateWinnersTable();
  }

  async updateWinnersTable(): Promise<void> {
    this.table.clearTable();
    const requestParams: WinnersRequestParams = {
      limit: ITEMS_PER_PAGE,
      page: this.currentPage,
    };
    const winners = await AsyncRaceApi.getWinners(requestParams);
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
                <td>${index}</td>
                <td>${carImg.outerHTML}</td>
                <td>${car.name}</td>
                <td>${winner.time}</td>
                <td>${winner.wins}</td>`;
          const newRow = this.table.getHtmlElement().insertRow();
          newRow.innerHTML = tableRowTemplate;
        }
      });
    }
  }
}
