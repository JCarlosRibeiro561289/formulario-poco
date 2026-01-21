/* =====================
   VARIÁVEIS GERAIS
===================== */
const steps = document.querySelectorAll(".step");
let step = 0;

const cliente = document.getElementById("cliente");
const documento = document.getElementById("documento");
const endereco = document.getElementById("endereco");
const cidade = document.getElementById("cidade");
const estado = document.getElementById("estado");

const empresa = document.getElementById("empresa");
const encarregado = document.getElementById("encarregado");
const metodo = document.getElementById("metodo");

const profundidade = document.getElementById("profundidade");
const diamInicial = document.getElementById("diamInicial");
const diamFinal = document.getElementById("diamFinal");

const temSanitario = document.getElementById("temSanitario");
const sanitarioBox = document.getElementById("sanitarioBox");
const sanitarioMaterial = document.getElementById("sanitarioMaterial");
const sanitarioTipo = document.getElementById("sanitarioTipo");
const sanitarioPol = document.getElementById("sanitarioPol");
const sanitarioComp = document.getElementById("sanitarioComp");

const tipoRev = document.getElementById("tipoRev");
const revMaterial = document.getElementById("revMaterial");
const revTipo = document.getElementById("revTipo");
const revPol = document.getElementById("revPol");
const revComp = document.getElementById("revComp");
const parcialBox = document.getElementById("parcialBox");
const filtrosBox = document.getElementById("filtrosBox");
const listaFiltros = document.getElementById("listaFiltros");
const prefiltro = document.getElementById("prefiltro");

const ne = document.getElementById("ne");
const nd = document.getElementById("nd");
const posBomba = document.getElementById("posBomba");
const vazaoPoco = document.getElementById("vazaoPoco");
const vazaoBomba = document.getElementById("vazaoBomba");

const geologia = document.getElementById("geologia");
const fraturas = document.getElementById("fraturas");
const observacao = document.getElementById("observacao");

const resumo = document.getElementById("resumo");

/* =====================
   CONTROLE DE ETAPAS
===================== */
function showStep() {
  steps.forEach((s, i) => s.classList.toggle("active", i === step));
}
showStep();

function nextStep() {
  if (step < steps.length - 1) {
    step++;
    showStep();
  }
}
function prevStep() {
  if (step > 0) {
    step--;
    showStep();
  }
}

/* =====================
   UTIL
===================== */
function num(v) {
  return parseFloat((v || "").replace(",", "."));
}

/* =====================
   ETAPA 1 - CLIENTE
===================== */
function validarCliente() {
  if (!cliente.value.trim()) {
    alert("Informe o cliente");
    cliente.focus();
    return;
  }
  nextStep();
}

/* =====================
   ETAPA 2 - PERFURAÇÃO
===================== */
function validarPerf() {
  if (!empresa.value.trim()) {
    alert("Informe a empresa perfuradora");
    empresa.focus();
    return;
  }
  if (!encarregado.value.trim()) {
    alert("Informe o encarregado");
    encarregado.focus();
    return;
  }
  nextStep();
}

/* =====================
   ETAPA 3 - POÇO
===================== */
function validarPoco() {
  if (!profundidade.value || !diamInicial.value || !diamFinal.value) {
    alert("Preencha profundidade e diâmetros");
    return;
  }
  nextStep();
}

/* =====================
   SANITÁRIO
===================== */
function controleSanitario() {
  sanitarioBox.classList.toggle("hidden", temSanitario.value !== "sim");
}

/* =====================
   REVESTIMENTO
===================== */
function controleRevestimento() {
  parcialBox.classList.add("hidden");
  filtrosBox.classList.add("hidden");

  if (tipoRev.value === "parcial") parcialBox.classList.remove("hidden");
  if (tipoRev.value === "total") filtrosBox.classList.remove("hidden");
}

function validarRevestimento() {
  if (!tipoRev.value || !revMaterial.value || !revPol.value) {
    alert("Preencha os dados do revestimento");
    return;
  }

  if (tipoRev.value === "total") {
    if (listaFiltros.children.length === 0) {
      alert("Revestimento total exige filtros");
      return;
    }
    if (!validarFiltros()) return;
  }

  nextStep();
}

/* =====================
   FILTROS
===================== */
function addFiltro() {
  const div = document.createElement("div");
  div.className = "filtro-item";
  div.innerHTML = `
    <input class="decimal filtroIni" placeholder="Início (m)">
    <input class="decimal filtroFim" placeholder="Fim (m)">
    <button type="button" onclick="this.parentElement.remove()">✕</button>
  `;
  listaFiltros.appendChild(div);
}

function validarFiltros() {
  const filtros = [];

  document.querySelectorAll(".filtro-item").forEach(f => {
    const ini = num(f.querySelector(".filtroIni").value);
    const fim = num(f.querySelector(".filtroFim").value);

    if (!ini || !fim || ini >= fim) {
      alert("Filtro com intervalo inválido");
      throw new Error();
    }
    filtros.push({ ini, fim });
  });

  filtros.sort((a, b) => a.ini - b.ini);

  for (let i = 1; i < filtros.length; i++) {
    if (filtros[i].ini <= filtros[i - 1].fim) {
      alert("Filtros com sobreposição");
      return false;
    }
  }
  return true;
}

/* =====================
   HIDRÁULICA
===================== */
function validarHidraulica() {
  if (num(vazaoBomba.value) > num(vazaoPoco.value)) {
    alert("Vazão da bomba maior que a do poço");
    return;
  }
  if (num(posBomba.value) > num(profundidade.value)) {
    alert("Bomba mais profunda que o poço");
    return;
  }
  if (num(posBomba.value) < num(nd.value)) {
    alert("Bomba acima do nível dinâmico");
    return;
  }
  nextStep();
}

/* =====================
   RESUMO
===================== */
function gerarResumo() {
  let filtrosHTML = "";
  document.querySelectorAll(".filtro-item").forEach((f, i) => {
    filtrosHTML += `<li>Filtro ${i + 1}: ${f.querySelector(".filtroIni").value} – ${f.querySelector(".filtroFim").value} m</li>`;
  });

  resumo.innerHTML = `
    <h2>Resumo do Poço</h2>
    <p><strong>Cliente:</strong> ${cliente.value}</p>
    <p><strong>Endereço:</strong> ${endereco.value} - ${cidade.value}/${estado.value}</p>

    <h3>Perfuração</h3>
    <p>${empresa.value} – ${metodo.value}</p>

    <h3>Poço</h3>
    <p>Profundidade: ${profundidade.value} m</p>
    <p>Diâmetro: ${diamInicial.value}" → ${diamFinal.value}"</p>

    <h3>Revestimento</h3>
    <p>${tipoRev.value} – ${revMaterial.value} – ${revPol.value}"</p>
    ${filtrosHTML ? `<ul>${filtrosHTML}</ul>` : ""}

    <h3>Hidráulica</h3>
    <p>NE: ${ne.value} | ND: ${nd.value}</p>
    <p>Bomba: ${posBomba.value} m</p>

    <h3>Observações</h3>
    <p>${observacao.value}</p>

    <button onclick="prevStep()">Editar</button>
    <button onclick="enviar()">Enviar</button>
  `;
  nextStep();
}
