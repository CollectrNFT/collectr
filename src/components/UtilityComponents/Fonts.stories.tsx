// Button.stories.js|jsx

import { Text as TextComponent } from "@chakra-ui/react";
import React from "react";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Fonts",
  component: TextComponent,
  argTypes: {
    variant: {
      options: [
        "200",
        "150",
        "100",
        "80",
        "48",
        "32",
        "underline_32",
        "24",
        "underline_24",
        "18",
        "underline_18",
        "regular_18",
        "16",
        "14",
        "underline_14",
        "regular_14",
        "12",
        "underline_12",
        "regular_12",
      ],
      control: { type: "select" }, // Automatically inferred when 'options' is defined
    },
  },
};
const TextTemplate = (args) => (
  <TextComponent {...args}>{args.text}</TextComponent>
);

export const Text = TextTemplate.bind({});

Text.args = {
  variant: "200",
  text: "Hello World",
};
