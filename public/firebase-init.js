// Importar SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-storage.js";

// Configuración de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyBWFUvtpGkmlALf6mAAWvfnFGtvghcZTnE",
  authDomain: "loveplay-7b8cc.firebaseapp.com",
  projectId: "loveplay-7b8cc",
  storageBucket: "loveplay-7b8cc.appspot.com",
  messagingSenderId: "923425643462",
  appId: "1:923425643462:web:d3482d37014141d54370c7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
