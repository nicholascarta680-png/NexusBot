// Plug-in creato da elixir
let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender]
    let now = Date.now()
    let cooldown = 86400000 // 24 ore
    
    let totalIncome = 0
    let totalExpenses = 0
    
    // Costi fissi base (Luce, Gas, WiFi)
    let baseBills = 200 
    
    if (user.properties.length > 0) {
        user.properties.forEach(p => {
            if (!p.lastClaim || (now - p.lastClaim) > cooldown) {
                totalIncome += (p.rent || p.income || 0)
                totalExpenses += (p.tax || 0)
                p.lastClaim = now
            }
        })
    }

    if (user.vehicles.length > 0) {
        user.vehicles.forEach(v => {
            // Manutenzione e Carburante (Benzina/Diesel)
            totalExpenses += (v.maintenance || 0)
        })
    }

    if (totalIncome === 0 && user.properties.length > 0) return m.reply('⏳ Hai già riscosso i profitti oggi. Torna domani!')
    
    let netto = totalIncome - totalExpenses - baseBills
    user.money += netto

    let report = `📊 *RESOCONTO GIORNALIERO*\n\n`
    report += `💰 +${totalIncome.toLocaleString()} 🪙 (Rendite)\n`
    report += `📉 -${totalExpenses.toLocaleString()} 🪙 (Tasse e Carburante)\n`
    report += `🔌 -${baseBills} 🪙 (Luce, Gas, WiFi)\n`
    report += `────────────────\n`
    report += `💵 *Totale Netto:* ${netto.toLocaleString()} 🪙`

    m.reply(report)
}

handler.command = /^(riscuoti|claim)$/i
export default handler
