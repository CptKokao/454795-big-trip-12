import {DAY_IN_MS, HOUR_IN_MS, MINUTE_IN_MS} from "./const.js";

export const renderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const render = (container, element, place) => {
  switch (place) {
    case renderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case renderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

// export const renderTemplate = (container, template, place) => {
//   container.insertAdjacentHTML(place, template);
// };

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  // return newElement.firstChild;
  return newElement;
};

// Генерирует случайное число из диапазона
export const getRandomInteger = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// 11 Aug
export const getDayMonthStamp = (event) => {
  return event.toLocaleString(`en-GB`, {day: `2-digit`, month: `short`});
};

// Форматирует время в формат с начальным нулем = 01:01
export const getShortTime = (date) => {
  const shortTime = [
    `0${date.getHours()}`,
    `0${date.getMinutes()}`
  ].map((item) => item.slice(-2));

  return shortTime.join(`:`);
};

// Форматирует время в формат AUG 09 или 09 AUG, если reverse = true
export const getFormatDate = (date, reverse) => {
  const formatter = new Intl.DateTimeFormat(`en-US`, {
    month: `short`,
    day: `2-digit`
  });

  return reverse ? formatter.format(date).split(` `).reverse().join(` `) : formatter.format(date);
};

// Форматирует время в формат dd mm year = 12/08/20 или 12-08-20
export const getDateTime = (date, separator) => {
  const dateTime = [
    `0${date.getMonth() + 1}`,
    `0${date.getDate()}`
  ].map((item) => item.slice(-2));

  return `${dateTime[1]}${separator}${dateTime[0]}${separator}${(date.getFullYear() + ``).slice(2)}`;
};

// Вычисляет необходимое время для маршрута
export const durationTime = (timeEnd, timeStart) => {

  const duration = (timeEnd - timeStart);
  if (duration < HOUR_IN_MS) {

    return `0${Math.floor(duration / MINUTE_IN_MS)}M`.slice(-3);

  } else if (duration < DAY_IN_MS) {
    const hours = Math.floor(duration / HOUR_IN_MS);
    const minutes = Math.floor((duration - hours * HOUR_IN_MS) / (60 * 1000));
    const stringHours = `0${hours}H`.slice(-3);
    const stringMinutes = `0${minutes}M`.slice(-3);

    return `${stringHours} ${stringMinutes}`;

  } else {
    const days = Math.floor(duration / (DAY_IN_MS));
    const hours = Math.floor((duration - days * DAY_IN_MS) / HOUR_IN_MS);
    const minutes = Math.floor((duration - days * DAY_IN_MS - hours * HOUR_IN_MS) / MINUTE_IN_MS);
    const stringDays = `0${days}D`.slice(-3);
    const stringHours = `0${hours}H`.slice(-3);
    const stringMinutes = `0${minutes}M`.slice(-3);

    return `${stringDays} ${stringHours} ${stringMinutes}`;
  }
};
