// Plug-in creato da elixir
import fs from 'fs'
import path from 'path'

const marriagesFile = path.resolve('media/database/sposi.json');

let handler = async (m, { conn, usedPrefix, command, text }) => {
    
    // 1. GESTIONE RESET GLOBALE (TUTTI)
    if (command === 'resetallfamiglia' || command === 'purgatree') {
        await m.reply('`⏳ Inizializzazione epurazione globale delle dinastie...`')

        try {
            // Svuota il file JSON dei matrimoni
            fs.writeFileSync(marriagesFile, JSON.stringify({}, null, 2))
            
            // Pulisce tutti gli utenti nel database globale
            let users = global.db.data.users
            let count = 0
            Object.keys(users).forEach(jid => {
                if (users[jid].p || users[jid].s) {
                    users[jid].p = [] // Rimuove figli
                    users[jid].s = null // Rimuove genitore
                    count++
                }
            })

            let report = `  ⋆｡˚『 ╭ \`PURGA GLOBALE\` ╯ 』˚｡⋆\n\n`
            report += `  │ ⚠️ *Stato:* Tabula Rasa\n`
            report += `  │ 🧹 *Registri:* Azzerati\n`
            report += `  │ 👥 *Profili Purgati:* ${count}\n`
            report += `  ╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒`
            
            return m.reply(report)
        } catch (e) {
            console.error(e)
            return m.reply('`❌ Errore critico durante il reset globale.`')
        }
    }

    // 2. GESTIONE RESET SINGOLO (TAG O RISPOSTA)
    if (command === 'resetfamiglia') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
        if (!target) return m.reply('`⚠️ Identifica un bersaglio tramite tag o risposta al messaggio.`')

        // Carica matrimoni
        let marriages = {}
        try {
            if (fs.existsSync(marriagesFile)) {
                marriages = JSON.parse(fs.readFileSync(marriagesFile, 'utf8'))
            }
        } catch (e) { marriages = {} }

        // --- Logica di Sincronizzazione ---
        
        // 1. Rimuove legame matrimoniale (se esiste)
        let partner = marriages[target]
        if (partner) {
            delete marriages[target]
            delete marriages[partner]
            fs.writeFileSync(marriagesFile, JSON.stringify(marriages, null, 2))
        }

        // 2. Pulisce i dati dell'utente nel DB globale
        if (global.db.data.users[target]) {
            let u = global.db.data.users[target]

            // Se l'utente rimosso era un genitore, i figli rimangono "orfani" (s = null)
            if (u.p && Array.isArray(u.p)) {
                u.p.forEach(figlioId => {
                    if (global.db.data.users[figlioId]) {
                        global.db.data.users[figlioId].s = null
                    }
                })
                u.p = [] // Svuota la lista figli del target
            }

            // Se l'utente rimosso era un figlio, lo toglie dalla lista del genitore
            if (u.s) { 
                let genitoreId = u.s
                if (global.db.data.users[genitoreId] && global.db.data.users[genitoreId].p) {
                    global.db.data.users[genitoreId].p = global.db.data.users[genitoreId].p.filter(id => id !== target)
                }
                u.s = null // Rimuove il genitore dal target
            }
        }

        let msg = `  ⋆｡˚『 ╭ \`RESET DINASTIA\` ╯ 』˚｡⋆\n\n`
        msg += `  │ 👤 *Soggetto:* @${target.split('@')[0]}\n`
        msg += `  │ 🧹 *Azione:* Legami troncati\n`
        msg += `  │ 🚫 *Stato:* Libero da ogni vincolo\n`
        msg += `  ╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒`

        return m.reply(msg, null, { mentions: [target] })
    }
}

handler.help = ['resetfamiglia @tag', 'resetallfamiglia']
handler.tags = ['owner']
handler.command = /^(resetfamiglia|resetallfamiglia|purgatree)$/i

handler.owner = true 

export default handler
