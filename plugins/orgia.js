let handler = async (m, { conn, command, participants }) => {
  let mentions = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  if (command.toLowerCase() === 'orgiacasuale' || command.toLowerCase() === 'orgiarandom') {
    let groupMembers = participants.map(u => u.id).filter(v => v !== conn.user.jid);
    let randomCount = Math.floor(Math.random() * (15 - 4 + 1)) + 4;
    let finalCount = Math.min(randomCount, groupMembers.length);
    
    if (finalCount < 4) return conn.sendMessage(m.chat, { text: "❌ *Errore:* Ci vuole un branco per questo massacro!" }, { quoted: m });
    
    mentions = groupMembers.sort(() => Math.random() - 0.5).slice(0, finalCount);
  }

  if (mentions.length < 4 || mentions.length > 15) {
    return conn.sendMessage(m.chat, { 
      text: `🔞 *L'ARENA DELLA CARNE* 🔞\n\nTagga da 4 a 15 vittime o usa *.orgiacasuale* per scatenare l'inferno.` 
    }, { quoted: m });
  }

  mentions = mentions.sort(() => Math.random() - 0.5);
  const tag = (jid) => `@${jid.split('@')[0]}`;
  let p = mentions.map(tag);
  
  let sufferer = p[Math.floor(Math.random() * p.length)];
  const count = mentions.length;

  // ==================== ~55 VARIANTI TOTALI ====================
  const stories = {
    4: [
      `🔥 ${p[0]} afferra ${p[1]} per i capelli e lo sbatte senza pietà mentre ${p[1]} urla di piacere. ${p[2]} e ${p[3]} si uniscono trasformando tutto in un groviglio di lingue, morsi e sborra calda.`,
      `🖤 ${p[0]} e ${p[1]} tengono fermo ${p[2]} mentre ${p[3]} lo distrugge da dietro. I gemiti diventano sempre più forti finché tutti e quattro non esplodono insieme.`,
      `💦 ${p[0]} viene usato come centro mentre ${p[1]}, ${p[2]} e ${p[3]} lo riempiono da ogni buco senza sosta.`,
      `😈 Quattro animali: ${p[0]} e ${p[1]} si fanno fottere selvaggiamente mentre ${p[2]} e ${p[3]} li ricoprono di fiotti densi.`,
      `🩸 ${p[0]} viene strangolato da ${p[1]} mentre ${p[2]} e ${p[3]} lo penetrano a turno come due bestie in calore.`,
      `🌪️ Catena di quattro: bocche, cazzi e mani ovunque finché la stanza non puzza di sesso e sborra.`
    ],

    5: [
      `🔞 ${p[0]} e ${p[1]} spalancano ${p[2]} mentre ${p[3]} lo sfonda e ${p[4]} gli riempie la gola fino alle lacrime.`,
      `🌪️ ${p[0]} viene passato di mano in mano come una troia tra i cinque.`,
      `🤤 ${p[0]} al centro che incassa quattro cazzi affamati che si alternano senza pietà.`,
      `💦 Cinque corpi sudati: ${p[0]} e ${p[1]} vengono distrutti mentre gli altri tre scaricano su di loro.`,
      `⛓️ ${p[0]} legato e usato come cumdump da tutti e cinque in un round di creampie brutale.`,
      `🔥 Orgia a cinque: ${p[0]} urla mentre viene doppio penetrato e ricoperto di sborra.`
    ],

    6: [
      `⛓️ ${p[0]} strozza ${p[1]} mentre ${p[2]} lo sfonda. ${p[3]} si fa succhiare da ${p[4]} e ${p[5]} scarica su tutti.`,
      `🔥 Catena a sei: tre che fottono e tre che prendono in un delirio di carne.`,
      `💦 ${p[0]} usato come centro mentre gli altri cinque lo marchiano con sborra da ogni lato.`,
      `🖤 ${p[0]}, ${p[1]} e ${p[2]} si fanno distruggere dal secondo trio in un'orgia senza regole.`,
      `😈 Sei bestie: ${p[0]} viene fatto ingoiare e riempire contemporaneamente da tutti.`,
      `🌊 Groviglio selvaggio di sei corpi che si mordono, scopano e vengono insieme.`
    ],

    7: [
      `🤤 ${p[0]}, ${p[1]} e ${p[2]} circondano ${p[3]} e lo usano come buco comune mentre gli altri pompano.`,
      `🌀 Sette corpi in un cerchio di lussuria, cazzi e bocche ovunque.`,
      `⛓️ ${p[0]} ridotto a cumdump da tutti e sette in fila indiana.`,
      `🔥 ${p[0]} urla mentre viene triplo penetrato e ricoperto di sborra dal branco.`,
      `💀 Sette peccatori che trasformano ${p[0]} in un ammasso gocciolante di seme.`,
      `🌪️ Orgia a sette: ${p.slice(0,4).join(', ')} usano senza pietà ${p.slice(4).join(', ')}.`
    ],

    8: [
      `🔞 ${p[0]} trattato come trofeo mentre gli altri sette creano un treno brutale.`,
      `🌊 Otto corpi fusi: ${p[0]} e ${p[1]} al centro che vengono annientati.`,
      `💀 ${p[0]} grida mentre otto cazzi lo usano senza pietà.`,
      `🖤 Bukkake a otto su ${p[0]} che finisce completamente imbiancato.`,
      `😈 ${p[0]} doppio penetrato mentre gli altri sei pompano intorno.`
    ],

    9: [
      `🌊 Nove bestie: ${p[0]} sommerso da tre cazzi mentre gli altri scaricano ovunque.`,
      `🔥 ${p[0]} urla *"Riempitemi tutti!"* mentre nove corpi lo devastano.`,
      `🖤 ${p[0]} al centro di un'orgia a nove con doppia penetrazione e creampie a catena.`,
      `💦 Nove corpi che trasformano la stanza in un lago di sborra.`,
      `⛓️ ${p[0]} usato come schiavo sessuale da tutto il gruppo di nove.`
    ],

    10: [
      `🫦 INFERNO A DIECI: ${p[0]} sfondato da tre contemporaneamente mentre gli altri scaricano come fontane.`,
      `💦 Dieci animali che distruggono ${p[0]} in un massacro di carne e sperma.`,
      `🌪️ ${p[0]} diventa il cumdump ufficiale del branco da dieci.`,
      `🔥 Orgia apocalittica a dieci con ${p[0]} che incassa tutto.`,
      `😈 Dieci corpi sudati che si scambiano e si distruggono senza controllo.`
    ],

    11: [
      `🔥 ${p[0]} schiacciato da undici corpi che lo fottono e lo ricoprono senza tregua.`,
      `🌪️ Undici corpi in delirio collettivo con ${p[0]} al centro della tempesta.`,
      `💀 ${p[0]} ridotto a un buco esausto da undici cazzi affamati.`,
      `🖤 Bukkake epico a undici su ${p[0]} completamente imbrattato.`
    ],

    12: [
      `🔞 APOCALISSE A DODICI: ${p[0]} annientato mentre dodici corpi creano un mare di sborra.`,
      `⛓️ ${p[0]} implora pietà che non arriva dal branco di dodici.`,
      `💦 Dodici peccatori che imbiancano ${p[0]} e tutta la zona.`,
      `🌊 Dodici corpi fusi in un'orgia brutale e caotica.`
    ],

    13: [
      `⛓️ Tredici corpi senza legge: ${p[0]} completamente devastato dal branco.`,
      `🌊 ${p[0]} sviene dal piacere mentre tredici animali lo riempiono.`,
      `🔥 Tredici bestie in calore che trasformano ${p[0]} in un cumdump vivente.`
    ],

    14: [
      `🤤 IL BRANCO: ${p[0]} urla di volere tutti dentro mentre quattordici corpi lo sventrano.`,
      `🔥 Quattordici corpi in fiamme che si distruggono in un'orgia leggendaria.`,
      `💦 ${p[0]} diventa il centro di un bukkake da quattordici persone.`
    ],

    15: [
      `🔞 MASSACRO TOTALE A QUINDICI: ${p[0]} annientato dal branco mentre quindici corpi impazziscono.`,
      `💦 Quindici animali che trasformano ${p[0]} in un lago di sborra bollente.`,
      `🖤 Orgia apocalittica a quindici: un unico ammasso di carne, urla e fluidi.`,
      `🌊 Quindici corpi che creano il più grande disastro di sborra mai visto.`
    ]
  };

  let storyArray = stories[count] || stories[15];
  let story = storyArray[Math.floor(Math.random() * storyArray.length)];

  let responseText = `🔞 *CRONACHE DELL'ESTASI COLLETTIVA* 🔞\n`;
  
  if (command.includes('casuale') || command.includes('random')) 
    responseText += `🎲 _Modalità Casuale: ${count} corpi estratti dal branco_\n\n`;
  
  responseText += `${story}\n\n`;
  responseText += `───────────────\n`;
  responseText += `🏆 *LA CARNE TRITA DELLA SERATA:* ${sufferer}\n`;
  responseText += `*(Ridotto a un buco esausto, pieno zeppo di sborra e completamente distrutto dal branco)* 💦💀`;

  await conn.sendMessage(m.chat, { text: responseText, mentions: mentions }, { quoted: m });
};

handler.help = ['orgia', 'orgiacasuale'];
handler.tags = ['giochi'];
handler.command = /^(orgia|orgiacasuale|orgiarandom)$/i;

export default handler;