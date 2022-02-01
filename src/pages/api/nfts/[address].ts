import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

type Data = {
  success: boolean;
  data: any;
};

type Error = {
  error: string;
};
const MORALIS_BASE_URL = "https://deep-index.moralis.io/api/v2/";

const getNFTs = async (address: string) => {
  const response = await fetch(
    `https://deep-index.moralis.io/api/v2/0x084B728f2BD0B84e58d2B22c05809A4cDb8EC1b9/nft?chain=eth&format=decimal`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-API-KEY":
          "CnXibdTyi9uuzW5KHoGl9703J0a0somF7l7stRMs9SFhyBlUfrZ9D2ZYVeWMhaWB",
      },
    }
  );
  const data = ((await response.json()) as any)?.result;
  const cleanedData = data
    .filter((i) => i.token_uri)
    .map((i) => {
      if (i.token_uri[0] === "Q") {
        i.token_uri = "https://ipfs.io/ipfs/" + i.token_uri;
      }
      return i;
    });
  let tokenResult = await Promise.all(
    (
      await Promise.all(
        cleanedData.map((i) => fetch(i.token_uri, { method: "GET" }))
      )
    )
      .filter((i) => i.status === 200)
      .map((i) => i.json())
  );
  tokenResult = tokenResult.map((i) => {
    if (i.image.slice(0, 4) === "ipfs") {
      i.image = "https://ipfs.io/ipfs/" + i.image.slice(7);
    }
    return i;
  });

  const mergedAttributeArray = tokenResult.map((i, idx) => {
    return { ...cleanedData[idx], ...i };
  });
  return mergedAttributeArray;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  const {
    method,
    query: { address },
  } = req;

  switch (method) {
    case "GET":
      const data = await getNFTs(address as string);
      return res.status(200).json({ success: true, data });

    default:
      res.status(400).json({ error: "This is a bad request" });
  }
}
