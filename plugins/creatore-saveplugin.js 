import fs from 'fs'
import { join } from 'path'

let handler = async (m, { conn, text, args, command, usedPrefix }) => {
    const cmd = command.toLowerCase()
    
    // Lista dinamica dei plugin caricati in memoria (senza estensione .js)
    const ar = Object.keys(global.plugins || plugins || {})
    const ar1 = ar.map(v => v.replace('.js', ''))

    if (cmd === 'saveplugin' || cmd === 'sv') {
        if (!text || !text.trim()) {
            return conn.reply(m.chat, `*Uhm.. che nome do al plugin?*\n*Esempio:* ${usedPrefix + command} menu`, m)
        }
        if (!m.quoted || !m.quoted.text) {
            return conn.reply(m.chat, `*Rispondi al messaggio che contiene il codice del plugin!*`, m)
        }

        let filename = text.trim().replace('.js', '')
        let path = `./plugins/${filename}.js`

        try {
            await fs.writeFileSync(path, m.quoted.text)
            return conn.reply(m.chat, `✅ *Plugin salvato con successo!*\n\n*Percorso:* plugins/${filename}.js\n*Usa:* .reload per ricaricare`, m)
        } catch (e) {
            return conn.reply(m.chat, `❌ *Errore durante il salvataggio:*\n${e.message}`, m)
        }
    }

    if (cmd === 'deleteplugin' || cmd === 'dp') {
        if (!text || !text.trim()) {
            return conn.reply(m.chat, `*🍬 Inserisci il nome del plugin da eliminare*\n\n*—◉ Esempio:* ${usedPrefix + command} menu\n\n*—◉ Lista dei plugin esistenti:*\n*◉* ${ar1.map(v => ' ' + v).join('\n*◉*')}`, m)
        }

        let target = text.trim().replace('.js', '')

        // Verifica se il plugin esiste in memoria
        if (!ar1.includes(target)) {
            return conn.reply(m.chat, `*🍭 Nessun plugin trovato con il nome "${target}"*\n\n*—◉ Lista dei plugin esistenti:*\n*◉* ${ar1.map(v => ' ' + v).join('\n*◉*')}`, m)
        }

        let path = `./plugins/${target}.js`

        try {
            if (fs.existsSync(path)) {
                fs.unlinkSync(path)
                return conn.reply(m.chat, `🗑️ *Plugin "${target}.js" eliminato con successo dal sistema.*`, m)
            } else {
                return conn.reply(m.chat, `⚠️ *Il file esiste in memoria ma non è stato trovato nella cartella plugins.*`, m)
            }
        } catch (e) {
            return conn.reply(m.chat, `❌ *Errore durante l'eliminazione:*\n${e.message}`, m)
        }
    }
}

handler.help = ['saveplugin', 'deleteplugin']
handler.tags = ['owner']
handler.command = /^(saveplugin|sv|deleteplugin|dp)$/i
handler.rowner = true

export default handler