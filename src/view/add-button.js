import AbstractView from './abstract.js';
import {MenuItem} from '../utils/const.js';

const createButtonNewEventTemplate = () => {
  return (
    `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" data-menu-item="${MenuItem.ADD_NEW_EVENT}">New event</button>`
  );
};

export default class AddButton extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createButtonNewEventTemplate();
  }

  _menuClickHandler(e) {
    e.preventDefault();
    this._callback.menuClick(e.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem() {
    const button = this.getElement();

    if (button.disabled) {
      button.disabled = false;
    } else {
      button.disabled = true;
    }
  }
}
