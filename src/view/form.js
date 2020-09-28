import he from "he";
import {upperFirst, getConcatNameOffers} from "../utils/common.js";
import {generateOffers, generateDescription, generatePhoto, updateOffers, types} from "../utils/point.js";
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


const createTypeActivityTemplate = (data) => {
  return (Object
    .values(types.activity)
    .map((activity) => {
      return (
        `<div class="event__type-item">
          <input id="event-type-${activity}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${activity}" ${data.type.toLowerCase() === activity ? `checked` : ``} ${data.isDisabled ? `disabled` : ``}>
          <label class="event__type-label  event__type-label--${activity}" for="event-type-${activity}-1">${upperFirst(activity)}</label>
        </div>`
      );
    })
  ).join(``);
};

const createTypeTransferTemplate = (data) => {
  return (Object
    .values(types.transfer)
    .map((transfer) => {
      const type = transfer === `check` ? `check-in` : transfer;
      return (
        `<div class="event__type-item">
          <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${data.type === transfer ? `checked` : ``} ${data.isDisabled ? `disabled` : ``}>
          <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${upperFirst(type)}</label>
        </div>`
      );
    })
  ).join(``);
};

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
const createOffers = (data) => {
  if (data) {
    return (Object
      .values(data.offers)
      .map((item) => {
        const nameForAttr = getConcatNameOffers(item.title);
        return (
          `<div class="event__offer-selector">
            <input class="event__offer-checkbox visually-hidden" id="${nameForAttr}-1" type="checkbox" name="${item.title}" ${item.isEnabled ? `checked` : ``} disaled=${item.isDisabled ? `true` : `false`}>
              <label class="event__offer-label" for="${nameForAttr}-1">
                <span class="event__offer-title">${item.title}</span>
                  &plus;
                  &euro;&nbsp;<span class="event__offer-price">${item.price}
                </span>
            </label>
          </div>`
        );
      }).join(``)
    );
  }

  return ``;
};

const createOffersTemplate = (data = {}) => {
  const offers = createOffers(data);
  if (offers) {
    return (
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${offers}
        </div>
      </section>`
    );
  }

  return ``;
};

const createFormTemplate = (point, isNew) => {
  const {
    type,
    city,
    dateStart,
    dateEnd,
    cost,
    photo,
    description,
    isFavorite,
    isDisabled,
    isSaving,
    isDeleting} = point;

  const typeActivityTemplate = createTypeActivityTemplate(point);
  const typeTransferTemplate = createTypeTransferTemplate(point);
  const offertsTemplate = createOffersTemplate(point);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">

            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? `disabled` : ``}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Transfer</legend>
                ${typeActivityTemplate}
              </fieldset>
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Activity</legend>
                ${typeTransferTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${upperFirst(type)} to
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(city)}" list="destination-list-1" ${isDisabled ? `disabled` : ``} required>
            <datalist id="destination-list-1">

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
            <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${he.encode(cost.toString())}" ${isDisabled ? `disabled` : ``} required>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}>${isSaving ? `Saving...` : `Save`}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>${isNew ? `Cancel` : `${isDeleting ? `Deleting...` : `Delete`}`}</button>

          <input id="event-favorite" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>
          ${!isNew ? `<button class="event__rollup-btn" type="button" ${isDisabled ? `disabled` : ``}>` : `<button class="event__rollup-btn" type="button" style="display: none"`}
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offertsTemplate}
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
    this._offerChangeHandler = this._offerChangeHandler.bind(this);

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

  _typeChangeHandler(e) {
    e.preventDefault();
    this.updateData({
      type: e.target.value,
      offers: generateOffers(this._data.type),
      description: generateDescription()
    });
  }

  _favoriteClickHandler(e) {
    e.preventDefault();
    this.updateData({
      isFavorite: !this._data.isFavorite
    });
  }

  _costClickHandler(e) {
    e.preventDefault();
    this.updateData({
      cost: Number(e.target.value)
    }, true);
  }

  _destinationInputHandler(e) {
    e.preventDefault();
    this.updateData({
      city: e.target.value
    }, true);
  }

  _offerChangeHandler(e) {
    e.preventDefault();

    let nameInput;

    if (e.target.tagName === `LABEL`) {
      nameInput = e.target.previousElementSibling.name;
    } else if (e.target.tagName === `SPAN`) {
      nameInput = e.target.parentElement.previousElementSibling.name;
    } else {
      return;
    }

    const allOffers = Object.values(this._data.offers);
    const newOffers = updateOffers(allOffers, nameInput);

    this.updateData({
      offers: newOffers
    });
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._costClickHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`input`, this._destinationInputHandler);

    const typeContainers = this.getElement().querySelectorAll(`.event__type-input`);
    for (const container of typeContainers) {
      container.addEventListener(`input`, this._typeChangeHandler);
    }

    const offers = this.getElement().querySelectorAll(`.event__offer-selector`);
    for (const offer of offers) {
      offer.addEventListener(`click`, this._offerChangeHandler);
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

  reset(point) {
    this.updateData(Form.parsePointToData(point));
  }
}

