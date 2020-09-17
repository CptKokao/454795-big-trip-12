import InfoView from '../view/info.js';
import TabsView from '../view/tabs.js';
import AddButton from '../view/add-button.js';
import {renderPosition, render, replace, remove} from '../utils/render.js';
import {MenuItem} from '../utils/const.js';

export default class Info {
  constructor(pointListElement, pointsModel, handleMenuClick) {
    this._pointListElement = pointListElement;
    this._pointsModel = pointsModel;

    this._tabsComponent = null;
    this._addButtonComponent = null;
    this._infoComponent = null;
    // Событие из main.js для отслеживания Tabs, Stats, New event
    this._handleMenuClick = handleMenuClick;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTabs();
    this._renderInfo();
    this._renderButton();
    this._handlers();
  }

  // Событие для отслеживания Tabs, Stats, New event
  _handlers() {
    this._tabsComponent.setMenuClickHandler(this._handleMenuClick);
    this._addButtonComponent.setMenuClickHandler(this._handleMenuClick);
  }

  setMenuItemAddEvent() {
    this._tabsComponent.setMenuItem(MenuItem.TABLE);
  }

  setMenuItemTable() {
    this._tabsComponent.setMenuItem(MenuItem.TABLE);
    this._addButtonComponent.activeBtn();
  }

  setMenuItemStats() {
    this._tabsComponent.setMenuItem(MenuItem.STATISTICS);
    this._addButtonComponent.activeBtn();
  }

  // Отрисовка Info
  _renderInfo() {
    const prevInfoComponent = this._infoComponent;
    this._infoComponent = new InfoView(this._pointsModel.getPoints());

    if (prevInfoComponent === null) {
      render(this._pointListElement, this._infoComponent, renderPosition.AFTERBEGIN);
      return;
    }

    replace(this._infoComponent, prevInfoComponent);
    remove(prevInfoComponent);
  }

  // Отрисовка Tabs
  _renderTabs() {
    const tripContainer = this._pointListElement.querySelector(`.trip-controls`);

    const prevTabsComponent = this._tabsComponent;
    this._tabsComponent = new TabsView(this._currentMenuItem);

    if (prevTabsComponent === null) {
      render(tripContainer, this._tabsComponent, renderPosition.AFTERBEGIN);
      return;
    }

    replace(this._tabsComponent, prevTabsComponent);
    remove(prevTabsComponent);
  }

  // Отрисовка +New Event
  _renderButton() {
    const prevAddButtonComponent = this._addButtonComponent;
    this._addButtonComponent = new AddButton(this._currentMenuItem);

    if (prevAddButtonComponent === null) {
      render(this._pointListElement, this._addButtonComponent, renderPosition.BEFOREEND);
      return;
    }
    this._addButtonComponent.getElement().addEventListener(`click`, this._newEventClickHandler);

    replace(this._addButtonComponent, prevAddButtonComponent);
    remove(prevAddButtonComponent);

  }

  _handleModelEvent() {
    this.init();
  }
}
