let step = 0;
const steps = document.querySelectorAll(".step");
const progressBar = document.getElementById("progressBar");

// ELEMENTOS IMPORTANTES
const temSanitario = document.getElementById("temSanitario");
const sanitarioCampos = document.getElementById("sanitarioCampos");
const tipoRevPoco = document.getElementById("tipoRevPoco");
const filtrosArea = document.getElementById("filtrosArea");
const listaFiltros = document.getElementById("listaFiltros");
const resumo = document.getElementById("resumo");
const testeVazaoCampos = document.getElementById("testeVazaoCampos");
const testeVazao = document.getElementById("testeVazao");

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

/* ===================== */
/*  SANITÁRIO / PARCIAL  */
/* ===================== */
function toggleSanitario() {
  const isSanitario = temSanitario.value === "sim";
  sanitarioCampos.classList.toggle("hidden", !isSanitario);

  if (isSanitario) {
    // Se o usuário marcou sanitário, desabilita parcial no poço
    if (tipoRevPoco.querySelector('option[value="parcial"]')) {
      tipoRevPoco.querySelector('option[value="parcial"]').disabled = true;
      if (tipoRevPoco.value === "parcial") tipoRevPoco.value = "";
    }
    // Mostra filtros do sanitário
    filtrosArea.classList.remove("hidden");
    listaFiltros.innerHTML = ""; // limpa qualquer filtro antigo
  } else {
    // Se sanitário não marcado, habilita parcial
    if (tipoRevPoco.querySelector('option[value="parcial"]')) {
      tipoRevPoco.querySelector('option[value="parcial"]').disabled = false;
    }
    filtrosArea.classList.add("hidden");
    listaFiltros.innerHTML = "";
  }
}

/* ===================== */
/*  REVESTIMENTO DO POÇO */
/* ===================== */
function controlarFluxoRevestimento() {
  const isSanitario = temSanitario.value === "sim";

  if (isSanitario) {
    // Se sanitário está ativo, apenas total do poço é permitido
    if (tipoRevPoco.value !== "total") tipoRevPoco.value = "";
    filtrosArea.classList.remove("hidden"); // filtros são do sanitário
    return;
  }

  // Usuário não marcou sanitário
  if (tipoRevPoco.value === "total") {
    filtrosArea.classList.remove("hidden");
  } else {
    filtrosArea.classList.add("hidden");
    listaFiltros.innerHTML = "";
  }
}

function addFiltro() {
  const div = document.createElement("div");
  div.className = "filtroItem";
  div.innerHTML = `
    <input type="number" placeholder="Início (m)">
    <input type="number" placeholder="Fim (m)">
    <button type="button" onclick="this.parentElement.remove()">Remover</button>
  `;
  listaFiltros.appendChild(div);
}

/* ===================== */
/*  TESTE DE VAZÃO       */
/* ===================== */
function toggleTesteVazao() {
  testeVazaoCampos.classList.toggle("hidden", testeVazao.value !== "sim");
}

/* ===================== */
/*  VALIDAÇÃO HIDRÁULICA */
/* ===================== */
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

/* ===================== */
/*  RESUMO FINAL         */
/* ===================== */
function gerarResumo() {
  // Captura filtros
  let filtros = [];
  document.querySelectorAll("#listaFiltros .filtroItem").forEach(div => {
    const inicio = div.children[0].value;
    const fim = div.children[1].value;
    if (inicio && fim) filtros.push(`${inicio}m → ${fim}m`);
  });

  let revestimentoDesc = "";
  if (temSanitario.value === "sim") {
    revestimentoDesc = `Sanitário (parcial) – ${sanitarioTipo.value} – ${sanitarioPol.value}" – ${sanitarioComp.value}m`;
    if (filtros.length) revestimentoDesc += ` | Filtros: ${filtros.join(", ")}`;
  } else if (tipoRevPoco.value) {
    revestimentoDesc = `${tipoRevPoco.value.charAt(0).toUpperCase() + tipoRevPoco.value.slice(1)} – ${materialRev.value} – ${polRev.value}"`;
    if (filtros.length) revestimentoDesc += ` | Filtros: ${filtros.join(", ")}`;
  }

  resumo.innerHTML = `
    <h2>Resumo do Poço</h2>

    <p><b>Cliente:</b> ${cliente.value}</p>
    <p><b>Endereço:</b> ${endereco.value}</p>

    <h3>Perfuração</h3>
    <p>${empresa.value} – ${metodo.value}</p>

    <h3>Poço</h3>
    <p>Profundidade: ${profundidade.value} m</p>

    <h3>Revestimento</h3>
    <p>${revestimentoDesc || "Não informado"}</p>

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

/* ===================== */
/*  ENVIO POR EMAIL      */
/* ===================== */
function enviarEmail() {
  const filtrosTexto = [];
  document.querySelectorAll("#listaFiltros .filtroItem").forEach(div => {
    const inicio = div.children[0].value;
    const fim = div.children[1].value;
    if (inicio && fim) filtrosTexto.push(`${inicio}m → ${fim}m`);
  });

  const mensagem = `
Cliente: ${cliente.value}
Endereço: ${endereco.value}
Revestimento: ${resumo.querySelector("h3 + p").innerText}
Filtros: ${filtrosTexto.join(", ")}
  `;

  emailjs.send("SEU_SERVICE_ID", "SEU_TEMPLATE_ID", {
    cliente: cliente.value,
    resumo: mensagem
  }).then(() => {
    alert("Poço enviado com sucesso!");
    location.reload();
  }).catch(err => {
    alert("Erro ao enviar: " + err);
  });
}
