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

// --- REGEX DI SICUREZZA (SOCIAL & CLOUD) ---
const groupLinkRegex = /(https?:\/\/)?chat\.whatsapp\.com\/([a-zA-Z0-9_-]{22})/i;
const channelLinkRegex = /(https?:\/\/)?whatsapp\.com\/channel\/([0-9A-Za-z]{20,24})/i;
const instaLinkRegex = /(?:(?:http|https):\/\/)?(?:www\.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/i;
const telegramLinkRegex = /t.me\/([0-9A-Za-z] *?)|t.me\/([+] *?)([0-9A-Za-z] *?)|t.me\/s\/([0-9A-Za-z] *?)/i;
const tiktokLinkRegex = /(?:https?:\/\/)?(?:www\.)?(?:vm\.)?tiktok\.com\/(?:@)?([a-zA-Z0-9_]+)/i;

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
    'po.st', 'shr.lc', 'dub.co'
];

const SHORT_URL_REGEX = new RegExp(
    `https?:\\/\\/(?:www\\.)?(?:${SHORT_URL_DOMAINS.map(d => d.replace('.', '\\.')).join('|')})\\/[\\w\\-._~:/?#[\\]@!$&'()*+,;=]*`,
    'gi'
);

// --- LOGICA DI SUPPORTO ---
function checkSocialLinks(text) {
    if (groupLinkRegex.test(text)) return 'Link Gruppo WhatsApp';
    if (channelLinkRegex.test(text)) return 'Canale WhatsApp';
    if (instaLinkRegex.test(text)) return 'Link Instagram';
    if (telegramLinkRegex.test(text)) return 'Link Telegram';
    if (tiktokLinkRegex.test(text)) return 'Link TikTok';
    if (SHORT_URL_REGEX.test(text)) return 'Circuito URL abbreviato';
    return null;
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

> _Il protocollo di sicurezza ha rimosso il contenuto non autorizzato._`.trim();

    if (isBotAdmin) {
        try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
    }

    await conn.sendMessage(m.chat, {
        text,
        mentions: [sender],
        contextInfo: {
            externalAdReply: {
                title: 'ᴇʟɪxɪʀ sᴇᴄᴜʀɪᴛʏ sʏsᴛᴇᴍ ᴠ3',
                body: 'Social Link Protection Attiva',
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

    // ESTRAZIONE TESTO AVANZATA (CATTURA OGNI TIPO DI MESSAGGIO)
    let match = (
        m.text || 
        m.message?.conversation || 
        m.message?.extendedTextMessage?.text || 
        m.message?.extendedTextMessage?.matchedText || 
        m.message?.protocolMessage?.editedMessage?.conversation || 
        m.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text || 
        m.message?.editedMessage?.message?.protocolMessage?.editedMessage?.conversation || 
        m.message?.editedMessage?.message?.protocolMessage?.editedMessage?.extendedTextMessage?.text || 
        m.message?.pollCreationMessageV3?.name || 
        m.message?.viewOnceMessageV2?.message?.imageMessage?.caption || 
        m.message?.viewOnceMessageV2?.message?.videoMessage?.caption || 
        m.caption || 
        ''
    ).toLowerCase().replace(/> |[*]/g, "");

    const violationReason = checkSocialLinks(match);

    if (violationReason) {
        // Verifica se il messaggio è frutto di una modifica
        const isEdited = m.mtype === 'protocolMessage' || m.message?.protocolMessage || m.message?.editedMessage;
        const finalReason = isEdited ? `${violationReason} (Modificato)` : violationReason;
        
        await handleViolation(conn, m, finalReason, isBotAdmin);
        return true;
    }

    return false;
}

let handler = m => m;
export default handler;
