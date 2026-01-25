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
  step++;
  showStep();
}

function prevStep() {
  step--;
  showStep();
}

function avancarEtapaAtual() {

// 🔐 validações só quando for NOVO
if (modo === "novo") {


/* ETAPA 1 */
if (step === 0 && !cliente.value.trim()) {
alert("Informe o cliente");
return;
}
  /* ETAPA 2 – PERFURAÇÃO */
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

    /* só valida qtd inicial se for escalonado */
    if (pi !== pf) {
      if (mi <= 0) {
        alert("Informe a quantidade inicial em metros");
        return;
      }
      if (mi > prof) {
        alert("Qtd inicial maior que profundidade total");
        return;
      }
    }
  }

  /* ETAPA 4 – FILTROS */
  if (step === 3) {
    gerarPosicoesFiltros();
  }

  /* ÚLTIMA ETAPA → RESUMO */
  if (step === steps.length - 2) {
    gerarResumoFinal();
  }

  nextStep();
}

showStep();

/* =========================
   PERFURAÇÃO – LÓGICA CENTRAL
========================= */

function sincronizarSanitarioComPerfuração() {
  const mi = n(metrosInicial.value);

  if (mi > 0) {
    sanitarioComp.value = mi;
  } else {
    sanitarioComp.value = "";
  }
}

function atualizarEstadoPerfuração() {
  const pi = n(polInicial.value);
  const pf = n(polFinal.value);

  if (!pi || !pf) return;

  if (pf > pi) {
    alert("Polegada final não pode ser maior que a inicial");
    polFinal.value = "";
    metrosInicial.value = "";
    metrosInicial.disabled = true;
    sanitarioComp.value = "";
    return;
  }

  /* poço reto */
  if (pi === pf) {
    metrosInicial.value = "0";
    metrosInicial.disabled = true;
    sanitarioComp.value = "";
  }
  /* poço escalonado */
  else {
    metrosInicial.disabled = false;
  }

  sincronizarSanitarioComPerfuração();
}

polInicial.addEventListener("input", atualizarEstadoPerfuração);
polFinal.addEventListener("input", atualizarEstadoPerfuração);
metrosInicial.addEventListener("input", sincronizarSanitarioComPerfuração);

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

  document.querySelectorAll(".filtro").forEach(f => {
    const de = n(f.querySelector(".de").value);
    const ate = n(f.querySelector(".ate").value);

    if (!de || !ate || de >= ate)
      throw alert("Filtro inválido (DE >= ATÉ)");

    if (ate > prof)
      throw alert("Filtro ultrapassa a profundidade do poço");

    filtros.push({ de, ate });
  });

  filtros.sort((a, b) => a.de - b.de);

  for (let i = 1; i < filtros.length; i++) {
    if (filtros[i].de < filtros[i - 1].ate) {
      throw alert("Sobreposição de filtros detectada");
    }
  }
}

/* =========================
   RESUMO FINAL (PADRÃO LAUDO)
========================= */
function gerarResumoFinal() {

  const pi = n(polInicial.value);
  const pf = n(polFinal.value);
  const prof = n(profundidade.value);
  const mi = n(metrosInicial.value);

  let txt = `
=== CADASTRO TÉCNICO DE POÇO ===

DADOS DO CLIENTE
Cliente: ${cliente.value}
Documento: ${documento.value}
Endereço: ${endereco.value}
Cidade/Estado: ${cidade.value} - ${estado.value}

--------------------------------

PERFURAÇÃO
`;

  if (pi === pf) {
    txt += `Ø Poço: ${pi}" (0 – ${prof} m)\n`;
  } else {
    txt += `Ø Inicial: ${pi}" (0 – ${mi} m)\n`;
    txt += `Ø Final: ${pf}" (${mi} – ${prof} m)\n`;
  }

  txt += `Profundidade Total: ${prof} m\n`;

  if (temSanitario.value === "sim") {
    txt += `
--------------------------------
SANITÁRIO
Ø: ${sanitarioPol.value}" (0 – ${sanitarioComp.value} m)
Tipo: ${tipoRevestimento.value}
`;
  }

  txt += `
--------------------------------
FILTROS E REVESTIMENTOS
`;

  let filtros = [];
  document.querySelectorAll(".filtro").forEach(f => {
    filtros.push({
      de: n(f.querySelector(".de").value),
      ate: n(f.querySelector(".ate").value)
    });
  });

  filtros.sort((a, b) => a.de - b.de);

  let atual = 0;
  filtros.forEach(f => {
    if (atual < f.de) {
      txt += `${atual} – ${f.de} m  LISOS\n`;
    }
    txt += `${f.de} – ${f.ate} m  FILTROS\n`;
    atual = f.ate;
  });

  if (atual < prof) {
    txt += `${atual} – ${prof} m  LISOS\n`;
  }

  txt += `
--------------------------------
DADOS HIDRÁULICOS
Vazão do Poço: ${vazaoPoco.value}
Vazão da Bomba: ${vazaoBomba.value}
Posição da Bomba: ${posBomba.value}
NE: ${ne.value}
ND: ${nd.value}

--------------------------------
GEOLOGIA
${geologia.value}

--------------------------------
FRATURAS
${fraturas.value}

--------------------------------
OBSERVAÇÕES
${observacoes.value}
`;

  resumoConteudo.innerHTML = `<pre>${txt}</pre>`;
  window.__resumoTXT = txt;
}
/* =========================
   DOWNLOAD / EMAIL
========================= */
function baixarResumo() {
  const blob = new Blob([window.__resumoTXT], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "cadastro_poco.txt";
  a.click();
}

function enviarEmail() {
  location.href =
    "mailto:?subject=Cadastro Técnico de Poço&body=" +
    encodeURIComponent(window.__resumoTXT);
}

function novoFormulario() {
if (!confirm("Deseja iniciar um novo cadastro? Os dados atuais serão apagados.")) {
return;
}


modo = "novo";


// limpa inputs
document.querySelectorAll("input, textarea, select").forEach(el => {
if (el.type !== "button" && el.type !== "submit") {
el.value = "";
el.disabled = false;
}
});


// remove filtros
document.querySelectorAll(".filtro").forEach(f => f.remove());


// limpa resumo
resumoConteudo.innerHTML = "";
window.__resumoTXT = "";


// volta para primeira etapa
step = 0;
mostrarStep(step);
}
