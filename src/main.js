import {generatePoint} from './mock/point.js';
import InfoPresenter from "./presenter/info.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import StatisticsView from './view/statistics.js';
import {MenuItem, UpdateType, FilterType} from "./utils/const.js";
import {renderPosition, render, remove} from './utils/render.js';
import Api from "./api.js";

const AUTHORIZATION = `Basic randomstring`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);

api.getPoints().then((points) => {
  console.log(points);
  // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
  // а ещё на сервере используется snake_case, а у нас camelCase.
  // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
  // Есть вариант получше - паттерн "Адаптер"
});

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(generatePoint);
console.log(points);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const sitePageBodyContainer = document.querySelector(`.page-body__page-main .page-body__container`);

const mainElement = document.querySelector(`.trip-main`);
let statisticsComponent = null;

// Filter
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(mainElement, filterModel, pointsModel);
filterPresenter.init();

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_EVENT:
      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init();
      tripPresenter.createPoint();
      infoPresenter.setMenuItemAddEvent();
      if (statisticsComponent !== null) {
        remove(statisticsComponent);
        statisticsComponent = null;
      }
      break;
    case MenuItem.TABLE:
      tripPresenter.destroyFormNewPoint();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.destroy();
      tripPresenter.init();
      infoPresenter.setMenuItemTable();
      if (statisticsComponent !== null) {
        remove(statisticsComponent);
        statisticsComponent = null;
      }
      break;
    case MenuItem.STATISTICS:
      tripPresenter.destroyFormNewPoint();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.destroy();
      infoPresenter.setMenuItemStats();
      if (statisticsComponent === null) {
        statisticsComponent = new StatisticsView(pointsModel.getPoints());
        render(sitePageBodyContainer, statisticsComponent, renderPosition.BEFOREEND);
      }
      // Скрыть доску
      // Показать статистику
      break;
  }
};
// Info
const infoPresenter = new InfoPresenter(mainElement, pointsModel, handleMenuClick);
infoPresenter.init();

// Trip
const tripPresenter = new TripPresenter(pointsModel, filterModel);
tripPresenter.init();
