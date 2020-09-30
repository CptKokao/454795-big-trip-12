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
          city: point.destination.name,
          cost: point.base_price,
          dateStart: point.date_from !== null ? new Date(point.date_from) : point.date_from, // На клиенте дата хранится как экземпляр Date
          dateEnd: point.date_to !== null ? new Date(point.date_to) : point.date_to,
          description: point.destination.description,
          isFavorite: point.is_favorite,
          photo: point.destination.pictures,
          offers: point.offers
        }
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.destination;
    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "destination": {
            "name": point.city,
            "description": point.description,
            "pictures": point.photo
          },
          "base_price": point.cost,
          "date_from": point.dateStart instanceof Date ? point.dateStart.toISOString() : null,
          "date_to": point.dateEnd instanceof Date ? point.dateEnd.toISOString() : null,
          "is_favorite": point.isFavorite
        }
    );

    // Ненужные ключи мы удаляем
    delete adaptedPoint.city;
    delete adaptedPoint.description;
    delete adaptedPoint.photo;
    delete adaptedPoint.cost;
    delete adaptedPoint.dateStart;
    delete adaptedPoint.dateEnd;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
