// Plug-in creato da elixir
import fs from 'fs'
import path from 'path'
import { createCanvas, loadImage, registerFont } from 'canvas'

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
    const radius = 15;

    // Shadow & Card Background
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#1e1e2e';
    ctx.beginPath();
    ctx.roundRect(x - cardW/2, y - cardH/2, cardW, cardH, radius);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Border basato sul ruolo
    ctx.strokeStyle = role === 'GENITORE' ? '#f5c2e7' : (role === 'PARTNER' ? '#f38ba8' : '#89b4fa');
    ctx.lineWidth = 2;
    ctx.stroke();

    // Avatar
    try {
        let url = await conn.profilePictureUrl(id, 'image').catch(() => 'https://telegra.ph/file/2416c30c33306fa33c5e0.jpg');
        let img = await loadImage(url);
        ctx.save();
        ctx.beginPath();
        ctx.arc(x - 55, y, 25, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, x - 80, y - 25, 50, 50);
        ctx.restore();
    } catch (e) {}

    // Testo
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

    if (command === 'albero' || command === 'famigliamia') {
        let target = m.mentionedJid[0] || user;
        checkUser(target);
        await m.reply('⏳ *Sto dipingendo la tua dinastia...*');

        const canvas = createCanvas(900, 1000);
        const ctx = canvas.getContext('2d');

        // Background Gradient Elegante
        const bg = ctx.createLinearGradient(0, 0, 900, 1000);
        bg.addColorStop(0, '#11111b');
        bg.addColorStop(1, '#181825');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, 900, 1000);

        let u = global.db.data.users[target];
        let partner = marriages[target];
        let padre = u.s;
        let figli = u.p || [];

        const centerX = 450;
        
        // 1. Disegna Genitore (Sopra)
        if (padre) {
            await drawUserCard(ctx, conn, padre, centerX, 150, 'GENITORE');
            ctx.strokeStyle = '#45475a';
            ctx.setLineDash([5, 5]);
            ctx.beginPath(); ctx.moveTo(centerX, 185); ctx.lineTo(centerX, 265); ctx.stroke();
            ctx.setLineDash([]);
        }

        // 2. Disegna Tu e Partner (Centro)
        if (partner) {
            await drawUserCard(ctx, conn, target, centerX - 120, 300, 'IO');
            await drawUserCard(ctx, conn, partner, centerX + 120, 300, 'PARTNER');
            // Linea Unione
            ctx.strokeStyle = '#f38ba8';
            ctx.beginPath(); ctx.moveTo(centerX - 30, 300); ctx.lineTo(centerX + 30, 300); ctx.stroke();
        } else {
            await drawUserCard(ctx, conn, target, centerX, 300, 'IO');
        }

        // 3. Disegna Figli (Sotto)
        if (figli.length > 0) {
            const startY = 450;
            const spacing = 220;
            const totalWidth = (figli.length - 1) * spacing;
            const startX = centerX - (totalWidth / 2);

            // Linea verticale principale verso i figli
            ctx.strokeStyle = '#45475a';
            ctx.beginPath(); ctx.moveTo(centerX, 335); ctx.lineTo(centerX, 380); ctx.stroke();
            
            // Linea orizzontale di collegamento figli
            ctx.beginPath(); ctx.moveTo(startX, 380); ctx.lineTo(startX + totalWidth, 380); ctx.stroke();

            for (let i = 0; i < figli.length; i++) {
                let fX = startX + (i * spacing);
                ctx.beginPath(); ctx.moveTo(fX, 380); ctx.lineTo(fX, 415); ctx.stroke();
                await drawUserCard(ctx, conn, figli[i], fX, 450, 'FIGLIO/A');
            }
        }

        let buffer = canvas.toBuffer();
        return conn.sendMessage(m.chat, { image: buffer, caption: `👑 *Dinastia di ${await conn.getName(target)}*` }, { quoted: m });
    }
    
    // ... mantieni qui le altre funzioni (sposa, divorzia, adotta) dal tuo codice precedente ...
};

handler.command = /^(albero|famigliamia|famiglia|sposa|accettasposa|divorzia|adotta|disereda)$/i;
export default handler;
