// Plug-in creato da elixir
import fs from 'fs'
import path from 'path'
import { createCanvas, loadImage } from 'canvas'

const marriagesFile = path.resolve('media/database/sposi.json');

const checkUser = (id) => {
    if (!id) return
    if (!global.db.data.users[id]) global.db.data.users[id] = {}
    let u = global.db.data.users[id]
    if (!Array.isArray(u.p)) u.p = [] 
    if (u.s === undefined) u.s = null 
}

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

    // PULIZIA NOME PER CANVAS
    ctx.fillStyle = '#cdd6f4';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    let rawName = await conn.getName(id);
    let cleanName = rawName.replace(/[^\x00-\x7F]/g, "").trim() || "User"; 
    let finalName = cleanName.substring(0, 12);
    
    ctx.fillText(finalName, x - 20, y - 5);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.font = '10px sans-serif';
    ctx.fillText(role, x - 20, y + 15);
}

let handler = async (m, { conn, command }) => {
    let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : m.sender);
    checkUser(target);
    
    let marriages = {};
    if (fs.existsSync(marriagesFile)) marriages = JSON.parse(fs.readFileSync(marriagesFile, 'utf8'));

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
    return conn.sendMessage(m.chat, { image: canvas.toBuffer(), caption: `👑 *ALBERO GENEALOGICO*`, mentions: [target] }, { quoted: m });
}

handler.help = ['albero']
handler.tags = ['famiglia']
handler.command = /^(albero|famigliamia)$/i
export default handler
