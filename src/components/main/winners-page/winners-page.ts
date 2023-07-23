import { ApiPath } from "../../../app/async-race-api";
import PaginationControls from "../pagination-controls/pagination-controls";
import WinnersTable from "./winners-table/winners-table";

enum CssClasses {
  WINNERS_PAGE = "winners-page",
  WINNERS_TITLE = "winners__title",
}
const TITLE_TEXT = "Winners";
const ITEMS_PER_PAGE = 10;

export default class WinnersPage {
  private element;

  private title;

  private paginationControls;

  private table;

  constructor() {
    this.element = document.createElement("div");
    this.title = document.createElement("h2");
    this.paginationControls = new PaginationControls(
      ApiPath.WINNERS,
      ITEMS_PER_PAGE,
    );
    this.table = new WinnersTable();

    this.configureElement();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  private configureElement(): void {
    this.element.classList.add(CssClasses.WINNERS_PAGE);
    this.title.classList.add(CssClasses.WINNERS_TITLE);
    this.title.innerText = TITLE_TEXT;

    this.element.append(
      this.title,
      this.paginationControls.getHtmlElement(),
      this.table.getHtmlElement(),
    );
  }
}
