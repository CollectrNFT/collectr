import type { NextApiResponse } from "next";
import { createAlchemyWeb3, GetNftMetadataResponse } from "@alch/alchemy-web3";
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

const getAndFormatNFTS = async (address: string) => {
  try {
    const nfts = await web3.alchemy.getNfts({
      owner: address,
    });

    const nftDataPromiseArray = nfts.ownedNfts.map((nft) => {
      return web3.alchemy.getNftMetadata({
        contractAddress: nft.contract.address,
        tokenId: nft.id.tokenId,
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
    const {
      query: { address },
    } = req;
    if (typeof address === "string") {
      const data = await getAndFormatNFTS(address);
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(400).json({ error: "address is incorrect" });
    }
  }
);
