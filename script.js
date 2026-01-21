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
function aplicarMascara(inputs) {
  inputs.forEach(input => {
    input.addEventListener("input", () => {
      let v = input.value.replace(/\D/g, "");
      if (!v) { input.value = ""; return; }
      v = (parseInt(v) / 100).toFixed(2).replace(".", ",");
      input.value = v;
    });
  });
}
aplicarMascara(document.querySelectorAll(".decimal"));

const num = v => parseFloat(v.replace(",", "."));

/* SANITÁRIO */
function controleSanitario() {
  sanitarioBox.classList.toggle("hidden", temSanitario.value !== "sim");
  if (temSanitario.value === "sim") tipoRev.value = "";
}

/* REVESTIMENTO */
function controleRevestimento() {
  filtrosBox.classList.add("hidden");
  parcialBox.classList.add("hidden");

  if (tipoRev.value === "total") filtrosBox.classList.remove("hidden");
  if (tipoRev.value === "parcial") parcialBox.classList.remove("hidden");
}

function addFiltro() {
  const div = document.createElement("div");
  div.className = "filtro-item";
  div.innerHTML = `
    <input class="decimal inicio" placeholder="Início (m)">
    <input class="decimal fim" placeholder="Fim (m)">
    <button type="button" class="btn-remove" onclick="removerFiltro(this)">🗑</button>
    <small class="erro"></small>
  `;
  listaFiltros.appendChild(div);
  aplicarMascara(div.querySelectorAll(".decimal"));
}

function removerFiltro(btn) {
  btn.parentElement.remove();
}

listaFiltros.addEventListener("input", validarFiltros);

function validarFiltros() {
  const filtros = document.querySelectorAll(".filtro-item");
  const prof = num(profundidade.value);
  let intervalos = [];
  let valido = true;

  filtros.forEach(f => {
    const ini = num(f.querySelector(".inicio").value);
    const fim = num(f.querySelector(".fim").value);
    const erro = f.querySelector(".erro");
    erro.innerText = "";

    if (!ini || !fim) return;

    if (ini >= fim) {
      erro.innerText = "Início deve ser menor que o fim";
      valido = false;
    }
    if (fim > prof) {
      erro.innerText = "Ultrapassa a profundidade do poço";
      valido = false;
    }
    intervalos.push({ ini, fim, erro });
  });

  intervalos.sort((a, b) => a.ini - b.ini);
  for (let i = 1; i < intervalos.length; i++) {
    if (intervalos[i].ini < intervalos[i - 1].fim) {
      intervalos[i].erro.innerText = "Sobreposição com filtro anterior";
      valido = false;
    }
  }
  return valido;
}

function validarRevestimento() {
  if (tipoRev.value === "total" && !validarFiltros()) {
    alert("Corrija os filtros antes de continuar");
    return;
  }
  nextStep();
}

/* HIDRÁULICA */
function controleTeste() {
  testeBox.classList.toggle("hidden", testeVazao.value !== "sim");
}

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
