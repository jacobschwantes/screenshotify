import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@utils/middlewares";
import { firestore } from "@modules/auth/firebase/admin";
async function getCount(docRef: FirebaseFirestore.DocumentReference) {
  const querySnapshot = await docRef.collection("usage").get();
  const documents = querySnapshot.docs;
  let count = 0;
  for (const doc of documents) {
    count += doc.get("count");
  }
  return count;
}
async function aggregateUsage(doc: FirebaseFirestore.DocumentData) {
  const data = doc.data();
  const key = doc.id;
  const count = await getCount(firestore.collection("API_KEYS").doc(key));
  return { ...data, key, usage: count };
}
type Data = {
  message: string;
  key?: {
    key: string;
    usage: number;
    locked: boolean;
    name: string;
    quota: number;
    quota_limit: string;
    userid: string;
  };
};
interface TokenOptions {
  name: string;
  quota: number;
  locked: boolean;
  quota_limit: string;
}
const checkOptions = (options: TokenOptions) => {
  const schema = {
    name: (value: string) =>
      /^[\w-]+$/.test(value) && value.length > 0 && value.length < 28,
    quota: (value: number) => Number(value) && value >= 0 && value <= 1000,
    locked: (value: boolean) => typeof value === "boolean",
    quota_limit: (value: string) =>
      (String(value) && value === "limited") || "unlimited",
  };

  const validate = (
    object: any,
    schema: {
      name: (value: any) => boolean;
      quota: (value: number) => boolean | number;
      locked: (value: boolean) => boolean;
      quota_limit: (value: string) => string | boolean;
    }
  ) =>
    Object.keys(schema)
      .filter((key) => !schema[key as keyof typeof schema](object[key]))
      .map((key) => new Error(`${key} is invalid.`));

  const errors = validate(options, schema);

  if (errors.length > 0) {
    for (const { message } of errors) {
      console.log(message);
      return false;
    }
  } else {
    console.log("info is valid");
    return true;
  }
};
interface ApiRequest extends NextApiRequest {
  uid: string;
}
// TODO token is getting looked up twice in aggregate usage when only usage needs to get looked up
async function handler(req: ApiRequest, res: NextApiResponse<Data>) {
  const key = req.query.token;
  const method = req.method;
  const options = req.body;
  if (!key || Array.isArray(key)) {
    res.status(400).json({ message: "invalid key or multiple keys sent" });
  } else {
    const tokenRef = firestore.collection("API_KEYS").doc(key);
    const doc = await tokenRef.get();
    const token = doc.data();
    if (doc.exists) {
      if (token && token.userid === req.uid) {
        switch (method) {
          case "GET":
            const usage = await aggregateUsage(doc);
            res.status(200).json({ message: "usage found", key: usage });
            break;
          case "POST":
            console.log(options);
            const validated = checkOptions(options);
            if (validated) {
              await tokenRef.update(options);
              res.status(200).json({ message: "updated token info" });
            } else {
              res.status(400).send({ message: "invalid token options" });
            }
            break;
          default:
            res.status(400).send({ message: "invalid method" });
            break;
          case "DELETE":
            try {
              const batch = firestore.batch();
              batch.delete(tokenRef.collection("usage").doc("0"));
              batch.delete(tokenRef.collection("usage").doc("1"));
              batch.delete(tokenRef.collection("usage").doc("2"));
              batch.delete(tokenRef);
              await batch.commit();
              res.status(200).json({ message: "key deleted" });
            } catch (e: any) {
              res.status(500).json({ message: e });
            }
            break;
        }
      } else {
        res.status(401).json({ message: "unauthorized" });
      }
    } else {
      res.status(400).json({ message: "key not found" });
    }
  }
}

export default withAuth(handler);
