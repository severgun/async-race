import "./footer.css";
import GithubIcon from "../../assets/github-mark.svg";

enum CssClasses {
  FOOTER = "footer",
  WRAPPER = "wrapper",
  AUTHOR_LINK = "author-link",
  AUTHOR_LINK_ICON = "author-link-icon",
  AUTHOR_LINK_TEXT = "author-link-text",
}

const AUTHOR_LINK_TEXT = "Created by Sergey Vergun";
const AUTHOR_LINK = "https://github.com/severgun";
const AUTHOR_LINK_ICON_ALT = "GitHub Icon";

export default class Footer {
  private element;

  constructor() {
    this.element = document.createElement("footer");
    this.element.classList.add(CssClasses.WRAPPER, CssClasses.FOOTER);

    this.configureElement();
  }

  getHtmlElement(): HTMLElement {
    return this.element;
  }

  private configureElement(): void {
    const authorLink = document.createElement("a");
    authorLink.classList.add(CssClasses.AUTHOR_LINK);
    authorLink.href = AUTHOR_LINK;
    authorLink.target = "_blank";

    const authorLinkText = document.createElement("p");
    authorLinkText.innerText = AUTHOR_LINK_TEXT;
    authorLinkText.classList.add(CssClasses.AUTHOR_LINK_TEXT);

    const authorLinkIcon = document.createElement("img");
    authorLinkIcon.classList.add(CssClasses.AUTHOR_LINK_ICON);
    authorLinkIcon.src = GithubIcon;
    authorLinkIcon.alt = AUTHOR_LINK_ICON_ALT;

    authorLink.append(authorLinkIcon, authorLinkText);

    this.element.append(authorLink);
  }
}
