// Plug-in creato da elixir
let handler = async (m, { conn, participants }) => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
   
    const victim = participants[Math.floor(Math.random() * participants.length)].id;
    const victimMention = `@${victim.split('@')[0]}`;
    
    await conn.sendMessage(m.chat, {
        text: "🚨 *ALLERTA SISTEMA* 🚨\n\n" +
              "☢️ Protocollo Quantum avviato dall'operatore.\n" +
              "🔍 Ricerca di un soggetto compatibile nel gruppo..."
    }, { quoted: m });

    await delay(2000);
    await conn.sendMessage(m.chat, {
        text: `🎯 *TARGET ACQUISITO*\n\n` +
              `👤 Soggetto individuato: ${victimMention}\n` +
              `⚡ Caricamento sovraccarico neurale... [🔋 35%]`,
        mentions: [victim]
    });

    await delay(2000);
    await conn.sendMessage(m.chat, {
        text: `🧬 *INIEZIONE IN CORSO*\n\n` +
              `☣️ Alterazione del codice genetico di ${victimMention}...\n` +
              `⚙️ Modifica permessi cerebrali... [🔋 70%]`,
        mentions: [victim]
    });

    await delay(2000);
   
    const scherzi = [
        `${victimMention} è una patetica delusione umana. Un errore della natura che respira solo per far soffrire chi gli sta intorno.`,

        `${victimMention} è un fallimento genetico. Tua madre avrebbe dovuto ingoiarti e risparmiarci questa vergogna.`,

        `${victimMention} è un pezzo di merda ambulante. Nessuno ti vuole bene, ti sopportano solo per pietà.`,

        `${victimMention} non vale nemmeno la saliva per sputarci sopra. Un essere inutile e vuoto.`,

        `${victimMention} ha il QI di una scarpa e la personalità di un preservativo usato.`,

        `${victimMention} è la puttana del gruppo. Tutti ti usano e poi ti buttano via come uno straccio.`,

        `${victimMention} è un aborto vivente. La tua esistenza è un insulto per l’umanità.`,

        `${victimMention} è così brutto/a che quando piangi le lacrime ti girano intorno alla faccia.`,

        `${victimMention} è irrilevante, noioso/a e una perdita di ossigeno. Scompari.`,

        `${victimMention} è la prova che Dio a volte sbaglia di brutto.`,

        `${victimMention} hai la faccia che sembra un incidente tra un maiale e un cassonetto.`,

        `${victimMention} sei così inutile che se fossi un virus ti avrebbero già estinto.`,

        `${victimMention} tua madre piange ogni notte per aver partorito una cosa del genere.`,

        `${victimMention} sei vuoto/a dentro come la tua testa. Solo aria fritta e delusioni.`,

        `${victimMention} sei la ragione per cui alcuni padri scappano dopo il parto.`,

        `${victimMention} hai il carisma di una vongola morta e l’intelligenza di un sasso.`,

        `${victimMention} sei così brutto/a che ti guardano solo per pietà o per ridere.`,

        `${victimMention} sei un rifiuto della società, un errore che cammina.`,

        `${victimMention} nessuno ti amerà mai davvero, sei troppo tossico/a e patetico/a.`,

        `${victimMention} fai schifo in tutto: faccia, carattere, intelligenza e vita.`,

        `${victimMention} sei come la diarrea: esci quando non ti vuole nessuno.`,

        `${victimMention} la tua vita è un meme triste che nessuno salva.`,

        `${victimMention} sei nato/a per deludere chiunque abbia la sfortuna di conoscerti.`,

        `${victimMention} hai meno valore di un profilattico scaduto.`,

        `${victimMention} sei il motivo per cui l’adozione dovrebbe essere retroattiva.`,

        `${victimMention} sei brutto/a fuori quanto marcio/a dentro.`,

        `${victimMention} la tua personalità fa vomitare anche i cani randagi.`,

        `${victimMention} sei un fallimento ambulante con le gambe.`,

        `${victimMention} ti guardano e pensano: "meno male che i preservativi esistono".`,

        `${victimMention} sei così inutile che nemmeno l’inferno ti vuole.`,

        `${victimMention} hai la profondità emotiva di una pozzanghera.`,

        `${victimMention} sei patetico/a, solo e disperato/a dentro.`,

        `${victimMention} la tua esistenza è una battuta di cattivo gusto.`,

        `${victimMention} sei la versione umana di un errore di sistema.`,

        `${victimMention} nessuno sentirà la tua mancanza quando sparirai.`,

        `${victimMention} sei un cumulo di insicurezze e bruttezza.`,

        `${victimMention} fai pena, rabbia e schifo allo stesso tempo.`,

        `${victimMention} sei il tipo di persona che giustifica l’eutanasia.`,

        `${victimMention} hai la faccia che sembra pestata da un camion.`,

        `${victimMention} sei un essere umano di serie Z, scarto di fabbrica.`,

        `${victimMention} tua madre si vergogna ogni volta che ti guarda.`,

        `${victimMention} sei vuoto/a, inutile e profondamente deludente.`,

        `${victimMention} sei la prova vivente che si può fallire anche solo esistendo.`,

        `${victimMention} ti odio tutti ma nessuno te lo dice in faccia.`,

        `${victimMention} sei così falso/a che nemmeno il tuo riflesso ti sopporta.`,

        `${victimMention} la tua vita è un fallimento continuo con la colonna sonora triste.`,

        `${victimMention} sei un tossico emotivo che rovina tutto quello che tocca.`,

        `${victimMention} non vali nemmeno il tempo che ci vuole per insultarti.`,

        `${victimMention} sei una merda di persona e lo rimarrai per sempre.`
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

handler.help = ['avviaprotocollo'];
handler.tags = ['giochi'];
handler.command = /^(avviaprotocollo)$/i;
handler.group = true;
export default handler;
