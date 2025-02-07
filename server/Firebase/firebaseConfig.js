const admin = require('firebase-admin');

// Check if Firebase is already initialized to prevent reinitialization errors
const serviceAccount = require("../employee-node-6d9ec-firebase-adminsdk-44lp0-52a33155e9.json");
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "employee-node-6d9ec.appspot.com",
      });
}

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();
const bucket = admin.storage().bucket();

module.exports = { db, auth, storage, bucket };
