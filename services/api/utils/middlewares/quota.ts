import { getFirestore, FieldValue } from "firebase-admin/firestore";
const db = getFirestore();

// send a notification to the user
function sendNotification(docRef, message) {
	const collectionRef = docRef.collection("notifications");
	return collectionRef.add({
		message,
		timestamp: Date.now(),
	});
}

// create a log for the user
async function createLog(docRef, doc) {
	const collectionRef = docRef.collection("logs");
	return collectionRef.add(doc);
}

// increment quota counter
function incrementCounter(docRef, numShards) {
	const shardId = Math.floor(Math.random() * numShards);
	const shardRef = docRef.doc(shardId.toString());
	return shardRef.set({ count: FieldValue.increment(1) }, { merge: true });
}

// gets the current quota count of the user
async function getCount(docRef) {
	const querySnapshot = await docRef.collection("usage").get();
	const documents = querySnapshot.docs;
	let count = 0;
	for (const doc of documents) {
		count += doc.get("count");
	}
	return count;
}

// checks if the user has enough quota
async function checkUserQuota(userid) {
	const userRef = db.collection("users");
	const doc = await userRef.doc(userid).get();
	const user = doc.data();
	const count = await getCount(userRef.doc(userid));
	if (user.quota > count) {
		user.usage = count;
		return user;
	} else {
		return false;
	}
}

// checks if an api token has enough quota
async function checkTokenQuota(token) {
	const tokenRef = db.collection("API_KEYS").doc(token.key);
	const count = await getCount(tokenRef);

	return token.quota > count;
}

// checks if the user has enough quota
export const checkQuota = async (req, res, next) => {
	const { userid, quota_limit } = res.locals.token;
	const userCheck = await checkUserQuota(userid);

	if (userCheck) {
		res.locals.user = userCheck;
		const tokenCheck =
			quota_limit === "limited"
				? await checkTokenQuota(res.locals.token)
				: true;
		if (tokenCheck) next();
		else {
			res.status(400).send("This token has no remaining quota.");
		}
	} else {
		res.status(400).send("Account has no remaining quota.");
	}
};

// increments the usage counter for the user and the token
export const incrementUsage = async (user, token, options) => {
	const userRef = db.collection("users").doc(token.userid);
	const tokenRef = db.collection("API_KEYS").doc(token.key);
	incrementCounter(userRef.collection("usage"), 3);
	incrementCounter(tokenRef.collection("usage"), 3);

	return createLog(db.collection("users").doc(token.userid), {
		timestamp: Date.now(),
		token_name: token.name,
		status: "processing",
		url: options.url,
		id: user.usage + 1,
	}).then((doc) => {
		return doc.id;
	});
};
