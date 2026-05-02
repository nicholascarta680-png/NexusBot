// Plug-in creato da elixir

let handler = async (m, { conn, text, command }) => {
    if (!m.isGroup) throw 'Solo nei gruppi!'

    // Logica comune per trovare l'utente menzionato o citato
    let menzione = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/@/, '') + '@s.whatsapp.net'
    
    // Se non c'è una menzione e non è un numero valido, errore
    if (!menzione || menzione.length < 15) throw `Chi vuoi colpire con il comando *${command}*?`

    // Protezione per il bot
    if (menzione === conn.user.jid) return conn.reply(m.chat, `Non ci provare con me, pivello.`, m)

    let txt = ""
    let list = []

    switch (command) {
        case 'insulta':
            list = [
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
            break

        case 'roast':
            list = [
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
            break

        case 'sberla':
            list = [
                "🔥 *SBERLA VOLANTE* 🔥 Ti ho lasciato cinque dita sulla faccia",
                "Ti ho dato una sberla che hai visto fino a dopodomani",
                "Sberla così forte che ti ho resettato il cervello",
                "Ti ho schiaffeggiato così forte che hai cambiato continente",
                "Sberla che ti ha girato la testa di 360°",
                "Ti ho dato una sberla che ti è partito il dente del giudizio"
            ]
            break

        case 'stupido':
            list = [
                "Sei così stupido che pensi che 1+1 faccia Finestra", "Hai il QI di un posacenere",
                "Sei talmente scemo che ti sei affogato in una pozzanghera", "Il tuo cervello ha più RAM di un Nokia 3310",
                "Sei scemo di natura", "Sei un ritardato evolutivo", "Hai il cervello in modalità aereo"
            ]
            break

        case 'culo':
            list = [
                "Ha un culo così grande che ci parcheggia la macchina", "Il tuo culo ha più buchi di un colabrodo",
                "Hai il culo così floscio che sembra due buste della spesa", "Hai il culo che sembra due palloni sgonfi",
                "Ti cade il culo ogni volta che cammini"
            ]
            break

        case 'morto':
            list = ["Sei più morto di mio nonno", "Sei morto dentro da anni", "Sei così morto che puzzi già", "Sei morto e non lo sai ancora", "Sei un cadavere che cammina"]
            break

        case 'ammazza':
            list = ["Ti ammazzo di botte", "Ti ammazzo e ti seppellisco nel giardino", "Ti ammazzo lentamente con le mie mani", "Ti faccio fuori come un cane"]
            break
    }

    txt = list[Math.floor(Math.random() * list.length)]
    await conn.reply(m.chat, `@${menzione.split('@')[0]} ${txt}`, m, { mentions: [menzione] })
}

handler.help = ['insulta', 'roast', 'sberla', 'stupido', 'culo', 'morto', 'ammazza']
handler.tags = ['fun']
handler.command = /^(insulta|roast|sberla|stupido|culo|morto|ammazza)$/i
handler.group = true

export default handler
