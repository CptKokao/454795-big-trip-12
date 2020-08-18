import {createElement, getFormatDate, getDateTime} from "../utils.js";

const getSortDatesEndDaysForTemplate = (events) => {
  const daysForTemplate = {};
  for (let i = 0; i < events.length; i++) {
    let key = getFormatDate(events[i].date[0], true);
    daysForTemplate[key] = getDateTime(events[i].date[0], `-`);
  }

  const days = Object.keys(daysForTemplate).sort();
  const dates = Object.values(daysForTemplate).sort();

  return {days, dates};
};

const createDayTemplate = (events) => {
  const {days, dates} = getSortDatesEndDaysForTemplate(events);

  return new Array(days.length).fill().map((element, index) =>
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="${dates[index]}">${days[index].toUpperCase()}</time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>`);
};

export default class Day {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return createDayTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
