// Inizializza Firebase una sola volta e riesporta i servizi usati da tutte le pagine.
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  getFirestore,
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, collectionGroup, query, where, orderBy, limit,
  onSnapshot, getDocs, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
// Configurazione del progetto Firebase "genitori-scuola".
const firebaseConfig = {
  apiKey: "AIzaSyAUv9ZqgDf9jJUF2B_gLlUhZbs2MwEzOZY",
  authDomain: "genitori-scuola.firebaseapp.com",
  projectId: "genitori-scuola",
  storageBucket: "genitori-scuola.firebasestorage.app",
  messagingSenderId: "150528730686",
  appId: "1:150528730686:web:752bbcca49fb7e1893d36f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup, signOut, onAuthStateChanged,
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, collectionGroup, query, where, orderBy, limit,
  onSnapshot, getDocs, addDoc, serverTimestamp
};
