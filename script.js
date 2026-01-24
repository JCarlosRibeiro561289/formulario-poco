/* =========================
   UTIL
========================= */

function n(v) {
  if (!v) return 0;
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


  /* só valida qtd inicial se for poço escalonado */
  if (pi !== pf && mi <= 0) {
    alert("Informe a quantidade inicial em metros");
    return;
  }


  if (pi !== pf && mi > prof) {
    alert("Qtd inicial maior que profundidade total");
    return;
  }
}

  /* ETAPA 4 – FILTROS */
  if (step === 3) {
    gerarPosicoesFiltros(); // valida tudo
  }

  /* ÚLTIMA ETAPA → RESUMO */
  if (step === steps.length - 2) {
    gerarResumoFinal();
  }

  nextStep();
}

showStep();

/* =========================
PERFURAÇÃO – CONTROLE DE POLEGADAS
========================= */


polInicial.onblur = polFinal.onblur = () => {
if (!polInicial.value || !polFinal.value) return;


const pi = n(polInicial.value);
const pf = n(polFinal.value);


if (pf > pi) {
alert("Polegada final não pode ser maior que a inicial");
polFinal.value = "";
metrosInicial.value = "";
metrosInicial.disabled = true;
return;
}


/* polegadas iguais → poço reto */
if (pi === pf) {
metrosInicial.value = "";
metrosInicial.disabled = true;
}
/* polegadas diferentes → escalonado */
else {
metrosInicial.disabled = false;
}
};
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
   RESUMO FINAL
========================= */

function gerarResumoFinal() {
  let txt = `
=== CADASTRO TÉCNICO DE POÇO ===

CLIENTE
${cliente.value}

PERFURAÇÃO
Ø Inicial: ${polInicial.value}
Ø Final: ${polFinal.value}
Qtd Inicial: ${metrosInicial.value}
Profundidade: ${profundidade.value} m

SANITÁRIO
${temSanitario.value === "sim"
    ? sanitarioPol.value + " / " + sanitarioComp.value + " m"
    : "Não possui"}

REVESTIMENTO
${tipoRevestimento.value} - ${classeRevestimento.value}

FILTROS
`;

  document.querySelectorAll(".filtro").forEach((f, i) => {
    txt += `Filtro ${i + 1}: ${f.querySelector(".de").value} - ${f.querySelector(".ate").value} m\n`;
  });

  txt += `
HIDRÁULICA
Vazão Poço: ${vazaoPoco.value}
Vazão Bomba: ${vazaoBomba.value}
Posição Bomba: ${posBomba.value}
NE: ${ne.value}
ND: ${nd.value}

GEOLOGIA
${geologia.value}

FRATURAS
${fraturas.value}

OBS
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
    "mailto:?subject=Cadastro de Poço&body=" +
    encodeURIComponent(window.__resumoTXT);
}
