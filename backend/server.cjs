const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default:fetch})=>fetch(...args));
const path = require('path');

const app = express();
app.use(express.json());

const MP_ACCESS_TOKEN = 'APP_USR-1851741440474323-102719-d914ef7d526d0aff943b5e85b7ef56aa-2951157588';

// Endpoint de prueba que crea preferencia Mercado Pago
app.post('/api/pago-prueba', async (req,res)=>{
  try {
    const precioBase = req.body.precio ? Number(req.body.precio) : 100;
    const precioConComision = +(precioBase*1.21).toFixed(2);

    const body = {
      items: [{ title:"Prueba LovePlay", quantity:1, unit_price:precioConComision, currency_id:"ARS" }],
      back_urls: {
        success: 'http://localhost:3000/frontend/pago_success.html',
        failure: 'http://localhost:3000/frontend/pago_failure.html',
        pending: 'http://localhost:3000/frontend/pago_pending.html'
      },
      auto_return: 'approved'
    };

    const resp = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method:'POST',
      headers:{ 'Content-Type':'application/json', 'Authorization':'Bearer '+MP_ACCESS_TOKEN },
      body: JSON.stringify(body)
    });

    const data = await resp.json();
    if(!resp.ok) return res.status(500).json({error:'MP error',detail:data});
    return res.json({ok:true, init_point:data.init_point, raw:data});
  } catch(err){
    console.error('Error crear preferencia:',err);
    return res.status(500).json({ok:false,error:err.message});
  }
});

// Servir frontend
app.use('/frontend', express.static(path.join(__dirname,'../public')));

const PORT = process.env.PORT||3000;
app.listen(PORT, ()=>console.log('Servidor LovePlay listo en http://localhost:'+PORT));
