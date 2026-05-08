let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    let who;

    // 1. Logica di identificazione migliorata (Numero, Tag, Reply o Se stessi)
    if (text) {
      // Rimuove spazi, trattini e il simbolo + per pulire il numero
      let number = text.replace(/[@\s+-]/g, '');
      if (!isNaN(number) && number.length >= 7 && number.length <= 15) {
        who = number + '@s.whatsapp.net';
      } else if (m.mentionedJid && m.mentionedJid[0]) {
        who = m.mentionedJid[0];
      }
    } else if (m.quoted) {
      who = m.quoted.sender;
    } else {
      who = m.sender;
    }

    // Informazioni utente
    let name = await conn.getName(who);
    let userNumber = who.split('@')[0];

    // Tentativo di recupero immagine profilo
    let pp;
    try {
      pp = await conn.profilePictureUrl(who, 'image');
    } catch {
      pp = null;
    }

    // Messaggio di attesa (opzionale, dà un tocco professionale)
    // await m.react('⏳');

    if (!pp) {
      let noPic = `
┏━━━━━━━ ● ● ━━━━━━━┓
┃   ⚠️  *AVVISO PROFILO*
┃
┃ 👤 *Utente:* ${name}
┃ 📱 *Numero:* ${userNumber}
┃ ❌ *Errore:* Nessuna foto trovata
┗━━━━━━━━━━━━━━━━━━━━┛`;
      return conn.reply(m.chat, noPic, m);
    }

    // Grafica elegante per la didascalia
    let caption = `
╔════════════════════╗
      ✨ *PROFILE PICTURE* ✨
╚════════════════════╝

  👤  *Nome:* ${name}
  📱  *ID:* @${userNumber}
  🔗  *Link:* wa.me/${userNumber}

      _Scaricata con successo!_
`.trim();

    await conn.sendFile(m.chat, pp, 'profile.jpg', caption, m, null, { mentions: [who] });
    // await m.react('✅');

  } catch (err) {
    console.error('Errore nel comando .pfp:', err);
    await conn.reply(m.chat, `❌ *Si è verificato un errore inaspettato.*`, m);
  }
};

handler.help = ['pfp', 'pic <@tag/numero/reply>'];
handler.tags = ['tools'];
handler.command = ['pfp', 'fotoprofilo', 'pic', 'getpp'];

export default handler;