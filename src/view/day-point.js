import {getShortTime, durationTime} from "../util.js";
// Шаблон для поинтов
const createPointTemplate = (type, city, date) => {

  return `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} to ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${getShortTime(date[0])}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${getShortTime(date[1])}</time>
          </p>
          <p class="event__duration">${durationTime(date[1], date[0])}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">20</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          <li class="event__offer">
            <span class="event__offer-title">Order Uber</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">20</span>
          </li>
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
};

// Шаблон для поинтов
const createDayTemplate = (day) => {

  return `<div class="day__info">
            <span class="day__counter">${day++}</span>
            <time class="day__date" datetime="2019-03-18">MAR 18</time>
          </div>`;
};

export const createDayandPointsTemplate = (point, day) => {
  const {type, city, date} = point;

  return `<li class="trip-days__item  day">
              ${createDayTemplate(day)}
            <ul class="trip-events__list">
              ${createPointTemplate(type, city, date)}
            </ul>
          </li>`;
};
