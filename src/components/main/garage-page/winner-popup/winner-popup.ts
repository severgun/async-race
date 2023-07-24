import { Button, ButtonParams } from "../../button/button";
import carIcon from "../../../../assets/tractor-side-view-svgrepo-com.svg";

enum CssClasses {
  WINNER_POPUP = "winner-popup",
  WINNER_POPUP_TITLE = "winner-popup__title",
  WINNER_POPUP_CAR_ICON = "winner-popup__car-icon",
  WINNER_POPUP_CAR_NAME = "winner-popup__car-name",
  WINNER_POPUP_CLOSE_BTN = "winner-popup__close-btn",
}

const WINNER_TITLE = "WINNER!";

export default class WinnerPopup {
  private element;

  private title;

  private carImg;

  private carName;

  private closeButton;

  constructor() {
    this.element = document.createElement("div");
    this.title = document.createElement("h2");
    this.carImg = document.createElement("div");
    this.carName = document.createElement("h3");

    const closeButtonParams: ButtonParams = {
      cssClasses: [CssClasses.WINNER_POPUP_CLOSE_BTN],
      text: "Close",
      tooltip: "Close popup",
      callBack: this.closeWinnerPopup.bind(this),
    };
    this.closeButton = new Button(closeButtonParams);

    this.configureElement();
  }

  private configureElement() {
    this.element.classList.add(CssClasses.WINNER_POPUP);
    this.title.classList.add(CssClasses.WINNER_POPUP_TITLE);
    this.title.innerText = WINNER_TITLE;
    this.carImg.classList.add(CssClasses.WINNER_POPUP_CAR_ICON);
    this.carImg.innerHTML = carIcon;
    this.carName.classList.add(CssClasses.WINNER_POPUP_CAR_NAME);

    this.element.append(
      this.title,
      this.carImg,
      this.carName,
      this.closeButton.getHtmlElement(),
    );
  }

  showWinnerPopup(name: string, color: string): void {
    this.carImg.style.fill = color;
    this.carName.innerText = name;
    const main = document.querySelector(".main");
    main?.append(this.element);
  }

  closeWinnerPopup(): void {
    this.element.remove();
  }
}
