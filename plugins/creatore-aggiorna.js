import { execSync } from 'child_process'

let handler = async (m, { conn, text }) => {
  // Verifica proprietario (opzionale, basato sulla tua logica)
  try {
    await m.react('🛰️')
    
    // --- STEP 1: CONNESSIONE ---
    await conn.sendMessage(m.chat, { text: '`[ SYSTEM ]` Connessione al repository GitHub...' }, { quoted: m })

    execSync('git fetch')
    let status = execSync('git status -uno', { encoding: 'utf-8' })

    if (status.includes('Your branch is up to date') || status.includes('nothing to commit')) {
      await m.react('✅')
      return conn.reply(m.chat, `*───「 SYNC STATUS 」───*\n\n✅ *Il sistema è già all'ultima versione.*\n\n*────────────────*`, m)
    }

    // --- STEP 2: DOWNLOAD ---
    await conn.sendMessage(m.chat, { text: '`[ SYSTEM ]` Aggiornamenti rilevati. Download in corso...' }, { quoted: m })
    
    let updateOutput = execSync('git reset --hard && git pull --stat' + (m.fromMe && text ? ' ' + text : ''), { encoding: 'utf-8' })
    let fileDetails = parseGitFileDetails(updateOutput)

    // Formattazione elegante dei file
    let reportFiles = fileDetails.map((f, i) => {
      return `📂 *FILE [${i + 1}]*: \`${f.name}\`\n  └ 🟢 +${f.ins}  |  🔴 -${f.del}`
    }).join('\n')

    // --- REPORT FINALE ---
    let message = `┏─━─━─━  〔 🛡️ 〕  ━─━─━─┓
     *ELIXIR CORE UPDATE*
┗─━─━─━─━─━─━─━─━─┛

◈ *Status:* \`Sincronizzato\`
◈ *Repository:* \`Origin/Main\`

*DETTAGLI MODIFICHE:*
${reportFiles}

*────────────────*
✅ *SISTEMA AGGIORNATO CON SUCCESSO*`.trim()

    await conn.sendMessage(m.chat, { 
        text: message,
        contextInfo: {
            externalAdReply: {
                title: 'ᴇʟɪxɪʀ sᴇᴄᴜʀɪᴛʏ: sʏsᴛᴇm sʏɴᴄ',
                body: 'Il bot è ora all\'ultima versione disponibile',
                thumbnailUrl: 'https://qu.ax', 
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: false
            }
        }
    }, { quoted: m })
    
    await m.react('🍥')

  } catch (err) {
    await m.react('❌')
    await conn.reply(m.chat, `*───「 UPDATE ERROR 」───*\n\n\`\`\`${err.message}\`\`\`\n\n*────────────────*`, m)
  }
}

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
handler.rowner = true

export default handler
