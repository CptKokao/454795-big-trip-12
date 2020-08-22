import {getShortTime, durationTime} from "../utils.js";
import Abstract from './abstract.js';


// Шаблон для транспорта и города
const createTypeTemplate = (type, city) => {
  return `<div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${type} to ${city}</h3>`;
};

// Шаблон для даты
const createDateTemplate = (date) => {
  return `<div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="2019-03-18T10:30">${getShortTime(date[0])}</time>
              &mdash;
              <time class="event__end-time" datetime="2019-03-18T11:00">${getShortTime(date[1])}</time>
            </p>
            <p class="event__duration">${durationTime(date[1], date[0])}</p>
          </div>`;
};

// Шаблон для цены
const createPriceTemplate = (cost) => {
  return `<p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${cost}</span>
          </p>`;
};

// Шаблон для доп.предложений
const createOfferTemplate = (offers) => {
  return `<h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">

          ${Object.values(offers).map((element) => `<li class="event__offer">
              <span class="event__offer-title">${element.title}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${element.cost}</span>
            </li>`).slice(-2).join(``)}

          </ul>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>`;
};

export const createPointsTemplate = (points) => {
  const {type, city, date, cost, offers} = points;

  return `<ul class="trip-events__list">
            <li class="trip-events__item">
              <div class="event">
                ${createTypeTemplate(type, city)}
                ${createDateTemplate(date)}
                ${createPriceTemplate(cost)}
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

