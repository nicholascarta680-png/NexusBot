import fetch from 'node-fetch'
import { FormData } from 'formdata-node'
import { createCanvas, loadImage } from 'canvas'
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const __dirname = path.resolve()
const execPromise = promisify(exec)

// Utility per gestire lo stream audio
function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

// Utility per dividere il testo in righe
function splitText(text, maxLength) {
  const words = text.split(' ')
  const lines = []
  let currentLine = ''
  words.forEach(word => {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  })
  if (currentLine) lines.push(currentLine)
  return lines
}

async function generateImage(prompt) {
  const enhancedPrompt = `Professional TV news studio, modern desk, high-tech background, 4k`
  const encodedPrompt = encodeURIComponent(enhancedPrompt)
  return `https://pollinations.ai{encodedPrompt}?width=1280&height=720&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`
}

async function createNewsImage(newsTitle, backgroundUrl) {
  const canvas = createCanvas(1280, 720)
  const ctx = canvas.getContext('2d')
  
  // Caricamento immagine con fallback
  const image = await loadImage(backgroundUrl).catch(() => { 
    throw new Error('Errore nel caricamento del background da Pollinations') 
  })
  
  ctx.drawImage(image, 0, 0, 1280, 720)
  
  // Overlay Ticker
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
  ctx.fillRect(0, 560, 1280, 160)
  
  // Barra Breaking News
  ctx.fillStyle = '#CC0000'
  ctx.fillRect(0, 560, 1280, 50)
  
  // Testo Notizia (usa Sans-serif per compatibilità universale)
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 40px sans-serif'
  ctx.textAlign = 'left'
  const lines = splitText(newsTitle.toUpperCase(), 45)
  lines.slice(0, 2).forEach((line, i) => ctx.fillText(line, 40, 630 + i * 50))
  
  // Data e Ora
  const now = new Date()
  const newsTime = now.toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  ctx.font = '25px sans-serif'
  ctx.fillText(newsTime, 40, 700)
  
  // Branding
  ctx.font = 'bold 30px sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText('VAREBOT NEWS 24', 1240, 700)
  
  return canvas.toBuffer('image/jpeg')
}

async function uploadImage(buffer) {
  const formData = new FormData()
  formData.append('key', '8ef100e30039c258e3029366f3af03c8')
  formData.append('image', buffer.toString('base64'))
  
  const response = await fetch('https://imgbb.com', {
    method: 'POST',
    body: formData
  })
  const json = await response.json()
  if (!json.success) throw new Error(json.error?.message || 'Errore ImgBB')
  return json
}

async function createNewsAudio(newsTitle) {
  const tempDir = path.join(__dirname, 'temp')
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)
  
  const ttsFile = path.join(tempDir, `tts_${Date.now()}.mp3`)
  const finalAudioFile = path.join(tempDir, `final_${Date.now()}.mp3`)
  const bgAudioPath = path.join(__dirname, 'media/audio/tg.mp3')
  
  const tts = new MsEdgeTTS()
  await tts.setMetadata('it-IT-GianniNeural', OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3)
  const result = await tts.toStream(newsTitle)
  const ttsBuffer = await streamToBuffer(result.audioStream)
  fs.writeFileSync(ttsFile, ttsBuffer)
  
  // Se il file di sottofondo non esiste, invia solo il TTS
  if (!fs.existsSync(bgAudioPath)) {
    return { ttsFile, finalAudioFile: ttsFile }
  }
  
  await execPromise(`ffmpeg -i "${ttsFile}" -i "${bgAudioPath}" -filter_complex "[1:a]volume=0.2[a1];[0:a][a1]amix=inputs=2:duration=first" -c:a mp3 "${finalAudioFile}"`)
  
  return { ttsFile, finalAudioFile }
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*⚠️ Inserisci il titolo della notizia*\n\n*Esempio:* ${usedPrefix + command} Incredibile scoperta a Varese!`
  
  try {
    await m.reply('🎥 *Generazione in corso...*')
    
    const newsTitle = text.slice(0, 100)
    const backgroundUrl = await generateImage(newsTitle)
    const imgBuffer = await createNewsImage(newsTitle, backgroundUrl)
    
    // Upload e invio immagine
    const uploadData = await uploadImage(imgBuffer)
    await conn.sendFile(m.chat, uploadData.data.url, 'news.jpg', `🔴 *BREAKING NEWS*\n\n${newsTitle}\n\n> vare ✧ bot`, m)
    
    // Generazione e invio audio
    const { ttsFile, finalAudioFile } = await createNewsAudio(newsTitle)
    await conn.sendFile(m.chat, finalAudioFile, 'news.mp3', null, m, true, { mimetype: 'audio/mp4', ptt: true })
    
    // Pulizia file temporanei
    if (fs.existsSync(ttsFile)) fs.unlinkSync(ttsFile)
    if (fs.existsSync(finalAudioFile) && finalAudioFile !== ttsFile) fs.unlinkSync(finalAudioFile)
    
  } catch (error) {
    console.error(error)
    await m.reply(`*❌ Errore:* ${error.message}`)
  }
}

handler.help = ['tg <testo>']
handler.tags = ['giochi']
handler.command = /^(tg|telegiornale|news)$/i
handler.group = true

export default handler
