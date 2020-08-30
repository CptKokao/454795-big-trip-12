
import FormView from '../view/form.js';
import PointView from '../view/point.js';
import {renderPosition, render, replace} from "../utils/render.js";

export default class Point {
  constructor(pointListElement, point) {
    this._pointListElement = pointListElement;
    this._point = point;
  }

  // Запуск метода для отрисовки всех маршрутов
  init() {
    this._renderPoint(this._pointListElement, this._point);
  }

  // Метод отрисовки одного маршрутов
  _renderPoint() {

    const formComponent = new FormView(this._point);
    const pointComponent = new PointView(this._point);

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

    render(this._pointListElement, pointComponent, renderPosition.BEFOREEND);
  }
}
