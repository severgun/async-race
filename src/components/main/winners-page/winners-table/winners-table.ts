import "./winners-table.css";

const columnHeaders = ["#", "Car", "Name", "Wins", "Best time (s)"];

enum CssClasses {
  WINNERS_TABLE = "winners-table",
  WINNERS_TABLE_HEADER = "winners-table__header",
}

export default class WinnersTable {
  private element;

  constructor() {
    this.element = document.createElement("table");
    this.configureElem();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  private configureElem(): void {
    this.element.classList.add(CssClasses.WINNERS_TABLE);
    this.addTableHeader();
  }

  private addTableHeader(): void {
    const headerRow = document.createElement("tr");
    headerRow.classList.add(CssClasses.WINNERS_TABLE_HEADER);

    columnHeaders.forEach((title) => {
      const headerTitle = document.createElement("th");
      headerTitle.innerText = title;
      headerRow.append(headerTitle);
    });

    this.element.append(headerRow);
  }
}
