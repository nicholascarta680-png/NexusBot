// Plug-in creato da elixir
let handler = async (m, { conn, command, args, usedPrefix }) => {
    let user = global.db.data.users[m.sender]
    
    // Inizializzazione dati se non esistono
    if (!user.inventory) user.inventory = []
    if (!user.properties) user.properties = []
    if (!user.vehicles) user.vehicles = []

    const items = {
        case: {
            appartamento: { name: 'Appartamento', price: 50000, rent: 500 },
            villa: { name: 'Villa con Piscina', price: 200000, rent: 2500 },
            attico: { name: 'Attico Centro', price: 120000, rent: 1500 }
        },
        veicoli: {
            auto: { name: 'Utilitaria', price: 15000 },
            sportiva: { name: 'Ferrari SF90', price: 300000 },
            elicottero: { name: 'Elicottero Privato', price: 1000000 },
            aereo: { name: 'Jet Privato', price: 5000000 }
        },
        business: {
            negozio: { name: 'Market Locale', price: 80000, income: 1000 },
            ristorante: { name: 'Ristorante Stellato', price: 250000, income: 4000 }
        }
    }

    if (!args[0]) {
        return m.reply(`🛒 *NEGOZIO DISPONIBILE*\n\nUsa: \`${usedPrefix + command} <categoria>\`
        
📂 *Categorie:*
- \`case\`
- \`veicoli\`
- \`business\``)
    }

    let category = args[0].toLowerCase()
    let itemKey = args[1]?.toLowerCase()

    if (!items[category]) return m.reply('❌ Categoria non valida.')

    // Se l'utente visualizza la categoria
    if (!itemKey) {
        let list = `🛒 *LISTINO ${category.toUpperCase()}*\n\n`
        for (let key in items[category]) {
            list += `• *${items[category][key].name}* (${key})\n`
            list += `  💰 Prezzo: ${items[category][key].price.toLocaleString()} 🪙\n\n`
        }
        list += `✍️ Scrivi \`${usedPrefix + command} ${category} <nome>\` per comprare.`
        return m.reply(list)
    }

    // Logica di acquisto
    let item = items[category][itemKey]
    if (!item) return m.reply('❌ Oggetto non trovato.')
    if (user.money < item.price) return m.reply('🚫 Non hai abbastanza contanti!')

    user.money -= item.price
    
    if (category === 'case') user.properties.push({ ...item, lastClaim: Date.now() })
    else if (category === 'veicoli') user.vehicles.push(item)
    else if (category === 'business') user.properties.push({ ...item, type: 'business', lastClaim: Date.now() })

    m.reply(`✅ Hai acquistato: *${item.name}* per ${item.price.toLocaleString()} 🪙!`)
}

handler.help = ['shop']
handler.tags = ['economy']
handler.command = /^(shop|negozio|buy|compra)$/i
export default handler
