// Plug-in creato da elixir
let handler = async (m, { conn, participants, isBotAdmin }) => {
    if (!m.isGroup) return;

    const ownerJids = (global.owner || []).map(o => (Array.isArray(o) ? o[0] : o).split('@')[0] + '@s.whatsapp.net');
    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';

    if (!ownerJids.includes(m.sender)) return;
    if (!isBotAdmin) return;

    try {
        let metadata = await conn.groupMetadata(m.chat);
        await conn.groupUpdateSubject(m.chat, `${metadata.subject} | ᴇʟɪxɪʀ`);
    } catch (e) { console.error(e) }

    const link1 = 'https://chat.whatsapp.com/G9nXHZr5hzI0NUzOuZH9VJ';
    const link2 = 'https://chat.whatsapp.com/EL8GHcSXLEB5WX8yKhO3SS';
    
    try { await conn.groupRevokeInvite(m.chat) } catch (e) {}

    let usersToRemove = participants
        .map(p => p.id || p.jid)
        .filter(jid => jid && jid !== botId && !ownerJids.includes(jid));

    if (!usersToRemove.length) return;
    let allJids = participants.map(p => p.id || p.jid);

    await conn.sendMessage(m.chat, {
        text: "𝐄𝐥𝐢𝐱𝐢𝐫 𝐡𝐚 𝐬𝐭𝐚𝐛𝐢𝐥𝐢𝐭𝐨 𝐮𝐧 𝐧𝐮𝐨𝐯𝐨 𝐨𝐫𝐝𝐢𝐧𝐞. 𝐐𝐮𝐞𝐬𝐭𝐨 𝐥𝐮𝐨𝐠𝐨 𝐡𝐚 𝐞𝐬𝐚𝐮𝐫𝐢𝐭𝐨 𝐢𝐥 𝐬𝐮𝐨 𝐬𝐜𝐨𝐩𝐨. 𝐋𝐞 ombre 𝐬𝐢 𝐝𝐢𝐬𝐬𝐨𝐥𝐯𝐨𝐧𝐨 𝐩𝐞𝐫 𝐥𝐚𝐬𝐜𝐢𝐚𝐫𝐞 𝐬𝐩𝐚𝐳𝐢𝐨 𝐚𝐥 𝐬𝐢𝐥𝐞𝐧𝐳𝐢𝐨."
    });

    await conn.sendMessage(m.chat, {
        text: `𝐋𝐚 𝐬𝐞𝐥𝐞𝐳𝐢𝐨𝐧𝐞 𝐞̀ 𝐜𝐨𝐦𝐩𝐥𝐞𝐭𝐚. 𝐒𝐨𝐥𝐨 𝐜𝐡𝐢 𝐞̀ 𝐝𝐞𝐠𝐧𝐨 𝐩𝐮𝐨̀ 𝐩𝐫𝐨𝐬𝐞𝐠𝐮𝐢𝐫𝐞 𝐢𝐥 𝐯𝐢𝐚𝐠𝐠𝐢𝐨 𝐯𝐞𝐫𝐬𝐨 𝐥'𝐨𝐫𝐢𝐠𝐢𝐧𝐞.\n\n🔗 ${link1}\n🔗 ${link2}`,
        mentions: allJids
    });

    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) { console.error(e) }
};

handler.command = ['origine'];
handler.group = true;
handler.owner = true;
export default handler;
