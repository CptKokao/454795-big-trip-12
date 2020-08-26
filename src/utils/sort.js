export const getSumPoint = (point) => {
  const pointCost = point.cost;
  const offerCost = Object
    .values(point.offers)
    .map((it) => {
      return it.cost;
    })
    .reduce((total, value) => {
      return total + value;
    }, 0);
  return pointCost + offerCost;
};

export const sortTime = (a, b) => {
  const timeA = new Date(a.date[1]).getTime() - new Date(a.date[0]).getTime();
  const timeB = new Date(b.date[1]).getTime() - new Date(b.date[0]).getTime();

  if (timeA < timeB) {
    return 1;
  } else if (timeA > timeB) {
    return -1;
  }

  return 0;
};

export const sortPrice = (a, b) => {
  const priceA = getSumPoint(a);
  const priceB = getSumPoint(b);

  if (priceA < priceB) {
    return 1;
  } else if (priceA > priceB) {
    return -1;
  }

  return 0;
};
