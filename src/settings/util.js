import { rgb } from "d3-color";

import { scaleLinear } from "d3-scale";
import { interpolateCubehelix } from "d3-interpolate";

import { colorScale } from "./colors.js";

export const color = (value, range) => {
  const scale = scaleLinear()
    .domain([0, 1000, 3000,8000, 70000])
    .range(colorScale[0])
    .interpolate(interpolateCubehelix.gamma(3))

  return scale(value);
};

export const getColorArray = color => {
  const array = Object.values(rgb(color));
  array[3] = array[3] * 255;

  return array;
};
