//by easter, mod axtral + AI logic
import fetch from 'node-fetch';

let handler = async (m, { args, conn }) => {

  if (!args[0]) {
    return m.reply(`
╭━〔 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐁𝐀𝐍 𝐂𝐇𝐄𝐂𝐊 〕━╮
┣━━━━━━━━━━━━━━━━━━━━━
┃ 📌 *𝐔𝐬𝐨:* .checkban <numero>
┃ 🌍 *𝐅𝐨𝐫𝐦𝐚𝐭𝐨:* internazionale
╰━━━━━━━━━━━━━━━━━━━━━╯`.trim());
  }

  let phoneNumber = args.join(' ').trim().replace(/[\s\-\(\)\+]/g, '');
  if (phoneNumber.startsWith('3') && phoneNumber.length === 10) phoneNumber = '39' + phoneNumber;

  if (!/^\d+$/.test(phoneNumber) || phoneNumber.length < 10) {
    return m.reply("❌ Numero non valido o troppo corto.");
  }

  try {
    await m.reply("🔍 Verifica in corso...");

    const tokenRes = await fetch('https://baron0.com/api/get-token');
    const { token } = await tokenRes.json();

    const response = await fetch('https://baron0.com/check-number', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-page-token': token },
      body: JSON.stringify({ number: `+${phoneNumber}` }),
    });

    const data = await response.json();
    const isBanned = data.banned || false;
    const err = data.error || {};
    
    // Estraiamo i dettagli tecnici
    const status = (err.status || '').toLowerCase();
    const reason = (err.reason || '').toLowerCase();

    let statoTesto = "";
    let icona = "";

    // --- LOGICA DI DISTINZIONE BAN ---
    if (!isBanned) {
      icona = "🟢";
      statoTesto = "𝐀𝐓𝐓𝐈𝐕𝐎 (Online)";
    } else {
      // Controllo Revisione: Spesso l'API restituisce 'under_review' o simili
      if (reason.includes('review') || status.includes('review') || reason.includes('pending')) {
        icona = "🟡";
        statoTesto = "𝐈𝐍 𝐑𝐄𝐕𝐈𝐒𝐈𝐎𝐍𝐄 (Appello in corso)";
      } 
      // Controllo Ban Permanente: Solitamente indicato da 'bad_parameter' o 'permanently_banned'
      else if (reason.includes('permanent') || reason.includes('critical') || status === 'fail') {
        icona = "💀";
        statoTesto = "𝐁𝐀𝐍 𝐏𝐄𝐑𝐌𝐀𝐍𝐄𝐍𝐓𝐄";
      } 
      // Ban Standard
      else {
        icona = "🔴";
        statoTesto = "𝐁𝐀𝐍𝐍𝐀𝐓𝐎 (Standard)";
      }
    }

    let replyMsg = `╭━〔 📱 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐒𝐓𝐀𝐓𝐔𝐒 〕━╮
┣━━━━━━━━━━━━━━━━━━━━━
┃ 📞 𝐍𝐮𝐦𝐞𝐫ο: +${phoneNumber}
┃ ${icona} 𝐒𝐓𝐀𝐓𝐎: ${statoTesto}
┣━━━━━━━━━━━━━━━━━━━━━
┃ 📊 𝐃𝐄𝐓𝐓𝐀𝐆𝐋𝐈 𝐓𝐄𝐂𝐍𝐈𝐂𝐈
┃ • Status API: ${err.status || 'N/A'}
┃ • Motivo: ${err.reason || 'N/A'}
┃ • Auth: ${Array.isArray(err.fallback_methods) ? err.fallback_methods.join(', ') : 'nessuno'}
┃ • Ora: ${new Date().toLocaleString('it-IT')}
╰━━━━━━━━━━━━━━━━━━━━━╯`;

    m.reply(replyMsg.trim());

  } catch (error) {
    console.error(error);
    m.reply("❌ Errore durante il controllo.");
  }
};

handler.command = /^(checkban|controllabn)$/i;
export default handler;
