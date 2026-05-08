// Plug-in creato da elixir
let handler = async (m, { conn }) => {
    let user = global.db.data.users[m.sender]
    let now = Date.now()
    let cooldown = 86400000 // 24 ore
    
    let totalIncome = 0
    let totalExpenses = 0
    
    // Inizializzazione array se non esistono
    if (!user.properties) user.properties = []
    if (!user.vehicles) user.vehicles = []
    
    // Costi fissi base (Luce, Gas, WiFi)
    let baseBills = 200 
    
    // Calcolo rendite e tasse dalle proprietà
    if (user.properties.length > 0) {
        user.properties.forEach(p => {
            if (!p.lastClaim || (now - p.lastClaim) > cooldown) {
                totalIncome += (p.rent || p.income || 0)
                totalExpenses += (p.tax || 0)
                p.lastClaim = now
            }
        })
    }

    // Calcolo costi manutenzione veicoli
    if (user.vehicles.length > 0) {
        user.vehicles.forEach(v => {
            totalExpenses += (v.maintenance || 0)
        })
    }

    // Controllo se l'utente può riscuotere
    if (totalIncome === 0 && user.properties.length > 0) {
        return m.reply('⏳ Hai già riscosso i profitti oggi. Torna domani!')
    }
    
    // Calcolo del netto
    let netto = totalIncome - totalExpenses - baseBills
    user.money += netto

    // --- SISTEMA IMPREVISTI (15% di probabilità) ---
    let imprevistoMsg = ''
    if (Math.random() < 0.15) {
        let eventi = [
            { msg: "🚔 Multa per divieto di sosta!", cost: 500 },
            { msg: "💧 Perdita d'acqua in bagno!", cost: 1200 },
            { msg: "📉 Tasse comunali extra!", cost: 2000 },
            { msg: "🎉 Bonus produzione dai tuoi business!", cost: -3000 } // Guadagno extra
        ]
        let ev = eventi[Math.floor(Math.random() * eventi.length)]
        user.money -= ev.cost
        imprevistoMsg = `\n\n⚠️ *IMPREVISTO:* ${ev.msg}\n💰 Impatto: ${ev.cost > 0 ? '-' : '+'}${Math.abs(ev.cost).toLocaleString()} 🪙`
    }

    // Costruzione del report
    let report = `📊 *RESOCONTO GIORNALIERO*\n`
    report += `━━━━━━━━━━━━━━━━━━━━\n\n`
    report += `💰 +${totalIncome.toLocaleString()} 🪙 (Rendite)\n`
    report += `📉 -${totalExpenses.toLocaleString()} 🪙 (Tasse e Manutenzione)\n`
    report += `🔌 -${baseBills} 🪙 (Luce, Gas, WiFi)\n`
    report += `────────────────\n`
    report += `💵 *Totale Netto:* ${netto.toLocaleString()} 🪙`
    report += imprevistoMsg

    m.reply(report)
}

handler.help = ['riscuoti']
handler.tags = ['economy']
handler.command = /^(riscuoti|claim)$/i

export default handler
