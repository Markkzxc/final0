// firebase.js
import admin from "firebase-admin";

// Make sure you have your service account stored in an environment variable
if (!process.env.GOOGLE_SERVICE_ACCOUNT) {
  throw new Error("Missing GOOGLE_SERVICE_ACCOUNT environment variable!");
}

// Parse the JSON string from the env variable
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
