import { Button, Spinner } from "@chakra-ui/react";
import React, { useState } from "react";
import { useConnect, useContractWrite, useWaitForTransaction } from "wagmi";
import collectNFTABI from "@/ABI/collectNFTABI.json";
type Props = {};
import { erc20ABI } from "wagmi";
import { TransactionReceipt } from "@ethersproject/providers";

export const MintButton = (props: Props) => {
  const [
    {
      data: { connected },
      loading,
    },
  ] = useConnect();

  const [contractWriteData, write] = useContractWrite(
    {
      addressOrName: process.env.NEXT_PUBLIC_COLLECTR_CONTRACT_ADDRESS,
      contractInterface: collectNFTABI.abi,
    },
    "mintCollectr"
  );
  const [{ data, error, loading: waitingForTx }, wait] = useWaitForTransaction({
    wait: contractWriteData.data?.wait,
  });
  const mintCollectr = async () => {
    await write();
  };

  if (loading) return null;

  return (
    <Inner
      connected={connected}
      mintCollectr={mintCollectr}
      waitingForTx={waitingForTx}
      data={data}
      error={error}
    />
  );
};

export const Inner = ({
  connected,
  mintCollectr,
  waitingForTx,
  data,
  error,
}: {
  connected: boolean;
  mintCollectr: () => Promise<void>;
  waitingForTx: boolean;
  data: TransactionReceipt;
  error: Error;
}) => {
  return (
    <Button
      bg="#000000"
      width="100%"
      height="100%"
      color="#FFFFFF"
      borderRadius="none"
      fontWeight="bold"
      justifyContent={"center"}
      _active={{ bg: "#000000" }}
      _focus={{ bg: "#000000" }}
      _hover={{ bg: "#000000" }}
      _expanded={{ bg: "#000000" }}
      onClick={connected ? () => mintCollectr() : () => {}}
    >
      {waitingForTx && <Spinner />}
      {!waitingForTx && !data && !error && (
        <> {connected ? "Mint a Membership Pass" : "Please Login to Mint"}</>
      )}
      {!waitingForTx && data && "Minted!"}
      {!waitingForTx && !data && error && "Minting Error: Try Again"}
    </Button>
  );
};
