import he from "he";
import {getFormatDate} from "../utils/date.js";
import Abstract from './abstract.js';

const createInfoTemplate = (points, sortPoints) => {
  if (points.length === 0) {
    return (
      `<section class="trip-main__trip-info  trip-info">
            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">0</span>
            </p>
      </section>`
    );
  } else {
    // Максимальное кол-во городов без ...
    const MAX_CITY = 3;

    // Массив городов
    const destinations = new Array(points.length).fill().map((element, index) => points[index].destination.name);

    const getCitiesForInfo = (cities) => {
      let citiesForInfo = [];

      if (cities.length > MAX_CITY) {

        citiesForInfo.push(cities[0]);
        citiesForInfo.push(`...`);
        citiesForInfo.push(cities[cities.length - 1]);
        citiesForInfo = citiesForInfo.join(`,`).replace(/,/g, ` — `);
      } else {

        citiesForInfo = destinations.join(`,`).replace(/,/g, ` — `);
      }
      return citiesForInfo;
    };

    return (
      `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${he.encode(getCitiesForInfo(destinations))}</h1>

          <p class="trip-info__dates">${getFormatDate(sortPoints[0].dateFrom)}&nbsp;&mdash;&nbsp;${getFormatDate(sortPoints[sortPoints.length - 1].dateTo)}</p>
        </div>

        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${Object.values(points).map((element) => element.price).reduce((acc, el) => acc + el)}</span>
        </p>
      </section>`
    );
  }
};

export default class Info extends Abstract {
  constructor(points) {
    super();
    this._points = points;
    this._sortPoints = this.getDayPointArr(points);
  }

  getTemplate() {
    return createInfoTemplate(this._points, this._sortPoints);
  }

  // Получает из общего массива уникальные маршруты для каждого дня
  // чтобы отрисовать их в trip-info__title
  getDayPointArr(points) {
    let newArr = points.filter((el, index, arr) =>
      index === arr.findIndex((t) => (
        t.dateFrom.getDate() === el.dateTo.getDate()
      ))
    );
    return newArr.sort();
  }
}

