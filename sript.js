let stepAtual = 0;
const steps = document.querySelectorAll(".step");
const progress = document.getElementById("progress");

function showStep() {
  steps.forEach((s, i) => {
    s.classList.toggle("active", i === stepAtual);
  });
  progress.style.width = ((stepAtual + 1) / steps.length) * 100 + "%";
}

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

showStep();

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
    <input type="number" placeholder="Início (m)">
    <input type="number" placeholder="Fim (m)">
  `;
  listaFiltros.appendChild(div);
}

document.getElementById("formPoco").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("Resumo será implementado na próxima etapa.");
});
