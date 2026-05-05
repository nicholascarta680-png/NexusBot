// Plug-in creato da elixir
import fs from 'fs'
import path from 'path'

const marriagesFile = path.resolve('media/database/sposi.json');

let handler = async (m, { conn, usedPrefix, command }) => {
    
    // 1. GESTIONE RESET GLOBALE (TUTTI)
    if (command === 'resetallfamiglia' || command === 'purgatree') {
        await m.reply('`⏳ Inizializzazione epurazione globale delle dinastie...`')

        try {
            fs.writeFileSync(marriagesFile, JSON.stringify({}, null, 2))
        } catch (e) {
            return m.reply('`❌ Errore critico nel reset del registro matrimoniale.`')
        }

        let users = global.db.data.users
        let count = 0
        Object.keys(users).forEach(jid => {
            if (users[jid].p || users[jid].s) {
                users[jid].p = []
                users[jid].s = null
                count++
            }
        })

        let report = `  ⋆｡˚『 ╭ \`PURGA GLOBALE\` ╯ 』˚｡⋆\n\n`
        report += `  │ ⚠️ *Stato:* Tabula Rasa\n`
        report += `  │ 🧹 *Registri:* Azzerati\n`
        report += `  │ 👥 *Profili Purgati:* ${count}\n`
        report += `  ╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒`
        
        return m.reply(report)
    }

    // 2. GESTIONE RESET SINGOLO (TAG)
    if (command === 'resetfamiglia') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
        if (!target) return m.reply('`⚠️ Identifica un bersaglio tramite tag o risposta.`')

        let marriages = {}
        try {
            if (fs.existsSync(marriagesFile)) marriages = JSON.parse(fs.readFileSync(marriagesFile, 'utf8'))
        } catch (e) { marriages = {} }

        let partner = marriages[target]
        if (partner) {
            delete marriages[target]
            delete marriages[partner]
            fs.writeFileSync(marriagesFile, JSON.stringify(marriages, null, 2))
        }

        if (global.db.data.users[target]) {
            let u = global.db.data.users[target]
            if (u.p && Array.isArray(u.p)) {
                u.p.forEach(f => { if(global.db.data.users[f]) global.db.data.users[f].s = null })
                u.p = []
            }
            if (u.s) { 
                let genitore = u.s
                if(global.db.data.users[genitore] && global.db.data.users[genitore].p) {
                    global.db.data.users[genitore].p = global.db.data.users[genitore].p.filter(id => id !== target)
                }
                u.s = null 
            }
        }

        let msg = `  ⋆｡˚『 ╭ \`RESET DINASTIA\` ╯ 』˚｡⋆\n\n`
        msg += `  │ 👤 *Soggetto:* @${target.split('@')[0]}\n`
        msg += `  │ 🧹 *Azione:* Dinastia cancellata\n`
        msg += `  │ 🚫 *Stato:* Adottabile / Libero\n`
        msg += `  ╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒`

        return m.reply(msg, null, { mentions: [target] })
    }
}

handler.help = ['resetfamiglia @tag', 'resetallfamiglia']
handler.tags = ['owner']
handler.command = /^(resetfamiglia|resetallfamiglia|purgatree)$/i

handler.owner = true 
handler.rowner = true 

export default handler
