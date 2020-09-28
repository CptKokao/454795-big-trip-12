import {nanoid} from "nanoid";
import TasksModel from "../model/points.js";

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

const createStoreStructureExtra = (additions) => {
  return additions.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.type || current.name]: current
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getOffers() {
    if (Provider.isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = createStoreStructureExtra(offers);
          this._store.setItem(`bigtrip-localstorage-offers`, items);
          return offers;
        });
    }

    const storeOffers = Object.values(this._store.getItems(`bigtrip-localstorage-offers`));
    return Promise.resolve(storeOffers);
  }

  getDestinations() {
    if (Provider.isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          const items = createStoreStructureExtra(destinations);
          this._store.setItem(`bigtrip-localstorage-destinations`, items);
          return destinations;
        });
    }

    const storeDestinations = Object.values(this._store.getItems(`bigtrip-localstorage-destinations`));
    return Promise.resolve(storeDestinations);
  }

  getPoints() {
    if (Provider.isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map(TasksModel.adaptToServer));
          this._store.setItem(`bigtrip-localstorage-points`, items);
          return points;
        });
    }

    const storePoints = Object.values(this._store.getItems(`bigtrip-localstorage-points`, true));
    return Promise.resolve(storePoints.map(TasksModel.adaptToClient));
  }

  updatePoint(point) {
    if (Provider.isOnline()) {
      return this._api.updatePoint(point)
        .then((updatePoint) => {
          this._store.setItem(updatePoint.id, TasksModel.adaptToServer(updatePoint));
          return updatePoint;
        });
    }

    this._store.setItem(point.id, TasksModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (Provider.isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._store.setItem(newPoint.id, TasksModel.adaptToServer(newPoint));
          return newPoint;
        });
    }

    // На случай локального создания данных мы должны сами создать `id`.
    // Иначе наша модель будет не полной, и это может привнести баги
    const localNewPointId = nanoid();
    const localNewPoint = Object.assign({}, point, {id: localNewPointId});

    this._store.setItem(localNewPoint.id, TasksModel.adaptToServer(localNewPoint));

    return Promise.resolve(localNewPoint);
  }

  deletePoint(point) {
    if (Provider.isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._store.removeItem(point.id));
    }

    this._store.removeItem(point.id);

    return Promise.resolve();
  }

  sync() {
    if (Provider.isOnline()) {
      const storePoints = Object.values(this._store.getItems());

      return this._api.sync(storePoints)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
