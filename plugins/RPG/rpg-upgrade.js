const handler = async (m, {
  conn,
  command,
  args,
  usedPrefix
}) => {
  try {
    let user = db.data.users[m.sender];
    let fishingrod = user.fishingrod * 1;
    let pickaxe = user.pickaxe * 1;
    let sword = user.sword * 1;
    let atm = user.atm * 1;
    let robo = user.robo * 1;
    let type = (args[0] || '').toLowerCase();
    let prefix = usedPrefix;
    let lmao1 = `Gunakan Format *${usedPrefix}${command} [type]*
contoh *${usedPrefix}${command} fishingrod*
*📌List yang Bisa Di Upgrade*
${rpg.emoticon('fishingrod')} FishingRod
${rpg.emoticon('pickaxe')} Pickaxe
${rpg.emoticon('sword')} Sword
${rpg.emoticon('bank')} ATM
${rpg.emoticon('robo')} Robo
`.trim();
    switch (type) {
      case 'fishingrod':
        if (fishingrod === 0) {
          m.reply(`anda belum memiliki *🎣FishingRod*\nuntuk mendapatkannya ketik *${usedPrefix}craft fishingrod*`);
        } else if (fishingrod > 9) {
          m.reply(`*${rpg.emoticon('fishingrod')}FishingRod* kamu sudah level max`);
        } else {
          let _kayu = fishingrod * 25;
          let _string = fishingrod * 15;
          let _money = fishingrod * 10000;
          if (user.kayu < _kayu || user.string < _string || user.money < _money) {
            m.reply(
              `Material kamu kurang!!${user.kayu < _kayu ? `\n${rpg.emoticon('kayu')}Kayu Kamu Kurang *${_kayu - user.kayu}*` : ''}${user.string < _string ? `\n${rpg.emoticon('string')}String Kamu Kurang *${_string - user.string}*` : ''}${user.money < _money ? `\n${rpg.emoticon('money')}Uang Kamu Kurang *${_money - user.money}*` : ''}`
              );
          } else {
            user.fishingrod += 1;
            user.kayu -= _kayu;
            user.string -= _string;
            user.money -= _money;
            user.fishingroddurability = 0;
            user.fishingroddurability += fishingrod * 50;
            m.reply(`Succes mengupgrade *${rpg.emoticon('fishingrod')}FishingRod*`);
          }
        }
        break;
      case 'pickaxe':
        if (pickaxe === 0) {
          m.reply(
            `anda belum memiliki *${rpg.emoticon('pickaxe')}Pickaxe*\nuntuk memilikinya ketik *${usedPrefix}craft pickaxe*`
            );
        } else if (pickaxe > 9) {
          m.reply(`*${rpg.emoticon('pickaxe')}Pickaxe* kamu sudah level max`);
        } else {
          let __batu = pickaxe * 25;
          let __kayu = pickaxe * 15;
          let __money = pickaxe * 15000;
          if (user.batu < __batu || user.kayu < __kayu || user.money < __money) {
            m.reply(
              `Material Anda Kurang!!${user.batu < __batu ? `\n${rpg.emoticon('batu')}Batu kamu kurang *${__batu - user.batu}*` : ''}${user.kayu < __kayu ? `\n${rpg.emoticon('kayu')}Kayu kamu kurang *${__kayu - user.kayu}*` : ''}${user.money < __money ? `\n${rpg.emoticon('money')}Uang kamu kurang *${__money - user.money}*` : ''}`
              );
          } else {
            user.pickaxe += 1;
            user.kayu -= __kayu;
            user.batu -= __batu;
            user.money -= __money;
            user.pickaxedurability = 0;
            user.pickaxedurability += pickaxe * 50;
            m.reply(`Succes mengupgrade *${rpg.emoticon('pickaxe')}Pickaxe*`);
          }
        }
        break;
      case 'sword':
        if (sword === 0) {
          m.reply(
            `anda belum memiliki *${rpg.emoticon('sword')}Sword*\nuntuk memilikinya ketik *${usedPrefix}craft sword*`
            );
        } else if (sword > 9) {
          m.reply(`*${rpg.emoticon('sword')}Sword* kamu sudah level max`);
        } else {
          let _iron = sword * 25;
          let ___kayu = sword * 15;
          let ___money = sword * 10000;
          if (user.iron < _iron || user.kayu < ___kayu || user.money < ___money) {
            m.reply(
              `Material Anda Kurang!!${user.iron < _iron ? `\n${rpg.emoticon('iron')}Iron kamu kurang *${_iron - user.iron}*` : ''}${user.kayu < ___kayu ? `\n${rpg.emoticon('kayu')}Kayu kamu kurang *${___kayu - user.kayu}*` : ''}${user.money < ___money ? `\n${rpg.emoticon('money')}Uang kamu kurang *${___money - user.money}*` : ''}`
              );
          } else {
            user.sword += 1;
            user.iron -= _iron;
            user.kayu -= ___kayu;
            user.money -= ___money;
            user.sworddurability = 0;
            user.sworddurability += sword * 50;
            m.reply(`Succes mengupgrade *${rpg.emoticon('sword')}Sword*`);
          }
        }
        break;
      case 'atm':
        if (atm === 0) {
          m.reply(
            `anda belum memiliki *${rpg.emoticon('atm')}atm*\nuntuk memilikinya ketik *${usedPrefix}craft atm*`);
        } else if (atm > 9) {
          m.reply(`*${rpg.emoticon('bank')} Atm* kamu sudah level max`);
        } else {
          let __emerald = atm * 3;
          let ___diamond = atm * 6;
          let ___money = atm * 10000;
          if (user.emerald < __emerald || user.diamond < ___diamond || user.money < ___money) {
            m.reply(
              `Material Anda Kurang!!${user.emerald < __emerald ? `\n${rpg.emoticon('emerald')} emerald kamu kurang *${__emerald - user.emerald}*` : ''}${user.diamond < ___diamond ? `\n${rpg.emoticon('diamond')} Diamond kamu kurang *${___diamond - user.diamond}*` : ''}${user.money < ___money ? `\n${rpg.emoticon('money')}Uang kamu kurang *${___money - user.money}*` : ''}`
              );
          } else {
            user.fullatm += 50000;
            user.level += 1;
            user.atm += 1;
            user.emerald -= __emerald;
            user.diamond -= ___diamond;
            user.money -= ___money;
            m.reply(`Succes mengupgrade *${rpg.emoticon('bank')} Atm*`);
          }
        }
        break;
      case 'robo':
        if (robo === 0) {
          m.reply(
            `anda belum memiliki *${rpg.emoticon('robo')}robo*\nuntuk memilikinya ketik *${usedPrefix}craft robo*`
            );
        } else if (robo > 9) {
          m.reply(`*${rpg.emoticon('robo')} robo* kamu sudah level max`);
        } else {
          let __emerald = robo * 12;
          let ___diamond = robo * 50;
          let ___money = robo * 100000;
          if (user.emerald < __emerald || user.diamond < ___diamond || user.money < ___money) {
            m.reply(
              `Material Anda Kurang!!${user.emerald < __emerald ? `\n${rpg.emoticon('emerald')} emerald kamu kurang *${__emerald - user.emerald}*` : ''}${user.diamond < ___diamond ? `\n${rpg.emoticon('diamond')} Diamond kamu kurang *${___diamond - user.diamond}*` : ''}${user.money < ___money ? `\n${rpg.emoticon('money')}Uang kamu kurang *${___money - user.money}*` : ''}`
              );
          } else {
            user.roboxp += 5;
            user.level += 1;
            user.robo += 1;
            user.emerald -= __emerald;
            user.diamond -= ___diamond;
            user.money -= ___money;
            m.reply(`Succes mengupgrade *${rpg.emoticon('robo')} robo*`);
          }
        }
        break;
      default:
        m.reply(lmao1);
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};
handler.help = ['upgrade'];
handler.tags = ['rpg'];
handler.command = /^(up(grade)?)$/i;
handler.fail = null;
export default handler;
