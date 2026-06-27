export const variantMapping = {
  "h-xxl": "h1",
  "h-xl": "h2",
  "h-l": "h3",
  "h-m": "h4",
  "h-s": "h5",
  "h-xs": "h6",
  "p-xxl": "p",
  "p-xl": "p",
  "p-l": "p",
  "p-m": "p",
  "p-s": "p",
  "c-xxl": "h3",
  "c-xl": "h4",
  "c-l": "h5",
  "c-m": "p",
  "c-s": "h6",
  span: "span",
};

export type TypographyVariant = keyof typeof variantMapping;

export type TypographyColors =
  // Light Brown
  | "LB50"
  | "LB75"
  | "LB100"
  | "LB200"
  | "LB300"
  | "LB400"
  | "LB500"
  | "LB600"
  // Brown
  | "BR50"
  | "BR75"
  | "BR100"
  | "BR200"
  | "BR300"
  | "BR400"
  | "BR500"
  // Blue
  | "B50"
  | "B75"
  | "B100"
  | "B200"
  | "B300"
  | "B400"
  | "B500"
  // Red
  | "R50"
  | "R75"
  | "R100"
  | "R200"
  | "R300"
  | "R400"
  | "R500"
  // Yellow
  | "Y50"
  | "Y75"
  | "Y100"
  | "Y200"
  | "Y300"
  | "Y400"
  | "Y500"
  // Green
  | "G50"
  | "G75"
  | "G100"
  | "G200"
  | "G300"
  | "G400"
  | "G500"
  // Purple
  | "P50"
  | "P75"
  | "P100"
  | "P200"
  | "P300"
  | "P400"
  | "P500"
  // Teal
  | "T50"
  | "T75"
  | "T100"
  | "T200"
  | "T300"
  | "T400"
  | "T500"
  // Neutral (Light)
  | "N0"
  | "N10"
  | "N20"
  | "N30"
  | "N40"
  | "N50"
  // Neutral (Mid)
  | "N60"
  | "N70"
  | "N80"
  | "N90"
  | "N100"
  | "N200"
  | "N300"
  | "N400"
  // Neutral (Dark)
  | "N500"
  | "N600"
  | "N700"
  | "N800"
  | "N900"
  //Text Colors
  | "text-default"
  | "text-light"
  | "text-sec"
  | "gray-normal"
  | "gray-darker";


export type TypographyAlign =
  | "start"
  | "end"
  | "left"
  | "right"
  | "center"
  | "justify";

export type TypographyFontWeight = "regular" | "medium" | "bold" | "black";

export type TypographyFont = "clashDisplay";

export interface TypographyProps
  extends React.HTMLAttributes<HTMLOrSVGElement> {
  tag?: keyof JSX.IntrinsicElements;
  variant?: TypographyVariant;
  color?: TypographyColors;
  fontWeight?: TypographyFontWeight;
  gutterBottom?: boolean;
  align?: TypographyAlign;
  noWrap?: boolean;
  underline?: "none" | "always" | "hover";
  customClassName?: string;
  children?: React.ReactNode;
  font?: TypographyFont;
}
