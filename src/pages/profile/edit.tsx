import { ConnectTwitter } from "@/components/Buttons/ConnectTwitter";
import { SaveButton } from "@/components/Buttons/Save";
import { Footer } from "@/components/Footer";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Navbar } from "@/components/Navbar";
import { ClientOnly } from "@/components/UtilityComponents/ClientOnly";
import { useCheckOwnsCollectr } from "@/data/useCheckOwnsCollectr";
import { useGetUser } from "@/data/useGetUser";
import * as Yup from "yup";

import {
  Box,
  Text,
  useBreakpointValue as getBreakpoints,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { id } from "ethers/lib/utils";
import { NextPage } from "next";
import Router from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import useSWR from "swr";
import { useAccount } from "wagmi";
import { OWNS_COLLECTR_API_DATA } from "../api/nfts/ownsCollectr/[address]";
import { Input, Textarea, Checkbox } from "@/components/Form";
import { useDragToScroll } from "@/hooks/useDragToScroll";
import userSchema from "@/schema/userProfile";
import { useGetProfile } from "@/data/useGetProfile";
import { API_ERROR_CODES } from "@/common/types";

const EditProfile: NextPage = () => {
  const [{ data, loading: loadingAccount }] = useAccount();
  const { collectrNFT } = useCheckOwnsCollectr(data?.address);
  const {
    user,
    mutateUser,
    isLoading: isLoadingUser,
    isError: isUserFetchError,
  } = useGetUser(data?.address);
  const { profile, mutateProfile } = useGetProfile(data?.address);
  const [selectedPass, setSelectedPass] = useState(null);
  const collectrNFTData = (collectrNFT as OWNS_COLLECTR_API_DATA)?.data;
  const [initialFormValues, setInitialFormValues] = useState({
    username: "",
    bio: "",
    email: "",
    sendEmail: false,
  });
  const toast = useToast();

  useEffect(() => {
    if (profile) {
      setInitialFormValues({
        username: profile.username,
        bio: profile.bio || "",
        email: profile.email || "",
        sendEmail: profile.sendEmail,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (data?.address && user === null) {
      mutateUser(async () => {
        await axios.post("/api/user", {
          walletAddress: data.address,
        });
      });
    }
  }, [data?.address, user]);

  const collectionData = useMemo(
    () =>
      collectrNFTData?.map((i) => {
        return {
          id: i.id.tokenId,
          media: i.media?.[0].raw,
        };
      }),
    [collectrNFTData]
  );
  useEffect(() => {
    if (collectionData && profile) {
      setSelectedPass(collectionData.find((i) => i.id === profile.passTokenId));
    } else if (collectionData) {
      setSelectedPass(collectionData[0]);
    }
  }, [collectionData, profile]);

  const sendUserSettings = async (
    values: {
      username: string;
      bio: string;
      email: string;
      sendEmail: boolean;
    },
    { setSubmitting }
  ) => {
    try {
      await mutateProfile(
        async () =>
          await axios.post("/api/user/profileData", {
            ...values,
            passTokenId: selectedPass.id,
            address: data?.address,
          })
      );
      toast({
        title: "Settings saved!",
        position: "top-right",
        status: "success",
        isClosable: true,
      });
    } catch (e) {
      const { data } = e.response;
      let errorText = "There was an error saving settings";
      if (data?.errorCode === API_ERROR_CODES.USERNAME_ALREADY_TAKEN) {
        errorText = "Username already taken, try a different one.";
      }
      toast({
        title: errorText,
        position: "top-right",
        status: "error",
        isClosable: true,
      });
    }
    setSubmitting(false);
  };

  // Breakpoints
  const LeftArrowSize = getBreakpoints({
    base: "2.5em",
    md: "6em",
    lg: "6em",
    xl: "5em",
    "2xl": "5em",
  });
  const EditProfileBP = getBreakpoints({
    base: "48",
    md: "80",
    lg: "80",
    xl: "80",
    "2xl": "80",
  });

  const SignUpBP = getBreakpoints({
    base: "14",
    md: "14",
    lg: "16",
    xl: "16",
    "2xl": "16",
  });
  const scrollRef = useRef(null);

  const { onMouseDown, isScrolling } = useDragToScroll({
    ref: scrollRef,
  });
  return (
    <Box>
      {!collectionData && <LoadingScreen />}
      {collectionData && (
        <>
          <Navbar staticLogo hideWallet />{" "}
          <ClientOnly>
            <Box px={["24px", null, null, "72px"]} mb={["79px", null, "137px"]}>
              <Box
                display="flex"
                flexDir={["column", null, "row"]}
                alignItems={["unset", null, "center"]}
                mt={["16px", null, "38px"]}
              >
                <RiArrowLeftLine
                  cursor={"pointer"}
                  onClick={() => {
                    Router.push("/profile");
                  }}
                  size={LeftArrowSize}
                />
                <Text
                  mt={["4px", null, "unset"]}
                  ml={["unset", null, "20px"]}
                  variant={EditProfileBP}
                >
                  Edit Profile
                </Text>
              </Box>
              <Box
                mt="76px"
                display="grid"
                gridTemplateColumns={["1fr", null, "2fr 2fr", "3fr 4fr"]}
              >
                <Box>
                  <Box
                    display={["flex", null, "unset"]}
                    justifyContent="space-between"
                  >
                    {selectedPass && (
                      <Box
                        sx={{
                          "& > svg": {
                            width: ["213px", null, "306px"],
                            height: ["213px", null, "306px"],
                          },
                        }}
                        dangerouslySetInnerHTML={{
                          __html: Buffer.from(
                            selectedPass?.media?.split(",")[1],
                            "base64"
                          ).toString(),
                        }}
                      />
                    )}
                    <Text
                      mt="7px"
                      width={["unset", "138px"]}
                      variant="24"
                      sx={{ writingMode: ["vertical-rl", null, "unset"] }}
                    >
                      Collectr Pass #{selectedPass?.id}
                    </Text>
                  </Box>
                  <Text mt="24px" variant="16">
                    Your Passes
                  </Text>
                  <Box
                    position="relative"
                    h={["100px", null, "unset"]}
                    mr={["-24px", null, "unset"]}
                  >
                    <Box
                      position={["absolute", null, "relative"]}
                      display="flex"
                      p="10px"
                      flexWrap={["nowrap", null, "wrap"]}
                      overflowX={["scroll", null, "unset"]}
                      maxW={["100%", null, "306px"]}
                      ref={scrollRef}
                      onMouseDown={onMouseDown}
                      sx={{
                        columnGap: "16px",
                        rowGap: "16px",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        "&::-webkit-scrollbar": {
                          width: 0,
                          height: 0,
                        },
                      }}
                    >
                      {collectionData
                        .sort((a, b) => parseInt(a.id) - parseInt(b.id))
                        .map((i) => (
                          <Box
                            key={i.id}
                            onClick={(e) => {
                              if (!isScrolling) setSelectedPass(i);
                            }}
                            sx={{
                              "& > svg": {
                                width: "59px",
                                height: "59px",
                                ...(selectedPass?.id === i.id && {
                                  outlineOffset: "4px",
                                  outline: "1px solid black",
                                }),
                              },
                            }}
                            dangerouslySetInnerHTML={{
                              __html: Buffer.from(
                                i.media.split(",")[1],
                                "base64"
                              ).toString(),
                            }}
                          />
                        ))}
                    </Box>
                  </Box>
                </Box>
                <Formik
                  initialValues={initialFormValues}
                  validationSchema={userSchema}
                  onSubmit={sendUserSettings}
                >
                  {(props) => (
                    <Form>
                      <Box
                        maxW={["100%", null, "416px"]}
                        mt={["32px", null, "unset"]}
                        flexDir="column"
                        display="flex"
                        sx={{ rowGap: "16px" }}
                      >
                        <Input
                          minH="56px"
                          _hover={{ borderColor: "black" }}
                          borderRadius="0px"
                          borderWidth={"2px"}
                          borderColor="black"
                          label="Username"
                          name="username"
                          type="text"
                          placeholder="Username"
                        />
                        <Textarea
                          _hover={{ borderColor: "black" }}
                          minH="176px"
                          borderRadius="0px"
                          borderWidth="2px"
                          borderColor="black"
                          label="Bio"
                          name="bio"
                          type="text"
                          placeholder="Bio"
                        />
                        <Input
                          _hover={{ borderColor: "black" }}
                          minH="56px"
                          borderRadius="0px"
                          borderWidth={"2px"}
                          borderColor="black"
                          label="Email Address"
                          name="email"
                          type="email"
                          placeholder="Email"
                        />
                        <Box h="56px">
                          <ConnectTwitter />
                        </Box>
                        <Box>
                          <Checkbox
                            size="md"
                            name="sendEmail"
                            colorScheme="blackAlpha"
                            sx={{
                              "& span": {
                                border: "2px solid black",
                              },
                              "[data-checked] div": {
                                bg: "black",
                                border: "none",
                              },
                            }}
                          >
                            <Text pt="4px" variant={SignUpBP}>
                              Sign up for Collectr announcement newsletter
                            </Text>
                          </Checkbox>
                        </Box>
                        <Box h="56px">
                          <SaveButton
                            isLoading={props.isSubmitting}
                            isDisabled={props.isSubmitting}
                            type="submit"
                          />
                        </Box>
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Box>
            </Box>
            <Footer borderTop />
          </ClientOnly>
        </>
      )}
    </Box>
  );
};

export default EditProfile;
