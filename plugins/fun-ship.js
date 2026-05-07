// Plug-in creato da elixir
let handler = async (m, { conn, text }) => {
    let mentioned = m.mentionedJid
    if (mentioned.length < 2) return m.reply('Devi menzionare due persone! Es: .ship @user1 @user2')

    let user1 = mentioned[0].split('@')[0]
    let user2 = mentioned[1].split('@')[0]
    
    let percentuale = Math.floor(Math.random() * 100) + 1
    let commento = percentuale > 80 ? "❤️ Coppia perfetta!" :
                   percentuale > 60 ? "Bella coppia!" :
                   percentuale > 40 ? "Ci può stare" : "Meglio amici 😂"

    await conn.reply(m.chat, `╔══ *SHIP METER* ══╗\n\n` +
                           `${user1} ❤️ ${user2}\n` +
                           `Compatibilità: ${percentuale}%\n\n` +
                           `${commento}\n` +
                           `╚════════════════╝`, m, { mentions: mentioned })
}

handler.command = /^ship$/i
handler.tags = ['fun']
handler.group = true
export default handler
