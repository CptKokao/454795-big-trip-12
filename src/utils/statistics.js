import {types} from '../utils/point.js';
import {upperFirst} from '../utils/common.js';
import moment from 'moment';

const PointType = {
  TAXI: `Taxi`,
  BUS: `Bus`,
  TRAIN: `Train`,
  SHIP: `Ship`,
  TRANSPORT: `Transport`,
  DRIVE: `Drive`,
  FLIGHT: `Flight`,
  CHECK: `Check`,
  SIGHTSEEING: `Sightseeing`,
  RESTAURANT: `Restaurant`
};

const LabelStat = {
  [PointType.TAXI]: `🚕 RIDE`,
  [PointType.BUS]: `🚌 BUS`,
  [PointType.TRAIN]: `🚂 TRAIN`,
  [PointType.SHIP]: `🛳 SAIL`,
  [PointType.TRANSPORT]: `🚊 TRANSPORT`,
  [PointType.DRIVE]: `🚗 DRIVE`,
  [PointType.FLIGHT]: `✈️ FLY`,
  [PointType.CHECK]: `🏨 STAY`,
  [PointType.SIGHTSEEING]: `🏛 LOOK`,
  [PointType.RESTAURANT]: `🍽 EAT`
};

// Считает общюю стоимость для каждого типа маршрута
export const getStatsForMoney = (points) => {
  debugger
  let bank = {};
  Object
    .values(points)
    .map((item) => {
      const typePoint = item.type === `check-in` ? `Check` : item.type;
      return {
        type: typePoint[0].toUpperCase() + typePoint.slice(1),
        price: item.price
      };
    })
    .reduce((_, value) => {
      if ([LabelStat[value.type]] in bank) {
        bank[LabelStat[value.type]] += value.price;
      } else {
        bank[LabelStat[value.type]] = value.price;
      }
    }, 0);

  let sortable = [];

  for (const type in bank) {
    if (bank.hasOwnProperty(type)) {
      sortable.push([type, bank[type]]);
    }
  }
  sortable.sort((a, b) => b[1] - a[1]);

  let labels = [];
  let prices = [];
  sortable.forEach((value) => labels.push(value[0]));
  sortable.forEach((value) => prices.push(value[1]));

  return {
    labelsStat: labels,
    valuesStat: prices
  };
};

// Считает общее кол-во транспорта для каждого типа маршрута
export const getStatsForTransport = (points) => {
  const typesActivity = types.activity;
  let bank = {};
  Object
    .values(points)
    .map((item) => {
      const typePoint = item.type === `check-in` ? `Check` : (item.type[0].toUpperCase() + item.type.slice(1));
      for (const type of typesActivity) {
        if (typePoint === upperFirst(type) && LabelStat[typePoint] in bank) {
          bank[LabelStat[typePoint]] += 1;
        } else if (typePoint === upperFirst(type)) {
          bank[LabelStat[typePoint]] = 1;
        }
      }
    });

  let sortable = [];

  for (const type in bank) {
    if (bank.hasOwnProperty(type)) {
      sortable.push([type, bank[type]]);
    }
  }
  sortable.sort((a, b) => b[1] - a[1]);

  let labels = [];
  let count = [];
  sortable.forEach((value) => labels.push(value[0]));
  sortable.forEach((value) => count.push(value[1]));

  return {
    labelsStat: labels,
    valuesStat: count
  };
};


const getDuration = (point) => {
  const startDate = point.dateFrom;
  const endDate = point.dateTo;

  const duration = moment.duration(moment(endDate).diff(startDate)).asHours();
  return Math.round(duration);
};

// Считает общее время для каждого типа маршрута
export const getStatsForTimeSpent = (points) => {
  let bank = {};
  Object
    .values(points)
    .map((item) => {
      const typePoint = item.type === `check-in` ? `Check` : item.type;
      return {
        type: typePoint[0].toUpperCase() + typePoint.slice(1),
        duration: getDuration(item)
      };
    })
    .reduce((_, item) => {
      if (LabelStat[item.type] in bank) {
        bank[LabelStat[item.type]] += item.duration;
      } else {
        bank[LabelStat[item.type]] = item.duration;
      }
    }, 0);

  let sortable = [];

  for (const type in bank) {
    if (bank.hasOwnProperty(type)) {
      sortable.push([type, bank[type]]);
    }
  }
  sortable.sort((a, b) => b[1] - a[1]);

  let labels = [];
  let diff = [];
  sortable.forEach((value) => labels.push(value[0]));
  sortable.forEach((value) => diff.push(value[1]));

  return {
    labelsStat: labels,
    valuesStat: diff
  };
};
