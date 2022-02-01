import * as THREE from "three";
import { NFTData } from "./types";

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

export const transformNFTData = (data: NFTData) => {
  const { token_uri, token_id, contract_type, metadata, name } = data;
  return {
    token_uri,
    token_id,
    name,
    contract_type,
    metadata,
  };
};
