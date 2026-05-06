let handler = async (m, { conn, command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    if (!user) return m.reply('❌ *Errore:* Utente non trovato nel database.')

    if (typeof user.money === 'undefined') user.money = 0
    if (typeof user.bank === 'undefined') user.bank = 0

    // Configurazione grafica comune
    const decor = "━━━━━━━━━━━━━━━━━━━━"
    const currency = "🪙"

    switch (command) {
        case 'portafoglio':
        case 'wallet':
        case 'bal':
            let total = user.money + user.bank
            let status = `
╭━━━〔 🏦 *ESTRATTO CONTO* 〕━━━🌀
┃
┃  👤 *Titolare:* @${m.sender.split('@')[0]}
┃  💵 *Contanti:* ${user.money.toLocaleString()} ${currency}
┃  🏛️ *In Banca:* ${user.bank.toLocaleString()} ${currency}
┃  
┃  ✨ *Bilancio Totale:* ${total.toLocaleString()} ${currency}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━🌀`.trim()

            // Esempio struttura bottoni (ButtonId)
            const buttons = [
                { buttonId: `${usedPrefix}dep all`, buttonText: { displayText: '📥 Deposita Tutto' }, type: 1 },
                { buttonId: `${usedPrefix}wd all`, buttonText: { displayText: '📤 Preleva Tutto' }, type: 1 }
            ]
            
            await conn.sendMessage(m.chat, { text: status, mentions: [m.sender], buttons: buttons }, { quoted: m })
            break

        case 'deposita':
        case 'dep':
            let depAmount = args[0] === 'all' ? user.money : parseInt(args[0])
            if (!depAmount || depAmount <= 0) return m.reply(`⚠️ *Info:* Specifica una cifra o usa\n👉 \`${usedPrefix + command} all\``)
            if (user.money < depAmount) return m.reply('🚫 *Operazione Negata:* Fondi insufficienti nel portafoglio.')
            
            user.money -= depAmount
            user.bank += depAmount
            
            m.reply(`✅ *Deposito Effettuato*\n${decor}\n💰 Hai versato: *${depAmount} ${currency}*\n🏦 Nuovo saldo banca: *${user.bank} ${currency}*`)
            break

        case 'preleva':
        case 'wd':
            let wdAmount = args[0] === 'all' ? user.bank : parseInt(args[0])
            if (!wdAmount || wdAmount <= 0) return m.reply(`⚠️ *Info:* Specifica una cifra o usa\n👉 \`${usedPrefix + command} all\``)
            if (user.bank < wdAmount) return m.reply('🚫 *Operazione Negata:* Non hai abbastanza fondi in banca.')
            
            user.bank -= wdAmount
            user.money += wdAmount
            
            m.reply(`✅ *Prelievo Effettuato*\n${decor}\n💰 Hai prelevato: *${wdAmount} ${currency}*\n💵 Contanti attuali: *${user.money} ${currency}*`)
            break

        case 'bonifico':
        case 'pay':
            let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null
            if (!who) return m.reply('👤 *A chi vuoi inviare soldi?*\nTagga un utente o rispondi a un suo messaggio.')
            
            let payAmount = parseInt(args.find(a => !a.includes('@')))
            if (!payAmount || payAmount <= 0) return m.reply('💰 *Errore:* Inserisci un importo valido per il bonifico.')
            if (user.money < payAmount) return m.reply('🚫 *Operazione Fallita:* Portafoglio vuoto.')

            let target = global.db.data.users[who]
            if (!target) return m.reply('❌ *Errore:* Il destinatario non esiste nel database.')

            user.money -= payAmount
            target.money = (target.money || 0) + payAmount
            
            m.reply(`💸 *Bonifico Confermato*\n${decor}\n📤 *Inviati:* ${payAmount} ${currency}\n👤 *A:* @${who.split('@')[0]}`, null, { mentions: [who] })
            break
    }
}

handler.help = ['portafoglio', 'deposita', 'preleva', 'bonifico']
handler.tags = ['economy']
handler.command = /^(portafoglio|wallet|bal|deposita|dep|preleva|wd|bonifico|pay)$/i

export default handler
