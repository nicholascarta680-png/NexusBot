// Plug-in creato da elixir
let handler = async (m, { conn, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    
    let text = `🏦 *PATRIMONIO DI @${m.sender.split('@')[0]}*\n\n`
    
    text += `🏠 *Proprietà:* ${user.properties?.length > 0 ? '' : 'Nessuna'}\n`
    user.properties?.forEach(p => {
        text += `- ${p.name} (${p.rent ? 'Affitto: ' + p.rent : 'Rendita: ' + p.income} 🪙)\n`
    })

    text += `\n🏎️ *Veicoli:* ${user.vehicles?.length > 0 ? '' : 'Nessuno'}\n`
    user.vehicles?.forEach(v => {
        text += `- ${v.name}\n`
    })

    // Pulsante per riscuotere rendite
    const buttons = [
        { buttonId: `${usedPrefix}riscuoti`, buttonText: { displayText: '💰 Riscuoti Rendite' }, type: 1 }
    ]

    await conn.sendMessage(m.chat, { text, mentions: [m.sender], buttons }, { quoted: m })
}

handler.help = ['assets', 'inventario']
handler.tags = ['economy']
handler.command = /^(assets|inventario|mypo)$/i
export default handler
