// Plug-in creato da elixir
let handler = async (m, { conn, participants }) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    
    // Seleziona un membro casuale del gruppo
    const victim = participants[Math.floor(Math.random() * participants.length)].id;
    const victimMention = `@${victim.split('@')[0]}`;

    // 1. Messaggio di avvio
    await conn.sendMessage(m.chat, { 
        text: "🚨 *ALLERTA SISTEMA* 🚨\n\n" +
              "☢️ Protocollo Quantum avviato dall'operatore.\n" +
              "🔍 Ricerca di un soggetto compatibile nel gruppo..." 
    }, { quoted: m });

    // Step 1: Target agganciato (Attesa 2 secondi)
    await delay(2000);
    await conn.sendMessage(m.chat, {
        text: `🎯 *TARGET ACQUISITO*\n\n` +
              `👤 Soggetto individuato: ${victimMention}\n` +
              `⚡ Caricamento sovraccarico neurale... [🔋 35%]`,
        mentions: [victim]
    });

    // Step 2: Iniezione (Attesa 2 secondi)
    await delay(2000);
    await conn.sendMessage(m.chat, {
        text: `🧬 *INIEZIONE IN CORSO*\n\n` +
              `☣️ Alterazione del codice genetico di ${victimMention}...\n` +
              `⚙️ Modifica permessi cerebrali... [🔋 70%]`,
        mentions: [victim]
    });

    // Step 3: Conclusione (Attesa 2 secondi)
    await delay(2000);
    
    const scherzi = [
        `Trasformazione completata. ${victimMention} è ora ufficialmente un *Criceto Spaziale* 🐹. Per i prossimi 10 minuti può rispondere solo con 'Squitt!'`,
        `Bypass rushed. Ho appena hackerato lo smartphone di ${victimMention}. Ho ordinato 45 pizze all'ananas a suo nome 🍍🍕. Prego.`,
        `Mutazione eseguita. ${victimMention} è stato declassato a *Membro Inutile del Gruppo* 🗑️. Ogni sua opinione da questo momento è legalmente non valida.`,
        `Esplosione quantistica! ${victimMention} è stato teletrasportato in una dimensione parallela 🌌. Se invia messaggi nelle prossime ore, fate finta di non vederlo.`
    ];
    const scherzoScelto = scherzi[Math.floor(Math.random() * scherzi.length)];

    const finalOutput = `💥 *PROTOCOLLO QUANTUM COMPLETATO* 💥\n\n` +
                        `💀 *Vittima:* ${victimMention}\n` +
                        `───────────────────────\n` +
                        `${scherzoScelto}`;

    await conn.sendMessage(m.chat, {
        text: finalOutput,
        mentions: [victim]
    });
};

// Configurazione dei metadati del plugin per il tuo framework
handler.help = ['avviaprotocollo'];
handler.tags = ['giochi'];
handler.command = /^(avviaprotocollo)$/i;
handler.group = true; // Funziona solo nei gruppi per estrarre la vittima

export default handler;
