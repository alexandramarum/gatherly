import admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { getAuth as getClientAuth } from 'firebase/auth';
import 'dotenv/config';

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);

// Initialize Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

// Initialize Client SDK (for auth methods)
const firebaseClientConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
};

const firebaseClientApp = initializeApp(firebaseClientConfig, 'clientApp');
const authClient = getClientAuth(firebaseClientApp);

export { admin, db, auth, authClient };
