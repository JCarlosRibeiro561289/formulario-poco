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
   VALIDAÇÕES
===================== */
function validarPerf() {
  if (empresa.value.trim() === "") {
    alert("Informe a empresa perfuradora");
    empresa.focus();
    return;
  }
  if (encarregado.value.trim() === "") {
    alert("Informe o encarregado");
    encarregado.focus();
    return;
  }
  nextStep();
}

function validarPoco() {
  if (!profundidade.value || !diamInicial.value || !diamFinal.value) {
    alert("Preencha profundidade e diâmetros");
    return;
  }
  nextStep();
}

function controleSanitario() {
  sanitarioBox.classList.toggle("hidden", temSanitario.value !== "sim");
}

function controleRevestimento() {
  parcialBox.classList.add("hidden");
  filtrosBox.classList.add("hidden");

  if (tipoRev.value === "parcial") {
    parcialBox.classList.remove("hidden");
  }
  if (tipoRev.value === "total") {
    filtrosBox.classList.remove("hidden");
  }
}

function validarRevestimento() {
  if (!tipoRev.value || !revMaterial.value || !revPol.value) {
    alert("Preencha os dados do revestimento");
    return;
  }
  nextStep();
}

function validarHidraulica() {
  if (
    vazaoPoco.value &&
    vazaoBomba.value &&
    parseFloat(vazaoBomba.value) > parseFloat(vazaoPoco.value)
  ) {
    alert("Vazão da bomba não pode ser maior que a vazão do poço");
    return;
  }

  if (
    posBomba.value &&
    profundidade.value &&
    parseFloat(posBomba.value) > parseFloat(profundidade.value)
  ) {
    alert("Posição da bomba não pode ser maior que a profundidade do poço");
    return;
  }

  if (
    nd.value &&
    posBomba.value &&
    parseFloat(posBomba.value) < parseFloat(nd.value)
  ) {
    alert("Bomba não pode estar acima do nível dinâmico");
    return;
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

/* =====================
   RESUMO
===================== */
function gerarResumo() {
  let filtrosHTML = "";
  document.querySelectorAll(".filtro-item").forEach((f, i) => {
    const ini = f.querySelector(".filtroIni").value;
    const fim = f.querySelector(".filtroFim").value;
    if (ini && fim) {
      filtrosHTML += `<li>Filtro ${i + 1}: ${ini} m até ${fim} m</li>`;
    }
  });

  resumo.innerHTML = `
    <h2>Resumo do Poço</h2>

    <h3>Cliente</h3>
    <p>${cliente.value}</p>
    <p>${documento.value}</p>
    <p>${endereco.value} - ${cidade.value}/${estado.value}</p>

    <h3>Perfuração</h3>
    <p>${empresa.value} – ${metodo.value}</p>
    <p>Encarregado: ${encarregado.value}</p>

    <h3>Poço</h3>
    <p>Profundidade: ${profundidade.value} m</p>
    <p>Diâmetro: ${diamInicial.value}" → ${diamFinal.value}"</p>

    <h3>Sanitário</h3>
    <p>${temSanitario.value === "sim"
      ? `${sanitarioMaterial.value} ${sanitarioPol.value}" (${sanitarioComp.value} m)`
      : "Não possui"
    }</p>

    <h3>Revestimento</h3>
    <p>${tipoRev.value} – ${revMaterial.value} – ${revPol.value}"</p>
    <p>Pré-filtro: ${prefiltro.value}</p>
    ${filtrosHTML ? `<ul>${filtrosHTML}</ul>` : ""}

    <h3>Hidráulica</h3>
    <p>NE: ${ne.value} | ND: ${nd.value}</p>
    <p>Bomba: ${posBomba.value} m</p>
    <p>Vazão Poço: ${vazaoPoco.value}</p>
    <p>Vazão Bomba: ${vazaoBomba.value}</p>

    <h3>Geologia</h3>
    <p>${geologia.value}</p>
    <p>${fraturas.value}</p>

    <h3>Observações</h3>
    <p>${observacao.value}</p>

    <button type="button" onclick="prevStep()">Editar</button>
    <button type="button" onclick="enviar()">Enviar</button>
  `;
  nextStep();
}

/* =====================
   PDF + EMAIL
===================== */
async function enviar() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  let y = 10;
  pdf.setFontSize(10);

  function linha(t, v) {
    pdf.text(t, 10, y);
    y += 5;
    pdf.text(v || "-", 10, y);
    y += 7;
  }

  pdf.setFontSize(14);
  pdf.text("RELATÓRIO TÉCNICO DE POÇO", 10, y);
  y += 10;
  pdf.setFontSize(10);

  linha("Cliente", cliente.value);
  linha("Empresa", empresa.value);
  linha("Profundidade", profundidade.value + " m");
  linha("Vazão do Poço", vazaoPoco.value);
  linha("Vazão da Bomba", vazaoBomba.value);
  linha("Observações", observacao.value);

  const pdfBase64 = pdf.output("datauristring");

  emailjs.send("SERVICE_ID", "TEMPLATE_ID", {
    cliente: cliente.value,
    empresa: empresa.value,
    profundidade: profundidade.value,
    pdf: pdfBase64
  }).then(() => {
    alert("Poço enviado com sucesso!");
    location.reload();
  }).catch(() => {
    alert("Erro ao enviar e-mail");
  });
}
