let handler = async (m) => {
    m.reply('Hello!');
};

handler.command = /^(cek|tes|a|p|woi|pp|hey)$/i;

export default handler;
