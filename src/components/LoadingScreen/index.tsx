import { Box } from "@chakra-ui/react";
import React from "react";
import Loader from "../Loader";

export const LoadingScreen = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      justifyContent={"center"}
      alignItems={"center"}
      flexDir={"column"}
    >
      <Loader />
      <Box mt="4px">Loading...</Box>
    </Box>
  );
};
