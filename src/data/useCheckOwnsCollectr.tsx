import {
  OWNS_COLLECTR_API_DATA,
  OWNS_COLLECTR_ERROR,
} from "@/pages/api/nfts/ownsCollectr/[address]";
import { NFTS_API_DATA, NFTS_API_ERROR } from "@/pages/api/nfts/[address]";
import { GetNftMetadataResponse } from "@alch/alchemy-web3";
import useSWR from "swr";

export const useCheckOwnsCollectr = (address: string) => {
  const { data, error } = useSWR(
    address ? `/api/nfts/ownsCollectr/${address}` : null
  );

  return {
    collectrNFT: data as OWNS_COLLECTR_ERROR | OWNS_COLLECTR_API_DATA,
    isLoading: !error && !data,
    isError: error,
  };
};
