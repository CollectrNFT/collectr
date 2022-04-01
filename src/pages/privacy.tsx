import { Navbar } from "@/components/Navbar";
import {
  Box,
  useBreakpointValue as getBreakpoints,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "next";

const Privacy: NextPage = () => {
  return (
    <Box>
      <Navbar staticLogo hideWallet />
      <Privacy>
        <Box px={["24px", null, "72px"]}>
          <Box
            display="flex"
            justifyContent={["center", null, "space-between"]}
          >
            <Box
              display="flex"
              justifyContent={["center", null, "flex-start"]}
              maxW="1270"
            >
              <Text
                variant={getBreakpoints({
                  base: "48",
                  md: "150",
                  lg: "150",
                  xl: "150",
                  "2xl": "150",
                })}
              >
                Privacy
              </Text>
            </Box>
          </Box>
        </Box>
      </Privacy>
      n~
    </Box>
  );
};

export default Privacy;
