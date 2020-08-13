import {getDayMonthStamp, getYearMonthDayStamp} from "../util.js";
import {createPointsTemplate} from "./point.js";

const getEventsTemplate = (events, count, day) => {

  return new Array(count).fill().map((element, index) => {
    return day === getDayMonthStamp(events[index].date[0]) ? createPointsTemplate(events[index]) : ``;
  }).join(` `);
};

const getSortDatesEndDaysForTemplate = (events) => {
  const daysForTemplate = {};
  for (let i = 0; i < events.length; i++) {
    let key = getDayMonthStamp(events[i].date[0]);
    daysForTemplate[key] = getYearMonthDayStamp(events[i].date[0]);
  }

  const days = Object.keys(daysForTemplate).sort();
  const dates = Object.values(daysForTemplate).sort();

  return {days, dates};
};

export const createDayTemplate = (events, count) => {
  const {days, dates} = getSortDatesEndDaysForTemplate(events);

  return new Array(days.length).fill().map((element, index) =>
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="${dates[index]}">${days[index].toUpperCase()}</time>
      </div>
      <ul class="trip-events__list">
        ${getEventsTemplate(events, count, days[index])}
      </ul>
    </li>`).join(` `);
};
