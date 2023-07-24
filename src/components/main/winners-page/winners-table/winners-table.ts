import "./winners-table.css";

interface ColumnHeaders {
  text: string;
  callback?: () => void;
}

enum CssClasses {
  WINNERS_TABLE = "winners-table",
  WINNERS_TABLE_HEADER = "winners-table__header",
  WINNERS_CAR_ICON = "winners__car-icon",
}

export default class WinnersTable {
  private element;

  private sortByWinsEvent = new Event("sortByWins", { bubbles: true });

  private sortByTimeEvent = new Event("sortByTime", { bubbles: true });

  constructor() {
    this.element = document.createElement("table");
    this.configureElement();
  }

  getHtmlElement(): HTMLTableElement {
    return this.element;
  }

  clearTable(): void {
    this.element.replaceChildren();
    this.addTableHeader();
  }

  private configureElement(): void {
    this.element.classList.add(CssClasses.WINNERS_TABLE);
    this.addTableHeader();
  }

  private addTableHeader(): void {
    const columnHeaders: ColumnHeaders[] = [
      {
        text: "#",
      },
      {
        text: "Car",
      },
      {
        text: "Name",
      },
      {
        text: "Wins",
        callback: this.sortByWins.bind(this),
      },
      {
        text: "Best time (s)",
        callback: this.sortByTime.bind(this),
      },
    ];

    const headerRow = document.createElement("tr");
    headerRow.classList.add(CssClasses.WINNERS_TABLE_HEADER);

    columnHeaders.forEach((cell) => {
      const headerCell = document.createElement("th");
      headerCell.innerText = cell.text;

      if (cell.callback !== undefined) {
        headerCell.addEventListener("click", cell.callback);
        headerCell.style.cursor = "pointer";
        headerCell.style.color = "darkblue";
      }

      headerRow.append(headerCell);
    });

    this.element.append(headerRow);
  }

  private sortByWins(): void {
    this.getHtmlElement().dispatchEvent(this.sortByWinsEvent);
  }

  private sortByTime(): void {
    this.getHtmlElement().dispatchEvent(this.sortByTimeEvent);
  }
}
