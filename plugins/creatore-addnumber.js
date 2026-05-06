// Plug-in creato da elixir
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`*⚠️ Inserisci un numero!*\nEsempio: \`${usedPrefix + command} +39 347XXXXXXX\``)
    
    // Pulisce il numero da spazi, trattini e il simbolo +
    let num = text.replace(/[^0-9]/g, '')
    let user = `${num}@s.whatsapp.net`
    let group = m.chat

    try {
        // 1. Prova ad aggiungere l'utente direttamente
        // Nota: Richiede che il bot sia admin del gruppo
        const response = await conn.groupParticipantsUpdate(group, [user], "add")
        
        // Verifica se l'aggiunta è riuscita (status 200) o se è necessario l'invito (403)
        if (response[0].status === "403") {
            m.reply('_Invito diretto fallito. Genero link d\'invito..._')
            
            // 2. Genera il link del gruppo
            let code = await conn.groupInviteCode(group)
            let inviteLink = `https://whatsapp.com{code}`
            
            // 3. Manda l'invito in privato all'utente
            await conn.sendMessage(user, { 
                text: `👋 Ciao! Sei stato invitato ad unirti a questo gruppo:\n\n${inviteLink}` 
            })
            
            m.reply(`*📩 Invito inviato in privato a @${num}*`, null, { mentions: [user] })
        } else {
            m.reply(`*✅ @${num} aggiunto con successo!*`, null, { mentions: [user] })
        }

    } catch (e) {
        // Gestione errori (numero non valido, bot non admin, ecc.)
        m.reply(`*❌ Errore:* Assicurati che il numero sia corretto e che il bot sia Admin del gruppo.`)
    }
}

handler.help = ['addnumber <numero>']
handler.tags = ['gruppo']
handler.command = /^(addnumber|aggiungi)$/i
handler.group = true // Funziona solo nei gruppi
handler.owner = true // Solo gli owner del bot possono usarlo (consigliato)
handler.botAdmin = true // Il bot deve essere admin per aggiungere o creare link

export default handler
