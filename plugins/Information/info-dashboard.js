const handler = async (m, { conn: conn }) => {
  let stats = Object.entries(db.data.stats).map((([key, val]) => {
    let name = Array.isArray(plugins[key].help) ? plugins[key].help?.join("\n• ") : plugins[key].help || key;
    if (!/exec/.test(name)) return {
      name: name,
      ...val
    };
  }));
  stats = stats.sort(((a, b) => b.total - a.total));
  let txt = stats.slice(0, 10).map((({ name: name, total: total, last: last }, idx) => (name.includes("-") && name.endsWith(".js") && (name = name.split("-")[1].replace(".js", "")),
    `${htki} ${idx + 1} ${htka}\n*${htjava} C M D ${htjava}*\n${name}\n\n*${htjava} H I T ${htjava}*\n${total}\n\n*${htjava} T I M E ${htjava}*\n${getTime(last)}\n`))).join`\n\n`;
  await conn.reply(m.chat, txt, m);
};
handler.help = ["dashboard"], handler.tags = ["info"], handler.command = /^^d(as(hbo(ard?|r)|bo(ard?|r))|b)$/i;
export default handler;
export function parseMs(ms) {
  if ("number" != typeof ms) throw "Parameter must be filled with number";
  return {
    days: Math.trunc(ms / 864e5),
    hours: Math.trunc(ms / 36e5) % 24,
    minutes: Math.trunc(ms / 6e4) % 60,
    seconds: Math.trunc(ms / 1e3) % 60,
    milliseconds: Math.trunc(ms) % 1e3,
    microseconds: Math.trunc(1e3 * ms) % 1e3,
    nanoseconds: Math.trunc(1e6 * ms) % 1e3
  };
}
export function getTime(ms) {
  let now = parseMs(+new Date - ms);
  return now.days ? `${now.days} Hari yang lalu` : now.hours ? `${now.hours} Jam yang lalu` : now.minutes ? `${now.minutes} Menit yang lalu` : "Barusan";
}