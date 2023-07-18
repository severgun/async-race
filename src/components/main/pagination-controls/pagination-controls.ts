import { Button, ButtonParams } from "../button/button";
import "./pagination-controls.css";

enum CssClasses {
  PAGINATION_CONTROLS = "pagination-controls",
  PAGINATION_PREV_PAGE = "pagination-controls__prev",
  PAGINATION_NEXT_PAGE = "pagination-controls__next",
  PAGINATION_CURRENT_NUM = "pagination-controls__current",
}

const prevPageButtonParams: ButtonParams = {
  cssClasses: [CssClasses.PAGINATION_PREV_PAGE],
  text: "<<",
  tooltip: "Previous Page",
  callBack: () => {},
};
const nextPageButtonParams: ButtonParams = {
  cssClasses: [CssClasses.PAGINATION_NEXT_PAGE],
  text: ">>",
  tooltip: "Next Page",
  callBack: () => {},
};

export default class PaginationControls {
  private element;

  private prevPageButton;

  private nextPageButton;

  private currentPageNum;

  constructor() {
    this.element = document.createElement("div");
    this.prevPageButton = new Button(prevPageButtonParams);
    this.nextPageButton = new Button(nextPageButtonParams);
    this.currentPageNum = document.createElement("p");

    this.configureElem();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  private configureElem(): void {
    this.element.classList.add(CssClasses.PAGINATION_CONTROLS);
    this.currentPageNum.classList.add(CssClasses.PAGINATION_CURRENT_NUM);
    this.currentPageNum.innerText = "1";
    this.element.append(
      this.prevPageButton.getHtmlElement(),
      this.currentPageNum,
      this.nextPageButton.getHtmlElement(),
    );
  }
}
