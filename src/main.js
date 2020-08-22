import InfoView from './view/info.js';
import FilterView from './view/filter.js';
import FormView from './view/form.js';
import SortView from './view/sort.js';
import DayView from './view/day.js';
import PointView from './view/point.js';
import NoPointsView from './view/no-points.js';
import {generatePoint} from './mock/point.js';
import {renderPosition, render, getDateTime} from './utils.js';

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const mainElement = document.querySelector(`.trip-main`);
const eventElement = document.querySelector(`.trip-events`);
const siteListDays = eventElement.querySelector(`.trip-days`);

render(mainElement, new FilterView().getElement(), renderPosition.AFTERBEGIN);
render(mainElement, new InfoView(points).getElement(), renderPosition.AFTERBEGIN);
render(eventElement, new SortView().getElement(), renderPosition.AFTERBEGIN);

const renderPoint = (pointListElement, point) => {
  const formComponent = new FormView(point);
  const pointComponent = new PointView(point);

  const replaceCardToForm = () => {
    pointListElement.replaceChild(formComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToCard = () => {
    pointListElement.replaceChild(pointComponent.getElement(), formComponent.getElement());
  };

  const onEscKeyDown = (e) => {
    if (e.key === `Escape` || e.key === `Esc`) {
      e.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  // Событие клик по кнопки маршрута
  pointComponent.setClickHandler(() => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  // Событие submit на кнопки Save в форме редактирования
  formComponent.setFormSubmitHandler(() => {
    replaceFormToCard();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  render(pointListElement, pointComponent.getElement(), renderPosition.BEFOREEND);
};

const renderListEvents = (pointsList) => {
  if (pointsList.length === 0) {
    render(eventElement, new NoPointsView().getElement(), renderPosition.BEFOREEND);
    return;
  }

  render(siteListDays, new DayView(pointsList).getElement(), renderPosition.BEFOREEND);
  const days = eventElement.querySelectorAll(`.trip-days__item`);

  for (let i = 0; i < days.length; i++) {
    for (let j = 0; j < pointsList.length; j++) {
      if (days[i].querySelector(`.day__date`).getAttribute(`datetime`) === getDateTime(pointsList[j].date[0], `-`)) {
        renderPoint(days[i].querySelector(`.trip-events__list`), pointsList[j]);
      }
    }
  }
};

renderListEvents(points);
