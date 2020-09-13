
import DayView from '../view/day.js';
import SortView from '../view/sort.js';
import ListDays from '../view/list-days.js';
import NoPointsView from '../view/no-points.js';
import PointPresenter from "./point.js";
import NewPointPresenter from "./new-point.js";
import {renderPosition, render, remove} from "../utils/render.js";
import {getDateTime} from "../utils/date.js";
import {sortTime, sortPrice} from "../utils/sort.js";
import {filter} from "../utils/filter.js";
import {SortType, UpdateType, UserAction, FilterType} from '../utils/const.js';

const eventElement = document.querySelector(`.trip-events`);

export default class Trip {
  // Запуск метода для отрисовки всех маршрутов
  constructor(pointsModel, filterModel) {
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;

    // this._sortComponent = new SortView();
    this._listDaysComponent = new ListDays();
    this._noPointsComponent = new NoPointsView();
    this._dayComponent = new DayView();

    this._currentSortType = SortType.DEFAULT;

    // Observer, содержит объект всех созданных new PointPresenter
    // для того чтобы была ссылка на них, это дает возможность всех их удалить
    // Формат id : {new PointPresenter}
    this._pointsObserver = {};
    this._daysObserver = {};

    // Обработчик сортировки
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);

    // Обработчик изменения View
    this._handleViewAction = this._handleViewAction.bind(this);

    // Обработчик изменения Model
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._newPointPresenter = new NewPointPresenter(this._listDaysComponent, this._handleViewAction);
  }

  init() {

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    // Отрисовка эл-т trip-days в верстку
    render(eventElement, this._listDaysComponent, renderPosition.BEFOREEND);

    // Отрисовка дней и маршрутов
    this._renderListEvents(this._getPoints());
  }

  // Создает новый маршрут
  createPoint() {
    // сброс сортировки
    this._currentSortType = SortType.DEFAULT;
    // сброс фильтрации
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._newPointPresenter.init();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredTasks = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filtredTasks.sort(sortTime);
      case SortType.PRICE:
        return filtredTasks.sort(sortPrice);
    }
    return filtredTasks;
  }

  _handleModeChange() {
    this._newPointPresenter.destroy();
    Object
      .values(this._pointsObserver)
      .forEach((pointObserver) => pointObserver.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)

    switch (updateType) {
      case UpdateType.MINOR:
        console.log('MINOR');
        // - обновить часть списка (например, когда поменялось описание)
        this._pointsObserver[data.id].init(data);
        break;
      case UpdateType.MAJOR:
        console.log('MAJOR');
        // - обновить список (например, когда задача ушла в архив)
        this._clearTaskList(true);
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

  // Метод отрисовки одного маршрутов
  _renderPoint(pointListElement, point) {
    const pointPresenter = new PointPresenter(pointListElement, this._handleViewAction, this._listDaysComponent, this._handleModeChange);
    pointPresenter.init(point);
    this._pointsObserver[point.id] = pointPresenter;
  }

  // Метод отрисовки дней и всех маршрутов
  _renderListEvents(pointsList) {

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

