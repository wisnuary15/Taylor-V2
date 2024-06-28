import axios from "axios";
import fetch from "node-fetch";
import {
  generateWAMessageFromContent
} from "@whiskeysockets/baileys";
const handler = async (m, {
  conn,
  args,
  text,
  usedPrefix,
  command
}) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  await conn.profilePictureUrl(who).catch(_ => hwaifu.getRandom()), conn.getName(who);
  if (!args[0]) throw "Masukkan Nama Lokasi";
  m.react(wait);
  try {
    let response = axios.get("https://api.weatherapi.com/v1/current.json?key=897dba35c1d94f4cbea134758220207&q=" + text),
      res = await response,
      {
        name,
        region,
        country,
        lat,
        lon,
        tz_id,
        localtime_epoch,
        localtime
      } = res.data.location,
      {
        last_updated_epoch,
        last_updated,
        temp_c,
        temp_f,
        is_day,
        wind_mph,
        wind_kph,
        wind_degree,
        wind_dir,
        pressure_mb,
        pressure_in,
        precip_mm,
        precip_in,
        humidity,
        cloud,
        feelslike_c,
        feelslike_f,
        vis_km,
        vis_miles,
        uv,
        gust_mph,
        gust_kph
      } = res.data.current,
      icon = await (await fetch("https:" + res.data.current.condition.icon)).arrayBuffer(),
      caption = `\n*- - - - [ CONDITION ] - - -*\n${res.data.current.condition.text}\n\n*Name:* ${name}\n*Region:* ${region}\n*Country:* ${country}\n*Latitude:* ${lat}\n*Longitude:* ${lon}\n*Timezone ID:* ${tz_id}\n*Local Time Epoch:* ${localtime_epoch}\n*Local Time:* ${localtime}\n\n${readMore}\n*- - - - [ DETAILED ] - - -*\n*Last Updated Epoch:* ${last_updated_epoch}\n*Last Updated:* ${last_updated}\n*Temp Celcius:* ${temp_c}\n*Temp Fahrenheit:* ${temp_f}\n*Is Day:* ${is_day}\n*Wind Mph:* ${wind_mph}\n*Wind Kph:* ${wind_kph}\n*Wind Degree:* ${wind_degree}\n*Wind Dir:* ${wind_dir}\n*Pressure Mb:* ${pressure_mb}\n*Pressure In:* ${pressure_in}\n*Precip Mm:* ${precip_mm}\n*Precip In:* ${precip_in}\n*Humidity:* ${humidity}\n*Cloud:* ${cloud}\n*Feelslike Celcius:* ${feelslike_c}\n*Feelslike Fahrenheit:* ${feelslike_f}\n*Vis Km:* ${vis_km}\n*Vis Miles:* ${vis_miles}\n*UV:* ${uv}\n*Gust Mph:* ${gust_mph}\n*Gust Kph:* ${gust_kph}\n        `.trim(),
      msg = await generateWAMessageFromContent(m.chat, {
        extendedTextMessage: {
          text: caption,
          jpegThumbnail: icon,
          contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
              title: "P E R K I R A A N",
              body: "C U A C A",
              thumbnail: icon,
              mediaType: 1,
              sourceUrl: null
            }
          }
        }
      }, {
        quoted: m
      });
    await conn.relayMessage(m.chat, msg.message, {});
  } catch (e) {
    m.react(eror);
  }
};
handler.help = ["infocuaca <city>"], handler.tags = ["info"], handler.command = /^(info(weather|cuaca)|weather|cuaca)$/i,
  handler.limit = !0;
export default handler;
const more = String.fromCharCode(8206),
  readMore = more.repeat(4001);