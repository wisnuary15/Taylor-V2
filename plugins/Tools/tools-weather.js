import axios from "axios";
const handler = async (m, {
  args
}) => {
  if (!args[0]) throw "Please provide place or location name";
  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${args[0]}&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273`),
      {
        name,
        sys: {
          country
        },
        weather: [{
          description
        }],
        main: {
          temp,
          temp_min,
          temp_max,
          humidity
        },
        wind: {
          speed
        }
      } = response.data,
      wea = `「 📍 」 Place: ${name}\n「 🗺️ 」 Country: ${country}\n「 🌤️ 」 Weather: ${description}\n「 🌡️ 」 Temperature: ${temp}°C\n「 💠 」 Minimum Temperature: ${temp_min}°C\n「 📛 」 Maximum Temperature: ${temp_max}°C\n「 💦 」 Humidity: ${humidity}%\n「 🌬️ 」 Wind: ${speed}km/h`;
    m.reply(wea);
  } catch (e) {
    m.reply("Error: Location not found!");
  }
};
handler.help = ["weather"], handler.tags = ["tools"], handler.command = /^(weather)$/i;
export default handler;