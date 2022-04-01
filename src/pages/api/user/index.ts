import type { NextApiRequest, NextApiResponse } from "next";
import { createAlchemyWeb3, GetNftMetadataResponse } from "@alch/alchemy-web3";
import fetch from "node-fetch";
import { transformNFTSData } from "@/common/api_helpers/utils";
import prisma from "@/services";
import { User } from "@prisma/client";
import { base } from "@/middleware/base";

export type USER_DATA = {
  success: boolean;
  data: User;
};

export type ERROR = {
  error: string;
};

export default base()
  .get(async (req, res: NextApiResponse<USER_DATA | ERROR>) => {
    const {
      query: { walletAddress },
    } = req;
    // By unique identifier
    if (!walletAddress || typeof walletAddress !== "string") {
      res.status(400).json({ error: "This is a bad request" });
    }
    const user = await prisma.user.findUnique({
      where: {
        walletAddress: walletAddress as string,
      },
    });
    res.status(200).json({ success: true, data: user });
  })
  .post(async (req, res) => {
    if (!req.body.walletAddress) {
      res.status(400).json({ error: "This is a bad request" });
    }
    {
      const user = await prisma.user.create({
        data: {
          walletAddress: req.body.walletAddress as string,
        },
      });
      res.status(200).json({ success: true, data: user });
    }
  });
