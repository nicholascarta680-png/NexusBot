import fs from 'fs';
import path from 'path';

let handler = async (m, { conn }) => {
  const filePath = path.join(process.cwd(), 'src', 'trabas', 'traba5.txt');

  if (!fs.existsSync(filePath)) {
    return m.reply('❌ File "traba5.txt" non trovato in /src/trabas/');
  }

  const contenuto = fs.readFileSync(filePath, 'utf-8');
  const chunkSize = 8000;
  const blocchi = [];

  // Spezza in blocchi da 8000
  for (let i = 0; i < contenuto.length && blocchi.length < 10; i += chunkSize) {
    blocchi.push(contenuto.slice(i, i + chunkSize));
  }

  // Invio rapidissimo, spam
  for (const blocco of blocchi) {
    await conn.sendMessage(m.chat, { text: blocco }, { quoted: m });
  }
};

handler.command = /^crash$/i;
handler.tags = ['fun'];
handler.help = ['crash'];
handler.premium = false;
handler.limit = false;

export default handler;