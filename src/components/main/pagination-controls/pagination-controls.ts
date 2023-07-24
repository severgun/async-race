import { AsyncRaceApi, ApiPath } from "../../../app/async-race-api";
import { Button, ButtonParams } from "../button/button";
import "./pagination-controls.css";

enum CssClasses {
  PAGINATION_CONTROLS = "pagination-controls",
  PAGINATION_PREV_PAGE = "pagination-controls__prev",
  PAGINATION_NEXT_PAGE = "pagination-controls__next",
  PAGINATION_CURRENT_NUM = "pagination-controls__current",
}

export default class PaginationControls {
  private element;

  private prevPageButton;

  private nextPageButton;

  private currentPageNumElement;

  currentPageNumValue;

  private prevPageButtonHandlerBound = this.prevPageButtonHandler.bind(this);

  private nextPageButtonHandlerBound = this.nextPageButtonHandler.bind(this);

  private currentPageChangedEvent;

  private pageType;

  private itemsPerPage;

  constructor(
    pageType: ApiPath.GARAGE | ApiPath.WINNERS,
    itemsPerPage: number,
  ) {
    const prevPageButtonParams: ButtonParams = {
      cssClasses: [CssClasses.PAGINATION_PREV_PAGE],
      text: "<<",
      tooltip: "Previous Page",
      callBack: this.prevPageButtonHandlerBound,
    };
    const nextPageButtonParams: ButtonParams = {
      cssClasses: [CssClasses.PAGINATION_NEXT_PAGE],
      text: ">>",
      tooltip: "Next Page",
      callBack: this.nextPageButtonHandlerBound,
    };

    this.element = document.createElement("div");
    this.pageType = pageType;
    this.prevPageButton = new Button(prevPageButtonParams);
    this.nextPageButton = new Button(nextPageButtonParams);
    this.currentPageNumElement = document.createElement("p");
    this.currentPageNumValue = 1;
    this.itemsPerPage = itemsPerPage;

    this.currentPageChangedEvent = new CustomEvent("currentPageChanged", {
      bubbles: true,
      detail: this,
    });

    this.configureElement();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  disableControls(value: boolean): void {
    this.prevPageButton.getHtmlElement().disabled = value;
    this.nextPageButton.getHtmlElement().disabled = value;
  }

  private configureElement(): void {
    this.element.classList.add(CssClasses.PAGINATION_CONTROLS);
    this.currentPageNumElement.classList.add(CssClasses.PAGINATION_CURRENT_NUM);
    this.currentPageNumElement.innerText = this.currentPageNumValue.toString();
    this.element.append(
      this.prevPageButton.getHtmlElement(),
      this.currentPageNumElement,
      this.nextPageButton.getHtmlElement(),
    );
  }

  private async getMaxPageNum(): Promise<number> {
    let response = null;
    switch (this.pageType) {
      case ApiPath.GARAGE:
        response = await AsyncRaceApi.getCarsTotalCount();
        break;
      case ApiPath.WINNERS:
        response = await AsyncRaceApi.getWinnersTotalCount();
        break;
      default:
        break;
    }
    const totalCount = response !== null ? +response : 0;

    return Math.ceil(totalCount / this.itemsPerPage);
  }

  private prevPageButtonHandler(): void {
    if (this.currentPageNumValue > 1) {
      this.currentPageNumValue -= 1;
      this.currentPageNumElement.innerText =
        this.currentPageNumValue.toString();
      this.getHtmlElement().dispatchEvent(this.currentPageChangedEvent);
    }
  }

  private async nextPageButtonHandler(): Promise<void> {
    const maxPageNum = await this.getMaxPageNum();
    if (this.currentPageNumValue < maxPageNum) {
      this.currentPageNumValue += 1;
      this.currentPageNumElement.innerText =
        this.currentPageNumValue.toString();
      this.getHtmlElement().dispatchEvent(this.currentPageChangedEvent);
    }
  }
}
