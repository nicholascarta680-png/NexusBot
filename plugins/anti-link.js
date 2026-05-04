import { downloadContentFromMessage } from '@realvare/based';
import ffmpeg from 'fluent-ffmpeg';
import { createWriteStream, readFile } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { unlink } from 'fs/promises';
import Jimp from 'jimp';
import jsQR from 'jsqr';
import fetch from 'node-fetch';
import { FormData } from 'formdata-node';

const WHATSAPP_GROUP_REGEX = /\bchat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
const WHATSAPP_CHANNEL_REGEX = /whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i;
const SHORT_URL_DOMAINS = [
    'bit.ly', 'tinyurl.com', 't.co', 'short.link', 'shorturl.at',
    'is.gd', 'v.gd', 'goo.gl', 'ow.ly', 'buff.ly',
    'tiny.cc', 'shorte.st', 'adf.ly', 'linktr.ee', 'rebrand.ly',
    'bitly.com', 'cutt.ly', 'short.io', 'links.new', 'link.ly',
    'ur.ly', 'shrinkme.io', 'clck.ru', 'short.gy', 'lnk.to',
    'sh.st', 'ouo.io', 'bc.vc', 'adfoc.us', 'linkvertise.com',
    'exe.io', 'linkbucks.com', 'adfly.com', 'shrink-service.it',
    'cur.lv', 'gestyy.com', 'shrinkarn.com', 'za.gl', 'clicksfly.com',
    '6url.com', 'shortlink.sh', 'short.tn', 'rotator.ninja',
    'shrtco.de', 'ulvis.net', 'chilp.it', 'clicky.me',
    'budurl.com', 'po.st', 'shr.lc', 'dub.co'
];

const SHORT_URL_REGEX = new RegExp(
    `https?:\\/\\/(?:www\\.)?(?:${SHORT_URL_DOMAINS.map(d => d.replace('.', '\\.')).join('|')})\\/[\\w\\-._~:/?#[\\]@!$&'()*+,;=]*`,
    'gi'
);

// --- LOGICA DI SUPPORTO ---

function isWhatsAppLink(url) {
    return WHATSAPP_GROUP_REGEX.test(url) || WHATSAPP_CHANNEL_REGEX.test(url);
}

async function containsSuspiciousLink(text) {
    if (!text) return false;
    return isWhatsAppLink(text) || SHORT_URL_REGEX.test(text);
}

// --- GESTIONE VIOLAZIONE ---

async function handleViolation(conn, m, reason, isBotAdmin) {
    const sender = m.sender;
    
    const text = `
┏─━─━─━  〔 🛡️ 〕  ━─━─━─┓
     *SECURITY ENFORCEMENT*
┗─━─━─━─━─━─━─━─━─┛

◈ *Utente:* @${sender.split('@')[0]}
◈ *Stato:* Violazione Rilevata
◈ *Causa:* ${reason}

> _Il protocollo di sicurezza ha rimosso il contenuto non autorizzato per proteggere l'integrità del gruppo._`.trim();

    if (isBotAdmin) {
        try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
    }

    await conn.sendMessage(m.chat, {
        text,
        mentions: [sender],
        contextInfo: {
            externalAdReply: {
                title: 'ᴇʟɪxɪʀ sᴇᴄᴜʀɪᴛʏ sʏsᴛᴇᴍ ᴠ3',
                body: 'Protezione Messaggi Modificati Attiva',
                thumbnailUrl: 'https://qu.ax',
                mediaType: 1,
                renderLargerThumbnail: true,
                showAdAttribution: true
            }
        }
    });

    if (isBotAdmin) {
        await conn.groupParticipantsUpdate(m.chat, [sender], 'remove').catch(() => null);
    }
}

// --- HANDLER PRINCIPALE ---

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isSam }) {
    if (!m.isGroup || isAdmin || isOwner || isSam || m.fromMe) return false;

    const chat = global.db.data.chats[m.chat];
    if (!chat?.antiLink) return false;

    // --- LOGICA RECOVERY TESTO MODIFICATO ---
    let textToCheck = '';
    const isEdited = m.mtype === 'protocolMessage' && m.msg?.type === 14;

    if (isEdited) {
        // Estraiamo il contenuto dal payload della modifica
        const editedMsg = m.msg.editedMessage;
        textToCheck = editedMsg?.conversation || 
                      editedMsg?.extendedTextMessage?.text || 
                      editedMsg?.imageMessage?.caption || 
                      editedMsg?.videoMessage?.caption || '';
    } else {
        // Messaggio normale
        textToCheck = m.text || m.caption || m.msg?.caption || m.msg?.text || '';
    }

    textToCheck = textToCheck.toLowerCase();
    if (!textToCheck) return false;

    let linkFound = false;
    let reason = '';

    // Verifica link nel testo (normale o modificato che sia)
    if (await containsSuspiciousLink(textToCheck)) {
        linkFound = true;
        if (isEdited) {
            reason = 'Link iniettato tramite modifica';
        } else {
            reason = isWhatsAppLink(textToCheck) ? 'Link WhatsApp non autorizzato' : 'Circuito URL abbreviato';
        }
    }

    if (linkFound) {
        await handleViolation(conn, m, reason, isBotAdmin);
        return true;
    }

    return false;
}
