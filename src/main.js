import InfoPresenter from "./presenter/info.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";
import StatisticsView from './view/statistics.js';
import {MenuItem, UpdateType, FilterType} from "./utils/const.js";
import {renderPosition, render, remove} from './utils/render.js';
import Api from "./api/index.js";

const AUTHORIZATION = `Basic random_string123`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
const api = new Api(END_POINT, AUTHORIZATION);

const sitePageBodyContainer = document.querySelector(`.page-body__page-main .page-body__container`);
const mainElement = document.querySelector(`.trip-main`);

let statisticsComponent = null;

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
      break;
  }
};

// Points data
const pointsModel = new PointsModel();
// Filter data
const filterModel = new FilterModel();
// Filter
const filterPresenter = new FilterPresenter(mainElement, filterModel, pointsModel);
// Info
const infoPresenter = new InfoPresenter(mainElement, pointsModel, handleMenuClick);
// Trip
const tripPresenter = new TripPresenter(pointsModel, filterModel, api);

infoPresenter.init();
filterPresenter.init();
tripPresenter.init();

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(UpdateType.INIT, points);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      // Действие, в случае успешной регистрации ServiceWorker
      console.log(`ServiceWorker available`); // eslint-disable-line
    }).catch(() => {
      // Действие, в случае ошибки при регистрации ServiceWorker
      console.error(`ServiceWorker isn't available`); // eslint-disable-line
    });
});
