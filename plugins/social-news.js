// Plug-in creato da elixir
import axios from 'axios'

let handler = async (m, { conn, text, command }) => {
  // Comando Manuale (.newss link)
  if (command === 'newss') {
    if (!text) return m.reply('❌ Inserisci il link dell\'edit o della notizia!')
    
    // Recupera tutti i gruppi in cui è presente il bot
    const groups = Object.keys(conn.chats).filter(id => id.endsWith('@g.us'))
    
    if (groups.length === 0) return m.reply('❌ Il bot non è in alcun gruppo.')

    let msg = `✨ *𝙽𝙴𝚆 𝙴𝙳𝙸𝚃* ✨\n━━━━━━━━━━━━━━━━━━━━\n\n🎬 *Nuovo contenuto disponibile!*\nGuarda l'ultimo edit qui:\n🔗 ${text.trim()}\n\n━━━━━━━━━━━━━━━━━━━━\n🔥 _Supporta con un like!_`

    m.reply(`⏳ Invio in corso a ${groups.length} gruppi...`)

    for (let id of groups) {
      try {
        // Ottiene i partecipanti per il tag globale
        const groupMetadata = await conn.groupMetadata(id)
        const participants = groupMetadata.participants.map(u => u.id)
        
        await conn.sendMessage(id, { 
          text: msg, 
          mentions: participants 
        })
      } catch (e) {
        console.error(`Errore nell'invio al gruppo ${id}:`, e)
      }
    }
    
    return m.reply(`✅ Messaggio inviato con successo a tutti i gruppi.`)
  }
}

handler.help = ['newss']
handler.tags = ['social', 'admin']
handler.command = /^(newss|newedit)$/i
handler.rowner = true // Solo il proprietario può usarlo

export default handler
