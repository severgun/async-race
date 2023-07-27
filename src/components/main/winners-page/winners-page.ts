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

enum SortFields {
  WINS = "wins",
  TIME = "time",
}

enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}
interface SortParams {
  field: SortFields;
  order: SortOrder;
}

export default class WinnersPage {
  private element;

  private title;

  private paginationControls;

  private table;

  private currentPage;

  private totalWinnersCount: string | null;

  private currentSort: SortParams | null;

  private currentPageChangedEventHandlerBound =
    this.currentPageChangedEventHandler.bind(this);

  private sortByWinsEventHandlerBound = this.sortByWinsEventHandler.bind(this);

  private sortByTimeEventHandlerBound = this.sortByTimeEventHandler.bind(this);

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
    this.currentSort = null;

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

    this.getHtmlElement().addEventListener(
      "sortByWins",
      this.sortByWinsEventHandlerBound,
    );

    this.getHtmlElement().addEventListener(
      "sortByTime",
      this.sortByTimeEventHandlerBound,
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

  private async sortByWinsEventHandler(): Promise<void> {
    let order = SortOrder.ASC;
    if (this.currentSort?.field === SortFields.WINS) {
      order =
        this.currentSort.order === SortOrder.ASC
          ? SortOrder.DESC
          : SortOrder.ASC;
    }

    this.currentSort = {
      field: SortFields.WINS,
      order,
    };
    const requestParams: WinnersRequestParams = {
      limit: ITEMS_PER_PAGE,
      page: this.currentPage,
      sort: SortFields.WINS,
      order,
    };
    const winners = await AsyncRaceApi.getWinners(requestParams);
    AsyncRaceApi.getWinnersTotalCount();
    if (winners !== null) {
      this.updateWinnersTable(winners);
    }
  }

  private async sortByTimeEventHandler(): Promise<void> {
    let order = SortOrder.ASC;
    if (this.currentSort?.field === SortFields.TIME) {
      order =
        this.currentSort.order === SortOrder.ASC
          ? SortOrder.DESC
          : SortOrder.ASC;
    }
    this.currentSort = {
      field: SortFields.TIME,
      order,
    };

    const requestParams: WinnersRequestParams = {
      limit: ITEMS_PER_PAGE,
      page: this.currentPage,
      sort: SortFields.TIME,
      order,
    };
    const winners = await AsyncRaceApi.getWinners(requestParams);
    AsyncRaceApi.getWinnersTotalCount();
    if (winners !== null) {
      this.updateWinnersTable(winners);
    }
  }
}
