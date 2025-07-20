import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join } from 'path';
import 'dotenv/config';


const serviceAccountPath = join(process.cwd(), process.env.SERVICE_ACCOUNT); // full path
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get Firestore
const db = admin.firestore();
const auth = admin.auth();

export { admin, db, auth};
