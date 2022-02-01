import {
  Box,
  Button,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import useSize from "@react-hook/size";
import useWindowScroll from "@react-hook/window-scroll";
import React, { useEffect, useRef, useState } from "react";
import { animated, config, useSpring } from "react-spring";
import { useConnect } from "wagmi";
import { ConnectedButton } from "../Buttons/Connected";
import { ConnectWalletButton } from "../Buttons/ConnectWallet";
import { Drawer } from "../Drawer";
import { Logo, MenuItem } from "../SVG";

interface Props {}

export const Navbar = ({ staticLogo = false, bg = "white" }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const menuBtnHandler = (handler: () => void) => {
    handler();
  };
  const logo = useBreakpointValue({
    sm: { width: 64, height: 64 },
    md: { width: 100, height: 100 },
    lg: { width: 140, height: 140 },
  });

  const scrollY = useWindowScroll(60);
  const target = React.useRef(null);
  const [_, height] = useSize(target);

  const calcLogo = ({ width = 60, height = 60 }) => {
    const decTotal = width - 32;
    const decConstant = decTotal / 32;

    const decAmt = decConstant * scrollY;
    width = height =
      width - 32 >= decAmt
        ? Math.round(width - decAmt)
        : Math.round(width - decTotal);

    return { width, height };
  };
  const shouldStick = scrollY > 10;
  const [
    {
      data: { connected },
    },
  ] = useConnect();

  const style = useSpring({
    paddingTop: shouldStick ? 32 : 32,
    paddingBottom: shouldStick ? 12 : 12,
    config: config.default,
  });

  const AnimatedBox = animated(Box);
  return (
    <Box position="relative">
      <Box display={shouldStick ? "inherit" : "none"} height={`${height}px`} />
      <AnimatedBox
        ref={target}
        display="flex"
        justifyContent="space-between"
        background={bg}
        style={style}
        sx={{
          position: "relative",
          px: "32px",
          zIndex: 2,
          ...(shouldStick && {
            position: "fixed",
            top: "0px",
            left: "0px",
            right: "0px",
          }),
        }}
      >
        {staticLogo ? (
          <Logo width={32} height={32} />
        ) : (
          logo && <Logo {...calcLogo(logo)} />
        )}{" "}
        <Box display="flex">
          <Box display={["none", null, "inherit"]} maxW={"180px"} height="40px">
            {connected ? (
              <ConnectedButton placement="bottom-end" />
            ) : (
              <ConnectWalletButton />
            )}
          </Box>
          <Box
            cursor="pointer"
            mt="11px"
            ml="35px"
            onClick={() => menuBtnHandler(isOpen ? onClose : onOpen)}
            ref={btnRef}
          >
            <MenuItem isMenuSelected={isOpen} />
          </Box>
        </Box>
        <Drawer isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
      </AnimatedBox>
    </Box>
  );
};
