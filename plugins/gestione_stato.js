// Plug-in creato da elixir
let handler = async (m, { conn, command, isOwner }) => {
    if (!isOwner) return m.reply("❌ Solo il proprietario può usare questo comando.")

    let chatId = m.chat // Identifica SOLO questo gruppo
    if (!global.db.data.chats[chatId]) global.db.data.chats[chatId] = {}

    if (command === 'offbot') {
        global.db.data.chats[chatId].isBanned = true
        return m.reply("🌑 *MODALITÀ INATTIVA ATTIVATA*\nI comandi comuni sono disattivati in questo gruppo. L'Antinuke resta vigile.")
    }

    if (command === 'onbot') {
        global.db.data.chats[chatId].isBanned = false
        return m.reply("✅ *MODALITÀ OPERATIVA RIPRISTINATA*\nIl bot è di nuovo attivo in questo gruppo.")
    }
}

// Filtro che blocca i comandi solo se il gruppo specifico è inattivo
handler.before = async function (m, { isOwner }) {
    if (!m.isGroup) return false
    
    // Controlla lo stato SOLO del gruppo corrente
    const chat = global.db.data.chats[m.chat]
    if (chat?.isBanned && !isOwner) {
        let body = m.text ? m.text.trim() : ''
        let isCommand = /^[.!#/]/.test(body)
        if (isCommand) return true // Blocca gli altri plugin
    }
}

handler.help = ['onbot', 'offbot']
handler.tags = ['owner']
handler.command = /^(onbot|offbot)$/i
handler.group = true

export default handler
