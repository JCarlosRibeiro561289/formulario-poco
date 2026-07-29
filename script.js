let modo = "novo";
let step = 0;

/* =================== ELEMENTOS ================== */
const cliente = document.getElementById("cliente");
const documento = document.getElementById("documento");
const endereco = document.getElementById("endereco");
const cidade = document.getElementById("cidade");
const estado = document.getElementById("estado");

const encarregadoPerfuracao = document.getElementById("encarregadoPerfuracao");
const empresaPerfuracao = document.getElementById("empresaPerfuracao");
const dataInicio = document.getElementById("dataInicio");
const dataFim = document.getElementById("dataFim");

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
const tipoRevestimentoSanitario = document.getElementById("tipoRevestimentoSanitario");
const tipoRevestimento = document.getElementById("tipoRevestimento");
const classeRevestimento = document.getElementById("classeRevestimento");

const listaCamadasGeologia = document.getElementById("listaCamadasGeologia");
const profundidadeGeologia = document.getElementById("profundidadeGeologia");
const btnAvancarGeologia = document.querySelectorAll(".step")[6]?.querySelector("button[onclick='avancarEtapaAtual()']");
const fraturas = document.getElementById("fraturas");
const observacoes = document.getElementById("observacoes");

const cnpjsEmpresaPerfuradora = {
  "ALBUSERV": "33.765.202/0001-83",
  "CRISTAL POÇOS LTDA": "48.550.641/0001-46"
};

const descricoesPorGrupoGeologia = {
  "Sedimentos / Solos": ["Cascalho", "Areia", "Silte", "Argila"],
  "Rocha Sedimentar": ["Arenito", "Folhelho Cinza", "Calcario", "Argilito"],
  "Rocha Cristalina": ["Granito", "Gnaisse", "Basalto", "Quartzo"]
};

/* ================== UTIL ================== */
function n(v) {
  if (!v) return 0;
  return parseFloat(v.toString().replace(",", ".")) || 0;
}

function f(v) {
  return n(v).toFixed(2).replace(".", ",");
}

function textoOuNaoInformado(v) {
  return v?.trim() || "Não informado";
}

function formatarData(v) {
  if (!v) return "Não informado";
  const [ano, mes, dia] = v.split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : v;
}

function textoTuboRevestimento() {
  return `${textoOuNaoInformado(tipoRevestimento.value)} ${textoOuNaoInformado(classeRevestimento.value)}`.trim();
}

function textoPolegadaRevestimento() {
  return `${f(polFinal.value)}"`;
}

function cnpjEmpresaPerfuradora() {
  return cnpjsEmpresaPerfuradora[empresaPerfuracao.value] || "Não informado";
}

function gerarTextoSanitario() {
  if (temSanitario.value !== "sim") return "";

  return `
SANITÁRIO
Tipo do Tubo Sanitário: ${textoOuNaoInformado(tipoRevestimentoSanitario.value)}
Polegada Sanitário: ${f(sanitarioPol.value)}"
Comprimento Sanitário: ${f(sanitarioComp.value)} m
`;
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
  if (step === 6) prepararEtapaGeologia();
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

function avancarEtapaAtual() {

  // Validação mínima da etapa 0
  if (step === 0 && !cliente.value.trim()) {
    alert("Informe o cliente");
    return;
  }

  // Validações da perfuração
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

  if (step === 6 && !validarGeologia()) {
    return;
  }

  nextStep();
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
profundidade.addEventListener("input", atualizarProfundidadeGeologia);
profundidade.addEventListener("blur", atualizarProfundidadeGeologia);

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

/* ================== GEOLOGIA ================== */
function getCamadasGeologia() {
  return document.querySelectorAll(".camada-geologia");
}

function getUltimoAteGeologia() {
  const camadas = getCamadasGeologia();
  if (!camadas.length) return 0;

  const ultima = camadas[camadas.length - 1];
  return n(ultima.querySelector(".geo-ate").value);
}

function atualizarProfundidadeGeologia() {
  const prof = n(profundidade.value);
  const textoProfundidade = prof ? `${f(prof)} m` : "Não informada";

  if (profundidadeGeologia) {
    profundidadeGeologia.textContent = textoProfundidade;
  }

  document.querySelectorAll(".geo-ate").forEach(input => {
    input.placeholder = prof ? `Máximo ${textoProfundidade}` : "";
  });
}

function prepararEtapaGeologia() {
  atualizarProfundidadeGeologia();
  if (!getCamadasGeologia().length) addCamadaGeologica();
  atualizarEstadoBotaoGeologia();
}

function atualizarNumeracaoGeologia() {
  getCamadasGeologia().forEach((camada, i) => {
    camada.querySelector(".camada-geologia-numero").textContent = `Camada ${i + 1}`;
  });
}

function atualizarDescricoesGeologia(selectGrupo) {
  const camada = selectGrupo.closest(".camada-geologia");
  const selectDescricao = camada.querySelector(".geo-descricao");
  const descricoes = descricoesPorGrupoGeologia[selectGrupo.value] || [];

  selectDescricao.innerHTML = descricoes
    .map(descricao => `<option value="${descricao}">${descricao}</option>`)
    .join("");
}

function atualizarContinuidadeGeologia() {
  let inicio = 0;

  getCamadasGeologia().forEach(camada => {
    const campoDe = camada.querySelector(".geo-de");
    campoDe.value = f(inicio);
    inicio = n(camada.querySelector(".geo-ate").value);
  });

  atualizarEstadoBotaoGeologia();
}

function geologiaCompleta() {
  const prof = n(profundidade.value);
  const camadas = getCamadasGeologia();

  if (!prof || !camadas.length) return false;

  for (let i = 0; i < camadas.length; i++) {
    const camada = camadas[i];
    const de = n(camada.querySelector(".geo-de").value);
    const ate = n(camada.querySelector(".geo-ate").value);

    if (i === 0 && de !== 0) return false;
    if (!ate || ate > prof || ate <= de) return false;
  }

  return getUltimoAteGeologia() === prof;
}

function atualizarEstadoBotaoGeologia() {
  if (btnAvancarGeologia) btnAvancarGeologia.disabled = !geologiaCompleta();
}

function addCamadaGeologica() {
  const camadas = getCamadasGeologia();
  const prof = n(profundidade.value);
  const ultimoAte = getUltimoAteGeologia();

  if (camadas.length && !ultimoAte) {
    alert("Informe o campo ATE da camada anterior antes de adicionar outra camada.");
    return;
    alert("Informe o campo ATÃ‰ da camada anterior antes de adicionar outra camada.");
    return;
  }

  if (camadas.length && prof && ultimoAte >= prof) {
    alert("A ultima camada ja alcancou a Profundidade Total.");
    return;
    alert("A Ãºltima camada jÃ¡ alcanÃ§ou a Profundidade Total.");
    return;
  }

  const div = document.createElement("div");
  div.className = "camada-geologia";

  div.innerHTML = `
<div class="camada-geologia-header">
  <span class="camada-geologia-numero"></span>
  <button type="button" class="btn-remover"
    onclick="this.closest('.camada-geologia').remove(); atualizarNumeracaoGeologia(); atualizarContinuidadeGeologia(); atualizarEstadoBotaoGeologia();">
    Remover
  </button>
</div>

<label>Grupo</label>
<select class="geo-grupo" onchange="atualizarDescricoesGeologia(this)">
  <option>Sedimentos / Solos</option>
  <option>Rocha Sedimentar</option>
  <option>Rocha Cristalina</option>
</select>

<label>DescriÃ§Ã£o</label>
<select class="geo-descricao"></select>

<div class="linha-geologia">
  <div>
    <label>De (m)</label>
    <input class="geo-de" disabled>
  </div>
  <div>
    <label>AtÃ© (m)</label>
    <input class="geo-ate" onblur="this.value=f(this.value); validarAteGeologia(this)" oninput="atualizarContinuidadeGeologia(); atualizarEstadoBotaoGeologia()">
  </div>
</div>
`;

  const labels = div.querySelectorAll("label");
  labels[1].textContent = "Descricao";
  labels[3].textContent = "Ate (m)";

  listaCamadasGeologia.appendChild(div);
  atualizarDescricoesGeologia(div.querySelector(".geo-grupo"));
  atualizarNumeracaoGeologia();
  atualizarContinuidadeGeologia();
  atualizarProfundidadeGeologia();
  atualizarEstadoBotaoGeologia();
}

function validarAteGeologia(input) {
  const camada = input.closest(".camada-geologia");
  const de = n(camada.querySelector(".geo-de").value);
  const ate = n(input.value);
  const prof = n(profundidade.value);

  if (!ate) return true;

  if (ate > prof) {
    alert("O campo ATE nao pode ser maior que a Profundidade Total.");
    input.value = "";
    atualizarContinuidadeGeologia();
    return false;
    alert("O campo ATÃ‰ nÃ£o pode ser maior que a Profundidade Total.");
    input.value = "";
    atualizarContinuidadeGeologia();
    return false;
  }

  if (ate <= de) {
    alert("O campo ATE deve ser maior que o campo DE da mesma camada.");
    input.value = "";
    atualizarContinuidadeGeologia();
    return false;
    alert("O campo ATÃ‰ deve ser maior que o campo DE da mesma camada.");
    input.value = "";
    atualizarContinuidadeGeologia();
    return false;
  }

  atualizarContinuidadeGeologia();
  atualizarEstadoBotaoGeologia();
  return true;
}

function validarGeologia() {
  const prof = n(profundidade.value);
  const camadas = getCamadasGeologia();

  if (!prof) {
    alert("Informe a Profundidade Total antes de finalizar a geologia.");
    return false;
  }

  if (!camadas.length) {
    alert("Adicione pelo menos uma camada geologica.");
    return false;
    alert("Adicione pelo menos uma camada geolÃ³gica.");
    return false;
  }

  atualizarContinuidadeGeologia();

  for (let i = 0; i < camadas.length; i++) {
    const camada = camadas[i];
    const de = n(camada.querySelector(".geo-de").value);
    const ate = n(camada.querySelector(".geo-ate").value);

    if (i === 0 && de !== 0) {
      alert("A primeira camada deve comecar em 0,00.");
      return false;
      alert("A primeira camada deve comeÃ§ar em 0,00.");
      return false;
    }

    if (!ate) {
      alert(`Informe o campo ATE da camada ${i + 1}.`);
      return false;
      alert(`Informe o campo ATÃ‰ da camada ${i + 1}.`);
      return false;
    }

    if (ate > prof) {
      alert("O campo ATE nao pode ser maior que a Profundidade Total.");
      return false;
      alert("O campo ATÃ‰ nÃ£o pode ser maior que a Profundidade Total.");
      return false;
    }

    if (ate <= de) {
      alert(`O campo ATE da camada ${i + 1} deve ser maior que o campo DE.`);
      return false;
      alert(`O campo ATÃ‰ da camada ${i + 1} deve ser maior que o campo DE.`);
      return false;
    }
  }

  if (getUltimoAteGeologia() !== prof) {
    alert("Para avancar, o ultimo campo ATE deve ser igual a Profundidade Total.");
    return false;
    alert("Para avanÃ§ar, o Ãºltimo campo ATÃ‰ deve ser igual Ã  Profundidade Total.");
    return false;
  }

  return true;
}

function gerarTextoGeologia() {
  const linhas = [];

  getCamadasGeologia().forEach((camada, i) => {
    const grupo = camada.querySelector(".geo-grupo").value;
    const descricao = camada.querySelector(".geo-descricao").value;
    const de = camada.querySelector(".geo-de").value;
    const ate = camada.querySelector(".geo-ate").value;

    linhas.push(`Camada ${i + 1}: ${de} - ${ate} m | ${grupo} | ${descricao}`);
  });

  return linhas.length ? linhas.join("\n") : "NÃ£o informado";
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
Empresa Perfuradora: ${textoOuNaoInformado(empresaPerfuracao.value)}
CNPJ Perfuradora: ${cnpjEmpresaPerfuradora()}
Encarregado: ${textoOuNaoInformado(encarregadoPerfuracao.value)}
Data Início: ${formatarData(dataInicio.value)}
Data Fim: ${formatarData(dataFim.value)}
Ø Inicial: ${f(polInicial.value)} (0 – ${f(metrosInicial.value)} m)
Ø Final Contínua: ${f(polFinal.value)} (${f(metrosInicial.value)} – ${f(profundidade.value)} m)
Profundidade: ${f(profundidade.value)} m
${gerarTextoSanitario()}

FILTROS
`;

  let totalFiltros = 0;

  document.querySelectorAll(".filtro").forEach((filtro, i) => {
    const de = n(filtro.querySelector(".de").value);
    const ate = n(filtro.querySelector(".ate").value);
    totalFiltros += Math.max(0, ate - de);
    html += `Filtro ${i + 1}: ${f(de)} – ${f(ate)} m | Tubo: ${textoTuboRevestimento()} | Polegada: ${textoPolegadaRevestimento()}\n`;
  });

  html += `\nTotal filtrado: ${f(totalFiltros)} m\n\nTRECHOS LISOS\n`;

  let totalLisos = 0;

  gerarTrechosLisos().forEach((l, i) => {
    totalLisos += Math.max(0, l.ate - l.de);
    html += `Liso ${i + 1}: ${f(l.de)} – ${f(l.ate)} m | Tubo: ${textoTuboRevestimento()} | Polegada: ${textoPolegadaRevestimento()}\n`;
  });

  html += `\nTotal de tubos lisos: ${f(totalLisos)} m\n`;

  html += `
DADOS HIDRÁULICOS
Vazão do Poço: ${f(vazaoPoco.value)}
Vazão da Bomba: ${f(vazaoBomba.value)}
Posição da Bomba: ${f(posBomba.value)}
NE: ${f(ne.value)}
ND: ${f(nd.value)}
`;
  html += `

GEOLOGIA DO POÇO
${gerarTextoGeologia()}

FRATURAS
${fraturas?.value || "Não informado"}

OBSERVAÇÕES
${observacoes?.value || "Não informado"}
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
/* ================== AÇÕES RESUMO ================== */

function novoFormulario() {
  // limpa a página inteira sem mexer em lógica
  window.location.reload();
}

function editarFormulario() {
  // volta para a primeira etapa mantendo os dados
  step = 0;
  showStep();
}


window.onerror = function (msg, src, line) {
alert("Erro no sistema:\n" + msg + "\nLinha: " + line);
};
