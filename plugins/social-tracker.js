// Plug-in creato da elixir
import axios from 'axios'

let handler = async (m, { conn, text, command, participants }) => {
  const users = participants.map((u) => conn.decodeJid(u.id))
  
  // Inizializza il database se non esiste
  if (!global.db.data.socialTracker) global.db.data.socialTracker = { targets: [] }

  // 1. COMANDO MANUALE (.annuncio link)
  if (command === 'annuncio' || command === 'newedit') {
    if (!text) return m.reply('❌ Inserisci il link dell\'edit!')
    
    let msg = `✨ *𝚂𝚈𝚂𝚃𝙴𝙼 𝙰𝙽𝙽𝙾𝚄𝙽𝙲𝙴* ✨\n━━━━━━━━━━━━━━━━━━━━\n\n🎬 *Nuovo contenuto disponibile!*\nGuarda l'ultimo edit qui:\n🔗 ${text.trim()}\n\n━━━━━━━━━━━━━━━━━━━━\n🔥 _Supporta con un like!_`
    
    return await conn.sendMessage(m.chat, { text: msg, mentions: users }, { quoted: m })
  }

  // 2. AGGIUNGI TRACKER (.addtracker tiktok|username)
  if (command === 'addtracker') {
    if (!m.isGroup) return m.reply('Questo comando funziona solo nei gruppi.')
    let [platform, user] = text.split('|')
    if (!platform || !user) return m.reply('Uso: .addtracker tiktok|nomeutente')
    
    global.db.data.socialTracker.targets.push({
      platform: platform.trim().toLowerCase(),
      user: user.trim(),
      lastPost: '',
      chat: m.chat
    })
    m.reply(`✅ Monitoraggio avviato per *${user}* su *${platform}*\nRiceverai gli hidetag in questo gruppo.`)
  }
}

// LOOP AUTOMATICO (Ogni 5 minuti)
setInterval(async () => {
  if (!global.db?.data?.socialTracker?.targets) return

  for (let target of global.db.data.socialTracker.targets) {
    try {
      if (target.platform === 'tiktok') {
        // API pubblica per recuperare l'ultimo video di TikTok
        const res = await axios.get(`https://tikwm.com{target.user}`)
        const latestVideo = res.data.data?.videos?.[0]

        if (latestVideo && latestVideo.video_id !== target.lastPost) {
          target.lastPost = latestVideo.video_id
          
          // Recupera i partecipanti per l'hidetag
          const groupMetadata = await global.conn.groupMetadata(target.chat)
          const users = groupMetadata.participants.map(u => u.id)

          let annuncio = `✨ *𝙽𝙴𝚆 𝚃𝙸𝙺𝚃𝙾𝙺 𝙴𝙳𝙸𝚃* ✨\n━━━━━━━━━━━━━━━━━━━━\n\n@${target.user} ha appena caricato un nuovo video!\n\n📝 *Caption:* ${latestVideo.title || 'Nessuna'}\n🔗 https://tiktok.com{target.user}/video/${latestVideo.video_id}\n\n━━━━━━━━━━━━━━━━━━━━`
          
          await global.conn.sendMessage(target.chat, { text: annuncio, mentions: users })
        }
      }
    } catch (e) {
      console.error('Errore Tracker:', e.message)
    }
  }
}, 300000) 

handler.help = ['annuncio', 'addtracker']
handler.tags = ['social', 'admin']
handler.command = /^(annuncio|newedit|addtracker)$/i
handler.group = true
handler.admin = true

export default handler
