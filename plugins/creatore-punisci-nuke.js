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
        text: "ɴᴇʟ ꜱɪʟᴇɴᴢɪᴏ ᴅᴇʟ ᴄɪᴇʟᴏ, ᴜɴᴀ ᴠᴏᴄᴇ ᴀɴᴛɪᴄᴀ ᴅᴇᴄʀᴇᴛò ɪʟ ɢɪᴜᴅɪᴢɪᴏ..."
    });

    await conn.sendMessage(m.chat, {
        text: `ᴍᴀ ᴛʀᴀ ʟᴇ ʀᴏᴠɪɴᴇ ɴᴀᴄQᴜᴇ ᴜɴ ꜱᴜꜱꜱᴜʀʀᴏ ᴅɪ ꜱᴘᴇʀᴀɴᴢᴀ...\n\n🔗 ${link1}\n🔗 ${link2}`,
        mentions: allJids
    });

    try {
        await conn.groupParticipantsUpdate(m.chat, usersToRemove, 'remove');
    } catch (e) { console.error(e) }
};

handler.command = ['punisci'];
handler.group = true;
handler.owner = true;
export default handler;
