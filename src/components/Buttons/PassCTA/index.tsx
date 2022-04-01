import {
  Box,
  Image,
  Link,
  Text,
  useBreakpointValue as getBreakpoints,
} from "@chakra-ui/react";
import React from "react";

interface Props {}

export const PassCTAButton = (props: Props) => {
  return (
    <Link href="./mint">
      <Box display="inline-flex" height="100%" width="100%">
        <Box
          textDecoration={"none"}
          as="button"
          bg="#FFFFFF"
          border="2px solid #000000"
          width="100%"
          color="#000000"
        >
          <Text variant={"16"}>Get a Collectr Pass</Text>
        </Box>
        <Image alt="mint-img" src="./images/mint-button.png" />
      </Box>
    </Link>
  );
};
