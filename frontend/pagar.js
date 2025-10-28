async function pagar(titulo, precio, creadorId){
  const usuario = prompt('Ingresa tu usuario (para el registro):') || 'anónimo';
  const resp = await fetch('http://localhost:3000/api/pagar', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({titulo, precio, creadorId, usuario})
  });
  const j = await resp.json();
  if(!j.ok) return alert('Error: ' + (j.error || JSON.stringify(j)));
  // abrir init_point
  window.open(j.init_point, '_blank');
  alert('Se creó la preferencia. Guarda el ventaId: ' + j.ventaId + ' (lo tenés en data/ventas.json)');
}
