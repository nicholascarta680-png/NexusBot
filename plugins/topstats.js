// Plug-in creato da elixir
let handler = async (m, { conn, groupMetadata }) => {
    let stats = global.db.data.users
    let participants = m.isGroup ? m.metadata.participants : []
    
    // Filtriamo gli utenti che appartengono al gruppo attuale e hanno inviato almeno un messaggio
    let topUsers = participants
        .map(u => ({
            jid: u.id,
            msg: stats[u.id]?.messageCount || 0,
            name: stats[u.id]?.name || 'Utente'
        }))
        .sort((a, b) => b.msg - a.msg)
        .slice(0, 10) // Prendiamo i primi 10

    let message = `📊 *𝙲𝙷𝙰𝚃 𝚂𝚃𝙰𝚃𝙸𝚂𝚃𝙸𝙲𝚂* 📊\n━━━━━━━━━━━━━━━━━━━━\n\n`
    
    let icons = ['🥇', '🥈', '🥉', '👤', '👤', '👤', '👤', '👤', '👤', '👤']
    
    topUsers.forEach((user, i) => {
        if (user.msg > 0) {
            message += `${icons[i]} *${user.name}*\n   ↳ 💬 Messaggi: ${user.msg}\n\n`
        }
    })

    message += `━━━━━━━━━━━━━━━━━━━━\n🔥 *Continuate a scrivere per scalare la classifica!*`

    await conn.reply(m.chat, message, m, { mentions: topUsers.map(u => u.jid) })
}

// Questa parte "ascolta" e salva il conteggio (da inserire nel sistema di caricamento o come funzione extra)
handler.before = async function (m) {
    if (!m.isGroup || !m.sender || m.isBaileys) return
    if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = { messageCount: 0, name: m.pushName || 'Utente' }
    
    // Incrementa il contatore messaggi
    global.db.data.users[m.sender].messageCount += 1
    global.db.data.users[m.sender].name = m.pushName || 'Utente'
}

handler.help = ['topstats', 'classifica']
handler.tags = ['gruppo']
handler.command = /^(topstats|classifica|topfan)$/i
handler.group = true

export default handler
