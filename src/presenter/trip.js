
import DayView from '../view/day.js';
import SortView from '../view/sort.js';
import ListDays from '../view/list-days.js';
import NoPointsView from '../view/no-points.js';
import LoadingView from "../view/loading.js";
import PointPresenter, {State as PointViewState} from "./point.js";
import NewPointPresenter from "./new-point.js";
import {renderPosition, render, remove} from "../utils/render.js";
import {getDateTime} from "../utils/date.js";
import {sortTime, sortPrice} from "../utils/sort.js";
import {filter} from "../utils/filter.js";
import {SortType, UpdateType, UserAction, FilterType} from '../utils/const.js';

const eventElement = document.querySelector(`.trip-events`);

export default class Trip {
  constructor(pointsModel, filterModel, api) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    this._listDaysComponent = new ListDays();
    this._noPointsComponent = new NoPointsView();
    this._dayComponent = new DayView();
    this._loadingComponent = new LoadingView();

    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;
    this._api = api;
    this._offers = null;
    this._destinations = null;

    this._pointsObserver = {};
    this._daysObserver = {};

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._newPointPresenter = new NewPointPresenter(this._listDaysComponent, this._handleViewAction);
  }

  init() {
    render(eventElement, this._listDaysComponent, renderPosition.BEFOREEND);
    this._renderListEvents(this._getPoints());

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  destroy() {
    this._clearTaskList();

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  destroyFormNewPoint() {
    this._newPointPresenter.destroy();
  }

  createPoint() {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newPointPresenter.init();
  }

  _getOffers() {
    this._offers = this._extraModel.getOffers();
  }

  _getDestinations() {
    this._destinations = this._extraModel.getDestinations();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredTasks = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredTasks.sort(sortTime);
      case SortType.PRICE:
        return filteredTasks.sort(sortPrice);
    }
    return filteredTasks;
  }

  _handleModeChange() {
    this._newPointPresenter.destroy();
    Object
      .values(this._pointsObserver)
      .forEach((pointsObserver) => pointsObserver.resetView());
  }

  _handleViewAction(actionType, updateType, update) {

    switch (actionType) {

      // Обновление
      case UserAction.UPDATE_POINT:
        this._pointsObserver[update.id].setViewState(PointViewState.SAVING);
        this._api.updatePoint(update)
        .then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        })
        .catch(() => {
          this._pointsObserver[update.id].setViewState(PointViewState.ABORTING);
        });
        break;

      // Добавление
      case UserAction.ADD_POINT:
        this._api.addPoint(update)
        .then((response) => {
          this._pointsModel.addPoint(updateType, response);
        })
        .catch(() => {
          this._newPointPresenter.setAborting();
        });
        break;

      // Удаление
      case UserAction.DELETE_POINT:
        this._pointsObserver[update.id].setViewState(PointViewState.DELETING);
        this._api.deletePoint(update)
        .then(() => {
          this._pointsModel.deletePoint(updateType, update);
        })
        .catch(() => {
          this._pointsObserver[update.id].setViewState(PointViewState.ABORTING);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {

    switch (updateType) {
      case UpdateType.MINOR:
        // - обновить часть списка
        this._pointsObserver[data.id].init(data);
        break;
      case UpdateType.MAJOR:
        // - обновить список
        this._clearTaskList();
        this._renderListEvents(this._getPoints());
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderListEvents(this._getPoints());
        break;
    }
  }

  _clearTaskList() {
    this._newPointPresenter.destroy();
    // Очищает маршруты
    Object
      .values(this._pointsObserver)
      .forEach((point) => point.destroy());
    this._pointsObserver = {};

    // Очищает дни
    Object
      .values(this._daysObserver)
      .forEach((point) => point.destroy());
    this._daysObserver = {};

    remove(this._sortComponent);
    remove(this._loadingComponent);
  }

  _handleSortTypeChange(sortType) {
    // Если событие происходит на том же элементе
    if (this._currentSortType === sortType) {
      return;
    }

    // Записываем выбранный тип сортировки, чтобы была возможность
    // при повторном событии сортировки узнать выбран новый тип сотрировки или старый.
    // Смотри условие выше
    this._currentSortType = sortType;

    // Очищаем верстку перед новой отрисовкой маршрутов
    this._clearTaskList();

    // Условие позволяет выбрать метод для отрисовки маршрутов
    if (sortType === `default`) {
      this._renderListEvents(this._getPoints());
    } else {
      this._renderSortEvents(this._getPoints());
    }
  }

  _renderSort() {
    if (this._tripSortComponent !== null) {
      this._tripSortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(eventElement, this._sortComponent, renderPosition.AFTERBEGIN);
  }

  _renderLoading() {
    render(eventElement, this._loadingComponent, renderPosition.AFTERBEGIN);
  }

  // Метод отрисовки одного маршрутов
  _renderPoint(pointListElement, point) {
    const pointPresenter = new PointPresenter(pointListElement, this._handleViewAction, this._listDaysComponent, this._handleModeChange);
    pointPresenter.init(point);
    this._pointsObserver[point.id] = pointPresenter;
  }

  // Метод отрисовки дней и всех маршрутов
  _renderListEvents(pointsList) {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    // Отрисовка эл-т sort в верстку
    this._renderSort();

    // Если маршрутов нет, то отрисовывает компонент NoPointsView
    if (pointsList.length === 0) {
      render(eventElement, this._noPointsComponent, renderPosition.BEFOREEND);
      return;
    }

    // Новый массив содержащий уникальные объекты с датами
    // чтобы отрисовать количество дней
    let newArr = pointsList.filter((el, index, arr) =>
      index === arr.findIndex((t) => (
        t.dateStart.getDate() === el.dateStart.getDate()
      ))
    );

    // Сортирует массив дней по возрастанию
    newArr.sort((a, b) => a.dateStart.getDate() - b.dateStart.getDate());

    // Отрисовка дней
    newArr.forEach((el, index) => {
      const siteListDays = document.querySelector(`.trip-days`);
      const dayComponent = new DayView(el, index);

      render(siteListDays, dayComponent, renderPosition.BEFOREEND);
      // Запмсывает все компоненты в _daysObserver, для возможности их удаления
      this._daysObserver[el.id] = dayComponent;
    });

    // Отрисовка маршрутов для каждого дня
    const days = eventElement.querySelectorAll(`.trip-days__item`);
    for (let i = 0; i < days.length; i++) {
      for (let j = 0; j < pointsList.length; j++) {
        if (days[i].querySelector(`.day__date`).getAttribute(`datetime`) === getDateTime(pointsList[j].dateStart)) {
          this._renderPoint(days[i].querySelector(`.trip-events__list`), pointsList[j]);
        }
      }
    }
  }

  // Метод отрисовки маршрутов для сортировки, без отрисовки дней
  _renderSortEvents(pointsList) {

    // Отрисовка эл-т sort в верстку
    this._renderSort();

    // Отрисовка дней
    pointsList.forEach((el) => {

      const siteListDays = document.querySelector(`.trip-days`);
      const dayComponent = new DayView();

      render(siteListDays, dayComponent, renderPosition.BEFOREEND);
      // Запмсывает все компоненты в _daysObserver, для возможности их удаления
      this._daysObserver[el.id] = dayComponent;
    });

    // Для каждого дня добавляет маршруты
    const days = eventElement.querySelectorAll(`.trip-days__item`);
    for (let i = 0; i < days.length; i++) {
      this._renderPoint(days[i].querySelector(`.trip-events__list`), pointsList[i]);
    }
  }
}

