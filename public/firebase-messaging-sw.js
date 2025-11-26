// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAiqbGAzrMqXhR1zLVVU67o2KBK9aG-qMc",
  authDomain: "arkan-protocol.firebaseapp.com",
  projectId: "arkan-protocol",
  storageBucket: "arkan-protocol.firebasestorage.app",
  messagingSenderId: "789239543078",
  appId: "1:789239543078:web:296ef44c23155820b73de7"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/Arkan-Logo.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});