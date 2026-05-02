// Plug-in creato da elixir
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

// ASSICURATI che questa cartella esista nel tuo server locale!
const BASE_PATH = './media/giftrasformazioni'; 

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let handler = async (m, { conn, text }) => {
  try {
    let mention = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/@/, '') + '@s.whatsapp.net';
    if (!mention || mention.length < 15) mention = m.sender;

    const mentions = [mention];
    const userId = mention.split('@')[0];

    await m.reply('⏳ *Inizio processo di TRASFORMAZIONE...*', null, { mentions });

    const progresses = ['30%', '50%', '70%', '100%'];
    for (const p of progresses) {
      await wait(500);
      await m.reply(`🔍 *Progresso:* ${p}`, null, { mentions });
    }

    const start = performance.now();
    await wait(1000); 
    const end = performance.now();
    const timeTaken = ((end - start) / 1000).toFixed(2);

    // Nomi dei file IDENTICI allo screenshot di GitHub
    const localVideos = {
      'Beast Form': 'beast_form.mp4',
      'Fake Super Saiyan': 'fake_super_saiyan.mp4',
      'Kaioken': 'kaioken.mp4',
      'Orange Piccolo': 'orange_piccolo.mp4',
      'Oozaru': 'ozaru.mp4',
      'Oozaru Argento': 'ozaru_argento.mp4',
      'Oozaru Controllato': 'ozaru_controllato.mp4',
      'Oozaru d\'Oro': 'ozaru_oro.mp4',
      'Super Saiyan 5 (AF)': 'ssj5_af.mp4',
      'Super Saiyan Full Power': 'ssj_full_power.mp4',
      'Super Saiyan di 2° Grado': 'ssj_grado_2.mp4',
      'Super Saiyan di 3° Grado': 'ssj_grado_3.mp4',
      'Super Saiyan Ikari': 'ssj_ikari.mp4',
      'Super Saiyan Leggendario': 'ssj_leggendario.mp4',
      'Super Saiyan Rose': 'ssj_rose.mp4',
      'Super Saiyan': 'super_saiyan.mp4',
      'Super Saiyan 2': 'super_saiyan_2.mp4',
      'Super Saiyan 3': 'super_saiyan_3.mp4',
      'Super Saiyan 4 (GT)': 'super_saiyan_4_gt.mp4',
      'Super Saiyan Blue Evolution': 'super_saiyan_blue_evolution.mp4',
      'Super Saiyan Blue Kaioken': 'super_saiyan_blue_kaioken.mp4',
      'Super Saiyan God': 'super_saiyan_god.mp4',
      'Super Saiyan God SSJ': 'super_saiyan_god_ssj.mp4',
      'Super Saiyan Kaioken': 'super_saiyan_kaioken.mp4',
      'Ultimate Form': 'ultimate_form.mp4',
      'Ultra Ego': 'ultra_ego.mp4',
      'Ultra Istinto Mastered': 'ultra_istinto_mastered.mp4',
      'Ultra Istinto Omen': 'ultra_istinto_omen.mp4'
    };

    const keys = Object.keys(localVideos);
    const chosen = pickRandom(keys);
    const videoFile = localVideos[chosen];
    
    // Costruiamo il percorso
    const videoPath = path.join(process.cwd(), 'media', 'giftrasformazioni', videoFile);

    // Controllo esistenza file
    if (!fs.existsSync(videoPath)) {
      await m.reply(`⚠️ Errore: Il file *${videoFile}* non è stato trovato nel server.\nPercorso cercato: \`${videoPath}\``, null, { mentions });
      return;
    }

    const finalMsg = `*✔️ TRASFORMAZIONE COMPLETATA*  
━━━━━━━━━━━━━━━━━━━━━  
👤 *Guerriero:* @${userId}  
🪐 *Forma:* ${chosen}  
🕒 *Tempo:* ${timeTaken}s  
━━━━━━━━━━━━━━━━━━━━━  
╔═══════════════════╗  
║    🔮ᴇʟɪxɪʀ-ʙᴏᴛ🔮  ║  
╚═══════════════════╝`;

    await conn.sendMessage(m.chat, {
        video: fs.readFileSync(videoPath),
        caption: finalMsg,
        mentions
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    await m.reply('⚠️ Errore critico durante la trasformazione.');
  }
};

handler.help = ['saiyan']
handler.tags = ['fun']
handler.command = /^(saiyan|trasformati)$/i

export default handler;
