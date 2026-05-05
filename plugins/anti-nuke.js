// Plug-in creato da elixir
const handler = m => m;

handler.before = async function (m, { conn, participants, isBotAdmin }) {
  if (!m.isGroup || !isBotAdmin) return;

  const chat = global.db.data.chats[m.chat];
  if (!chat?.antinuke) return;

  // Monitora: Cambio nome (21), Rimozione (28), Promozione (29), Retrocessione (30)
  if (![21, 28, 29, 30].includes(m.messageStubType)) return;

  const sender = m.key?.participant || m.participant || m.sender;
  if (!sender) return;

  const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
  const BOT_OWNERS = (global.owner || []).filter(o => o).map(o => o.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
  const localWhitelist = chat.whitelist || [];
  
  let ownerGroup = null;
  try {
    const metadata = await conn.groupMetadata(m.chat);
    ownerGroup = metadata.owner || metadata.subjectOwner;
  } catch { ownerGroup = null; }

  const allowed = [botJid, ...BOT_OWNERS, ...localWhitelist, ownerGroup].filter(Boolean);
  if (allowed.includes(sender)) return;

  if (m.messageStubType === 28) {
    const affected = m.messageStubParameters?.[0];
    if (affected === sender) return;
  }

  const senderData = participants.find(p => p.jid === sender);
  if (!senderData?.admin) return;

  const usersToDemote = participants
    .filter(p => p.admin && !allowed.includes(p.jid))
    .map(p => p.jid);

  if (!usersToDemote.length && m.messageStubType !== 21) return;

  if (usersToDemote.length) {
    await conn.groupParticipantsUpdate(m.chat, usersToDemote, 'demote');
  }

  await conn.groupSettingUpdate(m.chat, 'announcement');

  const action = { 21: 'MODIFICA NOME', 28: 'RIMOZIONE UTENTE', 29: 'PROMOZIONE ADMIN', 30: 'RETROCESSIONE ADMIN' }[m.messageStubType];

  const text = `┏━━━〔 🛡️ **ELIXIR ANTINUKE** 〕━━━┓\n┃\n┃ ⚠️ *ATTIVITÀ SOSPETTA RILEVATA*\n┃\n┃ 👤 **Autore:** @${sender.split('@')[0]}\n┃ 🚫 **Azione:** ${action}\n┃ ⚡ **Stato:** Intervento Eseguito\n┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛`;

  await conn.sendMessage(m.chat, {
    text,
    contextInfo: {
      mentionedJid: [sender, ...usersToDemote, ...BOT_OWNERS].filter(Boolean),
      externalAdReply: {
        title: '🛡️ ELIXIR SECURITY SYSTEM',
        body: 'Protocollo Attivo',
        thumbnailUrl: 'https://qu.ax',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    },
  });
};

handler.priority = -1000 // <--- DEVE ESSERE PIÙ BASSO DI OFFBOT
export default handler;
