const mercadopago = require('mercadopago');

// Configurar con tu access token (cuando lo tengas)
mercadopago.configurations.setAccessToken('TU_ACCESS_TOKEN');

// Crear preferencia de pago
async function crearPago(item) {
  const precioConComision = item.precio * 1.21;

  const preference = {
    items: [{
      title: item.titulo,
      quantity: item.cantidad,
      unit_price: parseFloat(precioConComision.toFixed(2)),
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
