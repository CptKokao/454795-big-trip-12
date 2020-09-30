import Observer from "../utils/observer.js";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
    this._offers = [];
    this._destinations = [];
  }

  // Points
  setPoints(updateType, points) {
    this._points = points.slice();

    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  // Offers
  setOffers(offers) {
    this._offers = offers.slice();
  }

  getOffers() {
    return this._offers;
  }

  // Destinations
  setDestinations(destinations) {
    this._destinations = destinations.slice();
  }

  getDestinations() {
    return this._destinations;
  }

  // Обновление
  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  // Добавление
  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  // Удаление
  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          price: point.base_price,
          isFavorite: point.is_favorite,
          dateFrom: point.date_from !== null ? new Date(point.date_from) : point.date_from,
          dateTo: point.date_to !== null ? new Date(point.date_to) : point.date_to,
        }
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.base_price;
    delete adaptedPoint.is_favorite;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "base_price": point.price,
          "is_favorite": point.isFavorite,
          "type": point.eventType,
          "date_from": point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
          "date_to": point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
        }
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.price;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.eventType;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;

    return adaptedPoint;
  }
}
