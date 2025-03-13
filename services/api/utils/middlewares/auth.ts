import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
initializeApp({
	credential: applicationDefault(),
});
const db = getFirestore();

async function checkToken(key) {
	const tokenRef = db.collection("API_KEYS").doc(key);
	const doc = await tokenRef.get();
	if (doc.exists) {
		const docData = doc.data();
		docData.key = doc.id;
		return docData;
	} else {
		return false;
	}
}
export const isAuthorized = async (req, res, next) => {
	const { token } = req.query;

	if (token) {
		const data = await checkToken(token);
		res.locals.token = data;
		res.locals.start = Date.now();
		if (data) {
			if (data.locked) {
				const err = new Error("Token disabled.");
				res.status(401).send(err.message);
			} else {
				console.log("authorized");
				return next();
			}
		} else {
			const err = new Error("Invalid token.");
			res.status(401).send(err.message);
		}
	} else {
		const err = new Error("Request must be supplied with a token.");
		res.status(401).send(err.message);
	}
};
