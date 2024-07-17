import {
  tebakkata
} from "@bochilteam/scraper";
class HangmanGame {
  constructor(id) {
    this.sessionId = id, this.guesses = [], this.maxAttempts = 0, this.currentStage = 0;
  }
  getRandomQuest = async () => {
    try {
      const {
        jawaban,
        soal
      } = await tebakkata();
      return {
        clue: soal,
        quest: jawaban.toLowerCase()
      };
    } catch (error) {
      throw console.error("Error fetching random quest:", error), new Error("Failed to fetch a random quest.");
    }
  };
  initializeGame = async () => {
    try {
      this.quest = await this.getRandomQuest(), this.maxAttempts = this.quest.quest.length;
    } catch (error) {
      throw console.error("Error initializing game:", error), new Error("Failed to initialize the game.");
    }
  };
  displayBoard = () => {
    const emojiStages = ["😐", "😕", "😟", "😧", "😢", "😨", "😵"];
    return `*Current Stage:* ${emojiStages[this.currentStage]}\n\`\`\`==========\n|    |\n|   ${emojiStages[this.currentStage]}\n|   ${this.currentStage >= 3 ? "/" : ""}${this.currentStage >= 4 ? "|" : ""}${this.currentStage >= 5 ? "\\" : ""} \n|   ${this.currentStage >= 1 ? "/" : ""} ${this.currentStage >= 2 ? "\\" : ""} \n|      \n|      \n==========\`\`\`\n*Clue:* ${this.quest.clue}`;
  };
  displayWord = () => this.quest.quest.split("").map(char => this.guesses.includes(char) ? `${char}` : "__").join(" ");
  makeGuess = letter => this.isAlphabet(letter) ? (letter = letter.toLowerCase(), this.guesses.includes(letter) ? "repeat" : (this.guesses.push(letter), this.quest.quest.includes(letter) || (this.currentStage = Math.min(this.quest.quest.length, this.currentStage + 1)), this.checkGameOver() ? "over" : this.checkGameWin() ? "win" : "continue")) : "invalid";
  isAlphabet = letter => /^[a-zA-Z]$/.test(letter);
  checkGameOver = () => this.currentStage >= this.maxAttempts;
  checkGameWin = () => [...new Set(this.quest.quest)].every(char => this.guesses.includes(char));
  getHint = () => `*Hint:* ${this.quest.quest}`;
}
const handler = async (m, {
  conn,
  usedPrefix,
  command,
  args
}) => {
  conn.hangman = conn.hangman || {};
  let [action, inputs] = args;
  try {
    switch (action) {
      case "end":
        conn.hangman[m.chat] && conn.hangman[m.chat].sessionId === m.sender ? (delete conn.hangman[m.chat], m.reply("Berhasil keluar dari sesi Hangman. 👋")) : m.reply("Tidak ada sesi Hangman yang sedang berlangsung atau Anda bukan pemainnya.");
        break;
      case "start":
        if (conn.hangman[m.chat]) m.reply(`Sesi Hangman sudah berlangsung. Gunakan ${usedPrefix + command} *end* untuk mengakhiri sesi.`);
        else {
          conn.hangman[m.chat] = new HangmanGame(m.sender);
          const gameSession = conn.hangman[m.chat];
          await gameSession.initializeGame(), m.reply(`Sesi Hangman dimulai. 🎉\n\n*Session ID:* ${gameSession.sessionId}\n${gameSession.displayBoard()}\n\n*Tebakan Kata:*\n${gameSession.displayWord()}\n\nKirim huruf untuk menebak, contoh: *${usedPrefix + command} guess a*`);
        }
        break;
      case "guess":
        if (conn.hangman[m.chat]) {
          if (!inputs || !/^[a-zA-Z]$/.test(inputs)) return void m.reply(`Masukkan huruf yang ingin ditebak setelah *guess*. Contoh: *${usedPrefix + command} guess a*`);
          const gameSession = conn.hangman[m.chat],
            userGuess = inputs.toLowerCase(),
            result = gameSession.makeGuess(userGuess),
            messages = {
              invalid: "Masukkan huruf yang valid.",
              repeat: "Anda sudah menebak huruf ini sebelumnya. Coba huruf lain.",
              continue: `*Huruf yang Sudah Ditebak:*\n${gameSession.guesses.join(", ")}\n${gameSession.displayBoard()}\n\n*Tebakan Kata:*\n${gameSession.displayWord()}\n\n*Attempts Left:* ${gameSession.maxAttempts - gameSession.currentStage}`,
              over: `Game Over! Kamu kalah. Kata yang benar adalah *${gameSession.quest.quest}*. 💀`,
              win: "Selamat! Kamu menang dalam permainan Hangman. 🎉"
            };
          m.reply(messages[result]), "over" !== result && "win" !== result || delete conn.hangman[m.chat];
        } else m.reply("Tidak ada sesi Hangman yang sedang berlangsung. Gunakan *start* untuk memulai sesi.");
        break;
      case "hint":
        if (conn.hangman[m.chat]) {
          const gameSession = conn.hangman[m.chat];
          m.reply(gameSession.getHint());
        } else m.reply("Tidak ada sesi Hangman yang sedang berlangsung. Gunakan *start* untuk memulai sesi.");
        break;
      case "help":
        m.reply(`🎮 *Hangman Game* 🎮\n\n*Commands:*\n- *${usedPrefix + command} start :* Memulai permainan Hangman.\n- *${usedPrefix + command} end :* Keluar dari sesi permainan.\n- *${usedPrefix + command} guess [huruf] :* Menebak huruf dalam kata.\n- *${usedPrefix + command} hint :* Mendapatkan petunjuk kata.`);
        break;
      default:
        m.reply(`Aksi tidak valid. Gunakan ${usedPrefix + command} *help* untuk melihat cara menggunakan perintah.`);
    }
  } catch (error) {
    console.error("Error in hangman handler:", error), m.reply("Terjadi kesalahan dalam menangani permainan Hangman. Mohon coba lagi.");
  }
};
handler.menu = ["hangman"], handler.tags = ["game"], handler.command = /^(hangman)$/i,
  handler.group = !0, handler.limit = !0;
export default handler;
