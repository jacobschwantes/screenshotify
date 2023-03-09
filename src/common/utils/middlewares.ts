import { auth } from "@modules/auth/firebase/admin";
import { NextApiRequest, NextApiResponse } from "next";
export function withAuth(handler: any) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).end("Not authenticated");
    const token = authHeader.split(" ")[1];
    try {
      const { uid, email, email_verified } = await auth.verifyIdToken(token);
      if (!uid || !email) {
        res.status(401).json({ message: "invalid user" });
      } else {
        return handler({ ...req, uid, email, email_verified }, res);
      }
    } catch (e) {
      res.status(401).send("error validating user");
    }
  };
}
