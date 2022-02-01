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
import { NFTData } from "@/common/types";
import { MouseComponent } from "@/components/canvas/MouseComponent";
import { CloseButton } from "@/components/SVG";
const Gallery: NextPage = () => {
  const {
    currentZoom,
    setViewingAbout,

    setWalletAddress,
    viewingAbout,
  } = galleryStore(
    (state) => ({
      currentZoom: state.currentZoom,
      viewingAbout: state.viewingAbout,
      setShouldZoomIn: state.setShouldZoomIn,
      setViewingAbout: state.setViewingAbout,
      setWalletAddress: state.setWalletAddress,
      zoomIn: state.zoomIn,
      zoomOut: state.zoomOut,
    }),
    shallow
  );

  const [{ data, loading: loadingAccount }] = useAccount();

  useEffect(() => {
    if (data?.address) {
      setWalletAddress(data.address);
    }
  }, [data, setWalletAddress]);

  const { nfts, isLoading: isLoadingNFTs } = useGetNfts(data?.address);

  const nftData = nfts?.data.slice(0, 7);

  const moveNavOnMaxZoomStyle = useSpring({
    transform:
      currentZoom === ZoomLevels.MaxZoom
        ? "translateY(-100px)"
        : "translateY(0px)",
  });

  const AnimatedBox = animated(Box);

  //   keyboard
  const escRef = useHotkeys("esc", setViewingAbout, {
    enabled: viewingAbout === true,
  });

  return (
    <AnimatedBox
      // @ts-ignore
      tabIndex={-1}
      // @ts-ignore
      ref={escRef}
      sx={{
        "& *": {
          cursor:
            !loadingAccount && data?.address && nftData ? "none" : "default",
        },
      }}
    >
      <AnimatedBox
        position="absolute"
        zIndex="2"
        width="100%"
        style={moveNavOnMaxZoomStyle}
      >
        <Navbar staticLogo bg="transparent" />
      </AnimatedBox>

      {(loadingAccount ||
        (isLoadingNFTs && !loadingAccount && data?.address)) && (
        <Box
          position="fixed"
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          Loading...
        </Box>
      )}
      {!loadingAccount && !data?.address && (
        <Box
          position="fixed"
          width="100vw"
          height="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          Connect Wallet to Continue
        </Box>
      )}
      {!loadingAccount && data?.address && nftData && (
        <Inner nftData={nftData} />
      )}
    </AnimatedBox>
  );
};

interface IInner {
  nftData: any;
}
export const Inner: FC<IInner> = ({ nftData }) => {
  const textColor = useColorModeValue("black", "white");
  const bgColor = useColorModeValue("white", "gray.800");
  const { colorMode } = useColorMode();
  const [touch] = useMediaQuery("(hover: none), (pointer: coarse)");

  const {
    showBar,
    progressValue,
    currentZoom,
    galleryItemIdx,
    galleryLength,
    distanceBtwnAssets,
    setViewingAbout,
    zoomOut,
    viewingAbout,
  } = galleryStore(
    (state) => ({
      distanceBtwnAssets: state.distanceBtwnAssets,
      progressValue: state.progressValue,
      showBar: state.showBar,
      currentZoom: state.currentZoom,
      galleryItemIdx: state.galleryItemIdx,
      galleryLength: state.galleryLength,
      viewingAbout: state.viewingAbout,
      setShouldZoomIn: state.setShouldZoomIn,
      setViewingAbout: state.setViewingAbout,
      zoomIn: state.zoomIn,
      zoomOut: state.zoomOut,
    }),
    shallow
  );
  // Fixtures
  const collectionName = ["Meridian by Matt Deslauriens"];

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
  const items = nftData.map((data) =>
    data.name?.includes("#") ? `${data.name}` : `${data.name} #${data.token_id}`
  );
  const titleTransitions = useTransition(items[galleryItemIdx], {
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

  const showBarStyles = useSpring({ opacity: showBar ? 1 : 0 });

  const AnimatedBox = animated(Box);

  let calcProgress = calculateProgress(
    distanceBtwnAssets / (distanceBtwnAssets * galleryLength),
    progressValue,
    galleryLength,
    distanceBtwnAssets
  );
  const [isTouch] = useMediaQuery("(hover: none), (pointer: coarse)");
  return (
    <>
      <GalleryRenderer />

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
        left={"32px"}
        right={"32px"}
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
                      bottom="0"
                      height="100%"
                      width="100%"
                    >
                      <Box fontWeight="500">{collectionName}</Box>
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
                                  bottom="5"
                                  maxWidth={["200px", null, "unset"]}
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
                        About
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
                px="16px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                position="absolute"
                bottom="0"
                height="100%"
                fontWeight="500"
                border={`1px solid ${textColor}`}
                _hover={{ bg: textColor, color: bgColor }}
                onClick={() =>
                  window.open(
                    `https://opensea.io/assets/${nftData[galleryItemIdx].token_address}/${nftData[galleryItemIdx].token_id}`,
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
            d="M42.7071 22.7072L36.4142 29.0001H42V31.0001H33L33 22.0001H35L35 27.5859L41.2929 21.293L42.7071 22.7072Z"
            fill="black"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M27.5859 35H22.0001V33H31.0001V42H29.0001V36.4142L22.7072 42.7071L21.293 41.2929L27.5859 35Z"
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
                // zIndex="2"
                bg={bgColor}
                px="32px"
                pt="32px"
                top="64px"
                pb="30vh"
                height="calc(100vh - 64px)"
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
                    bg: "#CCCCCC",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#000000",
                  },
                }}
              >
                <Box maxWidth={["100%", null, "456px"]}>
                  <Box display="flex" justifyContent="space-between">
                    <Text fontSize="1rem" fontWeight="bold">
                      {nftData[galleryItemIdx].name}
                    </Text>
                  </Box>
                </Box>
                <Box maxWidth={["100%", null, "456px"]}>
                  <Box
                    fontSize="14px"
                    color={colorMode === "light" ? "#666666" : "#EEEEEE"}
                  >
                    <Text mt="16px">
                      Created by{" "}
                      <Box as="span" textDecoration="underline">
                        Lorem Epsum
                      </Box>
                    </Text>
                    {/* <Text>Deadfellaz x grelysian, 2021</Text> */}
                    <Text mt="20px">
                      {/* Colored pencil and ink on paper, scanned, adjusted in Adobe
                    Photoshop. */}
                      {` The standard Lorem Ipsum passage, used since the 1500s
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum." Section
                      1.10.32 of "de Finibus Bonorum et Malorum", written by
                      Cicero in 45 BC "Sed ut perspiciatis unde omnis iste natus
                      error sit voluptatem accusantium doloremque laudantium,
                      totam rem aperiam, eaque ipsa quae ab illo inventore
                      veritatis et quasi architecto beatae vitae dicta sunt
                      explicabo. Nemo enim ipsam voluptatem quia voluptas sit
                      aspernatur aut odit aut fugit, sed quia consequuntur magni
                      dolores eos qui ratione voluptatem sequi nesciunt. Neque
                      porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                      consectetur, adipisci velit, sed quia non numquam eius
                      modi tempora incidunt ut labore et dolore magnam aliquam
                      quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
                      exercitationem ullam corporis suscipit laboriosam, nisi ut
                      aliquid ex ea commodi consequatur? Quis autem vel eum iure
                      reprehenderit qui in ea voluptate velit esse quam nihil
                      molestiae consequatur, vel illum qui dolorem eum fugiat
                      quo voluptas nulla pariatur?" 1914 translation by H.
                      Rackham "But I must explain to you how all this mistaken
                      idea of denouncing pleasure and praising pain was born and
                      I will give you a complete account of the system, and
                      expound the actual teachings of the great explorer of the
                      truth, the master-builder of human happiness. No one
                      rejects, dislikes, or avoids pleasure itself, because it
                      is pleasure, but because those who do not know how to
                      pursue pleasure rationally encounter consequences that are
                      extremely painful. Nor again is there anyone who loves or
                      pursues or desires to obtain pain of itself, because it is
                      pain, but because occasionally circumstances occur in
                      which toil and pain can procure him some great pleasure.
                      To take a trivial example, which of us ever undertakes
                      laborious physical exercise, except to obtain some
                      advantage from it? But who has any right to find fault
                      with a man who chooses to enjoy a pleasure that has no
                      annoying consequences, or one who avoids a pain that
                      produces no resultant pleasure?" Section 1.10.33 of "de
                      Finibus Bonorum et Malorum", written by Cicero in 45 BC
                      "At vero eos et accusamus et iusto odio dignissimos
                      ducimus qui blanditiis praesentium voluptatum deleniti
                      atque corrupti quos dolores et quas molestias excepturi
                      sint occaecati cupiditate non provident, similique sunt in
                      culpa qui officia deserunt mollitia animi, id est laborum
                      et dolorum fuga. Et harum quidem rerum facilis est et
                      expedita distinctio. Nam libero tempore, cum soluta nobis
                      est eligendi optio cumque nihil impedit quo minus id quod
                      maxime placeat facere possimus, omnis voluptas assumenda
                      est, omnis dolor repellendus. Temporibus autem quibusdam
                      et aut officiis debitis aut rerum necessitatibus saepe
                      eveniet ut et voluptates repudiandae sint et molestiae non
                      recusandae. Itaque earum rerum hic tenetur a sapiente
                      delectus, ut aut reiciendis voluptatibus maiores alias
                      consequatur aut perferendis doloribus asperiores
                      repellat." 1914 translation by H. Rackham "On the other
                      hand, we denounce with righteous indignation and dislike
                      men who are so beguiled and demoralized by the charms of
                      pleasure of the moment, so blinded by desire, that they
                      cannot foresee the pain and trouble that are bound to
                      ensue; and equal blame belongs to those who fail in their
                      duty through weakness of will, which is the same as saying
                      through shrinking from toil and pain. These cases are
                      perfectly simple and easy to distinguish. In a free hour,
                      when our power of choice is untrammelled and when nothing
                      prevents our being able to do what we like best, every
                      pleasure is to be welcomed and every pain avoided. But in
                      certain circumstances and owing to the claims of duty or
                      the obligations of business it will frequently occur that
                      pleasures have to be repudiated and annoyances accepted.
                      The wise man therefore always holds in these matters to
                      this principle of selection: he rejects pleasures to
                      secure other greater pleasures, or else he endures pains
                      to avoid worse pains."`}
                      {nftData[galleryItemIdx].description}
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
                      onClick={() =>
                        window.open(
                          `https://opensea.io/assets/${nftData[galleryItemIdx].token_address}/${nftData[galleryItemIdx].token_id}`,
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
                          href={`https://etherscan.io/token/${nftData[galleryItemIdx].token_address}`}
                        >
                          0x
                          {truncateAddress(
                            nftData[galleryItemIdx].token_address.slice(2),
                            4
                          )}
                        </Link>
                      </Text>
                      <Text>Token ID: {nftData[galleryItemIdx].token_id}</Text>
                      <Text>
                        Token Standard: {nftData[galleryItemIdx].contract_type}
                      </Text>
                      <Text>Blockchain: Ethereum </Text>
                    </Box>
                  </Box>
                </Box>
              </AnimatedBox>
              <AnimatedBox
                style={style}
                position={"fixed"}
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
      {!isTouch && <MouseComponent />}
    </>
  );
};

export default Gallery;
export async function getStaticProps() {
  return {
    props: {
      title: "Gallery",
    },
  };
}
