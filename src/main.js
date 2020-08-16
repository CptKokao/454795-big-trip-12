import InfoView from './view/info.js';
import FilterView from './view/filter.js';
import FormView from './view/form.js';
import SortView from './view/sort.js';
import DayView from './view/day.js';
import PointView from './view/point.js';
import {generatePoint} from './mock/point.js';
import {renderPosition, render, getYearMonthDayStamp} from './utils.js';

const POINT_COUNT = 15;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const mainElement = document.querySelector(`.trip-main`);
const eventElement = document.querySelector(`.trip-events`);
const siteListDays = eventElement.querySelector(`.trip-days`);

render(mainElement, new FilterView().getElement(), renderPosition.AFTERBEGIN);

render(mainElement, new InfoView(points).getElement(), renderPosition.AFTERBEGIN);

// render(eventElement, new FormView(points[0]).getElement(), renderPosition.AFTERBEGIN);

render(eventElement, new SortView().getElement(), renderPosition.AFTERBEGIN);

render(siteListDays, new DayView(points).getElement(), renderPosition.BEFOREEND);


const renderPoint = (pointListElement, point) => {
  const formComponent = new FormView(point);
  const pointComponent = new PointView(point);

  const replaceCardToForm = () => {
    pointListElement.replaceChild(formComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToForm = () => {
    pointListElement.replaceChild(pointComponent.getElement(), formComponent.getElement());
  };

  pointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceCardToForm();
  });

  formComponent.getElement().querySelector(`form`).addEventListener(`submit`, (e) => {
    e.preventDefault();
    replaceFormToForm();
  });

  render(pointListElement, pointComponent.getElement(), renderPosition.BEFOREEND);
};

const days = eventElement.querySelectorAll(`.trip-days__item`);

for (let i = 0; i < days.length; i++) {
  for (let j = 0; j < points.length; j++) {
    if (days[i].querySelector(`.day__date`).getAttribute(`datetime`) === getYearMonthDayStamp(points[j].date[0])) {
      renderPoint(days[i].querySelector(`.trip-events__list`), points[j]);
    }
  }
}
