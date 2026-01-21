let step = 0;
let filtros = [];

const steps = document.querySelectorAll(".step");

function showStep() {
  steps.forEach((s, i) => s.classList.toggle("active", i === step));
  progressBar.style.width = (step / (steps.length - 1)) * 100 + "%";
  window.scrollTo(0, 0);
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

/* Sanitário */
function toggleSanitario() {
  sanitarioCampos.classList.toggle("hidden", temSanitario.value !== "sim");
}

/* Revestimento */
function controlarFluxoRevestimento() {
  filtrosArea.classList.toggle("hidden", tipoRevPoco.value !== "total");
  if (tipoRevPoco.value !== "total") {
    filtros = [];
    listaFiltros.innerHTML = "";
  }
}

function lancarFiltro() {
  const inicio = filtroInicio.value;
  const fim = filtroFim.value;

  if (!inicio || !fim) {
    alert("Informe início e fim do filtro.");
    return;
  }

  filtros.push({ inicio, fim });
  atualizarListaFiltros();

  filtroInicio.value = "";
  filtroFim.value = "";
}

function atualizarListaFiltros() {
  listaFiltros.innerHTML = "";
  filtros.forEach((f, i) => {
    const li = document.createElement("li");
    li.textContent = `Filtro ${i + 1}: ${f.inicio} m até ${f.fim} m`;
    listaFiltros.appendChild(li);
  });
}

/* Teste de Vazão */
function validarTesteVazao() {
  if (+vazaoBomba.value > +vazaoPoco.value) {
    alert("A vazão da bomba não pode ser maior que a vazão do poço.");
    return;
  }
  nextStep();
}

/* Resumo */
function gerarResumo() {
  resumoConteudo.innerHTML = `
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
    <ul>
      ${filtros.length
        ? filtros.map(f => `<li>${f.inicio} m até ${f.fim} m</li>`).join("")
        : "<li>Não possui filtros</li>"}
    </ul>

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

    <button onclick="step=0;showStep()">Editar tudo</button>
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
    resumo: resumoConteudo.innerText
  }).then(() => alert("Enviado com sucesso"));
}

/* Download */
function baixarResumo() {
  const blob = new Blob([resumoConteudo.innerText], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "poco.txt";
  a.click();
}
