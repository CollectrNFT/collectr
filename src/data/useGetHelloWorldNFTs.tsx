import { NFTS_API_DATA, NFTS_API_ERROR } from "@/pages/api/nfts/[address]";
import useSWR from "swr";

export const useGetHelloWorldNFTs = () => {
  const { data, error } = useSWR(`/api/nfts/hello_world`);

  return {
    nfts: data as NFTS_API_ERROR | NFTS_API_DATA,
    isLoading: !error && !data,
    isError: error,
  };
};
