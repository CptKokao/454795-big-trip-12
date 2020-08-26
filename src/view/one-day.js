import Abstract from './abstract.js';

const createOneDayTemplate = (points) => {
  return new Array(points.length).fill().map(() =>
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter"></span>
        <time class="day__date" datetime=""></time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>`).join(``);
};

export default class OneDay extends Abstract {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createOneDayTemplate(this._points);
  }
}
