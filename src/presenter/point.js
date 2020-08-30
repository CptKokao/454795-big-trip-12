
import FormView from '../view/form.js';
import PointView from '../view/point.js';
import {renderPosition, render, replace, remove} from "../utils/render.js";

export default class Point {
  constructor(pointListElement, point) {
    this._formComponent = new FormView(point);
    this._pointComponent = new PointView(point);

    this._pointListElement = pointListElement;
    this._point = point;

    this._handleFavoriteChange = this._handleFavoriteChange.bind(this);
  }

  // Запуск метода для отрисовки всех маршрутов
  init() {
    this._renderPoint(this._pointListElement, this._point);
    this._formComponent.setFavoriteClcikHandler(this._handleFavoriteChange);
  }

  // Метод отрисовки одного маршрутов
  _renderPoint() {

    const replaceCardToForm = () => {
      replace(this._formComponent, this._pointComponent);
    };

    const replaceFormToCard = () => {
      replace(this._pointComponent, this._formComponent);
    };

    const onEscKeyDown = (e) => {
      if (e.key === `Escape` || e.key === `Esc`) {
        e.preventDefault();
        replaceFormToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    // Событие клик по кнопки маршрута
    this._pointComponent.setClickHandler(() => {
      replaceCardToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    // Событие submit на кнопки Save в форме редактирования
    this._formComponent.setFormSubmitHandler(() => {
      replaceFormToCard();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    render(this._pointListElement, this._pointComponent, renderPosition.BEFOREEND);
  }

  destroy() {
    remove(this._formComponent);
    remove(this._pointComponent);
  }

  // Метод при событие favorite
  _handleFavoriteChange() {
    console.log('123');

  }
}
