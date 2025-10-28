// ===============================
// 🔥 LOVEPLAY FIREBASE MEGA SCRIPT
// ===============================

// Importar Firebase SDKs
import { initializeApp } from "firebase/app";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "firebase/auth";
import { 
  getFirestore, collection, addDoc, getDocs, query, orderBy 
} from "firebase/firestore";
import { 
  getStorage, ref, uploadBytes, getDownloadURL 
} from "firebase/storage";

// Configuración de Firebase (🔥 la tuya)
const firebaseConfig = {
  apiKey: "AIzaSyBWFUvtpGkmlALf6mAAWvfnFGtvghcZTnE",
  authDomain: "loveplay-7b8cc.firebaseapp.com",
  projectId: "loveplay-7b8cc",
  storageBucket: "loveplay-7b8cc.firebasestorage.app",
  messagingSenderId: "923425643462",
  appId: "1:923425643462:web:d3482d37014141d54370c7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ===============================
// 🔹 Registro / Login / Logout
// ===============================
async function registrar(email, password) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Cuenta creada correctamente ✅");
  } catch (error) {
    alert("Error al registrar: " + error.message);
  }
}

async function login(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Sesión iniciada ✅");
  } catch (error) {
    alert("Error al iniciar sesión: " + error.message);
  }
}

function logout() {
  signOut(auth);
  alert("Sesión cerrada 👋");
}

// ===============================
// 🔹 Subida de fotos / videos
// ===============================
async function subirArchivo(file, tipo = "foto") {
  const user = auth.currentUser;
  if (!user) return alert("Inicia sesión primero");

  const nombre = `${user.uid}_${Date.now()}_${file.name}`;
  const archivoRef = ref(storage, nombre);

  await uploadBytes(archivoRef, file);
  const url = await getDownloadURL(archivoRef);

  await addDoc(collection(db, "posts"), {
    userId: user.uid,
    tipo,
    url,
    fecha: Date.now()
  });

  alert("Archivo subido 🎉");
  cargarFeed();
}

// ===============================
// 🔹 Mostrar feed (estilo TikTok simple)
// ===============================
async function cargarFeed() {
  const contenedor = document.getElementById("feed");
  contenedor.innerHTML = "<p>Cargando...</p>";

  const q = query(collection(db, "posts"), orderBy("fecha", "desc"));
  const snapshot = await getDocs(q);

  contenedor.innerHTML = "";
  snapshot.forEach(doc => {
    const post = doc.data();
    const elem = document.createElement("div");
    elem.className = "post";

    if (post.tipo === "video") {
      elem.innerHTML = `<video controls src="${post.url}" class="media"></video>`;
    } else {
      elem.innerHTML = `<img src="${post.url}" class="media"/>`;
    }

    contenedor.appendChild(elem);
  });
}

// ===============================
// 🔹 Escuchar estado del usuario
// ===============================
onAuthStateChanged(auth, user => {
  const estado = document.getElementById("estado");
  estado.textContent = user ? `Conectado como ${user.email}` : "No conectado";
  if (user) cargarFeed();
});

// ===============================
// 🔹 Interfaz HTML recomendada
// ===============================
// Agregá esto en tu index.html para probar:
//
// <div id="estado"></div>
// <input id="email" placeholder="Email">
// <input id="password" type="password" placeholder="Contraseña">
// <button onclick="registrar(email.value, password.value)">Registrar</button>
// <button onclick="login(email.value, password.value)">Login</button>
// <button onclick="logout()">Logout</button>
//
// <input id="file" type="file">
// <select id="tipo"><option value="foto">Foto</option><option value="video">Video</option></select>
// <button onclick="subirArchivo(file.files[0], tipo.value)">Subir</button>
//
// <div id="feed" style="display:grid;gap:10px;"></div>
//
// <style>
// .media { max-width: 300px; border-radius: 10px; }
// .post { background:#111; padding:10px; border-radius:15px; }
// body { color:white; background:black; text-align:center; font-family:sans-serif; }
// </style>
