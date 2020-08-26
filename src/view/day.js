import {getFormatDate, getDateTime} from "../utils/date.js";
import Abstract from './abstract.js';

const createDayTemplate = (events, index) => {
  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="${getDateTime(events.date[0], `-`)}">${getFormatDate(events.date[0], true)}</time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>`);
};

export default class Day extends Abstract {
  constructor(points, index) {
    super();
    this._points = points;
    this.index = index;
  }

  getTemplate() {
    return createDayTemplate(this._points, this.index);
  }
}
