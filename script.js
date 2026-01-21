function gerarResumo(){

  if(!cliente.value || !empresa.value || !encarregado.value ||
     !profundidade.value || !diamInicial.value || !diamFinal.value){
    alert("Existem campos obrigatórios não preenchidos.");
    return;
  }

  let filtrosHTML = "";
  document.querySelectorAll(".filtro-item").forEach((f,i)=>{
    const ini = f.querySelector(".filtroIni").value;
    const fim = f.querySelector(".filtroFim").value;
    if(ini && fim){
      filtrosHTML += `<li>Filtro ${i+1}: ${ini} m até ${fim} m</li>`;
    }
  });

  resumo.innerHTML = `
    <h2>Resumo do Poço</h2>

    <h3>Cliente</h3>
    <p><strong>${cliente.value}</strong></p>
    <p>${documento.value || ""}</p>
    <p>${endereco.value || ""} - ${cidade.value || ""}/${estado.value || ""}</p>

    <h3>Perfuração</h3>
    <p>${empresa.value} – ${metodo.value}</p>
    <p>Encarregado: ${encarregado.value}</p>

    <h3>Poço</h3>
    <p>Profundidade: ${profundidade.value} m</p>
    <p>Diâmetro: ${diamInicial.value}" → ${diamFinal.value}"</p>

    <h3>Proteção Sanitária</h3>
    <p>${temSanitario.value === "sim" ? 
      `${sanitarioMaterial.value} – ${sanitarioPol.value}" (${sanitarioComp.value} m)` 
      : "Não possui"}</p>

    <h3>Revestimento</h3>
    <p>${tipoRev.value} – ${revMaterial.value} – ${revPol.value}"</p>
    <p>Pré-filtro: ${prefiltro.value}</p>

    ${filtrosHTML ? `<ul>${filtrosHTML}</ul>` : ""}

    <h3>Hidráulica</h3>
    <p>NE: ${ne.value} m | ND: ${nd.value} m</p>
    <p>Bomba: ${posBomba.value} m</p>
    <p>Vazão do Poço: ${vazaoPoco.value}</p>
    <p>Vazão da Bomba: ${vazaoBomba.value}</p>

    <h3>Geologia</h3>
    <p>${geologia.value || "-"}</p>
    <p>Fraturas: ${fraturas.value || "-"}</p>

    <h3>Observações</h3>
    <p>${observacao.value || "-"}</p>

    <div class="actions">
      <button type="button" onclick="prevStep()">Editar</button>
      <button type="button" onclick="enviar()">Enviar</button>
    </div>
  `;

  nextStep();
}
