import "./nav.css";

enum CssClasses {
  NAV = "nav",
  NAV_LIST = "nav__list",
  NAV_ITEM = "nav__item",
  WRAPPER = "wrapper",
}

const NavButtons = ["Garage", "Winners"];

export default class Nav {
  private element;

  private list;

  constructor() {
    this.element = document.createElement("nav");
    this.element.classList.add(CssClasses.WRAPPER, CssClasses.NAV);

    this.list = document.createElement("ul");
    this.list.classList.add(CssClasses.NAV_LIST);

    this.configureElem();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  private configureElem(): void {
    NavButtons.forEach((buttonText) => {
      const item = document.createElement("li");
      item.classList.add(CssClasses.NAV_ITEM);
      item.innerText = buttonText;
      this.list.append(item);
    });

    this.element.append(this.list);
  }
}
