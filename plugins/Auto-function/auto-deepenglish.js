import {
  fetch
} from 'undici';
export async function before(m) {
  this.deepenglish = this.deepenglish || {};
  const chat = db.data.chats[m.chat];
  if (m.isBaileys || !m.text || !chat.deepenglish) return false;
  let text = m.text;
  try {
    if (chat.deepenglish) {
      const itsFirst = this.deepenglish[m.chat] || {
        first: true
      };
      if (itsFirst) {
        if (!m.quoted || !m.quoted?.fromMe || !m.quoted?.isBaileys || !m.text) return true;
        this.deepenglish = this.deepenglish || {};
        if (!this.deepenglish[m.chat] || m.quoted?.id != this.deepenglish[m.chat].msg.key.id) return;
        let txt = (m.msg && m.msg.selectedDisplayText ? m.msg.selectedDisplayText : m.text ? m.text : '');
        const openAIResponse = await Deepenglish(txt)
        const result = openAIResponse;
        if (result) {
          let soal = await this.sendMessage(m.chat, {
            text: result,
            mentions: [m.sender]
          }, {
            quoted: m
          });
          this.deepenglish[m.chat].msg = soal;
          if (this.deepenglish[m.chat].first = false) {
            await this.sendMessage(m.chat, {
              delete: this.deepenglish[m.chat].msg.key.id
            });
          }
          this.deepenglish[m.chat].first = false;
        }
      }
    }
  } catch {
    //this.reply(m.chat, 'Error occurred.', m);
  }
}
export const disabled = false;
async function Deepenglish(input) {
  const messages = [{
    role: "assistant",
    content: "Saya AI dari OpenAI, diciptakan untuk membantu Anda mengeksplorasi ide, bertukar informasi, dan menyelesaikan masalah. Ada yang bisa saya bantu?"
  }, {
    role: "user",
    content: input
  }];
  try {
    const response = await fetch("https://deepenglish.com/wp-json/ai-chatbot/v1/chat", {
      method: "POST",
      headers: {
        Accept: "text/event-stream",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages
      })
    });
    const result = await response.json();
    return result.answer;
  } catch (error) {
    console.error("An error occurred during data fetching:", error);
    throw error;
  }
}
