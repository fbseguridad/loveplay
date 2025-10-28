import MercadoPagoConfig, { Preference } from 'mercadopago';

// Configurá con tu Access Token
const client = new MercadoPagoConfig({
  accessToken: 'APP_USR-1851741440474323-102719-d914ef7d526d0aff943b5e85b7ef56aa-2951157588'
});

export async function crearPago(item) {
  const precioConComision = item.precio * 1.21;

  const preference = new Preference(client);

  const body = {
    items: [
      {
        title: item.titulo,
        quantity: item.cantidad,
        unit_price: parseFloat(precioConComision.toFixed(2)),
        currency_id: 'ARS'
      }
    ],
    back_urls: {
      success: 'http://localhost:3000/frontend/pago_success.html',
      failure: 'http://localhost:3000/frontend/pago_failure.html',
      pending: 'http://localhost:3000/frontend/pago_pending.html'
    },
    auto_return: 'approved'
  };

  const result = await preference.create({ body });
  return result.init_point;
}
