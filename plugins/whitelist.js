// Gestore Whitelist per singolo Gruppo
// Supporta: .whitelist, .whitelist add @tag, .whitelist remove @tag

let handler = async (m, { conn, text, command, usedPrefix, args }) => {
    // Inizializza il database della chat se non esiste
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    if (!global.db.data.chats[m.chat].whitelist) global.db.data.chats[m.chat].whitelist = []

    let chat = global.db.data.chats[m.chat]
    let who;

    // Comando .whitelist senza argomenti -> mostra lista
    if (command === 'whitelist' && (!args || args.length === 0 || (args.length === 1 && args[0] === 'list'))) {
        let list = chat.whitelist.map(jid => `┃ ➤ @${jid.split('@')[0]}`).join('\n')
        let caption = `
  ⋆｡˚『 ╭ \`WHITELIST GRUPPO\` ╯ 』˚｡⋆
╭
${list ? list : '┃ 『 ⚠️ 』 \`Nessun utente autorizzato\`'}
┃
╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒`
        return m.reply(caption, null, { mentions: conn.parseMention(list) })
    }

    // Comando: .whitelist add @tag o .whitelist remove @tag
    let action = null
    if (command === 'whitelist' && args && args.length >= 2) {
        action = args[0].toLowerCase()
        // Rimuovi l'action (add/remove) dai args per trovare l'utente
        let targetText = args.slice(1).join(' ')
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : targetText ? targetText.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false
    } else if (command === 'addwhitelist') {
        action = 'add'
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false
    } else if (command === 'delwhitelist') {
        action = 'remove'
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false
    }

    if (!who) return m.reply(`『 ⚠️ 』- \`Esempio: ${usedPrefix}whitelist add @tag\``)

    if (action === 'add' || command === 'addwhitelist') {
        if (chat.whitelist.includes(who)) return m.reply('『 ✨ 』- `L\'utente è già in questa whitelist!`')
        chat.whitelist.push(who)
        await global.db.write()
        await conn.sendMessage(m.chat, {
            text: `
  ⋆｡˚『 ╭ \`AUTORIZZATO\` ╯ 』˚｡⋆
╭
┃ 『 👤 』 \`Utente:\` @${who.split('@')[0]}
┃ 『 ✅ 』 \`Ambito:\` *Questo Gruppo*
┃
┃ ➤  \`Ora è esente dai controlli Antinuke.\`
╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒`,
            contextInfo: { mentionedJid: [who] }
        }, { quoted: m })
        return
    }

    if (action === 'remove' || command === 'delwhitelist') {
        if (!chat.whitelist.includes(who)) return m.reply('『 ❌ 』- `L\'utente non è in lista.`')
        chat.whitelist = chat.whitelist.filter(jid => jid !== who)
        await global.db.write()
        m.reply(`『 🗑️ 』- \`@${who.split('@')[0]} rimosso dalla whitelist locale.\``, null, { mentions: [who] })
        return
    }
}

handler.help = ['addwhitelist', 'delwhitelist', 'whitelist']
handler.tags = ['owner', 'group']
handler.command = /^(addwhitelist|delwhitelist|whitelist)$/i
handler.admin = true
handler.group = true

export default handler
