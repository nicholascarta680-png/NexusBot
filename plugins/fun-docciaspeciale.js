// Plug-in creato da elixir
let handler = async (m, { conn, text }) => {
    if (!m.isGroup) throw 'Solo nei gruppi!'

    let menzione = m.mentionedJid[0] 
                 ? m.mentionedJid[0] 
                 : m.quoted 
                 ? m.quoted.sender 
                 : text.replace(/@/, '') + '@s.whatsapp.net'

    if (!menzione) throw 'A chi vuoi fare la doccia speciale?'

    if (menzione === conn.user.jid) {
        return conn.reply(m.chat, `Non ci provare con me, animale.`, m)
    }

    const docce = [
        "Entra pure, la doccia è pronta... temperatura a 45°C con aroma di Zyklon B 💨",
        "Doccia speciale in arrivo, niente sapone, solo una bella sorpresa al gas",
        "Sali sul treno, destinazione: doccia calda gratis",
        "Doccia al gas attivata, 10 minuti e diventi più leggero",
        "Entra nella camera, ti faccio una bella doccia calda come nel '44",
        "Doccia speciale per te, niente acqua, solo aria profumata",
        "Preparati, arriva la doccia che ha fatto storia",
        "Ti faccio una doccia che non dimentichi per i prossimi 80 anni",
        "Camera a gas mode ON, benvenuto nel resort",
        "Doccia al peperoncino... ops, volevo dire al gas",
        "Ti mando sotto la doccia con i tuoi nonni",
        "Doccia gratis, offerta speciale solo per oggi",
        "Entra, è calda e profumata... fidati",
        "Stai per fare la doccia più storica della tua vita",
        "Doccia speciale: zero acqua, 100% efficienza"
    ]

    let doccia = docce[Math.floor(Math.random() * docce.length)]

    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${doccia}`, m, {
        mentions: [menzione]
    })
}

handler.command = /^(doccia|gas|docciaspeciale)$/i
handler.tags = ['fun', 'dark']
handler.group = true

export default handler
