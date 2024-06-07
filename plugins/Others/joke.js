import fetch from 'node-fetch';
import {
  translate
} from '@vitalets/google-translate-api';
const handler = async (m, {}) => {
  try {
    let {
      setup,
      delivery
    } = await getJoke();
    let joke = setup + '\n\n' + delivery;
    if (!joke) return m.reply('Failed to fetch joke');
    let translatedJoke = await translateToIndonesian(joke);
    let headerJoke = '*[ RANDOM JOKES ]*\n\n- ';
    m.reply(headerJoke + translatedJoke);
  } catch (e) {
    console.error('Error in handler:', e);
    m.reply('Terjadi kesalahan saat mengambil jokes.');
  }
};
handler.help = ['jokes'];
handler.tags = ['edukasi'];
handler.command = /^(jokes|jokesunik)$/i;
export default handler;
async function getJoke() {
  try {
    const response = await fetch(
      'https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Pun?blacklistFlags=nsfw,religious,racist,sexist,explicit', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data || {};
  } catch (error) {
    console.error('Error in getJoke:', error);
    return null;
  }
}
async function translateToIndonesian(text) {
  try {
    const result = await translate(text, {
      to: 'id'
    });
    return result.text || text;
  } catch (error) {
    console.error('Error in translateToIndonesian:', error);
    return text;
  }
}
