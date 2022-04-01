import type { NextApiResponse } from "next";
import { createAlchemyWeb3, GetNftMetadataResponse } from "@alch/alchemy-web3";
import { transformNFTSData } from "@/common/api_helpers/utils";
import { base } from "@/middleware/base";
import { groupBy } from "lodash";

const web3 = createAlchemyWeb3(process.env.ALCHEMY_API_MAINNET);

export type NFTS_API_DATA = {
  success: boolean;
  data: { [contractAddress: string]: GetNftMetadataResponse[] };
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
    return groupBy(transformedNFT, (i) => i.contract.address);
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
      const data = await getAndFormatNFTS(
        "0x2EA8846a26B6af5F63CAAe912BB3c4064B94D54B"
      );
      return res.status(200).json({ success: true, data });
    } else {
      return res.status(400).json({ error: "address is incorrect" });
    }
  }
);
