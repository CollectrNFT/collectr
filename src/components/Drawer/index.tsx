import React, { FC, useEffect } from "react";
import {
  Box,
  Button,
  Drawer as ChakraDrawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ColoredLogo, ExternalLink, MenuItem } from "../SVG";
import { ConnectWalletButton } from "../Buttons/ConnectWallet";
import { useConnect } from "wagmi";
import { ConnectedButton } from "../Buttons/Connected";
import Router from "next/router";
import mousePositionStore from "@/stores/mousePositionStore";

interface IDrawer {
  isOpen: boolean;
  onClose: any;
  btnRef: any;
}

const navItems = [
  { title: "Home", link: "/" },
  { title: "About", link: "/" },
  { title: "Collections", link: "/" },
  { title: "Membership", link: "/" },
  { title: "FAQs", link: "/" },
  { title: "Opensea", link: "/", icon: <ExternalLink /> },
  { title: "Discord", link: "/", icon: <ExternalLink /> },
  { title: "Twitter", link: "/", icon: <ExternalLink /> },
];

export const Drawer: FC<IDrawer> = ({ isOpen, onClose, btnRef }) => {
  const [
    {
      data: { connected },
    },
  ] = useConnect();

  const { setIsDrawerOpen } = mousePositionStore((state) => ({
    setIsDrawerOpen: state.setIsDrawerOpen,
  }));
  useEffect(() => {
    setIsDrawerOpen(isOpen);
  }, [isOpen, setIsDrawerOpen]);
  return (
    <ChakraDrawer isOpen={isOpen} onClose={onClose} finalFocusRef={btnRef}>
      <DrawerOverlay />
      <DrawerContent
        minW={["100%", null, "488px"]}
        pt="33px"
        pl={["24px", null, null, "64px"]}
        overflowY="scroll"
        sx={{
          overflow: "scroll",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            width: 0,
            height: 0,
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box
            display="flex"
            justifyContent={["space-between"]}
            width="100%"
            height="100%"
          >
            <Box display={["inherit", null, "none"]}>
              <ColoredLogo width={40} height={40} />
            </Box>
            <Box maxW={"180px"} height="40px">
              {connected ? <ConnectedButton /> : <ConnectWalletButton />}
            </Box>
            <Box
              pr="30px"
              pt="10px"
              alignItems="center"
              display={"flex"}
              height="100%"
              cursor="pointer"
              onClick={onClose}
            >
              <MenuItem isMenuSelected={isOpen} />
            </Box>
          </Box>
        </Box>

        <Box mb="50px">
          {navItems.map((navItem) => {
            return (
              <Box
                key={navItem.title}
                width="100%"
                pb="15px"
                pt="15px"
                borderBottom="2px solid black"
                alignSelf="flex-start"
                onClick={() => Router.push(navItem.link)}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ transitionDuration: "0.2s" }}
                  _hover={{ transform: "translateX(25px)" }}
                >
                  <Text fontSize="2rem" fontWeight="500" cursor="pointer">
                    {navItem.title}
                  </Text>
                  <Box pr="30px">{navItem.icon}</Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </DrawerContent>
    </ChakraDrawer>
  );
};
