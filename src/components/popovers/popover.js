import "./popover.css";

export class Popover {
  constructor(element) {
    this.element = element;
    this.title = element.getAttribute("data-original-title");
    this.content = element.getAttribute("data-content");
    this.popoverElement = null;
    this.isOpen = false;

    this.toggle = this.toggle.bind(this);

    element.addEventListener("click", this.toggle);
  }

  show() {
    if (this.isOpen) return;
    this.createPopover();
    document.body.appendChild(this.popoverElement);

    const rect = this.element.getBoundingClientRect();
    const popoverRect = this.popoverElement.getBoundingClientRect();

    const top = rect.top - popoverRect.height - 10;
    const left = rect.left + rect.width / 2 - popoverRect.width / 2;

    this.popoverElement.style.top = `${top + window.scrollY}px`;
    this.popoverElement.style.left = `${left + window.scrollX}px`;

    this.isOpen = true;
  }

  hide() {
    if (!this.isOpen) return;
    this.popoverElement.remove();
    this.popoverElement = null;
    this.isOpen = false;
  }

  toggle() {
    if (!this.isOpen) {
      this.show();
    } else {
      this.hide();
    }
  }

  createPopover() {
    if (!this.popoverElement) {
      const popover = document.createElement("div");
      popover.className = "popover top";

      const arrow = document.createElement("div");
      arrow.className = "arrow";

      const header = document.createElement("div");
      header.className = "popover-header";
      header.textContent = this.title;

      const body = document.createElement("div");
      body.className = "popover-body";
      body.textContent = this.content;

      popover.appendChild(arrow);
      popover.appendChild(header);
      popover.appendChild(body);

      this.popoverElement = popover;
    }
  }
}
