export interface Shades {
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
