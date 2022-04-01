import useSWR from "swr";

export const useGetUser = (address: string) => {
  const { data, error, mutate } = useSWR(
    address ? `/api/user?walletAddress=${address}` : null
  );

  return {
    user: data?.data,
    mutateUser: mutate,
    isLoading: !error && !data,
    isError: error,
  };
};
