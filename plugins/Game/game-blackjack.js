class Blackjack {
  decks;
  state = "waiting";
  player = [];
  dealer = [];
  table = {
    player: {
      total: 0,
      cards: []
    },
    dealer: {
      total: 0,
      cards: []
    },
    bet: 0,
    payout: 0,
    doubleDowned: !1
  };
  cards;
  endHandlers = [];
  constructor(decks) {
    this.decks = validateDeck(decks);
  }
  placeBet(bet) {
    if (bet <= 0) throw new Error("You must place a bet greater than 0");
    this.table.bet = bet;
  }
  start() {
    if (this.table.bet <= 0) throw new Error("You must place a bet before starting the game");
    let dealerFirstCard;
    this.cards = new Deck(this.decks), this.cards.shuffleDeck(2), this.player = this.cards.dealCard(2);
    do {
      dealerFirstCard = this.cards.dealCard(1)[0];
    } while (dealerFirstCard.value > 11);
    return this.dealer = [dealerFirstCard, ...this.cards.dealCard(1)], this.updateTable(),
      this.table;
  }
  hit() {
    if ("waiting" === this.state) {
      const newCard = this.cards.dealCard(1)[0];
      this.player.push(newCard), this.updateTable();
      const playerSum = sumCards(this.player);
      return playerSum === sumCards(this.dealer) ? (this.state = "draw", this.emitEndEvent()) : 21 === playerSum ? (this.state = "player_blackjack", this.emitEndEvent()) : playerSum > 21 && (this.state = "dealer_win", this.emitEndEvent()), this.table;
    }
  }
  stand() {
    let dealerSum = sumCards(this.dealer),
      playerSum = sumCards(this.player);
    if (playerSum <= 21)
      for (; dealerSum < 17;) this.dealer.push(...this.cards.dealCard(1)),
        dealerSum = sumCards(this.dealer), this.updateTable();
    this.state = playerSum <= 21 && (dealerSum > 21 || dealerSum < playerSum) ? 21 === playerSum ? "player_blackjack" : "player_win" : dealerSum === playerSum ? "draw" : 21 === dealerSum ? "dealer_blackjack" : "dealer_win",
      this.emitEndEvent();
  }
  doubleDown() {
    if (!this.canDoubleDown()) throw new Error("You can only double down on the first turn");
    this.table.doubleDowned = !0, this.player.push(...this.cards.dealCard(1)),
      this.updateTable(), this.stand();
  }
  calculatePayout() {
    "player_blackjack" === this.state ? this.table.payout = 1.5 * this.table.bet : "player_win" === this.state ? this.table.payout = this.table.bet : "dealer_win" === this.state || "dealer_blackjack" === this.state ? this.table.payout = 0 : "draw" === this.state && (this.table.payout = this.table.bet),
      this.table.doubleDowned && "draw" !== this.state && (this.table.payout *= 2),
      this.table.payout = Math.round(this.table.payout);
  }
  canDoubleDown() {
    return "waiting" === this.state && 2 === this.player.length;
  }
  onEnd(handler) {
    this.endHandlers.push(handler);
  }
  emitEndEvent() {
    this.calculatePayout();
    for (let handler of this.endHandlers) handler({
      state: this.state,
      player: formatCards(this.player),
      dealer: formatCards(this.dealer),
      bet: this.table.bet,
      payout: this.table.payout
    });
  }
  updateTable() {
    this.table.player = formatCards(this.player), this.table.dealer = formatCards(this.dealer);
  }
}
class Deck {
  deck = [];
  dealtCards = [];
  constructor(decks) {
    for (let i = 0; i < decks; i++) this.createDeck();
  }
  createDeck() {
    const card = (suit, value) => {
        let name = value + " of " + suit;
        return (value.toUpperCase().includes("J") || value.toUpperCase().includes("Q") || value.toUpperCase().includes("K")) && (value = "10"),
          value.toUpperCase().includes("A") && (value = "11"), {
            name: name,
            suit: suit,
            value: +value
          };
      },
      values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
      suits = ["♣️", "♦️", "♠️", "♥️"];
    for (let s = 0; s < suits.length; s++)
      for (let v = 0; v < values.length; v++) this.deck.push(card(suits[s], values[v]));
  }
  shuffleDeck(amount = 1) {
    for (let i = 0; i < amount; i++)
      for (let c = this.deck.length - 1; c >= 0; c--) {
        const tempVal = this.deck[c];
        let randomIndex = Math.floor(Math.random() * this.deck.length);
        for (; randomIndex === c;) randomIndex = Math.floor(Math.random() * this.deck.length);
        this.deck[c] = this.deck[randomIndex], this.deck[randomIndex] = tempVal;
      }
  }
  dealCard(numCards) {
    const cards = [];
    for (let c = 0; c < numCards; c++) {
      const dealtCard = this.deck.shift();
      dealtCard && (cards.push(dealtCard), this.dealtCards.push(dealtCard));
    }
    return cards;
  }
}

function sumCards(cards) {
  let value = 0,
    numAces = 0;
  for (const card of cards) value += card.value, numAces += 11 === card.value ? 1 : 0;
  for (; value > 21 && numAces > 0;) value -= 10;
  return value;
}

function formatCards(cards) {
  return {
    total: sumCards(cards),
    cards: cards
  };
}

function validateDeck(decks) {
  if (!decks) throw new Error("A deck must have a number of decks");
  if (decks < 1) throw new Error("A deck must have at least 1 deck");
  if (decks > 8) throw new Error("A deck can have at most 8 decks");
  return decks;
}
const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }),
  templateBlackjackMessage = (usedPrefix, command, conn, m, blackjack) => {
    const {
      table,
      state
    } = blackjack, {
      bet,
      dealer,
      player,
      payout
    } = table;
    let message = "";
    const dealerCards = dealer.cards.map(card => `${card.name}`).join(", "),
      dealerTotal = dealer.total,
      playerCards = player.cards.map(card => `${card.name}`).join(", "),
      playerTotal = player.total;
    let hiddenDealerCards = dealer.cards.slice(0, -1).map(card => `${card.name}`).join(", ");
    switch (dealer.cards.length > 1 ? hiddenDealerCards += ", ❓" : hiddenDealerCards += `, ${dealer.cards[0]?.name}`, state) {
      case "player_win":
      case "dealer_win":
      case "draw":
      case "player_blackjack":
      case "dealer_blackjack":
        hiddenDealerCards = dealer.cards.map(card => `${card.name}`).join(", "),
          message = `*\`🃏 • B L A C K J A C K •\`*\n\n╭───┈ •\n│ *Your Cards:*\n│ \`${playerCards}\`\n│ *Your Total:*\n│ \`${playerTotal}\`\n├───┈ •\n│ *Dealer's Cards:*\n│ \`${dealerCards}\`\n│ *Dealer's Total:*\n│ \`${dealerTotal > 21 ? "BUST" : dealerTotal}\`\n╰───┈ •\n\n> *\`${("player_win" === state ? "You win! 🎉" : "dealer_win" === state ? "Dealer wins. 😔" : "draw" === state ? "Draw. 🤝" : "player_blackjack" === state ? "Blackjack! 🥳" : "Dealer got Blackjack! 😔").toUpperCase()}\`*\n*Bet:*\n- \`\`\`${formatter.format(bet)}\`\`\`\n*Payout:*\n- \`\`\`${formatter.format(payout)}\`\`\`\n`,
          db.data.users[conn.blackjack[m.chat].idPemain].money += payout, delete conn.blackjack[m.chat];
        break;
      default:
        message = `*\`🃏 • B L A C K J A C K •\`*\n\n╭───┈ •\n│ *Your Cards:*\n│ \`${playerCards}\`\n│ *Your Total:*\n│ \`${playerTotal}\`\n├───┈ •\n│ *Dealer's Cards:*\n│ \`${hiddenDealerCards}\`\n│ *Dealer's Total:*\n│ \`${dealerTotal > 21 ? "BUST" : "❓"}\`\n╰───┈ •\n\n*Bet:*\n- \`\`\`${formatter.format(bet)}\`\`\`\n\nType *\`${usedPrefix + command} hit\`* to draw a card.\nType *\`${usedPrefix + command} stand\`* to end your turn.`;
    }
    return message;
  },
  handler = async (m, {
    conn,
    usedPrefix,
    command,
    args
  }) => {
    conn.blackjack = conn.blackjack || {};
    let [aksi, argumen] = args;
    try {
      switch (aksi) {
        case "end":
          conn.blackjack[m.chat].idPemain === m.sender ? (delete conn.blackjack[m.chat], await conn.reply(m.chat, "*Anda keluar dari sesi blackjack.* 👋", m)) : await conn.reply(m.chat, "*Tidak ada sesi blackjack yang sedang berlangsung atau Anda bukan pemainnya.*", m);
          break;
        case "start":
          if (conn.blackjack[m.chat]) await conn.reply(m.chat, `*Sesi blackjack sudah berlangsung.* Gunakan *${usedPrefix + command} end* untuk keluar dari sesi.`, m);
          else {
            conn.blackjack[m.chat] = new Blackjack(1), conn.blackjack[m.chat].idPemain = m.sender;
            let betAmount = argumen ? parseInt(argumen) : 1e3;
            conn.blackjack[m.chat].placeBet(betAmount), conn.blackjack[m.chat].start();
            const table = conn.blackjack[m.chat],
              pesanStart = templateBlackjackMessage(usedPrefix, command, conn, m, table);
            await conn.reply(m.chat, pesanStart, m);
          }
          break;
        case "hit":
          if (!conn.blackjack[m.chat] || conn.blackjack[m.chat].idPemain !== m.sender) {
            await conn.reply(m.chat, "*Anda tidak sedang bermain blackjack atau bukan pemainnya.*", m);
            break;
          }
          conn.blackjack[m.chat].hit();
          const tableHit = conn.blackjack[m.chat],
            pesanHit = templateBlackjackMessage(usedPrefix, command, conn, m, tableHit);
          await conn.reply(m.chat, pesanHit, m);
          break;
        case "stand":
          if (!conn.blackjack[m.chat] || conn.blackjack[m.chat].idPemain !== m.sender) {
            await conn.reply(m.chat, "*Anda tidak sedang bermain blackjack atau bukan pemainnya.*", m);
            break;
          }
          conn.blackjack[m.chat].stand();
          const tableStand = conn.blackjack[m.chat],
            pesanStand = templateBlackjackMessage(usedPrefix, command, conn, m, tableStand);
          await conn.reply(m.chat, pesanStand, m);
          break;
        case "double":
          if (!conn.blackjack[m.chat] || conn.blackjack[m.chat].idPemain !== m.sender) {
            await conn.reply(m.chat, "*Anda tidak sedang bermain blackjack atau bukan pemainnya.*", m);
            break;
          }
          conn.blackjack[m.chat].doubleDown();
          const tableDouble = conn.blackjack[m.chat],
            pesanDouble = templateBlackjackMessage(usedPrefix, command, conn, m, tableDouble);
          await conn.reply(m.chat, pesanDouble, m);
          break;
        default:
          await conn.reply(m.chat, `*Perintah tidak valid.*\nGunakan *${usedPrefix + command} start* untuk memulai sesi blackjack.`, m);
      }
    } catch (err) {
      console.error(err), await conn.reply(m.chat, "*Terjadi kesalahan saat memproses perintah.*", m);
    }
  };
handler.command = ["blackjack"], handler.tags = ["game"], handler.help = ["blackjack"];
export default handler;
