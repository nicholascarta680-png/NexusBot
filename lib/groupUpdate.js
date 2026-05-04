// Plug-in creato da elixir
// Da inserire nel case 'add' del gestore eventi di gruppo
case 'add':
    if (chat.welcome) {
        const fs = require('fs') // O import se fuori da un case
        const blPath = './blacklist.json'
        let bl = fs.existsSync(blPath) ? JSON.parse(fs.readFileSync(blPath, 'utf-8')) : {}

        // Recuperiamo i dati del gruppo una volta sola
        let groupMetadata = await this.groupMetadata(id)
        let admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id)
        let botIsAdmin = admins.includes(this.user.jid)

        for (let user of participants) {
            if (bl[user]) {
                // Se l'utente è in blacklist
                if (botIsAdmin) {
                    await this.sendMessage(id, { 
                        text: `🚫 *ACCESSO NEGATO* 🚫\n\n@${user.split('@')[0]} è in Blacklist e verrà espulso immediatamente.\n\n📌 *Motivo:* ${bl[user].reason}\n📅 *Data ban:* ${bl[user].date}`,
                        mentions: [user, ...admins]
                    })
                    // Espulsione
                    await this.groupParticipantsUpdate(id, [user], 'remove')
                } else {
                    // Se il bot non è admin, avvisa solo
                    await this.sendMessage(id, { 
                        text: `⚠️ *ATTENZIONE ADMIN* ⚠️\n\nL'utente @${user.split('@')[0]} è in Blacklist ma non posso rimuoverlo perché non sono admin!`,
                        mentions: [user, ...admins]
                    })
                }
                continue // Salta il messaggio di benvenuto per questo utente
            }
            
            // --- QUI VA IL TUO CODICE DEL BENVENUTO STANDARD ---
            let welcomeText = (chat.sWelcome || 'Benvenuto @user in @subject').replace('@user', '@' + user.split('@')[0]).replace('@subject', groupMetadata.subject)
            await this.sendMessage(id, { text: welcomeText, mentions: [user] })
        }
    }
    break
