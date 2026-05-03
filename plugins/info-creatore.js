let handler = async (m, { conn, usedPrefix, command }) => {
  
  let ownerNumber = global.owner[0][0]
  let ownerName = global.owner[0][1]

  if (command === 'git') {
    return await conn.reply(m.chat, `💻 *GitHub/Repo:* ${global.repobot}`, m)
  }
  if (command === 'insta') {
    return await conn.reply(m.chat, `📸 *Instagram:* ${global.insta}`, m)
  }

  let mention = `@${m.sender.split('@')[0]}`
  let text = `
*╭───╼ ⚡ ╾───╮*
   *DEVELOPER INFO*
*╰───╼ 👑 ╾───╯*

👋 Ciao ${mention}, 
ecco i riferimenti ufficiali del mio creatore.

*┏━━━━━━━━━━━━━━━━┓*
*┃* 👤 *OWNER:* ${ownerName}
*┃* 📱 *CONTATTO:* wa.me/${ownerNumber}
*┃* 🪐 *STATUS:* Online
*┃* 💻 *DEV:* JavaScript / Node.js
*┗━━━━━━━━━━━━━━━━┛*

━━━━━━━━━━━━━━━━━━━━
   *😈 ${ownerName} ᴅᴏᴍɪɴᴀ ⚡*
━━━━━━━━━━━━━━━━━━━━`.trim()

  const buttons = [
    { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '🛡️ MENU' }, type: 1 },
    { buttonId: `${usedPrefix}ping`, buttonText: { displayText: '⚡ STATUS' }, type: 1 },
    { buttonId: `${usedPrefix}git`, buttonText: { displayText: '💻 REPO' }, type: 1 },
    { buttonId: `${usedPrefix}insta`, buttonText: { displayText: '📸 INSTAGRAM' }, type: 1 }
  ]

  const buttonMessage = {
      text: text,
      footer: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${global.nomebot}`,
      buttons: buttons,
      headerType: 1,
      mentions: [m.sender]
  }

  await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
}

handler.help = ['owner']
handler.tags = ['info']
handler.command = ['owner','creatore','git','insta'] 

export default handler