import fetch from "node-fetch";
async function ChatEqing(content) {
  try {
    const formattedDate = new Date().toLocaleString("id-ID", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false
    }).replace(/:/g, ".");
    const response = await fetch("https://chat.eqing.tech/api/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-requested-with": "XMLHttpRequest",
        "x-guest-id": "jwR1jqSQNUaVihChLqQmk",
        useSearch: "false",
        plugins: "0",
        accept: "text/event-stream",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36",
        Referer: "https://chat.eqing.tech/#/chat"
      },
      body: JSON.stringify({
        messages: [{
          role: "system",
          content: `\nCurrent model: gpt-4o-mini\nCurrent time: ${formattedDate}\nLatex inline: $ x^2 $ \nLatex block: $$ e=mc^2 $$\n\n`
        }, {
          role: "user",
          content: content
        }],
        stream: true,
        model: "gpt-4o-mini",
        temperature: .5,
        presence_penalty: 0,
        frequency_penalty: 0,
        top_p: 1,
        chat_token: 63,
        captchaToken: "P1_eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.hadwYXNza2V5xQUZkY1Z98HAIuwgz9AZTo6KUEVGWSNm-7Pu-YPONk9QTTEUkSbxUG63epLUjmhFjBxgKugqfrV0TN_2Vet9iKiqVbCnh6F1oWgqlxjCEyXMIqBw2Ay6r1B8ZEl34s56IZRokGYU6f8C7YZzT5SJkFIvinFbyGgPp24Q71tDj30WiOYs_XHbPqn8PwF-dxcgGgjSmC2Vm6HII9Axnd53ySLDhakLDV5l9V5qjd-pV9t1qXpcjWOS0FEM78MQBQE19pQExamhG0Nga4E1o7Ic5KkIgEfiYzBuxhVWcAqj14WEHFK-R1CRs8qWob6Pi3XvmvGQtJ7EgynPB5FM9bOSUabusKV7_FV9YBXS0bz6HGNKQiYTQa4bVSepMq3nwdtMOFKhdQH8V5cwyaJXqgUNyO8qdJ12x-5PKPqIKNuaXb3dXAk3gs2jzA0MjVBgi7VyBOed1bRTWy-KPNtZoCDFP56bRfbUVgaNpjFGXtXNhPYYXvlYXRcoIgQj2aZSDrU1qJ2nLKEtAOGI4ZqMIIQ61HVYcd5EN703vGGxaSghurdnal8X7BDO-r93yKTj3RucLk4W1y6Sqgwy-UktHhOf4NIXBn4TJ-LzIxCTp9yiSZiaxTPhysCp2IVIjJH9kFswIY-dNRhXgdDNjaVdegLaCjOqRKLzvUpYfjiAIGHBwYRH1xk5CythyBGDnAEHRQUt8_YixAnaTeQWeaPamXT2k8Q3httenqhzT3XTv7uCqe61KfgDE95oJSUOU0u2JjFuBB76NBhkwVAW5UDtJROE0Duydj4fFj-UookNGQ_f_sgEog8P1fcspkPAP8OappJ3WGkIaWDJIzcG8ObaT4awfNwyiEM-rsJCJrUyz6Yk1tMZLcoFCQ0pS28oH4MateWjtyZDxL8uads3qQyqoSgBXscqIcQKN2Tzqj7cqPyxTFvdJD1yADgX3HpcpOqTvQ5EzkQ4Zh_prcEID2gVnH8VMR_4BukZqS-E076VM15Id-9INMDJFaoDk6x2WhtOtJe7ob7osinjzVVGtaZ8sNDJxlEnzwxSt9QOdVQCa-8iCMVrxd85jXXGYVQEbruDFjrP-8LZ_gaDg1kdoPT0ddxfwM_vGW_wsmbX-k869C_C0UBwa5U1yK8wTSpOMi52BfnbgkZHyLdTvDmJRRHvkiL3v50Rz_436ejH8UU_ASFaV8wysM4bP21TOG9k0MahgJJYuHCxhh_hPxbSvEV7Qixlepd6wAjx4Gi2sLVztFF2d7sf7KvqDJMtcmO8Et6oTn16FTdDLRkNvIFn7W3Y89vz-23iWtQQxvihbqzFOc5xDgt2u-dxUoZKPJtQD-kKKpCW75B5K-XgInwtx1Ob9y8dAP6O8yGmvm4qKZjuNYi0jNzstYJvlckfwDFJVyhoCpJaLwj1HW7D4qZLTlWH9-taFvtm-6fF3dwIc5MgNXner5dnZGSRAYCHTF4GMnwXWaKJfDKnqrJRszMxBuJMkxKlL2BXkrHQYOKI0i5rENI4l9VE5aAz15kBAeiHifS_SGa17CjlNGhiSarpviK19vIT1wA3B6187rhhlMP_oHraJ1dIqyef_pzJ7P7BDp2dGtGj8SNoRau6YHrfQhjduJcBTIbxznJITy6D83JEGUS-I7lF_KdnE6-biPmGYyrpJupi6GmfCp6qlsPb6lTXjfRbrCC0WEz5BlAEtFCb7rTVTfLfPZHWawPF54rexO0mSSmT7aubiGGkpbtf6NTgo2V4cM5mzc-eqHNoYXJkX2lkzg9y6m-ia3KoMTQ5MDJjY2aicGQA.V55IkMN8HlHCsFaBMmu39k9KiKRb5Djj9E1R7mGan5s"
      }),
      compress: true
    });
    const result = await response.text();
    return result.split("\n\n").filter(data => data.includes('data: {"id":"chatcmpl')).slice(0, -52).map(data => {
      try {
        return JSON.parse(data.match(/{.*}/)?.[0]);
      } catch (error) {
        return console.error("Error parsing JSON:", error), null;
      }
    }).filter(Boolean).map(data => data.choices[0]?.delta.content).join("");
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  command
}) => {
  if (!db.data.dbai.chateqing) db.data.dbai.chateqing = {};
  const inputText = args.length ? args.join(" ") : m.quoted?.text || m.quoted?.caption || m.quoted?.description || null;
  if (!inputText) {
    return m.reply(`Masukkan teks atau reply pesan dengan teks yang ingin diolah.\nContoh penggunaan:\n*${usedPrefix}${command} Hai, apa kabar?*`);
  }
  m.react(wait);
  try {
    const answer = await ChatEqing(inputText);
    const {
      key: {
        id: keyId
      }
    } = await conn.reply(m.chat, `${answer}`, m);
    db.data.dbai.chateqing[m.sender] = {
      key: {
        id: keyId
      }
    };
    m.react(sukses);
  } catch (error) {
    console.error("Handler error:", error);
    m.react(eror);
  }
};
handler.before = async (m, {
  conn
}) => {
  if (!db.data.dbai.chateqing || m.isBaileys || !(m.sender in db.data.dbai.chateqing)) return;
  const {
    key: {
      id: keyId
    }
  } = db.data.dbai.chateqing[m.sender];
  if (m.quoted?.id === keyId && m.text.trim()) {
    m.react(wait);
    try {
      const answer = await ChatEqing(m.text.trim());
      const {
        key: {
          id: newKeyId
        }
      } = await conn.reply(m.chat, `${answer}`, m);
      db.data.dbai.chateqing[m.sender].key.id = newKeyId;
      m.react(sukses);
    } catch (error) {
      console.error("Handler before error:", error);
      m.react(eror);
    }
  }
};
handler.help = ["chateqing"];
handler.tags = ["ai"];
handler.command = /^(chateqing)$/i;
export default handler;