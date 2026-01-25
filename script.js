/* =========================
   ESTADO GLOBAL
========================= */
let modo = "novo";

/* =========================
   REFERÊNCIAS DOM
========================= */
const cliente = document.getElementById("cliente");
const documento = document.getElementById("documento");
const endereco = document.getElementById("endereco");
const cidade = document.getElementById("cidade");
const estado = document.getElementById("estado");

const polInicial = document.getElementById("polInicial");
const polFinal = document.getElementById("polFinal");
const metrosInicial = document.getElementById("metrosInicial");
const profundidade = document.getElementById("profundidade");

const temSanitario = document.getElementById("temSanitario");
const sanitarioCampos = document.getElementById("sanitarioCampos");
const sanitarioPol = document.getElementById("sanitarioPol");
const sanitarioComp = document.getElementById("sanitarioComp");

const listaFiltros = document.getElementById("listaFiltros");

const vazaoPoco = document.getElementById("vazaoPoco");
const vazaoBomba = document.getElementById("vazaoBomba");
const posBomba = document.getElementById("posBomba");
const ne = document.getElementById("ne");
const nd = document.getElementById("nd");

const resumoConteudo = document.getElementById("resumoConteudo");

/* =========================
   UTIL
========================= */
function n(v) {
  if (!v && v !== 0) return 0;
  return parseFloat(v.toString().replace(",", "."));
}

/* =========================
   CONTROLE DE ETAPAS
========================= */
const steps = document.querySelectorAll(".step");
let step = 0;

function showStep() {
  steps.forEach((s, i) => s.classList.toggle("active", i === step));
  document.getElementById("progressBar").style.width =
    (step / (steps.length - 1)) * 100 + "%";
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

function avancarEtapaAtual() {

  if (modo === "novo") {

    if (step === 0 && !cliente.value.trim()) {
      alert("Informe o cliente");
      return;
    }

    if (step === 1) {
      const pi = n(polInicial.value);
      const pf = n(polFinal.value);
      const prof = n(profundidade.value);
      const mi = n(metrosInicial.value);

      if (!pi || !pf || !prof) {
        alert("Preencha os dados de perfuração");
        return;
      }

      if (pf > pi) {
        alert("Polegada final não pode ser maior que a inicial");
        return;
      }

      if (pi !== pf && mi <= 0) {
        alert("Informe a quantidade inicial em metros");
        return;
      }
    }

    if (step === 3) {
      if (!gerarPosicoesFiltros()) return;
    }

    if (step === steps.length - 2) {
      gerarResumoFinal();
    }
  }

  nextStep();
}

showStep();

/* =========================
   SANITÁRIO
========================= */
function toggleSanitario() {
  sanitarioCampos.classList.toggle("hidden", temSanitario.value !== "sim");
}

/* =========================
   FILTROS
========================= */
function addFiltro() {
  const div = document.createElement("div");
  div.className = "filtro";
  div.innerHTML = `
    <label>De (m)</label>
    <input class="de">
    <label>Até (m)</label>
    <input class="ate">
    <button type="button" onclick="this.parentNode.remove()">Remover</button>
    <hr>
  `;
  listaFiltros.appendChild(div);
}

function gerarPosicoesFiltros() {
  const prof = n(profundidade.value);
  let filtros = [];

  for (const f of document.querySelectorAll(".filtro")) {
    const de = n(f.querySelector(".de").value);
    const ate = n(f.querySelector(".ate").value);

    if (!de || !ate || de >= ate) {
      alert("Filtro inválido (DE >= ATÉ)");
      return false;
    }

    if (ate > prof) {
      alert("Filtro ultrapassa a profundidade do poço");
      return false;
    }

    filtros.push({ de, ate });
  }

  filtros.sort((a, b) => a.de - b.de);

  for (let i = 1; i < filtros.length; i++) {
    if (filtros[i].de < filtros[i - 1].ate) {
      alert("Sobreposição de filtros detectada");
      return false;
    }
  }

  return true;
}

/* =========================
   RESUMO
========================= */
function gerarResumoFinal() {
  resumoConteudo.innerHTML = "<pre>Resumo gerado com sucesso.</pre>";
}

/* =========================
   AÇÕES
========================= */
function baixarResumo() {}
function enviarEmail() {}

function novoFormulario() {
  if (!confirm("Deseja iniciar um novo cadastro?")) return;
  modo = "novo";
  step = 0;
  document.querySelectorAll("input, select").forEach(e => e.value = "");
  document.querySelectorAll(".filtro").forEach(f => f.remove());
  showStep();
}

function editarFormulario() {
  modo = "editar";
  step = 0;
  showStep();
}
