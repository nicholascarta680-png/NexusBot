// Plug-in creato da elixir
let handler = async (m, { conn, command, args }) => {
    let user = global.db.data.users[m.sender]

    if (command === 'riscuoti') {
        let totalIncome = 0
        let now = Date.now()
        let cooldown = 86400000 // 24 ore

        user.properties.forEach(p => {
            if (!p.lastClaim || (now - p.lastClaim) > cooldown) {
                totalIncome += (p.rent || p.income || 0)
                p.lastClaim = now
            }
        })

        if (totalIncome === 0) return m.reply('⏳ Hai già riscosso tutto per oggi o non hai proprietà che generano rendite.')
        
        user.money += totalIncome
        return m.reply(`💵 Hai riscosso le tue rendite: +*${totalIncome.toLocaleString()} 🪙*`)
    }

    if (command === 'lavoro') {
        let lavori = ['Chef', 'Pilota', 'Manager', 'Meccanico', 'Impiegato']
        if (!user.job) {
            let casuale = lavori[Math.floor(Math.random() * lavori.length)]
            user.job = casuale
            return m.reply(`💼 Ora sei un *${casuale}*! Usa \`.work\` per guadagnare.`)
        }
        return m.reply(`💼 Il tuo lavoro attuale: *${user.job}*`)
    }
}

handler.command = /^(riscuoti|lavoro)$/i
export default handler
