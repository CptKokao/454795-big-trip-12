import FormView from "../view/form.js";
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

  init(destinations, offers) {

    if (this._formComponent !== null) {
      return;
    }

    this._destinations = destinations;
    this._offers = offers;

    this._formComponent = new FormView(this._destinations, this._offers);
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

  setSaving() {
    this._formComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._formComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._formComponent.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MAJOR,
        Object.assign(point)
    );
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
