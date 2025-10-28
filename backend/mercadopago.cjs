const MercadoPago = require('mercadopago');

// Crear instancia con tu access token de prueba
const mercadopago = new MercadoPago('APP_USR-1851741440474323-102719-d914ef7d526d0aff943b5e85b7ef56aa-2951157588');

async function crearPago(item) {
  const precioConComision = item.precio * 1.21;

  const preference = {
    items: [{
      title: item.titulo,
      quantity: item.cantidad,
      unit_price: parseFloat(precioConComision.toFixed(2))
    }],
    back_urls: {
      success: 'http://localhost:3000/frontend/pago_success.html',
      failure: 'http://localhost:3000/frontend/pago_failure.html',
      pending: 'http://localhost:3000/frontend/pago_pending.html'
    },
    auto_return: 'approved'
  };

  return await mercadopago.preferences.create(preference);
}

module.exports = { crearPago };
