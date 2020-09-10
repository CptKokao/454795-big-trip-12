
import DayView from '../view/day.js';
import SortView from '../view/sort.js';
import ListDays from '../view/list-days.js';
import NoPointsView from '../view/no-points.js';
import PointPresenter from "./point.js";
import {renderPosition, render} from "../utils/render.js";
import {getDateTime} from "../utils/date.js";
import {sortTime, sortPrice} from "../utils/sort.js";
import {SortType, UpdateType, UserAction} from '../utils/const.js';

const eventElement = document.querySelector(`.trip-events`);

export default class Trip {
  // Запуск метода для отрисовки всех маршрутов
  constructor(pointsModel) {
    this._pointsModel = pointsModel;

    this._sortComponent = new SortView();
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

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    // Отрисовка эл-т sort в верстку
    this._renderSort();

    // Отрисовка эл-т trip-days в верстку
    render(eventElement, this._listDaysComponent, renderPosition.BEFOREEND);

    // Отрисовка дней и маршрутов
    this._renderListEvents(this._getPoints());
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.TIME:
        return this._pointsModel.getPoints().slice().sort(sortTime);
      case SortType.PRICE:
        return this._pointsModel.getPoints().slice().sort(sortPrice);
    }
    return this._pointsModel.getPoints();
  }

  _handleModeChange() {
    Object
      .values(this._pointsObserver)
      .forEach((pointObserver) => pointObserver.resetView());
  }

  // Событие при изменеии данных в маршруте
  // _handlePointChange(updatedPoint) {
  //   this._pointsObserver[updatedPoint.id].init(updatedPoint);
  // }

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
        this._clearTaskList();
        this._renderListEvents(this._getPoints());
        break;
    }
  }

  _clearTaskList() {
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
  }

  // _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
  //   const taskCount = this._getTasks().length;

  //   Object
  //     .values(this._taskPresenter)
  //     .forEach((presenter) => presenter.destroy());
  //   this._taskPresenter = {};

  //   remove(this._sortComponent);
  //   remove(this._noTaskComponent);
  //   remove(this._loadMoreButtonComponent);



  //   if (resetSortType) {
  //     this._currentSortType = SortType.DEFAULT;
  //   }
  // }

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
    render(eventElement, this._sortComponent, renderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  // Метод отрисовки одного маршрутов
  _renderPoint(pointListElement, point) {
    const pointPresenter = new PointPresenter(pointListElement, this._handleViewAction, this._listDaysComponent, this._handleModeChange);
    pointPresenter.init(point);
    this._pointsObserver[point.id] = pointPresenter;
  }

  // Метод отрисовки дней и всех маршрутов
  _renderListEvents(pointsList) {

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

