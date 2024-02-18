export const handlingMessages = (mensagem) => {
  const mensagemJSON = JSON.parse(mensagem);
  let resposta = "";

  if (mensagemJSON.type === "dragontiger.cardDealt") {
    const cartas = mensagemJSON.args.cards;

    if ("Dragon" in cartas && "Tiger" in cartas) {
      resposta = `

      🤖 Resultados Football Studio (Dev Eduardo Souza) 
      Casa [${cartas.Dragon.card}] x [${cartas.Tiger.card}] Visitante

    `;
    }
  }

  return resposta;
};
