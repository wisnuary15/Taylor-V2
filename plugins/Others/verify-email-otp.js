import fetch from "node-fetch";
let timeout = 12e4,
  poin = 4999;
const handler = async (m, {
  conn,
  command,
  text,
  usedPrefix
}) => {
  let imgr = flaaa.getRandom();
  conn.regmail = conn.regmail ? conn.regmail : {};
  let id = m.chat;
  if (id in conn.regmail) return await conn.reply(m.chat, "*❗ Selesaikan registrasi email ini terlebih dahulu!*", conn.regmail[id][0]), !1;
  if (!text) throw `*Example*: ${usedPrefix}${command} email@gmail.com`;
  let email = text.trim().split(/\s+\|\s+/).shift(),
    message = text.trim().split(/\s+\|\s+/).pop();
  if (!isValidEmail(email)) throw `Example: ${usedPrefix + command} email`;
  let generateOTP = (Math.floor(9e3 * Math.random()) + 1e3).toString(),
    avatar = await conn.profilePictureUrl(m.sender, "image").catch(_ => "https://telegra.ph/file/a2ae6cbfa40f6eeea0cf1.jpg"),
    res = await sendEmail(namebot, nameown, nomorown, nomorbot, m.name, message, generateOTP, conn.user.jid.split("@")[0], avatar, email),
    json = {
      jawaban: generateOTP,
      soal: "Reply pesan ini dan masukkan kode OTP yang dikirim ke email"
    };
  if (!0 === res.success) {
    let caption = `*${command.toUpperCase()}*\n${json.soal} ${email}\n\nTimeout *${(timeout / 1e3).toFixed(2)} detik*\nKetik ${usedPrefix}hotp untuk menampilkan OTP\n    `.trim(),
      mesOtp = await conn.sendFile(m.chat, imgr + command, "", caption, m);
    conn.regmail[id] = [mesOtp, json, poin, setTimeout(async () => {
      conn.regmail[id] && await conn.reply(m.chat, `*❌ Kode verifikasi Anda telah kedaluwarsa.*\nOTP *${json.jawaban}*`, conn.regmail[id][0]),
        conn.sendMessage(m.chat, {
          delete: mesOtp.key
        }), delete conn.regmail[id];
    }, timeout)];
  }
};
handler.help = ["regmail"], handler.tags = ["game"], handler.command = /^regmail/i;
export default handler;
const buttons = [
  ["Hint", "/hotp"],
  ["Nyerah", "menyerah"]
];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
async function getLocationInfo() {
  try {
    const response = await fetch("https://ipinfo.io/json");
    if (!response.ok) throw new Error(`Failed to fetch data. Status: ${response.status}`);
    const data = await response.json();
    return Object.values(data).join(", ");
  } catch (error) {
    throw console.error("Error:", error), error;
  }
}
async function sendEmail(botName, ownName, botNumber, ownNumber, Name, Msg, OTP, Number, PP, Mail) {
  let html = `<!DOCTYPE html>\n<html lang="en" >\n<head>\n  <meta charset="UTF-8">\n  <title>${botName} - otp-email;</title>\n  \n\n</head>\n<body>\n\x3c!-- partial:index.partial.html --\x3e\n<!doctype html>\n    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">\n      <head>\n        <title>\n          Confirm your email address\n        </title>\n        \x3c!--[if !mso]>\x3c!--\x3e\n        <meta http-equiv="X-UA-Compatible" content="IE=edge">\n        \x3c!--<![endif]--\x3e\n        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n        <meta name="viewport" content="width=device-width, initial-scale=1">\n        <style type="text/css">\n          #outlook a { padding:0; }\n          body { margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%; }\n          table, td { border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt; }\n          img { border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic; }\n          p { display:block;margin:13px 0; }\n        </style>\n        \x3c!--[if mso]>\n        <noscript>\n        <xml>\n        <o:OfficeDocumentSettings>\n          <o:AllowPNG/>\n          <o:PixelsPerInch>96</o:PixelsPerInch>\n        </o:OfficeDocumentSettings>\n        </xml>\n        </noscript>\n        <![endif]--\x3e\n        \x3c!--[if lte mso 11]>\n        <style type="text/css">\n          .mj-outlook-group-fix { width:100% !important; }\n        </style>\n        <![endif]--\x3e\n        \n        \n    <style type="text/css">\n      @media only screen and (min-width:480px) {\n        .mj-column-per-100 { width:100% !important; max-width: 100%; }\n      }\n    </style>\n    <style media="screen and (min-width:480px)">\n      .moz-text-html .mj-column-per-100 { width:100% !important; max-width: 100%; }\n    </style>\n    \n  \n        <style type="text/css">\n        \n        \n\n    @media only screen and (max-width:480px) {\n      table.mj-full-width-mobile { width: 100% !important; }\n      td.mj-full-width-mobile { width: auto !important; }\n    }\n  \n        </style>\n        <style type="text/css">@import url('https://fonts.googleapis.com/css?family=Poppins:300,400,700');.card {\n      box-shadow: 0 1px 12px 0 rgba(0, 0, 0, 0.08);\n      }\n\n      .text-link {\n      color: #0f72ee;\n      }\n\n      .link {\n      color: #0f72ee;\n      }\n\n\n      .token-ele {\n      width: 225px;\n      font-size: 36px;\n      letter-spacing: 14px;\n      }\n\n      .button > table {\n      width: 275px;\n      }\n\n      @media (max-width: 425px) {\n      .token-ele {\n      font-size: 24px;\n      letter-spacing: 8px;\n      width: 200px;\n      text-align: left;\n      }\n\n      .button > table {\n      width: 200px;\n      }\n      }.footer-link {\n        color: #0f72ee;\n      }</style>\n        \n      </head>\n      <body style="word-spacing:normal;background-color:#f7f9fb\n;">\n        \n    <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">\n      Confirm your email address using this OTP\n    </div>\n  \n        \n      <div style="background-color:#f7f9fb\n;">\n        \x3c!-- this ensures Gmail doesn't trim the email --\x3e<span style="opacity: 0"> ${Msg} </span>\n      <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">\n        \n      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">\n        <tbody>\n          \n              <tr>\n                <td align="center" style="font-size:0px;padding:10px 25px;padding-top:48px;word-break:break-word;">\n                  \n      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">\n        <tbody>\n          <tr>\n            <td style="width:122px;">\n              \n      <img style="width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 10px; background-color: #e5e5e5; background-image: url('${PP}'); background-size: cover; background-position: center;"/>\n    \n            </td>\n          </tr>\n        </tbody>\n      </table>\n    \n                </td>\n              </tr>\n            \n        </tbody>\n      </table>\n    \n      </div>\n    \n      \n      \x3c!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:588px;" width="588" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--\x3e\n    \n      \n      <div style="margin:0px auto;max-width:588px;">\n        \n        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">\n          <tbody>\n            <tr>\n              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:48px;text-align:center;">\n                \x3c!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="card-outlook" width="588px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="card-outlook" style="width:588px;" width="588" bgcolor="#ffffff" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--\x3e\n    \n      \n      <div class="card" style="background:#ffffff;background-color:#ffffff;margin:0px auto;max-width:588px;">\n        \n        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">\n          <tbody>\n            <tr>\n              <td style="border-top:5px solid #0f72ee;direction:ltr;font-size:0px;padding:20px 0;padding-bottom:48px;padding-left:15px;padding-right:15px;padding-top:40px;text-align:center;">\n                \x3c!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:558px;" ><![endif]--\x3e\n            \n      <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">\n        \n      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">\n        <tbody>\n          \n              <tr>\n                <td align="left" style="font-size:0px;padding:10px 25px;padding-top:0px;padding-bottom:0px;word-break:break-word;">\n                  \n      <div style="font-family:'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;line-height:24px;text-align:left;color:#2b292d;"><h1 style="margin-bottom: 16px; line-height: 36px; margin-bottom: 0px; ">Activate your account</h1></div>\n    \n                </td>\n              </tr>\n            \n              <tr>\n                <td align="left" style="font-size:0px;padding:10px 25px;padding-top:12px;word-break:break-word;">\n                  \n      <div style="font-family:'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:normal;line-height:24px;text-align:left;color:#616161;">Please use the OTP below to access ${botName}.</div>\n    \n                </td>\n              </tr>\n            \n              <tr>\n                <td align="left" class="token" style="font-size:0px;padding:10px 25px;padding-top:24px;word-break:break-word;">\n                  \n      <div style="font-family:'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:36px;font-weight:bold;letter-spacing:14px;line-height:24px;text-align:left;color:#2b292d;" id="token"><mj-raw>\n              <div class="token-ele" style=" background-color: #e0e6ef; padding-top: 20px; padding-bottom: 20px; padding-left: 24px;  padding-right: 24px;   border-radius: 4px;" id="token">\n                ${OTP}\n              </div>\n            </mj-raw></div>\n    \n                </td>\n              </tr>\n            \n              <tr>\n                <td align="left" style="font-size:0px;padding:10px 25px;padding-top:12px;word-break:break-word;">\n                  \n      <div style="font-family:'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:normal;line-height:24px;text-align:left;color:#616161;">Alternatively, click the button below to verify your login.</div>\n    \n                </td>\n              </tr>\n            \n              <tr>\n                <td align="left" vertical-align="middle" class="button" style="font-size:0px;padding:10px 25px;word-break:break-word;">\n                  \n      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">\n        <tbody>\n          <tr>\n            <td align="center" bgcolor="#0f72ee" role="presentation" style="border:none;border-radius:3px;cursor:auto;height:42px;mso-padding-alt:10px 25px;background:#0f72ee;" valign="middle">\n              <a href="https://wa.me/${Number}?text=${OTP}" style="display:inline-block;background:#0f72ee;color:white;font-family:'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank">\n                Verify account login\n              </a>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    \n                </td>\n              </tr>\n            \n              <tr>\n                <td align="center" style="font-size:0px;padding:10px 25px;padding-top:24px;word-break:break-word;">\n                  \n      <p style="border-top:dashed 1px #e4ebf6;font-size:1px;margin:0px auto;width:100%;">\n      </p>\n      \n      \x3c!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:dashed 1px #e4ebf6;font-size:1px;margin:0px auto;width:508px;" role="presentation" width="508px" ><tr><td style="height:0;line-height:0;"> &nbsp;\n</td></tr></table><![endif]--\x3e\n    \n    \n                </td>\n              </tr>\n            \n              <tr>\n                <td align="left" style="font-size:0px;padding:10px 25px;padding-top:24px;word-break:break-word;">\n                  \n      <div style="font-family:'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:normal;line-height:24px;text-align:left;color:#616161;">If “Verify account login” button is not working, copy and paste this link in your\n            browser to verify <a href="https://wa.me/${Number}?text=${OTP}" target="_blank" class="link" rel="noreferrer">https://wa.me/${Number}?text=${OTP}</a></div>\n    \n                </td>\n              </tr>\n            \n              <tr>\n                <td align="center" style="font-size:0px;padding:10px 25px;padding-top:24px;word-break:break-word;">\n                  \n      <p style="border-top:dashed 1px #e4ebf6;font-size:1px;margin:0px auto;width:100%;">\n      </p>\n      \n      \x3c!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" style="border-top:dashed 1px #e4ebf6;font-size:1px;margin:0px auto;width:508px;" role="presentation" width="508px" ><tr><td style="height:0;line-height:0;"> &nbsp;\n</td></tr></table><![endif]--\x3e\n    \n    \n                </td>\n              </tr>\n            \n              <tr>\n                <td align="left" style="font-size:0px;padding:10px 25px;padding-top:48px;padding-bottom:8px;word-break:break-word;">\n                  \n      <div style="font-family:'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:700;line-height:24px;text-align:left;color:#000000;">Need Help?</div>\n    \n                </td>\n              </tr>\n            \n              <tr>\n                <td align="left" style="font-size:0px;padding:10px 25px;padding-top:4px;padding-bottom:0px;word-break:break-word;">\n                  \n      <div style="font-family:'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:14px;font-weight:normal;line-height:24px;text-align:left;color:#616161;">Please send a feedback or bug info\n            to <a href="https://wa.me/${ownNumber}?text=feedback" class="link"> ${ownName} </a></div>\n    \n                </td>\n              </tr>\n            \n        </tbody>\n      </table>\n    \n      </div>\n    \n          \x3c!--[if mso | IE]></td></tr></table><![endif]--\x3e\n              </td>\n            </tr>\n          </tbody>\n        </table>\n        \n      </div>\n    \n      \n      \x3c!--[if mso | IE]></td></tr></table></td></tr></table><![endif]--\x3e\n              </td>\n            </tr>\n          </tbody>\n        </table>\n        \n      </div>\n    \n      \n      \x3c!--[if mso | IE]></td></tr></table><![endif]--\x3e\n    \n    \n      <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">\n        <tbody>\n          <tr>\n            <td>\n              \n        \n      \x3c!--[if mso | IE]><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:588px;" width="588" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--\x3e\n    \n        \n      <div style="margin:0px auto;max-width:588px;">\n        \n        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">\n          <tbody>\n            <tr>\n              <td style="direction:ltr;font-size:0px;padding:20px 0;padding-bottom:0px;padding-top:0px;text-align:center;">\n                \x3c!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" width="588px" ><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:588px;" width="588" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--\x3e\n    \n      \n      <div style="margin:0px auto;max-width:588px;">\n        \n        <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">\n          <tbody>\n            <tr>\n              <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">\n                \x3c!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:588px;" ><![endif]--\x3e\n            \n      <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">\n        \n      <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">\n        <tbody>\n          <tr>\n            <td style="vertical-align:top;padding:0;">\n              \n      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="" width="100%">\n        <tbody>\n          \n              <tr>\n                <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">\n                  \n      <div style="font-family:'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:11px;font-weight:400;line-height:24px;text-align:center;color:#445566;">${await getLocationInfo()}\n            <br/>\n            Thanks!\n            <br/></div>\n    \n                </td>\n              </tr>\n            \n        </tbody>\n      </table>\n    \n            </td>\n          </tr>\n        </tbody>\n      </table>\n    \n      </div>\n    \n          \x3c!--[if mso | IE]></td></tr></table><![endif]--\x3e\n              </td>\n            </tr>\n          </tbody>\n        </table>\n        \n      </div>\n    \n      \n      \x3c!--[if mso | IE]></td></tr></table></td></tr></table><![endif]--\x3e\n              </td>\n            </tr>\n          </tbody>\n        </table>\n        \n      </div>\n    \n        \n      \x3c!--[if mso | IE]></td></tr></table><![endif]--\x3e\n    \n      \n            </td>\n          </tr>\n        </tbody>\n      </table>\n    \x3c!-- this ensures Gmail doesn't trim the email --\x3e<span style="opacity: 0"> ${Msg} </span>\n      </div>\n    \n      </body>\n    </html>\n\x3c!-- partial --\x3e\n  \n</body>\n</html>\n`;
  try {
    return await fetch("https://send.api.mailtrap.io/api/send/", {
      method: "POST",
      headers: {
        Authorization: "Bearer 46fae2154055e6df3901c95919531b2a",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: {
          email: "notifier@boyne.dev",
          name: "📩 Activation by " + botName
        },
        to: [{
          email: Mail,
          name: "📩 Activation by " + botName
        }],
        subject: "🌟 Hello " + Name,
        html: html,
        category: "Notification"
      })
    }).then(response => response.json());
  } catch (error) {
    throw console.error("Request failed:", error), error;
  }
}
async function shortUrl(url) {
  let res = await fetch(`https://tinyurl.com/api-create.php?url=${url}`);
  return await res.text();
}