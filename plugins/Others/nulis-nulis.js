import {
    format
} from 'util'
import {
    spawn
} from 'child_process'
import fetch from 'node-fetch'

function divideArray(arr) {
    const chunkSize = 28;
    return Array.from({
            length: Math.ceil(arr.length / chunkSize)
        }, (_, index) =>
        arr.slice(index * chunkSize, (index + 1) * chunkSize)
    );
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const fontPath = 'src/font/Zahraaa.ttf'

let handler = async (m, {
    conn,
    command,
    text
}) => {
    text = (text ? text : m.quoted?.text ? m.quoted.text : '').trim().match(/.{0,65}/g)
    if (text[0] == '') throw `Mau nulis apa ?`
    text = await divideArray(text).reverse()
    let teks = text;

    if (!text) throw `Mau nulis apa ?`
    try {
        if (command.toLowerCase().includes('kanan')) {
            let [teks, tgl, no, nama, mapel] = teks.split('%7C')
            let txt = `${tgl ? `--Date: "${tgl}"\n` : ''}${no ? `--No: "${no}"\n` : ''}${nama ? `--Header: "nama = ${nama + `${mapel ? `\nMapel = ${mapel}"\n` : '"\n'}`}` : ''}${teks}`
            if (txt.length > 30000) txt = txt.substring(0, 30000)
            let res = await fetch(`https://oni-chan.my.id/api/canvas/nulis?text=${txt}`)
            let p = 1,
                anu = await res.json()
            for (let x of anu.results) {
                await conn.sendMessage(m.chat, {
                    image: {
                        url: x
                    },
                    caption: `*lembar [${p}]* Hati² ketahuan:v${mapel ? '' : `${p == 1 ? '' : '\n_teks|tgl|no|nama|mapel (agar lebih detail)_'}`}`
                }, {
                    quoted: m
                })
                p++
            }
        } else {
            let [teks, nama, kelas, no] = teks.split('%7C')
            await conn.sendMessage(m.chat, {
                image: {
                    url: `https://oni-chan.my.id/api/Fmake/nulis?nama=${nama || ' '}&kelas=${kelas || ' '}&no=${no || ' '}&text=${teks}&apikey=`
                },
                caption: `Hati² ketahuan:v${no ? '' : `\n_teks|nama|kelas|no_absen (agar lebih detail)_`}`
            }, {
                quoted: m
            })
        }
    } catch (e) {
        console.log(e)
        // Disable if doesnt support
        if (!global.support.convert && !global.support.magick && !global.support.gm) return handler.disabled = true
        let inputPath = 'src/kertas/buku/bl.jpg'
        let d = new Date()
        let tgl = d.toLocaleDateString('id-Id')
        let hari = d.toLocaleDateString('id-Id', {
            weekday: 'long'
        })
        for (let i = 0; i < teks.length; i++) {
            let bufs = [];
            const [_spawnprocess, ..._spawnargs] = [...(global.support.gm ? ['gm'] : global.support.magick ? ['magick'] : []),
                'convert',
                inputPath,
                '-font',
                fontPath,
                '-size',
                '1024x784',
                '-pointsize',
                '20',
                '-interline-spacing',
                '1',
                '-annotate',
                '+806+78',
                hari,
                '-font',
                fontPath,
                '-size',
                '1024x784',
                '-pointsize',
                '18',
                '-interline-spacing',
                '1',
                '-annotate',
                '+806+102',
                tgl,
                '-font',
                fontPath,
                '-size',
                '1024x784',
                '-pointsize',
                '20',
                '-interline-spacing',
                '-7.5',
                '-annotate',
                '+344+142',
                teks[i],
                'jpg:-'
            ]
            spawn(_spawnprocess, _spawnargs)
                .on('error', e => m.reply(format(e)))
                .on('close', async () => {
                    await delay(1000)
                    await conn.sendFile(m.chat, Buffer.concat(bufs), '', `Bagian ${i + 1} dari ${teks.length}`, m)
                })
                .stdout.on('data', chunk => bufs.push(chunk))
        }
    }
}
handler.help = ['nulis'].map(v => v + ' <teks>')
handler.tags = ['tools']
handler.command = /^(nulis)$/i

export default handler