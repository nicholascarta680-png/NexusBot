// Plug-in creato da elixir
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, text, command, usedPrefix }) => {
    const cmd = command.toLowerCase()
    
    // Otteniamo il percorso assoluto della cartella plugins
    const pluginsDir = path.join(process.cwd(), 'plugins')
    
    // Lista dinamica dei plugin caricati (rimuovendo il percorso per il confronto)
    const ar = Object.keys(global.plugins || {})
    const ar1 = ar.map(v => path.basename(v, '.js'))

    if (cmd === 'saveplugin' || cmd === 'sv') {
        if (!m.quoted || !m.quoted.text) return conn.reply(m.chat, `*⚠️ Rispondi al messaggio che contiene il codice del plugin!*`, m)
        if (!text) return conn.reply(m.chat, `*⚠️ Inserisci il nome del file!*\n*Esempio:* ${usedPrefix + command} prova`, m)

        let filename = text.trim().replace('.js', '') + '.js'
        let filePath = path.join(pluginsDir, filename)

        try {
            // Salvataggio effettivo su disco
            fs.writeFileSync(filePath, m.quoted.text, 'utf8')
            
            // Messaggio di conferma
            return conn.reply(m.chat, `✅ *Plugin salvato!*\n📂 *File:* plugins/${filename}\n\n> Usa .reload per rendere effettive le modifiche.`, m)
        } catch (e) {
            return conn.reply(m.chat, `❌ *Errore:* ${e.message}`, m)
        }
    }

    if (cmd === 'deleteplugin' || cmd === 'dp') {
        if (!text) return conn.reply(m.chat, `*⚠️ Nome del plugin?*\nEsempio: ${usedPrefix + command} prova`, m)

        let target = text.trim().replace('.js', '')
        let filename = target + '.js'
        let filePath = path.join(pluginsDir, filename)

        try {
            if (fs.existsSync(filePath)) {
                // Elimina il file fisicamente
                fs.unlinkSync(filePath)
                
                // Rimuove il plugin dalla memoria del bot (se presente)
                if (global.plugins[filename]) delete global.plugins[filename]
                
                return conn.reply(m.chat, `🗑️ *Plugin "${filename}" eliminato fisicamente e dalla memoria.*`, m)
            } else {
                // Se non esiste il file, cerchiamo se è caricato con un percorso diverso
                let checkMem = ar.find(v => v.endsWith(filename))
                if (checkMem) {
                    fs.unlinkSync(checkMem)
                    delete global.plugins[checkMem]
                    return conn.reply(m.chat, `🗑️ *Rimosso plugin trovato in memoria (${filename}).*`, m)
                }
                return conn.reply(m.chat, `❌ *Il file "${filename}" non esiste nella cartella plugins.*`, m)
            }
        } catch (e) {
            return conn.reply(m.chat, `❌ *Errore:* ${e.message}`, m)
        }
    }
}

handler.help = ['saveplugin', 'deleteplugin']
handler.tags = ['owner']
handler.command = /^(saveplugin|sv|deleteplugin|dp)$/i
handler.rowner = true

export default handler
