
import FormView from '../view/form.js';
import PointView from '../view/point.js';
import {renderPosition, render, replace, remove} from "../utils/render.js";

export default class Point {
  constructor(pointListElement, changeData, listDaysComponent) {

    this._formComponent = null;
    this._pointComponent = null;

    this._changeData = changeData;
    this.listDaysComponent = listDaysComponent;
    this._pointListElement = pointListElement;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  // Запуск метода для отрисовки всех маршрутов
  init(point) {
    this._point = point;

    const prevFormComponent = this._formComponent;
    const prevPointEditComponent = this._pointComponent;

    this._formComponent = new FormView(point);
    this._pointComponent = new PointView(point);



    if (prevFormComponent === null || prevPointEditComponent === null) {
      this._renderPoint(this._pointListElement, point);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this.listDaysComponent.getElement().contains(prevFormComponent.getElement())) {
      replace(this._formComponent, prevFormComponent);
    }

    if (this.listDaysComponent.getElement().contains(prevPointEditComponent.getElement())) {
      replace(this._pointComponent, prevPointEditComponent);
    }

    remove(prevFormComponent);
    remove(prevPointEditComponent);
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
    this._formComponent.setFormSubmitHandler((point) => {
      // Вызывает this.init(), для отрисовки изменения
      this._changeData(point);

      replaceFormToCard();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    render(this._pointListElement, this._pointComponent, renderPosition.BEFOREEND);
  }

  destroy() {
    remove(this._formComponent);
    remove(this._pointComponent);
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._point,
            {
              isFavorite: !this._point.isFavorite
            }
        )
    );
  }
}
