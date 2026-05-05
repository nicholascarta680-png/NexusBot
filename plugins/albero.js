// Plug-in creato da elixir
// Plug-in creato da elixir
import fs from 'fs'
import path from 'path'
import { createCanvas, loadImage } from 'canvas'

// --- DATABASE SETUP ---
const marriagesFile = path.resolve('media/database/sposi.json');
if (!fs.existsSync(path.dirname(marriagesFile))) fs.mkdirSync(path.dirname(marriagesFile), { recursive: true });

let marriages = loadMarriages();
function loadMarriages() {
    try { return fs.existsSync(marriagesFile) ? JSON.parse(fs.readFileSync(marriagesFile, 'utf8')) : {}; } 
    catch (e) { return {}; }
}
function saveMarriages() { fs.writeFileSync(marriagesFile, JSON.stringify(marriages, null, 2)); }

const checkUser = (id) => {
    if (!id) return
    if (!global.db.data.users[id]) global.db.data.users[id] = {}
    let u = global.db.data.users[id]
    if (!Array.isArray(u.p)) u.p = [] 
    if (u.s === undefined) u.s = null 
}

// --- ENGINE GRAFICO ---
async function drawUserCard(ctx, conn, id, x, y, role) {
    const cardW = 180, cardH = 70;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#1e1e2e';
    ctx.beginPath();
    ctx.roundRect(x - cardW/2, y - cardH/2, cardW, cardH, 15);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = role === 'GENITORE' ? '#f5c2e7' : (role === 'PARTNER' ? '#f38ba8' : '#89b4fa');
    ctx.lineWidth = 2;
    ctx.stroke();

    try {
        let url = await conn.profilePictureUrl(id, 'image').catch(() => 'https://telegra.ph/file/2416c30c33306fa33c5e0.jpg');
        let img = await loadImage(url);
        ctx.save();
        ctx.beginPath(); ctx.arc(x - 55, y, 25, 0, Math.PI * 2); ctx.clip();
        ctx.drawImage(img, x - 80, y - 25, 50, 50); ctx.restore();
    } catch (e) {}

    ctx.fillStyle = '#cdd6f4';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    let name = (await conn.getName(id)).substring(0, 12);
    ctx.fillText(name, x - 20, y - 5);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.font = '10px sans-serif';
    ctx.fillText(role, x - 20, y + 15);
}

// --- HANDLER ---
let handler = async (m, { conn, command, usedPrefix }) => {
    let user = m.sender;
    checkUser(user);

    if (command === 'famiglia') {
        let menu = `  ⋆｡˚『 ╭ \`SISTEMA DINASTICO\` ╯ 』˚｡⋆\n\n`
        menu += `  │ 💍 *${usedPrefix}sposa* @tag\n`
        menu += `  │ 💔 *${usedPrefix}divorzia*\n`
        menu += `  │ 👶 *${usedPrefix}adotta* @tag\n`
        menu += `  │ 🚫 *${usedPrefix}disereda* @tag\n`
        menu += `  │ 🌳 *${usedPrefix}albero* @tag\n`
        menu += `  ╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒`
        return m.reply(menu)
    }

    if (command === 'albero' || command === 'famigliamia') {
        let target = m.mentionedJid[0] || user;
        checkUser(target);
        await m.reply('⏳ *Dipingendo la dinastia reale...*');

        const canvas = createCanvas(900, 800);
        const ctx = canvas.getContext('2d');
        const bg = ctx.createLinearGradient(0, 0, 900, 800);
        bg.addColorStop(0, '#11111b'); bg.addColorStop(1, '#181825');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, 900, 800);

        let u = global.db.data.users[target];
        let partner = marriages[target];
        let padre = u.s;
        let figli = u.p || [];
        const centerX = 450;

        if (padre) {
            await drawUserCard(ctx, conn, padre, centerX, 100, 'GENITORE');
            ctx.strokeStyle = '#45475a';
            ctx.beginPath(); ctx.moveTo(centerX, 135); ctx.lineTo(centerX, 215); ctx.stroke();
        }

        if (partner) {
            await drawUserCard(ctx, conn, target, centerX - 120, 250, 'IO');
            await drawUserCard(ctx, conn, partner, centerX + 120, 250, 'PARTNER');
            ctx.strokeStyle = '#f38ba8';
            ctx.beginPath(); ctx.moveTo(centerX - 30, 250); ctx.lineTo(centerX + 30, 250); ctx.stroke();
        } else {
            await drawUserCard(ctx, conn, target, centerX, 250, 'IO');
        }

        if (figli.length > 0) {
            const spacing = 220;
            const startX = centerX - ((figli.length - 1) * spacing / 2);
            ctx.strokeStyle = '#45475a';
            ctx.beginPath(); ctx.moveTo(centerX, 285); ctx.lineTo(centerX, 330); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(startX, 330); ctx.lineTo(startX + (figli.length - 1) * spacing, 330); ctx.stroke();
            for (let i = 0; i < figli.length; i++) {
                let fX = startX + (i * spacing);
                ctx.beginPath(); ctx.moveTo(fX, 330); ctx.lineTo(fX, 365); ctx.stroke();
                await drawUserCard(ctx, conn, figli[i], fX, 400, 'FIGLIO/A');
            }
        }
        return conn.sendMessage(m.chat, { image: canvas.toBuffer(), caption: `👑 *ALBERO GENEALOGICO*\n⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒\nDinastia di: @${target.split('@')[0]}`, mentions: [target] }, { quoted: m });
    }

    if (command === 'sposa') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
        if (!target || target === user) return m.reply('`⚠️ Tagga la persona che vuoi sposare.`')
        if (marriages[user] || marriages[target]) return m.reply('`⚠️ Uno di voi è già impegnato in un matrimonio.`')
        global.marriage_proposals = global.marriage_proposals || {}
        global.marriage_proposals[target] = { proposer: user, timeout: setTimeout(() => delete global.marriage_proposals[target], 60000) }
        m.reply(`💍 *PROPOSTA DI MATRIMONIO*\n\n@${user.split('@')[0]} ha chiesto la tua mano, @${target.split('@')[0]}.\n\n*Scrivi:* \`${usedPrefix}accettasposa\` *per accettare!*`, null, { mentions: [user, target] })
    }

    if (command === 'accettasposa') {
        let proposal = global.marriage_proposals[user]
        if (!proposal) return m.reply('`⚠️ Non hai proposte di matrimonio in sospeso.`')
        marriages[user] = proposal.proposer; marriages[proposal.proposer] = user;
        saveMarriages(); delete global.marriage_proposals[user];
        m.reply('✨ *Le campane suonano! Matrimonio celebrato con successo.* 💖')
    }

    if (command === 'divorzia') {
        let ex = marriages[user]
        if (!ex) return m.reply('`⚠️ Non sei vincolato da alcun matrimonio.`')
        delete marriages[user]; delete marriages[ex];
        saveMarriages(); m.reply('💔 *Il legame è stato spezzato. Divorzio completato.*')
    }

    if (command === 'adotta') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
        if (!target || target === user) return m.reply('`⚠️ Tagga chi desideri adottare.`')
        checkUser(target)
        if (global.db.data.users[target].s) return m.reply('`❌ Questa persona ha già un genitore.`')
        
        global.adoption_proposals = global.adoption_proposals || {}
        global.adoption_proposals[target] = { proposer: user, timeout: setTimeout(() => delete global.adoption_proposals[target], 60000) }
        
        m.reply(`👶 *RICHIESTA DI ADOZIONE*\n\n@${user.split('@')[0]} vorrebbe adottarti come figlio/a, @${target.split('@')[0]}.\n\n*Scrivi:* \`${usedPrefix}accettaadozione\` *per accettare!*`, null, { mentions: [user, target] })
    }

    if (command === 'accettaadozione') {
        let proposal = global.adoption_proposals[user]
        if (!proposal) return m.reply('`⚠️ Non hai richieste di adozione in sospeso.`')
        
        let genitore = proposal.proposer
        checkUser(genitore)
        global.db.data.users[genitore].p.push(user)
        global.db.data.users[user].s = genitore
        
        delete global.adoption_proposals[user]
        m.reply(`🍼 *Benvenuto in famiglia! @${user.split('@')[0]} è stato adottato ufficialmente.*`, null, { mentions: [user] })
    }

    if (command === 'disereda') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
        if (!target) return m.reply('`⚠️ Tagga il figlio da rimuovere.`')
        let u = global.db.data.users[user]
        if (!u.p.includes(target)) return m.reply('`❌ Questa persona non fa parte della tua progenie.`')
        u.p = u.p.filter(id => id !== target)
        global.db.data.users[target].s = null
        m.reply(`🚫 *Documenti firmati. @${target.split('@')[0]} è stato rimosso dalla dinastia.*`, null, { mentions: [target] })
    }
}

handler.command = /^(albero|famigliamia|famiglia|sposa|accettasposa|divorzia|adotta|accettaadozione|disereda)$/i
export default handler
