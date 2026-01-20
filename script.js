let step = 0;
const steps = document.querySelectorAll(".step");
const progress = document.getElementById("progress");

function update() {
  steps.forEach((s,i)=>s.classList.toggle("active",i===step));
  progress.style.width = ((step+1)/steps.length*100)+"%";
}
update();

function nextStep(){ if(step<steps.length-1){step++;update();} }
function prevStep(){ if(step>0){step--;update();} }

/* Sanitário */
document.getElementById("temSanitario").addEventListener("change",e=>{
  document.getElementById("blocoSanitario")
    .classList.toggle("hidden",e.target.value==="nao");
});

/* Total x Parcial */
document.getElementById("tipoPoco").addEventListener("change",e=>{
  const total=e.target.value==="total";
  document.getElementById("blocoFiltros").classList.toggle("hidden",!total);
  document.getElementById("blocoParcial").classList.toggle("hidden",total);
});

/* Filtros */
const listaFiltros=document.getElementById("listaFiltros");
function addFiltro(){
  const d=document.createElement("div");
  d.className="filtro";
  d.innerHTML=`
    <input class="numero ini" placeholder="Início">
    <input class="numero fim" placeholder="Fim">
  `;
  listaFiltros.appendChild(d);
}

/* Máscara */
document.addEventListener("input",e=>{
  if(e.target.classList.contains("numero")){
    e.target.value=e.target.value.replace(",",".").replace(/[^0-9.]/g,"");
  }
});

/* Validação filtros */
function validarFiltros(filtros,polFinal){
  for(let i=0;i<filtros.length;i++){
    if(filtros[i].ini>=filtros[i].fim) return "Início maior ou igual ao fim";
    if(filtros[i].fim>polFinal) return "Filtro ultrapassa POL final";
    if(i>0 && filtros[i].ini<filtros[i-1].fim) return "Filtros sobrepostos";
  }
  return null;
}

function gerarSequencia(filtros,polFinal){
  let seq=[],atual=0;
  filtros.forEach(f=>{
    if(f.ini>atual) seq.push({i:atual,f:f.ini,t:"Liso"});
    seq.push({i:f.ini,f:f.fim,t:"Filtro"});
    atual=f.fim;
  });
  if(atual<polFinal) seq.push({i:atual,f:polFinal,t:"Liso"});
  return seq;
}

/* Submit */
document.getElementById("formPoco").addEventListener("submit",e=>{
  e.preventDefault();

  const dados=Object.fromEntries(new FormData(e.target));
  const erroEl=document.getElementById("erroFiltro");
  erroEl.classList.add("hidden");

  let filtros=[];
  if(document.getElementById("tipoPoco").value==="total"){
    document.querySelectorAll(".filtro").forEach(f=>{
      const i=parseFloat(f.querySelector(".ini").value);
      const fim=parseFloat(f.querySelector(".fim").value);
      if(!isNaN(i)&&!isNaN(fim)) filtros.push({ini:i,fim});
    });

    filtros.sort((a,b)=>a.ini-b.ini);
    const erro=validarFiltros(filtros,parseFloat(dados.polFinal));
    if(erro){
      erroEl.textContent=erro;
      erroEl.classList.remove("hidden");
      return;
    }
  }

  let html=`<div class="card"><h2>Resumo do Poço</h2>
  <p><b>Cliente:</b> ${dados.cliente}</p>
  <p><b>Endereço:</b> ${dados.endereco}</p>`;

  if(dados.tipoSanitario){
    html+=`<h3>Sanitário</h3>
    <p>${dados.tipoSanitario} ${dados.polSanitario}" – ${dados.compSanitario} m</p>`;
  }

  html+=`<h3>Revestimento do Poço</h3>
  <p>${dados.tipoRev} ${dados.polRev}"</p>`;

  if(document.getElementById("tipoPoco").value==="total"){
    const seq=gerarSequencia(filtros,parseFloat(dados.polFinal));
    html+=`<table><tr><th>Início</th><th>Fim</th><th>Tipo</th></tr>`;
    seq.forEach(s=>{
      html+=`<tr><td>${s.i}</td><td>${s.f}</td><td>${s.t}</td></tr>`;
    });
    html+=`</table>`;
  } else {
    html+=`<p>Revestimento parcial de ${dados.compParcial} m</p>`;
  }

  html+=`
  <div class="nav">
    <button class="secondary" onclick="location.reload()">Editar</button>
    <button class="primary" onclick="location.reload()">Confirmar e Enviar</button>
  </div>
  </div>`;

  document.getElementById("app").classList.add("hidden");
  const r=document.getElementById("resumo");
  r.innerHTML=html;
  r.classList.remove("hidden");
});
