import {
    getUrlFromDirectPath
} from '@whiskeysockets/baileys';
const handler = async (m, {
    conn,
    command,
    text
}) => {
    try {
        let res = !text ? await conn.groupMetadata(m.chat) : null;
        if (res) {
            let caption = `Group Link Inspector\n- ${res.id || ''}\n*Judul:* ${res.subject || ''}\n*Dibuat* oleh @${res.owner?.split('@')[0] || ''} pada *${await formatDate(res.creation * 1000) || ''}*${res.subjectOwner ? `\n*Judul diubah* oleh @${res.subjectOwner?.split('@')[0]} pada *${await formatDate(res.subjectTime * 1000)}*`: ''}${res.descOwner ? `\n*Deskripsi diubah* oleh @${res.descOwner?.split('@')[0]} pada *${await formatDate(res.descTime * 1000)}*` : ''}\n*Jumlah Member:* ${res.size || ''}\n*Member teratas:* ${res.participants ? '\n' + res.participants.slice(0, 5)?.map((user, i) => `${i + 1}. @${user.id?.split('@')[0]}${user.admin === 'superadmin' ? ' (superadmin)' : (user.admin === 'admin' ? ' (admin)' : '')}`).join('\n').trim() : 'Tidak ada'}${res.participants?.length > 5 ? `\nDan ${res.participants?.length - 5} member lainnya.` : ''}\n${res.desc ? `*Deskripsi:*\n${res.desc}` : '*Tidak ada Deskripsi*'}\n\n*Detail Lengkap Grup*\n\n*Restrict:* ${res.restrict ? 'Ya' : 'Tidak'}\n*Announce:* ${res.announce ? 'Ya' : 'Tidak'}\n*Is Community:* ${res.isCommunity ? 'Ya' : 'Tidak'}\n*Is Community Announce:* ${res.isCommunityAnnounce ? 'Ya' : 'Tidak'}\n*Join Approval Mode:* ${res.joinApprovalMode ? 'Ya' : 'Tidak'}\n*Member Add Mode:* ${res.memberAddMode ? 'Ya' : 'Tidak'}\n*Ephemeral Duration:* ${res.ephemeralDuration !== undefined ? res.ephemeralDuration + ' detik' : 'Tidak diketahui'}\n\n`.trim();
            if (caption) {
                let pp;
                try {
                    pp = await conn.profilePictureUrl(res?.id);
                } catch (e) {
                    pp = thumb;
                }
                if (pp) {
                    await conn.sendMessage(m.chat, {
                        image: {
                            url: pp
                        },
                        caption: caption,
                        contextInfo: {
                            mentionedJid: conn.parseMention(caption)
                        }
                    }, {
                        quoted: m
                    });
                }
            }
        } else {
            const inviteUrl = text?.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:invite\/|joinchat\/)?([0-9A-Za-z]{22,24})/i)?.[1];
            const channelUrl = text?.match(/(?:https:\/\/)?(?:www\.)?(?:chat\.|wa\.)?whatsapp\.com\/(?:channel\/|joinchat\/)?([0-9A-Za-z]{22,24})/i)?.[1];
            if (inviteUrl) {
                let inviteInfo = await conn.groupGetInviteInfo(inviteUrl);
                if (!inviteInfo) throw 'Group tidak ditemukan.';
                let caption = `Group Link Inspector\n- ${inviteInfo.id || ''}\n*Judul:* ${inviteInfo.subject || ''}\n*Dibuat* oleh @${inviteInfo.owner?.split('@')[0] || ''} pada *${await formatDate(inviteInfo.creation * 1000) || ''}*${inviteInfo.subjectOwner ? `\n*Judul diubah* oleh @${inviteInfo.subjectOwner?.split('@')[0]} pada *${await formatDate(inviteInfo.subjectTime * 1000)}*`: ''}${inviteInfo.descOwner ? `\n*Deskripsi diubah* oleh @${inviteInfo.descOwner?.split('@')[0]} pada *${await formatDate(inviteInfo.descTime * 1000)}*` : ''}\n*Jumlah Member:* ${inviteInfo.size || ''}\n*Member teratas:* ${inviteInfo.participants ? '\n' + inviteInfo.participants.slice(0, 5)?.map((user, i) => `${i + 1}. @${user.id?.split('@')[0]}${user.admin === 'superadmin' ? ' (superadmin)' : (user.admin === 'admin' ? ' (admin)' : '')}`).join('\n').trim() : 'Tidak ada'}${inviteInfo.participants?.length > 5 ? `\nDan ${inviteInfo.participants?.length - 5} member lainnya.` : ''}\n${inviteInfo.desc ? `*Deskripsi:*\n${inviteInfo.desc}` : '*Tidak ada Deskripsi*'}\n\n*Detail Lengkap Grup*\n\n*Restrict:* ${inviteInfo.restrict ? 'Ya' : 'Tidak'}\n*Announce:* ${inviteInfo.announce ? 'Ya' : 'Tidak'}\n*Is Community:* ${inviteInfo.isCommunity ? 'Ya' : 'Tidak'}\n*Is Community Announce:* ${inviteInfo.isCommunityAnnounce ? 'Ya' : 'Tidak'}\n*Join Approval Mode:* ${inviteInfo.joinApprovalMode ? 'Ya' : 'Tidak'}\n*Member Add Mode:* ${inviteInfo.memberAddMode ? 'Ya' : 'Tidak'}\n*Ephemeral Duration:* ${inviteInfo.ephemeralDuration !== undefined ? inviteInfo.ephemeralDuration + ' detik' : 'Tidak diketahui'}\n\n`.trim();
                if (caption) {
                    let pp;
                    try {
                        pp = await conn.profilePictureUrl(inviteInfo?.id);
                    } catch (e) {
                        pp = thumb;
                    }
                    if (pp) {
                        await conn.sendMessage(m.chat, {
                            image: {
                                url: pp
                            },
                            caption: caption,
                            contextInfo: {
                                mentionedJid: conn.parseMention(caption)
                            }
                        }, {
                            quoted: m
                        });
                    }
                }
            } else if (channelUrl) {
                let newsletterInfo = await conn.newsletterMetadata('invite', channelUrl);
                if (!newsletterInfo) throw 'Newsletter tidak ditemukan.';
                let caption = `Newsletter Link Inspector\n`;
                Object.keys(newsletterInfo)?.map((key) => {
                    let value = newsletterInfo[key];
                    if (key === 'subscribers') {
                        value = value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'Tidak ada';
                    } else if (key === 'creation_time' || key === 'nameTime' || key === 'descriptionTime') {
                        value = value ? new Date(value * 1000).toLocaleString() : 'Tidak ada';
                    } else if (key === 'preview') {
                        value = value ? getUrlFromDirectPath(value) : 'Tidak ada';
                    }
                    caption += `*${key.replace(/_/g, ' ').charAt(0).toUpperCase() + key.replace(/_/g, ' ').slice(1)}:* ${value}\n`;
                });
                caption = caption.trim();
                if (caption) {
                    let pp;
                    try {
                        pp = getUrlFromDirectPath(inviteInfo?.preview);
                    } catch (e) {
                        pp = thumb;
                    }
                    if (pp) {
                        await conn.sendMessage(m.chat, {
                            image: {
                                url: pp
                            },
                            caption: caption,
                            contextInfo: {
                                mentionedJid: conn.parseMention(caption)
                            }
                        }, {
                            quoted: m
                        });
                    }
                }
            }
        }
    } catch (e) {
        console.error(e);
        m.reply(e);
    }
};
handler.help = ['inspect'];
handler.tags = ['tools'];
handler.command = /^(inspect)$/i;
export default handler;
async function formatDate(n, locale = 'id') {
    let d = new Date(n);
    return d.toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
}
