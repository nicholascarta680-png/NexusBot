// Plug-in creato da elixir
import fs from 'fs'
import path from 'path'
import { createCanvas, loadImage } from 'canvas'

// --- CONFIGURAZIONE DATABASE ---
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
        let url = await conn.profilePictureUrl(id, 'image').catch(() => 'https://telegra.ph');
        let img = await loadImage(url);
        ctx.save();
        ctx.beginPath();
        ctx.arc(x - 55, y, 25, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, x - 80, y - 25, 50, 50);
        ctx.restore();
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

// --- HANDLER PRINCIPALE ---
let handler = async (m, { conn, command, usedPrefix }) => {
    let user = m.sender;
    checkUser(user);

    // --- COMANDO RESET (SOLO OWNER) ---
    if (command === 'resetfamiglia') {
        let isOwner = [conn.user.jid, ...global.owner.map(v => v + '@s.whatsapp.net')].includes(m.sender)
        if (!isOwner) return m.reply('*❌ Accesso Negato. Solo il Creatore può usare questo comando.*')

        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
        if (!target) return m.reply('*⚠️ Tagga o rispondi al messaggio di chi vuoi resettare!*')

        let partner = marriages[target]
        if (partner) { delete marriages[target]; delete marriages[partner]; }
        
        let u = global.db.data.users[target]
        if (u) {
            if (u.p) { u.p.forEach(f => { if(global.db.data.users[f]) global.db.data.users[f].s = null }); u.p = []; }
            if (u.s) { 
                let g = global.db.data.users[u.s]; 
                if(g && g.p) g.p = g.p.filter(id => id !== target);
                u.s = null; 
            }
        }
        saveMarriages();
        return m.reply(`*🧹 Tabula Rasa: La dinastia di @${target.split('@')[0]} è stata cancellata dal registro reale.*`, null, { mentions: [target] })
    }

    // --- ALTRI COMANDI (PER TUTTI) ---
    if (command === 'famiglia') {
        let menu = `*🌳 DINASTIA REALE 🌳*\n\n`
        menu += `👉 *${usedPrefix}sposa @tag* - Chiedi la mano\n`
        menu += `👉 *${usedPrefix}divorzia* - Sciogli l'unione\n`
        menu += `👉 *${usedPrefix}adotta @tag* - Adotta un figlio\n`
        menu += `👉 *${usedPrefix}disereda @tag* - Rimuovi figlio\n`
        menu += `👉 *${usedPrefix}albero* - Visualizza albero\n`
        return m.reply(menu)
    }

    if (command === 'albero' || command === 'famigliamia') {
        let target = m.mentionedJid[0] || user;
        checkUser(target);
        await m.reply('⏳ *Generazione albero in corso...*');

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
        return conn.sendMessage(m.chat, { image: canvas.toBuffer(), caption: `👑 *Albero di ${await conn.getName(target)}*` }, { quoted: m });
    }

    if (command === 'sposa') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
        if (!target || target === user) return m.reply('*⚠️ Tagga il partner!*')
        if (marriages[user] || marriages[target]) return m.reply('*⚠️ Uno dei due è già occupato!*')
        global.marriage_proposals = global.marriage_proposals || {}
        global.marriage_proposals[target] = { proposer: user, timeout: setTimeout(() => delete global.marriage_proposals[target], 60000) }
        m.reply(`*💍 PROPOSTA* @${user.split('@')[0]} ha chiesto la mano di @${target.split('@')[0]}.\nScrivi *${usedPrefix}accettasposa* per accettare!`, null, { mentions: [user, target] })
    }

    if (command === 'accettasposa') {
        let proposal = global.marriage_proposals[user]
        if (!proposal) return m.reply('*⚠️ Nessuna proposta.*')
        marriages[user] = proposal.proposer; marriages[proposal.proposer] = user;
        saveMarriages(); delete global.marriage_proposals[user];
        m.reply('💖 *Matrimonio celebrato!*')
    }

    if (command === 'divorzia') {
        let ex = marriages[user]
        if (!ex) return m.reply('*⚠️ Non sei sposato.*')
        delete marriages[user]; delete marriages[ex];
        saveMarriages(); m.reply('💔 *Divorzio completato.*')
    }

    if (command === 'adotta') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
        if (!target || target === user) return m.reply('*⚠️ Chi vuoi adottare?*')
        checkUser(target)
        if (global.db.data.users[target].s) return m.reply('*❌ Ha già un genitore!*')
        global.db.data.users[user].p.push(target)
        global.db.data.users[target].s = user
        m.reply(`*👶 Adottato @${target.split('@')[0]}!*`, null, { mentions: [target] })
    }

    if (command === 'disereda') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
        if (!target) return m.reply('*⚠️ Chi vuoi diseredare?*')
        let u = global.db.data.users[user]
        if (!u.p.includes(target)) return m.reply('*❌ Non è tuo figlio.*')
        u.p = u.p.filter(id => id !== target)
        global.db.data.users[target].s = null
        m.reply(`*🚫 @${target.split('@')[0]} rimosso dalla famiglia.*`, null, { mentions: [target] })
    }
}

handler.command = /^(albero|famigliamia|famiglia|sposa|accettasposa|divorzia|adotta|disereda|resetfamiglia)$/i
export default handler
