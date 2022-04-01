import React from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
  useBreakpointValue as getBreakpoints,
} from "@chakra-ui/react";
type Props = {};

const FAQItems = [
  {
    question: "How do I gain access to use Collectr?",
    answer:
      "First you’ll need a wallet We recommend MetaMask or Rainbow. Then Collectr NFT, which works as a pass. Once you have a Collectr NFT in your wallet, you’ll be able to sign in, set a username and create your collection gallery.",
  },
  {
    question: "What happens if I sell my Collectr NFT?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    question: "How do I purchase a Collectr NFT?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    question: "What’s the mint price of Collectr NFT?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    question: "What’s the supply of Collectr NFT?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    question: "What is Collectr?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    question: "Who’s behind Collectr?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    question: "How many collections can I create?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    question: "How many NFTs can be displayed in a collection?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    question: "Do I need to own an NFT to be able to add it to a collection?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    question: "What happens to NFTs in my collection if it’s sold?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    question: "Can I display NFTs that I created but is owned by someone else?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
];

export const FAQAccordian = () => {
  return (
    <Accordion allowToggle>
      {FAQItems.map(({ question, answer }, idx) => {
        return (
          <AccordionItem
            border={"none"}
            borderTopWidth="0"
            key={idx}
            borderBottom="2px solid black"
            _last={{ borderBottomWidth: "2px" }}
          >
            <AccordionButton _hover={{ bg: "white" }} p="21px 0px">
              <Box flex="1" textAlign="left">
                <Text
                  variant={getBreakpoints({
                    base: "18",
                    md: "24",
                    lg: "24",
                    xl: "24",
                    "2xl": "24",
                  })}
                >
                  {question}
                </Text>
              </Box>
              <AccordionIcon width={"24px"} height="24px" />
            </AccordionButton>
            <AccordionPanel pt="0" pb="21px" px="0">
              <Text
                variant={getBreakpoints({
                  base: "regular_14",
                  md: "regular_18",
                  lg: "regular_18",
                  xl: "regular_18",
                  "2xl": "regular_18",
                })}
              >
                {answer}
              </Text>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
