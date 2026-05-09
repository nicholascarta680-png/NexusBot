//by easter, mod axtral
import fetch from 'node-fetch';

let handler = async (m, { args, conn }) => {

  if (!args[0]) {
    return m.reply(`
   *─── 「 ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴀɴ ᴄʜᴇᴄᴋ 」 ───*

  *🔍 sᴛᴀᴛᴜs ɪɴᴠᴇsᴛɪɢᴀᴛᴏʀ*
  
  💡 _Usa il comando per verificare la_
  _presenza di restrizioni su un numero._

  › *ᴜsᴏ:* .checkban [numero]
  › *ᴇsᴇᴍᴘɪᴏ:* .checkban 393330000000

  *✨ ᴇʟɪxɪʀ sᴇᴄᴜʀɪᴛʏ sʏsᴛᴇᴍ*
   *──────────────────────────*
`.trim());
  }

  let phoneNumber = args.join(' ').trim();
  phoneNumber = phoneNumber.replace(/[\s\-\(\)\+]/g, '');

  if (phoneNumber.startsWith('3') && phoneNumber.length === 10) {
    phoneNumber = '39' + phoneNumber;
  }

  if (!/^\d+$/.test(phoneNumber)) {
    return m.reply(`
  *⚠️ ɪɴᴘᴜᴛ ɴᴏɴ ᴠᴀʟɪᴅᴏ*
  _Per favore, inserisci solo cifre numeriche._
`.trim());
  }

  if (phoneNumber.length < 10) {
    return m.reply(`
  *📉 ᴅᴀᴛɪ ɪɴsᴜғғɪᴄɪᴇɴᴛɪ*
  _Il numero deve contenere almeno 10 cifre._
`.trim());
  }

  try {
    // Messaggio di attesa elegante
    await m.reply(`*⏳ ᴀɴᴀʟɪsɪ ɪɴ ᴄᴏʀsᴏ...*`);

    const tokenRes = await fetch('https://baron0.com');
    if (!tokenRes.ok) return m.reply(`*❌ ᴇʀʀᴏʀᴇ:* Sessione API fallita.`);

    const { token } = await tokenRes.json();
    const response = await fetch('https://baron0.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-page-token': token,
      },
      body: JSON.stringify({ number: `+${phoneNumber}` }),
    });

    if (!response.ok) return m.reply(`*❌ ᴇʀʀᴏʀᴇ:* Endpoint non raggiungibile.`);

    const data = await response.json();
    const isBanned = data.banned || false;
    const err = data.error || {};

    const status = err.status || 'ɴ/ᴀ';
    const reason = err.reason || 'ɴ/ᴀ';
    const loginNum = err.login || phoneNumber;

    const methods = Array.isArray(err.fallback_methods) && err.fallback_methods.length
        ? err.fallback_methods.join(', ') : 'nessuno';

    const autoconf = err.autoconf_type != null ? err.autoconf_type : 'n/a';

    // Costruzione messaggio finale elegante
    let report = `
   *─── 「 ᴀɴᴀʟɪsɪ ᴛᴇʟᴇғᴏɴɪᴄᴀ 」 ───*

  📞 *ɴᴜᴍᴇʀᴏ:* \`+${loginNum}\`
  ${isBanned ? '🔴 *sᴛᴀᴛᴏ:* ʙᴀɴɴᴀᴛᴏ' : '🟢 *sᴛᴀᴛᴏ:* ᴀᴛᴛɪᴠᴏ'}

  *📊 ᴅᴇᴛᴛᴀɢʟɪ sʏsᴛᴇᴍ*
  ┌  
  │ • *sᴛᴀᴛᴜs:* \`${status}\`
  │ • *ᴍᴏᴛɪᴠᴏ:* \`${reason}\`
  │ • *ᴀᴜᴛʜ:* \`${methods}\`
  │ • *ᴀᴜᴛᴏᴄᴏɴғ:* \`${autoconf}\`
  └

  *🕒 ɢᴇɴᴇʀᴀᴛᴏ:* ${new Date().toLocaleTimeString('it-IT')}
   *──────────────────────────*
`.trim();

    m.reply(report);

  } catch (error) {
    console.error('WhatsApp Ban Check Error:', error);
    m.reply(`*🚨 ᴇʀʀᴏʀᴇ ᴅɪ sɪsᴛᴇᴍᴀ:* \n\`${error.message}\``);
  }
};

handler.help = ['checkban'];
handler.tags = ['tools'];
handler.command = /^(checkban|check-ban|controllabn|controllawhatsapp|wa-check|whatsapp-check)$/i;

export default handler;
