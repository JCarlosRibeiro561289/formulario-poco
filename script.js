let step = 0;
const steps = document.querySelectorAll(".step");

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

/* Sanitário */
function toggleSanitario() {
  sanitarioCampos.classList.toggle("hidden", temSanitario.value !== "sim");
}

/* Revestimento */
function controlarFluxoRevestimento() {
  filtrosArea.classList.toggle("hidden", tipoRevPoco.value !== "total");
  if (tipoRevPoco.value !== "total") listaFiltros.innerHTML = "";
}

function addFiltro() {
  const div = document.createElement("div");
  div.innerHTML = `
    <input type="number" placeholder="Início (m)">
    <input type="number" placeholder="Fim (m)">
  `;
  listaFiltros.appendChild(div);
}

/* Teste Vazão */
function toggleTesteVazao() {
  testeVazaoCampos.classList.toggle("hidden", testeVazao.value !== "sim");
}

/* Validações Hidráulica */
function validarHidraulica() {
  const vp = +vazaoPoco.value;
  const vb = +vazaoBomba.value;
  const bomba = +posBomba.value;
  const ndv = +nd.value;
  const prof = +profundidade.value;

  if (vb > vp) {
    alert("A vazão da bomba não pode ser maior que a vazão do poço.");
    return;
  }

  if (bomba > prof) {
    alert("A posição da bomba não pode ser maior que a profundidade.");
    return;
  }

  if (bomba <= ndv) {
    alert("A bomba deve estar abaixo do nível dinâmico (ND).");
    return;
  }

  if (testeVazao.value === "sim" && +vazaoTeste.value > vp) {
    alert("A vazão do teste não pode ser maior que a vazão do poço.");
    return;
  }

  nextStep();
}

/* Resumo */
function gerarResumo() {
  resumo.innerHTML = `
    <h2>Resumo do Poço</h2>

    <p><b>Cliente:</b> ${cliente.value}</p>
    <p><b>Endereço:</b> ${endereco.value}</p>

    <h3>Perfuração</h3>
    <p>${empresa.value} – ${metodo.value}</p>

    <h3>Poço</h3>
    <p>Profundidade: ${profundidade.value} m</p>

    <h3>Revestimento</h3>
    <p>${tipoRevPoco.value} – ${materialRev.value} – ${polRev.value}"</p>

    <h3>Hidráulica</h3>
    <p>Teste de Vazão: ${testeVazao.value}</p>
    <p>Vazão do Poço: ${vazaoPoco.value}</p>
    <p>Vazão da Bomba: ${vazaoBomba.value}</p>
    <p>NE: ${ne.value} | ND: ${nd.value}</p>

    <button onclick="step=0;showStep()">Editar</button>
    <button onclick="enviarEmail()">Enviar por Email</button>
    <button onclick="location.reload()">Novo Poço</button>
  `;

  step = steps.length - 1;
  showStep();
}

/* Envio Email */
function enviarEmail() {
  emailjs.send("SEU_SERVICE_ID", "SEU_TEMPLATE_ID", {
    cliente: cliente.value,
    resumo: resumo.innerText
  }).then(() => {
    alert("Poço enviado com sucesso!");
    location.reload();
  });
}
