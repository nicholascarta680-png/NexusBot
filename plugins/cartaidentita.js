// Plug-in creato da elixir
let handler = async (m, { conn, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    let name = await conn.getName(m.sender)
    
    // Controllo Mafia
    if (!global.db.data.gangs) global.db.data.gangs = {}
    let familyName = Object.keys(global.db.data.gangs).find(name => global.db.data.gangs[name].members.includes(m.sender))
    let isDon = familyName && global.db.data.gangs[familyName].don === m.sender

    // Determinazione Lavoro (Se è Don, mostra Padrino)
    let professione = isDon ? '🌹 PADRINO' : (user.job || 'Disoccupato')
    
    // Calcolo Patrimonio
    let propVal = (user.properties || []).reduce((acc, p) => acc + (p.price || 0), 0)
    let totalWealth = (user.money || 0) + (user.bank || 0) + propVal

    let str = `
💳 *CARTA D'IDENTITÀ*
━━━━━━━━━━━━━━━━━━━━
👤 *Nome:* ${name}
💼 *Professione:* ${professione}
🌹 *Famiglia:* ${familyName || 'Nessuna'}

💰 *STATO ECONOMICO*
━━━━━━━━━━━━━━━━━━━━
📈 *Grado:* Livello ${Math.floor((user.workExp || 0) / 10)}
💸 *Patrimonio:* ${totalWealth.toLocaleString()} 🪙
🏠 *Residenza:* ${user.properties?.sort((a,b) => b.price - a.price)[0]?.name || 'Senza fissa dimora'}

📝 *Bio:* _${user.profile?.description || 'Nessuna'}_
━━━━━━━━━━━━━━━━━━━━`.trim()

    await conn.sendMessage(m.chat, { text: str }, { quoted: m })
}

handler.command = /^(cartaidentita|id)$/i
export default handler
