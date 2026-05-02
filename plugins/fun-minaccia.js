// Plug-in creato da elixir
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!m.isGroup) throw 'Questo comando funziona solo nei gruppi!'

    let menzione = m.mentionedJid[0] 
                 ? m.mentionedJid[0] 
                 : m.quoted 
                 ? m.quoted.sender 
                 : text.replace(/@/, '') + '@s.whatsapp.net'

    if (!menzione) throw 'Chi vuoi minacciare? Rispondi a un messaggio o scrivi @user'

    // Protezione Bot
    if (menzione === conn.user.jid) {
        return conn.reply(m.chat, `Non ci provare nemmeno, testa di minchia.`, m)
    }

    const minacce = [
        "Ti vengo a casa e ti spacco tutte le ossa una ad una, poi ti chiedo come stai",
        "Ti apro la testa come una scatoletta di tonno e ci piscio dentro",
        "Ti faccio ingoiare i denti uno per uno con le pinze",
        "Ti rovino la vita così male che tua madre ti rinnega",
        "Ti spacco la faccia così forte che diventi il nuovo logo di Windows",
        "Ti levo la pelle a strisce come un kebab",
        "Ti faccio cacare sangue per i prossimi 3 anni",
        "Ti brucio la casa con te dentro mentre dormi",
        "Ti rompo il culo così tanto che dovrai cacare dal naso",
        "Ti taglio le palle e te le faccio mangiare fritte",
        "Ti mando all'ospedale con la faccia che sembra una pizza margherita",
        "Ti sfondo il cranio e ci gioco a calcio con i tuoi neuroni",
        "Ti spacco la schiena e ti uso come tappetino all'ingresso",
        "Ti faccio rimpiangere il giorno che sei nato, bastardo",
        "Ti vengo a prendere e ti butto dal balcone come un sacco della spazzatura",
        "Ti rompo tutte le dita delle mani così non scrivi più cazzate",
        "Ti squarto come un maiale a Natale",
        "Ti distruggo la vita sociale, famigliare e mentale",
        "Ti riduco così male che tua nonna ti chiama 'mostro'",
        "Ti vengo addosso con la macchina e poi faccio retromarcia",
        "Ti taglio la lingua e te la faccio mangiare cruda",
        "Ti faccio cacare le budella dal terrore",
        "Ti rovino talmente tanto che pregherai di morire",
        "Ti brucio vivo e poi piscio sulle tue ceneri",
        "Ti spezzo la colonna vertebrale e ti lascio a terra come un verme",
        "Ti massacro di botte finché non diventi un souvenir",
        "Ti faccio un culo così grande che ci entri dentro con la macchina",
        "Ti spacco la mascella e te la rimetto al contrario",
        "Ti riduco in fin di vita e poi ti rianimo solo per continuare",
        "Ti apro come un libro e ti leggo le budella",
        "Sei talmente inutile che nemmeno la morte ti vuole",
        "Ti faccio diventare cibo per cani, letteralmente",
        "Ti distruggo l'anima prima ancora del corpo",
        "Ti faccio rimpiangere di aver respirato la mia stessa aria",
        "Ti vengo a casa di notte e ti taglio le palpebre così non dormi più",
    ]

    let minaccia = minacce[Math.floor(Math.random() * minacce.length)]

    // Protezione Admin (opzionale ma consigliata)
    let isAdmin = false
    if (m.isGroup) {
        let group = await conn.groupMetadata(m.chat)
        isAdmin = group.participants.some(p => 
            p.id === menzione && (p.admin === "admin" || p.admin === "superadmin")
        )
    }

    if (isAdmin) {
        minaccia = "Calmo admin... ti minaccio solo un pochino eh 👀"
    }

    await conn.reply(m.chat, `⚠️ *MINACCIA ATTIVATA* ⚠️\n\n@${menzione.split('@')[0]} ${minaccia}`, m, {
        mentions: [menzione]
    })
}

handler.command = /^minaccia$/i
handler.tags = ['fun']
handler.group = true

export default handler
