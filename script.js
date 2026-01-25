let modo = "novo";
let step = 0;

const cliente = document.getElementById("cliente");
const documento = document.getElementById("documento");
const endereco = document.getElementById("endereco");
const cidade = document.getElementById("cidade");
const estado = document.getElementById("estado");

const polInicial = document.getElementById("polInicial");let modo = "novo";
let step = 0;

/* ================== ELEMENTOS ================== */
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

const vazaoPoco = document.getElementById("vazaoPoco");
const vazaoBomba = document.getElementById("vazaoBomba");
const posBomba = document.getElementById("posBomba");
const ne = document.getElementById("ne");
const nd = document.getElementById("nd");

const listaFiltros = document.getElementById("listaFiltros");
const resumoConteudo = document.getElementById("resumoConteudo");

const steps = document.querySelectorAll(".step");
const progressBar = document.getElementById("progressBar");

/* ================== UTIL ================== */
function n(v) {
  if (!v) return 0;
  return parseFloat(v.toString().replace(",", ".")) || 0;
}

function f(v) {
  return n(v).toFixed(2).replace(".", ",");
}

/* ================== FORMATAÇÃO ================== */
[
  polInicial, polFinal, sanitarioPol,
  profundidade, sanitarioComp,
  vazaoPoco, vazaoBomba, posBomba,
  ne, nd
].forEach(el => {
  if (el) {
    el.addEventListener("blur", () => {
      if (el.value) el.value = f(el.value);
    });
  }
});

/* ================== STEPS ================== */
function showStep() {
  steps.forEach((s, i) => s.classList.toggle("active", i === step));
  progressBar.style.width = (step / (steps.length - 1)) * 100 + "%";

  if (step === 2) atualizarEstadoPerfuracao();
  if (step === steps.length - 1) gerarResumoFinal();
}

function nextStep() {
  if (step < steps.length - 1) step++;
  showStep();
}

function prevStep() {
  if (step > 0) step--;
  showStep();
}

/* ================== PERFURAÇÃO ================== */
function atualizarEstadoPerfuracao() {
  const pi = n(polInicial.value);
  const pf = n(polFinal.value);

  metrosInicial.value = "";
  metrosInicial.disabled = true;

  if (!pi || !pf) return;

  if (pf > pi) {
    alert("Polegada final não pode ser maior que a inicial");
    polFinal.value = "";
    return;
  }

  if (pi === pf) {
    metrosInicial.value = "0,00";
  } else {
    metrosInicial.disabled = false;
  }
}

polInicial.addEventListener("input", atualizarEstadoPerfuracao);
polFinal.addEventListener("input", atualizarEstadoPerfuracao);

/* ================== SANITÁRIO ================== */
function toggleSanitario() {
  sanitarioCampos.classList.toggle("hidden", temSanitario.value !== "sim");

  if (n(sanitarioPol.value) > n(polInicial.value)) {
    alert("Sanitário não pode ser maior que a perfuração inicial");
    sanitarioPol.value = "";
  }
}

/* ================== FILTROS ================== */
function addFiltro() {
  const div = document.createElement("div");
  div.className = "filtro";

  div.innerHTML = `
<div class="filtro-header">
  <span class="filtro-numero"></span>
  <button type="button" class="btn-remover"
    onclick="this.closest('.filtro').remove(); atualizarNumeracaoFiltros(); atualizarTotalFiltros();">
    Remover
  </button>
</div>

<div class="linha-filtro">
  <div>
    <label>De (m)</label>
    <input class="de" onblur="this.value=f(this.value)" oninput="atualizarTotalFiltros()">
  </div>
  <div>
    <label>Até (m)</label>
    <input class="ate" onblur="this.value=f(this.value)" oninput="atualizarTotalFiltros()">
  </div>
</div>
`;

  listaFiltros.appendChild(div);
  atualizarNumeracaoFiltros();
  atualizarTotalFiltros();
}

function atualizarNumeracaoFiltros() {
  document.querySelectorAll(".filtro").forEach((filtro, i) => {
    filtro.querySelector(".filtro-numero").textContent = `Filtro ${i + 1}`;
  });
}

function atualizarTotalFiltros() {
  let total = 0;

  document.querySelectorAll(".filtro").forEach(f => {
    const de = n(f.querySelector(".de").value);
    const ate = n(f.querySelector(".ate").value);
    if (ate > de) total += (ate - de);
  });

  const el = document.getElementById("totalFiltros");
  if (el) el.textContent = `Total filtrado: ${total.toFixed(2)} m`;
}

/* ================== LISOS ================== */
function gerarTrechosLisos() {
  const prof = n(profundidade.value);
  const filtros = [];

  document.querySelectorAll(".filtro").forEach(f => {
    filtros.push({
      de: n(f.querySelector(".de").value),
      ate: n(f.querySelector(".ate").value)
    });
  });

  filtros.sort((a, b) => a.de - b.de);

  const lisos = [];
  let inicio = 0;

  filtros.forEach(f => {
    if (f.de > inicio) lisos.push({ de: inicio, ate: f.de });
    inicio = f.ate;
  });

  if (inicio < prof) lisos.push({ de: inicio, ate: prof });

  return lisos;
}

/* ================== RESUMO ================== */
function gerarResumoFinal() {
  let html = `
PERFIL TÉCNICO DO POÇO

DADOS CLIENTE
Cliente: ${cliente.value}
CNPJ/CPF: ${documento.value}
Endereço: ${endereco.value}
Cidade/UF: ${cidade.value} - ${estado.value}

PERFURAÇÃO
Ø Inicial: ${f(polInicial.value)} (0 – ${f(metrosInicial.value)} m)
Ø Final Contínua: ${f(polFinal.value)} (${f(metrosInicial.value)} – ${f(profundidade.value)} m)
Profundidade: ${f(profundidade.value)} m

FILTROS
`;

  let totalFiltros = 0;

  document.querySelectorAll(".filtro").forEach((filtro, i) => {
    const de = n(filtro.querySelector(".de").value);
    const ate = n(filtro.querySelector(".ate").value);
    totalFiltros += Math.max(0, ate - de);
    html += `Filtro ${i + 1}: ${f(de)} – ${f(ate)} m\n`;
  });

  html += `\nTotal filtrado: ${totalFiltros.toFixed(2)} m\n\nTRECHOS LISOS\n`;

  gerarTrechosLisos().forEach((l, i) => {
    html += `Liso ${i + 1}: ${f(l.de)} – ${f(l.ate)} m\n`;
  });

  html += `
DADOS HIDRÁULICOS
Vazão do Poço: ${f(vazaoPoco.value)}
Vazão da Bomba: ${f(vazaoBomba.value)}
Posição da Bomba: ${f(posBomba.value)}
NE: ${f(ne.value)}
ND: ${f(nd.value)}
`;

  resumoConteudo.innerHTML = `<pre>${html}</pre>`;
}

/* ================== PDF ================== */
function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const texto = resumoConteudo.innerText;
  const linhas = pdf.splitTextToSize(texto, 180);

  pdf.setFont("courier");
  pdf.setFontSize(10);
  pdf.text(linhas, 10, 10);
  pdf.save("perfil-tecnico-poco.pdf");
}

function enviarWhatsApp() {
  // 1️⃣ gera e baixa o PDF
  exportarPDF();

  // 2️⃣ monta mensagem
  const mensagem = `
Perfil Técnico do Poço

${resumoConteudo.innerText}

(PDF em anexo)
  `.trim();

  const texto = encodeURIComponent(mensagem);

  // 3️⃣ abre WhatsApp
  window.open(`https://wa.me/?text=${texto}`, "_blank");
}

showStep();
const polFinal = document.getElementById("polFinal");
const metrosInicial = document.getElementById("metrosInicial");
const profundidade = document.getElementById("profundidade");

const temSanitario = document.getElementById("temSanitario");
const sanitarioCampos = document.getElementById("sanitarioCampos");
const sanitarioPol = document.getElementById("sanitarioPol");
const sanitarioComp = document.getElementById("sanitarioComp");
const tipoRevestimentoSanitario = document.getElementById("tipoRevestimentoSanitario");

const tipoRevestimento = document.getElementById("tipoRevestimento");
const classeRevestimento = document.getElementById("classeRevestimento");

const vazaoPoco = document.getElementById("vazaoPoco");
const vazaoBomba = document.getElementById("vazaoBomba");
const posBomba = document.getElementById("posBomba");
const ne = document.getElementById("ne");
const nd = document.getElementById("nd");

const listaFiltros = document.getElementById("listaFiltros");
const resumoConteudo = document.getElementById("resumoConteudo");

const steps = document.querySelectorAll(".step");
const progressBar = document.getElementById("progressBar");

/* ================= UTIL ================= */
function n(v) {
  if (v === "" || v === null || v === undefined) return 0;
  return parseFloat(v.toString().replace(",", ".")) || 0;
}

function f(v) {
  return n(v).toFixed(2).replace(".", ",");
}

function formatarDecimal(campo) {
  const valor = n(campo.value);
  if (!valor) {
    campo.value = "";
    return;
  }
  campo.value = valor.toFixed(2).replace(".", ",");
}

/* ================= ETAPAS ================= */
function showStep() {
  steps.forEach((s, i) => s.classList.toggle("active", i === step));
  progressBar.style.width = (step / (steps.length - 1)) * 100 + "%";

  if (step === 2) atualizarEstadoPerfuracao();
  if (step === steps.length - 1) gerarResumoFinal();
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

    if (step === 2) {
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

    // ✅ Sanitário não pode ser maior que a perfuração
    if (step === 3 && temSanitario.value === "sim") {
      const polPerf = n(polInicial.value);
      const polSan = n(sanitarioPol.value);

      if (!polSan) {
        alert("Informe a polegada do sanitário");
        return;
      }

      if (polSan > polPerf) {
        alert("A polegada do sanitário não pode ser maior que a perfuração inicial");
        return;
      }
    }

    if (step === 4 && !gerarPosicoesFiltros()) return;
  }

  nextStep();
}

/* ================= PERFURAÇÃO ================= */
function atualizarEstadoPerfuracao() {
  const pi = n(polInicial.value);
  const pf = n(polFinal.value);

  metrosInicial.value = "";
  metrosInicial.disabled = true;

  if (!pi || !pf) return;

  if (pf > pi) {
    alert("Polegada final não pode ser maior que a inicial");
    polFinal.value = "";
    return;
  }

  if (pi === pf) {
    metrosInicial.value = "0";
  } else {
    metrosInicial.disabled = false;
  }
}

polInicial.addEventListener("input", atualizarEstadoPerfuracao);
polFinal.addEventListener("input", atualizarEstadoPerfuracao);

/* ================= SANITÁRIO ================= */
function toggleSanitario() {
  sanitarioCampos.classList.toggle("hidden", temSanitario.value !== "sim");
}

/* ================= FILTROS ================= */
function addFiltro() {
  const div = document.createElement("div");
  div.className = "filtro";

  div.innerHTML = `
<div class="filtro-header">
  <span class="filtro-numero"></span>
  <button type="button" class="btn-remover"
    onclick="this.closest('.filtro').remove(); atualizarNumeracaoFiltros(); atualizarTotalFiltros();">
    Remover
  </button>
</div>

<div class="linha-filtro">
  <div>
    <label>De (m)</label>
    <input class="de" oninput="atualizarTotalFiltros()" onblur="formatarDecimal(this)">
  </div>

  <div>
    <label>Até (m)</label>
    <input class="ate" oninput="atualizarTotalFiltros()" onblur="formatarDecimal(this)">
  </div>
</div>
`;

  listaFiltros.appendChild(div);
  atualizarNumeracaoFiltros();
  atualizarTotalFiltros();
}

function atualizarNumeracaoFiltros() {
  document.querySelectorAll(".filtro").forEach((f, i) => {
    const nEl = f.querySelector(".filtro-numero");
    if (nEl) nEl.textContent = `Filtro ${i + 1}`;
  });
}

function atualizarTotalFiltros() {
  let total = 0;

  document.querySelectorAll(".filtro").forEach(f => {
    const de = n(f.querySelector(".de")?.value);
    const ate = n(f.querySelector(".ate")?.value);
    if (ate > de) total += Math.max(0, ate - de);
  });

  const el = document.getElementById("totalFiltros");
  if (el) el.textContent = `Total filtrado: ${f(total)} m`;
}

function gerarPosicoesFiltros() {
  const prof = n(profundidade.value);
  const filtros = [];

  for (const fEl of document.querySelectorAll(".filtro")) {
    const de = n(fEl.querySelector(".de").value);
    const ate = n(fEl.querySelector(".ate").value);

    if (!de || !ate || de >= ate) {
      alert("Filtro inválido");
      return false;
    }

    if (ate > prof) {
      alert("Filtro ultrapassa a profundidade");
      return false;
    }

    filtros.push({ de, ate });
  }

  filtros.sort((a, b) => a.de - b.de);

  for (let i = 1; i < filtros.length; i++) {
    if (filtros[i].de < filtros[i - 1].ate) {
      alert("Sobreposição de filtros");
      return false;
    }
  }

  return true;
}

/* ================= RESUMO ================= */
function gerarResumoFinal() {
  let html = `
<strong>PERFIL TÉCNICO DO POÇO</strong>

<strong>DADOS CLIENTE</strong>
Cliente: ${cliente.value}
CNPJ/CPF: ${documento.value}
Endereço: ${endereco.value}
Cidade/UF: ${cidade.value} - ${estado.value}

<strong>PERFURAÇÃO</strong>
Ø Inicial: ${f(polInicial.value)} (0 – ${f(metrosInicial.value)} m)
Ø Final Contínua: ${f(polFinal.value)} (${f(metrosInicial.value)} – ${f(profundidade.value)} m)
Profundidade: ${f(profundidade.value)} m

<strong>PROTEÇÃO SANITÁRIA</strong>
`;

  if (temSanitario.value === "sim") {
    html += `
Ø Inicial: ${f(sanitarioPol.value)} (0 – ${f(sanitarioComp.value)} m)
Tipo de Revestimento: ${tipoRevestimentoSanitario.value}
`;
  } else {
    html += `Não possui sanitário\n`;
  }

  html += `
<strong>REVESTIMENTO FILTROS</strong>
Tipo: ${tipoRevestimento.value}
Classe: ${classeRevestimento.value}

<strong>FILTROS</strong>
`;

  let totalFiltros = 0;

  document.querySelectorAll(".filtro").forEach((fEl, i) => {
    const de = n(fEl.querySelector(".de").value);
    const ate = n(fEl.querySelector(".ate").value);

    totalFiltros += Math.max(0, ate - de);
    html += `Filtro ${i + 1}: ${f(de)} – ${f(ate)} m\n`;
  });

  html += `
Total filtrado: ${f(totalFiltros)} m

<strong>DADOS HIDRÁULICOS</strong>
Vazão do Poço: ${vazaoPoco.value}
Vazão da Bomba: ${vazaoBomba.value}
Posição da Bomba: ${posBomba.value}
NE: ${ne.value}
ND: ${nd.value}
`;

  resumoConteudo.innerHTML = `<pre>${html}</pre>`;
}

/* ================= AÇÕES ================= */
function novoFormulario() {
  if (!confirm("Deseja iniciar um novo cadastro?")) return;

  modo = "novo";
  step = 0;

  document.querySelectorAll("input, select").forEach(e => {
    e.value = "";
    e.disabled = false;
  });

  document.querySelectorAll(".filtro").forEach(f => f.remove());

  showStep();
}

function editarFormulario() {
  modo = "editar";
  step = 0;
  showStep();
}

/* ================= FORMATAÇÃO BLUR ================= */
polInicial.addEventListener("blur", () => formatarDecimal(polInicial));
polFinal.addEventListener("blur", () => formatarDecimal(polFinal));
sanitarioPol.addEventListener("blur", () => formatarDecimal(sanitarioPol));
profundidade.addEventListener("blur", () => formatarDecimal(profundidade));

showStep();
