export async function before(m, { isOwner, isRowner, isMods }) {
    // 1. Esclusioni immediate
    if (m.fromMe) return !0; // Non bloccare se stesso
    if (m.isGroup) return !1; // Ignora i messaggi nei gruppi
    if (!m.message) return !0;
    
    // 2. Escludi i proprietari e i moderatori
    if (isOwner || isRowner || isMods) return !1;

    // 3. Eccezione per i giochi (opzionale, ma se vuoi bloccare tutto in privato meglio toglierla)
    if (m.text && (m.text.includes('sasso') || m.text.includes('carta') || m.text.includes('forbici'))) return !0;

    // 4. Controllo impostazione antiprivato
    const settings = global.db.data.settings[this.user.jid] || {};
    
    if (settings.antiprivato) {
        // Blocca l'utente senza inviare alcun messaggio
        await this.updateBlockStatus(m.chat, 'block');
        // Ritorna !0 per fermare qualsiasi altra esecuzione del bot per questo messaggio
        return !0;
    }
    
    return !1;
}
