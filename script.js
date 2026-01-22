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
  let valor = campo.value.replace(/[^\d.,]/g, "");  // remove tudo que não é número, ponto ou vírgula
  valor = parseFloat(valor.replace(",", "."));
  if (isNaN(valor)) return;
  campo.value = valor.toFixed(2).replace(".", ",");  // formata com vírgula
}

// Lista de campos numéricos
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
  if (dataFim.value < dataInicio.value) { alert("Data de término não pode ser anterior à data de início."); return false; }
  if (!polInicial.value || !polFinal.value || !profundidade.value) {
    alert("Informe polegada inicial, final e profundidade."); return false;
  }
  const pi = parseFloat(polInicial.value.replace(",", "."));
  const pf = parseFloat(polFinal.value.replace(",", "."));
  const prof = parseFloat(profundidade.value.replace(",", "."));
  if (pi > pf) { alert("Polegada inicial não pode ser maior que final."); return false; }
  if (pf > prof) { alert("Polegada final não pode ser maior que profundidade."); return false; }
  return true;
}

function validarVazao() {
  if (!vazaoPoco.value || !vazaoBomba.value || !posBomba.value || !ne.value || !nd.value) {
    alert("Preencha todos os dados de hidráulica."); return false;
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
   SANITÁRIO
   ============================== */
function toggleSanitario() {
  const campos = document.getElementById("sanitarioCampos");
  campos.classList.toggle("hidden", temSanitario.value !== "sim");
  // Se sanitário ativo, parcial desativa
  if (temSanitario.value === "sim") {
    document.getElementById("parcialCampos").classList.add("hidden");
    document.getElementById("tipoRevPoco").value = "";
  }
}

function avancarSanitario() {
  if (temSanitario.value === "sim") {
    const pi = parseFloat(sanitarioPolInicial.value.replace(",", "."));
    const pf = parseFloat(sanitarioPol.value.replace(",", "."));
    const prof = parseFloat(profundidade.value.replace(",", "."));
    if (!pi || !pf) { alert("Informe polegadas inicial e final do sanitário."); return; }
    if (pi > pf) { alert("Polegada inicial do sanitário não pode ser maior que a final."); return; }
    if (pf > prof) { alert("Polegada final do sanitário não pode ser maior que a profundidade."); return; }
  }
  nextStep();
}

/* ==============================
   REVESTIMENTO
   ============================== */
function controlarFluxoRevestimento() {
  const tipo = tipoRevPoco.value;
  document.getElementById("parcialCampos").classList.toggle("hidden", tipo !== "parcial");
  document.getElementById("filtrosArea").classList.toggle("hidden", tipo !== "total");
}

function addFiltro() {
  const div = document.createElement("div");
  div.innerHTML = `<input type="text" placeholder="Início (m)"> <input type="text" placeholder="Fim (m)">`;
  document.getElementById("listaFiltros").appendChild(div);
}

/* ==============================
   RESUMO FINAL
   ============================== */
function gerarResumo() {
  let resumoHTML = `<h2>Resumo do Poço</h2>
    <h3>Cliente</h3>
    <p>${cliente.value} | ${endereco.value} | ${cidade.value} | ${estado.value}</p>
    <h3>Perfuração</h3>
    <p>Empresa: ${empresa.value} | Encarregado: ${encarregado.value}</p>
    <p>Data: ${dataInicio.value} → ${dataFim.value}</p>
    <p>Método: ${metodo.value}</p>
    <p>Polegada Inicial: ${polInicial.value} | Polegada Final: ${polFinal.value}</p>
    <p>Profundidade: ${profundidade.value} m</p>`;

  if (temSanitario.value === "sim") {
    resumoHTML += `<h3>Sanitário</h3>
      <p>Material: ${sanitarioTipo.value}</p>
      <p>Polegada Inicial: ${sanitarioPolInicial.value} | Polegada Final: ${sanitarioPol.value}</p>
      <p>Comprimento: ${sanitarioComp.value} m</p>
      <p>Modelo: ${sanitarioModelo.value}</p>`;
  }

  if (tipoRevPoco.value) {
    resumoHTML += `<h3>Revestimento do Poço</h3>
      <p>Pré-filtro: ${preFiltro.value}</p>
      <p>Tipo: ${tipoRevPoco.value}</p>
      <p>Material: ${materialRev.value}</p>
      <p>Polegada Inicial: ${polRevInicial.value} | Polegada Final: ${polRev.value}</p>`;

    if (tipoRevPoco.value === "parcial") {
      resumoHTML += `<p>Modelo: ${parcialModelo.value}</p>`;
    } else if (tipoRevPoco.value === "total") {
      resumoHTML += `<p>Modelo: ${totalModelo.value}</p>`;
      const filtros = document.querySelectorAll("#listaFiltros div");
      if (filtros.length > 0) {
        resumoHTML += "<p>Filtros:</p><ul>";
        filtros.forEach(f => {
          const inputs = f.querySelectorAll("input");
          resumoHTML += `<li>Início: ${inputs[0].value} m | Fim: ${inputs[1].value} m</li>`;
        });
        resumoHTML += "</ul>";
      }
    }
  }

  resumoHTML += `<h3>Hidráulica</h3>
    <p>Vazão do Poço: ${vazaoPoco.value}</p>
    <p>Vazão da Bomba: ${vazaoBomba.value}</p>
    <p>Posição da Bomba: ${posBomba.value}</p>
    <p>NE: ${ne.value} | ND: ${nd.value}</p>
    <h3>Geologia</h3>
    <p>Geologia: ${geologia.value}</p>
    <p>Fraturas: ${fraturas.value}</p>
    <p>Observação: ${observacao.value}</p>
    <button onclick="editarResumo()">Editar</button>
    <button onclick="enviarEmail()">Enviar por Email</button>`;

  resumo.innerHTML = resumoHTML;
  step = steps.length - 1;
  showStep();
}

function editarResumo() { step = 0; showStep(); }

function enviarEmail() {
  emailjs.send("SEU_SERVICE_ID", "SEU_TEMPLATE_ID", {
    cliente: cliente.value,
    resumo: resumo.innerText
  }).then(() => {
    alert("Poço enviado com sucesso!");
    location.reload();
  });
}
