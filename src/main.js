import {createInfoTemplate} from './view/info.js';
import {createFilterTemplate} from './view/filter.js';
import {createFormTemplate} from './view/form.js';
import {createSortTemplate} from './view/sort.js';
import {createListDays} from './view/list-day.js';
import {createDayTemplate} from './view/day.js';
import {generatePoint} from './mock/point.js';

const POINT_COUNT = 15;
const points = new Array(POINT_COUNT).fill().map(generatePoint);

const render = (container, place, template) => {
  container.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector(`.trip-main`);
const eventElement = document.querySelector(`.trip-events`);

render(mainElement, `afterbegin`, createFilterTemplate());

render(mainElement, `afterbegin`, createInfoTemplate(points));

render(eventElement, `afterbegin`, createFormTemplate(points[0]));

render(eventElement, `afterbegin`, createSortTemplate());

render(eventElement, `beforeend`, createListDays());

const siteListDays = eventElement.querySelector(`.trip-days`);
render(siteListDays, `beforeend`, createDayTemplate(points, POINT_COUNT));
