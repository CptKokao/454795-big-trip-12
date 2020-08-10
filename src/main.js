import {createInfoTemplate} from './view/info.js';
import {createFilterTemplate} from './view/filter.js';
import {createFormTemplate} from './view/form.js';
import {createSortTemplate} from './view/sort.js';
import {createDayandPointsTemplate} from './view/day-point.js';
import {generatePoint} from './mock/point.js';


const POINT_COUNT = 15;
const points = new Array(POINT_COUNT).fill().map(generatePoint);
console.log(points);

const render = (container, place, template) => {
  container.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector(`.trip-main`);
const eventElement = document.querySelector(`.trip-events`);
const tripDays = eventElement.querySelector(`.trip-days`);

render(mainElement, `afterbegin`, createFilterTemplate());
render(mainElement, `afterbegin`, createInfoTemplate());

render(eventElement, `afterbegin`, createFormTemplate(points[0]));


render(eventElement, `afterbegin`, createSortTemplate());


for (let i = 1; i < POINT_COUNT; i++) {
  render(tripDays, `beforeend`, createDayandPointsTemplate(points[i], i));
}
