
import FormView from '../view/form.js';
import PointView from '../view/point.js';
import {renderPosition, render, replace, remove} from "../utils/render.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Point {
  constructor(pointListElement, changeData, listDaysComponent, changeMode) {

    this._changeData = changeData;
    this._changeMode = changeMode;

    this._formComponent = null;
    this._pointComponent = null;
    this._mode = Mode.DEFAULT;

    this.listDaysComponent = listDaysComponent;
    this._pointListElement = pointListElement;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._setClickHandler = this._setClickHandler.bind(this);
    this._setSubmitHandler = this._setSubmitHandler.bind(this);

  }

  // Запуск метода для отрисовки всех маршрутов
  init(point) {
    this._point = point;

    const prevFormComponent = this._formComponent;
    const prevPointEditComponent = this._pointComponent;

    this._formComponent = new FormView(this._point);
    this._pointComponent = new PointView(this._point);

    // Событие клик по кнопки маршрута
    this._pointComponent.setClickHandler(this._setClickHandler);

    // Событие click на кнопки ^ в форме редактирования
    this._formComponent.setFormClickCloseHandler();

    // Событие submit на кнопки Save в форме редактирования
    this._formComponent.setFormSubmitHandler(this._setSubmitHandler);

    if (prevFormComponent === null || prevPointEditComponent === null) {
      this._renderPoint(point);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this._mode === Mode.DEFAULT) {
      replace(this._formComponent, prevFormComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointComponent, prevPointEditComponent);
    }

    remove(prevFormComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  // Метод отрисовки одного маршрутов
  _renderPoint() {

    // Событие клик по кнопки маршрута
    this._pointComponent.setClickHandler(this._setClickHandler);

    render(this._pointListElement, this._pointComponent, renderPosition.BEFOREEND);
  }

  destroy() {
    remove(this._formComponent);
    remove(this._pointComponent);
  }

  _replaceCardToForm() {
    replace(this._formComponent, this._pointComponent);
    this._changeMode();
    this._mode = Mode.EDITING;
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceFormToCard() {
    replace(this._pointComponent, this._formComponent);
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _setClickHandler() {
    this._replaceCardToForm();
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _setSubmitHandler(point) {
    // Вызывает this.init(), для отрисовки изменения
    this._changeData(point);

    this._replaceFormToCard();
    // document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(e) {
    if (e.key === `Escape` || e.key === `Esc`) {
      e.preventDefault();
      this._replaceFormToCard();

      // Сброс при выходе
      this._formComponent.reset(this._point);
      // document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
