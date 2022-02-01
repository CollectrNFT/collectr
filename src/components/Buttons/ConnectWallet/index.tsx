import {
  Box,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Image,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { useConnect } from "wagmi";

interface Props {}

export const ConnectWalletButton = () => {
  const [
    {
      data: { connector, connectors },
      loading,
    },
    connect,
  ] = useConnect();

  return (
    <Menu placement="bottom-end" gutter={0} matchWidth>
      <MenuButton
        as={Button}
        bg="#000000"
        width="100%"
        height="100%"
        color="#FFFFFF"
        borderRadius="none"
        fontWeight="bold"
        _active={{ bg: "#000000" }}
        _focus={{ bg: "#000000" }}
        _hover={{ bg: "#000000" }}
        _expanded={{ bg: "#000000" }}
      >
        Connect Wallet
      </MenuButton>
      <MenuList
        color="black"
        bg={"gray.200"}
        fontSize="2xl"
        borderRadius="none"
      >
        {connectors.map((x) => {
          if (!x.ready) {
            return;
          } else {
            const WalletImage = () => {
              switch (x.name) {
                case "MetaMask":
                  return (
                    <Image
                      width="25px"
                      alt="wallet-connect-image"
                      mr="10px"
                      src="./images/metamask.svg"
                    />
                  );
                case "WalletConnect":
                  return (
                    <Image
                      width="25px"
                      alt="metamask-image"
                      mr="10px"
                      src="./images/walletconnect.svg"
                    />
                  );
                default:
                  return <></>;
              }
            };
            return (
              <MenuItem
                disabled={!x.ready}
                key={x.name}
                onClick={() => connect(x)}
              >
                <WalletImage />
                {x.name}
              </MenuItem>
            );
          }
        })}
      </MenuList>
    </Menu>
  );
};
