import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { ObjectShape, OptionalObjectSchema } from "yup/lib/object";

export function validateBody(schema: OptionalObjectSchema<ObjectShape>) {
  return async (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextHandler
  ) => {
    if (["POST", "PUT"].includes(req.method)) {
      try {
        req.body = await schema.validate(req.body, {
          abortEarly: false,
          stripUnknown: true,
        });
      } catch (error) {
        return res.status(400).json(error);
      }
    }
    next();
  };
}
