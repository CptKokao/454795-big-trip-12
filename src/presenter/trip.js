
import FormView from '../view/form.js';
import DayView from '../view/day.js';
import PointView from '../view/point.js';
import NoPointsView from '../view/no-points.js';
import {renderPosition, render, replace} from "../utils/render.js";
import {getDateTime} from "../utils/date.js";

export default class Trip {
  // Запуск метода для отрисовки всех маршрутов
  init(points) {
    this._renderListEvents(points);
  }

  // Метод отрисовки одного маршрутов
  _renderPoint(pointListElement, point) {
    const formComponent = new FormView(point);
    const pointComponent = new PointView(point);

    const replaceCardToForm = () => {
      replace(formComponent, pointComponent);
    };

    const replaceFormToCard = () => {
      replace(pointComponent, formComponent);
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

    render(pointListElement, pointComponent, renderPosition.BEFOREEND);
  }

  // Метод отрисовки дней и всех маршрутов
  _renderListEvents(pointsList) {
    const dayComponent = new DayView(pointsList);
    const noPointsComponent = new NoPointsView(pointsList);

    const eventElement = document.querySelector(`.trip-events`);
    const siteListDays = eventElement.querySelector(`.trip-days`);

    // Если маршрутов нет, то отрисовывает компонент NoPointsView
    if (pointsList.length === 0) {
      render(eventElement, noPointsComponent, renderPosition.BEFOREEND);
      return;
    }

    // Отрисовка дней
    render(siteListDays, dayComponent, renderPosition.BEFOREEND);

    // Для каждого дня добавляет маршруты
    const days = eventElement.querySelectorAll(`.trip-days__item`);
    for (let i = 0; i < days.length; i++) {
      for (let j = 0; j < pointsList.length; j++) {
        if (days[i].querySelector(`.day__date`).getAttribute(`datetime`) === getDateTime(pointsList[j].date[0], `-`)) {
          this._renderPoint(days[i].querySelector(`.trip-events__list`), pointsList[j]);
        }
      }
    }
  }
}

