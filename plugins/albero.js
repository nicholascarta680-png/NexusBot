// Plug-in creato da elixir
import fs from 'fs'
import path from 'path'
import { createCanvas, loadImage } from 'canvas'

const marriagesFile = path.resolve('media/database/sposi.json');
if (!fs.existsSync(path.dirname(marriagesFile))) fs.mkdirSync(path.dirname(marriagesFile), { recursive: true });

// --- UTILS DATABASE ---
const loadMarriages = () => {
    try { return fs.existsSync(marriagesFile) ? JSON.parse(fs.readFileSync(marriagesFile, 'utf8')) : {}; } 
    catch (e) { return {}; }
}
const saveMarriages = (data) => fs.writeFileSync(marriagesFile, JSON.stringify(data, null, 2));

const checkUser = (id) => {
    if (!id) return
    if (!global.db.data.users[id]) global.db.data.users[id] = {}
    let u = global.db.data.users[id]
    if (!Array.isArray(u.p)) u.p = [] 
    if (u.s === undefined) u.s = null 
}

// --- ENGINE GRAFICO ---
async function drawUserCard(ctx, conn, id, x, y, role) {
    const cardW = 200, cardH = 80;
    ctx.save();
    ctx.shadowColor = role === 'GENITORE' ? '#f5c2e7' : (role === 'PARTNER' ? '#f38ba8' : '#89b4fa');
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#11111b';
    ctx.beginPath();
    ctx.roundRect(x - cardW/2, y - cardH/2, cardW, cardH, 20);
    ctx.fill();
    ctx.restore();

    let grad = ctx.createLinearGradient(x - 100, y, x + 100, y);
    grad.addColorStop(0, role === 'GENITORE' ? '#f5c2e7' : (role === 'PARTNER' ? '#f38ba8' : '#89b4fa'));
    grad.addColorStop(1, '#cdd6f4');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.stroke();

    try {
        let url = await conn.profilePictureUrl(id, 'image').catch(() => 'https://telegra.ph');
        let img = await loadImage(url);
        ctx.save();
        ctx.beginPath(); ctx.arc(x - 60, y, 30, 0, Math.PI * 2); ctx.clip();
        ctx.drawImage(img, x - 90, y - 30, 60, 60); ctx.restore();
    } catch (e) {}

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    let rawName = await conn.getName(id);
    let cleanName = rawName.replace(/[^\x00-\x7F]/g, "").trim() || "User";
    ctx.fillText(cleanName.substring(0, 10), x - 20, y - 5);

    ctx.fillStyle = role === 'GENITORE' ? '#f5c2e7' : (role === 'PARTNER' ? '#f38ba8' : '#89b4fa');
    ctx.font = 'italic 11px sans-serif';
    ctx.fillText(role, x - 20, y + 15);
}

// --- HANDLER ---
let handler = async (m, { conn, command, usedPrefix, isOwner }) => {
    let user = m.sender;
    checkUser(user);
    let marriages = loadMarriages();

    // --- ALBERO GENEALOGICO ---
    if (command === 'albero' || command === 'famigliamia') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : user);
        checkUser(target);
        await m.reply('⏳ *Dipingendo la dinastia reale...*');

        const canvas = createCanvas(1000, 900);
        const ctx = canvas.getContext('2d');
        const bg = ctx.createRadialGradient(500, 450, 50, 500, 450, 600);
        bg.addColorStop(0, '#1e1e2e'); bg.addColorStop(1, '#000000');
        ctx.fillStyle = bg; ctx.fillRect(0, 0, 1000, 900);

        ctx.fillStyle = "#ffffff";
        for (let i = 0; i < 80; i++) {
            ctx.globalAlpha = Math.random();
            ctx.beginPath(); ctx.arc(Math.random() * 1000, Math.random() * 900, Math.random() * 2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1.0;

        let u = global.db.data.users[target];
        let partner = marriages[target];
        let padre = u.s;
        let figli = u.p || [];
        const centerX = 500;

        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = "rgba(205, 214, 244, 0.3)";
        ctx.lineWidth = 2;

        if (padre) {
            await drawUserCard(ctx, conn, padre, centerX, 150, 'GENITORE');
            ctx.beginPath(); ctx.moveTo(centerX, 190); ctx.lineTo(centerX, 260); ctx.stroke();
        }

        if (partner) {
            await drawUserCard(ctx, conn, target, centerX - 140, 350, 'IO');
            await drawUserCard(ctx, conn, partner, centerX + 140, 350, 'PARTNER');
            ctx.setLineDash([]); ctx.strokeStyle = '#f38ba8';
            ctx.beginPath(); ctx.moveTo(centerX - 40, 350); ctx.lineTo(centerX + 40, 350); ctx.stroke();
        } else {
            await drawUserCard(ctx, conn, target, centerX, 350, 'IO');
        }

        if (figli.length > 0) {
            const spacing = 250;
            const startX = centerX - ((figli.length - 1) * spacing / 2);
            ctx.setLineDash([5, 5]); ctx.strokeStyle = "rgba(205, 214, 244, 0.3)";
            ctx.beginPath(); ctx.moveTo(centerX, 390); ctx.lineTo(centerX, 450); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(startX, 450); ctx.lineTo(startX + (figli.length - 1) * spacing, 450); ctx.stroke();
            for (let i = 0; i < figli.length; i++) {
                let fX = startX + (i * spacing);
                ctx.beginPath(); ctx.moveTo(fX, 450); ctx.lineTo(fX, 490); ctx.stroke();
                await drawUserCard(ctx, conn, figli[i], fX, 550, 'FIGLIO/A');
            }
        }
        return conn.sendMessage(m.chat, { image: canvas.toBuffer(), caption: `✨ *DINASTIA DI @${target.split('@')[0]}*`, mentions: [target] }, { quoted: m });
    }

    // --- MATRIMONIO (SOLO TARGET PUÒ ACCETTARE) ---
    if (command === 'sposa') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
        if (!target || target === user) return m.reply('`⚠️ Tagga chi vuoi sposare.`');
        if (marriages[user] || marriages[target]) return m.reply('`⚠️ Uno dei due è già impegnato.`');
        
        global.marriage_proposals = global.marriage_proposals || {};
        global.marriage_proposals[target] = { proposer: user, target: target, timeout: setTimeout(() => delete global.marriage_proposals[target], 60000) };

        const buttons = [
            { buttonId: `${usedPrefix}accettasposa`, buttonText: { displayText: 'Accetto 💍' }, type: 1 },
            { buttonId: `${usedPrefix}rifiuta`, buttonText: { displayText: 'Rifiuto ❌' }, type: 1 }
        ];
        return conn.sendMessage(m.chat, { 
            text: `💍 *PROPOSTA DI MATRIMONIO*\n\n@${user.split('@')[0]} ha chiesto la tua mano @${target.split('@')[0]}.\n\n*Solo @${target.split('@')[0]} può rispondere.*`, 
            buttons: buttons, 
            headerType: 1, 
            mentions: [user, target] 
        }, { quoted: m });
    }

    if (command === 'accettasposa') {
        let prop = global.marriage_proposals[user];
        if (!prop || user !== prop.target) return; // IGNORE: Se non c'è proposta o chi clicca non è il target

        marriages[user] = prop.proposer; 
        marriages[prop.proposer] = user;
        saveMarriages(marriages); 
        clearTimeout(prop.timeout);
        delete global.marriage_proposals[user];
        return m.reply('💖 *Matrimonio celebrato con successo!*');
    }

    // --- ADOZIONE (SOLO TARGET PUÒ ACCETTARE) ---
    if (command === 'adotta') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
        if (!target || target === user) return m.reply('`⚠️ Tagga chi vuoi adottare.`');
        checkUser(target);
        if (global.db.data.users[target].s) return m.reply('`❌ Ha già un genitore.`');
        
        global.adoption_proposals = global.adoption_proposals || {};
        global.adoption_proposals[target] = { proposer: user, target: target, timeout: setTimeout(() => delete global.adoption_proposals[target], 60000) };

        const buttons = [
            { buttonId: `${usedPrefix}accettaadozione`, buttonText: { displayText: 'Sì, papà/mamma 🍼' }, type: 1 },
            { buttonId: `${usedPrefix}rifiuta`, buttonText: { displayText: 'No grazie ❌' }, type: 1 }
        ];
        return conn.sendMessage(m.chat, { 
            text: `👶 *RICHIESTA ADOZIONE*\n\n@${user.split('@')[0]} vorrebbe adottarti @${target.split('@')[0]}.\n\n*Solo @${target.split('@')[0]} può rispondere.*`, 
            buttons: buttons, 
            headerType: 1, 
            mentions: [user, target] 
        }, { quoted: m });
    }

    if (command === 'accettaadozione') {
        let prop = global.adoption_proposals[user];
        if (!prop || user !== prop.target) return; // IGNORE: Se non è il figlio designato a cliccare

        let genitore = prop.proposer;
        checkUser(genitore);
        global.db.data.users[genitore].p.push(user);
        global.db.data.users[user].s = genitore;
        clearTimeout(prop.timeout);
        delete global.adoption_proposals[user];
        return m.reply(`🍼 @${user.split('@')[0]} è entrato ufficialmente nella dinastia!`, null, { mentions: [user] });
    }

    if (command === 'rifiuta') {
        if (global.marriage_proposals[user] && user === global.marriage_proposals[user].target) {
            delete global.marriage_proposals[user];
            return m.reply('❌ Proposta rifiutata.');
        }
        if (global.adoption_proposals[user] && user === global.adoption_proposals[user].target) {
            delete global.adoption_proposals[user];
            return m.reply('❌ Adozione rifiutata.');
        }
    }

    // --- RESET & ALTRI COMANDI ---
    if (command === 'divorzia') {
        let p = marriages[user];
        if (!p) return m.reply('`⚠️ Non sei sposato.`');
        delete marriages[user]; delete marriages[p];
        saveMarriages(marriages);
        return m.reply('💔 *Divorzio effettuato.*');
    }

    if (command === 'resetfamiglia' && isOwner) {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
        if (!target) return m.reply('`⚠️ Chi vuoi purgare?`');
        let p = marriages[target];
        if (p) { delete marriages[target]; delete marriages[p]; saveMarriages(marriages); }
        let u = global.db.data.users[target];
        if (u) {
            u.p.forEach(f => { if(global.db.data.users[f]) global.db.data.users[f].s = null });
            if (u.s && global.db.data.users[u.s]) global.db.data.users[u.s].p = global.db.data.users[u.s].p.filter(id => id !== target);
            u.p = []; u.s = null;
        }
        return m.reply('🧹 *Dinastia resettata.*');
    }
}

handler.help = ['albero', 'sposa', 'adotta', 'resetfamiglia']
handler.tags = ['famiglia']
handler.command = /^(albero|famigliamia|sposa|accettasposa|accettaadozione|rifiuta|adotta|divorzia|resetfamiglia)$/i

export default handler
