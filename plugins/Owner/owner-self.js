const handler = async (m, {
    conn,
    command
}) => {
    let isPublic = command === "public";
    let self = opts["self"];
    if (self === isPublic) return m.reply(`Dah ${isPublic ? "Public" : "Self"} dari tadi ${m.sender.split("@")[0] === owner[1] ? "Mbak" : "Bang"} :v`);
    opts["self"] = isPublic;
    m.reply(`Berhasil ${isPublic ? "Public" : "Self"} bot!`);
};
handler.help = ["self", "public"];
handler.tags = ["owner"];
handler.rowner = true;
handler.command = /^(self|public)$/i;
export default handler;
