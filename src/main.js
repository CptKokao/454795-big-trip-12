import InfoView from './view/info.js';
import FilterView from './view/filter.js';
import FormView from './view/form.js';
import SortView from './view/sort.js';
import DayView from './view/day.js';
import {generatePoint} from './mock/point.js';
import {renderPosition, render} from './utils.js';

const POINT_COUNT = 15;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const mainElement = document.querySelector(`.trip-main`);
const eventElement = document.querySelector(`.trip-events`);
const siteListDays = eventElement.querySelector(`.trip-days`);

render(mainElement, new FilterView().getElement(), renderPosition.AFTERBEGIN);

render(mainElement, new InfoView(points).getElement(), renderPosition.AFTERBEGIN);

render(eventElement, new FormView(points[0]).getElement(), renderPosition.AFTERBEGIN);

render(eventElement, new SortView().getElement(), renderPosition.AFTERBEGIN);

render(siteListDays, new DayView(points, POINT_COUNT).getElement(), renderPosition.BEFOREEND);
