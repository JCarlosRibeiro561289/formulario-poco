emailjs.init("SUA_PUBLIC_KEY");

let step = 0;
const steps = document.querySelectorAll(".step");
const progress = document.getElementById("progress");

function update() {
  steps.forEach((s, i) => s.classList.toggle("active", i === step));
  progress.style.width = ((step + 1) / steps.length * 100) + "%";
}
update();

function next() { if (step < steps.length - 1) { step++; update(); } }
function prev() { if (step > 0) { step--; update(); } }

/* Máscara */
document.addEventListener("input", e => {
  if (e.target.classList.contains("num")) {
    e.target.value = e.target.value.replace(",", ".").replace(/[^0-9.]/g, "");
  }
});

/* Revestimento */
const tipoRev = document.getElementById("tipoRevPoco");
tipoRev.addEventListener("change", e => {
  const v = e.target.value;
  document.getElementById("revComum").classList.toggle("hidden", !v);
  document.getElementById("revComprimento").classList.toggle("hidden", v === "total");
  document.getElementById("revFiltros").classList.toggle("hidden", v !== "total");
});

/* Filtros */
function addFiltro() {
  const d = document.createElement("div");
  d.className = "filtro";
  d.innerHTML = `
    <input class="num ini" placeholder="Início">
    <input class="num fim" placeholder="Fim">
  `;
  listaFiltros.appendChild(d);
}

function validarFiltros(filtros, profundidade) {
  for (let i = 0; i < filtros.length; i++) {
    if (filtros[i].ini >= filtros[i].fim) return "Início maior ou igual ao fim";
    if (filtros[i].fim > profundidade) return "Filtro ultrapassa profundidade do poço";
    if (i > 0 && filtros[i].ini < filtros[i - 1].fim) return "Filtros sobrepostos";
  }
  return null;
}

/* Submit */
document.getElementById("formPoco").addEventListener("submit", async e => {
  e.preventDefault();
  const dados = Object.fromEntries(new FormData(e.target));
  window.dadosResumo = dados;

  const erroH = document.getElementById("erroHid");
  erroH.classList.add("hidden");

  if (parseFloat(dados.posBomba) <= parseFloat(dados.nd)) {
    erroH.textContent = "Posição da bomba deve ser maior que o ND.";
    erroH.classList.remove("hidden");
    return;
  }

  mostrarResumo(dados);
});

/* Resumo + PDF + Email */
function mostrarResumo(d) {
  let html = `<div class="card">
    <h2>Resumo do Poço</h2>
    <p><b>Cliente:</b> ${d.cliente}</p>
    <p><b>Endereço:</b> ${d.endereco}</p>
    <p><b>Profundidade:</b> ${d.profundidade} m</p>
    <p><b>NE:</b> ${d.ne} m | <b>ND:</b> ${d.nd} m</p>
    <p><b>Bomba:</b> ${d.posBomba} m</p>

    <div class="nav">
      <button class="secondary" onclick="location.reload()">Editar</button>
      <button class="primary" onclick="confirmarEnvio()">Confirmar e Enviar</button>
    </div>
  </div>`;

  document.getElementById("app").classList.add("hidden");
  const r = document.getElementById("resumo");
  r.innerHTML = html;
  r.classList.remove("hidden");
}

async function confirmarEnvio() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  pdf.text("Cadastro de Poço", 10, 10);
  let y = 20;

  Object.entries(window.dadosResumo).forEach(([k, v]) => {
    pdf.text(`${k}: ${v}`, 10, y);
    y += 7;
  });

  const blob = pdf.output("blob");
  const reader = new FileReader();
  reader.onload = async () => {
    await emailjs.send("SEU_SERVICE_ID", "SEU_TEMPLATE_ID", {
      cliente: window.dadosResumo.cliente,
      pdf: reader.result.split(",")[1]
    });
    alert("Poço enviado com sucesso!");
    location.reload();
  };
  reader.readAsDataURL(blob);
}
