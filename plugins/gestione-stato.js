// Gestione stato gruppo: .antisabotaggio e .riattiva
let handler = async (m, { conn, command, isOwner }) => {
    if (!isOwner) return m.reply("❌ Solo il proprietario può usare questo comando.")
    if (!m.isGroup) return m.reply("❌ Questo comando funziona solo nei gruppi.")

    let chatId = m.chat
    if (!global.db.data.chats[chatId]) {
        global.db.data.chats[chatId] = {}
    }
    let chat = global.db.data.chats[chatId]

    if (command === 'antisabotaggio') {
        chat.antinuke = true
        await global.db.write()
        return m.reply("🛡️ **PROTOCOLLO ANTINUKE ATTIVATO**\n\nIl bot monitorerà e bloccherà modifiche non autorizzate al gruppo.\nUsa .riattiva per disattivare.")
    }

    if (command === 'riattiva') {
        chat.antinuke = false
        // Riapre il gruppo (tutti possono scrivere) e resetta lo stato
        try {
            await conn.groupSettingUpdate(m.chat, 'not_announcement')
        } catch (e) {
            console.error('[ERRORE] Impossibile riaprire il gruppo:', e)
        }
        await global.db.write()
        return m.reply("✅ **MODALITÀ STANDARD RIPRISTINATA**\n\nAntinuke disattivato, gruppo riaperto. Ora tutti possono modificare il gruppo liberamente.")
    }
}

handler.command = /^(antisabotaggio|riattiva)$/i
handler.group = true
handler.owner = true

export default handler
