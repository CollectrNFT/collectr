// 1. Import the extendTheme function
import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

// 2. Extend the theme to include custom colors, fonts, etc
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac",
  },
};
const breakpoints = createBreakpoints({
  sm: "321px",
  md: "768px",
  lg: "1024px",
  xl: "1200px",
  "2xl": "1440px",
});

const fonts = {
  heading: "Helvetica Neue",
  body: "Helvetica Neue",
};

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({ colors, breakpoints, fonts, config });
