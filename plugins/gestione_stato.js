// Plug-in creato da elixir
let handler = async (m, { conn, command, isOwner }) => {
    if (!isOwner) return m.reply("❌ Solo il proprietario può usare questo comando.")

    let chatId = m.chat
    if (!global.db.data.chats[chatId]) global.db.data.chats[chatId] = {}

    if (command === 'offbot') {
        global.db.data.chats[chatId].isBanned = true
        return m.reply("🌑 *MODALITÀ INATTIVA ATTIVATA*\nI comandi comuni sono disattivati qui.")
    }

    if (command === 'onbot') {
        global.db.data.chats[chatId].isBanned = false
        return m.reply("✅ *MODALITÀ OPERATIVA RIPRISTINATA*")
    }
}

handler.before = async function (m, { isOwner }) {
    if (!m.isGroup) return false
    const chat = global.db.data.chats[m.chat]
    
    // Se il bot è inattivo e NON sei l'owner, blocca tutto
    if (chat?.isBanned && !isOwner) {
        let body = m.text ? m.text.trim() : ''
        let isCommand = /^[.!#/]/.test(body)
        if (isCommand) return true // Questo 'true' ferma gli altri plugin
    }
}

handler.priority = -100 // PRIORITÀ MASSIMA
handler.command = /^(onbot|offbot)$/i
handler.group = true

export default handler
