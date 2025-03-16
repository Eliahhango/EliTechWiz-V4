const { hango } = require("../framework/hango");
const fs = require('fs');

let antiStickerDeleteActive = false; // Variable to store the state of the anti-sticker-delete command

hango({
  nomCom: "antisticker",
  categorie: "General",
  reaction: "🚫"
}, async (dest, hn, commandeOptions) => {
  const { repondre, arg, ms, groupMeta } = commandeOptions;

  // Check if the command is used in a group
  if (!dest.endsWith('@g.us')) {
    repondre("❌ This command can only be used in groups.");
    return;
  }

  // Check if user is admin
  const groupAdmins = await hn.groupAdmin(dest);
  const sender = ms.key.participant || ms.key.remoteJid;
  
  if (!groupAdmins.includes(sender)) {
    repondre("❌ This command can only be used by group admins.");
    return;
  }

  if (!arg[0]) {
    repondre("Please specify 'on' or 'off' to enable/disable anti-sticker feature.");
    return;
  }

  const action = arg[0].toLowerCase();
  const chatId = dest;

  if (action === 'on') {
    antiStickerEnabled.set(chatId, true);
    repondre("✅ Anti-sticker feature has been enabled. All stickers will be automatically removed.");
  } else if (action === 'off') {
    antiStickerEnabled.delete(chatId);
    repondre("❌ Anti-sticker feature has been disabled. Stickers are now allowed.");
  } else {
    repondre("Invalid option. Please use 'on' or 'off'.");
  }
});

// Message handler for detecting stickers
hn.ev.on('messages.upsert', async ({ messages }) => {
  for (const message of messages) {
    const chatId = message.key.remoteJid;
    
    // Check if this is a group and anti-sticker is enabled
    if (chatId?.endsWith('@g.us') && antiStickerEnabled.has(chatId)) {
      // Check if the message contains a sticker
      if (message.message?.stickerMessage) {
        try {
          // Delete the sticker message
          await hn.sendMessage(chatId, { delete: message.key });
          
          // Get sender's name/number
          const sender = message.key.participant || message.key.remoteJid;
          const senderName = '@' + sender.split('@')[0];
          
          // Send warning message
          await hn.sendMessage(chatId, {
            text: `⚠️ *Anti-Sticker Alert*\n\n• User: ${senderName}\n• Action: Sticker Removed\n\n_Stickers are not allowed in this group._`,
            mentions: [sender]
          });
        } catch (error) {
          console.error('Error handling sticker:', error);
        }
      }
    }
  }
});
