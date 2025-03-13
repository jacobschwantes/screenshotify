import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import {
  getFirestore,
  Timestamp,
  FieldValue,
  DocumentReference,
} from "firebase-admin/firestore";
const db = getFirestore();

function sendNotification(docRef, message) {
  const collectionRef = docRef.collection("notifications");
  return collectionRef.add({
    message,
    timestamp: Date.now(),
  });
}
async function createLog(docRef, doc) {
  const collectionRef = docRef.collection("logs");
  return collectionRef.add(doc);
}
function incrementCounter(docRef, numShards) {
  const shardId = Math.floor(Math.random() * numShards);
  const shardRef = docRef.doc(shardId.toString());
  return shardRef.set({ count: FieldValue.increment(1) }, { merge: true });
}
async function getCount(docRef) {
  const querySnapshot = await docRef.collection("usage").get();
  const documents = querySnapshot.docs;
  let count = 0;
  for (const doc of documents) {
    count += doc.get("count");
  }
  return count;
}
async function checkUserQuota(userid) {
  const userRef = db.collection("users");
  const doc = await userRef.doc(userid).get();
  const user = doc.data();
  console.log("user", "=>", user);
  const count = await getCount(userRef.doc(userid));
  if (user.quota > count) {
    user.usage = count;
    console.log(
      "user has enough quota:",
      "quota:",
      user.quota,
      "usage:",
      count
    );
    return user;
  } else {
    console.log(
      "user does not have enough quota:",
      "quota:",
      user.quota,
      "usage:",
      count
    );
    return false;
  }
}
async function checkTokenQuota(token) {
  const tokenRef = db.collection("API_KEYS").doc(token.key);
  const count = await getCount(tokenRef);
  if (token.quota > count) {
    console.log(
      "token has enough quota:",
      "quota:",
      token.quota,
      "usage:",
      count
    );
    return true;
  } else {
    console.log(
      "token does not have enough quota:",
      "quota:",
      token.quota,
      "usage:",
      count
    );
    return false;
  }
}
export const checkQuota = async (req, res, next) => {
  const { key, quota, userid, quota_limit } = res.locals.token;
  console.log(key, quota, userid);
  const userCheck = await checkUserQuota(userid);
  if (userCheck) {
    res.locals.user = userCheck;
    const tokenCheck = quota_limit === 'limited' ? await checkTokenQuota(res.locals.token) : true;
    if (tokenCheck) next();
    else {
      res.status(400).send("This token has no remaining quota.");
    }
  } else {
    res.status(400).send("Account has no remaining quota.");
  }
};
export const incrementUsage = async (user, token, options) => {
  const userRef = db.collection("users").doc(token.userid);
  const tokenRef = db.collection("API_KEYS").doc(token.key);
  incrementCounter(userRef.collection("usage"), 3);
  incrementCounter(tokenRef.collection("usage"), 3);
  // sendNotification(userRef, `api request processed using ${token.name}. usage at ${user.usage + 1}/${user.quota}`);
  return createLog(db.collection("users").doc(token.userid), {timestamp: Date.now(), token_name: token.name, status: "processing", url: options.url, id: user.usage + 1}).then(doc => {return doc.id})
};
