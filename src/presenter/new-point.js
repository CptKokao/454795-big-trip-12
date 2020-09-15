import FormView from "../view/form.js";
import {generateId} from "../mock/point.js";
import {remove, render, renderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../utils/const.js";

export default class NewPoint {
  constructor(listDaysComponent, changeData) {
    this._listDaysComponent = listDaysComponent;
    this._changeData = changeData;

    this._formComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._formComponent !== null) {
      return;
    }
    this._formComponent = new FormView(true);
    this._formComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._formComponent.setDeleteClickHandler(this._handleDeleteClick);

    render(this._listDaysComponent, this._formComponent, renderPosition.AFTERBEGIN);
    document.querySelector(`.trip-main__event-add-btn`).disabled = true;

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._formComponent === null) {
      return;
    }

    remove(this._formComponent);
    this._formComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        // Пока у нас нет сервера, который бы после сохранения
        // выдывал честный id задачи, нам нужно позаботиться об этом самим
        Object.assign({id: generateId()}, point)
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
      document.querySelector(`.trip-main__event-add-btn`).disabled = false;
    }
  }
}