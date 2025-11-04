import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDzfXprOJHBZrJvNMD3L8YKDjUVToSHTY4",
  authDomain: "p-rodolfo.firebaseapp.com",
  projectId: "p-rodolfo",
  storageBucket: "p-rodolfo.appspot.com",
  messagingSenderId: "599830686545",
  appId: "1:599830686545:web:3560aa7d5dca44cb850170"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar Auth y Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
