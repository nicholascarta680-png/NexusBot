// Plug-in creato da elixir
let handler = async (m, { conn, command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    if (!global.db.data.gangs) global.db.data.gangs = {}
    let gangs = global.db.data.gangs

    // Trova se l'utente appartiene già a una famiglia
    let userGang = Object.keys(gangs).find(name => gangs[name].members.includes(m.sender))

    if (command === 'creafamiglia' || command === 'fondafamiglia') {
        if (userGang) return m.reply(`🚫 Fai già parte della famiglia *${userGang}*!`)
        if (user.money < 1000000) return m.reply('💰 Fondare una famiglia costa *1.000.000 🪙*. Non hai abbastanza rispetto (o soldi).')
        
        let name = args.join(' ')
        if (!name) return m.reply(`✍️ Inserisci il nome della Famiglia!\nEsempio: \`${usedPrefix + command} Corleone\``)
        if (gangs[name]) return m.reply('❌ Questo nome è già rispettato in città (esiste già).')

        user.money -= 1000000
        gangs[name] = {
            name: name,
            don: m.sender,
            sottocapo: null,
            members: [m.sender],
            fondo: 0,
            pizzo_totale: 0,
            level: 1
        }
        return m.reply(`🌹 *Benvenuto Padrino.*\nLa Famiglia *${name}* ora domina queste strade.\nUsa \`.famiglia\` per gestire i tuoi uomini.`)
    }

    if (command === 'famiglia' || command === 'gang') {
        if (!userGang) return m.reply(`🚫 Non appartieni a nessuna Famiglia. Usa \`.creafamiglia <nome>\` per iniziarne una.`)
        let g = gangs[userGang]
        let list = `🌹 *FAMIGLIA ${g.name.toUpperCase()}* 🌹\n`
        list += `━━━━━━━━━━━━━━━━━━━━\n`
        list += `👑 *Don:* @${g.don.split('@')[0]}\n`
        list += `🥈 *Sottocapo:* ${g.sottocapo ? '@' + g.sottocapo.split('@')[0] : 'Nessuno'}\n`
        list += `👥 *Picciotti:* ${g.members.length}\n`
        list += `💰 *Fondo Comune:* ${g.fondo.toLocaleString()} 🪙\n`
        list += `📈 *Potere (Livello):* ${g.level}\n`
        list += `━━━━━━━━━━━━━━━━━━━━\n`
        list += `📍 *Comandi:* \`.invita\`, \`.deposito\`, \`.pizzo\``
        
        return conn.reply(m.chat, list, m, { mentions: [g.don, g.sottocapo].filter(v => v) })
    }

    if (command === 'invita') {
        if (!userGang) return m.reply('🚫 Non sei in una famiglia.')
        let g = gangs[userGang]
        if (m.sender !== g.don && m.sender !== g.sottocapo) return m.reply('🚷 Solo il *Don* o il *Sottocapo* possono reclutare nuovi uomini.')
        
        let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null
        if (!who) return m.reply('👤 Tagga il picciotto che vuoi reclutare.')
        if (Object.values(gangs).some(f => f.members.includes(who))) return m.reply('❌ Questo uomo appartiene già a un\'altra famiglia.')

        g.members.push(who)
        return m.reply(`✅ @${who.split('@')[0]} ora è un uomo d'onore della Famiglia *${userGang}*!`, null, { mentions: [who] })
    }

    if (command === 'pizzo') {
        if (!userGang) return m.reply('🚫 Non hai una famiglia che ti protegge.')
        let cooldown = 3600000 * 4 // 4 ore
        if (new Date() - (user.lastPizzo || 0) < cooldown) return m.reply('⏳ I commercianti hanno già pagato. Torna più tardi.')

        let guadagno = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000
        let tassaFamiglia = Math.floor(guadagno * 0.2) // 20% va al fondo comune
        let netto = guadagno - tassaFamiglia

        user.money += netto
        gangs[userGang].fondo += tassaFamiglia
        user.lastPizzo = new Date() * 1

        m.reply(`🇮🇹 *RISCOSSIONE PIZZO*\nHai riscosso dai negozi: +${guadagno} 🪙\n💰 Versato nel fondo famiglia (20%): -${tassaFamiglia} 🪙\n💵 In tasca: +${netto} 🪙`)
    }
}

handler.command = /^(creafamiglia|famiglia|invita|pizzo|gang)$/i
export default handler
