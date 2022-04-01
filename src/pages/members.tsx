import { isObjectEmpty, vwToPixel } from "@/common/utils";
import { Container } from "@/components/Container";
import { ImageContainer } from "@/components/ImageContainer";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Navbar } from "@/components/Navbar";
import { useCheckOwnsCollectr } from "@/data/useCheckOwnsCollectr";
import { useGetNfts } from "@/data/useGetNfts";
import {
  Box,
  Heading,
  Text,
  Image,
  VStack,
  LightMode,
  useBreakpointValue as getBreakpoints,
} from "@chakra-ui/react";
import { NextPage } from "next";
import { RiArrowRightLine } from "react-icons/ri";
import { useAccount } from "wagmi";
import { OWNS_COLLECTR_API_DATA } from "./api/nfts/ownsCollectr/[address]";
import { NFTS_API_DATA } from "./api/nfts/[address]";
const Members: NextPage = () => {
  const [{ data, loading: loadingAccount }] = useAccount();
  const { collectrNFT } = useCheckOwnsCollectr(data?.address);
  const { nfts } = useGetNfts(data?.address);
  const collectionSize = getBreakpoints({
    xs: 100,
    sm: 125,
    md: vwToPixel(14.3),
    lg: vwToPixel(14.3),
    xl: vwToPixel(14.3),
  });

  if (!collectionSize || !nfts || !collectrNFT) {
    return (
      <>
        <LoadingScreen />
      </>
    );
  }
  const nftData = (nfts as NFTS_API_DATA)?.data?.slice(0, 3);

  const mainPageCollections = [
    {
      title: "Meridian",
      images: nftData.map((nft) => nft.media[0].gateway),
    },
  ];
  const hasAccessNFT = !isObjectEmpty(
    (collectrNFT as OWNS_COLLECTR_API_DATA).data
  );
  return (
    <Box>
      <Navbar staticLogo hideWallet />
      {!hasAccessNFT && (
        <Box
          display="flex"
          alignItems={"center"}
          justifyContent={"center"}
          width="100%"
          height="80vh"
        >
          Please mint a Collectr Pass to gain access
        </Box>
      )}
      {hasAccessNFT && (
        <>
          <Box px={["24px", null, null, "32px"]} mb="30.88px">
            <Box position={"relative"} mt="103px">
              <Box position={"absolute"} right={["24px", null, null, "32px"]}>
                <Text>Gremplin.eth</Text>
              </Box>
              <Box pt="10px">
                <Heading fontSize={["12.5vw", null, null, "13vw"]}>
                  SuperGremplin
                </Heading>
              </Box>
            </Box>
          </Box>
          <Box
            color="black"
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
                    <Box
                      display="flex"
                      alignItems={["unset", null, null, "center"]}
                      justifyContent="space-between"
                      flexDir={["column", null, null, "row"]}
                    >
                      <Box maxWidth="564px">
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
        </>
      )}
    </Box>
  );
};

export default Members;
