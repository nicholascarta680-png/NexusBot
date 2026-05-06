let handler = async (m, { conn, command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    if (!user) return m.reply('❌ Utente non trovato nel database.')

    if (typeof user.money === 'undefined') user.money = 0
    if (typeof user.bank === 'undefined') user.bank = 0

    switch (command) {
        case 'portafoglio':
        case 'wallet':
        case 'bal':
            m.reply(`*🏦 IL TUO CONTO* \n\n*💵 Contanti:* ${user.money} 🪙\n*🏛️ Banca:* ${user.bank} 🪙\n\n*Totale:* ${user.money + user.bank} 🪙`)
            break

        case 'deposita':
        case 'dep':
            let depAmount = args[0] === 'all' ? user.money : parseInt(args[0])
            if (!depAmount || depAmount <= 0) return m.reply(`❌ Specifica una cifra valida o usa *${usedPrefix + command} all*`)
            if (user.money < depAmount) return m.reply('❌ Non hai abbastanza contanti!')
            
            user.money -= depAmount
            user.bank += depAmount
            m.reply(`✅ Hai depositato *${depAmount} 🪙* in banca.`)
            break

        case 'preleva':
        case 'wd':
            let wdAmount = args[0] === 'all' ? user.bank : parseInt(args[0])
            if (!wdAmount || wdAmount <= 0) return m.reply(`❌ Specifica una cifra valida o usa *${usedPrefix + command} all*`)
            if (user.bank < wdAmount) return m.reply('❌ Non hai abbastanza soldi in banca!')
            
            user.bank -= wdAmount
            user.money += wdAmount
            m.reply(`✅ Hai prelevato *${wdAmount} 🪙* dal tuo conto.`)
            break

        case 'bonifico':
        case 'pay':
            let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null
            if (!who) return m.reply('❌ Tagga un utente o rispondi a un suo messaggio.')
            
            let payAmount = parseInt(args.find(a => !a.includes('@')))
            if (!payAmount || payAmount <= 0) return m.reply('❌ Specifica una cifra valida da inviare.')
            if (user.money < payAmount) return m.reply('❌ Non hai abbastanza contanti per il bonifico!')

            let target = global.db.data.users[who]
            if (!target) return m.reply('❌ L\'utente non è registrato nel database.')

            user.money -= payAmount
            target.money = (target.money || 0) + payAmount
            m.reply(`✅ Bonifico di *${payAmount} 🪙* inviato a @${who.split('@')[0]}`, null, { mentions: [who] })
            break
    }
}

handler.help = ['portafoglio', 'deposita', 'preleva', 'bonifico']
handler.tags = ['economy']
handler.command = /^(portafoglio|wallet|bal|deposita|dep|preleva|wd|bonifico|pay)$/i

export default handler
