import useSWR from "swr";

export const useGetProfile = (address: string) => {
  const { data, error, mutate } = useSWR(
    address ? `/api/user/profileData?walletAddress=${address}` : null
  );

  return {
    profile: data?.data,
    mutateProfile: mutate,
    isLoading: !error && !data,
    isError: error,
  };
};
