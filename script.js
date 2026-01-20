function alternarRevestimento() {
  const tipo = tipoRevPoco.value;
  areaFiltros.classList.toggle("hidden", tipo !== "total");
  revComprimento.classList.toggle("hidden", tipo === "total");
}

function addFiltro() {
  const div = document.createElement("div");
  div.className = "filtro";
  div.innerHTML = `
    <input class="ini" type="number" placeholder="Início (m)">
    <input class="fim" type="number" placeholder="Fim (m)">
  `;
  filtros.appendChild(div);
}

function gerarResumo() {
  const prof = +profundidade.value;
  const ndv = +nd.value;
  const bomba = +posBomba.value;

  if (ndv >= bomba) {
    alert("ND não pode ser maior ou igual à posição da bomba");
    return;
  }

  const dados = {
    cliente: cliente.value,
    documento: documento.value,
    endereco: endereco.value,
    empresa: empresa.value,
    metodo: metodo.value,
    profundidade: prof,
    materialRev: materialRev.value,
    polRev: polRev.value,
    compRev: compRev.value,
    ne: ne.value,
    nd: nd.value,
    posBomba: posBomba.value,
    vazPoco: vazPoco.value,
    vazBomba: vazBomba.value,
    geologia: geologia.value,
    fraturas: fraturas.value
  };

  mostrarResumo(dados);
}

function mostrarResumo(d) {
  let html = `
  <div class="card resumo-card">
    <h2>Resumo do Poço</h2>

    <h3>Cliente</h3>
    <p><b>${d.cliente}</b></p>
    <p>${d.endereco}</p>

    <h3>Perfuração</h3>
    <p>Empresa: ${d.empresa}</p>
    <p>Método: ${d.metodo}</p>
    <p>Profundidade: ${d.profundidade} m</p>

    <h3>Hidráulica</h3>
    <p>NE: ${d.ne} m</p>
    <p>ND: ${d.nd} m</p>
    <p>Bomba: ${d.posBomba} m</p>

    <div class="nav">
      <button onclick="location.reload()">Editar</button>
      <button onclick="alert('PDF + Email (próxima etapa)')">Confirmar e Enviar</button>
    </div>
  </div>
  `;
  app.classList.add("hidden");
  resumo.innerHTML = html;
  resumo.classList.remove("hidden");
}
