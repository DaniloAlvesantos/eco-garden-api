import * as fs from "node:fs";
import admin from "firebase-admin";

const serviceAccount = JSON.parse(
  fs.readFileSync("../../config/firebase.json", "utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const firestore_db = admin.firestore();
