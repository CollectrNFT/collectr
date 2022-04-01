import { Navbar } from "@/components/Navbar";
import { Box, Text, Image } from "@chakra-ui/react";
import { GetStaticPaths, NextPage } from "next";
import galleryStore, { ZoomLevels } from "@/stores/galleryStore";
import shallow from "zustand/shallow";
import { useSpring, animated } from "react-spring";
import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useGetNfts } from "@/data/useGetNfts";
import { useAccount } from "wagmi";
import { NFTS_API_DATA } from "../api/nfts/[address]";
import { GalleryViewer } from "@/components/GalleryViewer";
import Loader from "@/components/Loader";
import { ClientOnly } from "@/components/UtilityComponents/ClientOnly";
import { getBreakpoints } from "@/common/utils";
import { Container } from "@/components/Container";
import { RiArrowRightLine } from "react-icons/ri";
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

  const [enter, setEnter] = useState(false);

  const { nfts, isLoading: isLoadingNFTs } = useGetNfts(data?.address);
  let nftData = (nfts as NFTS_API_DATA)?.data;
  nftData = nftData?.length > 20 ? nftData.slice(0, 20) : nftData;
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

  const AccountBP = getBreakpoints({
    base: "24",
    md: "24",
    lg: "32",
    xl: "32",
    "2xl": "32",
  });
  const TitleBP = getBreakpoints({
    base: "48",
    md: "48",
    lg: "80",
    xl: "80",
    "2xl": "80",
  });
  const SubtitleBP = getBreakpoints({
    base: "regular_16",
    md: "regular_16",
    lg: "regular_18",
    xl: "regular_18",
    "2xl": "regular_18",
  });

  const CTA = getBreakpoints({
    base: "32",
    md: "32",
    lg: "32",
    xl: "32",
    "2xl": "32",
  });
  const RightArrowSize = getBreakpoints({
    base: "4em",
    md: "9.375em",
    lg: "9.375em",
    xl: "9.375em",
    "2xl": "9.375em",
  });
  return (
    <AnimatedBox
      overflow="hidden"
      // @ts-ignore
      tabIndex={-1}
      // @ts-ignore
      ref={escRef}
      sx={
        {
          // "& *": {
          //   cursor:
          //     !loadingAccount && data?.address && nftData ? "none" : "default",
          // },
        }
      }
    >
      <AnimatedBox
        position="absolute"
        zIndex="2"
        width="100%"
        style={moveNavOnMaxZoomStyle}
      >
        <Navbar staticLogo bg="transparent" hideWallet />
      </AnimatedBox>
      <ClientOnly>
        {!loadingAccount && data?.address && nftData && !enter && (
          <Box display="flex" h="100vh" flexDir="column">
            <Box
              height={["70vh", null, null, "80vh"]}
              px={["24px", null, null, "72px"]}
              py={["100px", null, null, "230px"]}
              display="flex"
              alignItems="center"
              position="relative"
              overflow="hidden"
            >
              <Box>
                <Text variant={AccountBP}>Braindraind</Text>

                <Text
                  mt={["24px", null, "30px"]}
                  maxW={"746px"}
                  variant={TitleBP}
                >
                  {"Chain Runners & Derivatives"}
                </Text>

                <Text
                  mt={["24px", null, "30px"]}
                  maxW={"746px"}
                  variant={SubtitleBP}
                >
                  {
                    "Chain Runners started in 2021, a collection of 10,000 Mega City renegades 100% stored and generated on chain. Followed by the amazing community interpretations as derivatives. "
                  }
                </Text>
              </Box>
              <Image
                display={["none", null, null, "block"]}
                height="500px"
                position="absolute"
                right="-250"
                src={nftData?.[0].media?.[0].gateway}
                alt="first_nft"
              />
            </Box>
            <Container
              flexGrow={1}
              position={"relative"}
              borderTop={"2px solid black"}
              bg="white"
              sx={{
                transitionDuration: "0.5s",
                borderBottom: "none",
              }}
              _hover={{ color: "#FFFFFF", background: "#000000" }}
              cursor="pointer"
              alignItems={"center"}
              justifyContent="space-between"
              display="flex"
              px={["24px", null, null, "72px"]}
              onClick={() => setEnter(true)}
            >
              <Box maxWidth="636px" mt={["15px", null, null, "0px"]}>
                <Text variant={CTA}>Enter</Text>
              </Box>
              <Box display="flex" alignItems="center" marginRight="-80px">
                <Box mr="25px" mt={["14px", null, "0px"]}>
                  <RiArrowRightLine size={RightArrowSize} />
                </Box>
                <Image
                  display={["block", null, null, "none"]}
                  height="120px"
                  src={nftData?.[0].media?.[0].gateway}
                  alt="first_nft"
                />
              </Box>
            </Container>
          </Box>
        )}
      </ClientOnly>

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
          <Box
            width="fit-content"
            display="flex"
            alignItems="center"
            flexDir="column"
          >
            <Loader size="48px" />
            <Text mt="9px" fontWeight="500" variant="24">
              assembling collection...
            </Text>
          </Box>
        </Box>
      )}
      {!loadingAccount && !data?.address && enter && (
        <Box
          position="fixed"
          top="0"
          right="0"
          left="0"
          bottom="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          Connect Wallet to Continue
        </Box>
      )}
      {!loadingAccount && data?.address && nftData && (
        <Box display={enter ? "flow" : "none"}>
          <GalleryViewer
            nftData={nftData}
            collectionName={"Fixture by Lorem Ipsum"}
          />
        </Box>
      )}
    </AnimatedBox>
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
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};
