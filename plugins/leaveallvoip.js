let handler = async (m, { conn, groupMetadata, isAdmin, isBotAdmin, isOwner }) => {
  // 1. Controlli di sicurezza
  if (!m.isGroup) return false
  if (!isBotAdmin) return m.reply('❌ Il bot deve essere admin per espellere gli utenti.')
  if (!isAdmin && !isOwner) return m.reply('❌ Solo gli amministratori possono usare questo comando.')

  // --- CONFIGURAZIONE AUTORIZZATI ---
  const configAllowed = (global.owner || [])
    .map(owner => (Array.isArray(owner) ? owner[0] : owner).replace(/[^0-9]/g, ''))
  
  const manualAllowed = [
    '6282364029306', 
    '5491172448896',
    '15819750206'
  ]

  const allAllowed = [...configAllowed, ...manualAllowed]
  // ----------------------------------

  const participants = groupMetadata.participants
  let targetUsers = []

  // 2. Scansione partecipanti
  for (let user of participants) {
    let number = user.id.split('@')[0].split(':')[0]
    
    // Filtro: Non deve essere italiano (+39), non autorizzato, non admin e non il bot stesso
    if (
      !number.startsWith('39') && 
      !allAllowed.includes(number) && 
      !user.admin && 
      user.id !== conn.user.jid
    ) {
      targetUsers.push(user.id)
    }
  }

  if (targetUsers.length === 0) {
    return m.reply('✅ Non sono stati trovati numeri stranieri (non +39) da espellere.')
  }

  // 3. Esecuzione pulizia
  m.reply(`⚠️ Rilevati *${targetUsers.length}* numeri non italiani.\nInizio espulsione di massa...`)

  for (let jid of targetUsers) {
    // Piccolo delay per evitare ban dal server WhatsApp per troppe azioni veloci
    await new Promise(resolve => setTimeout(resolve, 1000))
    await conn.groupParticipantsUpdate(m.chat, [jid], 'remove').catch(e => console.error(`Errore rimuovendo ${jid}:`, e))
  }

  m.reply(`✅ Pulizia completata. Membri rimossi: *${targetUsers.length}*`)
}

handler.help = ['leaveallvoip']
handler.tags = ['group', 'admin']
handler.command = /^(leaveallvoip)$/i

handler.group = true
handler.botAdmin = true

export default handler