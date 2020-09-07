import {getFormatDate} from "../utils/date.js";
import Abstract from './abstract.js';

const createInfoTemplate = (points) => {
  if (points.length === 0) {
    return (
      `<section class="trip-main__trip-info  trip-info">
            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">0</span>
            </p>
      </section>`
    );
  } else {
    const destinations = new Array(points.length).fill().map((element, index) => points[index].city).join(`,`).replace(/,/g, ` &mdash; `);

    return (
      `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${destinations}</h1>

          <p class="trip-info__dates">${getFormatDate(points[1].dateStart)}&nbsp;&mdash;&nbsp;${getFormatDate(points[points.length - 1].dateEnd)}</p>
        </div>

        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${Object.values(points).map((element) => element.cost).reduce((acc, el) => acc + el)}</span>
        </p>
      </section>`
    );
  }
};

export default class Info extends Abstract {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createInfoTemplate(this._points);
  }
}

