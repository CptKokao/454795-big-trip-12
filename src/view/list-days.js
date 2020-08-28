import Abstract from './abstract.js';

const createListDaysTemplate = `<ul class="trip-days"></ul>`;

export default class ListDays extends Abstract {

  getTemplate() {
    return createListDaysTemplate;
  }
}
