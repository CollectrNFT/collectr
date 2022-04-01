import { isObjectEmpty } from "@/common/utils";
import { useCheckOwnsCollectr } from "@/data/useCheckOwnsCollectr";
import { useGetProfile } from "@/data/useGetProfile";
import { OWNS_COLLECTR_API_DATA } from "@/pages/api/nfts/ownsCollectr/[address]";
import {
  Box,
  Button,
  useBreakpointValue as getBreakpoints,
  useDisclosure,
  Link,
} from "@chakra-ui/react";
import useSize from "@react-hook/size";
import useWindowScroll from "@react-hook/window-scroll";
import React, { useEffect, useRef, useState } from "react";
import { animated, config, useSpring } from "react-spring";
import { useAccount, useConnect } from "wagmi";
import { ConnectedButton } from "../Buttons/Connected";
import { ConnectWalletButton } from "../Buttons/ConnectWallet";
import { Drawer } from "../Drawer";
import { Logo, MenuItem } from "../SVG";

interface Props {}

export const Navbar = ({
  staticLogo = false,
  bg = "white",
  hideWallet = false,
}) => {
  const [{ data, loading: loadingAccount }] = useAccount();
  const { profile } = useGetProfile(data?.address);
  const { collectrNFT } = useCheckOwnsCollectr(data?.address);
  const [collectrPass, setCollectrPass] = useState({} as any);

  useEffect(() => {
    if (profile && collectrNFT) {
      setCollectrPass(
        (collectrNFT as OWNS_COLLECTR_API_DATA)?.data?.find(
          (i) => i.id.tokenId === profile.passTokenId
        )
      );
    } else if (collectrNFT) {
      setCollectrPass(
        (collectrNFT as OWNS_COLLECTR_API_DATA)?.data?.sort(
          (a, b) => parseInt(a.id.tokenId) - parseInt(b.id.tokenId)
        )[0]
      );
    }
  }, [profile, collectrNFT]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef(null);
  const menuBtnHandler = (handler: () => void) => {
    handler();
  };
  const logo = getBreakpoints({
    sm: { width: 64, height: 64 },
    md: { width: 100, height: 100 },
    lg: { width: 140, height: 140 },
  });

  const scrollY = useWindowScroll(60);
  const target = React.useRef(null);

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
    <Box
      background={bg}
      position="sticky"
      zIndex={2}
      sx={{ top: "0px", left: "0px", right: "0px" }}
    >
      <AnimatedBox
        ref={target}
        display="flex"
        justifyContent="space-between"
        background={bg}
        style={style}
        sx={{
          position: "relative",
          px: ["24px", null, null, "32px"],
          zIndex: 2,
        }}
      >
        <Link cursor="pointer" href="/">
          {collectrPass && !isObjectEmpty(collectrPass) ? (
            <Box
              sx={{ "& > svg": { width: "32px", height: "32px" } }}
              dangerouslySetInnerHTML={{
                __html: Buffer.from(
                  collectrPass?.media[0].gateway.split(",")[1] ?? "",
                  "base64"
                ).toString(),
              }}
            />
          ) : (
            <Logo width={32} height={32} />
          )}
        </Link>
        <Box display="flex">
          {!hideWallet && (
            <Box
              display={["none", null, "inherit"]}
              maxW={"180px"}
              height="40px"
            >
              {connected ? (
                <ConnectedButton placement="bottom-end" />
              ) : (
                <ConnectWalletButton />
              )}
            </Box>
          )}
          <Box
            cursor="pointer"
            mt="11px"
            ml="35px"
            zIndex={4}
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
