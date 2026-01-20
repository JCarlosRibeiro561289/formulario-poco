
const tipoColuna = document.getElementById("tipoColuna");
const totalFields = document.getElementById("totalFields");
const parcialFields = document.getElementById("parcialFields");
const filtrosDiv = document.getElementById("filtros");
const form = document.getElementById("pocoForm");
const resumoDiv = document.getElementById("resumo");

tipoColuna.addEventListener("change", () => {
  if (tipoColuna.value === "parcial") {
    totalFields.classList.add("hidden");
    parcialFields.classList.remove("hidden");
  } else {
    totalFields.classList.remove("hidden");
    parcialFields.classList.add("hidden");
  }
});

function adicionarFiltro() {
  const div = document.createElement("div");
  div.className = "filtro";
  div.innerHTML = `
    <input type="number" placeholder="Início (m)">
    <input type="number" placeholder="Fim (m)">
  `;
  filtrosDiv.appendChild(div);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const dados = new FormData(form);
  let resumo = "<h2>Resumo do Poço</h2>";

  dados.forEach((v, k) => {
    if (v) resumo += `<p><strong>${k}:</strong> ${v}</p>`;
  });

  if (tipoColuna.value === "parcial") {
    resumo += "<h3>Filtros</h3>";
    const filtros = document.querySelectorAll(".filtro");
    filtros.forEach((f, i) => {
      const ini = f.children[0].value;
      const fim = f.children[1].value;
      if (ini && fim) {
        resumo += `<p>Filtro ${i + 1}: ${ini} m até ${fim} m</p>`;
      }
    });
  }

  resumo += `<button onclick="editar()">Editar</button>
             <button onclick="enviar()">Enviar</button>`;

  resumoDiv.innerHTML = resumo;
  resumoDiv.classList.remove("hidden");
  form.classList.add("hidden");
});

function editar() {
  resumoDiv.classList.add("hidden");
  form.classList.remove("hidden");
}

function enviar() {
  alert("Na próxima etapa vamos integrar o envio por e-mail.");
}
