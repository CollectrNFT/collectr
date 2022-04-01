import { Button } from "@chakra-ui/react";
import React from "react";

export const SaveButton = (props) => {
  return (
    <Button
      bg="#000000"
      width="100%"
      height="100%"
      color="#FFFFFF"
      borderRadius="none"
      _active={{ bg: "#000000" }}
      _focus={{ bg: "#000000" }}
      _hover={{ bg: "#000000" }}
      _expanded={{ bg: "#000000" }}
      {...props}
    >
      Save
    </Button>
  );
};
