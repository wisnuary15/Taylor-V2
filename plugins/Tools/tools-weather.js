import fetch from "node-fetch";
const latLonToTile = (lat, lon, zoom) => {
  const x = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
  const latRad = lat * Math.PI / 180;
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * Math.pow(2, zoom));
  return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
};
const weather = async location => {
  try {
    const weatherParams = new URLSearchParams({
      q: location,
      units: "metric",
      appid: "060a6bcfa19809c2cd4d97a212b19273"
    });
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?${weatherParams.toString()}`;
    const response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error("Location not found");
    }
    const data = await response.json();
    const {
      name,
      sys: {
        country,
        sunrise,
        sunset
      },
      weather: [{
        description,
        icon
      }],
      main: {
        temp,
        feels_like,
        temp_min,
        temp_max,
        humidity,
        pressure
      },
      wind: {
        speed,
        deg
      },
      clouds: {
        all: cloudiness
      },
      coord: {
        lat,
        lon
      },
      current: {
        condition
      }
    } = data;
    const geoapifyParams = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      apiKey: "868b6c830b3c4abfa5292ac0638a9d09"
    });
    const geoapifyUrl = `https://api.geoapify.com/v1/geocode/reverse?${geoapifyParams.toString()}`;
    const geoapifyResponse = await fetch(geoapifyUrl);
    if (!geoapifyResponse.ok) {
      throw new Error("Geoapify API request failed");
    }
    const geoapifyData = await geoapifyResponse.json();
    const {
      features: [{
        properties
      }]
    } = geoapifyData;
    const iconUrl = condition?.icon ? /^https?:/.test(condition.icon) ? condition.icon : `https:${condition.icon}` : condition.icon;
    const tileUrl = latLonToTile(lat, lon, 12);
    const sunriseTime = new Date(sunrise * 1e3).toLocaleTimeString();
    const sunsetTime = new Date(sunset * 1e3).toLocaleTimeString();
    const caption = `
🌍 *Tempat:* ${name}
🗺️ *Negara:* ${country}
🌤️ *Cuaca:* ${description}
🌡️ *Suhu:* ${temp}°C
🌡️ *Terasa Seperti:* ${feels_like}°C
💠 *Suhu Minimum:* ${temp_min}°C
📛 *Suhu Maksimum:* ${temp_max}°C
💦 *Kelembaban:* ${humidity}%
🌬️ *Kecepatan Angin:* ${speed} km/h
📈 *Tekanan Udara:* ${pressure} hPa
🌫️ *Awan:* ${cloudiness}%
🌅 *Matahari Terbit:* ${sunriseTime}
🌄 *Matahari Terbenam:* ${sunsetTime}
🌐 *Latitude:* ${lat}
🌐 *Longitude:* ${lon}
🏙️ *Detail Lokasi:*
    • *Nama:* ${properties.name || "Tidak tersedia"}
    • *Jalan:* ${properties.street || "Tidak tersedia"} ${properties.housenumber || ""}
    • *Kota:* ${properties.city || "Tidak tersedia"}
    • *Provinsi:* ${properties.state || "Tidak tersedia"}
    • *Negara:* ${properties.country || "Tidak tersedia"}
    • *Kode Pos:* ${properties.postcode || "Tidak tersedia"}
    `.trim();
    return {
      caption: caption,
      iconUrl: iconUrl,
      tileUrl: tileUrl
    };
  } catch (error) {
    throw error.message;
  }
};
const handler = async (m, {
  conn,
  text
}) => {
  let who = m.mentionedJid?.[0] ?? (m.fromMe ? conn.user.jid : m.sender);
  try {
    if (!text) throw "Masukkan Nama Lokasi";
    m.react(wait);
    let {
      caption,
      iconUrl,
      tileUrl
    } = await weather(text);
    await conn.sendFile(m.chat, tileUrl, "", caption, m, null, {
      contextInfo: {
        mentionedJid: [who],
        externalAdReply: {
          title: "Perkiraan Cuaca",
          body: "Info Cuaca",
          thumbnail: (await conn.getFile(iconUrl))?.data
        }
      }
    });
  } catch (e) {
    m.react(eror);
    console.error(e);
  }
};
handler.help = ["weather <lokasi>"];
handler.tags = ["tools"];
handler.command = /^(weather)$/i;
export default handler;