import Main from "../main/main";
import "./header.css";
import Logo from "./logo/logo";
import Nav from "./nav/nav";

enum CssClasses {
  HEADER = "header",
  WRAPPER = "wrapper",
}

export default class Header {
  private element;

  private logo: Logo;

  private nav: Nav;

  constructor(main: Main) {
    this.element = document.createElement("header");
    this.element.classList.add(CssClasses.WRAPPER, CssClasses.HEADER);

    this.logo = new Logo();
    this.nav = new Nav(main);

    this.configureElem();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  private configureElem(): void {
    this.element.append(this.logo.getElement(), this.nav.getHtmlElement());
  }
}
