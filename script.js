let step = 0;
const steps = document.querySelectorAll(".step");

function showStep() {
  steps.forEach((s, i) => s.classList.toggle("active", i === step));
  progressBar.style.width = (step / (steps.length - 1)) * 100 + "%";
}

function nextStep() {
  if (step < steps.length - 1) step++;
  showStep();
  window.scrollTo(0, 0);
}

function prevStep() {
  if (step > 0) step--;
  showStep();
  window.scrollTo(0, 0);
}

showStep();

/* Sanitário */
function toggleSanitario() {
  sanitarioCampos.classList.toggle("hidden", temSanitario.value !== "sim");
}

/* Revestimento */
function controlarFluxoRevestimento() {
  filtrosArea.classList.toggle("hidden", tipoRevPoco.value !== "total");
  if (tipoRevPoco.value !== "total") listaFiltros.innerHTML = "";
}

function lancarFiltro() {
  if (!filtroInicio.value || !filtroFim.value) return;
  const li = document.createElement("li");
  li.textContent = `Filtro de ${filtroInicio.value} m até ${filtroFim.value} m`;
  listaFiltros.appendChild(li);
  filtroInicio.value = "";
  filtroFim.value = "";
}

/* Teste de Vazão */
function validarTesteVazao() {
  if (+vazaoBomba.value > +vazaoPoco.value) {
    alert("Vazão da bomba não pode ser maior que a vazão do poço.");
    return;
  }
  nextStep();
}

/* Resumo */
function gerarResumo() {
  resumo.innerHTML = `
    <button class="btn-voltar-topo" onclick="voltarEtapaResumo()">← Voltar etapa</button>

    <h2>Resumo do Poço</h2>

    <h3>Cliente</h3>
    <p>${cliente.value}<br>${documento.value}<br>${endereco.value}</p>

    <h3>Perfuração</h3>
    <p>${empresa.value} - ${metodo.value}</p>

    <h3>Poço</h3>
    <p>Profundidade: ${profundidade.value} m<br>Polegada Final: ${polFinal.value}</p>

    <h3>Revestimento</h3>
    <p>${tipoRevPoco.value} - ${materialRev.value} - ${polRev.value}"</p>

    <h3>Filtros</h3>
    <ul>${listaFiltros.innerHTML}</ul>

    <h3>Teste de Vazão</h3>
    <p>
      Vazão do Poço: ${vazaoPoco.value}<br>
      Vazão da Bomba: ${vazaoBomba.value}<br>
      Posição da Bomba: ${posBomba.value}<br>
      NE: ${ne.value} | ND: ${nd.value}
    </p>

    <h3>Geologia</h3>
    <p>${geologia.value}</p>

    <h3>Fraturas</h3>
    <p>${fraturas.value}</p>

    <button onclick="step=0;showStep()">Editar Tudo</button>
    <button onclick="enviarEmail()">Enviar por Email</button>
    <button onclick="baixarResumo()">Baixar</button>
  `;

  step = steps.length - 1;
  showStep();
}

function voltarEtapaResumo() {
  step = steps.length - 2;
  showStep();
}

/* Email */
function enviarEmail() {
  emailjs.send("SEU_SERVICE_ID", "SEU_TEMPLATE_ID", {
    cliente: cliente.value,
    resumo: resumo.innerText
  }).then(() => alert("Enviado com sucesso"));
}

/* Download */
function baixarResumo() {
  const blob = new Blob([resumo.innerText], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "poco.txt";
  a.click();
}
