import { truncateAddress } from "@/common/utils";
import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { EthereumLogo } from "@/components/SVG";
import { CheckIfConnected } from "@/components/UtilityComponents/CheckIfConnected";
import { ClientOnly } from "@/components/UtilityComponents/ClientOnly";
import { useGetProfile } from "@/data/useGetProfile";
import ScaleText from "react-scale-text";

import {
  Box,
  Heading,
  Text,
  useBreakpointValue as getBreakpoints,
} from "@chakra-ui/react";
import { NextPage } from "next";
import Router from "next/router";
import { RiArrowRightLine } from "react-icons/ri";
import { useAccount } from "wagmi";

const Profile: NextPage = () => {
  const [{ data, loading: loadingAccount }, disconnect] = useAccount();
  const { profile } = useGetProfile(data?.address);
  const RightArrowSize = getBreakpoints({
    base: "4em",
    md: "9.375em",
    lg: "9.375em",
    xl: "9.375em",
    "2xl": "9.375em",
  });
  return (
    <Box>
      <Navbar staticLogo hideWallet />{" "}
      <CheckIfConnected>
        <ClientOnly>
          <Box px={["24px", null, "32px"]}>
            <Box display="flex">
              <Box
                fontWeight="500"
                width="100%"
                whiteSpace={"nowrap"}
                mr="10px"
              >
                {profile && (
                  <ScaleText>{profile?.username || "Username"}</ScaleText>
                )}
              </Box>
            </Box>
            {profile?.bio && (
              <Box mt="30px" display="flex" maxW="786px" alignItems="center">
                <Text ml="8px" variant="regular_18" color="#666666">
                  {profile.bio}
                </Text>
              </Box>
            )}
            <Box mt="30px" display="flex" alignItems="center">
              <EthereumLogo />
              <Text ml="8px" variant="regular_16">
                {"0x" + truncateAddress(data?.address.slice(2), 4)}
              </Text>
            </Box>
            <Box
              mt="30px"
              display="flex"
              whiteSpace="nowrap"
              columnGap={["32px", null, "56px"]}
              overflowX="scroll"
              maxH="min-content"
              sx={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
                "& > p": {
                  cursor: "pointer",
                },
              }}
              mb={["52px", null, "78px"]}
            >
              <Text
                onClick={() => Router.push("/collection/create")}
                textDecoration="underline"
                variant="regular_16"
              >
                Create New Collection
              </Text>
              <Text
                textDecoration="underline"
                variant="regular_16"
                cursor="pointer"
                onClick={() => {
                  Router.push("/profile/edit");
                }}
              >
                Edit Profile
              </Text>
              <Text textDecoration="underline" variant="regular_16">
                Download Asset Pack
              </Text>
            </Box>
          </Box>
          <Box
            color="black"
            position={"relative"}
            bg="white"
            borderTop={"2px solid black"}
          >
            <Container
              bg="white"
              _hover={{ color: "#FFFFFF", background: "#000000" }}
              sx={{ transitionDuration: "0.5s", py: ["72px", null, "150px"] }}
              cursor="pointer"
              onClick={() => Router.push("/collection/create")}
            >
              <Box>
                <Box
                  display="flex"
                  alignItems={["unset", null, null, "center"]}
                  justifyContent="space-between"
                  flexDir={["column", null, "row"]}
                >
                  <Box maxWidth="636px">
                    <Text
                      variant={getBreakpoints({
                        base: "48",
                        md: "48",
                        lg: "80",
                        xl: "80",
                        "2xl": "80",
                      })}
                    >
                      Create your first Collection Gallery
                    </Text>
                  </Box>
                  <Box mt={["14px", null, "0px"]}>
                    <RiArrowRightLine size={RightArrowSize} />
                  </Box>
                </Box>
              </Box>
            </Container>
          </Box>
          <Footer />
        </ClientOnly>
      </CheckIfConnected>
    </Box>
  );
};

export default Profile;
