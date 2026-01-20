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
  let html = `
  <div class="card">
    <h2>Resumo do Poço</h2>

    <h3>Cliente</h3>
    <p><b>Cliente:</b> ${d.cliente}</p>
    <p><b>Documento:</b> ${d.documento || "-"}</p>
    <p><b>Endereço:</b> ${d.endereco}</p>

    <h3>Perfuração</h3>
    <p><b>Empresa Perfuradora:</b> ${d.empresa || "-"}</p>
    <p><b>Método:</b> ${d.metodo}</p>
    <p><b>Profundidade do Poço:</b> ${d.profundidade} m</p>

    <h3>Revestimento do Poço</h3>
    <p><b>Tipo:</b> ${document.getElementById("tipoRevPoco").value}</p>
    <p><b>Material:</b> ${d.materialRev}</p>
    <p><b>Polegadas:</b> ${d.polRev}"</p>
  `;

  if (d.compRev) {
    html += `<p><b>Comprimento:</b> ${d.compRev} m</p>`;
  }

  /* Se for TOTAL, mostra filtros */
  if (document.getElementById("tipoRevPoco").value === "total") {
    html += `
      <h4>Revestimento (Liso / Filtro)</h4>
      <table>
        <tr>
          <th>Início (m)</th>
          <th>Fim (m)</th>
          <th>Tipo</th>
        </tr>
    `;

    const profundidade = parseFloat(d.profundidade);
    let filtros = [];

    document.querySelectorAll(".filtro").forEach(f => {
      const ini = parseFloat(f.querySelector(".ini").value);
      const fim = parseFloat(f.querySelector(".fim").value);
      if (!isNaN(ini) && !isNaN(fim)) filtros.push({ ini, fim });
    });

    filtros.sort((a, b) => a.ini - b.ini);

    let atual = 0;
    filtros.forEach(f => {
      if (f.ini > atual) {
        html += `<tr><td>${atual}</td><td>${f.ini}</td><td>Liso</td></tr>`;
      }
      html += `<tr><td>${f.ini}</td><td>${f.fim}</td><td>Filtro</td></tr>`;
      atual = f.fim;
    });

    if (atual < profundidade) {
      html += `<tr><td>${atual}</td><td>${profundidade}</td><td>Liso</td></tr>`;
    }

    html += `</table>`;
  }

  html += `
    <h3>Hidráulica</h3>
    <p><b>NE:</b> ${d.ne} m</p>
    <p><b>ND:</b> ${d.nd} m</p>
    <p><b>Posição da Bomba:</b> ${d.posBomba} m</p>
    <p><b>Vazão do Poço:</b> ${d.vazPoco || "-"} m³/h</p>
    <p><b>Vazão da Bomba:</b> ${d.vazBomba || "-"} m³/h</p>

    <h3>Geologia</h3>
    <p>${d.geologia || "-"}</p>

    <h3>Fraturas</h3>
    <p>${d.fraturas || "-"}</p>

    <div class="nav">
      <button class="secondary" onclick="location.reload()">Editar</button>
      <button class="primary" onclick="confirmarEnvio()">Confirmar e Enviar</button>
    </div>
  </div>
  `;

  document.getElementById("app").classList.add("hidden");
  const r = document.getElementById("resumo");
  r.innerHTML = html;
  r.classList.remove("hidden");
}

async function confirmarEnvio() {
  const { jsPDF } = window.jspdf;
  const d = window.dadosResumo;
  const pdf = new jsPDF();

  let y = 10;

  pdf.setFontSize(14);
  pdf.text("LAUDO DE CADASTRO DE POÇO TUBULAR", 105, y, { align: "center" });

  y += 10;
  pdf.setFontSize(10);

  pdf.text(`Cliente: ${d.cliente}`, 10, y); y += 6;
  pdf.text(`Endereço: ${d.endereco}`, 10, y); y += 6;
  pdf.text(`Empresa Perfuradora: ${d.empresa || "-"}`, 10, y); y += 6;

  pdf.line(10, y, 200, y); y += 6;

  pdf.text(`Profundidade do Poço: ${d.profundidade} m`, 10, y); y += 6;
  pdf.text(`Método de Perfuração: ${d.metodo}`, 10, y); y += 6;

  pdf.line(10, y, 200, y); y += 6;

  pdf.text("REVESTIMENTO", 10, y); y += 6;
  pdf.text(`Tipo: ${document.getElementById("tipoRevPoco").value}`, 10, y); y += 6;
  pdf.text(`Material: ${d.materialRev}`, 10, y); y += 6;
  pdf.text(`Polegadas: ${d.polRev}"`, 10, y); y += 6;

  if (d.compRev) {
    pdf.text(`Comprimento: ${d.compRev} m`, 10, y); y += 6;
  }

  pdf.line(10, y, 200, y); y += 6;

  pdf.text("HIDRÁULICA", 10, y); y += 6;
  pdf.text(`NE: ${d.ne} m`, 10, y); y += 6;
  pdf.text(`ND: ${d.nd} m`, 10, y); y += 6;
  pdf.text(`Posição da Bomba: ${d.posBomba} m`, 10, y); y += 6;
  pdf.text(`Vazão do Poço: ${d.vazPoco || "-"} m³/h`, 10, y); y += 6;
  pdf.text(`Vazão da Bomba: ${d.vazBomba || "-"} m³/h`, 10, y); y += 6;

  pdf.line(10, y, 200, y); y += 6;

  pdf.text("GEOLOGIA", 10, y); y += 6;
  pdf.text(pdf.splitTextToSize(d.geologia || "-", 180), 10, y);
  y += 10;

  pdf.text("FRATURAS", 10, y); y += 6;
  pdf.text(pdf.splitTextToSize(d.fraturas || "-", 180), 10, y);

  // GERA PDF
  const blob = pdf.output("blob");

  // CONVERTE PARA BASE64
  const base64 = await new Promise(resolve => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(",")[1]);
    r.readAsDataURL(blob);
  });

  // ENVIO EMAIL
  await emailjs.send("SEU_SERVICE_ID", "SEU_TEMPLATE_ID", {
    cliente: d.cliente,
    endereco: d.endereco,
    mensagem: "Segue em anexo o laudo de cadastro do poço.",
    pdf: base64
  });

  alert("Poço enviado com sucesso!");
  location.reload();
}
