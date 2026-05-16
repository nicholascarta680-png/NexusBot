// Plug-in creato da elixir

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let handler = async (m, { conn, mentionedJid }) => {

    const prefix = '.';

    // ====================== MENU ======================

    if (m.text.toLowerCase() === prefix + 'darkweb' || m.text.toLowerCase() === prefix + 'dw') {

        await conn.sendMessage(m.chat, {
            text:
`🌌 *NEURAL DARKWEB v6.2*
┌─────────────────────────────┐
│     LIVELLO VII — ACCESSO   │
└─────────────────────────────┘

⚠️ Tutto ciò che vedi è totalmente finto, VISIVO e creato esclusivamente per divertimento.
Non esegue davvero hacking, accessi, tracciamenti o attività reali.

*Puoi usare i comandi sia taggando una persona che rispondendo ad un messaggio.*

*Esempi:*
🜁 .hack @persona
🜁 (rispondi a un messaggio) .hack

*Comandi:*
🜁 .hack
🜁 .dox
🜁 .breach
🜁 .trace
🜁 .intel
🜁 .shadow
🜁 .blackmail
🜁 .phish
🜁 .ransomware
🜁 .deepfake
🜁 .reputation
🜁 .anon <messaggio>`
        });

        return;
    }

    // ====================== TARGET ======================

    let target =
        mentionedJid?.[0] ||
        m.quoted?.sender ||
        m.quoted?.participant ||
        null;

    const isAnon = m.text.toLowerCase().startsWith(prefix + 'anon');

    if (!target && !isAnon) {
        return conn.reply(
            m.chat,
            "❯ Tagga una persona oppure rispondi ad un messaggio.",
            m
        );
    }

    const name = target ? `@${target.split('@')[0]}` : "";

    // ====================== .HACK ======================

    if (m.text.toLowerCase().startsWith(prefix + 'hack')) {

        await conn.sendMessage(m.chat, {
            text: `🌐 *Stabilizzando connessione attraverso 12 proxy quantici...*`
        });

        await delay(1800);

        await conn.sendMessage(m.chat, {
            text: `🔓 *Bypassando firewall di primo livello...* [▓▓▓▓▓░░░░░] 48%`
        });

        await delay(2000);

        await conn.sendMessage(m.chat, {
            text: `🕸️ *Penetrando nel kernel del dispositivo target...*`
        });

        await delay(2300);

        await conn.sendMessage(m.chat, {
            text: `📡 *Estraendo dati dalla memoria cache e cronologia...*`
        });

        await delay(2800);

        await conn.sendMessage(m.chat, {
            text: `🔍 *Analizzando pattern comportamentali e file nascosti...*`
        });

        await delay(2500);

        await conn.sendMessage(m.chat, {
            text:
`🌑 *HACK CONCLUSO CON SUCCESSO*

${name}, abbiamo scoperto che hai una cartella segreta chiamata “Non guardare”.
Contiene screenshot di chat, messaggi non inviati e ricerche che non vorresti far sapere a nessuno.

Inoltre, passi molto tempo a rileggere conversazioni vecchie di mesi.

🜁 Tutte le tracce sono state cancellate dal sistema.

⚠️ Simulazione VISIVA — nessun hacking reale.`,
            mentions: [target]
        });
    }

    // ====================== .DOX ======================

    if (m.text.toLowerCase().startsWith(prefix + 'dox')) {

        await conn.sendMessage(m.chat, {
            text: `🕵️ *Avviando protocollo OSINT completo...*`
        });

        await delay(2000);

        await conn.sendMessage(m.chat, {
            text: `📍 *Mappatura identità digitale e impronte sociali...*`
        });

        await delay(2200);

        await conn.sendMessage(m.chat, {
            text: `🔍 *Analisi psicologica e vulnerabilità emotive...*`
        });

        await delay(2600);

        await conn.sendMessage(m.chat, {
            text:
`🌫️ *DOXXING TERMINATO*

${name} presenta un’immagine forte e sicura di sé sui social, ma in realtà ha un forte bisogno di approvazione esterna.
Cambia spesso bio e foto alla ricerca della versione “perfetta” di sé.

Punto debole principale: paura dell’abbandono.

🜁 Dossier completato.

⚠️ Contenuto finto e solo a scopo di divertimento.`,
            mentions: [target]
        });
    }

    // ====================== .BREACH ======================

    if (m.text.toLowerCase().startsWith(prefix + 'breach')) {

        await conn.sendMessage(m.chat, {
            text: `☢️ *Iniziando Data Breach su vasta scala...*`
        });

        await delay(2300);

        await conn.sendMessage(m.chat, {
            text: `🗄️ *Accedendo ai backup cloud e server secondari...*`
        });

        await delay(2500);

        await conn.sendMessage(m.chat, {
            text: `📂 *Estraendo messaggi, foto, note vocali e cronologia...*`
        });

        await delay(3000);

        await conn.sendMessage(m.chat, {
            text:
`💥 *DATA BREACH COMPLETATO*

Abbiamo estratto migliaia di messaggi di ${name}.
Risulta che ha detto “ti amo” o “mi manchi” a più persone di quante voglia ammettere.

Ci sono anche conversazioni che credeva fossero state cancellate.

🜁 Il Darkweb ora possiede questi dati.

⚠️ Simulazione puramente visiva.`,
            mentions: [target]
        });
    }

    // ====================== .BLACKMAIL ======================

    if (m.text.toLowerCase().startsWith(prefix + 'blackmail')) {

        await conn.sendMessage(m.chat, {
            text: `🖤 *Raccolta di leverage compromettente in corso...*`
        });

        await delay(2800);

        await conn.sendMessage(m.chat, {
            text:
`💀 *BLACKMAIL PROTOCOL READY*

${name}, abbiamo materiale sufficiente per distruggere la tua immagine pubblica.

Screenshot, messaggi privati, ricerche imbarazzanti e deepfake pronti.

Vuoi davvero che tutto questo venga reso pubblico?

⚠️ Tutto fake e solo per divertimento.`,
            mentions: [target]
        });
    }

    // ====================== .DEEPFAKE ======================

    if (m.text.toLowerCase().startsWith(prefix + 'deepfake')) {

        await conn.sendMessage(m.chat, {
            text: `🎥 *Generando modello facciale IA...*`
        });

        await delay(2200);

        await conn.sendMessage(m.chat, {
            text: `🧠 *Addestrando voce e movimenti...*`
        });

        await delay(3000);

        await conn.sendMessage(m.chat, {
            text:
`🌀 *DEEPFAKE GENERATO CON SUCCESSO*

Abbiamo creato un video di ${name} che dice e fa cose estremamente compromettenti.
Sembra assolutamente reale.

Vuoi che venga distribuito nel Darkweb?

⚠️ Simulazione VISIVA — nessun contenuto reale.`,
            mentions: [target]
        });
    }

    // ====================== .RANSOMWARE ======================

    if (m.text.toLowerCase().startsWith(prefix + 'ransomware')) {

        await conn.sendMessage(m.chat, {
            text: `🔒 *Distribuendo Ransomware crittografato...*`
        });

        await delay(2600);

        await conn.sendMessage(m.chat, {
            text:
`💰 *RANSOMWARE ATTIVATO*

Tutti i file, foto e chat di ${name} sono stati crittografati.

Pagamento richiesto in Monero entro 48 ore, altrimenti i dati verranno pubblicati.

⚠️ Tutto completamente finto e visivo.`,
            mentions: [target]
        });
    }

    // ====================== .PHISH ======================

    if (m.text.toLowerCase().startsWith(prefix + 'phish')) {

        await conn.sendMessage(m.chat, {
            text: `🎣 *Preparando attacco di Phishing personalizzato...*`
        });

        await delay(2500);

        await conn.sendMessage(m.chat, {
            text:
`🪝 *PHISHING COMPLETATO*

${name} ha cliccato sul link e inserito le sue credenziali.

Accesso a tutti gli account acquisito (simulazione).

⚠️ Nessun dato reale viene raccolto.`,
            mentions: [target]
        });
    }

    // ====================== .REPUTATION ======================

    if (m.text.toLowerCase().startsWith(prefix + 'reputation')) {

        await conn.sendMessage(m.chat, {
            text: `📊 *Analizzando reputazione nel Deep Web...*`
        });

        await delay(2400);

        await conn.sendMessage(m.chat, {
            text:
`🜁 *REPUTATION REPORT*

${name} è percepito come persona instabile, bisognosa di attenzioni e poco affidabile.

Rischio sociale: **Alto**

Consigliato: stare lontani.

⚠️ Report totalmente inventato per divertimento.`,
            mentions: [target]
        });
    }

    // ====================== .ANON ======================

    if (m.text.toLowerCase().startsWith(prefix + 'anon')) {

        const msg = m.text.split(' ').slice(1).join(' ');

        if (!msg)
            return conn.reply(
                m.chat,
                "❯ `.anon scrivi qui il messaggio`",
                m
            );

        await conn.sendMessage(m.chat, {
            text: `🕶️ *Instradando messaggio attraverso 9 nodi TOR...*`
        });

        await delay(2800);

        await conn.sendMessage(m.chat, {
            text:
`🌑 *MESSAGGIO DAL LIVELLO VII DEL DARKWEB*

"${msg}"

— Ombra Sconosciuta • Livello VII

⚠️ Messaggio anonimo simulato, solo VISIVO.`
        });
    }
};

handler.help = ['darkweb'];

handler.tags = ['fun'];

handler.command =
/^(darkweb|dw|hack|dox|breach|trace|intel|shadow|blackmail|phish|ransomware|deepfake|reputation|anon)$/i;

handler.group = true;

export default handler;
