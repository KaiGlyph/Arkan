// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAiqbGAzrMqXhR1zLVVU67o2KBK9aG-qMc",
  authDomain: "arkan-protocol.firebaseapp.com",
  projectId: "arkan-protocol",
  storageBucket: "arkan-protocol.firebasestorage.app",
  messagingSenderId: "789239543078",
  appId: "1:789239543078:web:296ef44c23155820b73de7",
  measurementId: "G-KCW2Y9TXVJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);