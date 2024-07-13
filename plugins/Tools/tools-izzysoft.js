import cheerio from "cheerio";
import axios from "axios";
const handler = async (m, {
  conn,
  args,
  usedPrefix,
  text,
  command
}) => {
  try {
    const query = text.split(" ");
    if (0 === query.length) {
      const usageMessage = "Cara Penggunaan:\n" + repoList.map((repo, index) => `${index + 1}. ${repo}`).join("\n");
      return void m.reply(usageMessage);
    }
    if (query.length >= 1) {
      const indexRepo = parseInt(query[0]);
      if (isNaN(indexRepo) || indexRepo < 1 || indexRepo > repoList.length) {
        const errorMessage = "Input kurang tepat. Gunakan 'izzysoft <arg1> <arg2> <arg3>' dimana:\n",
          repoListMessage = "List Repo (gunakan angka untuk memilih):\n" + repoList.map((repo, index) => `${index + 1}. ${repo}`).join("\n");
        return void m.reply(errorMessage + repoListMessage);
      }
      const repo = repoList[indexRepo - 1];
      if (1 === query.length) {
        const pageMessage = "Masukkan nomor halaman.";
        return void m.reply(pageMessage);
      }
      const page = parseInt(query[1]);
      if (isNaN(page) || page <= 0) {
        const errorMessage = "Nomor halaman tidak valid. Gunakan angka positif untuk halaman.";
        return void m.reply(errorMessage);
      }
      const apkList = await getApk(repo, page);
      if (2 === query.length) {
        if (0 === apkList.length) {
          const noApkMessage = "Tidak ada APK yang ditemukan.";
          return void m.reply(noApkMessage);
        }
        const listMessage = "List APK:\n" + apkList.map((apk, index) => `${index + 1}. ${apk.title}`).join("\n");
        return void m.reply(listMessage);
      }
      const indexGetApk = parseInt(query[2]);
      if (isNaN(indexGetApk) || indexGetApk < 1 || indexGetApk > apkList.length) {
        const errorMessage = `Index APK tidak valid. Gunakan angka dari 1 hingga ${apkList.length} untuk memilih APK dari list.`;
        return void m.reply(errorMessage);
      }
      const selectedApk = apkList[indexGetApk - 1];
      m.reply(`*Title:* ${selectedApk.title}\n*Version:* ${selectedApk.version}\n*Date:* ${selectedApk.date}\n*License:* ${selectedApk.license}\n*Info:* ${selectedApk.info}\n*Download Links:* ${selectedApk.downloadLinks[0]}`);
    }
  } catch (error) {
    console.error(error), m.reply("Terjadi kesalahan dalam menjalankan perintah. Silakan coba lagi nanti.");
  }
};
handler.help = ["izzysoft"], handler.tags = ["tools"], handler.command = /^(izzysoft)$/i;
export default handler;
const repoList = ["archive", "guardian", "iod", "kali", "main", "metatrans", "mobilsicher", "nit", "wind"];
async function getApk(repo, page) {
  try {
    const url = `https://apt.izzysoft.de/fdroid/index.php/list/page/${page}?limit=10;repo=${repo}`,
      response = await axios.get(url),
      $ = cheerio.load(response.data);
    return $(".approw").map((index, element) => {
      const title = $(element).find(".boldname").text().trim(),
        [version, date] = $(element).find(".minor-details").eq(0).text().trim().split(" / ");
      return {
        title: title,
        version: version,
        date: date,
        license: $(element).find(".minor-details").eq(1).text().trim(),
        info: $(element).find(".appdetailcell").eq(3).text().trim(),
        downloadLinks: $(element).find(".paddedlink[href^=\"https://\"]").map((index, linkElement) => $(linkElement).attr("href")).get()
      };
    }).get();
  } catch (error) {
    return console.error(error), [];
  }
}
