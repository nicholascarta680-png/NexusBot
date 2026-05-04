// Plug-in creato da elixir
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

let handler = async (m, { conn, text, command }) => {
    if (!m.quoted || !m.quoted.text) return m.reply('`[!] Rispondi al nuovo codice`')
    if (!text) return m.reply('`[!] Specifica il nome del plugin`')

    const pluginsDir = path.join(process.cwd(), 'plugins')
    const filename = text.trim().replace('.js', '') + '.js'
    const filePath = path.join(pluginsDir, filename)

    if (!fs.existsSync(filePath)) return m.reply('`[!] Errore: Il plugin non esiste`')

    try {
        fs.writeFileSync(filePath, m.quoted.text, 'utf8')
        const fileUrl = pathToFileURL(filePath).href
        
        const module = await import(`${fileUrl}?update=${Date.now()}`)
        global.plugins[filename] = module.default || module
        
        return m.reply(`*───「 MODIFIED 」───*\n\n*📝 FILE:* \`${filename}\`\n*STATUS:* \`Compilato & Sincronizzato\`\n\n*────────────────*`)

    } catch (e) {
        return m.reply(`\`[ERROR]: ${e.message}\``)
    }
}

handler.help = ['editplugin']
handler.tags = ['owner']
handler.command = /^(editplugin|ep)$/i
handler.rowner = true

export default handler
