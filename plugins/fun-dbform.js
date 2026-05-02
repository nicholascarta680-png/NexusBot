// Plug-in creato da elixir
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

const BASE_PATH = './media/giftrasformazioni';

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let handler = async (m, { conn, text }) => {
  try {
    let mention = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/@/, '') + '@s.whatsapp.net';
    
    if (!mention || mention.length < 15) mention = m.sender;

    const mentions = [mention];
    const userId = mention.split('@')[0];

    await m.reply('⏳ *Inizio processo di TRASFORMAZIONE...*', null, { mentions });

    const progresses = ['30%', '50%', '70%', '100%'];
    for (const p of progresses) {
      await wait(800);
      await m.reply(`🔍 *Progresso:* ${p}`, null, { mentions });
    }

    const start = performance.now();
    await wait(Math.floor(Math.random() * 3000) + 1000); 
    const end = performance.now();
    const timeTaken = ((end - start) / 1000).toFixed(2);

    const localVideos = {
      // --- CANON ---
      'Oozaru': 'ozaru.mp4',
      'Oozaru Argento': 'ozaru_argento.mp4',
      'Kaioken': 'kaioken.mp4',
      'Super Saiyan': 'super_saiyan.mp4',
      'Super Saiyan di 2° Grado': 'ssj_grado_2.mp4',
      'Super Saiyan di 3° Grado': 'ssj_grado_3.mp4',
      'Super Saiyan Full Power': 'ssj_full_power.mp4',
      'Super Saiyan 2': 'super_saiyan_2.mp4',
      'Super Saiyan 3': 'super_saiyan_3.mp4',
      'Super Saiyan God': 'super_saiyan_god.mp4',
      'Super Saiyan Blue': 'super_saiyan_blue.mp4',
      'Super Saiyan Blue Kaioken': 'super_saiyan_blue_kaioken.mp4',
      'Super Saiyan Blue Evolution': 'super_saiyan_blue_evolution.mp4',
      'Ultra Istinto Incompleto (Omen)': 'ultra_istinto_omen.mp4',
      'Ultra Istinto Perfezionato': 'ultra_istinto_mastered.mp4',
      'Ultra Ego': 'ultra_ego.mp4',
      'Gohan Beast': 'beast_form.mp4',
      'Orange Piccolo': 'orange_piccolo.mp4',
      'Potenziale Risvegliato (Ultimate)': 'ultimate_form.mp4',
      'Super Saiyan Rose': 'ssj_rose.mp4',
      'Super Saiyan Ikari (Rabbia)': 'ssj_ikari.mp4',
      'Super Saiyan Leggendario (Berserk)': 'ssj_leggendario.mp4',

      // --- NON CANON (GT / MOVIE / HEROES) ---
      'Falso Super Saiyan': 'fake_super_saiyan.mp4',
      'Super Saiyan 4': 'super_saiyan_4_gt.mp4',
      'Super Saiyan 4 (Daima)': 'super_saiyan_4_daima.mp4',
      'Super Saiyan 4 Limite Superato': 'ssj4_lb.mp4',
      'Super Saiyan 5 (AF)': 'ssj5_af.mp4',
      'Oozaru d\'Oro': 'ozaru_oro.mp4',
      'Super Saiyan God Super Saiyan (Universale)': 'ssj_blue_universal.mp4',
      'Super Saiyan Rose Full Power': 'ssj_rose_fp.mp4',
      'Super Saiyan 3 (Rose)': 'ssj3_rose.mp4'
    };

    const keys = Object.keys(localVideos);
    const chosen = pickRandom(keys);
    const videoFile = localVideos[chosen];
    const videoPath = path.join(BASE_PATH, videoFile);

    if (!fs.existsSync(videoPath)) {
      await m.reply(`⚠️ Errore critico: La forma *${chosen}* non è ancora stata sbloccata (Video mancante).`, null, { mentions });
      return;
    }

    const finalMsg = `*✔️ TRASFORMAZIONE COMPLETATA*  
━━━━━━━━━━━━━━━━━━━━━  
👤 *Guerriero:* @${userId}  
🪐 *Forma:* ${chosen}  
🕒 *Tempo:* ${timeTaken}s  
━━━━━━━━━━━━━━━━━━━━━  
╔═══════════════════╗  
║    🔮𝓔𝓵𝓲𝔁𝓲𝓻-𝓑𝓸𝓽🔮  ║  
╚═══════════════════╝`;

    await conn.sendMessage(
      m.chat,
      {
        video: { url: videoPath },
        caption: finalMsg,
        mentions,
        gifPlayback: true // Opzionale: lo invia come GIF se preferisci
      },
      { quoted: m }
    );

  } catch (err) {
    console.error(err);
    await m.reply('⚠️ Il tuo corpo non ha retto la potenza della trasformazione...');
  }
};

handler.help = ['saiyan']
handler.tags = ['fun']
handler.command = /^(saiyan|trasformati)$/i

export default handler;
