import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const projectId = process.env.FIREBASE_PROJECT_ID;

let adminApp: App;
if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert({
      privateKey,
      clientEmail,
      projectId,
    }),
  });
} else {
  adminApp = getApps()[0];
}

const adminDb = getFirestore(adminApp);

export { adminApp, adminDb };
