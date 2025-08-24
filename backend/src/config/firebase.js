import admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import 'dotenv/config';

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT);

// Initialize Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { admin, db};
