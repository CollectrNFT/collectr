import { AskTwitter } from "@/components/Buttons/AskTwitter";
import { FAQAccordian } from "@/components/FAQAccordian";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ClientOnly } from "@/components/UtilityComponents/ClientOnly";
import {
  Box,
  Divider,
  Grid,
  GridItem,
  Text,
  useBreakpointValue as getBreakpoints,
} from "@chakra-ui/react";
import { NextPage } from "next";
const FAQ: NextPage = () => {
  return (
    <Box>
      <Navbar staticLogo hideWallet />
      <ClientOnly>
        <Box
          mt={["60px", null, null, "50px"]}
          px={["24px", null, null, "72px"]}
        >
          <Box>
            <Text
              variant={getBreakpoints({
                base: "48",
                md: "48",
                lg: "150",
                xl: "150",
                "2xl": "150",
              })}
            >
              FAQs
            </Text>
          </Box>
          <Grid
            mt={["48px", null, null, "74px"]}
            templateColumns={["1fr", null, null, "1fr 2fr 1fr"]}
            gap={["56px", null, null, "6px"]}
          >
            <GridItem order={[2, null, null, 1]}>
              <Box>
                <Text variant={"24"}>Still need help?</Text>
                <Box
                  maxW={["100%", null, null, "196px"]}
                  height="56px"
                  mt="12px"
                >
                  <AskTwitter />
                </Box>
              </Box>
            </GridItem>
            <GridItem order={[1, null, null, 2]}>
              <FAQAccordian />
            </GridItem>
          </Grid>
        </Box>

        <Box mt={["128px", null, null, "178px"]} borderTop="2px solid black">
          <Footer />
        </Box>
      </ClientOnly>
    </Box>
  );
};

export default FAQ;
