import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { createCanvas, loadImage } from 'canvas';
import https from 'https';
import ffmpeg from 'fluent-ffmpeg';

const TRANSFER_FEE = 0.03;
const MIN_AMOUNT = 100;

const DEPOSIT_MESSAGES = [
    'Transazione sicura',
    'Crittografia dati',
    'Trasferimento nel caveau',
    'Finalizzazione'
];

const downloadEmoji = async (emoji, size = 72) => {
    const url = `https://emojicdn.elk.sh/${emoji}?style=apple&size=${size}`;
    
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`emoji non caricata: ${response.statusCode}`));
                return;
            }
            
            const chunks = [];
            response.on('data', chunk => chunks.push(chunk));
            response.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
        }).on('error', reject);
    });
};

const createAnimationFrame = async (frameNumber, totalFrames, senderName, receiverName) => {
    const canvas = createCanvas(800, 500);
    const ctx = canvas.getContext('2d');
    const bgGradient = ctx.createLinearGradient(0, 0, 800, 500);
    bgGradient.addColorStop(0, '#1a1a2e');
    bgGradient.addColorStop(0.3, '#16213e');
    bgGradient.addColorStop(0.6, '#0f3460');
    bgGradient.addColorStop(1, '#533483');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 800, 500);
    const time = frameNumber * 0.05;
    for (let i = 0; i < 100; i++) {
        const x = (i * 15 + time * 40) % 850;
        const y = (i * 13 + time * 25) % 550;
        const size = Math.sin(time + i * 0.1) * 0.8 + 1.2;
        const opacity = Math.sin(time + i * 0.2) * 0.3 + 0.15;
        
        ctx.fillStyle = `rgba(100, 200, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.save();
    ctx.globalAlpha = 0.1;
    for (let wave = 0; wave < 3; wave++) {
        const waveOffset = time + wave * 2;
        ctx.beginPath();
        ctx.moveTo(0, 250 + Math.sin(waveOffset) * 30);
        for (let x = 0; x <= 800; x += 10) {
            const y = 250 + Math.sin(waveOffset + x * 0.01) * 30 + wave * 20;
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = '#64c8ff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    ctx.restore();
    
    const progress = frameNumber / (totalFrames - 1);
    
    try {
        const cardEmojiBuffer = await downloadEmoji('💳', 40);
        const cardEmojiImage = await loadImage(cardEmojiBuffer);
        
        const diamondEmojiBuffer = await downloadEmoji('💎', 28);
        const diamondEmojiImage = await loadImage(diamondEmojiBuffer);
        
        const euroEmojiBuffer = await downloadEmoji('💰', 32);
        const euroEmojiImage = await loadImage(euroEmojiBuffer);
        ctx.save();
        ctx.shadowColor = 'rgba(100, 200, 255, 0.8)';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        
        const titleText = 'Trasferimento Euro';
        const titleMetrics = ctx.measureText(titleText);
        const titleWidth = titleMetrics.width;
        ctx.drawImage(cardEmojiImage, 400 - titleWidth/2 - 60, 40, 40, 40);
        ctx.fillText(titleText, 400, 75);
        ctx.drawImage(diamondEmojiImage, 400 + titleWidth/2 + 20, 48, 28, 28);
        ctx.restore();
        ctx.save();
        ctx.translate(150, 200);
        const cardTilt = Math.sin(time * 2) * 0.05;
        ctx.rotate(cardTilt);
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 8;
        const cardGradient = ctx.createLinearGradient(-80, -50, 80, 50);
        cardGradient.addColorStop(0, '#ff6b6b');
        cardGradient.addColorStop(0.5, '#ff8787');
        cardGradient.addColorStop(1, '#ff5252');
        ctx.fillStyle = cardGradient;
        ctx.fillRect(-80, -50, 160, 100);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(-80, -50, 160, 100);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(-70, -40, 140, 3);
        ctx.fillRect(-70, 30, 60, 3);
        ctx.drawImage(cardEmojiImage, -20, -35, 40, 40);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(senderName.length > 12 ? senderName.substring(0, 12) + '...' : senderName, 0, 30);
        ctx.restore();
        ctx.save();
        ctx.translate(650, 200);
        ctx.rotate(-cardTilt);
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetX = -5;
        ctx.shadowOffsetY = 8;
        const cardGradient2 = ctx.createLinearGradient(-80, -50, 80, 50);
        cardGradient2.addColorStop(0, '#4ecdc4');
        cardGradient2.addColorStop(0.5, '#5ed3ca');
        cardGradient2.addColorStop(1, '#26a69a');
        ctx.fillStyle = cardGradient2;
        ctx.fillRect(-80, -50, 160, 100);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(-80, -50, 160, 100);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(-70, -40, 140, 3);
        ctx.fillRect(-70, 30, 60, 3);
        ctx.drawImage(cardEmojiImage, -20, -35, 40, 40);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(receiverName.length > 12 ? receiverName.substring(0, 12) + '...' : receiverName, 0, 30);
        ctx.restore();
        const connectionY = 200;
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.lineDashOffset = -time * 20;
        ctx.beginPath();
        ctx.moveTo(230, connectionY);
        ctx.lineTo(570, connectionY);
        ctx.stroke();
        ctx.restore();
        if (progress > 0.1 && progress < 0.9) {
            for (let wave = 0; wave < 6; wave++) {
                const waveProgress = (progress * 2 + wave * 0.3) % 1;
                if (waveProgress > 0 && waveProgress < 1) {
                    const waveX = 230 + (570 - 230) * waveProgress;
                    const waveY = connectionY + Math.sin(waveProgress * Math.PI * 2) * 10;
                    ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
                    ctx.beginPath();
                    ctx.arc(waveX, waveY, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        
        const coinCount = 20;
        for (let i = 0; i < coinCount; i++) {
            const coinDelay = i * 0.04;
            const coinProgress = Math.max(0, Math.min(1, (progress - coinDelay) / 0.6));
            
            if (coinProgress > 0) {
                const startX = 230;
                const endX = 570;
                const baseY = connectionY;
                const coinX = startX + (endX - startX) * coinProgress;
                const arc = Math.sin(coinProgress * Math.PI) * 80;
                const coinY = baseY - arc;
                const rotation = coinProgress * Math.PI * 8;
                const scale = 0.5 + Math.sin(coinProgress * Math.PI) * 0.4;
                ctx.save();
                ctx.translate(coinX, coinY);
                ctx.rotate(rotation);
                ctx.scale(scale, scale);
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetY = 5;
                const coinGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 25);
                coinGradient.addColorStop(0, '#ffd700');
                coinGradient.addColorStop(0.4, '#ffed4e');
                coinGradient.addColorStop(0.7, '#f1c40f');
                coinGradient.addColorStop(1, '#d4ac0d');
                ctx.fillStyle = coinGradient;
                ctx.beginPath();
                ctx.arc(0, 0, 25, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#b7950b';
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.fillStyle = '#8b4513';
                ctx.font = 'bold 28px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('€', 0, 10);
                ctx.restore();
                if (coinProgress > 0.1) {
                    ctx.save();
                    ctx.globalAlpha = (coinProgress - 0.1) * 2;
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    for (let sparkle = 0; sparkle < 3; sparkle++) {
                        const sparkleAngle = (sparkle / 3) * Math.PI * 2 + time * 5;
                        const sparkleDistance = 30;
                        const sparkleX = coinX + Math.cos(sparkleAngle) * sparkleDistance;
                        const sparkleY = coinY + Math.sin(sparkleAngle) * sparkleDistance;
                        ctx.beginPath();
                        ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();
                }
            }
        }
        const progressBarY = 350;
        const progressBarWidth = 500;
        const progressBarHeight = 12;
        const progressBarX = (800 - progressBarWidth) / 2;
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
        const progressGradient = ctx.createLinearGradient(progressBarX, progressBarY, progressBarX + progressBarWidth, progressBarY);
        progressGradient.addColorStop(0, '#ff6b6b');
        progressGradient.addColorStop(0.5, '#ffd700');
        progressGradient.addColorStop(1, '#4ecdc4');
        ctx.fillStyle = progressGradient;
        ctx.fillRect(progressBarX, progressBarY, progressBarWidth * progress, progressBarHeight);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight);
        ctx.restore();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 3;
        ctx.fillText(`${Math.round(progress * 100)}%`, 400, 340);
        if (progress > 0.85) {
            const sparkleEmojiBuffer = await downloadEmoji('✨', 20);
            const sparkleEmojiImage = await loadImage(sparkleEmojiBuffer);
            for (let i = 0; i < 30; i++) {
                const angle = (i / 30) * Math.PI * 2;
                const distance = (progress - 0.85) * 150;
                const particleX = 650 + Math.cos(angle) * distance;
                const particleY = 200 + Math.sin(angle) * distance;
                ctx.save();
                ctx.globalAlpha = Math.max(0, 1 - (progress - 0.85) * 4);
                ctx.drawImage(sparkleEmojiImage, particleX - 10, particleY - 10, 20, 20);
                ctx.restore();
            }
            ctx.save();
            ctx.globalAlpha = Math.max(0, 1 - (progress - 0.85) * 4);
            const successGradient = ctx.createRadialGradient(650, 200, 0, 650, 200, 100);
            successGradient.addColorStop(0, 'rgba(76, 205, 76, 0.3)');
            successGradient.addColorStop(1, 'rgba(76, 205, 76, 0)');
            ctx.fillStyle = successGradient;
            ctx.beginPath();
            ctx.arc(650, 200, 100, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        let statusText = '';
        let statusColor = '#ffffff';
        if (progress < 0.2) {
            statusText = '🔄 Inizializzazione trasferimento...';
        } else if (progress < 0.4) {
            statusText = '🔐 Verifica sicurezza...';
        } else if (progress < 0.6) {
            statusText = '💸 Elaborazione pagamento...';
        } else if (progress < 0.8) {
            statusText = '📊 Conclusione transazione...';
        } else {
            statusText = '✅ Trasferimento completato!';
            statusColor = '#4ecdc4';
        }
        
        ctx.fillStyle = statusColor;
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 2;
        ctx.fillText(statusText, 400, 420);
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.translate(750, 450);
        ctx.rotate(Math.sin(time * 3) * 0.2);
        ctx.drawImage(euroEmojiImage, -16, -16, 32, 32);
        ctx.restore();
        
    } catch (error) {
        console.error('Errore caricamento emoji:', error);
        ctx.save();
        ctx.shadowColor = 'rgba(100, 200, 255, 0.8)';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💳 Trasferimento Euro 💎', 400, 75);
        ctx.restore();
    }
    
    return canvas.toBuffer('image/png');
};

const createTransferAnimation = async (transactionId, senderName, receiverName) => {
    const totalFrames = 120;
    const outputPath = path.resolve(`./temp/transfer_${transactionId}.mp4`);
    const tempDir = path.resolve('./temp');
    
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const framePromises = [];
    for (let i = 0; i < totalFrames; i++) {
        framePromises.push(
            createAnimationFrame(i, totalFrames, senderName, receiverName)
                .then(frameBuffer => {
                    const framePath = path.resolve(tempDir, `frame_${i.toString().padStart(3, '0')}.png`);
                    fs.writeFileSync(framePath, frameBuffer);
                    return framePath;
                })
                .catch(error => {
                    console.error(`Errore creazione frame ${i}:`, error);
                    throw error;
                })
        );
    }
    
    try {
        const framePaths = await Promise.all(framePromises);
        
        return new Promise((resolve, reject) => {
            const inputPattern = path.resolve(tempDir, 'frame_%03d.png').replace(/\\/g, '/');
            
            ffmpeg()
                .input(inputPattern)
                .inputOptions([
                    '-framerate 24',
                    '-start_number 0'
                ])
                .outputOptions([
                    '-c:v libx264',
                    '-pix_fmt yuv420p',
                    '-t 5',
                    '-crf 18',
                    '-preset slow',
                    '-y'
                ])
                .output(outputPath)
                .on('end', () => {
                    // Pulizia frames
                    framePaths.forEach(framePath => {
                        try {
                            if (fs.existsSync(framePath)) {
                                fs.unlinkSync(framePath);
                            }
                        } catch (e) {
                            console.log('Errore pulizia frame:', e.message);
                        }
                    });
                    resolve(outputPath);
                })
                .on('error', (error) => {
                    console.error('Errore FFmpeg:', error);
                    // Pulizia frames anche in caso di errore
                    framePaths.forEach(framePath => {
                        try {
                            if (fs.existsSync(framePath)) {
                                fs.unlinkSync(framePath);
                            }
                        } catch (e) {
                            console.log('Errore pulizia frame:', e.message);
                        }
                    });
                    reject(error);
                })
                .run();
        });
    } catch (error) {
        console.error('Errore durante la creazione dei frames:', error);
        throw error;
    }
};

// Funzione per convertire componente in HTML string
const renderDepositHTML = (props) => {
    const componentHTML = `<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deposit</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif; }
        
        @keyframes pulse-glow {
            0% { box-shadow: 0 5px 25px rgba(0,255,127,0.3), 0 0 0 0px rgba(0, 255, 127, 0.7); }
            50% { box-shadow: 0 5px 25px rgba(0,255,127,0.5), 0 0 0 10px rgba(0, 255, 127, 0.3); }
            100% { box-shadow: 0 5px 25px rgba(0,255,127,0.3), 0 0 0 0px rgba(0, 255, 127, 0); }
        }
        
        @keyframes glow {
            0%, 100% { text-shadow: 0 0 10px #7DF9FF, 0 0 20px #7DF9FF, 0 0 30px #7DF9FF; }
            50% { text-shadow: 0 0 20px #7DF9FF, 0 0 30px #7DF9FF, 0 0 40px #7DF9FF; }
        }
        
        @keyframes grid-move {
            0% { transform: translateX(0) translateY(0); }
            100% { transform: translateX(100px) translateY(100px); }
        }
        
        .container {
            width: 1080px;
            height: 1080px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            background: linear-gradient(145deg, #0d1120, #2c3e50);
            position: relative;
            overflow: hidden;
        }
        
        .bg-grid {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 98px,
                    rgba(74, 0, 224, 0.1) 100px
                ),
                repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 98px,
                    rgba(74, 0, 224, 0.1) 100px
                );
            animation: grid-move 20s linear infinite;
            z-index: 0;
        }
        
        .checkmark {
            position: absolute;
            top: 40px;
            left: 40px;
            z-index: 10;
            filter: drop-shadow(0 0 8px #00ff7f);
        }
        
        .info-badge {
            position: absolute;
            top: 40px;
            right: 40px;
            background: rgba(255, 255, 255, 0.15);
            padding: 15px 20px;
            border-radius: 15px;
            font-size: 14px;
            text-align: center;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 10;
        }
        
        .main-content {
            z-index: 5;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }
        
        .profile-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 30px;
        }
        
        .profile-pic {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #00ff7f;
            animation: pulse-glow 2.5s ease-out infinite;
        }
        
        .username {
            margin-top: 15px;
            font-size: 34px;
            font-weight: 600;
            text-shadow: 0 2px 5px rgba(0,0,0,0.5);
        }
        
        .amount-box {
            background: rgba(255, 255, 255, 0.05);
            padding: 25px 50px;
            border-radius: 20px;
            margin-bottom: 25px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        
        .amount-main {
            font-size: 52px;
            font-weight: bold;
            text-align: center;
            animation: glow 2s ease-in-out infinite;
        }
        
        .amount-sub {
            font-size: 22px;
            text-align: center;
            opacity: 0.8;
            margin-top: 8px;
        }
        
        .balance-box {
            background: rgba(0,0,0,0.25);
            padding: 30px;
            border-radius: 20px;
            width: 90%;
            max-width: 550px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        
        .balance-row {
            font-size: 26px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .balance-row:first-child {
            margin-bottom: 15px;
        }
        
        .wallet-amount { color: #7DF9FF; font-weight: bold; }
        .bank-amount { color: #00ff7f; font-weight: bold; }
        
        .footer {
            z-index: 5;
            position: absolute;
            bottom: 40px;
            text-align: center;
        }
        
        .footer-message {
            font-size: 20px;
            font-style: italic;
            opacity: 0.9;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        
        .footer-timestamp {
            font-size: 16px;
            opacity: 0.7;
            margin-top: 5px;
        }
        
        .watermark {
            position: absolute;
            bottom: 15px;
            right: 20px;
            font-size: 14px;
            opacity: 0.4;
            font-weight: 500;
            z-index: 10;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="bg-grid"></div>
        
        <svg class="checkmark" width="60" height="60" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="25" fill="#00ff7f" opacity="0.2"/>
            <path d="M14 27 L 22 35 L 38 18" fill="none" stroke="white" stroke-width="5" stroke-linecap="round"/>
        </svg>
        
        <div class="info-badge">
            💰 Deposito Sicuro<br/>
            🔒 Transazione Protetta
        </div>
        
        <div class="main-content">
            <div class="profile-section">
                <img src="${props.profilePictureUrl}" class="profile-pic" alt="Profile">
                <div class="username">${props.userName}</div>
            </div>
            
            <div class="amount-box">
                <div class="amount-main">${props.amount} 🌟</div>
                <div class="amount-sub">Importo Depositato</div>
            </div>
            
            <div class="balance-box">
                <div class="balance-row">
                    <span>💼 Portafoglio</span>
                    <span class="wallet-amount">${props.walletBalance} 🌟</span>
                </div>
                <div class="balance-row">
                    <span>🏦 In Banca</span>
                    <span class="bank-amount">${props.bankBalance} 🌟</span>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-message">${props.message}</div>
            <div class="footer-timestamp">${props.timestamp}</div>
        </div>
        
        <div class="watermark">✧˚🩸 varebot 🕊️˚✧</div>
    </div>
</body>
</html>`;
    return componentHTML;
};

// Funzione per creare screenshot con Puppeteer
const createDepositImage = async (props, browserInstance = null) => {
    let browser = browserInstance;
    let shouldCloseBrowser = !browser;

    if (!browser) {
        browser = await puppeteer.launch({ 
            headless: true, 
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox', 
                '--disable-dev-shm-usage', 
                '--disable-gpu',
                '--disable-web-security',
                '--font-render-hinting=none'
            ]
        });
    }

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 });
        await page.setDefaultTimeout(15000);

        const html = renderDepositHTML(props);
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        // Attendi che le animazioni CSS si carichino
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const screenshotPath = path.resolve(`./temp/deposit_${Date.now()}.png`);

        await page.screenshot({
            path: screenshotPath,
            type: 'png',
            fullPage: false,
            clip: {
                x: 0,
                y: 0,
                width: 1080,
                height: 1080
            }
        });

        await page.close();
        return screenshotPath;
    } finally {
        if (shouldCloseBrowser && browser) {
            await browser.close();
        }
    }
};

function getRank(euro) {
    if (euro >= 100000) return { name: '*CEO*', emoji: '💼' };
    if (euro >= 50000) return { name: '*INVESTITORE*', emoji: '📈' };
    if (euro >= 25000) return { name: '*AVVOCATO*', emoji: '⚖️' };
    if (euro >= 10000) return { name: '*INGEGNERE*', emoji: '🛠️' };
    if (euro >= 5000) return { name: '*COMMESSO*', emoji: '🛍️' };
    return { name: '*TIROCINANTE*', emoji: '🧑‍💼' };
}

function getNextRank(euro) {
    if (euro >= 100000) return { name: '*LIVELLO MAX*', emoji: '👑', required: 0 };
    if (euro >= 50000) return { name: 'CEO', emoji: '💼', required: 100000 };
    if (euro >= 25000) return { name: 'INVESTITORE', emoji: '📈', required: 50000 };
    if (euro >= 10000) return { name: 'AVVOCATO', emoji: '⚖️', required: 25000 };
    if (euro >= 5000) return { name: 'INGEGNERE', emoji: '🛠️', required: 10000 };
    return { name: 'COMMESSO', emoji: '🛍️', required: 5000 };
}

function formatNumber(num) {
    return num.toLocaleString('it-IT');
}

let handler = async (m, { conn, usedPrefix, command, args, text, participants }) => {
    let user = global.db.data.users[m.sender];
    const formatCurrency = (n) => n.toLocaleString('it-IT');

    switch (command) {
        case 'portafoglio':
            let who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender;
            if (who == conn.user.jid) return;
            if (!(who in global.db.data.users)) return conn.reply(m.chat, '『 ㌌ 』- \`Non sei nel mio database.\`', m);
            
            let targetUser = global.db.data.users[who];
            const highestBalance = targetUser.highestBalance || targetUser.euro;
            const rank = getRank(targetUser.euro);
            const nextRank = getNextRank(targetUser.euro);
            const totalBalance = targetUser.euro + (targetUser.bank || 0);

            let messaggio = `
╔══════════════════╗
      *🏦 PORTAFOGLIO*
╚══════════════════╝

  👤 *UTENTE:* @${who.split('@')[0]}
  ${rank.emoji} *RANK:* ${rank.name}

  ┏━━━━━━━━━━━━━━━━━━┓
  ┃      *BILANCIO*
  ┗━━━━━━━━━━━━━━━━━━┛
  💵 *Contanti:* \`${formatNumber(targetUser.euro)} €\`
  🏛️ *Banca:* \`${formatNumber(targetUser.bank || 0)} €\`
  💳 *Totale:* \`[ ${formatNumber(totalBalance)} € ]\`

  ┏━━━━━━━━━━━━━━━━━━┓
  ┃    *STATISTICHE*
  ┗━━━━━━━━━━━━━━━━━━┛
  🏆 *Record:* \`${formatNumber(highestBalance)} €\`
  🎯 *Target:* ${nextRank.emoji} ${nextRank.name}
  🚧 *Mancano:* \`${formatNumber(Math.max(0, nextRank.required - targetUser.euro))} €\`

  *–––––––––––––––––––––––––*
  _Usa ${usedPrefix}casino per spendere o vedi il menu per le funzioni_`.trim();

            await m.reply(messaggio, null, { mentions: [who] });
            break;

        case 'preleva':
            if (!args[0]) {
                let message = `
*╭───╼ 🏦 ╾───╮*
    *PRELIEVO BANCA*
*╰───╼ ⚡ ╾───╯*

👋 Ciao @${m.sender.split('@')[0]},
indica la quantità di euro da prelevare.

*┏━━━━━━━━━━━━━━━━┓*
*┃* 💰 *IN BANCA:* ${formatNumber(user.bank || 0)}
*┃* 👛 *PORTAFOGLIO:* ${formatNumber(user.euro || 0)}
*┗━━━━━━━━━━━━━━━━┛*

*『✏️』 ESEMPI:*
• *${usedPrefix + command} 500*
• *${usedPrefix + command} tutto*

━━━━━━━━━━━━━━━━━━━━`.trim()

                const buttons = [
                    { buttonId: `${usedPrefix + command} tutto`, buttonText: { displayText: '💰 TUTTO' }, type: 1 },
                    { buttonId: `${usedPrefix + command} 1000`, buttonText: { displayText: '💶 1.000' }, type: 1 },
                    { buttonId: `${usedPrefix + command} 5000`, buttonText: { displayText: '🏧 5.000' }, type: 1 }
                ]

                return await conn.sendMessage(m.chat, {
                    text: message,
                    footer: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙʟᴅ ʙʟᴏᴏᴅ ʙᴏᴛ',
                    buttons: buttons,
                    headerType: 1,
                    mentions: [m.sender]
                }, { quoted: m })
            }

            if (args[0].toLowerCase() === 'tutto' || args[0].toLowerCase() === 'all') {
                if (!user.bank || user.bank <= 0) {
                    return m.reply(`*⚠️ Non hai euro depositati da ritirare!*`)
                }

                let count = parseInt(user.bank)
                user.bank -= count
                user.euro += count

                return m.reply(`
*╭───╼ ✅ ╾───╮*
    *RITIRO ESEGUITO*
*╰───╼ ⚡ ╾───╯*

✨ *Operazione completata con successo!*

*┏━━━━━━━━━━━━━━━━┓*
*┃* 💵 *RITIRATI:* +${formatNumber(count)}
*┃* 🏦 *BANCA:* 0
*┃* 👛 *IN MANO:* ${formatNumber(user.euro)}
*┗━━━━━━━━━━━━━━━━┛*
*ID Transazione:* _#${Math.random().toString(36).substr(2, 6).toUpperCase()}_

━━━━━━━━━━━━━━━━━━━━`.trim())
            }

            if (!Number(args[0])) return m.reply(`*🔢 Inserisci una cifra numerica valida!*`)

            let count = parseInt(args[0])
            if (count <= 0) return m.reply(`*💀 Vuoi ritirare zero o meno? Riprova.*`)

            if (!user.bank || user.bank <= 0) return m.reply(`*📉 La tua banca è vuota.*`)

            if (user.bank < count) return m.reply(`*🚫 Non hai abbastanza fondi! Hai solo ${formatNumber(user.bank)} € in banca.*`)

            user.bank -= count
            user.euro += count

            return m.reply(`
*╭───╼ ✅ ╾───╮*
    *RITIRO ESEGUITO*
*╰───╼ ⚡ ╾───╯*

✨ *Operazione completata con successo!*

*┏━━━━━━━━━━━━━━━━┓*
*┃* 💵 *RITIRATI:* +${formatNumber(count)}
*┃* 🏦 *BANCA:* ${formatNumber(user.bank)}
*┃* 👛 *IN MANO:* ${formatNumber(user.euro)}
*┗━━━━━━━━━━━━━━━━┛*
*ID Transazione:* _#${Math.random().toString(36).substr(2, 6).toUpperCase()}_

━━━━━━━━━━━━━━━━━━━━`.trim())
            break;

        case 'deposita':
            if (!args[0]) {
                await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                return m.reply(`
ㅤㅤ⋆｡˚『 ╭ \`DEPOSITO\` ╯ 』˚｡⋆\n╭\n│
│ 『 💎 』 *\`euro disponibili:\`* *${user.euro || 0}*
│ 『 🏦 』 *\`euro in banca:\`* *${user.bank || 0}*
│
│ 『 📝 』 _*Comandi disponibili:*_
│ • \`.deposita [quantità]\`
│ • \`.deposita all\`
│
│ 『 💡 』 _*Esempio:*_
│ \`.deposita 1000\`
│
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`);
            }

            let countDep;
            if (args[0].toLowerCase() === 'all') {
                countDep = parseInt(user.euro);
                if (!countDep || countDep < 1) {
                    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return m.reply('『 ❌ 』- Non hai euro da depositare.');
                }
            } else {
                countDep = parseInt(args[0].replace(/\./g, ''));
                if (isNaN(countDep) || countDep < 1) {
                    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return m.reply('『 ❌ 』- Quantità non valida.');
                }
                if (!user.euro || user.euro < countDep) {
                    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    return m.reply(`『 ❌ 』- Fondi insufficienti. Disponibili: ${formatCurrency(user.euro || 0)}`);
                }
            }

            await conn.sendMessage(m.chat, { react: { text: '🏛️', key: m.key } });

            user.euro -= countDep;
            user.bank = (user.bank || 0) + countDep;

            const randomMessage = DEPOSIT_MESSAGES[Math.floor(Math.random() * DEPOSIT_MESSAGES.length)];
            const timestamp = new Date().toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' });
            const successMessage = `✅ *Deposito di ${formatCurrency(countDep)} 🌟 completato!*\n\n💰 *Nuovo saldo in banca:* ${formatCurrency(user.bank)} 🌟\n💳 *Rimasto nel portafoglio:* ${formatCurrency(user.euro)} 🌟`;

            const userName = user.name || m.pushName || 'Utente';
            let profilePictureUrl = 'https://i.ibb.co/3dBJbx8/default-avatar.png';

            try {
                const pfpBuffer = await conn.profilePictureUrl(m.sender, 'image');
                const response = await axios.get(pfpBuffer, { responseType: 'arraybuffer' });
                const base64 = Buffer.from(response.data, 'binary').toString('base64');
                profilePictureUrl = `data:image/jpeg;base64,${base64}`;
            } catch (e) {
                console.log('Usando immagine profilo di default');
            }

            const mediaProps = {
                amount: formatCurrency(countDep),
                walletBalance: formatCurrency(user.euro),
                bankBalance: formatCurrency(user.bank),
                message: randomMessage,
                timestamp,
                userName,
                profilePictureUrl
            };

            const buttons = [
                { buttonId: '.inventario', buttonText: { displayText: '💰 Vedi Saldo' }, type: 1 },
                { buttonId: '.ritira tutto', buttonText: { displayText: '🏧 Ritira Tutto' }, type: 1 },
            ];

            let mediaPath = null;
            try {
                // Crea la directory temp se non esiste
                const tempDir = path.resolve('./temp');
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true });
                }

                mediaPath = await createDepositImage(mediaProps, conn.browser);
                const mediaBuffer = fs.readFileSync(mediaPath);
                
                await conn.sendMessage(m.chat, { 
                    image: mediaBuffer, 
                    caption: successMessage, 
                    footer: '✧𝕰𝕷𝕴𝖃𝕴𝕽𝕭𝕺𝕿✧', 
                    buttons: buttons, 
                    headerType: 4 
                }, { quoted: m });
                
                await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            } catch (error) {
                console.error("Errore nella creazione dell'immagine:", error);
                await conn.sendMessage(m.chat, { 
                    text: successMessage, 
                    footer: '✧𝕰𝕷𝕴𝖃𝕴𝕽𝕭𝕺𝕿✧', 
                    buttons: buttons, 
                    headerType: 1 
                }, { quoted: m });
                await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            } finally {
                // Cleanup
                if (mediaPath && fs.existsSync(mediaPath)) {
                    try { 
                        fs.unlinkSync(mediaPath); 
                    } catch (e) {
                        console.log('Errore durante cleanup:', e.message);
                    }
                }
            }
            break;

        case 'bonifico':
            const e = '*Euro* 🪙';
            
            if (!text) return m.reply(`
╭━━⊱「 『 ❌ 』 \`ERRORE\` 」
│  - _*Devi specificare quantità e utente!*_
│ 
│ 『 📝 』 \`Formato corretto:\`
│ ➸ *${usedPrefix}${command}* *<quantità> @utente*
│ 
│ 『 💡 』 \`Esempio:\`
│ ➸ *${usedPrefix}${command}* *1000 @utente*
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`);

            let mentioned = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : '';
            let amount = text.split(' ')[0];
            
            if (!mentioned) return m.reply(`
╭━━⊱「 『 ❌ 』 \`ERRORE\` 」
│ 
│ _*Devi menzionare un utente o*_
│ _*rispondere a un suo messaggio!*_
│ 
│ 『 📝 』 \`Modi corretti:\`
│ ➸ *${usedPrefix}${command}* *1000 @utente*
│ ➸ Rispondi a un messaggio con:
│     *${usedPrefix}${command} 1000*
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`);

            if (amount === 'all') {
                amount = global.db.data.users[m.sender].euro;
            } else if (amount === 'random') {
                amount = Math.floor(Math.random() * 1000) + 1;
            } else {
                if (isNaN(amount)) {
                    return m.reply(`*🔢 Inserisci una cifra numerica valida!*`);
                }
                amount = parseInt(amount);
            }

            if (amount < 1) return m.reply(`『 💰 』 \`Minimo trasferibile:\` *1 ${e}*`);

            let users = global.db.data.users;
            if (!users[mentioned]) users[mentioned] = {
                euro: 0,
                lastclaim: 0
            };

            if (users[m.sender].euro < amount) return m.reply(`
╭━⊱「 『 💰 』 \`BILANCIO\` 」
│ 
│ -  _*Non hai abbastanza euro!*_
│ 
│ 『 👝 』 \`Il tuo saldo:\` *${users[m.sender].euro}* ${e}
│ 『 💸 』 \`Richiesto:\` *${amount}* ${e}
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`);

            let targetName;
            let senderName;
            try {
                targetName = await conn.getName(mentioned);
                senderName = await conn.getName(m.sender);
            } catch {
                targetName = '@' + mentioned.split('@')[0];
                senderName = '@' + m.sender.split('@')[0];
            }

            const transactionId = Math.random().toString(36).substring(2, 15);
            let fee = Math.floor(amount * TRANSFER_FEE);
            let finalAmount = amount - fee;

            try {
                await conn.sendMessage(m.chat, {
                    react: {
                        text: '⏳',
                        key: m.key
                    }
                });

                const animationPath = await createTransferAnimation(transactionId, senderName, targetName);
                
                if (!fs.existsSync(animationPath)) {
                    throw new Error('File animazione non creato');
                }
                
                await conn.sendMessage(m.chat, {
                    react: {
                        text: '🔄',
                        key: m.key
                    }
                });

                await conn.sendMessage(m.chat, {
                    video: fs.readFileSync(animationPath),
                    caption: `
ㅤㅤ⋆｡˚『 ╭ \`TRASFERIMENTO\` ╯ 』˚｡⋆\n╭                                                                    
│ 『 👤 』 \`Da:\` *${senderName}*
│ 『 🎯 』 \`A:\` *${targetName}*  
│ 『 💰 』 \`Importo:\` *${formatNumber(amount)}* ${e}
│ 『 ⚡ 』 \`Stato:\` *In corso...*
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`,
                    gifPlayback: true
                });
                
                await new Promise(resolve => setTimeout(resolve, 5500));
                
                try {
                    if (fs.existsSync(animationPath)) {
                        fs.unlinkSync(animationPath);
                    }
                } catch (cleanupError) {
                    // Ignora errori di pulizia
                }
                
                users[m.sender].euro -= amount;
                users[mentioned].euro += finalAmount;
                
                const transaction = {
                    id: transactionId,
                    type: 'transfer',
                    amount: amount,
                    fee: fee,
                    timestamp: Date.now(),
                    from: m.sender,
                    to: mentioned
                };

                if (!users[m.sender].transactions) users[m.sender].transactions = [];
                if (!users[mentioned].transactions) users[mentioned].transactions = [];
                users[m.sender].transactions.push(transaction);
                users[mentioned].transactions.push(transaction);
                
                await conn.sendMessage(m.chat, {
                    react: {
                        text: '✅',
                        key: m.key
                    }
                });
                
                await conn.sendMessage(m.chat, {
                    text: `
ㅤㅤ⋆｡˚『 ╭ \`RICEVUTA\` ╯ 』˚｡⋆
╭                                                                  
│ 『 🔄 』 _*Operazione:*_
│ • \`Mittente:\` *${senderName}*
│ • \`Destinatario:\` *${targetName}*
│                                                                     
│ 『 💎 』 _*Importi Elaborati:*_
│ • \`Inviato:\` *${formatNumber(amount)}* ${e}
│ • \`Commissione ${TRANSFER_FEE * 100}%:\`* ${formatNumber(fee)} ${e}  
│ • \`Ricevuto:\` *${formatNumber(finalAmount)}* ${e}
│ • \`Saldo ${senderName}:\` *${formatNumber(users[m.sender].euro)}* ${e}
│ • \`Saldo ${targetName}:\` *${formatNumber(users[mentioned].euro)}* ${e}
│                                                                     
│ 『 🔐 』 _*Dettagli*_
│ • \`Transizione:\` *#${transactionId}*
│ • \`Ora:\` *${new Date().toLocaleString('it-IT')}*
│ • \`Stato:\` 『 ✅ 』 *Verificato*
│                                                                   
*╰⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*`
                }, { mentions: [mentioned] });

                await conn.sendMessage(m.chat, {
                    react: {
                        text: '🎉',
                        key: m.key
                    }
                });

            } catch (error) {
                console.error('❌ Errore durante il trasferimento:', error);
                
                await conn.sendMessage(m.chat, {
                    react: {
                        text: '❌',
                        key: m.key
                    }
                });
                
                await m.reply(`*Si è verificato un errore durante il trasferimento, Riprova.*`);
            }
            break;

        default:
            m.reply('Comando non riconosciuto.');
    }
};

handler.help = ['portafoglio', 'preleva', 'deposita', 'bonifico'];
handler.tags = ['euro'];
handler.command = ['portafoglio', 'preleva', 'deposita', 'bonifico'];
handler.register = false;

export default handler;
