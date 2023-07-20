import { Button, ButtonParams } from "../../button/button";
import "./car-edit-controls.css";

enum CssClasses {
  CAR_EDIT_CONTROLS = "car-edit-controls",
  CAR_EDIT_CONTROLS_CREATE_NAME_INP = "car-edit-controls__create-name",
  CAR_EDIT_CONTROLS_UPDATE_NAME_INP = "car-edit-controls__update-name",
  CAR_EDIT_CONTROLS_CREATE_COLOR = "car-edit-controls__create-color",
  CAR_EDIT_CONTROLS_UPDATE_COLOR = "car-edit-controls__update-color",
  CAR_EDIT_CONTROLS_CREATE_BTN = "car-edit-controls__create-btn",
  CAR_EDIT_CONTROLS_UPDATE_BTN = "car-edit-controls__update-btn",
}

const createCarButtonParams: ButtonParams = {
  cssClasses: [CssClasses.CAR_EDIT_CONTROLS_CREATE_BTN],
  text: "CREATE",
  tooltip: "Create car with specified name and color",
  callBack: () => {},
};
const updateCarButtonParams: ButtonParams = {
  cssClasses: [CssClasses.CAR_EDIT_CONTROLS_UPDATE_BTN],
  text: "UPDATE",
  tooltip: "Update color or name of selected car",
  callBack: () => {},
};

export default class CarEditControls {
  private element;

  private createCarNameInput;

  private updateCarNameInput;

  private createCarColorPicker;

  private updateCarColorPicker;

  private createCarButton;

  private updateCarButton;

  constructor() {
    this.element = document.createElement("div");
    this.createCarNameInput = document.createElement("input");
    this.updateCarNameInput = document.createElement("input");
    this.createCarColorPicker = document.createElement("input");
    this.updateCarColorPicker = document.createElement("input");
    this.createCarButton = new Button(createCarButtonParams);
    this.updateCarButton = new Button(updateCarButtonParams);
    this.configureElement();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  private configureElement(): void {
    this.element.classList.add(CssClasses.CAR_EDIT_CONTROLS);

    this.createCarNameInput.classList.add(
      CssClasses.CAR_EDIT_CONTROLS_CREATE_NAME_INP,
    );
    this.updateCarNameInput.classList.add(
      CssClasses.CAR_EDIT_CONTROLS_UPDATE_NAME_INP,
    );

    this.createCarColorPicker.type = "color";
    this.createCarColorPicker.classList.add(
      CssClasses.CAR_EDIT_CONTROLS_CREATE_COLOR,
    );
    this.updateCarColorPicker.type = "color";
    this.updateCarColorPicker.classList.add(
      CssClasses.CAR_EDIT_CONTROLS_UPDATE_COLOR,
    );

    this.element.append(
      this.createCarNameInput,
      this.createCarColorPicker,
      this.createCarButton.getHtmlElement(),
      this.updateCarNameInput,
      this.updateCarColorPicker,
      this.updateCarButton.getHtmlElement(),
    );
  }
}
