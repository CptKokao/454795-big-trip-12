import InfoView from '../view/info.js';
import TabsView from '../view/tabs.js';
import {renderPosition, render, replace, remove} from '../utils/render.js';

export default class Info {
  constructor(pointListElement, pointsModel) {
    this._pointListElement = pointListElement;
    this._pointsModel = pointsModel;

    this._tabsComponent = new TabsView();
    this._infoComponent = null;
    this._tripInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTabs();
    this._renderInfo();
  }

  // Отрисовка Info
  _renderInfo() {
    const prevInfoComponent = this._tripInfoComponent;
    this._tripInfoComponent = new InfoView(this._pointsModel.getPoints());

    if (prevInfoComponent === null) {
      render(this._pointListElement, this._tripInfoComponent, renderPosition.AFTERBEGIN);
      return;
    }

    replace(this._tripInfoComponent, prevInfoComponent);
    remove(prevInfoComponent);
  }

  // Отрисовка Tabs
  _renderTabs() {
    const tripContainer = this._pointListElement.querySelector(`.trip-controls`);
    render(tripContainer, this._tabsComponent, renderPosition.AFTERBEGIN);
  }

  _handleModelEvent() {
    this.init();
  }
}
