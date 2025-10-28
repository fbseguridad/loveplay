// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBWFUvtpGkmlALf6mAAWvfnFGtvghcZTnE",
  authDomain: "loveplay-7b8cc.firebaseapp.com",
  projectId: "loveplay-7b8cc",
  storageBucket: "loveplay-7b8cc.appspot.com",
  messagingSenderId: "923425643462",
  appId: "1:923425643462:web:d3482d37014141d54370c7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const storage = getStorage();
const db = getFirestore();

window.register = async function(){
  const email = document.getElementById('email').value;
  const pass = document.getElementById('pass').value;
  try{
    await createUserWithEmailAndPassword(auth,email,pass);
    alert('Registrado!');
  }catch(e){ alert(e.message); }
};

window.login = async function(){
  const email = document.getElementById('email').value;
  const pass = document.getElementById('pass').value;
  try{
    await signInWithEmailAndPassword(auth,email,pass);
    alert('Logueado!');
  }catch(e){ alert(e.message); }
};

window.uploadFile = async function(){
  const file = document.getElementById('fileInput').files[0];
  if(!file){ alert('Selecciona un archivo'); return; }
  const fileRef = ref(storage,'uploads/'+file.name);
  await uploadBytes(fileRef,file);
  const url = await getDownloadURL(fileRef);
  await addDoc(collection(db,'posts'),{url, timestamp:Date.now()});
  alert('Subido!');
};
