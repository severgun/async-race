import "./race-lane.css";
import finishFlagImg from "../../../assets/logo.svg";
import { Button, ButtonParams } from "../button/button";

enum CssClasses {
  "RACE_LANE" = "race-lane",
  "RACE_LANE_TRACK" = "race-lane__track",
  "RACE_LANE_CAR_ICON" = "race-lane__car",
  "RACE_LANE_CAR_NAME" = "race-lane__car-name",
  "RACE_LANE_FIRST_ROW" = "race-lane__first-row",
  "RACE_LANE_SECOND_ROW" = "race-lane__second-row",
  "FINISH_FLAG" = "race-lane__flag",
  "SELECT_BUTTON" = "select-car-btn",
  "REMOVE_BUTTON" = "remove-car-btn",
  "RUN_ENGINE_BUTTON" = "run-eng-btn",
  "STOP_ENGINE_BUTTON" = "stop-eng-btn",
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

  private selectButton;

  private removeButton;

  private runEngButton;

  private stopEngButton;

  private finishFlag;

  constructor() {
    this.element = document.createElement("div");
    this.carName = document.createElement("p");
    this.track = document.createElement("div");
    this.finishFlag = document.createElement("img");
    this.car = "";
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

    const firstRow = document.createElement("div");
    firstRow.classList.add(CssClasses.RACE_LANE_FIRST_ROW);
    firstRow.append(
      this.selectButton.getHtmlElement(),
      this.removeButton.getHtmlElement(),
      this.carName,
    );

    this.track.classList.add(CssClasses.RACE_LANE_TRACK);
    this.finishFlag.classList.add(CssClasses.FINISH_FLAG);
    this.finishFlag.src = finishFlagImg;
    this.track.append(this.finishFlag);

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
