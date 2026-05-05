// Plug-in creato da elixir
let handler = async (m, { conn, command, isOwner }) => {
    if (!isOwner) return m.reply("❌ Solo il proprietario può usare questo comando.")

    let chatId = m.chat
    if (!global.db.data.chats[chatId]) global.db.data.chats[chatId] = {}
    
    // Inizializza la proprietà se non esiste
    if (typeof global.db.data.chats[chatId].isBanned === 'undefined') {
        global.db.data.chats[chatId].isBanned = false
    }

    if (command === 'offbot') {
        if (global.db.data.chats[chatId].isBanned) return m.reply("⚠️ Il bot è già inattivo in questo gruppo.")
        global.db.data.chats[chatId].isBanned = true
        return m.reply("🔴 *Bot Disattivato*\nDa questo momento ignorerò ogni comando. Solo l'Antinuke rimarrà attivo.")
    }

    if (command === 'onbot') {
        if (!global.db.data.chats[chatId].isBanned) return m.reply("⚠️ Il bot è già attivo.")
        global.db.data.chats[chatId].isBanned = false
        return m.reply("🟢 *Bot Riattivato*\nComandi nuovamente disponibili!")
    }
}

// --- LOGICA DI BLOCCO ---
handler.before = async function (m, { isOwner }) {
    if (!m.isGroup) return
    let chat = global.db.data.chats[m.chat]
    
    // Se il gruppo è bannato/inattivo e non è l'owner a scrivere
    if (chat?.isBanned && !isOwner) {
        // Lista comandi che devono SEMPRE funzionare (es. antinuke)
        // Se il tuo antinuke è un plugin a parte, non verrà influenzato da questo 'return'
        const permessi = /^(onbot|antinuke)/i 
        let body = m.text ? m.text.trim() : ''
        let isCommand = body.startsWith('.') || body.startsWith('/') || body.startsWith('!')
        let cmd = body.slice(1).split(' ')[0].toLowerCase()

        if (isCommand && !permessi.test(cmd)) {
            return true // Blocca l'esecuzione degli altri plugin
        }
    }
}

handler.help = ['onbot', 'offbot']
handler.tags = ['owner']
handler.command = /^(onbot|offbot)$/i
handler.group = true

export default handler
