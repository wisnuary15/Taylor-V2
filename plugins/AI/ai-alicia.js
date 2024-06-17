import fetch from "node-fetch";
export async function before(m) {
  const { alicia: alicia } = db.data.chats[m.chat] || {};
  if (m.isBaileys || !alicia || !m.text) return !1;
  const text = m.text.replace(/[^\x00-\x7F]/g, "").trim();
  if (!text) return !1;
  const url = `https://api.azz.biz.id/api/alicia?q=${encodeURIComponent(text)}&user=${m.name}&key=global`;
  try {
    const api = await fetch(url),
      res = await api.json();
    if (res.respon) return await conn.reply(m.chat, ` * alicia says: * \n${res.respon || ""}`, m),
      "ALICIA STOP" === text.trim().toUpperCase() && (alicia = !1, await conn.reply(m.chat, " * alicia stop success * ", m)),
      !0;
  } catch {}
  return await conn.reply(m.chat, " * alicia error * ", m), !0;
}