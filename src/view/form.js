import he from "he";
import {generateOffers, generateDescription, generatePhoto} from "../utils/common.js";
import {getDateTime, getShortTime} from "../utils/date.js";
import SmartView from "./smart.js";
import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const EMPTY_POINT = {
  type: `taxi`,
  city: ``,
  cost: ``,
  offers: generateOffers(`Taxi`),
  description: generateDescription(),
  photo: generatePhoto(),
  dateStart: new Date(),
  dateEnd: new Date(),
  isFavorite: false
};

const createTypeTemplate = (type) => {

  return `<div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>

                <div class="event__type-item">
                  <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                  <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                  <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                  <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                  <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                  <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                  <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                  <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                </div>
              </fieldset>

              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>

                <div class="event__type-item">
                  <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                  <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                  <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                  <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                </div>
              </fieldset>
            </div>
          </div>`;
};

// Шаблон для фото и описания
const createDestinationTemplate = (photo, description) => {

  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${Object.values(photo).map((element) => `<img class="event__photo" src="${element.src}" alt="${element.description}">`).join(``)}
              </div>
            </div>
          </section>`;
};

// Шаблон для доп.предложений
const createOfferTemplate = (offers, isDisabled) => {

  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">

            ${Object.values(offers).map((element) => `<div class="event__offer-selector">
                <input class="event__offer-checkbox  visually-hidden" id="event-offer-${(element.title).split(`&nbsp;`).pop()}-1" type="checkbox" name="event-offer-${(element.title).split(`&nbsp;`).pop()}" ${element.isChecked ? `checked` : ``} ${isDisabled ? `disabled` : ``}>
                <label class="event__offer-label" for="event-offer-${(element.title).split(`&nbsp;`).pop()}-1">
                  <span class="event__offer-title">${(element.title)}</span>
                  &plus;
                  &euro;&nbsp;<span class="event__offer-price">${element.price}</span>
                </label>
              </div>`).join(``)}

          </section>`;
};


const createFormTemplate = (point, isNew) => {
  const {
    type,
    city,
    dateStart,
    dateEnd,
    cost,
    offers,
    photo,
    description,
    isFavorite,
    isDisabled,
    isSaving,
    isDeleting} = point;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
        <header class="event__header">
          ${createTypeTemplate(type)}

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type} to
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(city)}" list="destination-list-1" ${isDisabled ? `disabled` : ``} required>
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
              <option value="Saint Petersburg"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateTime(dateStart)} ${getShortTime(dateStart)}" ${isDisabled ? `disabled` : ``}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateTime(dateEnd)} ${getShortTime(dateEnd)}" ${isDisabled ? `disabled` : ``}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">${cost}</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${he.encode(cost.toString())}" ${isDisabled ? `disabled` : ``} required>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>${isSaving ? `saving...` : `save`}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>${isDeleting ? `deleting...` : `delete`}</button>

          <input id="event-favorite" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>
          ${!isNew ? `<button class="event__rollup-btn" type="button">` : ``}
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createOfferTemplate(offers)}
          ${!isNew ? createDestinationTemplate(photo, description) : ``}
        </section>`
  );
};

export default class Form extends SmartView {
  constructor(isNew, point = EMPTY_POINT) {
    super();
    this._data = Form.parsePointToData(point);
    this._callback = {};
    this._isNew = isNew;

    this._startDatepicker = null;
    this._endDatepicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._clickCloseHandler = this._clickCloseHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._costClickHandler = this._costClickHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);

    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setEndDatepicker();
  }

  getTemplate() {

    return createFormTemplate(this._data, this._isNew);
  }

  reset() {
    this.updateData(
        Form.parsePointToData(this._data)
    );
  }

  _formDeleteClickHandler(e) {
    e.preventDefault();
    this._callback.deleteClick(Form.parseDataToPoint(this._data));
    document.querySelector(`.trip-main__event-add-btn`).disabled = false;
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }


  _setStartDatepicker() {
    if (this._datepicker) {
      // В случае обновления компонента удаляем вспомогательные DOM-элементы,
      // которые создает flatpickr при инициализации
      this._datepicker.destroy();
      this._datepicker = null;
    }

    // flatpickr есть смысл инициализировать только в случае,
    // если поле выбора даты доступно для заполнения
    this._startDatepicker = flatpickr(this.getElement().querySelector(`#event-start-time-1`),
        {
          dateFormat: `d/m/y H:i`,
          enableTime: true,
          time24hr: true,
          defaultDate: this._data.dateStart,
          onChange: this._startDateChangeHandler
        }
    );
  }

  _setEndDatepicker() {
    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._endDatepicker = flatpickr(this.getElement().querySelector(`#event-end-time-1`),
        {
          dateFormat: `d/m/y H:i`,
          enableTime: true,
          time24hr: true,
          defaultDate: this._data.dateEnd,
          minDate: this._data.dateStart,
          onChange: this._endDateChangeHandler
        }
    );
  }

  _startDateChangeHandler(selectedDates) {
    this.updateData({

      dateStart: new Date(selectedDates[0])
    }, true);
  }

  _endDateChangeHandler(selectedDates) {
    this.updateData({
      dateEnd: new Date(selectedDates[0])
    }, true);
  }

  // Метод вызывается при нажатии submit в форме
  _formSubmitHandler(e) {
    e.preventDefault();
    this._callback.formSubmit(this._data);
    // this._callback.formSubmit(Form.parseDataToPoint(this._data));
    document.querySelector(`.trip-main__event-add-btn`).disabled = false;
  }

  // Метод вызывается при нажатии ^ в форме
  _clickCloseHandler(e) {
    e.preventDefault();
    this._callback.close();
  }

  // Вызывыется из point.js при нажатии на submit в форме
  setFormSubmitHandler(callback) {
    // callback - эта функция которая записывается в объект this._callback
    // для того чтобы осталась ссылка на нее, это дает возможность удалить addEventListener
    this._callback.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  // Вызывыется из point.js при нажатии на ^ в форме
  setFormClickCloseHandler(callback) {
    this._callback.close = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickCloseHandler);
  }

  // Метод вызывается при изменения типа транспорта
  _typeChangeHandler(e) {
    e.preventDefault();
    this.updateData({
      type: e.target.value,
      offers: generateOffers(this._data.type),
      description: generateDescription()
    });
  }

  // Метод вызывается при изменения favorite
  _favoriteClickHandler(e) {
    e.preventDefault();
    this.updateData({
      isFavorite: !this._data.isFavorite
    });
  }

  // Метод вызывается при изменения price
  _costClickHandler(e) {
    e.preventDefault();
    this.updateData({
      cost: Number(e.target.value)
    }, true);
  }

  // Метод вызывается при изменения destination(city)
  _destinationInputHandler(e) {
    e.preventDefault();
    this.updateData({
      city: e.target.value
    }, true);
  }

  // Хранятся локальные обработчики
  _setInnerHandlers() {
    // Обработчик на favorite
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);

    // Обработчик на price
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._costClickHandler);

    // Обработчик на destination(city)
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`input`, this._destinationInputHandler);

    // Обработчик на type(тип транспорта)
    const typeContainers = this.getElement().querySelectorAll(`.event__type-input`);
    for (const container of typeContainers) {
      container.addEventListener(`input`, this._typeChangeHandler);
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setStartDatepicker();
    this._setEndDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormClickCloseHandler(this._callback.close);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  static parsePointToData(point) {
    return Object.assign(
        {},
        point,
        {
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        }
    );
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }
}
