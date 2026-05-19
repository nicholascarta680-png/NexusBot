let handler = m => m

function unwrapMessageContent(message) {
  let content = message?.message || message
  for (let i = 0; i < 10; i++) {
    if (content?.ephemeralMessage?.message) { content = content.ephemeralMessage.message; continue }
    if (content?.viewOnceMessage?.message) { content = content.viewOnceMessage.message; continue }
    if (content?.viewOnceMessageV2?.message) { content = content.viewOnceMessageV2.message; continue }
    if (content?.documentWithCaptionMessage?.message) { content = content.documentWithCaptionMessage.message; continue }
    if (content?.editedMessage?.message) { content = content.editedMessage.message; continue }
    break
  }
  return content
}

function extractTextFromMessage(m) {
  // Estrae SOLO il testo e la caption del messaggio, senza scavare nell'oggetto
  let text = ''
  if (m?.text && typeof m.text === 'string') text += ' ' + m.text
  if (m?.caption && typeof m.caption === 'string') text += ' ' + m.caption
  return text.trim()
}

function containsLink(text) {
  const t = String(text || '').trim()
  if (!t) return false
  // Regex specifica per veri URL internet — richiede protocollo + dominio valido
  const linkRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi
  if (linkRegex.test(t)) return true
  // Rilevamento WhatsApp/Telegram/Discord short link
  const shortLinkRegex = /(chat\.whatsapp\.com\/|wa\.me\/|t\.me\/|discord\.gg\/|bit\.ly\/|tinyurl\.com\/)/i
  if (shortLinkRegex.test(t)) return true
  return false
}

// --- GESTIONE SANZIONI ---

async function addWarn(conn, m, target, reason, isBotAdmin) {
  if (!global.db.data.users[target]) global.db.data.users[target] = {}
  const user = global.db.data.users[target]
  if (!user.warns) user.warns = {}
  if (typeof user.warns[m.chat] !== 'number') user.warns[m.chat] = 0

  user.warns[m.chat] += 1
  const warns = user.warns[m.chat]
  const tag = target.split('@')[0]
  
  const header = `⋆｡˚『 ╭ \`SISTEMA ANTILINK\` ╯ 』˚｡⋆`
  const footer = `╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒`

  if (warns >= 3) {
    user.warns[m.chat] = 0
    await conn.sendMessage(m.chat, {
      text: `${header}\n\n🚨 *TERMINAZIONE* @${tag}\n\n┃ ⛔ \`Violazione:\` Link multipli\n┃ ⚠️ \`Warn:\` *3/3*\n┃ 💀 \`Sanzione:\` *ESPULSIONE*\n\n${footer}`,
      mentions: [target]
    }).catch(() => {})

    if (isBotAdmin) {
      await conn.groupParticipantsUpdate(m.chat, [target], 'remove').catch(() => {})
    }
    return
  }

  await conn.sendMessage(m.chat, {
    text: `${header}\n\n🚨 *ATTENZIONE* @${tag}\n\n┃ ⛔ \`Violazione:\` *${reason}*\n┃ ⚠️ \`Warn:\` *${warns}/3*\n┃ 🚫 \`Azione:\` Messaggio rimosso\n\n${footer}`,
    mentions: [target]
  }).catch(() => {})
}

// --- HANDLER BEFORE ---

handler.before = async function (m, { conn, isAdmin, isBotAdmin, isOwner, isSam }) {
  if (m.isBaileys && m.fromMe) return true
  if (!m.isGroup) return false
  if (!m.message) return true

  const chat = global.db.data.chats[m.chat]
  if (!chat?.antiLinkUni) return true

  // Gli admin e Blood sono immuni
  if (isAdmin || isOwner || isSam) return true

  const text = extractTextFromMessage(m)
  if (!containsLink(text)) return true

  // Azione immediata: eliminazione
  if (isBotAdmin) {
    await conn.sendMessage(m.chat, { delete: m.key }).catch(() => {})
  }
  
  // Registrazione violazione
  await addWarn(conn, m, m.sender, 'Link universale non autorizzato', !!isBotAdmin)

  return false
}

export default handler
