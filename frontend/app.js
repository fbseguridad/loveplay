const container=document.getElementById('creadores-container');

fetch('http://localhost:3000/api/creadores')
.then(res=>res.json())
.then(creadores=>{
  creadores.forEach(c=>{
    const div=document.createElement('div'); div.className='creador';
    // Perfil video o foto
    div.innerHTML=`<video src="${c.foto}" autoplay loop muted playsinline></video>
    <div class="botones-flotantes">
      <button onclick="verFotos(${c.id})">📸 Fotos</button>
      <button onclick="verVideos(${c.id})">🎥 Videos</button>
      <button onclick="verLive(${c.id})">🎬 Live</button>
    </div>`;
    container.appendChild(div);
  });
});

function verFotos(id){
  const win=window.open(`galeria.html?creador=${id}&tipo=foto`,'_blank');
}
function verVideos(id){
  const win=window.open(`galeria.html?creador=${id}&tipo=video`,'_blank');
}
function verLive(id){
  alert('Live comenzará después del pre-roll');
  const win=window.open('ads/preroll.html','_blank');
  setTimeout(()=>{win.close();alert('🔥 Conectando al Live!')},10000);
}
