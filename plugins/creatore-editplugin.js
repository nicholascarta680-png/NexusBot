// Plug-in creato da elixir
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

let handler = async (m, { conn, text, command }) => {
    if (!m.quoted || !m.quoted.text) return m.reply(`*⚠️ Rispondi al messaggio con il nuovo codice!*`)
    if (!text) return m.reply(`*⚠️ Inserisci il nome del plugin da modificare (es: menu)*`)

    const pluginsDir = path.join(process.cwd(), 'plugins')
    const filename = text.trim().replace('.js', '') + '.js'
    const filePath = path.join(pluginsDir, filename)

    if (!fs.existsSync(filePath)) return m.reply(`*❌ Il plugin "${filename}" non esiste.*`)

    try {
        // 1. Sovrascrittura file
        fs.writeFileSync(filePath, m.quoted.text, 'utf8')

        // 2. AUTO-RELOAD (Il cuore del fix)
        // Cancelliamo il modulo dalla cache di Node così lo ricarica da zero
        const fileUrl = pathToFileURL(filePath).href
        
        try {
            // Se il bot usa un watcher (come molti bot moderni), basta toccare il file.
            // Altrimenti forziamo il ricaricamento manuale in memoria:
            if (global.plugins[filename] || global.plugins[filePath]) {
                const module = await import(`${fileUrl}?update=${Date.now()}`)
                global.plugins[filename] = module.default || module
            }
            
            m.reply(`✅ *Modificato e Aggiornato!*\n\nIl plugin *${filename}* è già attivo con il nuovo codice senza bisogno di usare .aggiorna.`)
        } catch (err) {
            console.error(err)
            m.reply(`✅ *Salvato*, ma non è stato possibile auto-aggiornare: usa .aggiorna manualmente.\n\n*Errore:* ${err.message}`)
        }

    } catch (e) {
        m.reply(`❌ *Errore:* ${e.message}`)
    }
}

handler.help = ['editplugin']
handler.tags = ['owner']
handler.command = /^(editplugin|ep)$/i
handler.rowner = true

export default handler
