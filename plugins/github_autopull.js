// Plug-in creato da elixir
import { exec } from 'child_process'
import { promisify } from 'util'

const execPromise = promisify(exec)

// --- CONFIGURAZIONE ---
const GROUP_TEST_ID = '120363408701936387@g.us' // Il tuo gruppo test
const CHECK_INTERVAL = 60000 // Controllo ogni 60 secondi (1 minuto)

let handler = async (m, { conn, isROwner }) => {
    if (!isROwner) return
    global.autoPull = !global.autoPull
    
    m.reply(`*───「 GITHUB SYNC 」───*\n\n*AUTO-PULL:* \`${global.autoPull ? 'ON' : 'OFF'}\`\n*LOG TARGET:* \`Gruppo Test\`\n\n*────────────────*`)
    
    if (global.autoPull) {
        startAutoPull(conn)
    }
}

async function startAutoPull(conn) {
    if (!global.autoPull) return

    try {
        await execPromise('git fetch')
        const { stdout } = await execPromise('git status -uno')

        if (stdout.includes('behind')) {
            console.log('[GITHUB] Rilevato aggiornamento in arrivo...');
            
            // Eseguiamo il pull dei nuovi file
            await execPromise('git pull')

            // Notifica nel gruppo test
            await conn.sendMessage(GROUP_TEST_ID, { 
                text: `*───「 GIT UPDATE 」───*\n\n*STATO:* \`Pull eseguito con successo\`\n*AZIONE:* \`Sincronizzazione plugin...\`\n\n*────────────────*` 
            })

            // Trigger del caricamento a caldo (senza spegnere il bot)
            // Se il bot ha un watcher integrato, si aggiornerà da solo.
            // Altrimenti, proviamo a chiamare la ricarica dei plugin
            if (global.reload) {
                await global.reload()
            }
        }
    } catch (e) {
        console.error('[SYNC ERROR]:', e.message)
        // Opzionale: invia errore nel gruppo se fallisce il pull
        // await conn.sendMessage(GROUP_TEST_ID, { text: `⚠️ *ERRORE SYNC:* ${e.message}` })
    }

    // Ricorsione per il prossimo controllo
    setTimeout(() => startAutoPull(conn), CHECK_INTERVAL)
}

handler.help = ['autopull']
handler.tags = ['owner']
handler.command = /^(autopull|gitupdate)$/i
handler.rowner = true

export default handler
