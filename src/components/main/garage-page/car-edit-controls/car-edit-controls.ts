import { AsyncRaceApi, Car } from "../../../../app/async-race-api";
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

const DEFAULT_COLOR = "#ffffff";

export default class CarEditControls {
  private element;

  private createCarNameInput;

  private updateCarNameInput;

  private createCarColorPicker;

  private updateCarColorPicker;

  private createCarButton;

  private updateCarButton;

  private updateGarageEvent = new Event("updateGarage", { bubbles: true });

  private selectedCar: Car | null = null;

  private createCarBound = this.createCar.bind(this);

  private updateCarBound = this.updateCar.bind(this);

  constructor() {
    const createCarButtonParams: ButtonParams = {
      cssClasses: [CssClasses.CAR_EDIT_CONTROLS_CREATE_BTN],
      text: "CREATE",
      tooltip: "Create car with specified name and color",
      callBack: this.createCarBound,
    };
    const updateCarButtonParams: ButtonParams = {
      cssClasses: [CssClasses.CAR_EDIT_CONTROLS_UPDATE_BTN],
      text: "UPDATE",
      tooltip: "Update color or name of selected car",
      callBack: this.updateCarBound,
    };

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

  setSelectedCar(car: Car): void {
    console.log("CAR-edit", car);
    this.selectedCar = car;
    this.updateCarNameInput.value = this.selectedCar.name;
    this.updateCarColorPicker.value = this.selectedCar.color;

    this.updateCarNameInput.disabled = false;
    this.updateCarColorPicker.disabled = false;
    (this.updateCarButton.getHtmlElement() as HTMLButtonElement).disabled =
      false;
  }

  private configureElement(): void {
    this.element.classList.add(CssClasses.CAR_EDIT_CONTROLS);

    this.createCarNameInput.classList.add(
      CssClasses.CAR_EDIT_CONTROLS_CREATE_NAME_INP,
    );
    this.createCarColorPicker.type = "color";
    this.createCarColorPicker.classList.add(
      CssClasses.CAR_EDIT_CONTROLS_CREATE_COLOR,
    );

    this.updateCarNameInput.classList.add(
      CssClasses.CAR_EDIT_CONTROLS_UPDATE_NAME_INP,
    );
    this.updateCarNameInput.disabled = true;
    this.updateCarColorPicker.type = "color";
    this.updateCarColorPicker.classList.add(
      CssClasses.CAR_EDIT_CONTROLS_UPDATE_COLOR,
    );
    this.updateCarColorPicker.disabled = true;
    (this.updateCarButton.getHtmlElement() as HTMLButtonElement).disabled =
      true;

    this.element.append(
      this.createCarNameInput,
      this.createCarColorPicker,
      this.createCarButton.getHtmlElement(),
      this.updateCarNameInput,
      this.updateCarColorPicker,
      this.updateCarButton.getHtmlElement(),
    );
  }

  private async createCar(): Promise<void> {
    const carData: Pick<Car, "color" | "name"> = {
      name: this.createCarNameInput.value,
      color: this.createCarColorPicker.value,
    };
    await AsyncRaceApi.createCar(carData);
    this.getHtmlElement().dispatchEvent(this.updateGarageEvent);
  }

  private async updateCar(): Promise<void> {
    console.log(
      "UPDATE",
      this.updateCarNameInput.value,
      this.updateCarColorPicker.value,
    );
    if (this.selectedCar !== null) {
      const carData: Pick<Car, "color" | "name"> = {
        name: this.updateCarNameInput.value,
        color: this.updateCarColorPicker.value,
      };
      await AsyncRaceApi.updateCar(this.selectedCar.id, carData);
      this.resetCarSelection();
      this.getHtmlElement().dispatchEvent(this.updateGarageEvent);
    }
  }

  private resetCarSelection(): void {
    this.selectedCar = null;
    this.updateCarNameInput.value = "";
    this.updateCarNameInput.disabled = true;
    this.updateCarColorPicker.value = DEFAULT_COLOR;
    this.updateCarColorPicker.disabled = true;
    (this.updateCarButton.getHtmlElement() as HTMLButtonElement).disabled =
      true;
  }
}
