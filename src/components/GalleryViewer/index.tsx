import { Navbar } from "@/components/Navbar";
import {
  Box,
  useColorModeValue,
  Text,
  Button,
  Link,
  Divider,
  useColorMode,
  useMediaQuery,
  useBreakpointValue as getBreakpoints,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { Renderer as GalleryRenderer } from "@/components/canvas/Renderer";
import galleryStore, { ZoomLevels } from "@/stores/galleryStore";
import shallow from "zustand/shallow";
import { useSpring, animated, config, useTransition } from "react-spring";
import { FC, useEffect } from "react";
import { truncateAddress } from "@/common/utils";
import { useHotkeys } from "react-hotkeys-hook";
import { calculateProgress } from "@/common/utils";
import { useGetNfts } from "@/data/useGetNfts";
import { useAccount } from "wagmi";
import { MouseComponent } from "@/components/canvas/MouseComponent";
import { CloseButton } from "@/components/SVG";
import mousePositionStore, { Icons } from "@/stores/mousePositionStore";
import { GetNftMetadataResponse } from "@alch/alchemy-web3";
import { ClientOnly } from "@/components/UtilityComponents/ClientOnly";
import { RiArrowRightLine } from "react-icons/ri";
interface IInner {
  nftData: GetNftMetadataResponse[];
  collectionName: string;
}
export const GalleryViewer: FC<IInner> = ({ nftData, collectionName }) => {
  const textColor = useColorModeValue("black", "white");
  const bgColor = useColorModeValue("white", "black");
  const { colorMode } = useColorMode();
  const [touch] = useMediaQuery("(hover: none), (pointer: coarse)");
  const [maxWidth] = useMediaQuery("(max-width:600px)");

  const {
    showBar,
    progressValue,
    currentZoom,
    galleryItemIdx,
    galleryLength,
    distanceBtwnAssets,
    isEndGallery,
    setViewingAbout,
    zoomOut,
    viewingAbout,
    setDistanceBtwnAssets,
  } = galleryStore(
    (state) => ({
      isEndGallery: state.isEndGallery,
      distanceBtwnAssets: state.distanceBtwnAssets,
      progressValue: state.progressValue,
      showBar: state.showBar,
      currentZoom: state.currentZoom,
      galleryItemIdx: state.galleryItemIdx,
      galleryLength: state.galleryLength,
      viewingAbout: state.viewingAbout,
      setViewingAbout: state.setViewingAbout,
      zoomIn: state.zoomIn,
      zoomOut: state.zoomOut,
      setDistanceBtwnAssets: state.setDistanceBtwnAssets,
    }),
    shallow
  );
  useEffect(() => {
    if (currentZoom !== ZoomLevels.NoZoom) {
      setDistanceBtwnAssets(window.innerWidth);
    } else {
      if (window.innerWidth >= 600) {
        setDistanceBtwnAssets(300);
      } else if (window.innerWidth < 600 && window.innerWidth >= 400) {
        setDistanceBtwnAssets(window.innerWidth / 3.5 + 100);
      } else {
        setDistanceBtwnAssets(window.innerWidth / 4 + 100);
      }
    }
  }, [currentZoom, setDistanceBtwnAssets, maxWidth, window.innerWidth]);

  const minZoomTitleTransition = useTransition(
    currentZoom === ZoomLevels.NoZoom,
    {
      from: {
        opacity: 0,
      },
      enter: {
        opacity: 1,
      },
      leave: {
        opacity: 0,
      },
      config: { duration: 500 },
    }
  );
  const item = nftData.map((i) => i.title);
  const titleTransitions = useTransition(item[galleryItemIdx], {
    from: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
    },
    leave: {
      opacity: 0,
    },
    config: { duration: 500 },
  });

  const priceTransitions = useTransition("Make Offer", {
    from: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
    },
    leave: {
      opacity: 0,
    },
    config: { duration: 500 },
  });
  const minZoomOnMinStyle = useSpring({
    opacity: currentZoom === ZoomLevels.NoZoom ? 0 : 1,
    config: { duration: 500 },
  });

  const moveFooterOnMaxZoomStyle = useSpring({
    transform:
      currentZoom === ZoomLevels.MaxZoom
        ? "translateY(100px)"
        : "translateY(0px)",
  });

  const aboutSidebarTransition = useTransition(viewingAbout, {
    from: {
      transform: "translateX(-100%)",
    },
    enter: {
      transform: "translateX(0%)",
    },
    leave: {
      transform: "translateX(-100%)",
    },
    config: config.default,
  });

  const endGalleryTransition = useTransition(isEndGallery, {
    from: {
      transform: "translateX(100%)",
    },
    enter: {
      transform: "translateX(0%)",
    },
    leave: {
      transform: "translateX(100%)",
    },
    config: config.default,
  });

  const showBarStyles = useSpring({ opacity: showBar ? 1 : 0 });

  const AnimatedBox = animated(Box);

  let calcProgress = calculateProgress(
    distanceBtwnAssets / (distanceBtwnAssets * galleryLength),
    progressValue,
    galleryLength,
    distanceBtwnAssets
  );
  const [isTouch] = useMediaQuery("(hover: none), (pointer: coarse)");
  const textBp = getBreakpoints({
    base: "48",
    md: "48",
    lg: "80",
    xl: "80",
    "2xl": "80",
  });
  return (
    <Box>
      <GalleryRenderer nftData={nftData} />
      <ClientOnly>
        <AnimatedBox
          style={showBarStyles}
          width="40vw"
          bg="#B6C0D1"
          position="fixed"
          left="32px"
          right="32px"
          margin="auto"
          top="48px"
        >
          <Box bg={textColor} height="2px" width={`${calcProgress * 100}%`} />
        </AnimatedBox>

        <AnimatedBox
          style={moveFooterOnMaxZoomStyle}
          userSelect={"none"}
          bottom="33px"
          left={["24px", null, "32px"]}
          right={["24px", null, "32px"]}
          position="fixed"
          display="flex"
        >
          <Box flexGrow={1} height="43px">
            <Box
              opacity={viewingAbout ? 0 : 1}
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
            >
              {minZoomTitleTransition((styles, isMinZoom) => {
                return (
                  <>
                    {isMinZoom ? (
                      <AnimatedBox
                        style={styles}
                        position="absolute"
                        bottom="0px"
                        display="flex"
                        flexDir="col"
                        alignItems="center"
                        height="100%"
                        width="100%"
                      >
                        <Text
                          fontWeight="medium"
                          fontSize={[".75rem", null, "1rem"]}
                        >
                          {collectionName}
                        </Text>
                      </AnimatedBox>
                    ) : (
                      <AnimatedBox
                        style={styles}
                        position="absolute"
                        bottom="0"
                        height="100%"
                        width="100%"
                      >
                        {titleTransitions((style, item) => {
                          return (
                            <>
                              {
                                <Box fontWeight="500">
                                  <AnimatedBox
                                    fontSize={[".75rem", null, "1rem"]}
                                    bottom="5"
                                    maxWidth={["117px", null, "unset"]}
                                    position="absolute"
                                    style={style}
                                  >
                                    {item}
                                  </AnimatedBox>
                                </Box>
                              }
                            </>
                          );
                        })}
                        <Box
                          textDecoration="underline"
                          mt="25px"
                          width="max-content"
                          onClick={setViewingAbout}
                        >
                          <Text
                            fontWeight="medium"
                            fontSize={[".75rem", null, ".875rem"]}
                          >
                            About
                          </Text>
                        </Box>
                      </AnimatedBox>
                    )}
                  </>
                );
              })}
            </Box>
          </Box>
          <AnimatedBox style={minZoomOnMinStyle}>
            {priceTransitions((style, item) => {
              return (
                <AnimatedBox
                  right="0px"
                  px={["12px", null, "16px"]}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  position="absolute"
                  bottom="0"
                  height={["32px", null, "100%"]}
                  fontSize={[".75rem", null, ".875rem"]}
                  maxWidth={["91px", null, "117px"]}
                  fontWeight="medium"
                  border={`1px solid ${textColor}`}
                  _hover={{ bg: textColor, color: bgColor }}
                  rel="noopener noreferrer"
                  onClick={() =>
                    window.open(
                      `https://opensea.io/assets/${nftData[galleryItemIdx]?.contract.address}/${nftData[galleryItemIdx]?.id.tokenId}`,
                      "_blank"
                    )
                  }
                  style={style}
                >
                  {item}
                </AnimatedBox>
              );
            })}
          </AnimatedBox>
        </AnimatedBox>
        {currentZoom === ZoomLevels.MaxZoom && (
          <Box
            zIndex={100}
            position="fixed"
            sx={{
              ...(touch ? { bottom: "32px" } : { top: "32px" }),
            }}
            right="32px"
            as="svg"
            width={["55px", null, "64px"]}
            height={["55px", null, "64px"]}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            _hover={{ "& > .button-bg": { fill: "#F2F2F2" } }}
            onClick={() => zoomOut()}
          >
            <rect
              className="button-bg"
              x="0.5"
              y="0.5"
              width="63"
              height="63"
              rx="31.5"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M41.7072 23.7072L23.7072 41.7072L22.293 40.293L40.293 22.293L41.7072 23.7072Z"
              fill="black"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M40.2928 41.7072L22.2928 23.7072L23.707 22.293L41.707 40.293L40.2928 41.7072Z"
              fill="black"
            />
            <rect
              x="0.5"
              y="0.5"
              width="63"
              height="63"
              rx="31.5"
              stroke="black"
            />
          </Box>
        )}
        {/* About box */}
        {aboutSidebarTransition((style, item) => {
          return (
            item && (
              <>
                <AnimatedBox
                  style={style}
                  position="absolute"
                  overflow="hidden"
                  overflowY="auto"
                  width={["100%", null, "40vw"]}
                  zIndex={[2]}
                  bg={bgColor}
                  px="32px"
                  pt="32px"
                  top={["0px", null, "64px"]}
                  pb="30vh"
                  height={["100vh", null, "calc(100vh - 64px)"]}
                  sx={{
                    scrollbarWidth: "thin",
                    msOverflowStyle: {
                      width: "5px",
                      height: "5px",
                      bg: "#CCCCCC",
                    },
                    "&::-webkit-scrollbar": {
                      width: "5px",
                      height: "5px",
                      bg: colorMode === "light" ? "#CCCCCC" : "gray.800",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: colorMode === "light" ? "black" : "white",
                    },
                  }}
                >
                  <Box maxWidth={["100%", null, "456px"]}>
                    <Box display="flex" justifyContent="space-between">
                      <Text fontSize="1rem" fontWeight="bold">
                        {nftData[galleryItemIdx]?.title}
                      </Text>
                    </Box>
                  </Box>
                  <Box maxWidth={["100%", null, "456px"]}>
                    <Box
                      fontSize="14px"
                      color={colorMode === "light" ? "#666666" : "#EEEEEE"}
                    >
                      {/* <Text mt="16px">
                        Created by{" "}
                        <Box as="span" textDecoration="underline">
                          Lorem Epsum
                        </Box>
                      </Text> */}
                      {/* <Text>Deadfellaz x grelysian, 2021</Text> */}
                      <Text mt="20px">
                        {/* Colored pencil and ink on paper, scanned, adjusted in Adobe
                      Photoshop. */}
                        {nftData[galleryItemIdx]?.description}
                      </Text>
                      <Button
                        mt="38px"
                        borderRadius={0}
                        color={textColor}
                        isFullWidth
                        colorScheme="black"
                        cursor="none"
                        _hover={{ bg: textColor, color: bgColor }}
                        variant="outline"
                        rel="noopener noreferrer"
                        onClick={() =>
                          window.open(
                            `https://opensea.io/assets/${nftData[galleryItemIdx]?.contract.address}/${nftData[galleryItemIdx]?.id.tokenId}`,
                            "_blank"
                          )
                        }
                      >
                        {/* Purchase for Ξ 100 */}
                        View on Opensea
                      </Button>
                      <Text mt="32px">
                        {/* Dedicated collection for grelysian artist collaborations.{" "}
                      <Link
                        textDecoration="underline"
                        href="https://grelysian.xyz"
                      >
                        https://grelysian.xyz
                      </Link> */}
                      </Text>
                      <Divider borderColor="#666666" mt="31px" />

                      <Box mt="31px">
                        <Text>
                          Contract Address:{" "}
                          <Link
                            isExternal
                            href={`https://etherscan.io/token/${nftData[galleryItemIdx]?.contract.address}`}
                          >
                            0x
                            {truncateAddress(
                              nftData[galleryItemIdx]?.contract.address,
                              4
                            )}
                          </Link>
                        </Text>
                        <Text>
                          Token ID: {nftData[galleryItemIdx]?.id.tokenId}
                        </Text>
                        <Text>
                          Token Standard:{" "}
                          {nftData[galleryItemIdx]?.id.tokenMetadata.tokenType}
                        </Text>
                        <Text>Blockchain: Ethereum </Text>
                      </Box>
                    </Box>
                  </Box>
                </AnimatedBox>
                <AnimatedBox
                  style={style}
                  position={"fixed"}
                  zIndex={3}
                  opacity={viewingAbout ? 1 : 0}
                  bottom={["24px", null, "32px"]}
                  left={["24px", null, "32px"]}
                  onClick={setViewingAbout}
                >
                  <CloseButton />
                </AnimatedBox>
              </>
            )
          );
        })}
        {endGalleryTransition((style, item) => {
          return (
            item && (
              <>
                <AnimatedBox
                  style={style}
                  position="fixed"
                  overflow="hidden"
                  width={["100%", null, "50vw"]}
                  zIndex={2}
                  bg={bgColor}
                  right="0"
                  borderLeft="1px solid black"
                  height={"100vh"}
                  display="flex"
                  flexDir="column"
                >
                  <Box
                    height="80vh"
                    px="92px"
                    pb="50px"
                    borderBottom="1px solid black"
                    display="flex"
                    flexDir="column"
                    justifyContent="flex-end"
                  >
                    <Text variant="32">A collection by Naim</Text>
                  </Box>
                  <Box
                    p="92px"
                    height="100px"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    _hover={{ bg: "black", color: "white" }}
                  >
                    <Text variant="24">Exit</Text>
                    <RiArrowRightLine size="3em" />
                  </Box>
                </AnimatedBox>
              </>
            )
          );
        })}
        {!isTouch && <MouseComponent />}
      </ClientOnly>
    </Box>
  );
};
