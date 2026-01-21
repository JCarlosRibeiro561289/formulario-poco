let step = 0;
const steps = document.querySelectorAll(".step");
const progressBar = document.getElementById("progressBar");

const temSanitario = document.getElementById("temSanitario");
const sanitarioCampos = document.getElementById("sanitarioCampos");
const tipoRevPoco = document.getElementById("tipoRevPoco");
const filtrosArea = document.getElementById("filtrosArea");
const listaFiltros = document.getElementById("listaFiltros");
const listaFiltrosPoco = document.getElementById("listaFiltrosPoco");
const resumo = document.getElementById("resumo");

function showStep() {
  steps.forEach((s, i) => s.classList.toggle("active", i === step));
  progressBar.style.width = (step / (steps.length - 1)) * 100 + "%";
}
function nextStep() { if (step < steps.length - 1) step++; showStep(); }
function prevStep() { if (step > 0) step--; showStep(); }
showStep();

/* Sanitário */
function toggleSanitario() {
  const isSan = temSanitario.value === "sim";
  sanitarioCampos.classList.toggle("hidden", !isSan);

  if (isSan) {
    if (tipoRevPoco.querySelector('option[value="parcial"]')) {
      tipoRevPoco.querySelector('option[value="parcial"]').disabled = true;
      if (tipoRevPoco.value === "parcial") tipoRevPoco.value = "";
    }
    filtrosArea.classList.add("hidden");
    listaFiltros.innerHTML = "";
  } else {
    if (tipoRevPoco.querySelector('option[value="parcial"]')) {
      tipoRevPoco.querySelector('option[value="parcial"]').disabled = false;
    }
  }
}

/* Revestimento */
function controlarFluxoRevestimento() {
  if (temSanitario.value === "sim") {
    tipoRevPoco.value = "total";
    filtrosArea.classList.add("hidden");
    listaFiltrosPoco.innerHTML = "";
    return;
  }
  if (tipoRevPoco.value === "total") {
    filtrosArea.classList.remove("hidden");
  } else {
    filtrosArea.classList.add("hidden");
    listaFiltrosPoco.innerHTML = "";
  }
}

function addFiltro(tipo) {
  const div = document.createElement("div");
  div.className = "filtroItem";
  div.innerHTML = `
    <input type="number" placeholder="Início (m)">
    <input type="number" placeholder="Fim (m)">
    <button type="button" onclick="this.parentElement.remove()">Remover</button>
  `;
  if (tipo === 'sanitario') listaFiltros.appendChild(div);
  else listaFiltrosPoco.appendChild(div);
}

/* Hidráulica */
function validarHidraulica() {
  const vp = +vazaoPoco.value;
  const vb = +vazaoBomba.value;
  const bomba = +posBomba.value;
  const ndv = +nd.value;
  const prof = +profundidade.value;

  if (vb > vp) { alert("A vazão da bomba não pode ser maior que a vazão do poço."); return; }
  if (bomba > prof) { alert("A posição da bomba não pode ser maior que a profundidade."); return; }
  if (bomba <= ndv) { alert("A bomba deve estar abaixo do nível dinâmico (ND)."); return; }

  nextStep();
}

/* Resumo */
function gerarResumo() {
  function pegarFiltros(container) {
    const arr = [];
    container.querySelectorAll(".filtroItem").forEach(d => {
      const i = d.children[0].value;
      const f = d.children[1].value;
      if(i && f) arr.push(`${i}m → ${f}m`);
    });
    return arr;
  }

  const filtrosSan = pegarFiltros(listaFiltros);
  const filtrosPoco = pegarFiltros(listaFiltrosPoco);

  let revestimentoDesc = "";
  if (temSanitario.value === "sim") {
    revestimentoDesc = `Sanitário (parcial) – ${sanitarioTipo.value} – ${sanitarioPol.value}" – ${sanitarioComp.value}m`;
    if(filtrosSan.length) revestimentoDesc += ` | Filtros: ${filtrosSan.join(", ")}`;
  } else if (tipoRevPoco.value) {
    revestimentoDesc = `${tipoRevPoco.value.charAt(0).toUpperCase()+tipoRevPoco.value.slice(1)} – ${materialRev.value} – ${polRev.value}"`;
    if(filtrosPoco.length) revestimentoDesc += ` | Filtros: ${filtrosPoco.join(", ")}`;
  }

  resumo.innerHTML = `
    <h2>Resumo do Poço</h2>

    <h3>Cliente</h3>
    <p>Nome: ${cliente.value}<br>Documento: ${documento.value}<br>Endereço: ${endereco.value}</p>

    <h3>Perfuração</h3>
    <p>Empresa: ${empresa.value}<br>Encarregado: ${encarregado.value}<br>Data Início: ${dataInicio.value}<br>Data Fim: ${dataFim.value}<br>Método: ${metodo.value}</p>

    <h3>Poço</h3>
    <p>Profundidade: ${profundidade.value} m<br>Polegada Final: ${polFinal.value}</p>

    <h3>Revestimento</h3>
    <p>${revestimentoDesc || 'Não informado'}</p>

    <h3>Hidráulica</h3>
    <p>Vazão do Poço: ${vazaoPoco.value} m³/h<br>Vazão da Bomba: ${vazaoBomba.value} m³/h<br>Posição da Bomba: ${posBomba.value} m<br>NE: ${ne.value} m | ND: ${nd.value} m</p>

    <h3>Geologia</h3>
    <p>${geologia.value}</p>

    <h3>Fraturas</h3>
    <p>${fraturas.value}</p>

    <button onclick="step=0;showStep()">Editar Tudo</button>
    <button onclick="enviarEmail()">Enviar por Email</button>
    <button onclick="baixarResumo()">Baixar Resumo</button>
  `;
  step = steps.length - 1;
  showStep();
}

/* Envio Email */
function enviarEmail() {
  emailjs.send("SEU_SERVICE_ID", "SEU_TEMPLATE_ID", { cliente: cliente.value, resumo: resumo.innerText })
    .then(()=>alert("Poço enviado com sucesso!"))
    .catch(err=>alert("Erro ao enviar: "+err));
}

/* Baixar Resumo */
function baixarResumo() {
  const blob = new Blob([resumo.innerText], {type: "text/plain"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `resumo_poco.txt`;
  link.click();
}
