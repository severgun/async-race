import { Button, ButtonParams } from "../../button/button";
import "./garage-controls.css";

enum CssClasses {
  GARAGE_CONTROLS = "garage-controls",
  RACE_BUTTON = "race-button",
  RESET_BUTTON = "reset-button",
  GENERATE_CARS_BUTTON = "generate-cars-button",
}

const raceButtonParams: ButtonParams = {
  cssClasses: [CssClasses.RACE_BUTTON],
  text: "RACE",
  tooltip: "Start race",
  callBack: () => {},
};

const resetButtonParams: ButtonParams = {
  cssClasses: [CssClasses.RESET_BUTTON],
  text: "RESET",
  tooltip: "Reset race",
  callBack: () => {},
};

const generateCarsButtonParams: ButtonParams = {
  cssClasses: [CssClasses.GENERATE_CARS_BUTTON],
  text: "GENERATE CARS",
  tooltip: "Generate random cars",
  callBack: () => {},
};

export default class GarageControls {
  private element;

  private raceButton;

  private resetButton;

  private generateCarsButton;

  constructor() {
    this.element = document.createElement("div");
    this.raceButton = new Button(raceButtonParams);
    this.resetButton = new Button(resetButtonParams);
    this.generateCarsButton = new Button(generateCarsButtonParams);

    this.configureElem();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  private configureElem(): void {
    this.element.classList.add(CssClasses.GARAGE_CONTROLS);
    this.element.append(
      this.raceButton.getHtmlElement(),
      this.resetButton.getHtmlElement(),
      this.generateCarsButton.getHtmlElement(),
    );
  }
}
