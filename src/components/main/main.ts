import GaragePage from "./garage-page/garage-page";
import "./main.css";
import WinnersPage from "./winners-page/winners-page";

enum CssClasses {
  MAIN = "main",
  WRAPPER = "wrapper",
}

export default class Main {
  private element;

  private garagePage;

  private winnersPage;

  constructor() {
    this.element = document.createElement("main");

    this.garagePage = new GaragePage();

    this.winnersPage = new WinnersPage();

    this.configureElement();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  getGaragePage(): GaragePage {
    return this.garagePage;
  }

  getWinnersPage(): WinnersPage {
    return this.winnersPage;
  }

  private configureElement(): void {
    this.element.classList.add(CssClasses.WRAPPER, CssClasses.MAIN);
    this.element.append(this.garagePage.getHtmlElement());
  }
}
