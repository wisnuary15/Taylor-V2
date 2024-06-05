import fetch from "node-fetch"
const handler = async (m, {
    conn,
    usedPrefix,
    args,
    command
}) => {
    let query = "Masukkan link yang ingin di jadikan pdf!"
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else throw query
    m.reply(wait)
    if (!isValidURL(text)) return m.reply("Link tidak ada!")
    try {
        let gas = "https://api.html2pdf.app/v1/generate?url=" + text + "&apiKey=DzhGk9fhdPope6j8PmVmbxoNDDiWbsFpdeKZfMMrrxtsl3pXCRbfYOd7N4HovaJ1"
        conn.sendFile(m.chat, gas, m.name, text, m)
    } catch (e) {
        m.reply(eror)
    }
}
handler.tags = ["tools"]
handler.command = handler.help = ["url2pdf"]
export default handler

function isValidURL(message) {
    const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/;
    return urlPattern.test(message);
}
