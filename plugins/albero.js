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

    ctx.fillStyle = ctx.strokeStyle;
    ctx.font = 'italic 11px sans-serif';
    ctx.fillText(role, x - 20, y + 15);
}

// --- HANDLER ---
let handler = async (m, { conn, command, usedPrefix }) => {
    let user = m.sender;
    checkUser(user);
    let marriages = loadMarriages();

    // --- ALBERO GENEALOGICO ---
    if (command === 'albero' || command === 'famigliamia') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : user);
        checkUser(target);
        await m.reply('`⏳ Le cronache del regno stanno tracciando la tua stirpe...`');

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

        ctx.setLineDash();
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
            ctx.setLineDash(); ctx.strokeStyle = "rgba(205, 214, 244, 0.3)";
            ctx.beginPath(); ctx.moveTo(centerX, 390); ctx.lineTo(centerX, 450); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(startX, 450); ctx.lineTo(startX + (figli.length - 1) * spacing, 450); ctx.stroke();
            for (let i = 0; i < figli.length; i++) {
                let fX = startX + (i * spacing);
                ctx.beginPath(); ctx.moveTo(fX, 450); ctx.lineTo(fX, 490); ctx.stroke();
                await drawUserCard(ctx, conn, figli[i], fX, 550, 'FIGLIO/A');
            }
        }
        return conn.sendMessage(m.chat, { image: canvas.toBuffer(), caption: `✨ *SACIRO ALBERO DELLA DINASTIA* ✨\n\nI legami di @${target.split('@')[0]} sono scritti tra le stelle.`, mentions: [target] }, { quoted: m });
    }

    // --- MATRIMONIO ---
    if (command === 'sposa') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
        if (!target || target === user) return m.reply('`⚠️ Devi indicare a chi vuoi donare il tuo cuore.`');
        if (marriages[user] || marriages[target]) return m.reply('`⚠️ I vostri cuori appartengono già ad altri rami...`');
        
        global.marriage_proposals = global.marriage_proposals || {};
        global.marriage_proposals[target] = { proposer: user, target: target, timeout: setTimeout(() => delete global.marriage_proposals[target], 60000) };

        const buttons = [
            { buttonId: `${usedPrefix}accettasposa`, buttonText: { displayText: 'Sì, ti scelgo 💍' }, type: 1 },
            { buttonId: `${usedPrefix}rifiuta`, buttonText: { displayText: 'Non ora... ❌' }, type: 1 }
        ];
        return conn.sendMessage(m.chat, { 
            text: `💍 *UNA PROMESSA DI ETERNITÀ*\n\n@${user.split('@')[0]} ha chiesto la tua mano @${target.split('@')[0]}.\n\n*Solo @${target.split('@')[0]} può rispondere.*`, 
            buttons: buttons, mentions: [user, target] 
        }, { quoted: m });
    }

    if (command === 'accettasposa') {
        let prop = global.marriage_proposals[user];
        if (!prop || user !== prop.target) return;
        marriages[user] = prop.proposer; marriages[prop.proposer] = user;
        saveMarriages(marriages); clearTimeout(prop.timeout); delete global.marriage_proposals[user];
        return m.reply('✨ *Le campane suonano all\'unisono! Da oggi le vostre anime sono intrecciate in un legame sacro.* 💖');
    }

    if (command === 'divorzia') {
        let p = marriages[user];
        if (!p) return m.reply('`⚠️ Non sei vincolato a nessuno sposo.`');
        delete marriages[user]; delete marriages[p];
        saveMarriages(marriages);
        return m.reply('💔 *L\'INCANTO SI È SPEZZATO...* \n\nLe vostre strade si dividono qui. Quello che un tempo era un "noi", ora torna ad essere solo polvere e ricordi.');
    }

    // --- ADOZIONE ---
    if (command === 'adotta') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
        if (!target || target === user) return m.reply('`⚠️ Chi cerchi di accogliere sotto la tua protezione?`');
        checkUser(target);
        if (global.db.data.users[target].s) return m.reply('`❌ Questa persona ha già un genitore.`');
        
        global.adoption_proposals = global.adoption_proposals || {};
        global.adoption_proposals[target] = { proposer: user, target: target, timeout: setTimeout(() => delete global.adoption_proposals[target], 60000) };

        const buttons = [
            { buttonId: `${usedPrefix}accettaadozione`, buttonText: { displayText: 'Accetta la famiglia 🍼' }, type: 1 },
            { buttonId: `${usedPrefix}rifiuta`, buttonText: { displayText: 'Resto solo ❌' }, type: 1 }
        ];
        return conn.sendMessage(m.chat, { 
            text: `👶 *IL CALORE DI UNA FAMIGLIA*\n\n@${user.split('@')[0]} vorrebbe adottarti @${target.split('@')[0]}.\n\n*Solo @${target.split('@')[0]} può rispondere.*`, 
            buttons: buttons, mentions: [user, target] 
        }, { quoted: m });
    }

    if (command === 'accettaadozione') {
        let prop = global.adoption_proposals[user];
        if (!prop || user !== prop.target) return;
        let genitore = prop.proposer;
        checkUser(genitore);
        global.db.data.users[genitore].p.push(user);
        global.db.data.users[user].s = genitore;
        clearTimeout(prop.timeout); delete global.adoption_proposals[user];
        return m.reply(`🍼 *Benvenuto a casa! @${user.split('@')[0]} è stato ufficialmente adottato. Una nuova alba per questa famiglia!* ✨`);
    }

    if (command === 'disereda') {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
        if (!target) return m.reply('`⚠️ Chi deve essere allontanato dal focolare?`');
        let u = global.db.data.users[user];
        if (!u.p.includes(target)) return m.reply('`❌ Questo sangue non appartiene alla tua lista dei figli.`');
        u.p = u.p.filter(id => id !== target);
        global.db.data.users[target].s = null;
        return m.reply(`🚫 *L'ALBERO È STATO RECISO...* \n\nCon un atto severo, @${target.split('@')[0]} è stato rimosso dalla dinastia.`, null, { mentions: [target] });
    }

    if (command === 'rifiuta') {
        if (global.marriage_proposals[user] && user === global.marriage_proposals[user].target) {
            delete global.marriage_proposals[user];
            return m.reply('💔 *La proposta è stata rifiutata. Un cuore rimane solitario...*');
        }
        if (global.adoption_proposals[user] && user === global.adoption_proposals[user].target) {
            delete global.adoption_proposals[user];
            return m.reply('🥀 *L\'invito è stato declinato. Il viaggio continua in solitudine.*');
        }
    }
}

handler.help = ['albero', 'sposa', 'adotta', 'disereda', 'divorzia']
handler.tags = ['famiglia']
handler.command = /^(famiglia|albero|famigliamia|sposa|accettasposa|accettaadozione|rifiuta|adotta|divorzia|disereda)$/i

export default handler
