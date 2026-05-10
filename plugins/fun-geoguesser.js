// Plug-in creato da elixir
import axios from 'axios'

// --- TOKEN MAPILLARY ---
const MAPILLARY_TOKEN = 'MLY|26877937418527822|10e8ee4fc2bfbea18f0aabe02b247835';

// Database di luoghi per il test
const locations = [
    { name: "Parigi", lat: 48.8566, lng: 2.3522, hint: "Torre Eiffel e croissant" },
    { name: "Tokyo", lat: 35.6762, lng: 139.6503, hint: "Sushi e neon ovunque" },
    { name: "Londra", lat: 51.5074, lng: -0.1278, hint: "Big Ben e pioggia" },
    { name: "Milano", lat: 45.4642, lng: 9.1900, hint: "Duomo e moda" },
    { name: "Roma", lat: 41.9028, lng: 12.4964, hint: "Colosseo e carbonara" },
    { name: "New York", lat: 40.7128, lng: -74.0060, hint: "Statua della Libertà" }
];

let handler = async (m, { conn, command }) => {
    conn.geoguesser = conn.geoguesser || {};

    if (command === 'geoguesser') {
        if (conn.geoguesser[m.chat]) return m.reply("`⚠️ C'è già una sfida attiva! Indovina o aspetta che scada.`");

        const target = locations[Math.floor(Math.random() * locations.length)];
        
        try {
            // URL Corretto per la ricerca immagini (graph.mapillary.com)
            const searchUrl = `https://mapillary.com{MAPILLARY_TOKEN}&closeto=${target.lng},${target.lat}&fields=id&limit=1`;
            const response = await axios.get(searchUrl);

            if (!response.data || !response.data.data || response.data.data.length === 0) {
                return m.reply("`❌ Nessuna immagine disponibile per questa località. Riprova!`");
            }

            const imageId = response.data.data[0].id;

            // URL Corretto per ottenere l'anteprima dell'immagine
            const thumbUrl = `https://mapillary.com{imageId}?access_token=${MAPILLARY_TOKEN}&fields=thumb_1024_url`;
            const thumbRes = await axios.get(thumbUrl);
            const imageUrl = thumbRes.data.thumb_1024_url;

            conn.geoguesser[m.chat] = {
                answer: target.name.toLowerCase(),
                hint: target.hint,
                startTime: Date.now()
            };

            let caption = `🌍 *GEOGUESSER - CHALLENGE* 🌍\n\n`
            caption += `Riconosci questo luogo?\n`
            caption += `💡 *Indizio:* ${target.hint}\n\n`
            caption += `⏱️ Rispondi scrivendo il nome della città entro 60 secondi!`

            return conn.sendMessage(m.chat, { image: { url: imageUrl }, caption }, { quoted: m });

        } catch (e) {
            console.error("Errore API Mapillary:", e.response ? e.response.data : e.message);
            return m.reply("`❌ Errore di connessione alle API di Mapillary.`");
        }
    }
}

handler.before = async (m) => {
    if (!m.text || !global.conn.geoguesser || !global.conn.geoguesser[m.chat]) return;
    let game = global.conn.geoguesser[m.chat];

    // Scadenza dopo 60 secondi
    if (Date.now() - game.startTime > 60000) {
        delete global.conn.geoguesser[m.chat];
        return m.reply(`⏱️ *Tempo scaduto!* La risposta corretta era *${game.answer.toUpperCase()}*.`);
    }

    let input = m.text.toLowerCase().trim();
    if (input === game.answer) {
        delete global.conn.geoguesser[m.chat];
        return m.reply(`🎉 *Esatto!* Hai un ottimo spirito d'osservazione, era proprio *${input.toUpperCase()}*!`);
    }
}

handler.help = ['geoguesser']
handler.tags = ['game']
handler.command = /^(geoguesser)$/i

export default handler
