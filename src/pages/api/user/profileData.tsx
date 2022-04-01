import type { NextApiRequest, NextApiResponse } from "next";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import prisma from "@/services";
import { User } from "@prisma/client";
import { base } from "@/middleware/base";
import nc from "next-connect";
import { validateBody } from "@/middleware/validation";
import userProfileSchema from "@/schema/userProfile";
import * as Yup from "yup";
import { API_ERROR_CODES } from "@/common/types";

export type USER_DATA = {
  success: boolean;
  data: User;
};

export type ERROR = {
  error: string;
};

const validation = nc().post(
  "/api/user/profileData",
  validateBody(
    userProfileSchema.concat(
      Yup.object({
        address: Yup.string(),
        passTokenId: Yup.string().required(),
      })
    )
  )
);

interface NextApiRequestExtended extends NextApiRequest {
  body: {
    username: string;
    email?: string;
    bio?: string;
    sendEmail?: boolean;
    passTokenId: string;
    address: string;
  };
}

export default base()
  .use(validation)
  .get(async (req: NextApiRequest, res: NextApiResponse<USER_DATA | ERROR>) => {
    const {
      query: { walletAddress },
    } = req;

    // By unique identifier
    if (!walletAddress || typeof walletAddress !== "string") {
      res.status(400).json({ error: "This is a bad request" });
    }
    const profile = await prisma.profile.findUnique({
      where: {
        walletAddress: walletAddress as string,
      },
    });
    return res.status(200).json({ success: true, data: profile });
  })
  .post(async (req: NextApiRequestExtended, res) => {
    try {
      const profile = await prisma.profile.upsert({
        where: {
          walletAddress: req.body.address,
        },
        update: {
          bio: req.body.bio,
          email: req.body.email,
          sendEmail: req.body.sendEmail,
          username: req.body.username,
          passTokenId: req.body.passTokenId,
        },
        create: {
          user: { connect: { walletAddress: req.body.address } },
          bio: req.body.bio,
          email: req.body.email,
          sendEmail: req.body.sendEmail,
          username: req.body.username,
          passTokenId: req.body.passTokenId,
        },
      });

      return res.status(200).json({ success: true, data: profile });
    } catch (e) {
      if (e.code === "P2002" && e.meta.target[0] === "username") {
        return res.status(400).json({
          error: "Username Already Taken",
          errorCode: API_ERROR_CODES.USERNAME_ALREADY_TAKEN,
        });
      }

      return res.status(500).json({ error: "There was an error" });
    }
  });
