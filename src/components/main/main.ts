import "./main.css";

enum CssClasses {
  MAIN = "main",
  WRAPPER = "wrapper",
}

export default class Main {
  private element;

  constructor() {
    this.element = document.createElement("main");
    this.element.classList.add(CssClasses.WRAPPER, CssClasses.MAIN);

    // this.configureElem();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  // private configureElem(): void {}
}
