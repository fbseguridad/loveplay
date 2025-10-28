const galeria=document.getElementById('galeria');
const params=new URLSearchParams(window.location.search);
const creadorId=parseInt(params.get('creador'));
const tipo=params.get('tipo');
fetch('http://localhost:3000/api/creadores')
.then(res=>res.json())
.then(creadores=>{
  const c=creadores.find(x=>x.id===creadorId);
  if(!c) return alert('No encontrado');
  const items=c.galeria.filter(g=>g.tipo===tipo);
  items.forEach(item=>{
    const div=document.createElement('div'); div.className='galeria-item';
    if(item.tipo==='foto') div.innerHTML=`<img src="${item.ruta}"><div>$${item.precio*1.21}</div><button onclick="alert('Descargando')">⬇ Descargar</button>`;
    else div.innerHTML=`<video src="${item.ruta}" controls></video><div>$${item.precio*1.21}</div><button onclick="alert('Descargando')">⬇ Descargar</button>`;
    galeria.appendChild(div);
  });
});
