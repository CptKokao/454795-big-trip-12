import moment from 'moment';
import {FilterType} from "../utils/const.js";

// 11 Aug
export const getDayMonthStamp = (event) => {
  return event.toLocaleString(`en-GB`, {day: `2-digit`, month: `short`});
};

// Форматирует время в формат с начальным нулем = 01:01
export const getShortTime = (time) => {
  return moment(time).format(`HH:mm`);
};

// Форматирует время в формат 09 AUG, если reverse = true AUG 09
export const getFormatDate = (date, reverse) => {
  return reverse ? moment(date).format(`D MMM`) : moment(date).format(`MMM D`);
};

// Форматирует время в формат dd mm year = 12/08/20 или 12-08-20
export const getDateTime = (date) => {
  return moment(date).format(`DD-MM-YY`);
};

export const durationTime = (endDate, startDate) => {
  const startTimeInMs = new Date(startDate).getTime();
  const endTimeInMs = new Date(endDate).getTime();
  const range = moment.duration(endTimeInMs - startTimeInMs);

  const duration = {
    days: range.days(),
    hours: range.hours(),
    minutes: range.minutes()
  };

  if (duration.days > 0) {
    return `${duration.days}D ${duration.hours}H ${duration.minutes}M`;
  }

  return `${duration.hours}H ${duration.minutes}M`;
};

export const isFutureOrPast = (date, time) => {
  return time === FilterType.FUTURE ? moment(date).isAfter() : moment(date).isBefore();
};
