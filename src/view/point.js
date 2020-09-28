import he from "he";
import {getShortTime, durationTime} from "../utils/date.js";
import {getSumPoint} from "../utils/sort.js";
import Abstract from './abstract.js';


// Шаблон для транспорта и города
const createTypeTemplate = (type, city) => {
  return `<div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${type[0].toUpperCase() + type.slice(1)} to ${he.encode(city)}</h3>`;
};

// Шаблон для даты
const createDateTemplate = (dateStart, dateEnd) => {
  return `<div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="2019-03-18T10:30">${getShortTime(dateStart)}</time>
              &mdash;
              <time class="event__end-time" datetime="2019-03-18T11:00">${getShortTime(dateEnd)}</time>
            </p>
            <p class="event__duration">${durationTime(dateEnd, dateStart)}</p>
          </div>`;
};

// Шаблон для цены
const createPriceTemplate = (points) => {
  return `<p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${getSumPoint(points)}</span>
          </p>`;
};

// Шаблон для доп.предложений
const createOfferTemplate = (offers) => {
  return `<h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">

          ${Object.values(offers).map((element) => `<li class="event__offer">
              <span class="event__offer-title">${element.title}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${element.price}</span>
            </li>`).slice(-3).join(``)}

          </ul>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>`;
};

export const createPointsTemplate = (points) => {
  const {type, city, offers, dateStart, dateEnd} = points;

  return `<ul class="trip-events__list">
            <li class="trip-events__item">
              <div class="event">
                ${createTypeTemplate(type, city)}
                ${createDateTemplate(dateStart, dateEnd)}
                ${createPriceTemplate(points)}
                ${createOfferTemplate(offers)}
              </div>
            </li>
          </ul>`;
};

export default class Point extends Abstract {
  constructor(points) {
    super();
    this._points = points;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createPointsTemplate(this._points);
  }

  _clickHandler(e) {
    e.preventDefault();
    this._callback.formSubmit();
  }

  setClickHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._clickHandler);
  }
}
