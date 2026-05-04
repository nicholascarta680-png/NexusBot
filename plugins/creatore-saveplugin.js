// Plug-in creato da elixir
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

let handler = async (m, { conn, text, command, usedPrefix }) => {
    const cmd = command.toLowerCase()
    const pluginsDir = path.join(process.cwd(), 'plugins')
    
    if (cmd === 'saveplugin' || cmd === 'sv') {
        if (!m.quoted || !m.quoted.text) return m.reply(`*⚠️ Rispondi al messaggio con il codice!*`)
        if (!text) return m.reply(`*⚠️ Nome del file? Es: ${usedPrefix + command} prova*`)

        let filename = text.trim().replace('.js', '') + '.js'
        let filePath = path.join(pluginsDir, filename)

        try {
            // 1. Scrittura fisica
            fs.writeFileSync(filePath, m.quoted.text, 'utf8')
            
            // 2. Auto-Reload (Caricamento immediato)
            const fileUrl = pathToFileURL(filePath).href
            try {
                const module = await import(`${fileUrl}?update=${Date.now()}`)
                global.plugins[filename] = module.default || module
                return m.reply(`✅ *Plugin salvato e attivato!*\n📂 *Percorso:* plugins/${filename}\n\n> Il comando è già pronto all'uso.`)
            } catch (err) {
                return m.reply(`✅ *Plugin salvato su disco*, ma devi usare .aggiorna per attivarlo.\n\n*Errore caricamento:* ${err.message}`)
            }
        } catch (e) {
            return m.reply(`❌ *Errore scrittura:* ${e.message}`)
        }
    }

    if (cmd === 'deleteplugin' || cmd === 'dp') {
        if (!text) return m.reply(`*⚠️ Nome del plugin da eliminare?*`)

        let target = text.trim().replace('.js', '')
        let filename = target + '.js'
        let filePath = path.join(pluginsDir, filename)

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
                
                // Rimozione immediata dalla memoria
                const key = Object.keys(global.plugins).find(k => k.endsWith(filename))
                if (key) delete global.plugins[key]
                
                return m.reply(`🗑️ *"${filename}" eliminato sia dal disco che dalla memoria.*`)
            } else {
                return m.reply(`❌ Il file "${filename}" non esiste nella cartella plugins.`)
            }
        } catch (e) {
            return m.reply(`❌ *Errore eliminazione:* ${e.message}`)
        }
    }
}

handler.help = ['saveplugin', 'deleteplugin']
handler.tags = ['owner']
handler.command = /^(saveplugin|sv|deleteplugin|dp)$/i
handler.rowner = true

export default handler
