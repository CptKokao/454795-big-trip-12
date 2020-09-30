import {getFormatDate, getDateTime} from "../utils/date.js";
import {remove} from "../utils/render.js";
import Abstract from './abstract.js';

const createDayTemplate = (events, index) => {

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${events ? index + 1 : ``}</span>
        <time class="day__date" datetime="${events ? getDateTime(events.dateFrom) : ``}">${events ? getFormatDate(events.dateFrom, true) : ``}</time>
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

  destroy() {
    remove(this);
  }

}
