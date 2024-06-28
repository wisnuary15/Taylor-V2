let handler = async (m) => {
    m.reply('Kenapa manggil ownerku!');
};

handler.command = /^(wisnu|ary|swadana)$/i;

export default handler;