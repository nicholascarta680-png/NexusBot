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
    const cardW = 200, cardH = 80;
    
    // Effetto Glow Esterno
    ctx.save();
    ctx.shadowColor = role === 'GENITORE' ? '#f5c2e7' : (role === 'PARTNER' ? '#f38ba8' : '#89b4fa');
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#11111b';
    ctx.beginPath();
    ctx.roundRect(x - cardW/2, y - cardH/2, cardW, cardH, 20);
    ctx.fill();
    ctx.restore();

    // Bordo Sfumato
    let grad = ctx.createLinearGradient(x - 100, y, x + 100, y);
    grad.addColorStop(0, ctx.shadowColor);
    grad.addColorStop(1, '#cdd6f4');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 3;
    ctx.stroke();

    try {
        let url = await conn.profilePictureUrl(id, 'image').catch(() => 'https://telegra.ph');
        let img = await loadImage(url);
        ctx.save();
        ctx.beginPath(); 
        ctx.arc(x - 60, y, 30, 0, Math.PI * 2); 
        ctx.clip();
        ctx.drawImage(img, x - 90, y - 30, 60, 60); 
        ctx.restore();
    } catch (e) {}

    // Testo Elegante
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

let handler = async (m, { conn, command }) => {
    let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : m.sender);
    checkUser(target);
    
    let marriages = {};
    if (fs.existsSync(marriagesFile)) marriages = JSON.parse(fs.readFileSync(marriagesFile, 'utf8'));

    const canvas = createCanvas(1000, 900);
    const ctx = canvas.getContext('2d');

    // Sfondo Spaziale/Elegante
    const bg = ctx.createRadialGradient(500, 450, 50, 500, 450, 600);
    bg.addColorStop(0, '#1e1e2e');
    bg.addColorStop(1, '#000000');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1000, 900);

    // Particelle (Stelle)
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 100; i++) {
        ctx.globalAlpha = Math.random();
        ctx.beginPath();
        ctx.arc(Math.random() * 1000, Math.random() * 900, Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    let u = global.db.data.users[target];
    let partner = marriages[target];
    let padre = u.s;
    let figli = u.p || [];
    const centerX = 500;

    // Linee di collegamento curve
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
        ctx.setLineDash([]);
        ctx.strokeStyle = '#f38ba8';
        ctx.beginPath(); ctx.moveTo(centerX - 40, 350); ctx.lineTo(centerX + 40, 350); ctx.stroke();
    } else {
        await drawUserCard(ctx, conn, target, centerX, 350, 'IO');
    }

    if (figli.length > 0) {
        const spacing = 250;
        const startX = centerX - ((figli.length - 1) * spacing / 2);
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = "rgba(205, 214, 244, 0.3)";
        ctx.beginPath(); ctx.moveTo(centerX, 390); ctx.lineTo(centerX, 450); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(startX, 450); ctx.lineTo(startX + (figli.length - 1) * spacing, 450); ctx.stroke();
        for (let i = 0; i < figli.length; i++) {
            let fX = startX + (i * spacing);
            ctx.beginPath(); ctx.moveTo(fX, 450); ctx.lineTo(fX, 490); ctx.stroke();
            await drawUserCard(ctx, conn, figli[i], fX, 550, 'FIGLIO/A');
        }
    }

    // Invia come GIF/Video per simulare animazione (necessita di plugin ffmpeg se convertito, 
    // altrimenti lo mandiamo come immagine con caption stilizzata)
    return conn.sendMessage(m.chat, { 
        image: canvas.toBuffer(), 
        caption: `✨ *DINASTIA REALE* ✨\n\n` +
                 `╰⭒ Alza lo sguardo verso le stelle.. @${target.split('@')[0]}`,
        mentions: [target] 
    }, { quoted: m });
}

handler.command = /^(albero|famigliamia)$/i
export default handler
