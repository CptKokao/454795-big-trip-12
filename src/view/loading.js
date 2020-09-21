import AbstractView from "./abstract.js";

const createLoadingTemplate = () => {
  return `<p class="board__no-tasks" style="text-align: center">
    Loading...
  </p>`;
};

export default class Loading extends AbstractView {
  getTemplate() {
    return createLoadingTemplate();
  }
}
