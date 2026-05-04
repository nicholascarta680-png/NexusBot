// Plug-in creato da elixir
import { exec } from 'child_process'
import { promisify } from 'util'

const execPromise = promisify(exec)

// CONFIGURAZIONE
const REPO_URL = "https://github.com" // URL del tuo bot
const CHECK_INTERVAL = 60000 // Controlla ogni 60 secondi

let handler = async (m, { conn, isROwner }) => {
    if (!isROwner) return
    global.autoPull = !global.autoPull
    m.reply(`*───「 GITHUB SYNC 」───*\n\n*AUTO-PULL:* \`${global.autoPull ? 'Attivo' : 'Disattivato'}\`\n*INTERVAL:* \`60s\`\n\n*────────────────*`)
    
    if (global.autoPull) {
        startAutoPull(conn, m.chat)
    }
}

async function startAutoPull(conn, chat) {
    if (!global.autoPull) return

    try {
        // Forza il fetch per vedere se ci sono cambiamenti
        await execPromise('git fetch')
        const { stdout } = await execPromise('git status -uno')

        if (stdout.includes('behind')) {
            console.log('[GITHUB] Nuovi cambiamenti rilevati. Scaricamento...')
            
            // Esegue il pull
            await execPromise('git pull')
            
            await conn.sendMessage(chat, { 
                text: `*───「 SYNC SUCCESS 」───*\n\n*REPO:* \`GitHub Update\`\n*ACTION:* \`Git Pull & Hot Reload\`\n\n*────────────────*` 
            })

            // Trigger del comando aggiorna/reload interno
            // Nota: Dipende da come si chiama il tuo comando reload (es: aggiorna)
            if (global.plugins['owner-update.js']) {
                // Esegue la logica di aggiornamento se possibile
            } else {
                // In alternativa, se hai PM2 o un watcher, il bot si riavvierà da solo col pull
                process.exit() 
            }
        }
    } catch (e) {
        console.error('[ERROR GITHUB SYNC]:', e.message)
    }

    setTimeout(() => startAutoPull(conn, chat), CHECK_INTERVAL)
}

handler.help = ['autopull']
handler.tags = ['owner']
handler.command = /^(autopull|gitupdate)$/i
handler.rowner = true

export default handler
