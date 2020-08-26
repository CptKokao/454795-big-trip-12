
import FormView from '../view/form.js';
import DaysView from '../view/days.js';
import OneDayView from '../view/one-day.js';
import PointView from '../view/point.js';
import SortView from '../view/sort.js';
import NoPointsView from '../view/no-points.js';
import {renderPosition, render, replace} from "../utils/render.js";
import {getDateTime} from "../utils/date.js";
import {sortTime, sortPrice} from "../utils/sort.js";
import {SortType} from '../utils/const.js';

const eventElement = document.querySelector(`.trip-events`);
const siteListDays = eventElement.querySelector(`.trip-days`);

export default class Trip {
  // Запуск метода для отрисовки всех маршрутов
  constructor(points) {
    this._sortComponent = new SortView();
    this._oneDayComponent = new OneDayView(points);
    this._dayComponent = new DaysView(points);
    this._noPointsComponent = new NoPointsView(points);
    this._currentSortType = SortType.DEFAULT;

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._renderListEvents(points);
    // Исходный массив маршрутов
    this._sourcedArrPoints = points.slice();
    // Исходный массив маршрутов который будем изменять
    this._arrPoints = points.slice();
  }

  _clearTaskList(sortType) {
    debugger;
    if (sortType === `default`) {
      render(siteListDays, new OneDayView().getElement().innerHTML = ``);

    } else {
      render(siteListDays, new DaysView().getElement().innerHTML = ``);

    }
  }

  // Сортировка, принимает аргумент который сообщает какая сортировка выбрана
  // после сортировки возвращает массив маршрутов
  _sortTasks(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._arrPoints.sort((a, b) => sortTime(a, b));
        break;
      case SortType.PRICE:
        this._arrPoints.sort((a, b) => sortPrice(a, b));
        break;
      case SortType.DEFAULT:
        this._arrPoints = this._sourcedArrPoints;
        break;
    }
  }


  _handleSortTypeChange(sortType) {

    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._sortTasks(sortType);
    this._clearTaskList(sortType);
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
    const formComponent = new FormView(point);
    const pointComponent = new PointView(point);

    const replaceCardToForm = () => {
      replace(formComponent, pointComponent);
    };

    const replaceFormToCard = () => {
      replace(pointComponent, formComponent);
    };

    const onEscKeyDown = (e) => {
      if (e.key === `Escape` || e.key === `Esc`) {
        e.preventDefault();
        replaceFormToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    // Событие клик по кнопки маршрута
    pointComponent.setClickHandler(() => {
      replaceCardToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    // Событие submit на кнопки Save в форме редактирования
    formComponent.setFormSubmitHandler(() => {
      replaceFormToCard();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    render(pointListElement, pointComponent, renderPosition.BEFOREEND);
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
      render(siteListDays, new DaysView(el, index), renderPosition.BEFOREEND);
      // this._dayComponent.removeElement();
    });

    // Для каждого дня добавляет маршруты
    const days = eventElement.querySelectorAll(`.trip-days__item`);
    for (let i = 0; i < days.length; i++) {
      for (let j = 0; j < pointsList.length; j++) {
        if (days[i].querySelector(`.day__date`).getAttribute(`datetime`) === getDateTime(pointsList[j].date[0], `-`)) {
          this._renderPoint(days[i].querySelector(`.trip-events__list`), pointsList[j]);
        }
      }
    }
  }

  // Метод отрисовки маршрутов после сортировки
  _renderSortEvents(pointsList) {

    // Отрисовка дней, для компонента _oneDayComponent
    // количество дней равно количеству маршрутов

    // pointsList.forEach((el, index) => {
    //   render(siteListDays, new DaysView(el, index), renderPosition.BEFOREEND);
    //   // this._dayComponent.removeElement();
    // });
    render(siteListDays, this._oneDayComponent, renderPosition.BEFOREEND);

    // Для каждого дня добавляет маршруты
    const days = eventElement.querySelectorAll(`.trip-days__item`);
    for (let i = 0; i < days.length; i++) {
      this._renderPoint(days[i].querySelector(`.trip-events__list`), pointsList[i]);
    }
  }
}

