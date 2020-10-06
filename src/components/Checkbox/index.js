import Checkboxes from "./Container";
import Checkbox from "./Checkbox";

export const isActiveElement = (checkboxes) => {
  return document.querySelectorAll(`#${checkboxes} .click-effect`);
};
export { Checkboxes, Checkbox };
