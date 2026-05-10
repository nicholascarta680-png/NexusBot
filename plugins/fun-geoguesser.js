// Plug-in creato da elixir
const locations = [
    { name: "Parigi", img: "https://googleusercontent.com", hint: "La città dell'amore e della Torre Eiffel" },
    { name: "Tokyo", img: "https://googleusercontent.com", hint: "Neon, sushi e il quartiere di Shibuya" },
    { name: "New York", img: "https://googleusercontent.com", hint: "La città che non dorme mai, guarda i taxi gialli" },
    { name: "Roma", img: "https://googleusercontent.com", hint: "Storia antica, Colosseo e ottima pasta" },
    { name: "Londra", img: "https://googleusercontent.com", hint: "Big Ben, cabine telefoniche rosse e pioggia" },
    { name: "Pisa", img: "https://googleusercontent.com", hint: "C'è una torre che sta per cadere..." }
];

let handler = async (m, { conn, command }) => {
    conn.geoguesser = conn.geoguesser || {};

    if (command === 'geoguesser') {
        if (conn.geoguesser[m.chat]) return m.reply("`⚠️ Finisci prima la sfida precedente!`");

        const target = locations[Math.floor(Math.random() * locations.length)];
        
        conn.geoguesser[m.chat] = {
            answer: target.name.toLowerCase(),
            hint: target.hint,
            startTime: Date.now()
        };

        let caption = `🌍 *GEOGUESSER - WORLD CHALLENGE* 🌍\n\n`
        caption += `Dove è stata scattata questa foto di Street View?\n`
        caption += `💡 *Indizio:* ${target.hint}\n\n`
        caption += `⏱️ Rispondi col nome della città entro 60 secondi!`

        return conn.sendMessage(m.chat, { image: { url: target.img }, caption }, { quoted: m });
    }
}

handler.before = async (m) => {
    if (!m.text || !global.conn.geoguesser || !global.conn.geoguesser[m.chat]) return;
    let game = global.conn.geoguesser[m.chat];

    if (Date.now() - game.startTime > 60000) {
        delete global.conn.geoguesser[m.chat];
        return m.reply(`⏱️ *Tempo scaduto!* La risposta era *${game.answer.toUpperCase()}*.`);
    }

    let input = m.text.toLowerCase().trim();
    if (input === game.answer) {
        delete global.conn.geoguesser[m.chat];
        return m.reply(`🎉 *VITTORIA!* Hai indovinato: *${input.toUpperCase()}*!`);
    }
}

handler.help = ['geoguesser']
handler.tags = ['game']
handler.command = /^(geoguesser)$/i

export default handler
