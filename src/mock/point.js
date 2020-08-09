import {getRandomInteger} from "../util.js";

// Генерирует случайный тип маршрута
const generateType = () => {
  const type = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check`, `Sightseeing`, `Restaurant`];
  const randomIndex = getRandomInteger(0, type.length - 1);

  return type[randomIndex];
};

// Генерирует случайный тип маршрута
const generateCity = () => {
  const city = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`, `Moscow`];
  const randomIndex = getRandomInteger(0, city.length - 1);

  return city[randomIndex];
};

// Генерирует случайное количество предложений из текста
const generateDescription = () => {
  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
  const arrText = text.split(`. `);
  const randomIndex = getRandomInteger(0, arrText.length - 1);

  return arrText.splice(0, randomIndex);
};

// Генерирует случайное фото
const generatePhoto = () => {
  const min = 1;
  const max = 5;
  const arrPhoto = [];

  const randomIndex = getRandomInteger(min, max);
  for (let i = 0; i < randomIndex; i++) {
    arrPhoto.push(`http://picsum.photos/248/152`);
  }

  return arrPhoto;
};

export const generatePoint = () => {
  const type = generateType();
  const city = generateCity();
  const description = generateDescription();
  const photo = generatePhoto();

  return {
    type,
    city,
    offers: [
      {
        type: `Taxi`,
        options: [
          {name: `Add luggage`, price: 30},
          {name: `Switch to comfort class`, price: 100},
          {name: `Add meal`, price: 15},
          {name: `Choose seats`, price: 5},
          {name: `Travel by train`, price: 40},
        ]
      },
      {
        type: `Bus`,
        options: [
          {name: `Add luggage`, price: 30},
          {name: `Switch to comfort class`, price: 100},
          {name: `Add meal`, price: 15},
          {name: `Choose seats`, price: 5},
          {name: `Travel by train`, price: 40},
        ],
      },
      {
        type: `Train`,
        options: [
          {name: `Add luggage`, price: 30},
          {name: `Switch to comfort class`, price: 100},
          {name: `Add meal`, price: 15},
          {name: `Choose seats`, price: 5},
          {name: `Travel by train`, price: 40},
        ]
      },
    ],
    description,
    photo,
  };
};
