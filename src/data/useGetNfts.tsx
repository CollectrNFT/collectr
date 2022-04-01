import { NFTS_API_DATA, NFTS_API_ERROR } from "@/pages/api/nfts/[address]";
import { GetNftMetadataResponse } from "@alch/alchemy-web3";
import useSWR from "swr";

export const useGetNfts = (address: string) => {
  const { data, error } = useSWR(address ? `/api/nfts/${address}` : null);

  return {
    nfts: data as NFTS_API_ERROR | NFTS_API_DATA,
    isLoading: !error && !data,
    isError: error,
  };
};
