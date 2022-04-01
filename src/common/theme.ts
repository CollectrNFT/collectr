import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { createBreakpoints, Styles, mode } from "@chakra-ui/theme-tools";

const styles: Styles = {
  global: (props) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("white", "black")(props),
    },
  }),
};

const breakpoints = createBreakpoints({
  sm: "321px",
  md: "768px",
  lg: "1024px",
  xl: "1200px",
  "2xl": "1440px",
});

const fonts = {
  heading: "Neue Montreal",
  body: "Neue Montreal",
};

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const components = {
  Text: {
    variants: {
      200: {
        fontSize: "200px",
        fontWeight: "500",
        lineHeight: "200px",
        letterSpacing: "-4px",
      },
      150: {
        fontSize: "150px",
        fontWeight: "500",
        lineHeight: "150px",
        letterSpacing: "-4px",
      },
      100: {
        fontSize: "100px",
        fontWeight: "500",
        lineHeight: "100px",
        letterSpacing: "-2px",
      },
      80: {
        fontSize: "80px",
        fontWeight: "500",
        lineHeight: "80px",
        letterSpacing: "-2px",
      },
      48: {
        fontSize: "48px",
        fontWeight: "500",
        lineHeight: "48px",
        letterSpacing: "-0.5px",
      },
      32: {
        fontSize: "33px",
        fontWeight: "500",
        lineHeight: "32px",
        letterSpacing: "-0.5px",
      },
      underline_32: {
        fontSize: "33px",
        fontWeight: "500",
        lineHeight: "32px",
        letterSpacing: "-0.5px",
        textDecoration: "underline",
      },
      24: {
        fontSize: "24px",
        fontWeight: "500",
        lineHeight: "32px",
        letterSpacing: "0px",
      },
      underline_24: {
        fontSize: "24px",
        fontWeight: "500",
        lineHeight: "32px",
        textDecoration: "underline",
        letterSpacing: "0px",
      },
      18: {
        fontSize: "18px",
        fontWeight: "500",
        lineHeight: "28px",
        letterSpacing: "0",
      },
      underline_18: {
        fontSize: "18px",
        fontWeight: "500",
        lineHeight: "28px",
        letterSpacing: "0",
        textDecoration: "underline",
      },
      regular_18: {
        fontSize: "18px",
        lineHeight: "28px",
        letterSpacing: "0",
      },
      16: {
        fontSize: "16px",
        fontWeight: "500",
        lineHeight: "24px",
        letterSpacing: "0",
      },
      underline_16: {
        fontSize: "16px",
        fontWeight: "500",
        lineHeight: "24px",
        letterSpacing: "0",
        textDecoration: "underline",
      },
      regular_16: {
        fontSize: "16px",
        lineHeight: "24px",
        letterSpacing: "0",
      },
      14: {
        fontSize: "14px",
        fontWeight: "500",
        lineHeight: "20px",
        letterSpacing: "0",
      },
      underline_14: {
        fontSize: "14px",
        fontWeight: "500",
        lineHeight: "20px",
        letterSpacing: "0",
        textDecoration: "underline",
      },
      regular_14: {
        fontSize: "14px",
        lineHeight: "20px",
        letterSpacing: "0",
      },
      12: {
        fontSize: "12px",
        fontWeight: "500",
        lineHeight: "16px",
        letterSpacing: "0",
      },
      underline_12: {
        fontSize: "12px",
        fontWeight: "500",
        lineHeight: "16px",
        letterSpacing: "0",
        textDecoration: "underline",
      },
      regular_12: {
        fontSize: "12px",
        lineHeight: "16px",
        letterSpacing: "0",
      },
    },
  },
};
export const theme = extendTheme({
  components,
  breakpoints,
  fonts,
  config,
  styles,
});
