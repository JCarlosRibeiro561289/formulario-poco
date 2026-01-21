let step = 0;
const steps = document.querySelectorAll(".step");
const progressBar = document.getElementById("progressBar");

function showStep() {
  steps.forEach((s, i) => s.classList.toggle("active", i === step));
  progressBar.style.width = (step / (steps.length - 1)) * 100 + "%";
}
function nextStep(){ if(step < steps.length-1) step++; showStep(); }
function prevStep(){ if(step > 0) step--; showStep(); }
showStep();

/* máscara 18,00 */
function aplicarMascara(inputs){
  inputs.forEach(i=>{
    i.addEventListener("input",()=>{
      let v=i.value.replace(/\D/g,"");
      if(!v){i.value="";return;}
      i.value=(parseInt(v)/100).toFixed(2).replace(".",",");
    });
  });
}
aplicarMascara(document.querySelectorAll(".decimal"));
const num=v=>parseFloat(v.replace(",","."))||0;

/* validações */
function validarPerf(){
  if(!empresa.value||!encarregado.value){
    alert("Preencha empresa e encarregado");
    return;
  }
  nextStep();
}

function validarPoco(){
  if(!profundidade.value||!diamInicial.value||!diamFinal.value){
    alert("Dados do poço obrigatórios");
    return;
  }
  nextStep();
}

/* sanitário */
function controleSanitario(){
  sanitarioBox.classList.toggle("hidden",temSanitario.value!=="sim");
}

/* revestimento */
function controleRevestimento(){
  filtrosBox.classList.add("hidden");
  parcialBox.classList.add("hidden");
  if(tipoRev.value==="total") filtrosBox.classList.remove("hidden");
  if(tipoRev.value==="parcial") parcialBox.classList.remove("hidden");
}

function addFiltro(){
  const d=document.createElement("div");
  d.className="filtro-item";
  d.innerHTML=`
    <input class="decimal inicio" placeholder="Início (m)">
    <input class="decimal fim" placeholder="Fim (m)">
    <button type="button" class="btn-remove" onclick="this.parentElement.remove()">🗑</button>
    <small class="erro"></small>
  `;
  listaFiltros.appendChild(d);
  aplicarMascara(d.querySelectorAll(".decimal"));
}

function validarRevestimento(){
  if(tipoRev.value==="total" && !listaFiltros.children.length){
    alert("Informe ao menos um filtro");
    return;
  }
  nextStep();
}

/* hidráulica */
function validarHidraulica(){
  if(num(vazaoBomba.value)>num(vazaoPoco.value)){
    alert("Vazão da bomba maior que a do poço");
    return;
  }
  if(num(posBomba.value)>=num(profundidade.value)||num(posBomba.value)<=num(nd.value)){
    alert("Posição da bomba inválida");
    return;
  }
  nextStep();
}

/* resumo */
function gerarResumo(){
  resumo.innerHTML=`
    <h2>Resumo do Poço</h2>
    <p><b>Cliente:</b> ${cliente.value}</p>
    <p><b>Endereço:</b> ${endereco.value} - ${cidade.value}/${estado.value}</p>

    <h3>Perfuração</h3>
    <p>${empresa.value} – ${metodo.value}</p>

    <h3>Poço</h3>
    <p>Profundidade: ${profundidade.value} m</p>
    <p>Diâmetros: ${diamInicial.value}" → ${diamFinal.value}"</p>

    <h3>Hidráulica</h3>
    <p>NE: ${ne.value} | ND: ${nd.value}</p>
    <p>Bomba: ${posBomba.value} m</p>
    <p>Vazão Poço: ${vazaoPoco.value} | Bomba: ${vazaoBomba.value}</p>

    <button onclick="step=0;showStep()">Editar</button>
    <button onclick="location.reload()">Novo Poço</button>
  `;
  step=steps.length-1;
  showStep();
}
