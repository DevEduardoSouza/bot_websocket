export const handlingMessages = (mensagem) => {
  const mensagemJSON = JSON.parse(mensagem);
  let resposta = "";

  // Mapeamento das cartas
  const cardMapping = {
    '2C': '2 ♣️', '3C': '3 ♣️', '4C': '4 ♣️', '5C': '5 ♣️',
    '6C': '6 ♣️', '7C': '7 ♣️', '8C': '8 ♣️', '9C': '9 ♣️',
    'TC': '10 ♣️', 'JC': 'J ♣️', 'QC': 'Q ♣️', 'KC': 'K ♣️', 'AC': 'A ♣️',

    '2H': '2 ♥️', '3H': '3 ♥️', '4H': '4 ♥️', '5H': '5 ♥️',
    '6H': '6 ♥️', '7H': '7 ♥️', '8H': '8 ♥️', '9H': '9 ♥️',
    'TH': '10 ♥️', 'JH': 'J ♥️', 'QH': 'Q ♥️', 'KH': 'K ♥️', 'AH': 'A ♥️',

    '2D': '2 ♦️', '3D': '3 ♦️', '4D': '4 ♦️', '5D': '5 ♦️',
    '6D': '6 ♦️', '7D': '7 ♦️', '8D': '8 ♦️', '9D': '9 ♦️',
    'TD': '10 ♦️', 'JD': 'J ♦️', 'QD': 'Q ♦️', 'KD': 'K ♦️', 'AD': 'A ♦️',

    '2S': '2 ♠️', '3S': '3 ♠️', '4S': '4 ♠️', '5S': '5 ♠️',
    '6S': '6 ♠️', '7S': '7 ♠️', '8S': '8 ♠️', '9S': '9 ♠️',
    'TS': '10 ♠️', 'JS': 'J ♠️', 'QS': 'Q ♠️', 'KS': 'K ♠️', 'AS': 'A ♠️'
  };

  if (mensagemJSON.type === "dragontiger.cardDealt") {
    const cartas = mensagemJSON.args.cards;

    if ("Dragon" in cartas && "Tiger" in cartas) {
      const dragonCard = cartas.Dragon.card;
      const tigerCard = cartas.Tiger.card;
      const dragonCardMapped = cardMapping[dragonCard] || dragonCard;
      const tigerCardMapped = cardMapping[tigerCard] || tigerCard;

      resposta = `
        🤖 Resultados Football Studio (Dev Eduardo Souza) 
        Casa [${dragonCardMapped}] x [${tigerCardMapped}] Visitante
      `;
    }
  }

  return resposta;
};
