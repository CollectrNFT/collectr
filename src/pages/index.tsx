import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  useBreakpointValue,
  LightMode,
} from "@chakra-ui/react";
import { NextPage } from "next";

import { Container } from "../components/Container";
import { Navbar } from "../components/Navbar";
import { MintMembershipPassButton } from "../components/Buttons/MintMembershipPass";
import { CollectrLogo, DownArrow } from "../components/SVG";
import { RiArrowRightLine } from "react-icons/ri";
import { useRef, useState } from "react";
import { Footer } from "../components/Footer";
import { ImageContainer } from "../components/ImageContainer";
import { vwToPixel } from "../common/utils";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";

import useScrollPositionOld from "@react-hook/window-scroll";
import { config, useSpring } from "react-spring";
const Home: NextPage = () => {
  const collectrLogo = useBreakpointValue({
    sm: { width: 300, height: 130 },
    md: { width: 500, height: 130 },
    lg: { width: 600, height: 130 },
    xl: { width: 874, height: 130 },
  });
  const downArrow = useBreakpointValue({
    sm: { width: 60, height: 69 },
    md: { width: 60, height: 69 },
    lg: { width: 80, height: 89 },
    xl: { width: 98, height: 99 },
  });

  const collectionSize = useBreakpointValue({
    xs: 100,
    sm: 125,
    md: vwToPixel(14.3),
    lg: vwToPixel(14.3),
    xl: vwToPixel(14.3),
  });
  const mainPageCollections = [
    {
      main: true,
      account: `Sotheby’s`,
      title: "Into the Metaverse",
      images: ["./images/12.jpg", "./images/11.jpg", "./images/10.jpg"],
    },
    {
      account: `ArtBlocks`,
      title: "Season 1",
      images: ["./images/06.jpg", "./images/04.jpg", "./images/03.jpg"],
    },
    {
      account: `Amy`,
      title: "Portrait Photography",
      images: ["./images/09.jpg", "./images/10.jpg", "./images/13.jpg"],
    },
    {
      account: `Reese W`,
      title: "Shapes and Bodies",
      images: ["./images/08.jpg", "./images/11.jpg", "./images/01.jpg"],
    },
  ];
  const [headerStyle, setHeaderStyle] = useState(`translate(0%,0%)`);
  useScrollPosition(
    ({ prevPos, currPos }) => {
      setHeaderStyle(`translate(0px, ${Math.round(currPos.y * -0.2)}px)`);
    },
    [headerStyle]
  );
  const scrollY = useScrollPositionOld(100 /*fps*/);
  const ref = useRef<HTMLDivElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);

  const { y } = useSpring({
    from: { y: collectionRef.current?.scrollTop || 0 },
    immediate: false,
    config: config.slow,
    onChange: () => {
      collectionRef.current?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    },
  });

  if (!collectrLogo || !downArrow || !collectionSize) {
    return <>Loading...</>;
  }
  return (
    <LightMode>
      <Box ref={ref} bg="white">
        <Navbar />

        <Box
          display={"flex"}
          alignItems="center"
          willChange={"transform"}
          minHeight={[
            `calc(100vh - 60px)`,
            `calc(100vh - 64px)`,
            `calc(100vh - 100px)`,
            `calc(100vh - 140px)`,
          ]}
        >
          <Box
            willChange={"transform"}
            position={"relative"}
            width="100%"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              transform: headerStyle,
            }}
          >
            {/* Hero */}
            <Box position="relative" flexGrow={1}>
              <Box
                px="32px"
                display="flex"
                justifyContent="space-between"
                flexDir={["column", null, null, "row"]}
              >
                <Box display="flex" flexDir="column" alignItems="center">
                  <Box
                    display={"flex"}
                    alignItems="center"
                    width="100%"
                    position={"relative"}
                    pointerEvents={"none"}
                  >
                    <Box
                      mt={["46px", null, "0px"]}
                      display="flex"
                      alignItems="center"
                      position={"absolute"}
                      zIndex={0}
                      justifyContent={["flex-start", null, "center"]}
                      width={[null, "64px", "100px", "140px"]}
                    >
                      <Text
                        sx={{
                          writingMode: "vertical-rl",
                          transform: "rotate(-180deg)",
                          color: "rgba(102, 102, 102, 1)",
                        }}
                      >
                        Deadfellaz x grelysian
                      </Text>
                    </Box>

                    <Box
                      mt={["46px", null, "0px"]}
                      ml={[null, null, null, "140px"]}
                      display="flex"
                      justifyContent={["center", null, null, "unset"]}
                      width="100%"
                    >
                      <Image
                        alt="stock-image"
                        width={["50%", "65%", "50%", "80%", "65%"]}
                        src="./images/stock-nft.png"
                      />
                    </Box>
                  </Box>
                  <Box
                    mt={["0px", null, "36px"]}
                    alignSelf={["center", null, null, "normal"]}
                  >
                    <CollectrLogo {...collectrLogo} />
                  </Box>
                </Box>
                <Box display="flex" flexDir="column" width="100%">
                  <Box
                    maxWidth={["100%", "370px"]}
                    width="100%"
                    display="flex"
                    flexDir="column"
                    alignItems="center"
                    height="100%"
                    alignSelf="center"
                    justifyContent="center"
                  >
                    <Heading
                      fontWeight="400"
                      fontSize={["1.5rem", null, "2rem", null, "3rem"]}
                      textAlign="center"
                    >
                      Art gallery for your NFT.
                    </Heading>
                    <VStack
                      mt={["30px", null, "38px"]}
                      gap="16px"
                      maxWidth={["100%", "327px"]}
                      width="100%"
                    >
                      <Box width="100%" height="56px">
                        <MintMembershipPassButton />
                      </Box>
                    </VStack>
                  </Box>
                  <Box
                    onClick={() => {
                      const t =
                        collectionRef.current?.getBoundingClientRect().top!;
                      y.set(t);
                    }}
                    display="flex"
                    mt={["20px", null, "30px", null, "0px"]}
                    mb={["20px", null, "30px", null, "0px"]}
                    justifyContent={["center", null, null, "flex-end"]}
                  >
                    <DownArrow {...downArrow} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Collection */}
        <Box
          color="black"
          ref={collectionRef}
          position={"relative"}
          bg="white"
          borderTop={"2px solid black"}
        >
          {mainPageCollections.map((collection) => {
            return (
              <Container
                key={collection.title}
                bg="white"
                _hover={{ color: "#FFFFFF", background: "#000000" }}
                sx={{ transitionDuration: "0.5s" }}
                cursor="pointer"
              >
                <Box>
                  {collection.main && (
                    <Text
                      mb="88px"
                      pt={["10px", null, "0"]}
                      display="flex"
                      justifyContent={"flex-start"}
                      fontWeight="500"
                      fontSize={["2rem", null, "3rem"]}
                    >
                      Featured Collections
                    </Text>
                  )}
                  <Box
                    display="flex"
                    alignItems={["unset", null, null, "center"]}
                    justifyContent="space-between"
                    flexDir={["column", null, null, "row"]}
                  >
                    <Box maxWidth="564px">
                      <Text fontWeight="500" fontSize="1.125rem">
                        {collection.account}
                      </Text>
                      <Text
                        lineHeight={["3rem", null, "5rem"]}
                        fontSize={["3rem", null, "5rem"]}
                        fontWeight="500"
                      >
                        {collection.title}
                      </Text>
                      <Box display={["none", null, null, "inherit"]}>
                        <RiArrowRightLine size={"6em"} />
                      </Box>
                    </Box>
                    <Box
                      mt={["24px", null, "36px", "0px"]}
                      mr={[
                        `-${collectionSize! / 2 + 32}px`,
                        null,
                        null,
                        `-${collectionSize! / 2 + 72}px`,
                      ]}
                      display="flex"
                      justifyContent={"space-between"}
                      width={["unset", null, null, "60vw", null, "50vw"]}
                    >
                      {collection.images?.map((image, imageIdx) => {
                        return (
                          <ImageContainer
                            key={image}
                            collectionSize={collectionSize!}
                            image={image}
                          />
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
              </Container>
            );
          })}
        </Box>
        {/* View All Collection */}
        <Container
          bg="white"
          color="black"
          position="relative"
          _hover={{ color: "#FFFFFF", background: "#000000" }}
          cursor="pointer"
          display={"flex"}
          alignItems={["flex-end", "center"]}
          justifyContent="space-between"
          sx={{ transitionDuration: "0.5s", py: "40px" }}
        >
          <Text
            lineHeight={["3rem", null, "5rem"]}
            fontWeight="500"
            fontSize={["3rem", null, "5rem"]}
          >
            View All Collections
          </Text>
          <RiArrowRightLine size={"6em"} />
        </Container>
        {/* Footer */}
        <Box bg="white" color="black" position="relative">
          <Footer />
        </Box>
      </Box>
    </LightMode>
  );
};

export default Home;
