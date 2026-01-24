/* =========================
   CONTROLE DE ETAPAS
========================= */

const steps = document.querySelectorAll(".step");
let step = 0;

function showStep(i) {
  steps.forEach((s, idx) => s.classList.toggle("active", idx === i));
  updateProgress();
}

function nextStep() {
  if (step < steps.length - 1) {
    step++;
    showStep(step);
  }
}

function prevStep() {
  if (step > 0) {
    step--;
    showStep(step);
  }
}

function avancarEtapaAtual() {
  if (step < steps.length - 1) {
    step++;
    showStep(step);
  }

  /* gera resumo ao entrar na última etapa */
  if (step === steps.length - 1) {
    gerarResumoFinal();
  }
}

function updateProgress() {
  const percent = ((step + 1) / steps.length) * 100;
  document.getElementById("progressBar").style.width = percent + "%";
}

/* =========================
   SANITÁRIO
========================= */

function toggleSanitario() {
  const area = document.getElementById("sanitarioCampos");
  area.classList.toggle("hidden", temSanitario.value !== "sim");
}

/* =========================
   FILTROS
========================= */

function addFiltro() {
  const div = document.createElement("div");
  div.className = "filtro";
  div.innerHTML = `
    <label>De (m)</label>
    <input class="de" type="number" step="0.01">

    <label>Até (m)</label>
    <input class="ate" type="number" step="0.01">

    <button type="button" onclick="this.parentNode.remove()">Remover</button>
    <hr>
  `;
  document.getElementById("listaFiltros").appendChild(div);
}

/* =========================
   RESUMO FINAL
========================= */

function gerarResumoFinal() {

  /* ===== TEXTO (arquivo / email) ===== */

  let txt = `
===== CADASTRO TÉCNICO DE POÇO =====

--- CLIENTE ---
Cliente: ${cliente.value}
Documento: ${documento.value}
Endereço: ${endereco.value}
Cidade: ${cidade.value} - ${estado.value}

--- PERFURAÇÃO ---
Polegada Inicial: ${polInicial.value}
Polegada Final: ${polFinal.value}
Qtd Inicial: ${metrosInicial?.value || "-"}
Profundidade Total: ${profundidade.value} m
`;

  if (temSanitario.value === "sim") {
    txt += `
--- SANITÁRIO ---
Polegada: ${sanitarioPol.value}
Comprimento: ${sanitarioComp.value} m
`;
  }

  txt += `
--- REVESTIMENTO ---
Material: ${tipoRevestimento.value}
Classe: ${classeRevestimento.value}

--- FILTROS ---
`;

  document.querySelectorAll(".filtro").forEach((f, i) => {
    txt += `Filtro ${i + 1}: ${f.querySelector(".de").value} – ${f.querySelector(".ate").value} m\n`;
  });

  txt += `
--- HIDRÁULICA ---
Vazão do Poço: ${vazaoPoco.value}
Vazão da Bomba: ${vazaoBomba.value}
Posição da Bomba: ${posBomba.value}
NE: ${ne.value}
ND: ${nd.value}

--- GEOLOGIA ---
${geologia.value}

--- FRATURAS ---
${fraturas.value || "-"}

--- OBSERVAÇÕES ---
${observacoes.value || "-"}
`;

  /* ===== HTML VISUAL ===== */

  const html = `
    <h3>Cliente</h3>
    <p><b>${cliente.value}</b><br>${cidade.value} / ${estado.value}</p>

    <h3>Perfuração</h3>
    <ul>
      <li>Polegada inicial: ${polInicial.value}</li>
      <li>Polegada final: ${polFinal.value}</li>
      <li>Qtd inicial: ${metrosInicial?.value || "-"}</li>
      <li>Profundidade total: ${profundidade.value} m</li>
    </ul>

    ${temSanitario.value === "sim" ? `
    <h3>Sanitário</h3>
    <ul>
      <li>Polegada: ${sanitarioPol.value}</li>
      <li>Comprimento: ${sanitarioComp.value} m</li>
    </ul>` : ""}

    <h3>Revestimento</h3>
    <ul>
      <li>Material: ${tipoRevestimento.value}</li>
      <li>Classe: ${classeRevestimento.value}</li>
    </ul>

    <h3>Filtros</h3>
    <ul>
      ${[...document.querySelectorAll(".filtro")].map((f,i)=>`
        <li>Filtro ${i+1}: ${f.querySelector(".de").value} – ${f.querySelector(".ate").value} m</li>
      `).join("")}
    </ul>

    <h3>Hidráulica</h3>
    <ul>
      <li>Vazão do poço: ${vazaoPoco.value}</li>
      <li>Vazão da bomba: ${vazaoBomba.value}</li>
      <li>Posição da bomba: ${posBomba.value}</li>
      <li>NE: ${ne.value}</li>
      <li>ND: ${nd.value}</li>
    </ul>

    <h3>Geologia</h3>
    <p>${geologia.value}</p>

    <h3>Fraturas</h3>
    <p>${fraturas.value || "-"}</p>

    <h3>Observações</h3>
    <p>${observacoes.value || "-"}</p>
  `;

  document.getElementById("resumoConteudo").innerHTML = html;
  window.__resumoTXT = txt;
}

/* =========================
   DOWNLOAD
========================= */

function baixarResumo() {
  const blob = new Blob([window.__resumoTXT], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "cadastro_poco.txt";
  link.click();
}

/* =========================
   EMAIL
========================= */

function enviarEmail() {
  const assunto = encodeURIComponent("Cadastro Técnico de Poço");
  const corpo = encodeURIComponent(window.__resumoTXT);
  window.location.href = `mailto:?subject=${assunto}&body=${corpo}`;
}

/* =========================
   INIT
========================= */

showStep(step);
