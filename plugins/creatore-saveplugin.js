// Plug-in creato da elixir
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

let handler = async (m, { conn, text, command, usedPrefix }) => {
    const cmd = command.toLowerCase()
    const pluginsDir = path.join(process.cwd(), 'plugins')
    
    if (cmd === 'saveplugin' || cmd === 'sv') {
        if (!m.quoted || !m.quoted.text) return m.reply('`[!] Rispondi al codice da salvare`')
        if (!text) return m.reply(`\`[!] Esempio: ${usedPrefix + command} nome\``)

        let filename = text.trim().replace('.js', '') + '.js'
        let filePath = path.join(pluginsDir, filename)

        try {
            fs.writeFileSync(filePath, m.quoted.text, 'utf8')
            const fileUrl = pathToFileURL(filePath).href
            const module = await import(`${fileUrl}?update=${Date.now()}`)
            global.plugins[filename] = module.default || module
            
            return m.reply(`*───「 INSTALLED 」───*\n\n*📂 FILE:* \`${filename}\`\n*STATUS:* \`Attivo / Online\`\n\n*────────────────*`)
        } catch (e) {
            return m.reply(`\`[ERROR]: ${e.message}\``)
        }
    }

    if (cmd === 'deleteplugin' || cmd === 'dp') {
        if (!text) return m.reply('`[!] Indica il plugin da rimuovere`')

        let target = text.trim().replace('.js', '')
        let filename = target + '.js'
        let filePath = path.join(pluginsDir, filename)

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
                const key = Object.keys(global.plugins).find(k => k.endsWith(filename))
                if (key) delete global.plugins[key]
                
                return m.reply(`*───「 DELETED 」───*\n\n*🗑️ FILE:* \`${filename}\`\n*STATUS:* \`Rimosso dal sistema\`\n\n*────────────────*`)
            } else {
                return m.reply('`[!] File non trovato nel database`')
            }
        } catch (e) {
            return m.reply(`\`[ERROR]: ${e.message}\``)
        }
    }
}

handler.help = ['saveplugin', 'deleteplugin']
handler.tags = ['owner']
handler.command = /^(saveplugin|sv|deleteplugin|dp)$/i
handler.rowner = true

export default handler
