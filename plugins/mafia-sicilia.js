// Plug-in creato da elixir
let handler = async (m, { conn, command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    if (!global.db.data.gangs) global.db.data.gangs = {}
    let gangs = global.db.data.gangs

    // Cerca se l'utente appartiene già a una famigghia
    let userGang = Object.keys(gangs).find(name => gangs[name].members.includes(m.sender))

    if (command === 'creafamigghia' || command === 'fondafamigghia') {
        if (userGang) return m.reply(`🚫 Già fai parti d'a famigghia *${userGang}*, compà!`)
        if (user.money < 1000000) return m.reply('💰 Pi funnari na famigghia servunu *1.000.000 🪙*. Non hai abbastanza rispettu (o sordi).')
        
        let name = args.join(' ')
        if (!name) return m.reply(`✍️ Scrivi u nomi d'a Famigghia!\nEsempio: \`${usedPrefix + command} Corleone\``)
        if (gangs[name]) return m.reply('❌ Stu nomi è già canusciutu in cità, scegni n\'autru.')

        user.money -= 1000000
        gangs[name] = {
            name: name,
            don: m.sender,
            sottocapo: null,
            members: [m.sender],
            fondo: 0,
            pizzu_totale: 0,
            level: 1
        }
        return m.reply(`🌹 *Baciamo le mani, Padrino.*\nA famigghia *${name}* ora cumanna pi sti strati.\nUsa \`.famigghia\` pi gestiri i tò picciotti.`)
    }

    if (command === 'famigghia' || command === 'gang') {
        if (!userGang) return m.reply(`🚫 Non apparteni a nuda famigghia. Usa \`.creafamigghia <nomi>\` pi cuminciari.`)
        let g = gangs[userGang]
        let list = `🌹 *FAMIGGHIA ${g.name.toUpperCase()}* 🌹\n`
        list += `━━━━━━━━━━━━━━━━━━━━\n`
        list += `👑 *Padrino (Don):* @${g.don.split('@')[0]}\n`
        list += `🥈 *Sottocapu:* ${g.sottocapo ? '@' + g.sottocapo.split('@')[0] : 'Nuddu'}\n`
        list += `👥 *Picciotti:* ${g.members.length}\n`
        list += `💰 *Cassa d'a Famigghia:* ${g.fondo.toLocaleString()} 🪙\n`
        list += `📈 *Putiri (Livellu):* ${g.level}\n`
        list += `━━━━━━━━━━━━━━━━━━━━\n`
        list += `📍 *Cumanni:* \`.invita\`, \`.pizzu\``
        
        return conn.reply(m.chat, list, m, { mentions: [g.don, g.sottocapo].filter(v => v) })
    }

    if (command === 'invita') {
        if (!userGang) return m.reply('🚫 Non si in tra na famigghia.')
        let g = gangs[userGang]
        if (m.sender !== g.don && m.sender !== g.sottocapo) return m.reply('🚷 Sulu u *Don* o u *Sottocapu* ponnu chiamari novi picciotti.')
        
        let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null
        if (!who) return m.reply('👤 Tagga u picciottu ca vo arruolari.')
        if (Object.values(gangs).some(f => f.members.includes(who))) return m.reply('❌ Stu cristianu apparteni già a n\'autra famigghia.')

        g.members.push(who)
        return m.reply(`✅ @${who.split('@')[0]} ora è un omu d'onuri d'a famigghia *${userGang}*!`, null, { mentions: [who] })
    }

    if (command === 'pizzu') {
        if (!userGang) return m.reply('🚫 Non hai na famigghia ca ti pruteggi.')
        let cooldown = 14400000 // 4 uri
        if (new Date() - (user.lastpizzu || 0) < cooldown) return m.reply('⏳ I nigozianti già pacaru. Torna cchiù tardi, unn\'essiri esaustivu.')

        let guadagno = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000
        let tassafamigghia = Math.floor(guadagno * 0.2) // 20% va alla cassa
        let netto = guadagno - tassafamigghia

        user.money += netto
        gangs[userGang].fondo += tassafamigghia
        user.lastpizzu = new Date() * 1

        m.reply(`🇮🇹 *RISCOSSIONI D'U PIZZU*\nHai riscossu d'i nigozi: +${guadagno} 🪙\n💰 Versato n'a cassa d'a famigghia (20%): -${tassafamigghia} 🪙\n💵 In scarsella: +${netto} 🪙\n\n*U rispettu è tuttu!*`)
    }
}

handler.help = ['famigghia']
handler.tags = ['economy']
handler.command = /^(creafamigghia|famigghia|invita|pizzu|gang)$/i

export default handler
