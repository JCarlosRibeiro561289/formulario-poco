function gerarResumoFinal() {

  const pi = n(polInicial.value);
  const pf = n(polFinal.value);
  const prof = n(profundidade.value);
  const mi = n(metrosInicial.value);

  let txt = `
=== CADASTRO TÉCNICO DE POÇO ===

CLIENTE
Cliente: ${cliente.value}
Documento: ${documento.value}
Endereço: ${endereco.value}
Cidade/UF: ${cidade.value} - ${estado.value}

--------------------------------

PERFURAÇÃO
`;

  if (pi === pf) {
    txt += `Ø Poço: ${pi}" (0 – ${prof} m)\n`;
  } else {
    txt += `Ø Inicial: ${pi}" (0 – ${mi} m)\n`;
    txt += `Ø Final: ${pf}" (${mi} – ${prof} m)\n`;
  }

  txt += `Profundidade Total: ${prof} m\n`;

  if (temSanitario.value === "sim") {
    txt += `
--------------------------------
SANITÁRIO
Ø Inicial: ${sanitarioPol.value}" (0 – ${sanitarioComp.value} m)
TIPO: ${tipoRevestimento.value}
`;
  }

  txt += `
--------------------------------
FILTROS E REVESTIMENTOS
`;

  let filtros = [];
  document.querySelectorAll(".filtro").forEach(f => {
    filtros.push({
      de: n(f.querySelector(".de").value),
      ate: n(f.querySelector(".ate").value)
    });
  });

  filtros.sort((a, b) => a.de - b.de);

  let atual = 0;
  filtros.forEach(f => {
    if (atual < f.de) {
      txt += `${atual} – ${f.de} m  LISOS\n`;
    }
    txt += `${f.de} – ${f.ate} m  FILTROS\n`;
    atual = f.ate;
  });

  if (atual < prof) {
    txt += `${atual} – ${prof} m  LISOS\n`;
  }

  txt += `
--------------------------------
DADOS HIDRÁULICOS
Vazão do Poço: ${vazaoPoco.value}
Vazão da Bomba: ${vazaoBomba.value}
Posição da Bomba: ${posBomba.value}
NE: ${ne.value}
ND: ${nd.value}

--------------------------------
GEOLOGIA
${geologia.value || "-"}

--------------------------------
FRATURAS
${fraturas.value || "-"}

--------------------------------
OBSERVAÇÕES
${observacoes.value || "-"}
`;

  resumoConteudo.innerHTML = `<pre>${txt}</pre>`;
  window.__resumoTXT = txt;
}
