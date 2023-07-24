import { Button, ButtonParams } from "../../button/button";
import "./garage-controls.css";
import getRandomCarName from "../../../../utils/getRandomCarName";
import { AsyncRaceApi } from "../../../../app/async-race-api";
import getRandomColorHex from "../../../../utils/getRandomColor";

enum CssClasses {
  GARAGE_CONTROLS = "garage-controls",
  RACE_BUTTON = "race-button",
  RESET_BUTTON = "reset-button",
  GENERATE_CARS_BUTTON = "generate-cars-button",
}

const GENERATE_CARS_COUNT = 100;

export default class GarageControls {
  private element;

  private raceButton;

  private resetButton;

  private generateCarsButton;

  private generateCarsButtonHandlerBound =
    this.generateCarsButtonHandler.bind(this);

  private updateGarageEvent = new Event("updateGarage", { bubbles: true });

  private startRaceGarageEvent = new Event("startRaceGarage", {
    bubbles: true,
  });

  private stopRaceGarageEvent = new Event("stopRaceGarage", { bubbles: true });

  constructor() {
    const raceButtonParams: ButtonParams = {
      cssClasses: [CssClasses.RACE_BUTTON],
      text: "RACE",
      tooltip: "Start race",
      callBack: () => {
        this.getHtmlElement().dispatchEvent(this.startRaceGarageEvent);
      },
    };

    const resetButtonParams: ButtonParams = {
      cssClasses: [CssClasses.RESET_BUTTON],
      text: "RESET",
      tooltip: "Reset race",
      callBack: () => {
        this.getHtmlElement().dispatchEvent(this.stopRaceGarageEvent);
      },
    };

    const generateCarsButtonParams: ButtonParams = {
      cssClasses: [CssClasses.GENERATE_CARS_BUTTON],
      text: "GENERATE CARS",
      tooltip: "Generate random cars",
      callBack: this.generateCarsButtonHandlerBound,
    };

    this.element = document.createElement("div");
    this.raceButton = new Button(raceButtonParams);
    this.resetButton = new Button(resetButtonParams);
    this.generateCarsButton = new Button(generateCarsButtonParams);

    this.configureElement();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  setDisableRaceButton(value: boolean): void {
    const button = this.raceButton.getHtmlElement() as HTMLButtonElement;
    button.disabled = value;
  }

  setDisableResetButton(value: boolean): void {
    const button = this.resetButton.getHtmlElement() as HTMLButtonElement;
    button.disabled = value;
  }

  private async generateCarsButtonHandler(): Promise<void> {
    const results = new Array(GENERATE_CARS_COUNT);
    for (let index = 0; index < GENERATE_CARS_COUNT; index += 1) {
      const name = getRandomCarName();
      const color = getRandomColorHex();
      results[index] = AsyncRaceApi.createCar({
        name,
        color,
      });
    }
    await Promise.all(results);
    this.getHtmlElement().dispatchEvent(this.updateGarageEvent);
  }

  private configureElement(): void {
    this.element.classList.add(CssClasses.GARAGE_CONTROLS);
    this.setDisableResetButton(true);
    this.element.append(
      this.raceButton.getHtmlElement(),
      this.resetButton.getHtmlElement(),
      this.generateCarsButton.getHtmlElement(),
    );
  }
}
