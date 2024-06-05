import jsbeautify from 'js-beautify';
const {
    js,
    css,
    html,
    js_beautify,
    css_beautify,
    html_beautify
} = jsbeautify;
const handler = async (m, {
    args,
    command,
    usedPrefix
}) => {
    const usage = "*Example:*\n" + usedPrefix + command + " (Input text or reply text to enc code)"
    let text
    if (args.length >= 1) {
        text = args.slice(0).join(" ")
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text
    } else return m.reply(usage)
    if (command === "beautyjs") {
        try {
            const beautifulJS = js(text);
            m.reply(beautifulJS)
        } catch (e) {
            try {
                const beautifulJS = js_beautify(text);
                m.reply(beautifulJS)
            } catch (e) {
                m.reply(eror)
            }
        }
    }
    if (command === "beautycss") {
        try {
            const beautifulCSS = css(text);
            m.reply(beautifulCSS)
        } catch (e) {
            try {
                const beautifulCSS = css_beautify(text);
                m.reply(beautifulCSS)
            } catch (e) {
                m.reply(eror)
            }
        }
    }
    if (command === "beautyhtml") {
        try {
            const beautifulHTML = html(text);
            m.reply(beautifulHTML)
        } catch (e) {
            try {
                const beautifulHTML = html_beautify(text);
                m.reply(beautifulHTML)
            } catch (e) {
                m.reply(eror)
            }
        }
    }
}
handler.help = ["beauty *[js/css/html]*"]
handler.tags = ["tools"]
handler.command = /^beauty(js|css|html)$/i
export default handler
