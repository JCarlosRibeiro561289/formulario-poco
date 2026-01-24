let step = 0;
const steps = document.querySelectorAll(".step");
const progressBar = document.getElementById("progressBar");

function showStep() {
  steps.forEach((s, i) => s.classList.toggle("active", i === step));
  progressBar.style.width = (step / (steps.length - 1)) * 100 + "%";
}

function nextStep() {
  step++;
  showStep();
}

function prevStep() {
  step--;
  showStep();
}

showStep();

/* FORMATAR */
function formatar(c) {
  if (!c.value) return;
  let v = parseFloat(c.value.replace(",", "."));
  if (!isNaN(v)) c.value = v.toFixed(2).replace(".", ",");
}

[profundidade, sanitarioPol, polRev, vazaoPoco, vazaoBomba, posBomba, ne, nd]
  .forEach(c => c?.addEventListener("blur", () => formatar(c)));

/* VALIDAÇÕES */
function avancarEtapaAtual() {
  if (step === 0 && !cliente.value) return alert("Informe o cliente");
  if (step === 1 && !profundidade.value) return alert("Informe profundidade");
  if (step === 4 && (!vazaoPoco.value || !vazaoBomba.value)) return alert("Hidráulica incompleta");
  nextStep();
}

/* FILTROS */
function addFiltro() {
  const div = document.createElement("div");
  div.innerHTML = `
    <select>
      <option>Ranhurado</option>
      <option>Johnson</option>
    </select>
    <input placeholder="De (m)">
    <input placeholder="Até (m)">
  `;
  listaFiltros.appendChild(div);
}

function gerarPosicoesFiltros() {
  const filtros = [];
  const prof = parseFloat(profundidade.value.replace(",", "."));

  document.querySelectorAll("#listaFiltros div").forEach(f => {
    const de = parseFloat(f.children[1].value.replace(",", "."));
    const ate = parseFloat(f.children[2].value.replace(",", "."));
    const tipo = f.children[0].value;

    if (de >= ate) throw alert("Filtro inválido");
    if (ate > prof) throw alert("Filtro ultrapassa profundidade");

    filtros.push({ tipo, de, ate });
  });

  filtros.sort((a, b) => a.de - b.de);

  for (let i = 1; i < filtros.length; i++) {
    if (filtros[i].de < filtros[i - 1].ate)
      throw alert("Sobreposição de filtros");
  }

  let html = "<ul>";
  let atual = 0;

  filtros.forEach(f => {
    if (atual < f.de)
      html += `<li>Tubo liso ${atual}–${f.de} m</li>`;
    html += `<li>Filtro (${f.tipo}) ${f.de}–${f.ate} m</li>`;
    atual = f.ate;
  });

  if (atual < prof)
    html += `<li>Tubo liso ${atual}–${prof} m</li>`;

  html += "</ul>";
  filtrosArea.innerHTML = html;
}

/* RESUMO */
function gerarResumo() {
  gerarPosicoesFiltros();
  resumo.innerHTML = `<h2>Resumo do Poço</h2><pre>${document.body.innerText}</pre>`;
  step = steps.length - 1;
  showStep();
}
