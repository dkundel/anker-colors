import {
  ColorShades,
  Dict,
  ThemeFlavor,
  Shades,
  ExtendedColors
} from './interfaces';

export const limeGreen = '#9ed356';
export const darkBlue = '#13293d';
export const lightGray = '#f4f7f5';
export const darkGray = '#131515';
export const purple = '#4a4063';
export const secondaryGreen = '#45A967';
export const red = '#FF9F8D';
export const pink = '#C35082';

export const colors: ExtendedColors = {
  limeGreen,
  darkBlue,
  lightGray,
  darkGray,
  purple,
  secondaryGreen,
  red,
  pink
};

const limeGreenShades: ColorShades = {
  100: '#D7F4AF',
  300: '#C0EC82',
  500: limeGreen,
  700: '#80B834',
  900: '#619619'
};

const secondaryGreenShades: ColorShades = {
  100: '#9FDDB4',
  300: '#6CC389',
  500: secondaryGreen,
  700: '#29934D',
  900: '#147836'
};

const redShades: ColorShades = {
  100: '#FFC2B7',
  300: '#FF9F8D',
  500: red,
  700: '#C94F39',
  900: '#A3301B'
};

const pinkShades: ColorShades = {
  100: '#ECA9C6',
  300: '#DD7AA5',
  500: pink,
  700: '#AA3065',
  900: '#8A174A'
};

const darkBlueShades: ColorShades = {
  100: '#375167',
  300: '#223A50',
  500: '#13293D',
  700: '#071929',
  900: '#010C16'
};

const purpleShades: ColorShades = {
  100: '#837B97',
  300: '#63587B',
  500: purple,
  700: '#322849',
  900: '#23183F'
};

export const shades: Shades = {
  limeGreen: limeGreenShades,
  secondaryGreen: secondaryGreenShades,
  red: redShades,
  pink: pinkShades,
  darkBlue: darkBlueShades,
  purple: purpleShades
};

export const dark: ThemeFlavor = {
  background: darkBlue,
  text: lightGray,
  heading: limeGreen
};
export const light: ThemeFlavor = {
  background: lightGray,
  text: darkGray,
  heading: limeGreen
};

export const themes = {
  dark,
  light
};

export const primary = limeGreen;
export const secondary = purple;
export const complimentary = pink;
export const background = dark.background;
export const text = dark.text;

export default colors;
