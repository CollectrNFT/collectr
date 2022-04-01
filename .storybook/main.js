const path = require("path");

module.exports = {
  stories: ["../src/**/**.stories.mdx", "../src/**/**.stories.tsx"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-addon-next-router",
  ],
  framework: "@storybook/react",
  refs: {
    "@chakra-ui/react": {
      disable: true,
    },
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          "@emotion/core": "@emotion/react",
          "emotion-theming": "@emotion/react",
          "@": path.resolve(__dirname, "../src"),
        },
      },
    };
  },
};
