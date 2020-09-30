import he from "he";
import {Transports} from "../utils/const.js";
import {generateOffers, generateDescription, generatePhoto, updateOffers, types} from "../utils/point.js";
import {getDayMonthStamp, getDateTime, getShortTime} from "../utils/date.js";
import SmartView from "./smart.js";
import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_POINT = {
  isFavorite: false,
  price: ``,
  dateFrom: new Date(),
  dateTo: new Date(),
  type: Transports.TAXI,
  destination: {
    name: ``,
    description: ``,
    pictures: false
  },
  offers: []
};

const isChecked = (teplateElement, eventOffers) => {
  const checked = eventOffers.some((el) => el.title === teplateElement);

  if (!checked) {
    return ``;
  }

  return `checked`;
};

const getOffersList = (eventOffers, templateOffers) => {

  return new Array(templateOffers.length).fill().map((element, index) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${(templateOffers[index].title).toLowerCase().replace(/ /g, `-`)}" type="checkbox" name="${templateOffers[index].title}" ${isChecked(templateOffers[index].title, eventOffers)}>
      <label class="event__offer-label" for="event-offer-${(templateOffers[index].title).toLowerCase().replace(/ /g, `-`)}">
        <span class="event__offer-title">${templateOffers[index].title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${templateOffers[index].price}</span>
      </label>
    </div>`).join(` `);
};

const createPhotoTeplate = (pictures) => {
  if (!pictures) {
    return ``;
  }

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
       ${new Array(pictures.length).fill().map((element, index) => `<img class="event__photo" src="${pictures[index].src}" alt="${pictures[index].description}">`).join(`,`)}
      </div>
    </div>`);
};

const getDestinationsList = (destinations) => {

  return new Array(destinations.length).fill().map((element, index) => `<option value="${destinations[index].name}"></option>`).join();
};

const getDescriptionDestinationTemplate = (description, pictures) => {
  if (!description || !pictures) {
    return ``;
  }

  return (`
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
           <p class="event__destination-description">${description}</p>
            ${createPhotoTeplate(pictures)}
        </section>`
  );
};


const createFavoriteTemplate = (isFavorite) => {

  return (`
          <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
          <label class="event__favorite-btn" for="event-favorite-1">
            <span class="visually-hidden">Add to favorite</span>
              <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
              </svg>
          </label>`
  );
};

const createTypesList = (offers, typeSelected) => {
  const transportTypes = [];
  const activityTypes = [];

  for (const offer of offers) {
    if (offer.type.toUpperCase() in Transports) {
      transportTypes.push(`
        <div class="event__type-item">
          <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"  value="${offer.type}" ${typeSelected === offer.type ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${offer.type.slice(0, 1).toUpperCase() + offer.type.slice(1)}</label>
        </div>`
      );
    } else {
      activityTypes.push(`
        <div class="event__type-item">
          <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}" ${typeSelected === offer.type ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${offer.type.slice(0, 1).toUpperCase() + offer.type.slice(1)}</label>
        </div>`
      );
    }
  }


  return (`
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Transfer</legend>
    ${transportTypes.join(``)}
    </fieldset>
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Activity</legend>
        ${activityTypes.join(``)}
    </fieldset>`
  );
};

const createEditEventTemplate = (destinations, offers, point, isNew) => {
  const {
    isFavorite,
    price,
    dateFrom,
    dateTo,
    type,
    destination: {
      name,
      description,
      pictures
    },
    offers: eventOffers,
    isDisabled,
    isSaving,
    isDeleting
  } = point;

  const action = isDeleting ? `Deleting...` : `Delete`;

  const templateOffers = offers.find((offer) => offer.type === type.toLowerCase()).offers;

  const isChecktype = Object.values(Transports).some((el) => el === type);

  const startTime = getDayMonthStamp(dateFrom).replace(`,`, ``);
  const endTime = getDayMonthStamp(dateTo).replace(`,`, ``);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
              <div class="event__type-list">
                ${createTypesList(offers, type)}
              </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type[0].toUpperCase() + type.slice(1)}
              ${isChecktype ? `to` : `in`}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(name)}" list="destination-list-1" autocomplete="off">
            <datalist id="destination-list-1">
              ${getDestinationsList(destinations)}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startTime}" readonly>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endTime}" readonly>
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
              <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price"  step="1" min="1" autocomplete="off" value="${price}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? `disabled` : ``}> ${isSaving ? `Saving...` : `Save`}</button>
          <button class="event__reset-btn" type="reset">${isNew ? `Cancel` : action}</button>
          ${createFavoriteTemplate(isFavorite)}
          ${!isNew ? `<button class="event__rollup-btn" type="button" ${isDisabled ? `disabled` : ``}>` : `<button class="event__rollup-btn" type="button" style="display: none"`}
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
          <section class="event__details">
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
               <div class="event__available-offers">
                  ${getOffersList(eventOffers, templateOffers)}
               </div>
            </section>
              ${getDescriptionDestinationTemplate(description, pictures)}
          </section>
          </form>`
  );
};

export default class Form extends SmartView {
  constructor(destinations, offers, point) {
    super();

    this._isNew = false;

    if (!point) {
      point = BLANK_POINT;
      this._isNew = true;
    }

    this._data = Form.parsePointToData(point);
    this._callback = {};

    this._destinations = destinations;
    this._offers = offers;

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
    console.log(this._isNew);
    return createEditEventTemplate(this._destinations, this._offers, this._data, this._isNew);
  }

  reset(point) {
    this.updateData(Form.parsePointToData(point));
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
          defaultDate: this._data.dateFrom,
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
          defaultDate: this._data.dateTo,
          minDate: this._data.dateFrom,
          onChange: this._endDateChangeHandler
        }
    );
  }

  _startDateChangeHandler(selectedDates) {
    this.updateData({

      dateFrom: new Date(selectedDates[0])
    });
  }

  _endDateChangeHandler(selectedDates) {
    this.updateData({
      dateTo: new Date(selectedDates[0])
    });
  }

  // Метод вызывается при нажатии submit в форме
  _formSubmitHandler(e) {
    e.preventDefault();
    this._callback.formSubmit(Form.parseDataToPoint(this._data));
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
      price: Number(e.target.value)
    }, true);
  }

  // _destinationInputHandler(e) {
  //   e.preventDefault();
  //   console.log('test');
  //   this.updateData({
  //     city: e.target.value
  //   }, true);
  // }

  _destinationInputHandler(evt) {
    if (this._destinations.some((destination) => destination.name === evt.target.value)) {
      this.updateData(
          {
            destination: {
              name: evt.target.value,
              description: this._destinations.find((destination) => destination.name === evt.target.value).description,
              pictures: this._destinations.find((destination) => destination.name === evt.target.value).pictures
            },
            isDisabled: false
          });
    }
  }

  _offerChangeHandler(evt) {

    if (evt.target.nodeName !== `INPUT`) {
      return;
    }

    const offers = this._data.offers.map((offer) => Object.assign({}, offer));
    const offerIndex = offers.findIndex((it) => it.title === evt.target.name);

    if (offerIndex < 0) {
      const templateOffers = this._offers.find((offer) => offer.type === this._data.type.toLowerCase()).offers;
      const newOffer = templateOffers.find((it) => it.title === evt.target.name);
      if (newOffer) {
        offers.push(newOffer);
      }
    } else {
      offers.splice(offerIndex, 1);
    }

    this.updateData(
        {
          offers,
          isDisabled: false
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
}
