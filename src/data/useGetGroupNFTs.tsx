import { NFTS_API_DATA, NFTS_API_ERROR } from "@/pages/api/nfts/[address]";
import { GetNftMetadataResponse } from "@alch/alchemy-web3";
import useSWR from "swr";

export const useGetGroupNFTs = (address: string) => {
  const { data, error } = useSWR(
    address ? `/api/nfts/groupByContract/${address}` : null
  );

  return {
    nfts: data?.data,
    isLoading: !error && !data,
    isError: error,
  };
};
