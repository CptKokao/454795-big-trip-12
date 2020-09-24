export const getConcatNameOffers = (name) => {
  return name.replace(/[\s',]/g, `-`).toLowerCase();
};

// Первая буква заглавная
export const upperFirst = (str) => {
  if (!str) {
    return str;
  }

  return str[0].toUpperCase() + str.slice(1);
};
