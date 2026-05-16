// Plug-in creato da elixir

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let handler = async (m, { conn, mentionedJid }) => {
    const prefix = '.';

    // ====================== MENU ======================
    if (m.text.toLowerCase() === prefix + 'darkweb' || m.text.toLowerCase() === prefix + 'dw') {
        await conn.sendMessage(m.chat, {
            text: `🌌 *NEURAL DARKWEB v6.2*\n` +
                  `┌─────────────────────────────┐\n` +
                  `│     LIVELLO VII — ACCESSO   │\n` +
                  `└─────────────────────────────┘\n\n` +
                  `Sistema di hacking simulato più avanzato.\n\n` +
                  `*Comandi:*\n` +
                  `🜁 .hack @persona\n` +
                  `🜁 .dox @persona\n` +
                  `🜁 .breach @persona\n` +
                  `🜁 .trace @persona\n` +
                  `🜁 .intel @persona\n` +
                  `🜁 .shadow @persona\n` +
                  `🜁 .blackmail @persona\n` +
                  `🜁 .phish @persona\n` +
                  `🜁 .ransomware @persona\n` +
                  `🜁 .deepfake @persona\n` +
                  `🜁 .reputation @persona\n` +
                  `🜁 .anon <messaggio>`,
        });
        return;
    }

    const target = mentionedJid?.[0];
    if (!target && !m.text.toLowerCase().startsWith(prefix + 'anon')) {
        return conn.reply(m.chat, "❯ Per favore menziona una persona (@persona)", m);
    }
    const name = target ? `@${target.split('@')[0]}` : "";

    // ====================== .HACK ======================
    if (m.text.toLowerCase().startsWith(prefix + 'hack')) {
        await conn.sendMessage(m.chat, { text: `🌐 *Stabilizzando connessione attraverso 12 proxy quantici...*` });
        await delay(1800);
        await conn.sendMessage(m.chat, { text: `🔓 *Bypassando firewall di primo livello...* [▓▓▓▓▓░░░░░] 48%` });
        await delay(2000);
        await conn.sendMessage(m.chat, { text: `🕸️ *Penetrando nel kernel del dispositivo target...*` });
        await delay(2300);
        await conn.sendMessage(m.chat, { text: `📡 *Estraendo dati dalla memoria cache e cronologia...*` });
        await delay(2800);
        await conn.sendMessage(m.chat, { text: `🔍 *Analizzando pattern comportamentali e file nascosti...*` });
        await delay(2500);

        await conn.sendMessage(m.chat, {
            text: `🌑 *HACK CONCLUSO CON SUCCESSO*\n\n` +
                  `${name}, abbiamo scoperto che hai una cartella segreta chiamata “Non guardare”.\n` +
                  `Contiene screenshot di chat, messaggi non inviati e ricerche che non vorresti far sapere a nessuno.\n\n` +
                  `Inoltre, passi molto tempo a rileggere conversazioni vecchie di mesi.\n\n` +
                  `🜁 Tutte le tracce sono state cancellate dal sistema.`,
            mentions: [target]
        });
    }

    // ====================== .DOX ======================
    if (m.text.toLowerCase().startsWith(prefix + 'dox')) {
        await conn.sendMessage(m.chat, { text: `🕵️ *Avviando protocollo OSINT completo...*` });
        await delay(2000);
        await conn.sendMessage(m.chat, { text: `📍 *Mappatura identità digitale e impronte sociali...*` });
        await delay(2200);
        await conn.sendMessage(m.chat, { text: `🔍 *Analisi psicologica e vulnerabilità emotive...*` });
        await delay(2600);

        await conn.sendMessage(m.chat, {
            text: `🌫️ *DOXXING TERMINATO*\n\n` +
                  `${name} presenta un’immagine forte e sicura di sé sui social, ma in realtà ha un forte bisogno di approvazione esterna.\n` +
                  `Cambia spesso bio e foto alla ricerca della versione “perfetta” di sé.\n\n` +
                  `Punto debole principale: paura dell’abbandono.\n\n` +
                  `🜁 Dossier completato.`,
            mentions: [target]
        });
    }

    // ====================== .BREACH ======================
    if (m.text.toLowerCase().startsWith(prefix + 'breach')) {
        await conn.sendMessage(m.chat, { text: `☢️ *Iniziando Data Breach su vasta scala...*` });
        await delay(2300);
        await conn.sendMessage(m.chat, { text: `🗄️ *Accedendo ai backup cloud e server secondari...*` });
        await delay(2500);
        await conn.sendMessage(m.chat, { text: `📂 *Estraendo messaggi, foto, note vocali e cronologia...*` });
        await delay(3000);

        await conn.sendMessage(m.chat, {
            text: `💥 *DATA BREACH COMPLETATO*\n\n` +
                  `Abbiamo estratto migliaia di messaggi di ${name}.\n` +
                  `Risulta che ha detto “ti amo” o “mi manchi” a più persone di quante voglia ammettere.\n` +
                  `Ci sono anche conversazioni che credeva fossero state cancellate.\n\n` +
                  `🜁 Il Darkweb ora possiede questi dati.`,
            mentions: [target]
        });
    }

    // ====================== .BLACKMAIL ======================
    if (m.text.toLowerCase().startsWith(prefix + 'blackmail')) {
        await conn.sendMessage(m.chat, { text: `🖤 *Raccolta di leverage compromettente in corso...*` });
        await delay(2800);
        await conn.sendMessage(m.chat, {
            text: `💀 *BLACKMAIL PROTOCOL READY*\n\n` +
                  `${name}, abbiamo materiale sufficiente per distruggere la tua immagine pubblica.\n` +
                  `Screenshot, messaggi privati, ricerche imbarazzanti e deepfake pronti.\n\n` +
                  `Vuoi davvero che tutto questo venga reso pubblico?`,
            mentions: [target]
        });
    }

    // ====================== .DEEPFAKE ======================
    if (m.text.toLowerCase().startsWith(prefix + 'deepfake')) {
        await conn.sendMessage(m.chat, { text: `🎥 *Generando modello facciale IA...*` });
        await delay(2200);
        await conn.sendMessage(m.chat, { text: `🧠 *Addestrando voce e movimenti...*` });
        await delay(3000);
        await conn.sendMessage(m.chat, {
            text: `🌀 *DEEPFAKE GENERATO CON SUCCESSO*\n\n` +
                  `Abbiamo creato un video di ${name} che dice e fa cose estremamente compromettenti.\n` +
                  `Sembra assolutamente reale.\n\n` +
                  `Vuoi che venga distribuito nel Darkweb?`,
            mentions: [target]
        });
    }

    // ====================== .RANSOMWARE ======================
    if (m.text.toLowerCase().startsWith(prefix + 'ransomware')) {
        await conn.sendMessage(m.chat, { text: `🔒 *Distribuendo Ransomware crittografato...*` });
        await delay(2600);
        await conn.sendMessage(m.chat, {
            text: `💰 *RANSOMWARE ATTIVATO*\n\n` +
                  `Tutti i file, foto e chat di ${name} sono stati crittografati.\n` +
                  `Pagamento richiesto in Monero entro 48 ore, altrimenti i dati verranno pubblicati.`,
            mentions: [target]
        });
    }

    // ====================== .PHISH ======================
    if (m.text.toLowerCase().startsWith(prefix + 'phish')) {
        await conn.sendMessage(m.chat, { text: `🎣 *Preparando attacco di Phishing personalizzato...*` });
        await delay(2500);
        await conn.sendMessage(m.chat, {
            text: `🪝 *PHISHING COMPLETATO*\n\n` +
                  `${name} ha cliccato sul link e inserito le sue credenziali.\n` +
                  `Accesso a tutti gli account acquisito (simulazione).`,
            mentions: [target]
        });
    }

    // ====================== .REPUTATION ======================
    if (m.text.toLowerCase().startsWith(prefix + 'reputation')) {
        await conn.sendMessage(m.chat, { text: `📊 *Analizzando reputazione nel Deep Web...*` });
        await delay(2400);
        await conn.sendMessage(m.chat, {
            text: `🜁 *REPUTATION REPORT*\n\n` +
                  `${name} è percepito come persona instabile, bisognosa di attenzioni e poco affidabile.\n` +
                  `Rischio sociale: **Alto**\n\n` +
                  `Consigliato: stare lontani.`,
            mentions: [target]
        });
    }

    // ====================== .ANON ======================
    if (m.text.toLowerCase().startsWith(prefix + 'anon')) {
        const msg = m.text.split(' ').slice(1).join(' ');
        if (!msg) return conn.reply(m.chat, "❯ `.anon scrivi qui il messaggio`", m);

        await conn.sendMessage(m.chat, { text: `🕶️ *Instradando messaggio attraverso 9 nodi TOR...*` });
        await delay(2800);

        await conn.sendMessage(m.chat, {
            text: `🌑 *MESSAGGIO DAL LIVELLO VII DEL DARKWEB*\n\n` +
                  `"${msg}"\n\n` +
                  `— Ombra Sconosciuta • Livello VII`,
        });
    }
};

handler.help = ['darkweb'];
handler.tags = ['fun'];
handler.command = /^(darkweb|dw|hack|dox|breach|trace|intel|shadow|blackmail|phish|ransomware|deepfake|reputation|anon)$/i;
handler.group = true;

export default handler;
