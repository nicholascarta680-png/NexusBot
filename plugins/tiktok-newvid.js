// Plug-in creato da elixir
let handler = async (m, { conn, text, command, isOwner }) => {
  if (!isOwner) return m.reply("❌ Accesso negato.");
  if (!text) return m.reply(`💡 *Uso:* .${command} [Link TikTok]`);

  // Filtra solo i gruppi attivi dalla memoria del bot
  const groups = Object.entries(conn.chats)
    .filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)
    .map(([jid]) => jid);

  if (!groups.length) return m.reply('⚠️ Il bot non è presente in nessun gruppo attivo.');

  let total = groups.length;
  let success = 0;
  let listReport = "";

  // 1. MESSAGGIO DI PARTENZA
  await conn.sendMessage(m.chat, { 
    text: `🚀 *DISTRIBUZIONE CONTENUTO AVVIATA*\n\n📦 *Target:* ${total} Gruppi\n🔗 *Link:* ${text}\n\n_Il report dettagliato verrà generato al termine dell'operazione._` 
  }, { quoted: m });

  for (let jid of groups) {
    try {
      // Recupero metadati e partecipanti per il tag invisibile
      const metadata = await conn.groupMetadata(jid);
      const participants = metadata.participants.map(p => p.id);
      const groupName = metadata.subject;

      // Invio messaggio elegante con relayMessage
      await conn.relayMessage(jid, {
        extendedTextMessage: {
          text: text,
          contextInfo: {
            mentionedJid: participants,
            isForwarded: true,
            forwardingScore: 999,
            externalAdReply: {
              title: '🎥 NUOVO VIDEO DISPONIBILE',
              body: 'Guarda ora su TikTok e supporta con un ❤️',
              thumbnailUrl: 'https://qu.ax', 
              sourceUrl: text,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }
      }, {});

      success++;
      listReport += `  ◦ ✅ *${groupName}*\n`;

      // Delay anti-ban bilanciato
      await new Promise(res => setTimeout(res, 2500));

    } catch (e) {
      console.log(`Errore nel gruppo ${jid}`, e);
      listReport += `  ◦ ❌ *Errore ID:* ${jid.split('@')[0]}\n`;
    }
  }

  // 2. REPORT FINALE NELLA STESSA CHAT
  let reportFinal = `✨ *OPERAZIONE CONCLUSA*\n\n` +
                    `📊 *Statistiche invio:*\n` +
                    `  • Successi: ${success}\n` +
                    `  • Falliti: ${total - success}\n\n` +
                    `📝 *DETTAGLIO GRUPPI:*\n${listReport}\n` +
                    `*Sistema di notifica globale attivo.*`;

  await conn.sendMessage(m.chat, { text: reportFinal }, { quoted: m });
};

handler.help = ['newvid'];
handler.tags = ['owner'];
handler.command = /^(newvid|tiktok)$/i;
handler.owner = true;

export default handler;
