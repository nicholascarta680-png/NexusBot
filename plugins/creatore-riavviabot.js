// Plug-in creato da elixir

let handler = async (m, { conn }) => {
  try {
    // Reazione per far capire che il comando è stato ricevuto
    await m.react('⏳')
    
    // Messaggio di avviso in chat
    let message = `🔄 *RIASSUNTO VPS*: Sistema in riavvio...\n\n_Il bot si spegnerà e si riaccenderà in pochi secondi._`
    await conn.reply(m.chat, message, m)
    
    // Reazione finale prima dello spegnimento
    await m.react('🔄')

    // Aspetta 2 secondi per dare tempo a WhatsApp di inviare il messaggio e la reazione,
    // dopodiché killa il processo attuale.
    setTimeout(() => {
      process.exit(0)
    }, 2000)

  } catch (err) {
    await conn.reply(m.chat, `❌ *ERRORE DURANTE IL RIAVVIO*\n\n> ${err.message}`, m)
    await m.react('❌')
  }
}

handler.help = ['riavvia']
handler.tags = ['creatore']
handler.command = ['riavvia', 'restart', 'reboot'] // Risponde a questi comandi
handler.rowner = true // 🔐 Solo i veri proprietari del bot possono riavviare

export default handler
