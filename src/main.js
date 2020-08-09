import {createInfoTemplate} from './view/info.js';
import {createFilterTemplate} from './view/filter.js';
import {createFormTemplate} from './view/form.js';
import {createSortTemplate} from './view/sort.js';
import {createDayandPointsTemplate} from './view/day-point.js';
import {generatePoint} from './mock/point.js';

console.log(generatePoint());

const render = (container, place, template) => {
  container.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector(`.trip-main`);
const eventElement = document.querySelector(`.trip-events`);
const daysItemElement = eventElement.querySelector(`.trip-days__item`);

render(mainElement, `afterbegin`, createFilterTemplate());
render(mainElement, `afterbegin`, createInfoTemplate());
render(eventElement, `afterbegin`, createFormTemplate());
render(eventElement, `afterbegin`, createSortTemplate());
render(daysItemElement, `afterbegin`, createDayandPointsTemplate());


