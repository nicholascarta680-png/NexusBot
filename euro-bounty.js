// ============================================================
// 🕵️ SISTEMA TAGLIE (BOUNTY) - Elixir Bot
// ============================================================
// Campi database utilizzati:
//   user.euro            - Saldo principale utente
//   user.bounty          - Taglia attiva sull'utente (default: 0)
//   user.lastBountyAlert - Timestamp ultimo avviso latitante (default: 0)
//   user.lastHunt        - Timestamp ultima caccia (cooldown 15min)
// ============================================================

// ---------- FUNZIONI DI SERVIZIO ----------
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000 // 24 ore in ms
const FIFTEEN_MINUTES = 15 * 60 * 1000         // 15 minuti in ms
const BOUNTY_ALERT_THRESHOLD = 150000           // Soglia minima per notifica latitante
const HUNT_SUCCESS_RATE = 0.4                   // 40% probabilità successo caccia
const HUNT_FAIL_PENALTY = 50                    // Penale in euro per caccia fallita

// ---------- HANDLER PRINCIPALE ----------
let handler = async (m, { conn, command, args, usedPrefix, isOwner }) => {
    let user = global.db.data.users[m.sender]
    if (!user) return m.reply('❌ *Errore:* Utente non trovato.')

    // Inizializza campi bounty se non esistono
    if (typeof user.bounty === 'undefined') user.bounty = 0
    if (typeof user.lastBountyAlert === 'undefined') user.lastBountyAlert = 0
    if (typeof user.lastHunt === 'undefined') user.lastHunt = 0

    switch (command) {
        // ========== 1. .taglia @utente [quantità] ==========
        case 'taglia':
        case 'bounty': {
            let tagTarget = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null
            if (!tagTarget) return m.reply('👤 *Usa:* `' + usedPrefix + 'taglia @utente <importo>`\n\nEsempio: `' + usedPrefix + 'taglia @utente 1000`')

            if (tagTarget === m.sender) return m.reply('❌ Non puoi mettere una taglia su te stesso!')

            let tagAmount = parseInt(args.find(a => !a.includes('@')))
            if (!tagAmount || tagAmount <= 0) return m.reply('💰 *Usa:* `' + usedPrefix + 'taglia @utente <importo>`\n\nEsempio: `' + usedPrefix + 'taglia @utente 1000`')

            if (user.euro < tagAmount) return m.reply('🚫 Non hai abbastanza Euro! Ti servono *' + tagAmount.toLocaleString() + ' 🪙*, ma hai solo *' + (user.euro || 0).toLocaleString() + ' 🪙*.')

            let tagTargetUser = global.db.data.users[tagTarget]
            if (!tagTargetUser) return m.reply('❌ Utente non trovato nel database.')
            if (typeof tagTargetUser.bounty === 'undefined') tagTargetUser.bounty = 0

            // Sottrai dal mittente e aggiungi al target
            user.euro -= tagAmount
            tagTargetUser.bounty += tagAmount

            conn.sendMessage(m.chat, {
                text: '🕵️ *@' + m.sender.split('@')[0] + '* ha messo una taglia di *' + tagAmount.toLocaleString() + ' Euro* sulla testa di *@' + tagTarget.split('@')[0] + '*!\n\nLa sua taglia totale ora è di *' + tagTargetUser.bounty.toLocaleString() + ' Euro*! 💀',
                mentions: [m.sender, tagTarget]
            }, { quoted: m })
            break
        }

        // ========== 2. .caccia @utente ==========
        case 'caccia':
        case 'hunt': {
            let huntTarget = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null
            if (!huntTarget) return m.reply('👤 *Usa:* `' + usedPrefix + 'caccia @utente`\n\nEsempio: `' + usedPrefix + 'caccia @ricercato`')

            if (huntTarget === m.sender) return m.reply('❌ Non puoi dare la caccia a te stesso! Pazzo!')

            let huntTargetUser = global.db.data.users[huntTarget]
            if (!huntTargetUser) return m.reply('❌ Utente non trovato nel database.')
            if (typeof huntTargetUser.bounty === 'undefined') huntTargetUser.bounty = 0

            if (huntTargetUser.bounty <= 0) return m.reply('🚫 *@' + huntTarget.split('@')[0] + '* non ha alcuna taglia attiva. Questa persona non è ricercata! 🕊️', null, { mentions: [huntTarget] })

            // Controllo cooldown 15 minuti
            let now = Date.now()
            if (user.lastHunt && (now - user.lastHunt) < FIFTEEN_MINUTES) {
                let remaining = Math.ceil((FIFTEEN_MINUTES - (now - user.lastHunt)) / 60000)
                return m.reply('⏳ Devi aspettare *' + remaining + ' minuto/i* prima di poter cacciare di nuovo!')
            }

            user.lastHunt = now

            // 40% probabilità di successo
            let huntSuccess = Math.random() < HUNT_SUCCESS_RATE
            let bountyAmount = huntTargetUser.bounty

            if (huntSuccess) {
                // SUCCESSO: il cacciatore prende la taglia
                if (typeof user.euro === 'undefined') user.euro = 0
                user.euro += bountyAmount
                huntTargetUser.bounty = 0

                conn.sendMessage(m.chat, {
                    text: '💥 *Catturato!*\n\n🏃 @' + m.sender.split('@')[0] + '* ha preso *@' + huntTarget.split('@')[0] + '* e ha riscosso la taglia di *' + bountyAmount.toLocaleString() + ' Euro*! 🎯',
                    mentions: [m.sender, huntTarget]
                }, { quoted: m })
            } else {
                // FALLIMENTO: penale di 50 euro
                if (typeof user.euro === 'undefined') user.euro = 0
                user.euro = Math.max(0, user.euro - HUNT_FAIL_PENALTY)

                conn.sendMessage(m.chat, {
                    text: '💨 *@' + huntTarget.split('@')[0] + '* è riuscito a sfuggire all\'inseguimento di *@' + m.sender.split('@')[0] + '*! Hai perso *' + HUNT_FAIL_PENALTY + ' Euro* in equipaggiamento. 😤',
                    mentions: [m.sender, huntTarget]
                }, { quoted: m })
            }
            break
        }

        // ========== 3. .topricercati ==========
        case 'topricercati':
        case 'topbounty':
        case 'ricercati':
        case 'bountylist': {
            let allUsers = global.db.data.users
            let bountyList = []

            for (let userId in allUsers) {
                let u = allUsers[userId]
                if (u && u.bounty && u.bounty > 0) {
                    bountyList.push({ id: userId, bounty: u.bounty })
                }
            }

            if (bountyList.length === 0) {
                return m.reply('🕊️ *Nessun ricercato al momento. La città è tranquilla!*')
            }

            // Ordina dal più alto al più basso
            bountyList.sort((a, b) => b.bounty - a.bounty)

            // Prendi i primi 10
            let top = bountyList.slice(0, 10)
            let leaderboard = '╭━━━〔 🏆 *TOP RICERCATI* 〕━━━🌀\n┃\n'
            top.forEach((u, i) => {
                let rank = i + 1
                let medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '👤'
                let name = u.id.split('@')[0]
                leaderboard += '┃  ' + medal + ' @' + name + ' - *' + u.bounty.toLocaleString() + ' Euro*\n'
            })
            leaderboard += '┃\n╰━━━━━━━━━━━━━━━━━━━━━━━🌀'

            let mentions = top.map(u => u.id)
            conn.sendMessage(m.chat, {
                text: leaderboard,
                mentions: mentions
            }, { quoted: m })
            break
        }

        // ========== 4. .removetaglia @utente (SOLO OWNER) ==========
        case 'removetaglia':
        case 'cleartaglia':
        case 'removebounty': {
            // Controllo permessi: solo Bot Owner
            if (!isOwner) {
                return m.reply('🛡️ *ACCESSO NEGATO*\nSolo i proprietari del bot possono rimuovere taglie.')
            }

            let removeTarget = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null
            if (!removeTarget) return m.reply('👤 *Usa:* `' + usedPrefix + 'removetaglia @utente`')

            let removeUser = global.db.data.users[removeTarget]
            if (!removeUser) return m.reply('❌ Utente non trovato nel database.')
            if (typeof removeUser.bounty === 'undefined' || removeUser.bounty === 0) {
                return m.reply('🚫 *@' + removeTarget.split('@')[0] + '* non ha alcuna taglia attiva.', null, { mentions: [removeTarget] })
            }

            let removedBounty = removeUser.bounty
            removeUser.bounty = 0

            conn.sendMessage(m.chat, {
                text: '✅ *Taglia rimossa con successo!*\n\n👤 @' + removeTarget.split('@')[0] + ' non è più ricercato.\n💰 Taglia rimossa: *' + removedBounty.toLocaleString() + ' Euro*',
                mentions: [removeTarget]
            }, { quoted: m })
            break
        }
    }
}

// ---------- 5. NOTIFICA AUTOMATICA "LATITANTE PIÙ RICERCATO" (Ogni 24h) ----------
handler.all = async function (m, { conn }) {
    try {
        // Ignora messaggi del bot stesso
        if (m.fromMe) return
        if (!m.sender) return

        let user = global.db.data.users[m.sender]
        if (!user) return

        // Inizializza campi se non esistono
        if (typeof user.bounty === 'undefined') user.bounty = 0
        if (typeof user.lastBountyAlert === 'undefined') user.lastBountyAlert = 0

        // Se l'utente non ha taglia, salta
        if (user.bounty <= 0) return

        // Controlla se la taglia è >= 150.000
        if (user.bounty < BOUNTY_ALERT_THRESHOLD) return

        // Verifica se questo utente è davvero quello con la taglia più alta
        let allUsers = global.db.data.users
        let topBounty = 0
        let topUserId = null

        for (let userId in allUsers) {
            let u = allUsers[userId]
            if (u && u.bounty && u.bounty > topBounty) {
                topBounty = u.bounty
                topUserId = userId
            }
        }

        // Se l'utente che ha scritto NON è il numero 1, salta
        if (topUserId !== m.sender) return

        // Controllo anti-spam: 24 ore dall'ultima notifica
        let now = Date.now()
        if (user.lastBountyAlert && (now - user.lastBountyAlert) < TWENTY_FOUR_HOURS) return

        // Invia la notifica
        await conn.sendMessage(m.chat, {
            text: '🚨 *ATTENZIONE!*\n\nIl ricercato numero uno del server, *@' + m.sender.split('@')[0] + '*, è appena entrato in chat!\nLa sua taglia attuale è di *' + user.bounty.toLocaleString() + ' Euro*!\n\nCacciatori, all\'attacco! 🎯',
            mentions: [m.sender]
        })

        // Aggiorna il timestamp dell'ultimo avviso
        user.lastBountyAlert = now
    } catch (e) {
        console.error('[ERRORE] Bounty auto-notification:', e)
    }
}

handler.help = ['taglia', 'caccia', 'topricercati', 'removetaglia']
handler.tags = ['giochi']
handler.command = /^(taglia|bounty|caccia|hunt|topricercati|topbounty|ricercati|bountylist|removetaglia|cleartaglia|removebounty)$/i
handler.group = true // Funziona solo in gruppo per sicurezza sociale

export default handler
