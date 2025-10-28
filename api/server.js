import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

const MP_ACCESS_TOKEN = 'APP_USR-1851741440474323-102719-d914ef7d526d0aff943b5e85b7ef56aa-2951157588';

// Base de datos simple en JSON
const DB_FILE = './data.json';
if(!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({users:[], posts:[]}));

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data,null,2));

// ✅ Registro de usuario/creador
app.post('/api/register', (req,res)=>{
  const {username, tipo} = req.body;
  const db = readDB();
  if(db.users.find(u=>u.username===username)) return res.status(400).json({error:'Usuario ya existe'});
  const newUser = {id:Date.now(), username, tipo};
  db.users.push(newUser);
  writeDB(db);
  res.json({ok:true, user:newUser});
});

// ✅ Login simple
app.post('/api/login', (req,res)=>{
  const {username} = req.body;
  const db = readDB();
  const user = db.users.find(u=>u.username===username);
  if(!user) return res.status(404).json({error:'Usuario no encontrado'});
  res.json({ok:true, user});
});

// ✅ Subida de fotos/videos
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: (req,file,cb)=>cb(null, Date.now()+'-'+file.originalname)
});
const upload = multer({storage});

app.post('/api/upload', upload.single('file'), (req,res)=>{
  const {userId} = req.body;
  if(!req.file) return res.status(400).json({error:'Archivo no enviado'});
  const db = readDB();
  const post = {id:Date.now(), userId, url:'/uploads/'+req.file.filename};
  db.posts.push(post);
  writeDB(db);
  res.json({ok:true, post});
});

// ✅ Feed tipo TikTok
app.get('/api/feed', (req,res)=>{
  const db = readDB();
  // Devuelve posts en orden inverso
  const feed = db.posts.sort((a,b)=>b.id-a.id);
  res.json({ok:true, feed});
});

// ✅ Pago prueba Mercado Pago
app.post('/api/pago-prueba', async (req,res)=>{
  try {
    const precioBase = req.body?.precio ? Number(req.body.precio) : 100;
    const precioConComision = +(precioBase*1.21).toFixed(2);
    const body = {
      items:[{title:"LovePlay Item", quantity:1, unit_price:precioConComision, currency_id:"ARS"}],
      back_urls:{
        success:'https://TU_PROYECTO.vercel.app/pago_success.html',
        failure:'https://TU_PROYECTO.vercel.app/pago_failure.html',
        pending:'https://TU_PROYECTO.vercel.app/pago_pending.html'
      },
      auto_return:'approved'
    };
    const resp = await fetch("https://api.mercadopago.com/checkout/preferences",{
      method:"POST",
      headers:{"Content-Type":"application/json","Authorization":`Bearer ${MP_ACCESS_TOKEN}`},
      body:JSON.stringify(body)
    });
    const data = await resp.json();
    if(!resp.ok) return res.status(500).json({error:'MP error', detail:data});
    res.json({ok:true, init_point:data.init_point, raw:data});
  } catch(err){
    console.error(err);
    res.status(500).json({ok:false,error:err.message});
  }
});

// ✅ Servir frontend
app.use(express.static(path.join(process.cwd(),'public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log('Servidor LovePlay listo en http://localhost:'+PORT));
