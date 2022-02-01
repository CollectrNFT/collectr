import { As, Box, ChakraProps, OmitCommonProps } from "@chakra-ui/react";
import React, { FC, useEffect, useState } from "react";

export const Container = (
  props: JSX.IntrinsicAttributes &
    OmitCommonProps<
      React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >,
      keyof ChakraProps
    > &
    ChakraProps &
    OmitCommonProps<any, keyof ChakraProps> & { as?: As<any> | undefined }
) => {
  return (
    <Box
      px={["32px", null, "72px"]}
      py={["44px", null, "80px"]}
      borderBottom="2px solid black"
      overflow="hidden"
      {...props}
    >
      {props.children}
    </Box>
  );
};
