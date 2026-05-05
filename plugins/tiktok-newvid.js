// Plug-in creato da elixir
let handler = async (m, { conn, text, command, isOwner }) => {
    if (!isOwner) return m.reply("❌ Questo comando è riservato al proprietario del bot.")
    if (!text) return m.reply(`💡 *Esempio:* .${command} https://link-del-video.com`)

    // Recupera i JID dei gruppi dal database o dalla memoria
    let groups = Object.keys(await conn.groupFetchAllParticipating())
    if (groups.length === 0) return m.reply("⚠️ Il bot non è presente in alcun gruppo.")

    let total = groups.length
    let success = 0
    let listReport = ""

    let { key } = await conn.sendMessage(m.chat, { text: `⏳ *Preparazione broadcast...* [0/${total}]` }, { quoted: m })

    for (let i = 0; i < total; i++) {
        let id = groups[i]
        try {
            let groupMetadata = await conn.groupMetadata(id).catch(e => null)
            if (!groupMetadata) continue
            
            let participants = groupMetadata.participants.map(u => conn.decodeJid(u.id))
            let groupName = groupMetadata.subject

            // Messaggio con Tag Invisibile
            let msgObj = {
                extendedTextMessage: {
                    text: text,
                    contextInfo: {
                        mentionedJid: participants,
                        isForwarded: true,
                        forwardingScore: 999,
                        externalAdReply: {
                            title: '📢 NUOVO VIDEO DISPONIBILE',
                            body: `Inviato a: ${groupName}`,
                            thumbnailUrl: 'https://qu.ax',
                            sourceUrl: text,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }
            }

            await conn.relayMessage(id, msgObj, {})
            
            success++
            listReport += `✅ *${groupName}*\n`

            // Aggiorna il contatore live nel messaggio originale
            if (i % 2 === 0 || i === total - 1) { // Aggiorna ogni 2 gruppi per evitare spam
                await conn.sendMessage(m.chat, { 
                    text: `🚀 *Invio in corso...*\nProgresso: [${i + 1}/${total}]`, 
                    edit: key 
                })
            }

            // Pausa di sicurezza anti-ban
            await new Promise(resolve => setTimeout(resolve, 2500)) 

        } catch (e) {
            listReport += `❌ *Errore nel gruppo ID:* ${id}\n`
            console.error(e)
        }
    }

    // Messaggio finale con Report
    let finalMessage = `✨ *BROADCAST COMPLETATO!*\n\n`
    finalMessage += `📊 *Statistiche:* ${success}/${total} gruppi raggiunti.\n\n`
    finalMessage += `📋 *LISTA GRUPPI:*\n${listReport}`

    await conn.sendMessage(m.chat, { text: finalMessage, edit: key })
}

handler.help = ['newvid']
handler.tags = ['owner']
handler.command = /^(newvid)$/i
handler.owner = true

export default handler
