let step = 0;
const steps = document.querySelectorAll(".step");
const progressBar = document.getElementById("progressBar");

function showStep() {
  steps.forEach((s, i) => s.classList.toggle("active", i === step));
  progressBar.style.width = (step / (steps.length - 1)) * 100 + "%";
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

showStep();

/* util */
function n(v) {
  const num = parseFloat((v || "").toString().replace(",", "."));
  return isNaN(num) ? NaN : num;
}

/* perfuração */
const polInicial = document.getElementById("polInicial");
const polFinal = document.getElementById("polFinal");
const metrosInicial = document.getElementById("metrosInicial");
const metrosInicialArea = document.getElementById("metrosInicialArea");
const profundidade = document.getElementById("profundidade");

function validarPerfuração() {
  if (!polInicial.value || !polFinal.value) return;

  const pi = n(polInicial.value);
  const pf = n(polFinal.value);

  if (pf > pi) {
    alert("Polegada final não pode ser maior que a inicial");
    polFinal.value = "";
    metrosInicialArea.classList.add("hidden");
    return;
  }

  metrosInicialArea.classList.toggle("hidden", pi === pf);
}

polInicial.addEventListener("input", validarPerfuração);
polFinal.addEventListener("input", validarPerfuração);

/* sanitário */
const temSanitario = document.getElementById("temSanitario");
const sanitarioCampos = document.getElementById("sanitarioCampos");

function toggleSanitario() {
  sanitarioCampos.classList.toggle("hidden", temSanitario.value !== "sim");
}

/* filtros */
const tipoRevestimento = document.getElementById("tipoRevestimento");
const classeRevestimento = document.getElementById("classeRevestimento");
const listaFiltros = document.getElementById("listaFiltros");
const filtrosArea = document.getElementById("filtrosArea");

function addFiltro() {
  const div = document.createElement("div");
  div.className = "filtro";
  div.innerHTML = `
    <label>De (m)</label>
    <input class="de">
    <label>Até (m)</label>
    <input class="ate">
    <button type="button" onclick="this.parentElement.remove()">Remover</button>
  `;
  listaFiltros.appendChild(div);
}

function gerarPosicoesFiltros() {
  const prof = n(profundidade.value);
  if (isNaN(prof)) throw new Error("Profundidade inválida");

  if (!tipoRevestimento.value || !classeRevestimento.value)
    throw new Error("Informe revestimento e tipo");

  const filtros = [];

  document.querySelectorAll(".filtro").forEach((f, i) => {
    const de = n(f.querySelector(".de").value);
    const ate = n(f.querySelector(".ate").value);

    if (isNaN(de) || isNaN(ate))
      throw new Error(`Filtro ${i + 1} inválido`);

    if (de >= ate)
      throw new Error(`Filtro ${i + 1}: intervalo inválido`);

    if (ate > prof)
      throw new Error(`Filtro ${i + 1} ultrapassa profundidade`);

    filtros.push({ de, ate });
  });

  filtros.sort((a, b) => a.de - b.de);

  for (let i = 1; i < filtros.length; i++) {
    if (filtros[i].de < filtros[i - 1].ate)
      throw new Error("Sobreposição de filtros");
  }

  let html = "<ul>";
  let atual = 0;

  filtros.forEach(f => {
    if (atual < f.de) html += `<li>Tubo liso ${atual} – ${f.de} m</li>`;
    html += `<li>Filtro ${f.de} – ${f.ate} m</li>`;
    atual = f.ate;
  });

  if (atual < prof) html += `<li>Tubo liso ${atual} – ${prof} m</li>`;
  html += "</ul>";

  filtrosArea.innerHTML = html;
}

/* geologia */
const geologia = document.getElementById("geologia");

/* avançar */
const cliente = document.getElementById("cliente");

function avancarEtapaAtual() {
  try {
    if (step === 0 && !cliente.value.trim())
      throw new Error("Informe o cliente");

    if (step === 1 && n(metrosInicial.value || 0) > n(profundidade.value))
      throw new Error("Qtd inicial maior que profundidade");

    if (step === 3) gerarPosicoesFiltros();

    if (step === 5 && !geologia.value.trim())
      throw new Error("Informe a geologia");

    nextStep();
  } catch (e) {
    alert(e.message);
  }
}
