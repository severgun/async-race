import "./race-lane.css";
import finishFlagIcon from "../../../assets/logo.svg";
import carIcon from "../../../assets/tractor-side-view-svgrepo-com.svg";
import { Button, ButtonParams } from "../button/button";
import { Car } from "../../../app/async-race-api";

enum CssClasses {
  RACE_LANE = "race-lane",
  RACE_LANE_TRACK = "race-lane__track",
  RACE_LANE_CAR_ICON = "race-lane__car",
  RACE_LANE_CAR_NAME = "race-lane__car-name",
  RACE_LANE_FIRST_ROW = "race-lane__first-row",
  RACE_LANE_SECOND_ROW = "race-lane__second-row",
  RACE_LANE_FINISH_FLAG = "race-lane__flag",
  SELECT_BUTTON = "select-car-btn",
  REMOVE_BUTTON = "remove-car-btn",
  RUN_ENGINE_BUTTON = "run-eng-btn",
  STOP_ENGINE_BUTTON = "stop-eng-btn",
}

const selectButtonParams: ButtonParams = {
  cssClasses: [CssClasses.SELECT_BUTTON],
  text: "SELECT",
  tooltip: "Select car",
  callBack: () => {},
};

const removeButtonParams: ButtonParams = {
  cssClasses: [CssClasses.REMOVE_BUTTON],
  text: "REMOVE",
  tooltip: "Remove car",
  callBack: () => {},
};

const runEngineButtonParams: ButtonParams = {
  cssClasses: [CssClasses.RUN_ENGINE_BUTTON],
  text: "R",
  tooltip: "Run engine",
  callBack: () => {},
};

const stopEngineButtonParams: ButtonParams = {
  cssClasses: [CssClasses.STOP_ENGINE_BUTTON],
  text: "S",
  tooltip: "Stop engine",
  callBack: () => {},
};

export default class RaceLane {
  private element;

  private track;

  private car;

  private carName;

  private carImg;

  private selectButton;

  private removeButton;

  private runEngButton;

  private stopEngButton;

  private finishFlag;

  constructor(car: Car) {
    this.element = document.createElement("div");
    this.carName = document.createElement("p");
    this.track = document.createElement("div");
    this.carImg = document.createElement("div");
    this.finishFlag = document.createElement("div");
    this.car = car;
    this.selectButton = new Button(selectButtonParams);
    this.removeButton = new Button(removeButtonParams);
    this.runEngButton = new Button(runEngineButtonParams);
    this.stopEngButton = new Button(stopEngineButtonParams);

    this.configureElement();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  private configureElement(): void {
    this.element.classList.add(CssClasses.RACE_LANE);
    this.carName.classList.add(CssClasses.RACE_LANE_CAR_NAME);
    this.carName.innerText = this.car.name;

    const firstRow = document.createElement("div");
    firstRow.classList.add(CssClasses.RACE_LANE_FIRST_ROW);
    firstRow.append(
      this.selectButton.getHtmlElement(),
      this.removeButton.getHtmlElement(),
      this.carName,
    );

    this.track.classList.add(CssClasses.RACE_LANE_TRACK);
    this.carImg.classList.add(CssClasses.RACE_LANE_CAR_ICON);
    this.carImg.innerHTML = carIcon;
    this.carImg.style.fill = this.car.color;
    this.finishFlag.classList.add(CssClasses.RACE_LANE_FINISH_FLAG);
    this.finishFlag.innerHTML = finishFlagIcon;
    this.track.append(this.carImg, this.finishFlag);

    const secondRow = document.createElement("div");
    secondRow.classList.add(CssClasses.RACE_LANE_SECOND_ROW);
    secondRow.append(
      this.runEngButton.getHtmlElement(),
      this.stopEngButton.getHtmlElement(),
      this.track,
    );

    this.element.append(firstRow, secondRow);
  }
}
