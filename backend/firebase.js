// firebase.js
import admin from "firebase-admin";
import fs from "fs";

// Read the service account JSON
const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
