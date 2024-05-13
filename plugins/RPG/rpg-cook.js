let handler = async (m, { args, conn }) => {
    let user = global.db.data.users[m.sender];
    let type = (args[0] || '').toLowerCase();
    let count = args[1] && args[1].length > 0 ? Math.min(5, Math.max(parseInt(args[1]), 1)) : 1;

    try {
        switch (type) {
            case 'ayambakar':
            case 'gulaiayam':
            case 'rendang':
            case 'ayamgoreng':
            case 'oporayam':
            case 'steak':
            case 'babipanggang':
            case 'ikanbakar':
            case 'lelebakar':
            case 'nilabakar':
            case 'bawalbakar':
            case 'udangbakar':
            case 'pausbakar':
            case 'kepitingbakar':
                let needed = {
                    ayam: type.includes('ayam') ? count * 2 : 0,
                    sapi: type.includes('sapi') ? count * 2 : 0,
                    babi: type.includes('babi') ? count * 2 : 0,
                    ikan: type.includes('ikan') ? count * 2 : 0,
                    udang: type.includes('udang') ? count * 2 : 0,
                    paus: type.includes('paus') ? count * 2 : 0,
                    kepiting: type.includes('kepiting') ? count * 2 : 0,
                    coal: count
                };

                let errMsg = '';
                for (let item in needed) {
                    if (user[item] < needed[item]) {
                        errMsg += `${item.replace(/^./, item[0].toUpperCase())} (${needed[item]}), `;
                    }
                }

                if (!errMsg) {
                    for (let item in needed) {
                        user[item] -= needed[item];
                    }
                    user[type] += count;
                    conn.reply(m.chat, `Sukses memasak ${count} ${type.replace(/^./, type[0].toUpperCase())} 🍳`, m);
                } else {
                    conn.reply(m.chat, `Anda tidak memiliki bahan untuk memasak ${type} 🥲\nAnda memerlukan: ${errMsg.slice(0, -2)}`, m);
                }
                break;
            default:
                conn.reply(m.chat, cookingMenu, m);
                break;
        }
    } catch (e) {
        console.log(e);
        conn.reply(m.chat, `Sepertinya ada yang error, coba laporin ke owner ya`, m);
    }
}

handler.help = ['masak <masakan> <jumlah>', 'cook <masakan> <jumlah>'];
handler.tags = ['rpg'];
handler.command = /^(masak|cook)$/i;

export default handler;

const cookingMenu = `「 *C O O K I N G* 」

▧ Ayam Bakar 🍖
〉Need 2 ayam 🐓 & 1 Coal 🕳️

▧ Ayam Goreng 🍗
〉Need 2 ayam 🐓 & 1 Coal 🕳️

▧ Opor Ayam 🍜
〉Need 2 ayam 🐓 & 1 Coal 🕳️

▧ Steak 🥩
〉Need 2 sapi 🐮 & 1 Coal 🕳️

▧ Rendang 🥘
〉Need 2 sapi 🐮 & 1 Coal 🕳️

▧ Gulai Ayam 🍲
〉Need 2 ayam 🐓 & 1 Coal 🕳️

▧ Babipanggang 🥠
〉Need 2 babi 🐖 & 1 Coal 🕳️

▧ Ikan Bakar 🐟
〉Need 2 ikan 🐟 & 1 Coal 🕳️

▧ Lele Bakar 🐟
〉Need 2 lele 🐟 & 1 Coal 🕳️

▧ Nila Bakar 🐟
〉Need 2 nila 🐟 & 1 Coal 🕳️

▧ Bawal Bakar 🐟
〉Need 2 bawal 🐟 & 1 Coal 🕳️

▧ Udang Bakar 🦐
〉Need 2 udang 🦐 & 1 Coal 🕳️

▧ Paus Bakar 🐳
〉Need 2 paus 🐳 & 1 Coal 🕳️

▧ Kepiting Bakar 🦀
〉Need 2 kepiting 🦀 & 1 Coal 🕳️
`.trim();
