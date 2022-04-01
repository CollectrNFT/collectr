import * as THREE from "three";
import { NFTData } from "./types";
import { Box, Image, useBreakpointValue } from "@chakra-ui/react";

export function truncateAddress(address = "", width = 10): string {
  if (!address) {
    return "";
  }
  return `${address.slice(0, width)}...${address.slice(-width)}`;
}

export const vwToPixel = (v: number) => {
  let w = 0;
  if (process.browser) {
    w = Math.max(document?.documentElement.clientWidth, window.innerWidth || 0);
  }

  return (v * w) / 100;
};

export const damp = THREE.MathUtils.damp;

export const calculateProgress = (
  base: number,
  itemProgressValue: number,
  itemLength: number,
  distanceValue: number
) => {
  if (itemProgressValue <= 0) {
    return base;
  } else if (itemProgressValue + distanceValue >= distanceValue * itemLength) {
    return 1;
  } else {
    return base + itemProgressValue / (distanceValue * itemLength);
  }
};
export const isObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

export const parseNFTImage = (data: string) => {
  if (data.includes("https") || data.slice(0, 1) === ".") {
    return <Image src={data} alt="nft-image" />;
  } else {
    return (
      <Box
        sx={{ "& > svg": { width: "32px", height: "32px" } }}
        dangerouslySetInnerHTML={{
          __html: Buffer.from(data?.split(",")[1], "base64").toString(),
        }}
      />
    );
  }
};

export const getBreakpoints = useBreakpointValue;
