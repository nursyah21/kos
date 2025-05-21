import { initializeApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBG5VnudtxNHhTXWzviYl0DsykUe_z_WA8',
  authDomain: 'pondokjaya-b7e51.firebaseapp.com',
  projectId: 'pondokjaya-b7e51',
  storageBucket: 'pondokjaya-b7e51.firebasestorage.app',
  messagingSenderId: '986363909688',
  appId: '1:986363909688:web:d479b8c70cb502e48278cd'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };