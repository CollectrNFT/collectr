import { GetNftMetadataResponse } from "@alch/alchemy-web3";
import { BigNumber } from "ethers";
// helper fn to parse NFTS which are on-chain and retrieve metadata -- (alchemy currently doesn't do this)
export const transformNFTSData = (nfts: GetNftMetadataResponse[]) => {
  return nfts
    .map((nft) => {
      if (
        !nft ||
        (nft?.tokenUri?.gateway === "" && nft?.tokenUri?.raw === "") ||
        (nft.metadata as any).external_url === "https://jpgpeople.club" ||
        nft.tokenUri.raw.includes("https://sherlock2050.com/")
      ) {
        return undefined;
      }
      //decoding base64
      else if (nft.tokenUri.raw.slice(0, 4) === "data") {
        const json = Buffer.from(
          nft.tokenUri.raw.slice(29),
          "base64"
        ).toString();
        let result = null;
        try {
          result = JSON.parse(json);
        } catch (e) {
          console.log("error parsing JSON Metadata");
        }
        if (result !== null) {
          nft.title = result.name;
          nft.description = result.description;
          //check if image uri is base64 encoded, if so get the base64 encoded part and remove the rest
          nft.media[0].gateway = result.image;
          nft.metadata = result;
        } else {
          return undefined;
        }
      } else if (nft.tokenUri?.gateway.includes("api.opensea.io")) {
        nft.media[0].raw = nft.media[0].raw + "=s0";
        nft.media[0].gateway = nft.media[0].gateway + "=s0";
      }
      //setting a cors proxy url
      else if (
        nft.media[0].gateway.slice(0, 15) !== "https://ipfs.io" &&
        nft.media[0].gateway.slice(0, 5) === "https"
      ) {
        nft.media[0].raw = "/api/cors?url=" + nft.media[0].raw;
        nft.media[0].gateway = "/api/cors?url=" + nft.media[0].gateway;
      } else if (nft?.media[0].gateway.slice(0, 15) === "https://ipfs.io") {
      } else {
        return undefined;
      }

      nft.id.tokenId = BigNumber.from(nft.id.tokenId).toString();
      return nft;
    })
    .filter((i) => i != null);
};
