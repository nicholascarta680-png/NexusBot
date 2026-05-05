let handler = async (m, { conn, command, isOwner }) => {
    if (!isOwner) return m.reply("❌ Solo il proprietario può usare questo comando.")

    let chatId = m.chat
    if (!global.db.data.chats[chatId]) global.db.data.chats[chatId] = {}

    if (command === 'antisabotaggio') {
        global.db.data.chats[chatId].safetyMode = true
        return m.reply("🛡️ **PROTOCOLLO DI SICUREZZA ATTIVATO**")
    }

    if (command === 'riattiva') {
        global.db.data.chats[chatId].safetyMode = false
        return m.reply("✅ **MODALITÀ STANDARD RIPRISTINATA**")
    }
}

handler.before = async function (m, { isOwner }) {
    if (!m.isGroup) return false
    const chat = global.db.data.chats[m.chat]

    if (chat?.safetyMode) {
        if ([21, 28, 29, 30].includes(m.messageStubType)) return false 
        if (isOwner) return false

        let body = m.text ? m.text.trim() : ''
        let isCommand = /^[.!#/]/.test(body)
        if (isCommand) return true 
    }
}

handler.command = /^(antisabotaggio|riattiva)$/i
handler.group = true

export default handler
