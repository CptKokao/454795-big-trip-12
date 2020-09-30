
import FormView from '../view/form.js';
import PointView from '../view/point.js';
import {renderPosition, render, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../utils/const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

export default class Point {
  constructor(pointListElement, viewAction, listDaysComponent, changeMode, destinations, offers) {

    this._viewAction = viewAction;
    this._changeMode = changeMode;

    this._offers = offers;
    this._destinations = destinations;

    this._formComponent = null;
    this._pointComponent = null;
    this._mode = Mode.DEFAULT;

    this.listDaysComponent = listDaysComponent;
    this._pointListElement = pointListElement;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onCloseForm = this._onCloseForm.bind(this);
    this._setClickHandler = this._setClickHandler.bind(this);
    this._setSubmitHandler = this._setSubmitHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);

  }

  // Запуск метода для отрисовки всех маршрутов
  init(point) {
    this._point = point;

    const prevFormComponent = this._formComponent;
    const prevPointEditComponent = this._pointComponent;

    this._formComponent = new FormView(this._destinations, this._offers, this._point);
    this._pointComponent = new PointView(this._point);

    // Событие клик по кнопки маршрута
    this._pointComponent.setClickHandler(this._setClickHandler);

    // Событие click на кнопки ^ в форме редактирования
    this._formComponent.setFormClickCloseHandler(this._onCloseForm);

    // Событие submit на кнопки Save в форме редактирования
    this._formComponent.setFormSubmitHandler(this._setSubmitHandler);

    // Событие click на кнопки Delete в форме редактирования
    this._formComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevFormComponent === null || prevPointEditComponent === null) {
      this._renderPoint(point);
      return;
    }

    // Проверка на наличие в DOM необходима,
    // чтобы не пытаться заменить то, что не было отрисовано
    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointEditComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._formComponent, prevFormComponent);
    }

    remove(prevFormComponent);
    remove(prevPointEditComponent);
  }

  setViewState(state) {

    const resetFormState = () => {
      this._formComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    switch (state) {
      case State.SAVING:
        this._formComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._formComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._formComponent.shake(resetFormState);
        this._formComponent.shake(resetFormState);
        break;
    }
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _handleDeleteClick(point) {
    this._viewAction(
        UserAction.DELETE_POINT,
        UpdateType.MAJOR,
        point
    );
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
    document.querySelector(`.trip-main__event-add-btn`).disabled = false;
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _setSubmitHandler(point) {
    this._viewAction(
        UserAction.UPDATE_POINT,
        UpdateType.MAJOR,
        point
    );

    this._replaceFormToCard();
  }

  // Метод закрытие формы по нажатию Esc
  _onEscKeyDown(e) {
    if (e.key === `Escape` || e.key === `Esc`) {
      e.preventDefault();
      // Сброс при выходе
      this._formComponent.reset(this._point);
      this._replaceFormToCard();
    }
  }

  // Метод закрытие формы по нажатию кнопку закрытия ^
  _onCloseForm() {
    this._replaceFormToCard();
  }
}
