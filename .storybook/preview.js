import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../src/common/theme";
import { Fonts } from "../src/components/UtilityComponents/Fonts";
import { RouterContext } from "next/dist/shared/lib/router-context";
import jest from "jest-mock";
window.jest = jest;
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
};

export const decorators = [
  (Story) => (
    <ChakraProvider theme={theme}>
      <Fonts />
      <Story />
    </ChakraProvider>
  ),
];
