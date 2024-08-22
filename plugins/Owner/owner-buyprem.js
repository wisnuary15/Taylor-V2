import moment from "moment";
const handler = async (m, {
  conn,
  text,
  usedPrefix,
  command
}) => {
  try {
    const hargaPremium = {
      money: {
        1: {
          harga: 1e4,
          hari: 10
        },
        2: {
          harga: 2e4,
          hari: 20
        },
        3: {
          harga: 3e4,
          hari: 30
        },
        4: {
          harga: 4e4,
          hari: 40
        },
        5: {
          harga: 5e4,
          hari: 50
        },
        6: {
          harga: 6e4,
          hari: 60
        },
        7: {
          harga: 7e4,
          hari: 70
        },
        8: {
          harga: 8e4,
          hari: 80
        },
        9: {
          harga: 9e4,
          hari: 90
        },
        10: {
          harga: 1e5,
          hari: 100
        }
      },
      diamond: {
        1: {
          harga: 1e3,
          hari: 10
        },
        2: {
          harga: 2e3,
          hari: 20
        },
        3: {
          harga: 3e3,
          hari: 30
        },
        4: {
          harga: 4e3,
          hari: 40
        },
        5: {
          harga: 5e3,
          hari: 50
        },
        6: {
          harga: 6e3,
          hari: 60
        },
        7: {
          harga: 7e3,
          hari: 70
        },
        8: {
          harga: 8e3,
          hari: 80
        },
        9: {
          harga: 9e3,
          hari: 90
        },
        10: {
          harga: 1e4,
          hari: 100
        }
      }
    };
    const rows = ["money", "diamond"].flatMap(currency => Object.entries(hargaPremium[currency]).map(([key, {
      harga,
      hari
    }]) => ({
      header: `Paket ${key} - Gunakan ${currency.charAt(0).toUpperCase() + currency.slice(1)}`,
      id: `${usedPrefix}${command} ${key} ${currency}`,
      title: currency === "money" ? `Rp${harga.toLocaleString()}` : `${harga} Diamond`,
      description: `Harga: ${currency === "money" ? `Rp${harga.toLocaleString()}` : `${harga} Diamond`}, Durasi: ${hari} hari`
    })));
    const formattedData = {
      title: "*Daftar Harga Premium*\nPilih paket premium di bawah ini:",
      rows: [{
        title: "Bayar Pakai Money",
        highlight_label: "Beli Paket",
        rows: rows.filter(row => row.id.includes("money"))
      }, {
        title: "Bayar Pakai Diamond",
        highlight_label: "Beli Paket",
        rows: rows.filter(row => row.id.includes("diamond"))
      }]
    };
    const [list, currency] = text.trim().split(/\s+/);
    const listNum = parseInt(list, 10);
    if (!/^[1-9]\d*$/.test(list) || !["money", "diamond"].includes(currency.toLowerCase()) || !hargaPremium[currency.toLowerCase()][listNum]) {
      return await conn.sendButtonCta(m.chat, [
        [formattedData.title, wm, null, [], null, [],
          [
            ["💰 Pilih Paket", formattedData.rows]
          ]
        ]
      ], m);
    }
    const {
      harga,
      hari
    } = hargaPremium[currency.toLowerCase()][listNum];
    let user = db.data.users[m.sender];
    const hasEnough = currency === "money" ? user.money >= harga : user.diamond >= harga;
    if (!hasEnough) {
      return await conn.reply(m.chat, `🚫 *Anda membutuhkan setidaknya ${currency === "money" ? `Rp${harga.toLocaleString()}` : `${harga} diamond`} untuk membeli paket ini.* 🚫`, m);
    }
    const currentPremiumEnd = user.premiumTime ? moment(user.premiumTime) : moment();
    const newPremiumEnd = currentPremiumEnd.clone().add(hari, "days");
    const message = `🌟 *Konfirmasi Pembelian Premium*\n\n*Paket:* ${listNum}\n*Harga:* ${currency === "money" ? `Rp${harga.toLocaleString()}` : `${harga} Diamond`}\n*Durasi:* ${hari} hari\n\nBalas dengan *Y/N* untuk konfirmasi.`;
    const {
      key
    } = await conn.reply(m.chat, message, m);
    conn.buyprem[m.chat] = {
      currency: currency.toLowerCase(),
      list: listNum,
      hargaPremium: hargaPremium,
      key: key,
      timeout: setTimeout(() => {
        conn.sendMessage(m.chat, {
          delete: key
        });
        delete conn.buyprem[m.chat];
      }, 6e4)
    };
  } catch (error) {
    console.error("Error handling buyprem command:", error);
    await conn.reply(m.chat, "🚨 *Terjadi kesalahan saat memproses permintaan Anda.* 🚨", m);
  }
};
handler.before = async (m, {
  conn
}) => {
  try {
    if (!conn.buyprem || m.isBaileys || !(m.chat in conn.buyprem)) return;
    const user = db.data.users[m.sender];
    const input = m.text.trim().toUpperCase();
    const yesRegex = /^(Y|YES|YEAH|YUP)$/i;
    const noRegex = /^(N|NO|NOPE)$/i;
    if (!yesRegex.test(input) && !noRegex.test(input)) return;
    const {
      currency,
      list,
      hargaPremium,
      key,
      timeout
    } = conn.buyprem[m.chat];
    const {
      harga,
      hari
    } = hargaPremium[currency][list];
    if (m.quoted?.id === key.id && input) {
      if (yesRegex.test(input)) {
        if (currency === "money") {
          if (user.money < harga) {
            return await conn.reply(m.chat, `🚫 *Anda membutuhkan setidaknya Rp${harga.toLocaleString()} untuk membeli paket ini.* 🚫`, m);
          }
          user.money -= harga;
        } else {
          if (user.diamond < harga) {
            return await conn.reply(m.chat, `🚫 *Anda membutuhkan setidaknya ${harga} diamond untuk membeli paket ini.* 🚫`, m);
          }
          user.diamond -= harga;
        }
        const currentPremiumEnd = user.premiumTime ? moment(user.premiumTime) : moment();
        const newPremiumEnd = currentPremiumEnd.clone().add(hari, "days");
        user.premiumTime = newPremiumEnd.valueOf();
        user.premium = true;
        const message = `🌟 *Selamat! Anda sekarang pengguna premium.* 🎉\n⏳ *Countdown:* ${moment.duration(user.premiumTime - moment().valueOf()).humanize()}\n📅 *Perubahan:* Dari ${currentPremiumEnd.format("DD MMM YYYY")} ke ${newPremiumEnd.format("DD MMM YYYY")}\n\n*Detail Paket:*\n*Harga:* ${currency === "money" ? `Rp${harga.toLocaleString()}` : `${harga} Diamond`}\n*Durasi Paket:* ${hari} hari`;
        await conn.reply(m.chat, message, m);
        conn.sendMessage(m.chat, {
          delete: key
        });
        clearTimeout(timeout);
        delete conn.buyprem[m.chat];
      } else if (noRegex.test(input)) {
        await conn.reply(m.chat, "✅ *Anda telah membatalkan peningkatan premium.* ✅", m);
        conn.sendMessage(m.chat, {
          delete: key
        });
        clearTimeout(timeout);
        delete conn.buyprem[m.chat];
      }
    }
  } catch (error) {
    console.error("Error handling buyprem response:", error);
    await conn.reply(m.chat, "🚨 *Terjadi kesalahan saat memproses tanggapan Anda.* 🚨", m);
  }
};
handler.help = ["buyprem"];
handler.tags = ["owner"];
handler.command = /^buyprem$/i;
export default handler;