// Plug-in creato da elixir
let handler = async (m, { conn, participants }) => {
    // Comando manuale per vedere la classifica attuale
    let message = generateTopMessage(conn, m.chat, participants)
    await conn.reply(m.chat, message, m, { mentions: (await conn.groupMetadata(m.chat)).participants.map(u => u.id) })
}

// Funzione principale per generare il messaggio della classifica
function generateTopMessage(conn, chat, participants) {
    let stats = global.db.data.users
    let topUsers = participants
        .map(u => ({
            jid: u.id,
            msg: stats[u.id]?.messageCount || 0,
            name: stats[u.id]?.name || 'Utente'
        }))
        .sort((a, b) => b.msg - a.msg)
        .slice(0, 10)

    let message = `📊 *𝙲𝙷𝙰𝚃 𝚂𝚃𝙰𝚃𝙸𝚂𝚃𝙸𝙲𝚂* 📊\n━━━━━━━━━━━━━━━━━━━━\n\n`
    let icons = ['🥇', '🥈', '🥉', '👤', '👤', '👤', '👤', '👤', '👤', '👤']
    
    topUsers.forEach((user, i) => {
        if (user.msg > 0) message += `${icons[i]} *${user.name}*\n   ↳ 💬 Messaggi: ${user.msg}\n\n`
    })

    return message + `━━━━━━━━━━━━━━━━━━━━\n🔥 *Classifica aggiornata in tempo reale!*`
}

// ASCOLTATORE: Conta i messaggi
handler.before = async function (m) {
    if (!m.isGroup || !m.sender || m.isBaileys) return
    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { messageCount: 0, name: m.pushName || 'Utente' }
    
    global.db.data.users[m.sender].messageCount += 1
    global.db.data.users[m.sender].name = m.pushName || 'Utente'
}

// LOOP DI RESET DOMENICALE (Ogni domenica alle 23:59)
setInterval(async () => {
    let now = new Date()
    // 0 = Domenica, 23:59
    if (now.getDay() === 0 && now.getHours() === 23 && now.getMinutes() === 59) {
        console.log('[STATS] Avvio invio classifica settimanale e reset...')
        
        const groups = Object.keys(global.conn.chats).filter(id => id.endsWith('@g.us'))
        
        for (let id of groups) {
            try {
                let meta = await global.conn.groupMetadata(id)
                let finalMsg = `🏆 *𝚃𝙾𝙿 𝙵𝙰𝙽 𝙳𝙴𝙻𝙻𝙰 𝚂𝙴𝚃𝚃𝙸𝙼𝙰𝙽𝙰* 🏆\n━━━━━━━━━━━━━━━━━━━━\n\n`
                finalMsg += generateTopMessage(global.conn, id, meta.participants)
                finalMsg += `\n\n♻️ *SISTEMA RESETTATO:* I contatori ripartono da zero. Buona fortuna per la prossima settimana!`
                
                await global.conn.sendMessage(id, { text: finalMsg, mentions: meta.participants.map(u => u.id) })
            } catch (e) { console.error(`Errore reset gruppo ${id}:`, e) }
        }

        // RESET FISICO DEI DATI
        Object.keys(global.db.data.users).forEach(jid => {
            global.db.data.users[jid].messageCount = 0
        })
        console.log('[STATS] Database resettato con successo.')
    }
}, 60000) // Controllo ogni minuto

handler.help = ['topstats']
handler.tags = ['gruppo']
handler.command = /^(topstats|classifica|topfan)$/i
handler.group = true

export default handler
