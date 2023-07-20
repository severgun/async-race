import "./garage-page.css";
import CarEditControls from "./car-edit-controls/car-edit-controls";
import PaginationControls from "../pagination-controls/pagination-controls";
import GarageControls from "./garage-controls/garage-controls";

enum CssClasses {
  GARAGE_PAGE = "garage-page",
  GARAGE_PAGE_TITLE = "garage-page__title",
  RACE_LANE_CONTAINER = "race-lane-container",
}

const TITLE_TEXT = "Garage";

export default class GaragePage {
  private element;

  private carEditControls;

  private garageControls;

  private title;

  private paginationControls;

  private raceLanesContainer;

  constructor() {
    this.element = document.createElement("div");
    this.carEditControls = new CarEditControls();
    this.garageControls = new GarageControls();
    this.title = document.createElement("h2");
    this.paginationControls = new PaginationControls();
    this.raceLanesContainer = document.createElement("div");

    this.configureElement();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  private configureElement(): void {
    this.element.classList.add(CssClasses.GARAGE_PAGE);

    this.title.innerText = TITLE_TEXT;
    this.title.classList.add(CssClasses.GARAGE_PAGE_TITLE);

    this.raceLanesContainer.classList.add(CssClasses.RACE_LANE_CONTAINER);

    this.element.append(
      this.carEditControls.getHtmlElement(),
      this.garageControls.getHtmlElement(),
      this.title,
      this.paginationControls.getHtmlElement(),
      this.raceLanesContainer,
    );
  }
}
