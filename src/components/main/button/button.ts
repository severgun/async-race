import "./button.css";

export interface ButtonType {
  cssClasses: string[];
  text: string;
  tooltip: string;
}

enum CssClasses {
  "BUTTON" = "button",
}

export class Button {
  private element;

  constructor(params: ButtonType) {
    this.element = document.createElement("button");
    this.configureElement(params);
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  private configureElement(params: ButtonType): void {
    this.element.classList.add(CssClasses.BUTTON, ...params.cssClasses);
    this.element.innerText = params.text;
  }
}
