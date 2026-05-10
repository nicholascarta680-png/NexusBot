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
        let url = await conn.profilePictureUrl(id, 'image').catch(() => 'https://telegra.ph');
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
let handler = async (m, { conn, command, usedPrefix, isOwner }) => {
    let user = m.sender;
    checkUser(user);
    marriages = loadMarriages(); // Ricarica per sicurezza

    // --- COMANDO RESET GLOBALE ---
    if ((command === 'resetallfamiglia' || command === 'purgatree') && isOwner) {
        await m.reply('`⏳ Epurazione globale in corso...`')
        marriages = {}
        saveMarriages()
        let users = global.db.data.users
        let count = 0
        Object.keys(users).forEach(jid => {
            if (users[jid].p || users[jid].s) {
                users[jid].p = []
                users[jid].s = null
                count++
            }
        })
        return m.reply(`✅ *Tabula Rasa completata.*\nRegistri azzerati e ${count} profili purgati.`)
    }

    // --- COMANDO RESET SINGOLO ---
    if (command === 'resetfamiglia' && isOwner) {
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null)
        if (!target) return m.reply('`⚠️ Tagga o rispondi a qualcuno per resettare la sua dinastia.`')
        
        // Rimuove matrimonio
        let partner = marriages[target]
        if (partner) {
            delete marriages[target]
            delete marriages[partner]
            saveMarriages()
        }

        // Pulisce parentele
        if (global.db.data.users[target]) {
            let u = global.db.data.users[target]
            if (u.p) u.p.forEach(figlio => { if(global.db.data.users[figlio]) global.db.data.users[figlio].s = null })
            if (u.s) {
                let gen = u.s
                if(global.db.data.users[gen] && global.db.data.users[gen].p) 
                    global.db.data.users[gen].p = global.db.data.users[gen].p.filter(id => id !== target)
            }
            u.p = []; u.s = null
        }
        return m.reply(`🧹 Dinastia di @${target.split('@')[0]} resettata con successo.`, null, { mentions: [target] })
    }

    // --- COMANDO ALBERO ---
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

    // --- COMANDO MENU ---
    if (command === 'famiglia') {
        let menu = `  ⋆｡˚『 ╭ \`SISTEMA DINASTICO\` ╯ 』˚｡⋆\n\n`
        menu += `  │ 💍 *${usedPrefix}sposa* @tag\n`
        menu += `  │ 💔 *${usedPrefix}divorzia*\n`
        menu += `  │ 👶 *${usedPrefix}adotta* @tag\n`
        menu += `  │ 🌳 *${usedPrefix}albero* @tag\n`
        if (isOwner) menu += `  │ 🧹 *${usedPrefix}resetfamiglia* @tag\n`
        if (isOwner) menu += `  │ ☢️ *${usedPrefix}resetallfamiglia*\n`
        menu += `  ╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒`
        return m.reply(menu)
    }
}

handler.help = ['albero', 'resetfamiglia', 'resetallfamiglia']
handler.tags = ['famiglia']
handler.command = /^(famiglia|albero|famigliamia|resetfamiglia|resetallfamiglia|purgatree)$/i

export default handler
