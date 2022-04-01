import { MintButton } from "@/components/Buttons/Mint";
import { Footer } from "@/components/Footer";
import { MintSVGBlock } from "@/components/SVG";
import { ClientOnly } from "@/components/UtilityComponents/ClientOnly";
import {
  Box,
  Divider,
  Grid,
  Heading,
  Text,
  useBreakpointValue as getBreakpoints,
} from "@chakra-ui/react";
import { Container } from "../components/Container";
import { NextPage } from "next";
import { RiArrowRightLine } from "react-icons/ri";

import { Navbar } from "../components/Navbar";

const Mint: NextPage = () => {
  const mintDetails = [
    { heading: "Mint Price", subheading: "0.08ETH" },
    { heading: "Supply", subheading: "2490 of 10,000 left" },
    { heading: "Limit", subheading: "1 per wallet" },
    { heading: "Royalties", subheading: "10%" },
  ];

  const mintBenefits = [
    {
      heading: "Member Pass NFT",
      subheading:
        "Your pass is generated on-chain and unique. The NFT pass in your wallet gives you access to all Collectr features.",
    },
    {
      heading: "Curate Collections",
      subheading: "Select the NFTs you wish to your collections.",
    },
    {
      heading: "Up to 10 Collections",
      subheading: "Create multiple collections",
    },
    {
      heading: "Dark theme",
      subheading: "Your collection with a dark background",
    },
    {
      heading: "Access to Collectrs Discord",
      subheading: "Channel dedicated to Pass holders only",
    },
    {
      heading: "Display Price Button",
      subheading: "Your NFTs now display the Price and Make offer button.",
    },
    {
      heading: "Secure your username",
      subheading: "…",
    },
    {
      heading: "Re-Order NFTs",
      subheading:
        "Place your NFTs in your collection in the order you want viewers to see them.",
    },
    {
      heading: "Unique web URL",
      subheading: "…",
    },
    {
      heading: "Life time access",
      subheading: "…",
    },
    {
      heading: "Life time access",
      subheading: "…",
    },
    {
      heading: "+More",
      subheading:
        "We are hard at work making Collectr even better. All members will have access to future updates.",
    },
  ];
  return (
    <Box>
      <Navbar staticLogo hideWallet />
      <Box px={["24px", null, null, "72px"]}>
        <Box
          display="flex"
          justifyContent={["center", null, null, "space-between"]}
        >
          <Box
            display="flex"
            justifyContent={["center", null, "flex-start"]}
            maxW="1270"
          >
            <ClientOnly>
              <Text
                variant={getBreakpoints({
                  base: "48",
                  md: "80",
                  lg: "150",
                  xl: "150",
                  "2xl": "200",
                })}
              >
                MEMBERSHIP PASS
              </Text>
            </ClientOnly>
          </Box>
          <Box
            position="absolute"
            right="72px"
            w="280px"
            h="90px"
            alignSelf="flex-end"
            display={["none", null, null, "block"]}
          >
            <MintButton />
          </Box>
        </Box>
        <ClientOnly>
          <Box display="flex" mt="41px" justifyContent={["center"]}>
            <MintSVGBlock />
          </Box>
        </ClientOnly>
        <Box
          my="24px"
          w="100%"
          h="109px"
          alignSelf="flex-end"
          display={["block", null, null, "none"]}
        >
          <MintButton />
        </Box>
        <Grid
          gridTemplateColumns={["1fr 1fr", null, null, "1fr 1fr 1fr 1fr"]}
          gap={["54px", null, "15px"]}
          my={["36px", null, null, "82px"]}
        >
          {mintDetails.map((detail, i) => {
            return (
              <Box key={i}>
                <Text fontSize={["2rem", null, "2.813rem"]}>
                  {detail.heading}
                </Text>
                <Text fontSize={[".938rem", null, "1.125rem"]}>
                  {detail.subheading}
                </Text>
              </Box>
            );
          })}
        </Grid>
        <Box borderColor="#000000" borderTop={"2px solid "} />
        <Box>
          <Heading fontSize={"5rem"} mt="84px">
            Benefits
          </Heading>
          <Grid
            gridTemplateColumns={["1fr", "1fr 1fr", null, "1fr 1fr 1fr"]}
            gap={["54px", null, "70px"]}
            mt={["34px", null, null, "34px"]}
            mb={["104px"]}
          >
            {mintBenefits.map((benefit, i) => {
              return (
                <Box maxW="305px" key={i}>
                  <Text fontSize={[".938rem", null, "1.125rem"]}>
                    {benefit.heading}
                  </Text>
                  <Text color="rgba(102, 102, 102, 1)">
                    {benefit.subheading}
                  </Text>
                </Box>
              );
            })}
          </Grid>
          <Box borderColor="#000000" borderTop={"2px solid "} />
        </Box>
        <Container
          bg="white"
          color="black"
          _hover={{ color: "#FFFFFF", background: "#000000" }}
          cursor="pointer"
          display={"flex"}
          width="100%"
          px="0"
          alignItems={["flex-end", "center"]}
          justifyContent="space-between"
          border="none"
          sx={{ transitionDuration: "0.5s", py: "40px" }}
        >
          <Text
            pl="5px"
            lineHeight={["3rem", null, "5rem"]}
            fontWeight="500"
            maxW={["231px", "100%"]}
            fontSize={["3rem", null, "5rem"]}
          >
            View Members
          </Text>
          <RiArrowRightLine size={"6em"} />
        </Container>
      </Box>
      {/* Footer */}
      <Box
        mt={["59px", null, "151px"]}
        borderColor="#000000"
        borderTop={"2px solid "}
        bg="white"
        color="black"
        width="100%"
        position={"relative"}
      >
        <ClientOnly>
          <Footer />
        </ClientOnly>
      </Box>
    </Box>
  );
};

export default Mint;
