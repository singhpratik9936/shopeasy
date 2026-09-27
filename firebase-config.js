// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpm_QSIvj2t8koj_J-ryKdbz95daYOsE8",
  authDomain: "shopeasy-9bec4.firebaseapp.com",
  projectId: "shopeasy-9bec4",
  storageBucket: "shopeasy-9bec4.firebasestorage.app",
  messagingSenderId: "110945403718",
  appId: "1:110945403718:web:f2d8ba6f4a28c9c32fdb47",
  measurementId: "G-0DXC83XM4Y"
};

// Check if config values are placeholders before initializing
if (Object.values(firebaseConfig).some((value) => value.startsWith("PASTE_"))) {
  throw new Error("Add your Firebase web app config in firebase-config.js.");
}

// Initialize Firebase once
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
