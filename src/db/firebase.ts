import _admin from 'firebase-admin';
import serviceAccount from '../../service-account.json';

const admin = _admin.initializeApp({
    credential: _admin.credential.cert(serviceAccount as _admin.ServiceAccount)
})

export const db = admin.firestore()
export const auth = admin.auth()
