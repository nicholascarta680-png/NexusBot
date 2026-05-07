// Plug-in creato da elixir

let handler = async (m, { conn, text }) => {
    if (!m.isGroup) throw 'Questo comando funziona solo nei gruppi!'

    // ==================== GESTIONE MENZIONE ====================
    let menzione = null

    if (m.quoted) {
        menzione = m.quoted.sender
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        menzione = m.mentionedJid[0]
    } else if (text) {
        let user = text.replace('@', '').trim()
        if (user) menzione = user + '@s.whatsapp.net'
    }

    if (!menzione) throw 'Devi rispondere a un messaggio o menzionare qualcuno (@user)'

    if (menzione === conn.user.jid) {
        return conn.reply(m.chat, `Non ci provare con me.`, m)
    }

    const username = menzione.split('@')[0]

    // ====================== SEQUENZA ANIMATA ======================
    let msg = await conn.sendMessage(m.chat, {
        text: `╔════════════════════╗\n` +
              `   🔥 INCULA MODE ACTIVATED 🔥\n` +
              `╚════════════════════╝\n\n` +
              `@${username} è stato scelto...`,
        mentions: [menzione]
    }, { quoted: m })

    const sequence = [
        `╔════════════════════╗\n` +
        `   🔥 INCULA MODE ACTIVATED 🔥\n` +
        `╚════════════════════╝\n\n` +
        `@${username} viene spinto contro il muro...\n` +
        `I pantaloni scendono lentamente.`,

        `╔════════════════════╗\n` +
        `   🔥 INCULA MODE ACTIVATED 🔥\n` +
        `╚════════════════════╝\n\n` +
        `@${username} sente la punta premere...\n` +
        `Sto allargando il culo piano...`,

        `╔════════════════════╗\n` +
        `   🔥 INCULA MODE ACTIVATED 🔥\n` +
        `╚════════════════════╝\n\n` +
        `@${username} geme mentre entra tutto...\n` +
        `Lo sto sfondando fino in fondo.`,

        `╔════════════════════╗\n` +
        `   🔥 INCULA MODE ACTIVATED 🔥\n` +
        `╚════════════════════╝\n\n` +
        `@${username} trema mentre lo riempio...\n` +
        `Il culo si sta dilatando perfettamente.`,

        `╔════════════════════╗\n` +
        `   🔥 INCULA MODE ACTIVATED 🔥\n` +
        `╚════════════════════╝\n\n` +
        `@${username} viene sbattuto con forza...\n` +
        `Lo sto rompendo come si deve.`,

        `╔════════════════════╗\n` +
        `   🔥 INCULA MODE ACTIVATED 🔥\n` +
        `╚════════════════════╝\n\n` +
        `@${username} ha il culo completamente distrutto...\n` +
        `Sto venendo dentro.`,

        `╔════════════════════╗\n` +
        `   🔥 INCULA COMPLETATO 🔥\n` +
        `╚════════════════════╝\n\n` +
        `@${username} è stato inculato a dovere.\n` +
        `Il buco ora è bello largo 💦`
    ]

    // Animazione (modifica dello stesso messaggio)
    for (let i = 0; i < sequence.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1600))
        await conn.sendMessage(m.chat, { text: sequence[i] }, { edit: msg.key })
    }

    // Reazione finale
    await conn.sendMessage(m.chat, {
        react: { text: "🍑", key: m.key }
    })
}

handler.command = /^(incula|incul|sfonda|sfon|culo|inculami)$/i
handler.tags = ['fun', 'nsfw']
handler.group = true

export default handler
