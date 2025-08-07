
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "bovinopro-lite",
  appId: "1:97561048393:web:08338854a29c40eadb5698",
  storageBucket: "bovinopro-lite.firebasestorage.app",
  apiKey: "AIzaSyDavOvy_kKQFYZTQB7WoYPJRDnCOg6Jkjc",
  authDomain: "bovinopro-lite.firebaseapp.com",
  messagingSenderId: "97561048393"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
