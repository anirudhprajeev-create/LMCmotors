import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

let adminApp: App;
if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert(serviceAccount),
  });
} else {
  adminApp = getApps()[0];
}

const adminDb = getFirestore(adminApp);

export { adminApp, adminDb };
