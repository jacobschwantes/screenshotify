import { withAuth } from "@utils/middlewares";
import type { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "@modules/auth/firebase/admin";
import { UserConfig } from "@customTypes/global";
import { z } from "zod";
interface Data extends Partial<UserConfig> {
  message: string;
}
interface ApiRequest extends NextApiRequest {
  uid: string;
  email: string;
  email_verified: boolean;
}
const schema = z.object({
  theme: z.enum(["dark", "light", "system"]),
  email: z.object({
    billing: z.boolean(),
    transactional: z.boolean(),
    marketing: z.boolean(),
  }),
});
async function handler(req: ApiRequest, res: NextApiResponse<Data>) {
  const userRef = firestore.collection("users").doc(req.uid);
  if (req.method === "GET") {
    const userDoc = await userRef.get();
    const userInfo = userDoc.data();
    if (!userDoc.exists) {
      res.status(404).json({ message: "user not found" });
    } else {
      res.status(200).json({ ...userInfo, message: "found preferences" });
    }
  } else if (req.method === "PUT") {
    try {
      const options = req.body;
      const validated = schema.parse(options);
      if (validated) {
        const updateRes = await userRef.update({ preferences: validated });
        if (updateRes) {
          res.status(200).json({ message: "updated settings" });
        } else res.status(500).send({ message: "unexpected error occured" });
      }
    } catch {
      res.status(400).send({ message: "invalid options" });
    }
  } else {
    res.status(500).json({ message: "invalid method" });
  }
}
export default withAuth(handler);
