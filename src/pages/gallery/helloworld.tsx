import { Navbar } from "@/components/Navbar";
import { Box, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import galleryStore, { ZoomLevels } from "@/stores/galleryStore";
import shallow from "zustand/shallow";
import { useSpring, animated } from "react-spring";
import { useHotkeys } from "react-hotkeys-hook";
import { NFTS_API_DATA } from "../api/nfts/[address]";
import { GalleryViewer } from "@/components/GalleryViewer";
import { useGetHelloWorldNFTs } from "@/data/useGetHelloWorldNFTs";
import Loader from "@/components/Loader";
const Gallery: NextPage = () => {
  const { currentZoom, setViewingAbout, viewingAbout } = galleryStore(
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

  const { nfts } = useGetHelloWorldNFTs();
  const nftData = (nfts as NFTS_API_DATA)?.data;
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
      overflow="hidden"
      // @ts-ignore
      tabIndex={-1}
      // @ts-ignore
      ref={escRef}
      sx={{
        "& *": {
          cursor: nftData ? "none" : "default",
        },
      }}
    >
      <AnimatedBox
        position="absolute"
        zIndex="2"
        width="100%"
        style={moveNavOnMaxZoomStyle}
      >
        <Navbar bg="transparent" hideWallet />
      </AnimatedBox>

      {!nftData && (
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
              assembiling collection...
            </Text>
          </Box>
        </Box>
      )}
      {nftData && (
        <GalleryViewer
          nftData={nftData}
          collectionName={"Hello World by Collectr"}
        />
      )}
    </AnimatedBox>
  );
};

export default Gallery;
export async function getStaticProps() {
  return {
    props: {
      title: "Gallery - Hello World",
    },
  };
}
