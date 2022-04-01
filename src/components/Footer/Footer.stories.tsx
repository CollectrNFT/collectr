// Button.stories.js|jsx

import { Box, PlacementWithLogical } from "@chakra-ui/react";
import React from "react";

import { Footer as FooterComponent } from ".";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "Footer",
  component: FooterComponent,
};
export const Footer = () => <FooterComponent />;
