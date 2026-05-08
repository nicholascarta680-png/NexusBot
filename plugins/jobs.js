// Plug-in creato da elixir
let handler = async (m, { conn, command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    
    // Inizializzazione dati esperienza se non esistono
    if (typeof user.workExp === 'undefined') user.workExp = 0

    // Lista completa dei lavori
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
        'ladro': { nome: 'Ladro Professionista', paga: 1200 } // Aggiunto per future rapine
    }

    // Se l'utente scrive solo .job o .jobs senza specificare quale
    if (!args[0]) {
        if (!user.job) {
            let list = `🚫 *NON HAI ANCORA UN LAVORO!*\n\n`
            list += `Scegline uno scrivendo: \`${usedPrefix + command} <nome-lavoro>\`\n\n`
            list += `💼 *LISTA CARRIERE:*\n`
            Object.keys(lavori).forEach(k => {
                list += `- ${k} (Paga: ${lavori[k].paga} 🪙)\n`
            })
            return m.reply(list)
        } else {
            let lvl = Math.floor(user.workExp / 10)
            let progresso = user.workExp % 10
            return m.reply(`💼 *PROFILO LAVORATIVO*\n\n` +
                           `👤 *Ruolo:* ${user.job.toUpperCase()}\n` +
                           `💰 *Stipendio Base:* ${user.salary.toLocaleString()} 🪙\n` +
                           `📈 *Livello:* ${lvl}\n` +
                           `✨ *Esperienza:* ${user.workExp} [${progresso}/10 per il prossimo liv.]\n\n` +
                           `Usa \`.work\` per guadagnare e salire di livello!`)
        }
    }

    // Se l'utente prova a cambiare o scegliere un lavoro
    let scelta = args[0].toLowerCase()

    if (!lavori[scelta]) {
        return m.reply(`❌ Questo lavoro non esiste. Scrivi \`${usedPrefix + command}\` per vedere la lista.`)
    }

    // Se ha già un lavoro, avvisalo che perderà l'esperienza (opzionale, puoi toglierlo)
    if (user.job && user.job !== lavori[scelta].nome) {
        user.workExp = 0 // Reset esperienza se cambia carriera
    }

    // Assegnazione del lavoro nel Database
    user.job = lavori[scelta].nome
    user.salary = lavori[scelta].paga 

    return m.reply(`✅ *CONTRATTO FIRMATO*\n\nDa oggi sei un: *${lavori[scelta].nome}*\n💰 Paga concordata: ${lavori[scelta].paga.toLocaleString()} 🪙\n\nBuon lavoro!`)
}

handler.help = ['job']
handler.tags = ['economy']
handler.command = /^(job|jobs)$/i

export default handler
