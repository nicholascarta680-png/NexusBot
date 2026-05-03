// Plug-in creato da elixir
let handler = async (m, { conn, groupMetadata }) => {
    if (!m.isGroup) throw false
    
    let gruppi = global.db.data.chats[m.chat]
    if (gruppi.spacobot === false) throw false

    let toM = a => '@' + a.split('@')[0]
    let ps = groupMetadata.participants.map(v => v.id)
    
    if (ps.length < 2) throw 'Servono almeno due persone nel gruppo per creare zizzania!'
    
    let a = ps.getRandom()
    let b
    do b = ps.getRandom()
    while (b === a)

    const frasi = [
        // --- CATEGORIA: ASSURDO & NONENSE ---
        'ha rubato segretamente la collezione di tappi di', 'vuole sfidare a duello con i cuscini', 'pensa che il sosia perduto di Babbo Natale sia',
        'ha sognato di cavalcare un unicorno rosa insieme a', 'vuole fondare un fan club dedicato ai piedi di', 'crede che sia un alieno infiltrato',
        'passa ore a guardare le foto del profilo di', 'vorrebbe scambiare il proprio guardaroba con quello di', 'ha chiesto a un cartomante il futuro di',
        'vorrebbe andare a vivere su Marte insieme a', 'ha confessato di voler clonare', 'crede che scriva messaggi sotto dettatura di un gatto',
        
        // --- CATEGORIA: IMBARAZZANTE ---
        'ha salvato per sbaglio lo stato WhatsApp di', 'ha cercato su Google "come diventare migliore amico di"', 'vuole chiedere un autografo sulla fronte a',
        'sogna di fare un karaoke imbarazzante con', 'ha mandato un bacio virtuale per errore a', 'ha provato a copiare il taglio di capelli di',
        'ha una gigantografia in camera di', 'vorrebbe farsi prestare i calzini usati da', 'ha provato a spiare cosa mangia a pranzo',
        'pensa che la risata più buffa del mondo sia quella di', 'ha scritto una canzone d’amore dedicata a', 'vorrebbe farsi fare i grattini da',

        // --- CATEGORIA: ZIZZANIA & COMPETIZIONE ---
        'pensa di essere molto più intelligente di', 'ha mangiato l’ultimo biscotto destinato a', 'vorrebbe rubare il posto di lavoro di',
        'ha mutato perennemente le notifiche di', 'crede che il gusto in fatto di musica di sia pessimo', 'ha rivelato un segreto buffo su',
        'pensa che si vesta peggio di un pagliaccio rispetto a', 'ha nascosto il caricabatterie di', 'ride ogni volta che legge un messaggio di',

        // --- NUOVE AGGIUNTE PER ARRIVARE A 100+ ---
        'vorrebbe partecipare a un reality show con', 'ha chiesto in prestito dei soldi mai restituiti a', 'pensa che sia il/la più pigro/a del gruppo',
        'vuole organizzare uno scherzo telefonico a', 'sogna di vincere la lotteria e non dare nulla a', 'ha provato a imparare il ballo del ceppo con',
        'vorrebbe tingere i capelli di verde a', 'ha confessato di avere una cotta segreta per la zia di', 'pensa che sia un robot telecomandato',
        'vorrebbe fare una gara di abbuffata con', 'ha rubato l’idea geniale di', 'crede che parli nel sonno di',
        'vuole sfidare a una maratona di serie TV', 'ha scambiato il sale con lo zucchero nel caffè di', 'pensa che abbia i gusti cinematografici di un sasso',
        'vorrebbe fare un tatuaggio temporaneo con la faccia di', 'ha provato a ipnotizzare via chat', 'crede che sia il/la preferito/a degli admin',
        'vorrebbe fare una battaglia di polpette con', 'ha confessato di preferire il cane di a', 'vuole insegnare a cantare lirica a',
        'ha cercato di vendere su eBay un oggetto di', 'pensa che sia la causa del riscaldamento globale', 'vorrebbe vivere in una bolla di sapone con',
        'ha provato a indovinare la password del telefono di', 'crede che si lavi i denti con la nutella', 'vuole fare un viaggio in autostop con',
        'ha paura che gli rubi la scena', 'pensa che sia l’anima della festa (in senso ironico)', 'vorrebbe regalare un set di nani da giardino a',
        'ha sognato di essere in trappola in un ascensore con', 'vuole sfidare a braccio di ferro', 'pensa che abbia un talento nascosto per il curling',
        'ha provato a imitare l’accento di', 'vorrebbe fare un picnic sotto la pioggia con', 'crede che sia la persona più ritardataria del secolo',
        'vuole regalare un abbonamento a "Simpatici ma non troppo" a', 'ha dimenticato il compleanno di', 'pensa che sia un influencer fallito',
        'vorrebbe vedere cosa c’è nel carrello della spesa di', 'ha chiesto un consiglio di stile a', 'crede che sia un agente segreto',
        'vuole sfidare a chi sta più tempo senza parlare', 'ha confessato che non capisce mai le battute di', 'pensa che sia un mito assoluto',
        'vorrebbe fare una scalata in montagna con', 'ha provato a scrivere un libro sulla vita di', 'crede che sia un vampiro',
        'vuole fare una gara di sguardi con', 'ha nascosto le chiavi di casa di', 'pensa che sia la persona più fortunata del mondo',
        'vorrebbe costruire un castello di sabbia con', 'ha chiesto a Siri come sopportare', 'crede che abbia un gemello cattivo',
        'vuole fare un duetto su TikTok con', 'ha provato a rubare la merenda di', 'pensa che sia il re/regina dei meme',
        'vorrebbe fare una partita a scacchi bendato contro', 'ha confessato di ammirare segretamente lo stile di', 'vuole fare un corso di yoga con'
    ]

    const fraseScelta = pickRandom(frasi)
    
    await conn.reply(m.chat, `${toM(a)} ${fraseScelta} ${toM(b)}`, null, {
        mentions: [a, b]
    })
}

handler.customPrefix = /zizzania/i
handler.command = new RegExp
export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}
