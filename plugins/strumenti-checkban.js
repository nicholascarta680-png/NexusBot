//by easter, mod axtral
import fetch from 'node-fetch';

let handler = async (m, { args, conn }) => {

  if (!args[0]) {
    return m.reply(`
💎 *𝐄𝐋𝐈𝐗𝐈𝐑 𝐁𝐀𝐍 𝐒𝐄𝐍𝐓𝐈𝐍𝐄𝐋*
━━━━━━━━━━━━━━━━━━━━━
📑 *𝐔𝐬𝐨:* \`.checkban <numero>\`
🌍 *𝐅𝐨𝐫𝐦𝐚𝐭𝐨:* Internazionale

💡 *𝐄𝐬𝐞𝐦𝐩𝐢:*
  • .checkban 391112224444
  • .checkban +34 796 843 00

🛡️ _Il sistema rimuove automaticamente spazi e simboli._
━━━━━━━━━━━━━━━━━━━━━
`.trim());
  }

  let phoneNumber = args.join(' ').trim();
  phoneNumber = phoneNumber.replace(/[\s\-\(\)\+]/g, '');

  if (phoneNumber.startsWith('3') && phoneNumber.length === 10) {
    phoneNumber = '39' + phoneNumber;
  }

  if (!/^\d+$/.test(phoneNumber)) {
    return m.reply(`
⚠️ *𝐀𝐓𝐓𝐄𝐍𝐙𝐈𝐎𝐍𝐄: 𝐈𝐍𝐏𝐔𝐓 𝐄𝐑𝐑𝐀𝐓𝐎*
━━━━━━━━━━━━━━━━━━━━━
📌 Inserisci solo cifre numeriche.
❌ Caratteri speciali non ammessi.
━━━━━━━━━━━━━━━━━━━━━
`.trim());
  }

  if (phoneNumber.length < 10) {
    return m.reply(`
❗ *𝐃𝐀𝐓𝐈 𝐈𝐍𝐒𝐔𝐅𝐅𝐈𝐂𝐈𝐄𝐍𝐓𝐈*
━━━━━━━━━━━━━━━━━━━━━
📌 Il numero inserito è troppo corto.
📉 Sono necessarie almeno 10 cifre.
━━━━━━━━━━━━━━━━━━━━━
`.trim());
  }

  try {

    await m.reply(`
🛰️ *𝐂𝐎𝐍𝐍𝐄𝐒𝐒𝐈𝐎𝐍𝐄 𝐀𝐈 𝐒𝐄𝐑𝐕𝐄𝐑...*
━━━━━━━━━━━━━━━━━━━━━
🔍 Verifica integrità in corso su 
   database *WhatsApp Business*
━━━━━━━━━━━━━━━━━━━━━
`.trim());

    const tokenRes = await fetch('https://baron0.com/api/get-token');

    if (!tokenRes.ok) {
      return m.reply(`
🚫 *𝐒𝐄𝐑𝐕𝐈𝐙𝐈𝐎 𝐍𝐎𝐍 𝐃𝐈𝐒𝐏𝐎𝐍𝐈𝐁𝐈𝐋𝐄*
━━━━━━━━━━━━━━━━━━━━━
❌ Errore API: HTTP ${tokenRes.status}
🔑 Token di sessione non valido.
━━━━━━━━━━━━━━━━━━━━━
`.trim());
    }

    const { token } = await tokenRes.json();

    const response = await fetch('https://baron0.com/check-number', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-page-token': token,
      },
      body: JSON.stringify({
        number: `+${phoneNumber}`
      }),
    });

    if (!response.ok) {
      return m.reply(`
⛔ *𝐄𝐑𝐑𝐎𝐑𝐄 𝐃𝐈 𝐑𝐄𝐓𝐄*
━━━━━━━━━━━━━━━━━━━━━
❌ HTTP: ${response.status}
🔗 Endpoint non raggiungibile.
━━━━━━━━━━━━━━━━━━━━━
`.trim());
    }

    const data = await response.json();
    const isBanned = data.banned || false;
    const err = data.error || {};

    const status = err.status || 'unknown';
    const reason = err.reason || 'unknown';
    const loginNum = err.login || phoneNumber;

    const methods =
      Array.isArray(err.fallback_methods) &&
      err.fallback_methods.length
        ? err.fallback_methods.join(', ')
        : 'nessuno';

    const autoconf =
      err.autoconf_type != null
        ? err.autoconf_type
        : 'n/a';

    let replyMsg = `📱 *𝐑𝐄𝐏𝐎𝐑𝐓 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐒𝐓𝐀𝐓𝐔𝐒*
━━━━━━━━━━━━━━━━━━━━━
📞 *𝐍𝐮𝐦𝐞𝐫𝐨:* +${loginNum}

`;

if (isBanned) {
  replyMsg += `🛡️ *𝐒𝐓𝐀𝐓𝐎:* 🔴 𝐁𝐀𝐍𝐍𝐀𝐓𝐎
⚠️ _Questo account è stato sospeso dai sistemi di sicurezza WhatsApp._
`;
} else {
  replyMsg += `🛡️ *𝐒𝐓𝐀𝐓𝐎:* 🟢 𝐀𝐓𝐓𝐈𝐕𝐎
✅ _L'account risulta regolarmente registrato e funzionante._
`;
}

replyMsg += `
📊 *𝐃𝐄𝐓𝐓𝐀𝐆𝐋𝐈 𝐓𝐄𝐂𝐍𝐈𝐂𝐈*
  • 𝐒𝐭𝐚𝐭𝐮𝐬: \`${status}\`
  • 𝐌𝐨𝐭𝐢𝐯𝐨: \`${reason}\`
  • 𝐀𝐮𝐭𝐡: \`${methods}\`
  • 𝐀𝐮𝐭𝐨𝐜𝐨𝐧𝐟: \`${autoconf}\`

🕒 *🕒 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐨 il:* ${new Date().toLocaleString('it-IT')}
━━━━━━━━━━━━━━━━━━━━━`;

m.reply(replyMsg.trim());

  } catch (error) {
    console.error('WhatsApp Ban Check Error:', error);
    m.reply(`
🌪️ *𝐄𝐑𝐑𝐎𝐑E 𝐃𝐄𝐋 𝐒𝐈𝐒𝐓𝐄𝐌𝐀*
━━━━━━━━━━━━━━━━━━━━━
🌐 Connessione fallita.
📝 Dettaglio: ${error.message}
━━━━━━━━━━━━━━━━━━━━━
`.trim());
  }
};

handler.help = ['checkban'];
handler.tags = ['tools'];
handler.command = /^(checkban|check-ban|controllabn|controllawhatsapp|wa-check|whatsapp-check)$/i;

export default handler;
