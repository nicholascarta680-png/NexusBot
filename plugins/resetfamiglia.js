// Plug-in creato da elixir
import fs from 'fs'
import path from 'path'

const marriagesFile = path.resolve('media/database/sposi.json');

let handler = async (m, { conn, usedPrefix, command }) => {
    // Se il bot arriva qui, l'owner è già verificato da 'handler.rowner'
    let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
    if (!target) return m.reply(`*⚠️ Tagga o rispondi a qualcuno per resettarlo!*`)

    let marriages = {}
    try {
        if (fs.existsSync(marriagesFile)) marriages = JSON.parse(fs.readFileSync(marriagesFile, 'utf8'))
    } catch (e) { marriages = {} }

    // 1. Reset Matrimonio nel file JSON
    let partner = marriages[target]
    if (partner) {
        delete marriages[target]
        delete marriages[partner]
        fs.writeFileSync(marriagesFile, JSON.stringify(marriages, null, 2))
    }

    // 2. Reset Database Globale (Figli/Genitori)
    // Usiamo l'accesso sicuro al database del bot
    if (global.db.data.users[target]) {
        let u = global.db.data.users[target]
        
        // Rimuove i figli dal genitore
        if (u.p && Array.isArray(u.p)) {
            u.p.forEach(f => { 
                if(global.db.data.users[f]) global.db.data.users[f].s = null 
            })
            u.p = []
        }
        
        // Rimuove se stesso dalla lista figli del suo genitore
        if (u.s) { 
            let genitore = u.s
            if(global.db.data.users[genitore] && global.db.data.users[genitore].p) {
                global.db.data.users[genitore].p = global.db.data.users[genitore].p.filter(id => id !== target)
            }
            u.s = null 
        }
    }

    await conn.sendMessage(m.chat, { 
        text: `*🧹 Dinastia di @${target.split('@')[0]} cancellata con successo dal registro reale.*`, 
        mentions: [target] 
    }, { quoted: m })
}

handler.help = ['resetfamiglia @tag']
handler.tags = ['owner']
handler.command = /^(resetfamiglia)$/i

// Queste due righe usano il sistema nativo del bot per rilevare gli owner dal config.js
handler.owner = true 
handler.rowner = true 

export default handler
