export interface ColorShades {
  100: string;
  300: string;
  500: string;
  700: string;
  900: string;
}

export interface Dict<T> {
  [key: string]: T;
}

export interface ThemeFlavor {
  background: string;
  heading: string;
  text: string;
}

export interface Colors {
  limeGreen: string;
  darkBlue: string;
  purple: string;
  secondaryGreen: string;
  red: string;
  pink: string;
}

export interface ExtendedColors extends Colors {
  lightGray: string;
  darkGray: string;
}

export type Color = keyof Colors;

export type Shades = { [key in Color]: ColorShades };
