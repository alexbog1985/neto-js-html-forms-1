import "./popover.css";

export class Popover {
  constructor(element) {
    this.element = element;
    this.title = element.getAttribute("data-original-title");
    this.content = element.getAttribute("data-content");
    this.popoverElement = null;

    this.toggle = this.toggle.bind(this);

    element.addEventListener("click", this.toggle);
  }

  show() {}

  hide() {}

  toggle() {
    console.log(this.title, this.content);
  }
}
