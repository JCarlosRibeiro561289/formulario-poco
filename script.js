let step = 0;
const steps = document.querySelectorAll(".step");
const progressBar = document.getElementById("progressBar");

function showStep() {
  steps.forEach((s, i) => s.classList.toggle("active", i === step));
  progressBar.style.width = (step / (steps.length - 1)) * 100 + "%";
}
function nextStep() { if (step < steps.length - 1) step++; showStep(); }
function prevStep() { if (step > 0) step--; showStep(); }
showStep();

/* MÁSCARA DECIMAL 18,00 */
document.querySelectorAll(".decimal").forEach(input => {
  input.addEventListener("input", () => {
    let v = input.value.replace(/\D/g, "");
    if (!v) return input.value = "";
    v = (parseInt(v) / 100).toFixed(2).replace(".", ",");
    input.value = v;
  });
});
const num = v => parseFloat(v.replace(",", "."));

/* CONTROLES */
function controleSanitario() {
  sanitarioBox.classList.toggle("hidden", temSanitario.value !== "sim");
  if (temSanitario.value === "sim") tipoRev.value = "";
}

function controleRevestimento() {
  filtrosBox.classList.add("hidden");
  parcialBox.classList.add("hidden");

  if (tipoRev.value === "total") filtrosBox.classList.remove("hidden");
  if (tipoRev.value === "parcial") parcialBox.classList.remove("hidden");
}

function addFiltro() {
  const d = document.createElement("div");
  d.innerHTML = `
    <input class="decimal" placeholder="Início">
    <input class="decimal" placeholder="Fim">
  `;
  listaFiltros.appendChild(d);
}

/* TESTE */
function controleTeste() {
  testeBox.classList.toggle("hidden", testeVazao.value !== "sim");
}

/* VALIDAÇÕES */
function validarHidraulica() {
  if (num(vazaoBomba.value) > num(vazaoPoco.value)) {
    alert("Vazão da bomba maior que a do poço");
    return;
  }
  if (num(posBomba.value) > num(profundidade.value)) {
    alert("Bomba maior que profundidade");
    return;
  }
  if (num(posBomba.value) <= num(nd.value)) {
    alert("Bomba deve estar abaixo do ND");
    return;
  }
  nextStep();
}

/* RESUMO */
function gerarResumo() {
  resumo.innerHTML = `
    <h2>Resumo do Poço</h2>
    <p><b>Cliente:</b> ${cliente.value}</p>
    <p><b>Endereço:</b> ${endereco.value}</p>

    <h3>Poço</h3>
    <p>Profundidade: ${profundidade.value} m</p>

    <h3>Revestimento</h3>
    <p>${temSanitario.value === "sim" ? "Sanitário" : tipoRev.value}</p>

    <h3>Hidráulica</h3>
    <p>Vazão Poço: ${vazaoPoco.value}</p>
    <p>Vazão Bomba: ${vazaoBomba.value}</p>

    <button onclick="step=0;showStep()">Editar</button>
    <button onclick="location.reload()">Novo Poço</button>
  `;
  step = steps.length - 1;
  showStep();
}
