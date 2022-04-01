import Loader from "@/components/Loader";
import { Navbar } from "@/components/Navbar";
import {
  Box,
  Heading,
  Text,
  useBreakpointValue as getBreakpoints,
} from "@chakra-ui/react";
import { NextPage } from "next";

const TOS: NextPage = () => {
  return (
    <Box>
      <Navbar staticLogo hideWallet />
      <Box width="300px">
        <Loader size="50px" />
      </Box>

      <Box px={["24px", null, "72px"]}></Box>
    </Box>
  );
};

export default TOS;
