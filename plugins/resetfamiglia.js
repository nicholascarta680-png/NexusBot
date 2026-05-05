// Plug-in creato da elixir
import fs from 'fs'
import path from 'path'

const marriagesFile = path.resolve('media/database/sposi.json');

let handler = async (m, { conn, usedPrefix, command }) => {
    // Controllo Owner basato sui JID in config.js
    let isOwner = [conn.user.jid, ...global.owner.map(v => v + '@s.whatsapp.net')].includes(m.sender)
    if (!isOwner) return m.reply('*❌ Solo il Creatore può resettare le dinastie.*')

    let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
    if (!target) return m.reply(`*⚠️ Tagga o rispondi a qualcuno per resettarlo!*`)

    let marriages = {}
    if (fs.existsSync(marriagesFile)) marriages = JSON.parse(fs.readFileSync(marriagesFile, 'utf8'))

    // Reset Matrimonio
    let partner = marriages[target]
    if (partner) {
        delete marriages[target]
        delete marriages[partner]
        fs.writeFileSync(marriagesFile, JSON.stringify(marriages, null, 2))
    }

    // Reset Database Globale (Figli/Genitori)
    let users = global.db.data.users
    if (users[target]) {
        if (users[target].p) {
            users[target].p.forEach(f => { if(users[f]) users[f].s = null });
            users[target].p = [];
        }
        if (users[target].s) { 
            let g = users[users[target].s]; 
            if(g && g.p) g.p = g.p.filter(id => id !== target);
            users[target].s = null; 
        }
    }

    return m.reply(`*🧹 Dinastia di @${target.split('@')[0]} cancellata con successo.*`, null, { mentions: [target] })
}

handler.help = ['resetfamiglia @tag']
handler.tags = ['owner']
handler.command = /^(resetfamiglia)$/i
handler.owner = true // Protezione plugin-level

export default handler
