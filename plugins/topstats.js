// Plug-in creato da elixir
let handler = async (m, { conn }) => {
    // Recuperiamo i dati del database
    let stats = global.db.data.users
    let participants = (await conn.groupMetadata(m.chat)).participants
    
    // Creiamo la lista filtrata
    let topUsers = participants
        .map(u => ({
            jid: u.id,
            msg: stats[u.id]?.messageCount || 0,
            name: stats[u.id]?.name || 'Utente'
        }))
        .filter(u => u.msg > 0) // Mostriamo solo chi ha scritto almeno un messaggio
        .sort((a, b) => b.msg - a.msg)
        .slice(0, 10)

    if (topUsers.length === 0) return m.reply('📊 *Nessun dato registrato ancora.* Iniziate a scrivere per scalare la classifica!')

    let message = `📊 *𝙲𝙷𝙰𝚃 𝚂𝚃𝙰𝚃𝙸𝚂𝚃𝙸𝙲𝚂* 📊\n━━━━━━━━━━━━━━━━━━━━\n\n`
    let icons = ['🥇', '🥈', '🥉', '👤', '👤', '👤', '👤', '👤', '👤', '👤']
    
    topUsers.forEach((user, i) => {
        message += `${icons[i]} *${user.name}*\n   ↳ 💬 Messaggi: ${user.msg}\n\n`
    })

    message += `━━━━━━━━━━━━━━━━━━━━\n🔥 *Classifica aggiornata in tempo reale!*`

    await conn.sendMessage(m.chat, { text: message, mentions: topUsers.map(u => u.jid) }, { quoted: m })
}

// ASCOLTATORE: Deve essere fuori dall'handler principale
handler.before = async function (m) {
    if (!m.isGroup || !m.sender || m.isBaileys) return
    
    // Inizializzazione sicura del database
    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.users[m.sender]) {
        global.db.data.users[m.sender] = { 
            messageCount: 0, 
            name: m.pushName || 'Utente' 
        }
    }
    
    // Incremento
    global.db.data.users[m.sender].messageCount += 1
    global.db.data.users[m.sender].name = m.pushName || 'Utente'
    
    // Debug opzionale in console (toglilo se dà fastidio)
    // console.log(`[STATS] Messaggio da ${m.pushName}: ${global.db.data.users[m.sender].messageCount}`)
    
    return true
}

// RESET DOMENICALE (Stessa logica di prima)
setInterval(async () => {
    let now = new Date()
    if (now.getDay() === 0 && now.getHours() === 23 && now.getMinutes() === 59) {
        const groups = Object.keys(global.conn.chats).filter(id => id.endsWith('@g.us'))
        for (let id of groups) {
            try {
                let meta = await global.conn.groupMetadata(id)
                let finalMsg = `🏆 *𝚃𝙾𝙿 𝙵𝙰𝙽 𝙳𝙴𝙻𝙻𝙰 𝚂𝙴𝚃𝚃𝙸𝙼𝙰𝙽𝙰* 🏆\n\n` + generateTopMessage(global.conn, id, meta.participants)
                await global.conn.sendMessage(id, { text: finalMsg, mentions: meta.participants.map(u => u.id) })
            } catch (e) {}
        }
        Object.keys(global.db.data.users).forEach(jid => global.db.data.users[jid].messageCount = 0)
    }
}, 60000)

handler.help = ['topstats']
handler.tags = ['gruppo']
handler.command = /^(topstats|classifica|topfan)$/i
handler.group = true

export default handler
