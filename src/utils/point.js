// Генерирует случайное число из диапазона
export const getRandomInteger = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const types = {
  transport: [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`],
  transfer: [`check`, `sightseeing`, `restaurant`]
};

export const updateOffers = (allOffers, nameInput) => {
  const changeOffer = allOffers
      .slice()
      .filter((item) => item.title === nameInput)
      .map((offer) => {
        return {
          title: offer.title,
          price: offer.price,
          isEnabled: !offer.isEnabled
        };
      });

  const index = allOffers.findIndex((offer) => offer.title === changeOffer[0].title);

  if (index === -1) {
    throw new Error(`Can't update`);
  }

  return [
    ...allOffers.slice(0, index),
    changeOffer[0],
    ...allOffers.slice(index + 1)
  ];
};

// Генерирует случайное количество предложений из текста
export const generateDescription = () => {
  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
  const arrText = text.split(`. `);
  const randomIndex = getRandomInteger(1, arrText.length - 1);
  return arrText.splice(0, randomIndex).join(`. `);
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

export const Offer = {
  taxi: [
    {
      title: `Order Uber`,
      price: getRandomInteger(5, 100),
    },
    {
      title: `Switch to comfort`,
      price: getRandomInteger(5, 100),
    },
  ],
  flight: [
    {
      title: `Add luggage`,
      price: getRandomInteger(5, 100),
    },
    {
      title: `Switch to comfort`,
      price: getRandomInteger(5, 100),
    },
    {
      title: `Add meal`,
      price: getRandomInteger(5, 100),
    },
    {
      title: `Choose seats`,
      price: getRandomInteger(5, 100),
    }
  ],
  train: [
    {
      title: `Switch to comfort`,
      price: getRandomInteger(5, 100),
    },
    {
      title: `Add meal`,
      price: getRandomInteger(5, 100),
    },
    {
      title: `Choose seats`,
      price: getRandomInteger(5, 100),
    }
  ],
  ship: [
    {
      title: `Switch to comfort`,
      price: getRandomInteger(5, 100),
    },
    {
      title: `Add meal`,
      price: getRandomInteger(5, 100),
    },
    {
      title: `Choose seats`,
      price: getRandomInteger(5, 100),
    }
  ],
  drive: [
    {
      title: `Rent a car`,
      price: getRandomInteger(5, 100),
    }
  ],
  check: [
    {
      title: `Add breakfast`,
      price: getRandomInteger(5, 100),
    }
  ],
  sightseeing: [
    {
      title: `Book tickets`,
      price: getRandomInteger(5, 100),
    },
    {
      title: `Lunch in city`,
      price: getRandomInteger(5, 100),
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
