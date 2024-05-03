import fetch from "node-fetch";

const fetchData = async (url) => {
    const response = await fetch(url);
    return await response.json();
};

const handler = async ({
    conn,
    args,
    usedPrefix,
    command
}) => {
    conn.characterai = conn.characterai ? conn.characterai : {};
    let text = args.length >= 1 ? args.slice(0).join(" ") : (m.quoted && m.quoted?.text || m.quoted?.caption || m.quoted?.description) || null;

    if (!text) throw `*• Example:* ${usedPrefix + command} *[on/off]*
*• Example search Chara:* ${usedPrefix + command} search *[characters name]*`
    const keyword = text.split(" ")[0];
    const data = text.slice(keyword.length + 1);
    if (keyword === "search") {
        if (!data) throw `*• Example:* ${usedPrefix + command} ${keyword} Hutao`
        m.reply(`_🔍searching data.... *[ ${data} ]*_`);
        const search = await fetchData(
            "https://apigratis.site/api/search_characters?query=" + data,
        );
        let karakter = search.result.characters
            .map(
                (a, index) => `*[ ${index + 1}. ${a.participant__name} ]*
*• Greeting:* \`${a.greeting}\`
*• Visibility:* ${a.visibility}
*• Creator:* ${a.user__username}`,
            )
            .join("\n\n");
        const reply = await conn.reply(m.chat, karakter, m, {
            contextInfo: {
                mentionedJid: [],
                groupMentions: [],
                externalAdReply: {
                    title: search.result.characters[0].participant__name,
                    body: search.result.characters[0].greeting,
                    thumbnailUrl: "https://characterai.io/i/200/static/avatars/" + search.result.characters[0].avatar_file_name,
                    sourceUrl: "",
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        });
        await conn.reply(m.chat, `*[ KETIK ANGKA 1 SAMPAI ${search.result.characters.length} ]*
> • _! Pilih karakter anda dengan mengetik *.characterai set (nomor urut)* sesuai dengan pesan diatas_`, reply);
        conn.characterai[m.sender] = {
            pilih: search.result.characters
        };
    } else if (keyword === "set") {
        if (!conn.characterai[m.sender]) throw `*[ KAMU BELUM MENCARI CHARACTER ]*
> _ketik *.characterai search* untuk mencari characters favorit mu_`;
        if (!conn.characterai[m.sender].pilih) throw `*[ KAMU SUDAH PUNYA CHARACTER ]*
> _ketik *.characterai search* untuk menganti characters_`;
        if (!data) throw `*• Example:* ${usedPrefix + command} ${keyword} 1`;
        const pilihan = conn.characterai[m.sender].pilih[data - 1];
        const info = await fetchData("https://apigratis.site/api/character_info?external_id=" + pilihan.external_id);
        const caption = `*[ INFO CHARACTERS NO ${data} ]*
*• Name:* ${pilihan.paeticipant__name}
*• Greeting:* \`${pilihan.greeting}\`
*• Visibily:* ${pilihan.visibility}
*• Description:* ${info.result.character.description}`;
        const q = await conn.reply(m.chat, caption, m, {
            contextInfo: {
                mentionedJid: [],
                groupMentions: [],
                externalAdReply: {
                    title: pilihan.participant__name,
                    body: pilihan.greeting,
                    thumbnailUrl: "https://characterai.io/i/200/static/avatars/" + pilihan.avatar_file_name,
                    sourceUrl: "",
                    mediaType: 1,
                    renderLargerThumbnail: false
                }
            }
        });
        conn.characterai[m.sender] = {
            isChats: false,
            id: pilihan.external_id,
            thumb: "https://characterai.io/i/200/static/avatars/" + pilihan.avatar_file_name,
            name: pilihan.participant__name
        };
    } else if (keyword === "on") {
        if (!conn.characterai[m.sender]) throw `*[ KAMU BELUM MENCARI CHARACTER ]*
> _ketik *.characterai search* untuk mencari characters favorit mu_`;
        conn.characterai[m.sender].isChats = true;
        m.reply("_*[ ✓ ] Room chat berhasil dibuat*_");
    } else if (keyword === "off") {
        if (!conn.characterai[m.sender]) throw `*[ KAMU BELUM MENCARI CHARACTER ]*
> _ketik *.characterai search* untuk mencari characters favorit mu_`;
        conn.characterai[m.sender].isChats = false;
        m.reply("_*[ ✓ ] Berhasil keluar dari Room chat*_");
    }
};

handler.before = async (m, {
    conn,
    usedPrefix
}) => {
    conn.characterai = conn.characterai ? conn.characterai : {};
    if (!m.text) return;
    if (m.text.match(global.prefix)) return;
    if (!conn.characterai[m.sender]) return;
    if (!conn.characterai[m.sender].isChats) return;
    if (!global.db.data.chats[m.chat].characterai) return;
    m.reply("memuat pesan....");
    const chat = await fetchData(`https://onesytex.my.id/api/beta-character-ai?text=${m.text}&external_id=${conn.characterai[m.sender].id}`);
    await conn.reply(m.chat, chat.result.reply, m, {
        contextInfo: {
            mentionedJid: [],
            groupMentions: [],
            externalAdReply: {
                title: conn.characterai[m.sender].name,
                body: null,
                thumbnailUrl: conn.characterai[m.sender].thumb,
                sourceUrl: "",
                mediaType: 1,
                renderLargerThumbnail: false
            }
        }
    });
};

handler.help = ["characterai"];
handler.tags = ["ai"];
handler.command = ["characterai"];
export default handler;