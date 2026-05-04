import { execSync } from 'child_process'

let handler = async (m, { conn, text }) => {
  if (conn.user.jid !== conn.user.jid) return 

  try {
    await m.react('⏳')
    
    execSync('git fetch')
    let status = execSync('git status -uno', { encoding: 'utf-8' })

    if (status.includes('Your branch is up to date') || status.includes('nothing to commit')) {
      await conn.reply(m.chat, '✅ *Il bot è già aggiornato.*', m)
      await m.react('✅')
      return
    }

    // Usiamo --stat per avere i dettagli dei singoli file
    let updateOutput = execSync('git reset --hard && git pull --stat' + (m.fromMe && text ? ' ' + text : ''), { encoding: 'utf-8' })
    
    // Analizziamo l'output per estrarre i file
    let fileDetails = parseGitFileDetails(updateOutput)

    let reportFiles = fileDetails.map((f, i) => {
      return `  node_format_as_bold_text_tag_openFILE #${i + 1}node_format_as_bold_text_tag_close 
  ↳ 📄 _${f.name}_
  ↳ 📈 [ +${f.ins} | -${f.del} ]`
    }).join('\n\n')

    let message = `
✨ *𝚂𝚈𝚂𝚃𝙴𝙼 𝚄𝙿𝙳𝙰𝚃𝙴* ✨
━━━━━━━━━━━━━━━━━━━━

📦 *DETTAGLI MODIFICHE:*
${reportFiles}

━━━━━━━━━━━━━━━━━━━━
✅ *𝙴𝙻𝙸𝚇𝙸𝚁 𝙱𝙾𝚃 è ora all'ultima versione!*`.trim()

    await conn.reply(m.chat, message, m)
    await m.react('🍥')

  } catch (err) {
    await conn.reply(m.chat, `❌ *ERRORE*\n\n> ${err.message}`, m)
    await m.react('❌')
  }
}

// Funzione per estrarre i dettagli di ogni singolo file modificato
function parseGitFileDetails(output) {
  const lines = output.split('\n')
  const files = []
  
  const fileLineRegex = /^\s+(.+)\s+\|\s+(\d+)\s+(.+)$/

  for (let line of lines) {
    let match = line.match(fileLineRegex)
    if (match) {
      let name = match[1].trim()
      let plusMinus = match[3]
      
      let ins = (plusMinus.match(/\+/g) || []).length
      let del = (plusMinus.match(/-/g) || []).length

      files.push({ name, ins, del })
    }
  }
  return files
}

handler.help = ['aggiorna']
handler.tags = ['creatore']
handler.command = ['aggiorna', 'update', 'aggiornabot']

export default handler
