import Header from "../components/header/header";
import Main from "../components/main/main";
import Footer from "../components/footer/footer";
import FavIcon from "../assets/logo.svg";

export default class App {
  private favicon;

  private header: Header;

  private main: Main;

  private footer: Footer;

  constructor() {
    this.favicon = document.createElement("link");
    this.main = new Main();
    this.header = new Header(this.main);
    this.footer = new Footer();
  }

  private setFavicon(icon: string) {
    const headTitle: HTMLElement | null = document.querySelector("head");
    this.favicon = document.createElement("link");
    this.favicon.setAttribute("rel", "shortcut icon");
    this.favicon.setAttribute("href", icon);
    headTitle?.appendChild(this.favicon);
  }

  private configureApp(): void {
    [
      this.header.getHtmlElement(),
      this.main.getHtmlElement(),
      this.footer.getHtmlElement(),
    ].forEach((element) => {
      if (element !== null) {
        document.body.append(element);
      }
    });
  }

  run(): void {
    this.setFavicon(FavIcon);
    this.configureApp();
  }
}
