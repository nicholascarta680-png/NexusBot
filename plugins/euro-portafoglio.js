let handler = async (m, { conn, command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    if (!user) return m.reply('❌ *Errore:* Utente non trovato.')

    if (typeof user.money === 'undefined') user.money = 0
    if (typeof user.bank === 'undefined') user.bank = 0

    const currency = "🪙"
    const infinite = "∞"
    
    // Formatta i contanti normalmente, la banca gestisce l'infinito
    const formatMoney = (num) => num >= 999999999999 ? "Molti" : num.toLocaleString()
    const formatBank = (num) => (num === Infinity || num >= 999999999999) ? infinite : num.toLocaleString()

    // Forza l'infinito in banca se presente nei contanti
    if (user.money === Infinity) {
        user.money = 0
        user.bank = Infinity
    }

    switch (command) {
        case 'portafoglio':
        case 'wallet':
        case 'bal':
            let status = `
╭━━━〔 🏦 *ESTRATTO CONTO* 〕━━━🌀
┃
┃  👤 *Titolare:* @${m.sender.split('@')[0]}
┃  💵 *Contanti:* ${formatMoney(user.money)} ${currency}
┃  🏛️ *In Banca:* ${formatBank(user.bank)} ${currency}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━🌀`.trim()

            const balButtons = [
                { buttonId: `${usedPrefix}dep all`, buttonText: { displayText: '📥 Deposita Tutto' }, type: 1 },
                { buttonId: `${usedPrefix}wd all`, buttonText: { displayText: '📤 Preleva Tutto' }, type: 1 }
            ]
            await conn.sendMessage(m.chat, { text: status, mentions: [m.sender], buttons: balButtons }, { quoted: m })
            break

        case 'deposita':
        case 'dep':
            let depAmount = args[0] === 'all' ? user.money : parseInt(args[0])
            if (!depAmount || depAmount <= 0) return m.reply(`⚠️ Usa: \`${usedPrefix + command} <cifra>\``)
            if (user.money < depAmount) return m.reply('🚫 Fondi insufficienti nel portafoglio.')
            
            user.money -= depAmount
            if (user.bank !== Infinity) user.bank += depAmount
            
            const depButtons = [{ buttonId: `${usedPrefix}bal`, buttonText: { displayText: '🏦 Vedi Saldo' }, type: 1 }]
            await conn.sendMessage(m.chat, { text: `✅ *Deposito Effettuato*\n💰 Hai versato: *${depAmount.toLocaleString()} ${currency}*`, buttons: depButtons }, { quoted: m })
            break

        case 'preleva':
        case 'wd':
            let wdAmount = args[0] === 'all' ? (user.bank === Infinity ? 999999999 : user.bank) : parseInt(args[0])
            if (!wdAmount || wdAmount <= 0) return m.reply(`⚠️ Usa: \`${usedPrefix + command} <cifra>\``)
            if (user.bank < wdAmount && user.bank !== Infinity) return m.reply('🚫 Non hai abbastanza fondi in banca.')
            
            if (user.bank !== Infinity) user.bank -= wdAmount
            user.money += wdAmount
            
            const wdButtons = [{ buttonId: `${usedPrefix}bal`, buttonText: { displayText: '🏦 Vedi Saldo' }, type: 1 }]
            await conn.sendMessage(m.chat, { text: `✅ *Prelievo Effettuato*\n💰 Hai prelevato: *${wdAmount.toLocaleString()} ${currency}*`, buttons: wdButtons }, { quoted: m })
            break

        case 'bonifico':
        case 'pay':
            let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null
            if (!who) return m.reply('👤 Tagga qualcuno o rispondi al suo messaggio.')
            
            let payAmount = parseInt(args.find(a => !a.includes('@')))
            if (!payAmount || payAmount <= 0) return m.reply('💰 Inserisci un importo valido.')
            if (user.money < payAmount) return m.reply('🚫 Portafoglio insufficiente.')

            let target = global.db.data.users[who]
            if (!target) return m.reply('❌ Utente non registrato.')

            user.money -= payAmount
            if (target.money !== Infinity) target.money = (target.money || 0) + payAmount
            
            m.reply(`💸 *Bonifico Confermato*\n📤 *Inviati:* ${payAmount.toLocaleString()} ${currency}\n👤 *A:* @${who.split('@')[0]}`, null, { mentions: [who] })
            break
    }
}

handler.help = ['portafoglio', 'deposita', 'preleva', 'bonifico']
handler.tags = ['economy']
handler.command = /^(portafoglio|wallet|bal|deposita|dep|preleva|wd|bonifico|pay)$/i

export default handler
