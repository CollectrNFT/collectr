import { Box, Image } from "@chakra-ui/react";
import React from "react";

interface Props {}

export const MintMembershipPassButton = (props: Props) => {
  return (
    <Box display="inline-flex" height="100%" width="100%">
      <Box
        as="button"
        bg="#FFFFFF"
        border="2px solid #000000"
        width="100%"
        color="#000000"
        fontSize={["xs", "md"]}
        fontWeight="bold"
      >
        Get a Collectr Pass
      </Box>
      <Image alt="mint-img" src="./images/mint-button.png" />
    </Box>
  );
};
