let handler = async (m, { conn }) => {
  // Simuliamo dati che arriverebbero da Git
  const fakeFiles = [
    { name: 'plugins/main.js', ins: 12, del: 4 },
    { name: 'config.json', ins: 2, del: 0 }
  ]

  let reportFiles = fakeFiles.map((f, i) => {
    return `  *FILE #${i + 1}*
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
}

handler.command = ['testupdate'] // Digita .testupdate in chat
export default handler
