import type { NextApiRequest, NextApiResponse } from "next";
import { createAlchemyWeb3, GetNftMetadataResponse } from "@alch/alchemy-web3";
import fetch from "node-fetch";
import { transformNFTSData } from "@/common/api_helpers/utils";
import { base } from "@/middleware/base";

const web3 = createAlchemyWeb3(process.env.ALCHEMY_API_MAINNET);

export type NFTS_API_DATA = {
  success: boolean;
  data: GetNftMetadataResponse[];
};

export type NFTS_API_ERROR = {
  error: string;
};

const HELLO_WORLD_NFTS = [
  // The Little Clearing
  {
    contractAddress: "0xD871eEb105A748D2578ECf9a8E3ebbA83396daB4",
    tokenId: "1",
  },
  // Palm Beach Stroll
  {
    contractAddress: "0x495f947276749Ce646f68AC8c248420045cb7b5e",
    tokenId:
      "105142820758875045122453279743182417762629954244329512910761130635402665787393",
  },
  // Surf Dreamz #80
  {
    contractAddress: "0x5F5d1525472DF82Ad6bcd16537D93d49eE791f92",
    tokenId: "80",
  },
  // Sweet Blossoms
  {
    contractAddress: "0xE882630c4be2B9E14c97B03cc6c54EDb2f8B3e90",
    tokenId: "146",
  },
  // Rising
  {
    contractAddress: "0x495f947276749Ce646f68AC8c248420045cb7b5e",
    tokenId:
      "75175737854990633963038132750829382025497231539213825528077744748256234045441",
  },
  // Mt. Hood
  {
    contractAddress: "0x3B3ee1931Dc30C1957379FAc9aba94D1C48a5405",
    tokenId: "50589",
  },
  // Lake Wonder
  {
    contractAddress: "0xDA096ae45ea16C439CB28509be592a367E55BC7D",
    tokenId: "7",
  },
  // Dancing Korean pines #8
  {
    contractAddress: "0x5FeBc14f1B75842f3123266334E807C0CcDD71c4",
    tokenId: "8",
  },
  {
    contractAddress: "0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270",
    tokenId: "163000070",
  },
];

const getHelloWorldNFTs = async () => {
  try {
    const nftDataPromiseArray = HELLO_WORLD_NFTS.map((nft) => {
      return web3.alchemy.getNftMetadata({
        contractAddress: nft.contractAddress,
        tokenId: nft.tokenId,
      });
    });

    const fetchedNFTData = await Promise.all(nftDataPromiseArray);
    const transformedNFT = transformNFTSData(fetchedNFTData);
    return transformedNFT;
  } catch (e) {
    // TODO add proper error logging
    console.log(e);
  }
};

export default base().get(
  async (req, res: NextApiResponse<NFTS_API_DATA | NFTS_API_ERROR>) => {
    const data = await getHelloWorldNFTs();
    return res.status(200).json({ success: true, data });
  }
);
