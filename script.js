let step = 0;
const steps = document.querySelectorAll(".step");
const progressBar = document.getElementById("progressBar");

function showStep() {
  steps.forEach((s, i) => s.classList.toggle("active", i === step));
  progressBar.style.width = (step / (steps.length - 1)) * 100 + "%";
}

function nextStep() {
  if (step < steps.length - 1) step++;
  showStep();
}

function prevStep() {
  if (step > 0) step--;
  showStep();
}

showStep();

/* ==============================
   FORMATAR NÚMEROS COM 2 DECIMAIS
   ============================== */
function formatarDecimalTexto(campo) {
  if (!campo.value) return;
  let valor = campo.value.replace(/[^\d.,]/g, "");
  valor = parseFloat(valor.replace(",", "."));
  if (isNaN(valor)) return;
  campo.value = valor.toFixed(2).replace(".", ",");
}

const camposNumericos = [
  profundidade, polInicial, polFinal,
  polRevInicial, polRev,
  sanitarioPolInicial, sanitarioPol, sanitarioComp,
  vazaoPoco, vazaoBomba, posBomba, ne, nd
];

camposNumericos.forEach(c => {
  if (c) c.addEventListener("blur", () => formatarDecimalTexto(c));
});

/* ==============================
   VALIDAÇÕES
   ============================== */
function validarCliente() {
  if (!cliente.value.trim()) { alert("Informe o nome do cliente."); return false; }
  if (!endereco.value.trim()) { alert("Informe o endereço."); return false; }
  if (!cidade.value.trim()) { alert("Informe a cidade."); return false; }
  if (!estado.value.trim()) { alert("Informe o estado."); return false; }
  return true;
}

function validarPerfuracao() {
  if (!empresa.value.trim()) { alert("Informe a empresa perfuradora."); return false; }
  if (!encarregado.value.trim()) { alert("Informe o encarregado."); return false; }
  if (!dataInicio.value) { alert("Informe a data de início."); return false; }
  if (!dataFim.value) { alert("Informe a data de término."); return false; }
  if (dataFim.value < dataInicio.value) { alert("Data de término inválida."); return false; }

  if (!polInicial.value || !polFinal.value || !profundidade.value) {
    alert("Informe polegadas e profundidade."); return false;
  }

  const pi = parseFloat(polInicial.value.replace(",", "."));
  const pf = parseFloat(polFinal.value.replace(",", "."));
  const prof = parseFloat(profundidade.value.replace(",", "."));

  if (pi > pf) { alert("Polegada inicial maior que final."); return false; }
  if (pf > prof) { alert("Polegada final maior que profundidade."); return false; }

  return true;
}

function validarVazao() {
  if (!vazaoPoco.value || !vazaoBomba.value || !posBomba.value || !ne.value || !nd.value) {
    alert("Preencha todos os dados hidráulicos."); return false;
  }
  return true;
}

/* ==============================
   AVANÇAR ETAPA COM VALIDAÇÃO
   ============================== */
function avancarEtapaAtual() {
  if (step === 0 && !validarCliente()) return;
  if (step === 1 && !validarPerfuracao()) return;
  if (step === 5 && !validarVazao()) return;
  nextStep();
}

/* ==============================
   SANITÁRIO (REGRA 1)
   ============================== */
function toggleSanitario() {
  const campos = document.getElementById("sanitarioCampos");
  const tipoRev = document.getElementById("tipoRevPoco");

  campos.classList.toggle("hidden", temSanitario.value !== "sim");

  if (temSanitario.value === "sim") {
    tipoRev.value = "total";
    controlarFluxoRevestimento();

    [...tipoRev.options].forEach(o => {
      if (o.value === "parcial") o.disabled = true;
    });
  } else {
    [...tipoRev.options].forEach(o => o.disabled = false);
  }
}

function avancarSanitario() {
  if (temSanitario.value === "sim") {
    const pi = parseFloat(sanitarioPolInicial.value.replace(",", "."));
    const pf = parseFloat(sanitarioPol.value.replace(",", "."));
    const prof = parseFloat(profundidade.value.replace(",", "."));

    if (!pi || !pf) { alert("Informe polegadas do sanitário."); return; }
    if (pi > pf) { alert("Sanitário: polegada inicial maior."); return; }
    if (pf > prof) { alert("Sanitário maior que profundidade."); return; }
  }
  nextStep();
}

/* ==============================
   REVESTIMENTO
   ============================== */
function controlarFluxoRevestimento() {
  const tipo = tipoRevPoco.value;
  parcialCampos.classList.toggle("hidden", tipo !== "parcial");
  filtrosArea.classList.toggle("hidden", tipo !== "total");
}

function addFiltro() {
  const div = document.createElement("div");
  div.innerHTML = `
    <select>
      <option>Ranhurado</option>
      <option>Johnson</option>
      <option>Padrão</option>
    </select>
    <input type="text" placeholder="De (m)">
    <input type="text" placeholder="Até (m)">
  `;
  listaFiltros.appendChild(div);
}

/* ==============================
   GERAR POSIÇÕES (REGRA 2)
   ============================== */
function gerarPosicoesFiltros() {
  const filtros = [];
  const prof = parseFloat(profundidade.value.replace(",", "."));

  document.querySelectorAll("#listaFiltros div").forEach(f => {
    const s = f.querySelector("select");
    const i = f.querySelectorAll("input");

    const tipo = s.value;
    const de = parseFloat(i[0].value.replace(",", "."));
    const ate = parseFloat(i[1].value.replace(",", "."));

    if (!isNaN(de) && !isNaN(ate)) filtros.push({ tipo, de, ate });
  });

  filtros.sort((a, b) => a.de - b.de);

  let html = "<h4>Posições Geradas</h4><ul>";
  let atual = 0;

  filtros.forEach(f => {
    if (atual < f.de) {
      html += `<li>Tubo liso: ${atual.toFixed(2)} m até ${f.de.toFixed(2)} m</li>`;
    }
    html += `<li>Filtro (${f.tipo}): ${f.de.toFixed(2)} m até ${f.ate.toFixed(2)} m</li>`;
    atual = f.ate;
  });

  if (atual < prof) {
    html += `<li>Tubo liso: ${atual.toFixed(2)} m até ${prof.toFixed(2)} m</li>`;
  }

  html += "</ul>";

  filtrosArea.querySelector("h4")?.remove();
  filtrosArea.querySelector("ul")?.remove();
  filtrosArea.insertAdjacentHTML("beforeend", html);
}

/* ==============================
   RESUMO FINAL
   ============================== */
function gerarResumo() {
  gerarPosicoesFiltros();

  let resumoHTML = `<h2>Resumo do Poço</h2>
    <h3>Cliente</h3>
    <p>${cliente.value} | ${endereco.value} | ${cidade.value} | ${estado.value}</p>`;

  resumo.innerHTML = resumoHTML;
  step = steps.length - 1;
  showStep();
}

function editarResumo() {
  step = 0;
  showStep();
}

function enviarEmail() {
  emailjs.send("SEU_SERVICE_ID", "SEU_TEMPLATE_ID", {
    cliente: cliente.value,
    resumo: resumo.innerText
  }).then(() => {
    alert("Poço enviado com sucesso!");
    location.reload();
  });
}
