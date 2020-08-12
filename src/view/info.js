import {getFormatDate} from "../util.js";

export const createInfoTemplate = (points) => {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${Object.values(points).map((element) => `${element.city} &mdash;&nbsp;`).slice(1).join(``).slice(0, -13)}</h1>

        <p class="trip-info__dates">${getFormatDate(points[1].date[0])}&nbsp;&mdash;&nbsp;${getFormatDate(points[14].date[1])}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${Object.values(points).map((element) => element.cost).reduce((acc, el) => acc + el)}</span>
      </p>
    </section>`
  );
};

