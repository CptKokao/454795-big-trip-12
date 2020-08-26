import Abstract from './abstract.js';

const createNoDayTemplate =
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter"></span>
        <time class="day__date" datetime=""></time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>`;

export default class NoDay extends Abstract {

  getTemplate() {
    return createNoDayTemplate;
  }
}
