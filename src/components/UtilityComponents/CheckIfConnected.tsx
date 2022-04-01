import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useConnect } from "wagmi";
import { LoadingScreen } from "../LoadingScreen";

export const CheckIfConnected = ({ children, ...delegated }) => {
  const [
    {
      data: { connected },
      loading,
    },
  ] = useConnect();

  if (loading) {
    return <LoadingScreen />;
  }
  if (!connected) {
    return (
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
    );
  }

  return <div>{children}</div>;
};
