// Plug-in creato da elixir
const database = [
    { city: "Parigi", img: "https://wikimedia.org" },
    { city: "Roma", img: "https://wikimedia.org" },
    { city: "Londra", img: "https://wikimedia.org" },
    { city: "New York", img: "https://wikimedia.org" },
    { city: "Pisa", img: "https://wikimedia.org" },
    { city: "Tokyo", img: "https://wikimedia.org" },
    { city: "Venezia", img: "https://wikimedia.org" }
];

let handler = async (m, { conn, command }) => {
    conn.geoguesser = conn.geoguesser || {};

    if (command === 'geoguesser') {
        if (conn.geoguesser[m.chat]) return m.reply("`⚠️ Hai già una sfida attiva!`");

        const target = database[Math.floor(Math.random() * database.length)];
        
        conn.geoguesser[m.chat] = {
            answer: target.city.toLowerCase(),
            startTime: Date.now()
        };

        try {
            await conn.sendMessage(m.chat, { 
                image: { url: target.img }, 
                caption: `🌍 *GEOGUESSER: IL MONDO* 🌍\n\nIn quale città ci troviamo?\n⏱️ Rispondi entro 60 secondi!` 
            }, { quoted: m });
        } catch (e) {
            delete conn.geoguesser[m.chat];
            return m.reply("`❌ Errore nel caricamento dell'immagine. Riprova.`");
        }
    }
}

handler.before = async (m) => {
    if (!m.text || !global.conn.geoguesser || !global.conn.geoguesser[m.chat]) return;
    let game = global.conn.geoguesser[m.chat];

    if (Date.now() - game.startTime > 60000) {
        delete global.conn.geoguesser[m.chat];
        return m.reply(`⏱️ *Tempo scaduto!* La risposta era *${game.answer.toUpperCase()}*.`);
    }

    if (m.text.toLowerCase().trim() === game.answer) {
        delete global.conn.geoguesser[m.chat];
        return m.reply(`🎉 *Esatto!* Era proprio *${game.answer.toUpperCase()}*!`);
    }
}

handler.help = ['geoguesser'];
handler.tags = ['game'];
handler.command = /^(geoguesser)$/i;

export default handler;
