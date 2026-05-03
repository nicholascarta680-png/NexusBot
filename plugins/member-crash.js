let handler = async (m, { conn }) => {
  if (!m.quoted) {
    return conn.sendMessage(m.chat, { 
      text: `+-----------------------------+
|       ! ERRORE CRITICO !      |
+-----------------------------+
| - Nessun target selezionato   |
| - Devi rispondere a un msg    |
| - Comando: .crash             |
+-----------------------------+`,
      contextInfo: { forwardingScore: 999, isForwarded: true }
    }, { quoted: m });
  }

  // --- Fase 1: Iniezione Payload ---
  await conn.sendMessage(m.chat, {
    text: `+-----------------------------+
|   >> INIEZIONE PAYLOAD <<    |
+-----------------------------+
| - Exploit: CVE-2023-4863     |
| - Memoria allocata: 0x7ff... |
| - Offset: 0x00007fe8b5d82f90 |
| - Heap spray in corso...     |
+-----------------------------+`,
    contextInfo: { forwardingScore: 999, isForwarded: true }
  }, { quoted: m });

  await new Promise(resolve => setTimeout(resolve, 1500));

  // --- Fase 2: Corruzione Memoria ---
  const corruptPercent = Math.floor(Math.random() * 30) + 70;
  await conn.sendMessage(m.chat, {
    text: `+-----------------------------+
|   >> MEMORY CORRUPTION <<    |
+-----------------------------+
| - Heap: ${corruptPercent}% danneggiato   |
| - Stack frame: 0x00007fe...  |
| - RIP: 0x000055e9f4b27c50    |
| - RSP: 0x00007ffd4a3b1f20    |
| - Overwriting critical data  |
+-----------------------------+`,
    contextInfo: { forwardingScore: 999, isForwarded: true }
  }, { quoted: m });

  await new Promise(resolve => setTimeout(resolve, 2000));

  // --- Fase 3: Memory Dump ---
  const memoryDump = Array(5).fill().map(() => 
    Array(8).fill().map(() => 
      Math.random().toString(16).substring(2,6)).join(' | ')).join('\n| ');
  
  await conn.sendMessage(m.chat, {
    text: `+-----------------------------+
|   >> MEMORY DUMP <<          |
+-----------------------------+
| ${memoryDump} |
+-----------------------------+
| - Crash pattern: 0x${Math.random().toString(16).substr(2,8)} |
| - Possible SIGSEGV detected  |
+-----------------------------+`,
    contextInfo: { forwardingScore: 999, isForwarded: true }
  }, { quoted: m });

  await new Promise(resolve => setTimeout(resolve, 2500));

  // --- Fase 4: Exploit Completato ---
  await conn.sendMessage(m.chat, {
    text: `+-----------------------------+
|   >> EXPLOIT SUCCESSFUL <<   |
+-----------------------------+
| - PID: ${Math.floor(Math.random() * 9000) + 1000}           |
| - Exit code: 139 (SIGSEGV)   |
| - Tempo: ${(Math.random() * 3 + 2).toFixed(2)}s           |
| - Stato: TARGET CRASHATO     |
+-----------------------------+
| >> WhatsApp potrebbe riavviarsi << |
+-----------------------------+`,
    contextInfo: { forwardingScore: 999, isForwarded: true }
  }, { quoted: m });
};

handler.command = /^(crash|wacrash|whatsappcrash)$/i;
handler.group = true;
export default handler;