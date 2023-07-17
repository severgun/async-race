import PaginationControls from "./pagination-controls/pagination-controls";

const columnHeaders = ["#", "Car", "Name", "Wins", "Best time (s)"];
const titleText = "WINNERS";

export default class WinnersPage {
  private element;

  private table;

  private title;

  private paginationControls;

  constructor() {
    this.element = document.createElement("div");
    this.table = document.createElement("table");
    this.title = document.createElement("h2");
    this.paginationControls = new PaginationControls();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  private configureElem(): void {
    this.title.innerText = titleText;
    this.addTableHeader();

    this.element.append(
      this.title,
      this.paginationControls.getHtmlElement(),
      this.table,
    );
  }

  private addTableHeader(): void {
    const headerRow = document.createElement("tr");
    columnHeaders.forEach((title) => {
      const headerTitle = document.createElement("th");
      headerTitle.innerText = title;
      headerRow.append(headerTitle);
    });

    this.table.append(headerRow);
  }
}
