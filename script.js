let modo = "novo";
let step = 0;

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

function n(v) {
  if (v === "" || v === null || v === undefined) return 0;
  return parseFloat(v.toString().replace(",", ".")) || 0;
}

function showStep() {
  steps.forEach((s, i) => s.classList.toggle("active", i === step));
  progressBar.style.width = (step / (steps.length - 1)) * 100 + "%";

  if (step === 2) atualizarEstadoPerfuracao();

  if (step === steps.length - 1) {
    gerarResumoFinal();
  }
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

    if (step === 4 && !gerarPosicoesFiltros()) return;
  }

  nextStep();
}

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

function toggleSanitario() {
  sanitarioCampos.classList.toggle("hidden", temSanitario.value !== "sim");
}

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
  const filtros = [];

  for (const f of document.querySelectorAll(".filtro")) {
    const de = n(f.querySelector(".de").value);
    const ate = n(f.querySelector(".ate").value);

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

function gerarResumoFinal() {

  let html = `
<strong>PERFIL TÉCNICO DO POÇO</strong>

<strong>DADOS CLIENTE</strong>
Cliente: ${cliente.value}
CNPJ/CPF: ${documento.value}
Endereço: ${endereco.value}
Cidade/UF: ${cidade.value} - ${estado.value}

<strong>PERFURAÇÃO</strong>
Ø Inicial: ${polInicial.value} (0 – ${metrosInicial.value} m)
Ø Final COontínua: ${polFinal.value} (${metrosInicial.value} – ${profundidade.value} m)
Profundidade: ${profundidade.value} m

<strong>PROTEÇÃO SANITÁRIA</strong>
`;


if (temSanitario.value === "sim") {
html += `
Ø Inicial: ${sanitarioPol.value} (0 – ${sanitarioComp.value} m)
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
document.querySelectorAll(".filtro").forEach((f, i) => {
const de = n(f.querySelector(".de").value);
const ate = n(f.querySelector(".ate").value);


totalFiltros += (ate - de);


html += `Filtro ${i + 1}: ${de} – ${ate} m\n`;
});

  html += `

<strong>DADOS DE PRODUÇÃO</strong>
Vazão do Poço: ${vazaoPoco.value}
Vazão da Bomba: ${vazaoBomba.value}
Posição da Bomba: ${posBomba.value}
NE: ${ne.value}
ND: ${nd.value}
`;

  resumoConteudo.innerHTML = `<pre>${html}</pre>`;
}

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

showStep();
