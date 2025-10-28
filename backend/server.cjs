const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || 'APP_USR-1851741440474323-102719-d914ef7d526d0aff943b5e85b7ef56aa-2951157588';
const VENTAS_FILE = path.join(__dirname, '../data/ventas.json');

// Helper: guardar venta (agrega al JSON)
function guardarVenta(venta) {
  try {
    const arr = JSON.parse(fs.readFileSync(VENTAS_FILE, 'utf8') || '[]');
    arr.push(venta);
    fs.writeFileSync(VENTAS_FILE, JSON.stringify(arr, null, 2));
  } catch (err) {
    console.error('Error guardando venta:', err);
  }
}

// Endpoint que crea preferencia y devuelve init_point (usa precio +21%)
app.post('/api/pagar', async (req, res) => {
  try {
    const { titulo, precio, creadorId, usuario } = req.body;
    if (!titulo || !precio) return res.status(400).json({ ok:false, error: 'Faltan datos' });

    const precioConComision = +(Number(precio) * 1.21).toFixed(2);

    const body = {
      items: [
        {
          title: titulo,
          quantity: 1,
          unit_price: precioConComision,
          currency_id: "ARS"
        }
      ],
      back_urls: {
        success: 'http://localhost:3000/frontend/pago_success.html',
        failure: 'http://localhost:3000/frontend/pago_failure.html',
        pending: 'http://localhost:3000/frontend/pago_pending.html'
      },
      auto_return: 'approved'
    };

    const resp = await axios.post('https://api.mercadopago.com/checkout/preferences', body, {
      headers: {
        'Authorization': 'Bearer ' + MP_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      }
    });

    // Guardar registro inicial como pending con pref_id
    const pref = resp.data;
    const venta = {
      id: Date.now(),
      usuario: usuario || 'anónimo',
      creadorId: creadorId || null,
      titulo,
      precioOriginal: precio,
      precioConComision,
      pref_id: pref.id,
      init_point: pref.init_point,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    guardarVenta(venta);

    return res.json({ ok: true, init_point: pref.init_point, ventaId: venta.id });
  } catch (err) {
    console.error('Error crear preferencia:', err.response?.data || err.message);
    return res.status(500).json({ ok:false, error: err.message });
  }
});

// Endpoint sencillo para marcar venta como confirmada (útil en pruebas manuales)
app.post('/api/venta_confirmada', (req, res) => {
  try {
    const { ventaId } = req.body;
    const arr = JSON.parse(fs.readFileSync(VENTAS_FILE, 'utf8') || '[]');
    const v = arr.find(x => x.id === ventaId);
    if (!v) return res.status(404).json({ ok:false, error:'venta no encontrada' });
    v.status = 'approved';
    v.approved_at = new Date().toISOString();
    fs.writeFileSync(VENTAS_FILE, JSON.stringify(arr, null, 2));
    return res.json({ ok:true, venta: v });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok:false, error: err.message });
  }
});

// (Opcional) mantener /frontend
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Servidor LovePlay listo en http://localhost:' + PORT));
