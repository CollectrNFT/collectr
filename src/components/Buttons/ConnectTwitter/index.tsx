import { Button, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { FaTwitter } from "react-icons/fa";
type Props = {};

export const ConnectTwitter: FC = () => {
  return (
    <Button
      width="100%"
      height="100%"
      borderRadius="none"
      colorScheme={"black"}
      _hover={{ bg: "black", color: "white" }}
      fontWeight="bold"
      variant="outline"
      rel="noopener noreferrer"
      border="2px solid black"
      onClick={() =>
        window.open(
          "https://twitter.com/intent/tweet?text=@collectr_nft",
          "_blank"
        )
      }
    >
      <FaTwitter size="24px" />
      <Text ml="16px" variant="16">
        Connect Your Twitter
      </Text>
    </Button>
  );
};
