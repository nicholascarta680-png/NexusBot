// Plug-in creato da elixir
let handler = async (m, { conn, command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    if (typeof user.workExp === 'undefined') user.workExp = 0

    // Controllo se l'utente è un Padrino
    if (!global.db.data.gangs) global.db.data.gangs = {}
    let isPadrino = Object.values(global.db.data.gangs).some(g => g.don === m.sender)

    // Comando per licenziarsi
    if (command === 'licenziati' || (args[0] === 'stop')) {
        if (!user.job) return m.reply("❌ Non hai un lavoro da cui licenziarti.")
        if (isPadrino) return m.reply("🌹 Un Padrino non si licenzia, comanda e basta.")
        
        user.job = null
        user.salary = 0
        user.workExp = 0
        return m.reply("✅ Ti sei licenziato. Ora sei ufficialmente disoccupato.")
    }

    const lavori = {
        'chef': { nome: 'Chef Stellato', paga: 3000 },
        'pilota': { nome: 'Pilota di Linea', paga: 5000 },
        'manager': { nome: 'Manager Aziendale', paga: 4500 },
        'meccanico': { nome: 'Meccanico Specializzato', paga: 2000 },
        'impiegato': { nome: 'Impiegato Statale', paga: 1500 },
        'medico': { nome: 'Chirurgo', paga: 7000 },
        'avvocato': { nome: 'Avvocato Penalista', paga: 6000 },
        'programmatore': { nome: 'Sviluppatore Senior', paga: 4000 },
        'poliziotto': { nome: 'Agente di Polizia', paga: 1800 },
        'atleta': { nome: 'Calciatore Professionista', paga: 10000 },
        'astronauta': { nome: 'Astronauta', paga: 12000 },
        'youtuber': { nome: 'Content Creator', paga: 2500 },
        'agricoltore': { nome: 'Imprenditore Agricolo', paga: 2200 },
        'architetto': { nome: 'Architetto', paga: 3500 },
        'ladro': { nome: 'Ladro Professionista', paga: 1200 }
    }

    if (!args[0]) {
        if (isPadrino) return m.reply("👑 Il tuo ruolo è: *PADRINO*\nNon hai bisogno di un lavoro normale, riscuoti il `.pizzu`!")
        if (!user.job) {
            let list = `💼 *LAVORI DISPONIBILI:*\n`
            Object.keys(lavori).forEach(k => list += `- ${k} (${lavori[k].paga} 🪙)\n`)
            return m.reply(list + `\n✍️ Scegli con: \`${usedPrefix + command} <nome>\``)
        }
        return m.reply(`💼 *LAVORO ATTUALE:* ${user.job.toUpperCase()}\n📈 Livello: ${Math.floor(user.workExp / 10)}\n\nUsa \`${usedPrefix}licenziati\` per smettere.`)
    }

    if (isPadrino) return m.reply("🚫 Onorevole Padrino, non può abbassarsi a fare un lavoro comune.")
    
    let scelta = args[0].toLowerCase()
    if (!lavori[scelta]) return m.reply(`❌ Lavoro non trovato.`)

    user.job = lavori[scelta].nome
    user.salary = lavori[scelta].paga
    user.workExp = 0 

    return m.reply(`✅ Contratto firmato come: *${lavori[scelta].nome}*!`)
}

handler.command = /^(job|jobs|licenziati)$/i
export default handler
