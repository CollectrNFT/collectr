import useSWR from "swr";

export const useGetNfts = (address: string) => {
  const { data, error } = useSWR(address ? `/api/nfts/${address}` : null);

  return {
    nfts: data,
    isLoading: !error && !data,
    isError: error,
  };
};
