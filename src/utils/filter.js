import {FilterType} from "../utils/const.js";
import {isFutureOrPast} from "../utils/date.js";

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureOrPast(point.dateFrom, FilterType.FUTURE)),
  [FilterType.PAST]: (points) => points.filter((point) => isFutureOrPast(point.dateFrom, FilterType.PAST))
};
