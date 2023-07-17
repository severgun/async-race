import { Button, ButtonParams } from "../../button/button";

const prevPageButtonParams: ButtonParams = {
  cssClasses: ["prev-page"],
  text: "<<",
  tooltip: "Previous Page",
};
const nextPageButtonParams: ButtonParams = {
  cssClasses: ["next-page"],
  text: ">>",
  tooltip: "Next Page",
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
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  private configureElem(): void {
    this.currentPageNum.innerText = "1";
    this.element.append(
      this.prevPageButton.getHtmlElement(),
      this.currentPageNum,
      this.nextPageButton.getHtmlElement(),
    );
  }
}
