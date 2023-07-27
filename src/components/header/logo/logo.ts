import LogoImg from "../../../assets/logo.svg";
import "./logo.css";

enum CssClasses {
  LOGO = "logo",
  LOGO_TITLE = "logo__title",
  LOGO_IMG = "logo__img",
}

const LOGO_TEXT = "RS School Async Race";

export default class Logo {
  private element;

  private iconElement;

  private titleElement;

  constructor() {
    this.element = document.createElement("div");
    this.iconElement = document.createElement("div");
    this.titleElement = document.createElement("h1");

    this.configureElement();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  private configureElement(): void {
    this.element.classList.add(CssClasses.LOGO);

    this.iconElement.classList.add(CssClasses.LOGO_IMG);
    this.iconElement.innerHTML = LogoImg;

    this.titleElement.classList.add(CssClasses.LOGO_TITLE);
    this.titleElement.innerText = LOGO_TEXT;

    this.element.append(this.iconElement, this.titleElement);
  }
}
