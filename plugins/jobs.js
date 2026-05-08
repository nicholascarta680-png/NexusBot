// Plug-in creato da elixir
let handler = async (m, { conn, command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    
    // Lista completa dei lavori con relativi stipendi medi (opzionali per il comando .work)
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
        'architetto': { nome: 'Architetto', paga: 3500 }
    }

    // Se l'utente scrive solo .job (o .jobs) senza argomenti
    if (!args[0]) {
        if (!user.job) {
            let list = `🚫 *Non hai ancora un lavoro!*\n\n`
            list += `Scegline uno scrivendo: \`${usedPrefix + command} <nome-lavoro>\`\n\n`
            list += `💼 *LAVORI DISPONIBILI:*\n`
            Object.keys(lavori).forEach(k => {
                list += `- ${k}\n`
            })
            return m.reply(list)
        } else {
            return m.reply(`💼 Il tuo lavoro attuale è: *${user.job.toUpperCase()}*\nUsa \`.work\` per guadagnare il tuo stipendio!`)
        }
    }

    // Se l'utente prova a scegliere un lavoro
    let scelta = args[0].toLowerCase()

    if (!lavori[scelta]) {
        return m.reply(`❌ Questo lavoro non esiste. Scrivi \`${usedPrefix + command}\` per vedere la lista.`)
    }

    // Assegnazione del lavoro
    user.job = lavori[scelta].nome
    user.salary = lavori[scelta].paga // Salviamo anche la paga per il comando .work

    return m.reply(`✅ Complimenti! Da oggi sei un *${lavori[scelta].nome}*.\n💰 La tua paga base sarà di ${lavori[scelta].paga.toLocaleString()} 🪙.`)
}

handler.help = ['job']
handler.tags = ['economy']
handler.command = /^(job|jobs)$/i // Accetta sia .job che .jobs

export default handler
