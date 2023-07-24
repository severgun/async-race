import "./race-lane.css";
import finishFlagIcon from "../../../assets/logo.svg";
import carIcon from "../../../assets/tractor-side-view-svgrepo-com.svg";
import { Button, ButtonParams } from "../button/button";
import { AsyncRaceApi, Car } from "../../../app/async-race-api";

export interface FinishedCar {
  id: number;
  time: number;
}

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

export class RaceLane {
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

  private engineRunning;

  private animationIntervalId;

  private carSelectedEvent;

  private updateGarageEvent = new Event("updateGarage", { bubbles: true });

  private selectButtonClickHandlerBound =
    this.selectButtonClickHandler.bind(this);

  private removeButtonClickHandlerBound =
    this.removeButtonClickHandler.bind(this);

  constructor(car: Car) {
    const selectButtonParams: ButtonParams = {
      cssClasses: [CssClasses.SELECT_BUTTON],
      text: "SELECT",
      tooltip: "Select car",
      callBack: this.selectButtonClickHandlerBound,
    };

    const removeButtonParams: ButtonParams = {
      cssClasses: [CssClasses.REMOVE_BUTTON],
      text: "REMOVE",
      tooltip: "Remove car",
      callBack: this.removeButtonClickHandlerBound,
    };

    const runEngineButtonParams: ButtonParams = {
      cssClasses: [CssClasses.RUN_ENGINE_BUTTON],
      text: "R",
      tooltip: "Run engine",
      callBack: this.race.bind(this),
    };

    const stopEngineButtonParams: ButtonParams = {
      cssClasses: [CssClasses.STOP_ENGINE_BUTTON],
      text: "S",
      tooltip: "Stop engine",
      callBack: this.reset.bind(this),
    };

    this.element = document.createElement("div");
    this.carName = document.createElement("p");
    this.track = document.createElement("div");
    this.carImg = document.createElement("div");
    this.finishFlag = document.createElement("div");
    this.car = car;
    this.engineRunning = false;
    this.animationIntervalId = -1;
    this.selectButton = new Button(selectButtonParams);
    this.removeButton = new Button(removeButtonParams);
    this.runEngButton = new Button(runEngineButtonParams);
    this.stopEngButton = new Button(stopEngineButtonParams);
    this.carSelectedEvent = new CustomEvent("carSelected", {
      bubbles: true,
      detail: this.car,
    });

    this.configureElement();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  async race(): Promise<FinishedCar> {
    if (!this.engineRunning) {
      this.toggleDisableRunEngButton();
      this.toggleDisableStopEngButton();
      //   AsyncRaceApi.engineStart(this.car.id).then((startResponse) => {
      //     if (startResponse !== null) {
      //       const time = startResponse.distance / startResponse.velocity;
      //       this.engineRunning = true;
      //       this.animateCar(time);
      //       AsyncRaceApi.engineDrive(this.car.id).catch((error) => {
      //         if (error.message.includes("500")) {
      //           clearInterval(this.animationIntervalId);
      //         }
      //       });
      //     }
      //   });

      const startResponse = await AsyncRaceApi.engineStart(this.car.id);
      if (startResponse !== null) {
        const time = startResponse.distance / startResponse.velocity;
        this.engineRunning = true;
        this.animateCar(time);
        try {
          const response = await AsyncRaceApi.engineDrive(this.car.id);
          if (response.success) {
            return { id: this.car.id, time };
          }
        } catch (error) {
          if (error instanceof Error && error.message.includes("500")) {
            clearInterval(this.animationIntervalId);
          }
        }
      }
    }
    return Promise.reject();
  }

  reset(): void {
    AsyncRaceApi.engineStop(this.car.id).then(() => {
      clearInterval(this.animationIntervalId);
      this.toggleDisableRunEngButton();
      this.toggleDisableStopEngButton();
      this.carImg.style.left = "0px";
      this.engineRunning = false;
    });
  }

  toggleDisableRunEngButton(): void {
    const button = this.runEngButton.getHtmlElement() as HTMLButtonElement;
    button.disabled = !button.disabled;
  }

  toggleDisableStopEngButton(): void {
    const button = this.stopEngButton.getHtmlElement() as HTMLButtonElement;
    button.disabled = !button.disabled;
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
    this.toggleDisableStopEngButton();
    secondRow.append(
      this.runEngButton.getHtmlElement(),
      this.stopEngButton.getHtmlElement(),
      this.track,
    );

    this.element.append(firstRow, secondRow);
  }

  private selectButtonClickHandler(): void {
    console.log("CLICK SELECT", this.car);
    this.getHtmlElement().dispatchEvent(this.carSelectedEvent);
  }

  private async removeButtonClickHandler(): Promise<void> {
    const winners = await AsyncRaceApi.getWinners();
    const inWinners =
      winners?.find((winner) => winner.id === this.car.id) !== undefined;

    await AsyncRaceApi.deleteCar(this.car.id);
    if (inWinners) {
      await AsyncRaceApi.deleteWinner(this.car.id);
    }

    this.getHtmlElement().dispatchEvent(this.updateGarageEvent);
  }

  private animateCar(time: number): void {
    const FRAME_TIME = 1000 / 60;

    const distance = this.finishFlag.offsetLeft + this.finishFlag.offsetWidth;
    const perFrameDistance = distance / (time / FRAME_TIME);
    let currentPos = 0;
    this.animationIntervalId = window.setInterval(() => {
      if (currentPos >= distance || !this.engineRunning) {
        clearInterval(this.animationIntervalId);
      }
      this.carImg.style.left = `${currentPos}px`;
      currentPos += perFrameDistance;
    }, FRAME_TIME);
  }
}
