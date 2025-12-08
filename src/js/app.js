import { Popover } from "../components/popovers/popover";

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll('[data-toggle="popover"]');
  elements.forEach((el) => new Popover(el));
});
