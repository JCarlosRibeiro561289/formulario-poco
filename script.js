let step = 0;
const steps = document.querySelectorAll(".step");
const progress = document.getElementById("progress");
const listaFiltros = document.getElementById("listaFiltros");

function update() {
  steps.forEach((s,i)=>s.classList.toggle("active",i===step));
  progress.style.width = ((step+1)/steps.length*100)+"%";
}
update();

function nextStep(){ if(step<steps.length-1){step++;update();} }
function prevStep(){ if(step>0){step--;update();} }

function addFiltro(){
  const d=document.createElement("div");
  d.className="filtro";
  d.innerHTML=`
    <input class="numero ini" placeholder="Início">
    <input class="numero fim" placeholder="Fim">
  `;
  listaFiltros.appendChild(d);
}

document.addEventListener("input",e=>{
  if(e.target.classList.contains("numero")){
    e.target.value=e.target.value.replace(",",".").replace(/[^0-9.]/g,"");
  }
});

function gerarSequencia(filtros,polFinal){
  let seq=[],atual=0;
  filtros.sort((a,b)=>a.ini-b.ini);
  filtros.forEach(f=>{
    if(f.ini>atual) seq.push({i:atual,f:f.ini,t:"Liso"});
    seq.push({i:f.ini,f:f.fim,t:"Filtro"});
    atual=f.fim;
  });
  if(atual<polFinal) seq.push({i:atual,f:polFinal,t:"Liso"});
  return seq;
}

document.getElementById("formPoco").addEventListener("submit",e=>{
  e.preventDefault();
  const dados=Object.fromEntries(new FormData(e.target));
  const filtros=[];
  document.querySelectorAll(".filtro").forEach(f=>{
    const i=parseFloat(f.querySelector(".ini").value);
    const fim=parseFloat(f.querySelector(".fim").value);
    if(!isNaN(i)&&!isNaN(fim)) filtros.push({ini:i,fim});
  });

  const seq=gerarSequencia(filtros,parseFloat(dados.polFinal));

  let html=`<div class="card">
  <h2>Resumo do Poço</h2>

  <p><b>Cliente:</b> ${dados.cliente}</p>
  <p><b>Endereço:</b> ${dados.endereco}</p>
  <p><b>Empresa:</b> ${dados.empresa}</p>
  <p><b>POL Final:</b> ${dados.polFinal} m</p>

  <h3>Revestimento (${dados.tipoRev} ${dados.polRev}")</h3>

  <table>
  <tr><th>Início</th><th>Fim</th><th>Tipo</th></tr>`;

  seq.forEach(s=>{
    html+=`<tr><td>${s.i}</td><td>${s.f}</td><td>${s.t}</td></tr>`;
  });

  html+=`</table>

  <div class="nav">
    <button class="secondary" onclick="location.reload()">Editar</button>
    <button class="primary" onclick="alert('Pronto para envio')">Confirmar</button>
  </div>
  </div>`;

  document.getElementById("app").classList.add("hidden");
  const r=document.getElementById("resumo");
  r.innerHTML=html;
  r.classList.remove("hidden");
});
