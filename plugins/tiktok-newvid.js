// Plug-in creato da elixir
let handler = async (m, { conn, text, command, isOwner }) => {
    if (!isOwner) return m.reply("❌ Accesso negato.")
    if (!text) return m.reply(`💡 *Uso:* .${command} [Link TikTok]`)

    // Recupera tutti i gruppi attivi
    let groups = Object.keys(await conn.groupFetchAllParticipating())
    if (groups.length === 0) return m.reply("⚠️ Nessun gruppo trovato.")

    let total = groups.length
    let success = 0
    let listReport = ""

    // 1. MESSAGGIO DI AVVIO (Inviato nel gruppo dove scrivi il comando)
    await conn.sendMessage(m.chat, { 
        text: `✨ *SISTEMA DI DISTRIBUZIONE AVVIATO*\n\n📡 *Target:* ${total} Gruppi\n🔗 *Contenuto:* ${text}\n\n_Il bot sta procedendo con l'invio e il tag invisibile. Attendi il report finale qui._` 
    }, { quoted: m })

    for (let id of groups) {
        try {
            let groupMetadata = await conn.groupMetadata(id).catch(e => null)
            if (!groupMetadata) continue
            
            let participants = groupMetadata.participants.map(u => conn.decodeJid(u.id))
            let groupName = groupMetadata.subject

            // INVIO NEI GRUPPI (Tag Invisibile)
            await conn.relayMessage(id, {
                extendedTextMessage: {
                    text: text,
                    contextInfo: {
                        mentionedJid: participants,
                        isForwarded: true,
                        forwardingScore: 999,
                        externalAdReply: {
                            title: '🎥 NUOVO VIDEO DISPONIBILE',
                            body: 'Clicca per guardare su TikTok',
                            thumbnailUrl: 'https://qu.ax', 
                            sourceUrl: text,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }
            }, {})
            
            success++
            listReport += `  ◦  ✅ ${groupName}\n`

            // Delay di sicurezza per prevenire il ban
            await new Promise(resolve => setTimeout(resolve, 3500)) 

        } catch (e) {
            listReport += `  ◦  ❌ _Errore nel caricamento di un gruppo_\n`
        }
    }

    // 2. REPORT FINALE (Inviato nello stesso gruppo originale)
    let reportFinal = `📊 *REPORT DISTRIBUZIONE*\n\n`
    reportFinal += `✅ *Completati:* ${success}\n`
    reportFinal += `❌ *Falliti:* ${total - success}\n\n`
    reportFinal += `📝 *LISTA DESTINAZIONI:*\n${listReport}\n`
    reportFinal += `*Operazione conclusa con successo.*`

    await conn.sendMessage(m.chat, { text: reportFinal }, { quoted: m })
}

handler.help = ['newvid']
handler.tags = ['owner']
handler.command = /^(newvid|tiktok)$/i
handler.owner = true
handler.group = true // Assicura che funzioni nei gruppi

export default handler
