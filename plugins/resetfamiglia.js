// Plug-in creato da elixir
import fs from 'fs'
import path from 'path'

const marriagesFile = path.resolve('media/database/sposi.json');

let handler = async (m, { conn, usedPrefix, command }) => {
    // 1. GESTIONE RESET GLOBALE (TUTTI)
    if (command === 'resetallfamiglia' || command === 'purgatree') {
        await m.reply('⏳ *Inizializzazione reset globale...*')

        // Svuota il file JSON dei matrimoni
        try {
            fs.writeFileSync(marriagesFile, JSON.stringify({}, null, 2))
        } catch (e) {
            return m.reply('*❌ Errore nel reset del file matrimoni.*')
        }

        // Svuota i legami (p e s) di ogni utente nel database
        let users = global.db.data.users
        let count = 0
        Object.keys(users).forEach(jid => {
            if (users[jid].p || users[jid].s) {
                users[jid].p = []
                users[jid].s = null
                count++
            }
        })

        return m.reply(`*⚠️ RESET GLOBALE COMPLETATO ⚠️*\n\n🧹 Il registro è stato azzerato.\n👥 Legami rimossi da *${count}* profili.`)
    }

    // 2. GESTIONE RESET SINGOLO (TAG)
    if (command === 'resetfamiglia') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
        if (!target) return m.reply(`*⚠️ Tagga o rispondi a qualcuno per resettarlo!*`)

        let marriages = {}
        try {
            if (fs.existsSync(marriagesFile)) marriages = JSON.parse(fs.readFileSync(marriagesFile, 'utf8'))
        } catch (e) { marriages = {} }

        // Reset Matrimonio nel file JSON
        let partner = marriages[target]
        if (partner) {
            delete marriages[target]
            delete marriages[partner]
            fs.writeFileSync(marriagesFile, JSON.stringify(marriages, null, 2))
        }

        // Reset nel Database Globale (Figli/Genitori)
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

        return m.reply(`*🧹 Dinastia di @${target.split('@')[0]} cancellata.*`, null, { mentions: [target] })
    }
}

handler.help = ['resetfamiglia @tag', 'resetallfamiglia']
handler.tags = ['owner']
handler.command = /^(resetfamiglia|resetallfamiglia|purgatree)$/i

// Solo gli owner definiti in config.js possono usare questi comandi
handler.owner = true 
handler.rowner = true 

export default handler
