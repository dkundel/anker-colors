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
    lightGray: string;
    darkGray: string;
    purple: string;
    secondaryGreen: string;
    salmon: string;
    pink: string;
    yellowgreen: string;
    lightgreen: string;
    mediumseagreen: string;
    mediumaquamarine: string;
    mediumturquoise: string;
    steelblue: string;
    cornflowerblue: string;
    slateblue: string;
    mediumslateblue: string;
    mediumorchid: string;
    orchid: string;
    hotpink: string;
    palevioletred: string;
    indianred: string;
    peru: string;
    darkkhaki: string;
}
export interface ExtendedColors extends Colors {
}
export declare type Color = keyof Colors;
export declare type Shades = {
    [key in Color]: ColorShades;
};
