import fetch from "node-fetch";

export default async function handler(req, res) {
  // ✅ Token de prueba incluido
  const MP_ACCESS_TOKEN = 'APP_USR-1851741440474323-102719-d914ef7d526d0aff943b5e85b7ef56aa-2951157588';
  try {
    const precioBase = req.body?.precio ? Number(req.body.precio) : 100;
    const precioConComision = +(precioBase * 1.21).toFixed(2);

    const body = {
      items: [
        { title: "Prueba LovePlay - Item", quantity: 1, unit_price: precioConComision, currency_id: "ARS" }
      ],
      back_urls: {
        success: 'https://TU_PROYECTO.vercel.app/pago_success.html',
        failure: 'https://TU_PROYECTO.vercel.app/pago_failure.html',
        pending: 'https://TU_PROYECTO.vercel.app/pago_pending.html'
      },
      auto_return: 'approved'
    };

    const resp = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${MP_ACCESS_TOKEN}` },
      body: JSON.stringify(body)
    });

    const data = await resp.json();
    if (!resp.ok) return res.status(500).json({ error: "MP error", detail: data });

    res.status(200).json({ ok: true, init_point: data.init_point, raw: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
