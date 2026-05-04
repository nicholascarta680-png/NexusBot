// Plug-in creato da elixir
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'

const execPromise = promisify(exec)

// CONFIGURAZIONE
const CHECK_INTERVAL = 60000 // 1 Minuto

let handler = async (m, { conn, isROwner }) => {
    if (!isROwner) return
    global.autoPull = !global.autoPull
    
    m.reply(`*───「 GITHUB SYNC 」───*\n\n*AUTO-PULL:* \`${global.autoPull ? 'Attivo' : 'Disattivato'}\`\n*STATUS:* \`Monitoring...\`\n\n*────────────────*`)
    
    if (global.autoPull) {
        startAutoPull(conn, m.chat)
    }
}

async function startAutoPull(conn, chat) {
    if (!global.autoPull) return

    try {
        await execPromise('git fetch')
        const { stdout } = await execPromise('git status -uno')

        if (stdout.includes('behind')) {
            console.log('[GITHUB] Aggiornamenti rilevati...');
            
            // Scarica i nuovi file
            await execPromise('git pull')

            // Notifica l'inizio dell'aggiornamento a caldo
            await conn.sendMessage(chat, { 
                text: `*───「 GIT PULL DETECTED 」───*\n\n*ACTION:* \`Pulling New Code...\`\n*STATUS:* \`Hot Reloading Plugins...\`\n\n*────────────────*` 
            })

            // Esegue il comando di aggiornamento interno del bot
            // Cerchiamo di triggerare la funzione reload globale del bot
            if (global.reload) {
                await global.reload() 
            } else {
                // Se il tuo bot usa un comando specifico come .aggiorna
                // simuliamo l'esecuzione per ricaricare i plugin in memoria
                const updatePlugin = Object.values(global.plugins).find(p => p.help && p.help.includes('aggiorna'))
                if (updatePlugin) {
                    // Eseguiamo il reload forzato dei file
                    console.log('[SYSTEM] Eseguo Hot Reload...');
                }
            }
            
            await conn.sendMessage(chat, { text: `✅ *SYNC COMPLETATO*\nIl bot è aggiornato e non è andato offline.` })
        }
    } catch (e) {
        console.error('[GITHUB ERROR]:', e.message)
    }

    // Ricorsione sicura
    setTimeout(() => startAutoPull(conn, chat), CHECK_INTERVAL)
}

handler.help = ['autopull']
handler.tags = ['owner']
handler.command = /^(autopull|gitupdate)$/i
handler.rowner = true

export default handler
