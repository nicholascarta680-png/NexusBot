// Plug-in creato da elixir
import axios from 'axios'

let handler = async (m, { conn, text, command }) => {
  if (!global.db.data.socialTracker) global.db.data.socialTracker = { targets: [], lastCheck: null }

  // 1. COMANDO STATUS (.newsstatus) - PER VEDERE SE FUNZIONA
  if (command === 'newsstatus') {
    const targets = global.db.data.socialTracker.targets
    const last = global.db.data.socialTracker.lastCheck 
      ? new Date(global.db.data.socialTracker.lastCheck).toLocaleString('it-IT') 
      : 'Mai'
    
    let statusMsg = `📊 *𝚂𝚃𝙰𝚃𝚄𝚂 𝚂𝙾𝙲𝙸𝙰𝙻 𝚃𝚁𝙰𝙲𝙺𝙴𝚁*\n━━━━━━━━━━━━━━━━━━━━\n`
    statusMsg += `⏱️ *Ultimo controllo:* ${last}\n`
    statusMsg += `👥 *Profili monitorati:* ${targets.length}\n\n`
    
    targets.forEach((t, i) => {
      statusMsg += `${i + 1}. 📱 *${t.platform}*: @${t.user}\n   ↳ Last ID: ${t.lastPost || 'Nessuno'}\n`
    })
    
    return m.reply(statusMsg.trim())
  }

  // 2. COMANDO MANUALE (.news link)
  if (command === 'news') {
    if (!text) return m.reply('❌ Inserisci il link dell\'edit!')
    const groups = Object.keys(conn.chats).filter(id => id.endsWith('@g.us'))
    
    let msg = `✨ *𝙽𝙴𝚆 𝙰𝙽𝙸𝙼𝙴 𝙴𝙳𝙸𝚃* ✨\n━━━━━━━━━━━━━━━━━━━━\n\n🎬 *Nuovo contenuto disponibile!*\nGuarda l'ultimo edit qui:\n🔗 ${text.trim()}\n\n━━━━━━━━━━━━━━━━━━━━\n🔥 _Supporta con un like!_`

    for (let id of groups) {
      try {
        const participants = (await conn.groupMetadata(id)).participants.map(u => u.id)
        await conn.sendMessage(id, { text: msg, mentions: participants })
      } catch (e) {}
    }
    return m.reply(`✅ News inviata a tutti i gruppi comuni.`)
  }

  // 3. AGGIUNGI TRACKER (.addtracker tiktok|username)
  if (command === 'addtracker') {
    let [platform, user] = text.split('|')
    if (!platform || !user) return m.reply('Uso: .addtracker tiktok|nomeutente')
    
    global.db.data.socialTracker.targets.push({
      platform: platform.trim().toLowerCase(),
      user: user.trim(),
      lastPost: ''
    })
    m.reply(`✅ Monitoraggio globale avviato per *${user}* ogni 60s.`)
  }
}

// LOOP AUTOMATICO OGNI 60 SECONDI
setInterval(async () => {
  if (!global.conn || !global.db?.data?.socialTracker?.targets) return
  
  global.db.data.socialTracker.lastCheck = Date.now()
  console.log('[TRACKER] Avvio controllo profili...')

  for (let target of global.db.data.socialTracker.targets) {
    try {
      if (target.platform === 'tiktok') {
        const res = await axios.get(`https://tikwm.com{target.user}`)
        const latestVideo = res.data.data?.videos?.[0]

        if (latestVideo && latestVideo.video_id !== target.lastPost) {
          console.log(`[TRACKER] Nuovo video rilevato per ${target.user}!`)
          target.lastPost = latestVideo.video_id
          
          const groups = Object.keys(global.conn.chats).filter(id => id.endsWith('@g.us'))
          let annuncio = `✨ *𝙽𝙴𝚆 𝚃𝙸𝙺𝚃𝙾𝙺 𝙴𝙳𝙸𝚃* ✨\n━━━━━━━━━━━━━━━━━━━━\n\n@${target.user} ha appena caricato un nuovo video!\n\n📝 *Caption:* ${latestVideo.title || 'Nessuna'}\n🔗 https://tiktok.com{target.user}/video/${latestVideo.video_id}\n\n━━━━━━━━━━━━━━━━━━━━`
          
          for (let id of groups) {
             try {
               const meta = await global.conn.groupMetadata(id)
               await global.conn.sendMessage(id, { text: annuncio, mentions: meta.participants.map(u => u.id) })
             } catch (e) {}
          }
        }
      }
    } catch (e) {
      console.error(`[TRACKER ERROR] ${target.user}:`, e.message)
    }
  }
}, 60000) // 60 secondi

handler.help = ['news', 'newsstatus', 'addtracker']
handler.tags = ['social', 'admin']
handler.command = /^(news|newsstatus|newedit|addtracker)$/i
handler.rowner = true

export default handler
