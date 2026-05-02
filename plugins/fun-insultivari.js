// ====================== PLUGIN ROAST & FUN - UNICO FILE ======================

// ====================== .insulta ======================
let insulta = async (m, { conn, text }) => {
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
        "sei un povero sfigato", "sei un perdente nato", "sei un fallito su tutta la linea"
    ]

    let insulto = insulti[Math.floor(Math.random() * insulti.length)]
    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${insulto}`, m, { mentions: [menzione] })
}
insulta.command = /^insulta$/i
insulta.tags = ['fun']
insulta.group = true

// ====================== .roast ======================
let roast = async (m, { conn, text }) => {
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
        "Sei talmente sfigato che perdi anche a testa o croce", "La tua vita è un bug del sistema"
    ]

    let txt = roasts[Math.floor(Math.random() * roasts.length)]
    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${txt}`, m, { mentions: [menzione] })
}
roast.command = /^roast$/i
roast.tags = ['fun']
roast.group = true

// ====================== .sberla ======================
let sberla = async (m, { conn, text }) => {
    let menzione = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/@/, '') + '@s.whatsapp.net'
    if (!menzione) throw 'A chi vuoi dare la sberla?'

    const list = [
        "🔥 *SBERLA VOLANTE* 🔥 Ti ho lasciato cinque dita sulla faccia",
        "Ti ho dato una sberla che hai visto fino a dopodomani",
        "Sberla così forte che ti ho resettato il cervello",
        "Ti ho schiaffeggiato così forte che hai cambiato continente",
        "Sberla che ti ha girato la testa di 360°",
        "Ti ho dato una sberla che ti è partito il dente del giudizio"
    ]

    let txt = list[Math.floor(Math.random() * list.length)]
    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${txt}`, m, { mentions: [menzione] })
}
sberla.command = /^sberla$/i
sberla.tags = ['fun']
sberla.group = true

// ====================== .stupido ======================
let stupido = async (m, { conn, text }) => {
    let menzione = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/@/, '') + '@s.whatsapp.net'
    if (!menzione) throw 'Chi è stupido?'

    const list = [
        "Sei così stupido che pensi che 1+1 faccia Finestra", "Hai il QI di un posacenere",
        "Sei talmente scemo che ti sei affogato in una pozzanghera", "Il tuo cervello ha più RAM di un Nokia 3310",
        "Sei scemo di natura", "Sei un ritardato evolutivo", "Hai il cervello in modalità aereo"
    ]

    let txt = list[Math.floor(Math.random() * list.length)]
    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${txt}`, m, { mentions: [menzione] })
}
stupido.command = /^stupido$/i
stupido.tags = ['fun']
stupido.group = true

// ====================== .culo ======================
let culo = async (m, { conn, text }) => {
    let menzione = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/@/, '') + '@s.whatsapp.net'
    if (!menzione) throw 'A chi guardi il culo?'

    const list = [
        "Ha un culo così grande che ci parcheggia la macchina", "Il tuo culo ha più buchi di un colabrodo",
        "Hai il culo così floscio che sembra due buste della spesa", "Hai il culo che sembra due palloni sgonfi",
        "Ti cade il culo ogni volta che cammini"
    ]

    let txt = list[Math.floor(Math.random() * list.length)]
    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${txt}`, m, { mentions: [menzione] })
}
culo.command = /^culo$/i
culo.tags = ['fun']
culo.group = true

// ====================== .morto ======================
let morto = async (m, { conn, text }) => {
    let menzione = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/@/, '') + '@s.whatsapp.net'
    if (!menzione) throw 'Chi è morto?'

    const list = ["Sei più morto di mio nonno","Sei morto dentro da anni","Sei così morto che puzzi già","Sei morto e non lo sai ancora","Sei un cadavere che cammina"]

    let txt = list[Math.floor(Math.random() * list.length)]
    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${txt}`, m, { mentions: [menzione] })
}
morto.command = /^morto$/i
morto.tags = ['fun']
morto.group = true

// ====================== .ammazza ======================
let ammazza = async (m, { conn, text }) => {
    let menzione = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/@/, '') + '@s.whatsapp.net'
    if (!menzione) throw 'Chi vuoi ammazzare?'

    const list = ["Ti ammazzo di botte","Ti ammazzo e ti seppellisco nel giardino","Ti ammazzo lentamente con le mie mani","Ti faccio fuori come un cane"]

    let txt = list[Math.floor(Math.random() * list.length)]
    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${txt}`, m, { mentions: [menzione] })
}
ammazza.command = /^ammazza$/i
ammazza.tags = ['fun']
ammazza.group = true

// ====================== .cornuto ======================
let cornuto = async (m, { conn, text }) => {
    let menzione = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/@/, '') + '@s.whatsapp.net'
    if (!menzione) throw 'Chi è cornuto?'

    const list = ["Curnutu patentatu","Ti crescono le corna più grandi del cervo","Tua moglie ti fa più corna di un toro","Sei cornuto e pure contento","Sei cornuto da record mondiale"]

    let txt = list[Math.floor(Math.random() * list.length)]
    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${txt}`, m, { mentions: [menzione] })
}
cornuto.command = /^cornuto$/i
cornuto.tags = ['fun']
cornuto.group = true

// ====================== ESPORTA TUTTI ======================
export default { insulta, roast, sberla, stupido, culo, morto, ammazza, cornuto }
