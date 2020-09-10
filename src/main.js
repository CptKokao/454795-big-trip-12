import InfoView from './view/info.js';
import FilterView from './view/filter.js';

import {generatePoint} from './mock/point.js';
import {renderPosition, render} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";
import PointsModel from "./model/points.js";

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const mainElement = document.querySelector(`.trip-main`);

const filterComponent = new FilterView();
const infoComponent = new InfoView(points);

render(mainElement, filterComponent, renderPosition.AFTERBEGIN);
render(mainElement, infoComponent, renderPosition.AFTERBEGIN);

const tripPresenter = new TripPresenter(pointsModel);
tripPresenter.init();
