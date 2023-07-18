import PaginationControls from "../pagination-controls/pagination-controls";
import WinnersTable from "./winners-table/winners-table";

enum CssClasses {
  WINNERS_PAGE = "winners-page",
  WINNERS_TITLE = "winners-title",
}
const titleText = "WINNERS";

export default class WinnersPage {
  private element;

  private table;

  private title;

  private paginationControls;

  constructor() {
    this.element = document.createElement("div");
    this.title = document.createElement("h2");
    this.paginationControls = new PaginationControls();
    this.table = new WinnersTable();

    this.configureElem();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  private configureElem(): void {
    this.element.classList.add(CssClasses.WINNERS_PAGE);
    this.title.classList.add(CssClasses.WINNERS_TITLE);
    this.title.innerText = titleText;

    this.element.append(
      this.title,
      this.paginationControls.getHtmlElement(),
      this.table.getHtmlElement(),
    );
  }
}
