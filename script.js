let step = 0;
const steps = document.querySelectorAll(".step");
const progressBar = document.getElementById("progressBar");

function showStep() {
  steps.forEach((s, i) => s.classList.toggle("active", i === step));
  progressBar.style.width = (step / (steps.length - 1)) * 100 + "%";
}

function nextStep(){ step++; showStep(); }
function prevStep(){ step--; showStep(); }
showStep();

function n(v){ return parseFloat(v.replace(",", ".")); }

/* PERFURAÇÃO */
polInicial.onblur = polFinal.onblur = () => {
  if (!polInicial.value || !polFinal.value) return;
  const pi = n(polInicial.value);
  const pf = n(polFinal.value);

  if (pf > pi) {
    alert("Polegada final não pode ser maior que a inicial");
    polFinal.value = "";
    metrosInicialArea.classList.add("hidden");
    return;
  }

  metrosInicialArea.classList.toggle("hidden", pi === pf);
};

/* SANITÁRIO */
function toggleSanitario(){
  sanitarioCampos.classList.toggle("hidden", temSanitario.value !== "sim");
}

/* FILTROS */
function addFiltro(){
  const d = document.createElement("div");
  d.innerHTML = `
    <select>
      <option>Geomecânico PVC</option>
      <option>Tubo Aço Carbono</option>
      <option>Tubo Inox</option>
    </select>
    <input placeholder="Polegada">
    <input placeholder="De (m)">
    <input placeholder="Até (m)">
  `;
  listaFiltros.appendChild(d);
}

function gerarPosicoesFiltros(){
  const prof = n(profundidade.value);
  let filtros = [];

  document.querySelectorAll("#listaFiltros div").forEach(f=>{
    const tipo = f.children[0].value;
    const pol = n(f.children[1].value);
    const de = n(f.children[2].value);
    const ate = n(f.children[3].value);

    if (de >= ate) throw alert("Filtro inválido");
    if (ate > prof) throw alert("Filtro ultrapassa profundidade");

    filtros.push({tipo, pol, de, ate});
  });

  filtros.sort((a,b)=>a.de-b.de);
  for(let i=1;i<filtros.length;i++){
    if(filtros[i].de < filtros[i-1].ate)
      throw alert("Sobreposição de filtros");
  }

  let html="<ul>", atual=0;
  filtros.forEach(f=>{
    if(atual < f.de) html+=`<li>Tubo liso ${atual} - ${f.de}</li>`;
    html+=`<li>Filtro ${f.tipo} ${f.de} - ${f.ate}</li>`;
    atual=f.ate;
  });
  if(atual<prof) html+=`<li>Tubo liso ${atual} - ${prof}</li>`;
  html+="</ul>";
  filtrosArea.innerHTML=html;
}

/* AVANÇAR */
function avancarEtapaAtual(){
  if(step===0 && !cliente.value) return alert("Informe o cliente");

  if(step===1){
    if(n(metrosInicial.value||0) > n(profundidade.value))
      return alert("Qtd inicial maior que profundidade");
  }

  if(step===3){
    gerarPosicoesFiltros();
  }

  nextStep();
}
