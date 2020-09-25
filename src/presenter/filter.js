import FilterView from '../view/filters.js';
import {render, renderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType, UpdateType} from '../utils/const.js';

export default class Filter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer.querySelector(`.trip-controls`);
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._currentFilter = null;
    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, renderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  // При нажатии на фильтр Everything, Future, Past
  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === null) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
    document.querySelector(`.trip-main__event-add-btn`).disabled = false;
  }

  _getFilters() {
    const points = this._pointsModel.getPoints();
    return [
      {
        type: FilterType.EVERYTHING,
        name: `Everything`,
        count: filter[FilterType.EVERYTHING](points).length
      },
      {
        type: FilterType.FUTURE,
        name: `Future`,
        count: filter[FilterType.FUTURE](points).length
      },
      {
        type: FilterType.PAST,
        name: `Past`,
        count: filter[FilterType.PAST](points).length
      }
    ];
  }
}
