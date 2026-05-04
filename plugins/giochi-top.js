// Plug-in creato da elixir
import fetch from 'node-fetch'

let user = a => '@' + a.split('@')[0]

async function handler(m, { groupMetadata, command, conn, text, usedPrefix }) {
  if (!text) return conn.reply(m.chat, `❀ \`Scrivi qualcosa!\`\n\n\`Esempio:\`\n- ${usedPrefix + command} *ratti*`, m)

  let ps = groupMetadata.participants.map(v => v.id)
  let shuffled = ps.sort(() => Math.random() - 0.5)
  let top10 = shuffled.slice(0, 10)

  const emoji = await getEmojiFromGemini(text)

  let title = `\`Top 10 ${text}\` 『 ${emoji} 』\n\n` +
    top10.map((u, i) => `*${i + 1}. ${user(u)}*`).join('\n')

  // Fix Menzioni: Usiamo sendMessage con l'oggetto mentions integrato
  await conn.sendMessage(m.chat, {
    text: title,
    mentions: top10 // Questo attiva l'evidenziazione dei tag
  }, { quoted: m })
}

handler.help = ['top <testo>']
handler.command = ['top']
handler.tags = ['giochi']
handler.group = true
handler.admin = true
export default handler

async function getEmojiFromGemini(topic) {
  const apiKey = global.APIKeys?.google
  if (!apiKey || apiKey === 'REGISTRATISUGOOGLECLOUDNEGRO') {
    return pickRandom(['✨', '🔥', '🌟', '🎯', '🌈', '💥', '🥇', '⚡'])
  }

  try {
    const prompt = `Sei un esperto di emoji. Per una classifica su "${topic}", rispondi solo e unicamente con una o al massimo due emoji appropriate. Non includere testo, spiegazioni o punteggiatura.`
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 10 }
        })
      }
    )

    const data = await response.json()
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    return result || '‼️'
  } catch (e) {
    return pickRandom(['✨', '🔥', '🌟', '🎯', '🌈', '💥', '🥇', '⚡'])
  }
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}
