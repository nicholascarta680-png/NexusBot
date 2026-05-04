import { performance } from "perf_hooks";

let handler = async (m, { conn, text }) => {
    let destinatario;

    if (m.quoted && m.quoted.sender) {
        destinatario = m.quoted.sender;
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        destinatario = m.mentionedJid[0];
    } else {
        return m.reply("`[!]` Tagga qualcuno o rispondi a un messaggio per iniziare.");
    }

    let nomeDestinatario = `@${destinatario.split('@')[0]}`;
    
    // --- SEQUENZA RAPIDA ---
    let sequenza = [
        `*───「 🔞 LOADING 」───*\n\n*Inizio a segarmi su:* ${nomeDestinatario} 🥵\n*Stato:* \`Iniezione...\`\n\n*────────────────*`,
        `*───「 🍆 STATUS 」───*\n\n*Mi sta pulsando forte...* 🍌\n*Caricamento:* \`[████████▒▒] 85%\`\n\n*────────────────*`,
        `*───「 💦 WARNING 」───*\n\n*PREPARATI ALLA SBORRATA!* 💦💦\n*Stato:* \`Pressione Massima\`\n\n*────────────────*`
    ];

    // Invio immediato di tutta la sequenza
    for (let msg of sequenza) {
        conn.sendMessage(m.chat, { text: msg, mentions: [destinatario] });
    }

    // Calcolo tempo (simulato per lo stile)
    let elapsedTime = (Math.random() * 400 + 100).toFixed(2);

    // --- RISULTATO FINALE ELEGANTE ---
    let resultMessage = `┏─━─━─━  〔 🥛 〕  ━─━─━─┓
     *MISSIONE COMPIUTA*
┗─━─━─━─━─━─━─━─━─┛

◈ *Target:* ${nomeDestinatario}
◈ *Stato:* \`Completamente Imbiancato/a\` 🤤
◈ *Tempo:* \`${elapsedTime}ms\`

> ✨ *Blood ha goduto tantissimo, mi hai fatto venire subito!* 😏`.trim();

    conn.sendMessage(m.chat, { 
        text: resultMessage, 
        mentions: [destinatario],
        contextInfo: {
            externalAdReply: {
                title: 'ʙʟᴏᴏᴅ ᴇxᴘʟᴏɪᴛ: sᴘᴇʀᴍ-ʟᴏᴀᴅ',
                body: 'Target neutralizzato con successo',
                thumbnailUrl: 'https://qu.ax', 
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });
};

handler.command = /^(sborralo|sborrala)$/i;
handler.help = ['sborralo', 'sborrala'];  
handler.tags = ['giochi']; 
export default handler;
