import {getFormatDate, createElement} from "../utils.js";


const createInfoTemplate = (points) => {
  const destinations = new Array(points.length).fill().map((element, index) => points[index].city).join(`,`).replace(/,/g, ` &mdash; `);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${destinations}</h1>

        <p class="trip-info__dates">${getFormatDate(points[1].date[0])}&nbsp;&mdash;&nbsp;${getFormatDate(points[14].date[1])}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${Object.values(points).map((element) => element.cost).reduce((acc, el) => acc + el)}</span>
      </p>
    </section>`
  );
};

export default class Info {
  constructor(points) {
    this._points = points;
    this._element = null;
  }

  getTemplate() {
    return createInfoTemplate(this._points);
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

