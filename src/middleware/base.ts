import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

export const base = () =>
  nc<NextApiRequest, NextApiResponse>({
    onError: (err, req, res, next) => {
      return res.status(500).end({ error: "Internal Server Error" });
    },
    onNoMatch: (req, res) => {
      return res.status(404).end({ error: "Not Found" });
    },
  });
