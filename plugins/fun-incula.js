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

    // ====================== 4 SEQUENZE (più corte) ======================
    const seq1 = [  // Brutale
        `@${username} viene sbattuto contro il muro...`,
        `Gli abbasso i pantaloni e lo penetro con forza...`,
        `Lo sto sfondando senza pietà...`,
        `Il culo è distrutto e riempito 💦`
    ]

    const seq2 = [  // Lento e Umiliante
        `@${username} è in ginocchio...`,
        `Ti sto allargando il culo piano piano...`,
        `Senti come ti apro tutto?`,
        `Bravo, sei solo un buco da usare 🍑`
    ]

    const seq3 = [  // Diretto
        `@${username} viene inculato con violenza...`,
        `Lo sto rompendo fino in fondo...`,
        `Il buco si sta dilatando sempre di più...`,
        `Completamente riempito e distrutto.`
    ]

    const seq4 = [  // Intenso
        `@${username} sente il cazzo entrare...`,
        `Viene sbattuto con colpi profondi...`,
        `Sta prendendo tutto come una troia...`,
        `Culo distrutto e pieno 💦`
    ]

    const sequences = [seq1, seq2, seq3, seq4]
    const chosen = sequences[Math.floor(Math.random() * sequences.length)]

    // Messaggio iniziale
    let currentMsg = await conn.sendMessage(m.chat, {
        text: `╔════════════════════╗\n` +
              `     🔥 INCULA MODE 🔥\n` +
              `╚════════════════════╝\n\n` +
              `@${username} è stato selezionato...`,
        mentions: [menzione]
    }, { quoted: m })

    // Animazione con solo 4 edit (molto più sicura)
    for (let text of chosen) {
        await new Promise(r => setTimeout(r, 1800)) // 1.8 secondi tra un edit e l'altro
        await conn.sendMessage(m.chat, { 
            text: `╔════════════════════╗\n` +
                  `     🔥 INCULA MODE 🔥\n` +
                  `╚════════════════════╝\n\n${text}` 
        }, { edit: currentMsg.key })
    }

    // Reazione finale
    await conn.sendMessage(m.chat, { react: { text: "🍑", key: m.key } })
}

handler.command = /^(incula|incul|sfonda|sfon|inculami|sfondaculo)$/i
handler.tags = ['fun', 'nsfw']
handler.group = true

export default handler
