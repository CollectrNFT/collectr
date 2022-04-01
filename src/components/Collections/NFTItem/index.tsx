import { Box } from "@chakra-ui/react";
import React, { forwardRef } from "react";

// eslint-disable-next-line react/display-name
export const Item = forwardRef<HTMLInputElement, any>(
  ({ id, ...props }, ref) => {
    return (
      <Box width="100px" {...props} ref={ref}>
        {id} hi
      </Box>
    );
  }
);
