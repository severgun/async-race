import Main from "../../main/main";
import "./nav.css";

enum CssClasses {
  NAV = "nav",
  NAV_LIST = "nav__list",
  NAV_ITEM = "nav__item",
}

enum NavButtons {
  GARAGE = "Garage",
  WINNERS = "Winners",
}

export default class Nav {
  private element;

  private main;

  private list;

  private garageLinkClickHandlerBound = this.garageLinkClickHandler.bind(this);

  private winnersLinkClickHandlerBound =
    this.winnersLinkClickHandler.bind(this);

  constructor(main: Main) {
    this.element = document.createElement("nav");
    this.element.classList.add(CssClasses.NAV);

    this.main = main;

    this.list = document.createElement("ul");
    this.list.classList.add(CssClasses.NAV_LIST);

    this.configureElem();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  private garageLinkClickHandler() {
    const garagePage = this.main.getGaragePage();
    this.main.getHtmlElement().replaceChildren(garagePage.getHtmlElement());
  }

  private winnersLinkClickHandler() {
    const winnersPage = this.main.getWinnersPage();
    this.main.getHtmlElement().replaceChildren(winnersPage.getHtmlElement());
  }

  private configureElem(): void {
    const garageLink = document.createElement("li");
    garageLink.classList.add(CssClasses.NAV_ITEM);
    garageLink.innerText = NavButtons.GARAGE;
    garageLink.addEventListener("click", this.garageLinkClickHandlerBound);
    this.list.append(garageLink);

    const winnersLink = document.createElement("li");
    winnersLink.classList.add(CssClasses.NAV_ITEM);
    winnersLink.innerText = NavButtons.WINNERS;
    winnersLink.addEventListener("click", this.winnersLinkClickHandlerBound);
    this.list.append(winnersLink);

    this.element.append(this.list);
  }
}
