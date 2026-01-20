let stepAtual = 0;
const steps = document.querySelectorAll(".step");
const progress = document.getElementById("progress");

function showStep() {
  steps.forEach((s, i) => s.classList.toggle("active", i === stepAtual));
  progress.style.width = ((stepAtual + 1) / steps.length) * 100 + "%";
}
showStep();

function nextStep() {
  if (stepAtual < steps.length - 1) {
    stepAtual++;
    showStep();
  }
}

function prevStep() {
  if (stepAtual > 0) {
    stepAtual--;
    showStep();
  }
}

// Revestimento
const tipoColuna = document.getElementById("tipoColuna");
const campoTotal = document.getElementById("campoTotal");
const campoParcial = document.getElementById("campoParcial");
const listaFiltros = document.getElementById("listaFiltros");

tipoColuna.addEventListener("change", () => {
  campoTotal.classList.toggle("hidden", tipoColuna.value === "parcial");
  campoParcial.classList.toggle("hidden", tipoColuna.value !== "parcial");
});

function addFiltro() {
  const div = document.createElement("div");
  div.className = "filtro";
  div.innerHTML = `
    <input type="text" class="numero" inputmode="decimal" placeholder="Início (m)">
    <input type="text" class="numero" inputmode="decimal" placeholder="Fim (m)">
  `;
  listaFiltros.appendChild(div);
}

// Máscara numérica
d
