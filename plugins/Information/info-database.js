const handler = async (m, {
  conn
}) => {
  try {
    const {
      users
    } = db.data;
    const totalUsers = Object.keys(users).length;
    const interactingUsers = Object.values(users).reduce((acc, user) => user.registered ? acc + 1 : acc, 0);
    const bannedUsers = Object.values(users).reduce((acc, user) => user.banned ? acc + 1 : acc, 0);
    const premiumUsers = Object.values(users).reduce((acc, user) => user.premium ? acc + 1 : acc, 0);
    const totalFollowers = (await conn.newsletterMetadata("invite", "0029VaGPJX78KMqdHoamtJ22")).subscribers;
    const percentFollowers = (totalFollowers / totalUsers * 100).toFixed(2);
    const message = `
📊 *DATABASE BOT* 🤖

*Total User:* ${totalUsers} (100%)
*User Registered:* ${interactingUsers} (${(interactingUsers / totalUsers * 100).toFixed(2)}%)
*User Banned:* ${bannedUsers} (${(bannedUsers / totalUsers * 100).toFixed(2)}%)
*User Premium:* ${premiumUsers} (${(premiumUsers / totalUsers * 100).toFixed(2)}%)
*Total pengikut newsletter:* ${totalFollowers} (${percentFollowers}% dari total user)
`;
    await conn.reply(m.chat, message, m);
  } catch (error) {
    console.error(error), m.reply("Terjadi kesalahan saat mengambil informasi database.");
  }
};
handler.help = ["database", "user"], handler.tags = ["info"], handler.command = /^(database|jumlahdatabase|user)$/i,
  handler.limit = !0;
export default handler;
