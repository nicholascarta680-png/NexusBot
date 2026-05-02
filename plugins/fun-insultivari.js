// Plug-in creato da elixir
// ====================== FUN / ROAST COMMANDS - MAX VERSION ======================

// ====================== .insulta ======================
let insultaHandler = async (m, { conn, text }) => {
    if (!m.isGroup) throw 'Solo nei gruppi!'

    let menzione = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/@/, '') + '@s.whatsapp.net'
    if (!menzione) throw 'Chi vuoi insultare?'

    if (menzione === conn.user.jid) return conn.reply(m.chat, `Non ci provare, testa di cazzo.`, m)

    const insulti = [
        "sei una testa di minchia patentata", "figghiu ri buttana", "pezzo ri mmerda", "vastasu schifiusu",
        "scimunito senza neuroni", "curnutu e contentu", "si nu nuddu mmiscatu cu nenti", "va a suca minchia",
        "facci ri càrcara", "sei più inutile di un preservativo bucato", "to matri è na buttana sacra",
        "sei un coglione di prima categoria", "sei come la merda: ovunque vai lasci puzza",
        "sei talmente brutto che fai schifo pure ai cani", "sei un fallito a vita", "testa di cazzo ambulante",
        "sei il motivo per cui si usa il preservativo", "sei nato per sbaglio", "sei un errore della natura",
        "sei così lercio che puzzi anche da lontano", "sei un parassita della società", "figlio di una troia patentata",
        "sei inutile come il terzo testicolo", "hai il QI di una pianta grassa", "sei un ritardato evolutivo",
        "sei la vergogna della famiglia", "sei così scemo che ti compatisco", "va a farti fottere dal treno",
        "sei un bidone dell'immondizia con le gambe", "sei più falso di una moneta da 3 euro",
        "hai la faccia come il culo di un babuino", "sei un essere umano di serie B", "sei un aborto fallito",
        "sei più sporco di una fogna a cielo aperto", "sei un cesso con le gambe", "sei un rifiuto umano",
        "sei così brutto che tua madre ti allattava con la mascherina", "sei un clown senza trucco",
        "sei la dimostrazione che l'incesto fa male", "sei un virus con le gambe", "sei un tumore della società",
        "sei più inutile di un fornelletto da campo", "sei un handicappato mentale", "sei un sacco di letame",
        "sei così stupido che fai pena", "sei un fenomeno da baraccone", "sei la feccia della società",
        "sei un nano mentale", "sei un mongoloide patentato", "sei un deficiente cronico", "sei un ritardato di merda",
        "sei un povero sfigato", "sei un perdente nato", "sei un fallito su tutta la linea", "sei un pezzente",
        "sei un lurido schifoso", "sei un porco schifoso", "sei un bastardo figlio di puttana",
        "sei un cane rognoso", "sei un maiale senza dignità", "sei un essere spregevole",
        "sei un rifiuto della società", "sei un essere inutile e patetico", "sei un povero disgraziato",
        "sei un coglione patentato", "sei un idiota di prima categoria", "sei un imbecille totale",
        "sei un deficiente senza speranza", "sei un cretino patentato", "sei un cazzo di merda",
        "sei un pezzo di merda vivente", "sei un mucchio di letame", "sei un rifiuto umano", "sei una merda secca"
    ]

    let insulto = insulti[Math.floor(Math.random() * insulti.length)]
    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${insulto}`, m, { mentions: [menzione] })
}

// ====================== .roast ======================
let roastHandler = async (m, { conn, text }) => {
    if (!m.isGroup) throw 'Solo nei gruppi!'

    let menzione = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/@/, '') + '@s.whatsapp.net'
    if (!menzione) throw 'Chi vuoi roastare?'

    if (menzione === conn.user.jid) return conn.reply(m.chat, `Non ci provare.`, m)

    const roasts = [
        "Sei così brutto che quando sei nato il dottore ha dato le condoglianze a tua madre",
        "Hai meno personalità di un muro bianco", "Sei il motivo per cui alcuni animali mangiano i propri cuccioli",
        "Sei talmente inutile che se fossi un Pokémon saresti MissingNo", "La tua faccia sembra un incidente stradale",
        "Sei così scemo che ti sei guardato allo specchio e hai detto 'chi è sto coglione?'",
        "Tua madre è pentita ogni volta che ti guarda", "Sei la prova vivente che Dio a volte sbaglia",
        "Sei così noioso che fai addormentare pure i morti", "La tua vita è un meme che non fa ridere",
        "Sei il tipo di persona che viene taggato solo nelle catene", "Sei come WiFi pubblico: tutti ti usano ma nessuno ti vuole",
        "Hai il carisma di un pezzo di pane raffermo", "Sei così brutto che fai sembrare bello Quasimodo",
        "La tua esistenza è un filler", "Sei il motivo per cui l'evoluzione a volte torna indietro",
        "Sei talmente sfigato che perdi anche a testa o croce", "La tua vita è un bug del sistema",
        "Sei il motivo per cui si inventano gli aborti", "Sei come un virus: nessuno ti vuole ma tutti ti prendono",
        "Hai il sex appeal di un calzino sporco", "Sei così patetico che fai pena pure a me",
        "Sei il campione mondiale di fallimenti", "La tua intelligenza è in modalità risparmio energetico",
        "Sei così inutile che nemmeno la morte ti vuole", "Sei un errore di fabbrica",
        "Sei la dimostrazione che la natura a volte fa scherzi brutti", "Sei un fallimento ambulante",
        "Sei così brutto che tua madre ti copriva con un lenzuolo", "La tua vita è una barzelletta senza punchline",
        "Sei il motivo per cui alcuni genitori si pentono", "Hai il fascino di una scarpa vecchia"
    ]

    let roast = roasts[Math.floor(Math.random() * roasts.length)]
    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${roast}`, m, { mentions: [menzione] })
}

// ====================== .sberla ======================
let sberlaHandler = async (m, { conn, text }) => {
    let menzione = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/@/, '') + '@s.whatsapp.net'
    if (!menzione) throw 'A chi vuoi dare la sberla?'

    const list = [
        "🔥 *SBERLA VOLANTE* 🔥 Ti ho lasciato cinque dita sulla faccia",
        "Ti ho dato una sberla che hai visto fino a dopodomani",
        "Sberla così forte che ti ho resettato il cervello",
        "Ti ho schiaffeggiato così forte che hai cambiato continente",
        "Sberla che ti ha girato la testa di 360°",
        "Ti ho dato una sberla che ti è partito il dente del giudizio",
        "Sberla storica, se ne parlerà per generazioni",
        "Ti ho dato uno schiaffo che ti ha fatto vedere le stelle",
        "Sberla così forte che ti ho spostato di 3 fusi orari",
        "Ti ho schiaffeggiato così forte che hai cambiato cognome",
        "Sberla da record mondiale", "Ti ho dato una sberla che ti ha fatto ricrescere i capelli"
    ]

    let txt = list[Math.floor(Math.random() * list.length)]
    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${txt}`, m, { mentions: [menzione] })
}

// ====================== .stupido ======================
let stupidoHandler = async (m, { conn, text }) => {
    let menzione = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/@/, '') + '@s.whatsapp.net'
    if (!menzione) throw 'Chi è stupido?'

    const list = [
        "Sei così stupido che pensi che 1+1 faccia Finestra", "Hai il QI di un posacenere",
        "Sei talmente scemo che ti sei affogato in una pozzanghera", "Il tuo cervello ha più RAM di un Nokia 3310",
        "Sei scemo di natura", "Sei un ritardato evolutivo", "Hai il cervello in modalità aereo",
        "Sei così stupido che fai sembrare intelligente un sasso", "Hai più buchi in testa di una spugna",
        "Il tuo cervello è in sciopero permanente", "Sei talmente scemo che ti compatisco",
        "Hai il quoziente intellettivo negativo", "Sei stupido a livelli olimpici"
    ]

    let txt = list[Math.floor(Math.random() * list.length)]
    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${txt}`, m, { mentions: [menzione] })
}

// ====================== .culo ======================
let culoHandler = async (m, { conn, text }) => {
    let menzione = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/@/, '') + '@s.whatsapp.net'
    if (!menzione) throw 'A chi guardi il culo?'

    const list = [
        "Ha un culo così grande che ci parcheggia la macchina", "Il tuo culo ha più buchi di un colabrodo",
        "Hai il culo così floscio che sembra due buste della spesa", "Hai il culo che sembra due palloni sgonfi",
        "Ti cade il culo ogni volta che cammini", "Hai un culo che fa ombra", "Il tuo culo è una portaerei",
        "Hai il culo così grosso che ha il codice postale", "Il tuo culo è più grande della tua intelligenza",
        "Hai due chiappe che sembrano due pianeti", "Il tuo culo ha la gravità propria"
    ]

    let txt = list[Math.floor(Math.random() * list.length)]
    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${txt}`, m, { mentions: [menzione] })
}

// ====================== .morto .ammazza .cornuto ======================
let mortoHandler = async (m, { conn, text }) => {
    let menzione = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/@/, '') + '@s.whatsapp.net'
    if (!menzione) throw 'Chi è morto?'
    const list = ["Sei più morto di mio nonno","Sei morto dentro da anni","Sei così morto che puzzi già","Sei morto e non lo sai ancora","Sei un cadavere che cammina","Sei clinicamente morto","Sei più morto della speranza in questo gruppo"]
    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${list[Math.floor(Math.random()*list.length)]}`, m, { mentions: [menzione] })
}

let ammazzaHandler = async (m, { conn, text }) => {
    let menzione = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/@/, '') + '@s.whatsapp.net'
    if (!menzione) throw 'Chi vuoi ammazzare?'
    const list = ["Ti ammazzo di botte","Ti ammazzo e ti seppellisco nel giardino","Ti ammazzo lentamente con le mie mani","Ti ammazzo e ti faccio sparire","Ti faccio fuori come un cane","Ti ammazzo e poi ti piscio sopra"]
    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${list[Math.floor(Math.random()*list.length)]}`, m, { mentions: [menzione] })
}

let cornutoHandler = async (m, { conn, text }) => {
    let menzione = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/@/, '') + '@s.whatsapp.net'
    if (!menzione) throw 'Chi è cornuto?'
    const list = ["Curnutu patentatu","Ti crescono le corna più grandi del cervo","Tua moglie ti fa più corna di un toro","Sei cornuto e pure contento","Sei cornuto da record mondiale","Hai le corna che toccano il cielo","Sei cornuto da quando sei nato","Tua moglie ti mette le corna con tutto il quartiere"]
    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${list[Math.floor(Math.random()*list.length)]}`, m, { mentions: [menzione] })
}

// ====================== ESPORTAZIONE ======================
export default {
    insulta: { command: /^insulta$/i, handler: insultaHandler, tags: ['fun'], group: true },
    roast:   { command: /^roast$/i,   handler: roastHandler,   tags: ['fun'], group: true },
    sberla:  { command: /^sberla$/i,  handler: sberlaHandler,  tags: ['fun'], group: true },
    stupido: { command: /^stupido$/i, handler: stupidoHandler, tags: ['fun'], group: true },
    culo:    { command: /^culo$/i,    handler: culoHandler,    tags: ['fun'], group: true },
    morto:   { command: /^morto$/i,   handler: mortoHandler,   tags: ['fun'], group: true },
    ammazza: { command: /^ammazza$/i, handler: ammazzaHandler, tags: ['fun'], group: true },
    cornuto: { command: /^cornuto$/i, handler: cornutoHandler, tags: ['fun'], group: true }
}
