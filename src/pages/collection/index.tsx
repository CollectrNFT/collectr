import { Navbar } from "@/components/Navbar";
import { ClientOnly } from "@/components/UtilityComponents/ClientOnly";
import {
  Box,
  Text,
  useBreakpointValue as getBreakpoints,
} from "@chakra-ui/react";
import { NextPage } from "next";

const Collections: NextPage = () => {
  return (
    <Box>
      <Navbar staticLogo hideWallet />
      <ClientOnly>
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
                Collections
              </Text>
            </Box>
          </Box>
        </Box>
      </ClientOnly>
    </Box>
  );
};

export default Collections;
