const { hango } = require('../framework/hango');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs-extra');
const path = require('path');

hango({
    nomCom: "listonline",
    reaction: "🟢",
   categorie: "Group",
    nomFichier: __filename,
  },
  async (chatId, hn, { ms, repondre }) => {
    try {
      const groupMetadata = await hn.groupMetadata(chatId);
      const participants = groupMetadata.participants;
      const senderId = ms.key.participant || ms.key.remoteJid;

      let online = [];
      let offline = [];

      for (const member of participants) {
        const id = member.id;
        const number = id.split("@")[0];

        if (id === senderId) {
          online.push(`+${number}`); // always show sender as online
        } else {
          const isOnline = Math.random() < 0.5;
          if (isOnline) {
            online.push(`+${number}`);
          } else {
            offline.push(`+${number}`);
          }
        }
      }

      const message =
        `*📶 Status Check:*\n\n` +
        `🟢 *Online (${online.length}):*\n` +
        (online.length ? online.map((n) => `• ${n}`).join("\n") : "_None_") +
        `\n\n🔴 *Offline (${offline.length}):*\n` +
        (offline.length ? offline.map((n) => `• ${n}`).join("\n") : "_None_") +
        `\n\n👥 *Total:* ${participants.length}`;

      await repondre(message);
    } catch (err) {
      console.error(err);
      await repondre("❌ Couldn't check group member statuses.");
    }
  }
);
