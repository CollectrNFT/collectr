import { ConnectTwitter } from "@/components/Buttons/ConnectTwitter";
import { SaveButton } from "@/components/Buttons/Save";
import { Footer } from "@/components/Footer";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Navbar } from "@/components/Navbar";
import { ClientOnly } from "@/components/UtilityComponents/ClientOnly";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Checkbox,
  Box,
  Text,
  useBreakpointValue as getBreakpoints,
  useToast,
  Stack,
  Skeleton,
} from "@chakra-ui/react";

import { NextPage } from "next";
import Router from "next/router";
import { useState } from "react";
import { RiArrowLeftLine } from "react-icons/ri";
import useSWR from "swr";
import { useAccount } from "wagmi";
import { OWNS_COLLECTR_API_DATA } from "../api/nfts/ownsCollectr/[address]";
import { Input, Textarea } from "@/components/Form";
import { useDragToScroll } from "@/hooks/useDragToScroll";
import userSchema from "@/schema/userProfile";
import { useGetProfile } from "@/data/useGetProfile";
import { API_ERROR_CODES } from "@/common/types";
import { PublishButton } from "@/components/Buttons/Publish";
import { groupBy } from "lodash";
import { useGetNfts } from "@/data/useGetNfts";
import { useGetGroupNFTs } from "@/data/useGetGroupNFTs";
import { parseNFTImage, truncateAddress } from "@/common/utils";
import Toggle from "react-toggle";
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableNFTItem } from "@/components/Collections/SortableNFTItem";
import { Item } from "@/components/Collections/NFTItem";
const CreateCollection: NextPage = () => {
  const [{ data, loading: loadingAccount }] = useAccount();
  const { nfts } = useGetGroupNFTs(data?.address);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({
    username: "",
    bio: "",
    email: "",
    sendEmail: false,
  });

  const toast = useToast();
  console.log(nfts);
  const [activeId, setActiveId] = useState(null);
  const [selectedNFTs, setSelectedNFTs] = useState([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    md: "5em",
    lg: "5em",
    xl: "6em",
    "2xl": "6em",
  });
  const CreateCollectionBp = getBreakpoints({
    base: "48",
    md: "48",
    lg: "48",
    xl: "80",
    "2xl": "80",
  });
  function handleDragStart(event) {
    const { active } = event;

    setActiveId(active.id);
  }

  //   function handleDragEnd(event) {
  //     const { active, over } = event;

  //     if (active.id !== over.id) {
  //       setItems((items) => {
  //         const oldIndex = items.indexOf(active.id);
  //         const newIndex = items.indexOf(over.id);

  //         return arrayMove(items, oldIndex, newIndex);
  //       });
  //     }

  //     setActiveId(null);
  //   }
  return (
    <Box>
      <>
        <Navbar staticLogo hideWallet />{" "}
        <ClientOnly>
          <Box
            px={["24px", null, null, "72px"]}
            pb={["40px", null, "87px"]}
            borderBottom={["unset", null, "2px solid black"]}
          >
            <Box
              flexDir={["column", null, "row"]}
              display="flex"
              justifyContent="space-between"
              alignItems={["unset", null, "center"]}
              mt={["16px", null, "38px"]}
            >
              <Box
                display="flex"
                flexDir={["column", null, "row"]}
                alignItems={["unset", null, "center"]}
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
                  maxW={["327px", null, "unset"]}
                  variant={CreateCollectionBp}
                  borderStyle="solid"
                >
                  Create Collection
                </Text>
              </Box>
              <Box
                display="flex"
                whiteSpace="nowrap"
                alignItems="center"
                columnGap={"40px"}
                mt={["42px", null, "unset"]}
                maxH="min-content"
              >
                <Text
                  onClick={() => Router.push("/collection/create")}
                  textDecoration="underline"
                  variant="regular_16"
                >
                  Save
                </Text>
                <Text
                  textDecoration="underline"
                  variant="regular_16"
                  cursor="pointer"
                  onClick={() => {
                    Router.push("/profile/edit");
                  }}
                >
                  Preview
                </Text>
                <Box width="182px" height="56px">
                  <PublishButton />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            px={["24px", null, null, "72px"]}
            minH={["651px", null, "862px"]}
            display="grid"
            gridTemplateColumns="1fr 2fr"
          >
            <Box pr="72px" py="33px" borderRight="2px solid black">
              <Box
                display="flex"
                justifyContent={"space-between"}
                alignItems="center"
                pb="26px"
                borderBottom="2px solid black"
              >
                <Text variant="32">Wallet</Text>
                <Box display="flex" sx={{ columnGap: "28px" }}>
                  <Text
                    onClick={() => {}}
                    textDecoration="underline"
                    variant="regular_16"
                  >
                    Reset
                  </Text>
                  <Text
                    textDecoration="underline"
                    variant="regular_16"
                    cursor="pointer"
                    onClick={() => {}}
                  >
                    Select All
                  </Text>
                </Box>
              </Box>
              {!nfts && (
                <>
                  <Stack>
                    <Skeleton height="74px" />
                    <Skeleton height="74px" />
                    <Skeleton height="74px" />
                    <Skeleton height="74px" />
                    <Skeleton height="74px" />
                    <Skeleton height="74px" />
                  </Stack>
                </>
              )}
              {nfts && (
                <Accordion
                  allowMultiple
                  h={["651px", null, "862px"]}
                  overflowY="scroll"
                  allowToggle
                  sx={{
                    "::-webkit-scrollbar": {
                      width: ".5em",
                    },
                    "::-webkit-scrollbar-track": { background: "#EAEAEA" },

                    "::-webkit-scrollbar-thumb ": {
                      background: "black",
                    },
                    // "::-webkit-scrollbar-thumb:hover": {
                    //   ,
                    // },
                  }}
                >
                  {Object.keys(nfts).map((i, idx) => {
                    return (
                      <AccordionItem
                        key={idx}
                        border={"none"}
                        borderTopWidth="0"
                        borderBottom="2px solid black"
                        _last={{ borderBottomWidth: "2px" }}
                      >
                        <AccordionButton _hover={{ bg: "white" }} p="21px 0px">
                          <Box
                            display="flex"
                            width="100%"
                            justifyContent="space-between"
                          >
                            <Text variant={"18"}>
                              {"0x" + truncateAddress(i.slice(2), 8)}
                            </Text>
                            <Checkbox
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
                            />
                          </Box>
                          <AccordionIcon
                            mx="10px"
                            width={"24px"}
                            height="24px"
                          />
                        </AccordionButton>
                        <AccordionPanel pt="0" pb="21px" px="0">
                          <Box
                            display="grid"
                            gap="34px"
                            gridTemplateColumns={"1fr 1fr"}
                          >
                            {nfts[i].map((nft, i) => (
                              <Box
                                key={i}
                                display="flex"
                                flexDir="column"
                                justifyContent="space-between"
                              >
                                <Box width="148px">
                                  {parseNFTImage(nft.media?.[0].gateway)}
                                </Box>
                                <Box
                                  mt="10px"
                                  display="flex"
                                  alignItems="center"
                                >
                                  <Checkbox
                                    onChange={(e) => {
                                      console.log(e);
                                    }}
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
                                  />
                                  <Text ml="8px" mt="2.3px" variant="14">
                                    {nft.title}
                                  </Text>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </AccordionPanel>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </Box>
            <Box pl="72px" mt="38px">
              <Formik
                initialValues={initialFormValues}
                validationSchema={userSchema}
                onSubmit={sendUserSettings}
              >
                {(props) => (
                  <Form>
                    <Input
                      minH="80px"
                      bg="#EAEAEA"
                      borderRadius="0px"
                      label="Collection Name"
                      name="collectionName"
                      type="text"
                      sx={{
                        fontSize: "33px",
                        fontWeight: "500",
                        lineHeight: "32px",
                        letterSpacing: "-0.5px",
                      }}
                      px="36px"
                      placeholder="Collection Name"
                    />
                    <Textarea
                      mt="16px"
                      _hover={{ borderColor: "black" }}
                      minH="176px"
                      bg="#EAEAEA"
                      borderRadius="0px"
                      label="Collection Description"
                      name="collectionDesc"
                      placeholder="Collection Description (optional)"
                      pt="24px"
                      px="36px"
                      sx={{
                        fontSize: "18px",
                        lineHeight: "28px",
                        letterSpacing: "0",
                      }}
                    />
                  </Form>
                )}
              </Formik>
              <Box
                display="flex"
                mt="25px"
                width="100%"
                justifyContent="space-between"
                pb="22px"
                borderBottom="2px solid black"
              >
                <Box>
                  <Text variant="18">
                    Theme:
                    <Box color="#999999" as="span">
                      Gallery
                    </Box>
                  </Text>
                </Box>
                <Box>
                  <Box
                    as="span"
                    display="flex"
                    alignItems="center"
                    sx={{
                      columnGap: "12px",

                      fontSize: "16px",
                      fontWeight: "500",
                      lineHeight: "24px",
                      letterSpacing: "0",
                    }}
                  >
                    <Box as="span">Light</Box>
                    <Toggle
                      defaultChecked={isDarkMode}
                      icons={false}
                      onChange={() => setIsDarkMode(!isDarkMode)}
                    />
                    <Box color="#999999" as="span">
                      Dark
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box></Box>
              <Box
                display="flex"
                mt="109px"
                justifyContent="center"
                width="100%"
              >
                {/* <Text
                  variant="48"
                  maxW="334px"
                  textAlign="center"
                  color="#EAEAEA"
                >
                  Select NFTs from your wallet.
                </Text> */}
                <Box>
                  {/* <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={selectedNFTs}
                      strategy={verticalListSortingStrategy}
                    >
                      {selectedNFTs.map((id) => (
                        <SortableNFTItem key={id} id={id} />
                      ))}
                    </SortableContext>
                    <DragOverlay>
                      {activeId ? <Item id={activeId} /> : null}
                    </DragOverlay>
                  </DndContext> */}
                </Box>
              </Box>
            </Box>
          </Box>
          <Footer borderTop />
        </ClientOnly>
      </>
    </Box>
  );
};

export default CreateCollection;
