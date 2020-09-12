import {generatePoint} from './mock/point.js';
import InfoPresenter from "./presenter/info.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import PointsModel from "./model/points.js";
import FilterModel from "./model/filter.js";

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const mainElement = document.querySelector(`.trip-main`);

// Filter
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter(mainElement, filterModel, pointsModel);
filterPresenter.init();

// Info
const infoComponent = new InfoPresenter(mainElement, pointsModel);
infoComponent.init();

// Trip
const tripPresenter = new TripPresenter(pointsModel, filterModel);
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (e) => {
  e.preventDefault();
  tripPresenter.createPoint();
});
