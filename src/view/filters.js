import Abstract from './abstract.js';

const createItemFilterTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${type === currentFilterType ? `checked` : ``}
        ${count === 0 ? `disabled` : ``}
      >
      <label
        class="trip-filters__filter-label"
        for="filter-${type}">
        ${name}
      </label>
    </div>`
  );
};

const createTripFiltersTemplate = (filterItem, currentFilterType) => {

  const filterItemsTemplate = filterItem
    .map((filter) => createItemFilterTemplate(filter, currentFilterType))
    .join(``);

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter extends Abstract {

  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFiltersTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(e) {
    e.preventDefault();
    this._callback.filterTypeChange(e.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
