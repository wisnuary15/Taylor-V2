import fetch from "node-fetch";
export async function before(m) {
  if (m.isBaileys || !db.data.chats[m.chat].simi || !m.text) return !1;
  const text = m.text.replace(/[^\x00-\x7F]/g, "").trim();
  if (!text) return !1;
  const urls = [`https://api.simsimi.net/v2/?text=${encodeURIComponent(text)}&lc=id`, `http://api.brainshop.ai/get?bid=153868&key=rcKonOgrUFmn5usX&uid=1&msg=${encodeURIComponent(text)}`];
  for (const url of urls) try {
    const api = await fetch(url),
      res = await api.json();
    if (res.success || res.cnt) return await this.reply(m.chat, `*Simi says:*\n${res.success || res.cnt}`, m), "SIMI STOP" === text.trim().toUpperCase() && (db.data.chats[m.chat].simi = !1, await this.reply(m.chat, "*Simi stop success*", m)), !0;
  } catch {
    continue;
  }
  return await this.reply(m.chat, "*Simi error*", m), !0;
}
