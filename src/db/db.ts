import admin from 'firebase-admin';
import serviceAccount from '../../service-account.json';

export const db = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
}).firestore()
