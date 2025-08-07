// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAV1S-QlVLRFSmAaS9_etQ7_oOmaLc8rp0",
  authDomain: "mictlansonoro.firebaseapp.com",
  projectId: "mictlansonoro",
  storageBucket: "mictlansonoro.firebasestorage.app",
  messagingSenderId: "935344728932",
  appId: "1:935344728932:web:8d7071edbc98b401ab6871",
  measurementId: "G-MDMLFHJQBB"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;