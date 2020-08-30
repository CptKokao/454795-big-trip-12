
import FormView from '../view/form.js';
import DayView from '../view/day.js';
import NoDayView from '../view/no-day.js';
import PointView from '../view/point.js';
import SortView from '../view/sort.js';
import ListDays from '../view/list-days.js';
import NoPointsView from '../view/no-points.js';
import PointPresenter from "./point.js";
import {renderPosition, render, replace, remove} from "../utils/render.js";
import {getDateTime} from "../utils/date.js";
import {sortTime, sortPrice} from "../utils/sort.js";
import {updateItem} from "../utils/common.js";
import {SortType} from '../utils/const.js';

const eventElement = document.querySelector(`.trip-events`);

export default class Trip {
  // Запуск метода для отрисовки всех маршрутов
  constructor(points) {
    this._sortComponent = new SortView();
    this._listDaysComponent = new ListDays();
    this._noPointsComponent = new NoPointsView(points);
    this._dayComponent = new DayView();

    this._currentSortType = SortType.DEFAULT;

    // Observer, содержит объект всех созданных new PointPresenter
    // для того чтобы была ссылка на них, это дает возможность всех их удалить
    // Формат id : {new PointPresenter}
    this._pointsObserver = {};
    this._daysObserver = {};

    // Обработчик сортировки
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    // Обработчик изменения маршрута
    this._handlePointChange = this._handlePointChange.bind(this);
  }

  init(points) {
    // Отрисовка эл-т sort в верстку
    this._renderSort();

    // Отрисовка эл-т trip-days в верстку
    render(eventElement, this._listDaysComponent, renderPosition.BEFOREEND);

    // Отрисовка дней и маршрутов
    this._renderListEvents(points);

    // Исходный массив маршрутов, используется для восстановления исходного порядка
    this._sourcedArrPoints = points.slice();

    // Копия исходного массива маршрутов, используется для сортировки
    this._arrPoints = points.slice();
  }

  // Событие при изменеии данных в маршруте
  _handlePointChange(updatedPoint) {
    // Обновляет массив
    this._arrPoints = updateItem(this._arrPoints, updatedPoint);
    // Обновляет исходный массив
    this._sourcedArrPoints = updateItem(this._sourcedArrPoints, updatedPoint);

    this._pointsObserver[updatedPoint.id].init(updatedPoint);
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

  // Сортировка, принимает аргумент который сообщает какая сортировка выбрана
  // после сортировки возвращает массив отсортированных маршрутов
  _sortTasks(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._arrPoints.sort(sortTime);
        break;
      case SortType.PRICE:
        this._arrPoints.sort(sortPrice);
        break;
      case SortType.DEFAULT:
        this._arrPoints = this._sourcedArrPoints.slice();
        break;
    }
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

    // В метод передаем выбранный тип сортировки
    this._sortTasks(sortType);

    // Очищаем верстку перед новой отрисовкой маршрутов
    this._clearTaskList();

    // Условие позволяет выбрать метод для отрисовки маршрутов
    if (sortType === `default`) {
      this._renderListEvents(this._arrPoints);
    } else {
      this._renderSortEvents(this._arrPoints);
    }
  }

  _renderSort() {
    render(eventElement, this._sortComponent, renderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  // Метод отрисовки одного маршрутов
  _renderPoint(pointListElement, point) {
    const pointPresenter = new PointPresenter(pointListElement, point, this._handlePointChange);
    pointPresenter.init();
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
        t.date[0].getDate() === el.date[0].getDate()
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
        if (days[i].querySelector(`.day__date`).getAttribute(`datetime`) === getDateTime(pointsList[j].date[0], `-`)) {
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

