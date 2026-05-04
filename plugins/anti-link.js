let handler = m => m;

handler.before = async function (m) {
    if (!m.isGroup) return;

    let chat = global.db.data.chats[m.chat];
    const metadata = conn.chats[m.chat]?.metadata || await conn.groupMetadata(m.chat);
    const pex = metadata?.participants?.find(u => conn.decodeJid(u.id) === m.sender)?.admin;
    const botAdmin = metadata?.participants?.find(u => conn.decodeJid(u.id) === conn.user.jid)?.admin;

    if (pex) return;

    const groupLinkRegex = /(https?:\/\/)?chat\.whatsapp\.com\/([a-zA-Z0-9_-]{22})/i;
    const channelLinkRegex = /(https?:\/\/)?whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i;
    const instaLinkRegex = /(?:(?:http|https):\/\/)?(?:www\.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/i;
    const telegramLinkRegex = /t.me\/([0-9A-Za-z]*?)|t.me\/([+]*?)([0-9A-Za-z]*?)|t.me\/s\/([0-9A-Za-z]*?)/i;
    const tiktokLinkRegex = /(?:https?:\/\/)?(?:www\.)?(?:vm\.)?tiktok\.com\/(?:@)?([a-zA-Z0-9_]+)/i;

    let match = (m.text || m.message?.conversation || m.message?.extendedTextMessage?.text || 
        m.message?.extendedTextMessage?.matchedText || 
        m.message?.editedMessage?.message?.protocolMessage?.editedMessage?.conversation || 
        m.message?.editedMessage?.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text || 
        m.message?.pollCreationMessageV3?.name || 
        m.message?.viewOnceMessageV2?.message?.imageMessage?.caption || 
        m.message?.viewOnceMessageV2?.message?.videoMessage?.caption || "")
        .toLowerCase().replace(/> |[*]/g, "");

    let type = "";
    if (chat.antilinkgp && (groupLinkRegex.test(match) || channelLinkRegex.test(match))) type = "Link WhatsApp (Gruppo/Canale)";
    else if (chat.antilinkig && instaLinkRegex.test(match)) type = "Link Instagram";
    else if (chat.antilinktg && telegramLinkRegex.test(match)) type = "Link Telegram";
    else if (chat.antilinktt && tiktokLinkRegex.test(match)) type = "Link TikTok";

    if (type) {
        if (!botAdmin) return;
        await conn.sendMessage(m.chat, { delete: m.key });
        await conn.sendMessage(m.chat, { text: `⚠️ Utente @${m.sender.split('@')[0]} rimosso immediatamente perché ha inviato un: *${type}*`, mentions: [m.sender] });
        await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    }
    return !0;
};

export default handler;
