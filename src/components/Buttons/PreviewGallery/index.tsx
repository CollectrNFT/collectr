import { Box } from "@chakra-ui/react";
import React from "react";

interface Props {}

export const PreviewGalleryButton = (props: Props) => {
  return (
    <Box
      as="button"
      bg="#000000"
      color="#FFFFFF"
      border="2px solid #000000"
      fontWeight="bold"
      width="100%"
      height="100%"
      _hover={{ bg: "gray.600" }}
      onClick={() => {}}
    >
      {"Preview your Gallery"}
    </Box>
  );
};
