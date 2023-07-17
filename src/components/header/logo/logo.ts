import LogoImg from "../../../assets/logo.svg";
import "./logo.css";

enum CssClasses {
  LOGO = "logo",
  LOGO_TITLE = "logo__title",
  LOGO_IMG = "logo__img",
  WRAPPER = "wrapper",
}

const LOGO_TEXT = "RS School Async Race";
const LOGO_ALT_TEXT = "RS School Async Race Logo";

export default class Logo {
  private element;

  private imgElement;

  private titleElement;

  constructor() {
    this.element = document.createElement("div");
    this.imgElement = document.createElement("img");
    this.titleElement = document.createElement("h1");

    this.configureElem();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  private configureElem(): void {
    this.element.classList.add(CssClasses.WRAPPER, CssClasses.LOGO);

    this.imgElement.classList.add(CssClasses.LOGO_IMG);
    this.imgElement.setAttribute("src", LogoImg);
    this.imgElement.setAttribute("alt", LOGO_ALT_TEXT);

    this.titleElement.classList.add(CssClasses.LOGO_TITLE);
    this.titleElement.innerText = LOGO_TEXT;

    this.element.append(this.imgElement, this.titleElement);
  }
}
