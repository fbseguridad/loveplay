// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

// Configuración de tu app Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBWFUvtpGkmlALf6mAAWvfnFGtvghcZTnE",
  authDomain: "loveplay-7b8cc.firebaseapp.com",
  projectId: "loveplay-7b8cc",
  storageBucket: "loveplay-7b8cc.appspot.com",
  messagingSenderId: "923425643462",
  appId: "1:923425643462:web:d3482d37014141d54370c7"
};

// Inicializar Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// --- Funciones auxiliares ---

// Registrar usuario
export async function registrarUsuario(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

// Login
export async function loginUsuario(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

// Subir archivo (foto o video)
export async function subirArchivo(file) {
  const storageRef = ref(storage, `uploads/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// Guardar post en Firestore
export async function guardarPost(usuario, urlArchivo) {
  return await addDoc(collection(db, "posts"), {
    usuario: usuario,
    url: urlArchivo,
    fecha: new Date()
  });
}

// Obtener todos los posts
export async function obtenerPosts() {
  const snapshot = await getDocs(collection(db, "posts"));
  return snapshot.docs.map(doc => doc.data());
}
