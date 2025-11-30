import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAiqbGAzrMqXhR1zLVVU67o2KBK9aG-qMc",
  authDomain: "arkan-protocol.firebaseapp.com",
  projectId: "arkan-protocol",
  appId: "arkan-protocol.firebasestorage.app",
  storageBucket: "789239543078",
  messagingSenderId: "1:789239543078:web:5bc93f03acd5ecefb73de7",
};

// Evita reinicializar en HMR
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth con persistencia local (mantiene sesión al recargar)
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {
  // Ignorar errores de persistencia en entornos restringidos
});

// Firestore
const db = getFirestore(app);

export { app, auth, db };
