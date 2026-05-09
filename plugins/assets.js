// Plug-in creato da elixir
let handler = async (m, { conn, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    if (!user.properties) user.properties = []
    if (!user.vehicles) user.vehicles = []

    let totalValue = 0
    const countItems = (arr) => {
        let counts = {}
        arr.forEach(item => {
            let key = `${item.name.toUpperCase()}${item.level > 1 ? ' [Lvl ' + item.level + ']' : ''}`
            counts[key] = (counts[key] || 0) + 1
            totalValue += (item.price || 0)
        })
        return counts
    }

    let text = `🏦 *PATRIMONIO DI @${m.sender.split('@')[0]}*\n`
    text += `━━━━━━━━━━━━━━━━━━━━\n\n`

    text += `🏘️ *IMMOBILI E BUSINESS*\n`
    if (user.properties.length > 0) {
        let props = countItems(user.properties)
        for (let name in props) {
            text += ` ├ ${name} (x${props[name]})\n`
        }
    } else {
        text += ` └ _Nessun investimento_\n`
    }

    text += `\n🏎️ *GARAGE E TRASPORTI*\n`
    if (user.vehicles.length > 0) {
        let vehs = countItems(user.vehicles)
        for (let name in vehs) {
            text += ` ├ ${name} (x${vehs[name]})\n`
        }
    } else {
        text += ` └ _Nessun veicolo_\n`
    }

    text += `\n━━━━━━━━━━━━━━━━━━━━\n`
    text += `💎 *VALORE ASSET:* ${totalValue.toLocaleString()} 🪙\n`
    text += `💵 *SALDO ATTUALE:* ${user.money.toLocaleString()} 🪙\n`
    
    if (user.money < 0) {
        text += `🚨 *IN DEBITO:* ${Math.abs(user.money).toLocaleString()} 🪙\n`
    }

    text += `\n👉 Usa \`${usedPrefix}riscuoti\` per i profitti\n`
    text += `👉 Usa \`${usedPrefix}potenzia\` per aumentare le rendite`

    await conn.sendMessage(m.chat, { text, mentions: [m.sender] }, { quoted: m })
}

handler.help = ['assets']
handler.tags = ['economy']
handler.command = /^(assets|inventario|mypo|averi)$/i

export default handler
