import {
  WABetaInfo
} from '../../lib/info/wabetainfo.js';
export async function before(m) {
  const chat = db.data.chats[m.chat];
  if (m.isBaileys || !m.text || !chat.wabetainfo) return false;
  try {
    this.wabetainfo = this.wabetainfo || {};
    if (Object.keys(this.wabetainfo).length === 0) {
      const response = new WABetaInfo();
      const wbi = await response.home();
      this.wabetainfo.data = wbi[0];
      this.wabetainfo.state = true;
    }
    setInterval(async () => {
      try {
        const response = new WABetaInfo();
        const wabeta = await response.home();
        if (JSON.stringify(wabeta[0]) !== JSON.stringify(this.wabetainfo.data)) {
          this.wabetainfo.state = false;
          if (!this.wabetainfo.state) {
            this.wabetainfo.data = wabeta[0];
            const txt =
              `*${wabeta[0]?.title}*\n\n📅 *Date:* ${wabeta[0]?.date}\n📍 *Category:* ${wabeta[0]?.category}\n🚩 *Excerpt:* ${wabeta[0]?.excerpt}\n💡 *Link:* ${wabeta[0]?.readMoreLink}`;
            this.reply(m.chat, txt.replaceAll("%p", "```"), null);
            this.wabetainfo.state = true;
          }
        }
      } catch (error) {
        console.error(error);
      }
    }, 15 * 60 * 1000);
  } catch (error) {
    console.error(error);
  }
}
