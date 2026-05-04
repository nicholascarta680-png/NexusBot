// Plug-in creato da elixir

let handler = async (m, { conn, text }) => {
    if (!m.isGroup) throw 'Questo comando funziona solo nei gruppi!'

    // ==================== GESTIONE MENZIONE ====================
    let menzione = null

    // Priorità 1: Risposta a un messaggio
    if (m.quoted) {
        menzione = m.quoted.sender
    }
    // Priorità 2: Menzione diretta (@user)
    else if (m.mentionedJid && m.mentionedJid.length > 0) {
        menzione = m.mentionedJid[0]
    }
    // Priorità 3: Scritto dopo il comando
    else if (text) {
        let user = text.replace('@', '').trim()
        if (user) menzione = user + '@s.whatsapp.net'
    }

    // Obbligatorio menzionare o rispondere
    if (!menzione) throw 'Devi rispondere a un messaggio o menzionare qualcuno (@user)'

    // Protezione bot
    if (menzione === conn.user.jid) {
        return conn.reply(m.chat, `Non ci provare con me.`, m)
    }

    const docce = [
        "⚰️ *Camera a gas attivata...* \nEntra pure, la temperatura è perfetta oggi 💨",
        "🚿 *Doccia speciale in corso...* \nNiente acqua, solo una bella sorpresa storica",
        "🪦 Sali sul treno, destinazione: doccia calda gratis",
        "☠️ Doccia al gas attivata\n10 minuti e diventi molto più leggero",
        "🏚️ Entra nella camera, ti faccio una doccia come nel '44",
        "🌫️ Aria profumata in arrivo... fidati, è speciale",
        "⏳ Preparati, arriva la doccia che ha fatto la storia",
        "🕯️ Ti faccio una doccia che ricorderai per gli prossimi 80 anni",
        "🏠 *Camera a gas mode ON*\nBenvenuto nel resort",
        "💨 Doccia zero acqua, 100% efficienza storica",
        "👴 Ti mando sotto la doccia con i tuoi nonni",
        "🌡️ Temperatura a 45°C con aroma Zyklon B",
        "⚡ Stai per vivere un'esperienza... *indimenticabile*"
    ]

    let doccia = docce[Math.floor(Math.random() * docce.length)]

    // Messaggio con stile più elegante e "animato"
    await conn.sendMessage(m.chat, {
        text: `╔══════════════════╗\n` +
              `║     🖤 DOC CIA SPECIALE 🖤     ║\n` +
              `╚══════════════════╝\n\n` +
              `@${menzione.split('@')[0]} ${doccia}`,
        mentions: [menzione]
    }, { quoted: m })

    // Reazione per dare un tocco "elegante/dark"
    await conn.sendMessage(m.chat, {
        react: { text: "☠️", key: m.key }
    })
}

handler.command = /^(doccia|gas|docciaspeciale|camera)$/i
handler.tags = ['fun', 'dark']
handler.group = true

export default handler
