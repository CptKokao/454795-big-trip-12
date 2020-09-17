import AbstractView from './abstract.js';
import {MenuItem} from '../utils/const.js';

const createTripTabsTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATISTICS}">Stats</a>
    </nav>`
  );
};

export default class TripTabs extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createTripTabsTemplate();
  }

  _menuClickHandler(e) {
    e.preventDefault();
    this._callback.menuClick(e.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    const menuButtons = this.getElement().querySelectorAll(`.trip-tabs__btn`);

    menuButtons.forEach((button) => {
      button.addEventListener(`click`, this._menuClickHandler);
    });
  }

  // Переключение активных классов
  setMenuItem(menuItem) {
    const activeClass = `trip-tabs__btn--active`;
    const menuItems = this.getElement().querySelectorAll(`.trip-tabs__btn`);

    menuItems.forEach((item) => {
      if (item.classList.contains(activeClass)) {
        item.classList.remove(activeClass);
      }
    });

    const newActiveMenuItem = this.getElement().querySelector(`[data-menu-item=${menuItem}]`);
    if (newActiveMenuItem) {
      newActiveMenuItem.classList.add(activeClass);
    }
  }

}
