// Plug-in creato da elixir
import axios from 'axios'

let handler = async (m, { conn, command }) => {
    conn.geoguesser = conn.geoguesser || {};

    if (command === 'geoguesser') {
        if (conn.geoguesser[m.chat]) return m.reply("`⚠️ Finisci prima la sfida precedente!`");

        // Lista di città iconiche per la ricerca
        const cities = ["Roma", "Parigi", "New York", "Tokyo", "Londra", "Venezia", "Berlino", "Barcellona", "Sidney", "Dubai"];
        const selected = cities[Math.floor(Math.random() * cities.length)];
        
        // Usiamo l'URL di Unsplash che genera una foto casuale basata sulla città
        const imgUrl = `https://unsplash.com{selected},city,landscape`;

        conn.geoguesser[m.chat] = {
            answer: selected.toLowerCase(),
            startTime: Date.now()
        };

        let caption = `🌍 *GEOGUESSER ONLINE* 🌍\n\n`
        caption += `Riconosci questa splendida città?\n`
        caption += `⏱️ Scrivi il nome della città entro 60 secondi!`

        return conn.sendMessage(m.chat, { image: { url: imgUrl }, caption }, { quoted: m });
    }
}

handler.before = async (m) => {
    if (!m.text || !global.conn.geoguesser || !global.conn.geoguesser[m.chat]) return;
    let game = global.conn.geoguesser[m.chat];

    // Controllo tempo
    if (Date.now() - game.startTime > 60000) {
        delete global.conn.geoguesser[m.chat];
        return m.reply(`⏱️ *Tempo scaduto!* Era *${game.answer.toUpperCase()}*.`);
    }

    let input = m.text.toLowerCase().trim();
    if (input === game.answer) {
        delete global.conn.geoguesser[m.chat];
        return m.reply(`🎉 *VITTORIA!* Hai indovinato, era proprio *${input.toUpperCase()}*!`);
    }
}

handler.help = ['geoguesser']
handler.tags = ['game']
handler.command = /^(geoguesser)$/i

export default handler
