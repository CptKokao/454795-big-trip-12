import {getRandomInteger} from "../utils/common.js";

// Date.now() и Math.random() - плохие решения для генерации id
// в "продуктовом" коде, а для моков самое то.
// Для "продуктового" кода используйте что-то понадежнее,
// вроде nanoid - https://github.com/ai/nanoid
export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

// Генерирует случайный тип маршрута
const generateType = () => {
  const type = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];
  const randomIndex = getRandomInteger(0, type.length - 1);

  return type[randomIndex];
};

// Генерирует случайный пункт назанчения(город)
const generateCity = () => {
  const city = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint Petersburg`, `Moscow`];
  const randomIndex = getRandomInteger(0, city.length - 1);

  return city[randomIndex];
};

// Генерирует случайное количество предложений из текста
export const generateDescription = () => {
  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
  const arrText = text.split(`. `);
  const randomIndex = getRandomInteger(1, arrText.length - 1);

  return arrText.splice(0, randomIndex);
};

// Генерирует случайное фото
export const generatePhoto = () => {
  const min = 1;
  const max = 5;
  const arrPhoto = [];

  const randomIndex = getRandomInteger(min, max);
  for (let i = 0; i < randomIndex; i++) {
    arrPhoto.push({
      src: `http://picsum.photos/248/152?r=${Math.random()}`,
      description: generateDescription()
    });
  }

  return arrPhoto;
};

// Генерирует время
const maxDaysGap = 7;
const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
let currentDate = +((new Date()).setSeconds(0, 0)) + daysGap * 24 * 3600 * 1000;

const generateDate = () => {
  const dataStart = currentDate + getRandomInteger(0, 2) * 3600 * 1000 + getRandomInteger(1, 60) * 60 * 1000;
  const dataEnd = dataStart + getRandomInteger(1, 12) * 3600 * 1000 + getRandomInteger(1, 60) * 60 * 1000;
  const eventData = [new Date(dataStart), new Date(dataEnd)];
  currentDate = dataEnd;

  return eventData;
};

export const Offer = {
  taxi: [
    {
      title: `Order Uber`,
      cost: getRandomInteger(5, 100),
      isChecked: getRandomInteger(0, 1)
    },
    {
      title: `Switch to comfort`,
      cost: getRandomInteger(5, 100),
      isChecked: getRandomInteger(0, 1)
    },
  ],
  flight: [
    {
      title: `Add luggage`,
      cost: getRandomInteger(5, 100),
      isChecked: getRandomInteger(0, 1)
    },
    {
      title: `Switch to comfort`,
      cost: getRandomInteger(5, 100),
      isChecked: getRandomInteger(0, 1)
    },
    {
      title: `Add meal`,
      cost: getRandomInteger(5, 100),
      isChecked: getRandomInteger(0, 1)
    },
    {
      title: `Choose seats`,
      cost: getRandomInteger(5, 100),
      isChecked: getRandomInteger(0, 1)
    }
  ],
  train: [
    {
      title: `Switch to comfort`,
      cost: getRandomInteger(5, 100),
      isChecked: getRandomInteger(0, 1)
    },
    {
      title: `Add meal`,
      cost: getRandomInteger(5, 100),
      isChecked: getRandomInteger(0, 1)
    },
    {
      title: `Choose seats`,
      cost: getRandomInteger(5, 100),
      isChecked: getRandomInteger(0, 1)
    }
  ],
  ship: [
    {
      title: `Switch to comfort`,
      cost: getRandomInteger(5, 100),
      isChecked: getRandomInteger(0, 1)
    },
    {
      title: `Add meal`,
      cost: getRandomInteger(5, 100),
      isChecked: getRandomInteger(0, 1)
    },
    {
      title: `Choose seats`,
      cost: getRandomInteger(5, 100),
      isChecked: getRandomInteger(0, 1)
    }
  ],
  drive: [
    {
      title: `Rent a car`,
      cost: getRandomInteger(5, 100),
      isChecked: getRandomInteger(0, 1)
    }
  ],
  check: [
    {
      title: `Add breakfast`,
      cost: getRandomInteger(5, 100),
      isChecked: getRandomInteger(0, 1)
    }
  ],
  sightseeing: [
    {
      title: `Book tickets`,
      cost: getRandomInteger(5, 100),
      isChecked: getRandomInteger(0, 1)
    },
    {
      title: `Lunch in city`,
      cost: getRandomInteger(5, 100),
      isChecked: getRandomInteger(0, 1)
    }
  ]
};

export const generateOffers = (type) => {
  let offers = [];

  type = type.toLowerCase().split(`-`)[0];

  if (Offer[type]) {
    const quantity = getRandomInteger(1, Offer[type].length);

    for (let i = 0; i < quantity; i++) {
      offers.push(Offer[type][i]);
    }
  }

  return offers;
};

export const generatePoint = () => {
  const type = generateType();
  const city = generateCity();
  const description = generateDescription();
  const photo = generatePhoto();
  const date = generateDate();

  return {
    id: generateId(),
    type,
    city,
    dateStart: date[0],
    dateEnd: date[1],
    cost: getRandomInteger(15, 200),
    offers: generateOffers(type),
    description,
    photo,
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};
