export type MediaQuery = "sm" | "md" | "lg";

export type MediaQueryBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export type MediaQueryConfig = {
  [key in MediaQueryBreakpoint]: string;
};

export const mediaQueries: MediaQueryConfig = {
  xs: "(min-width: 475px)",
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};
