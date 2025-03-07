// Maps to store anti-spam settings and user message history
const antiSpamEnabled = new Map();
const userMessageHistory = new Map();
const userWarnings = new Map();

zokou({
  nomCom: "antispam",
  categorie: "Group",
  reaction: "🛡️"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  // Check if the command is used in a group
  if (!dest.endsWith('@g.us')) {
    repondre("❌ This command can only be used in groups.");
    return;
  }

  // Check if user is admin
  const groupAdmins = await zk.groupAdmin(dest);
  const sender = ms.key.participant || ms.key.remoteJid;
  
  if (!groupAdmins.includes(sender)) {
    repondre("❌ This command can only be used by group admins.");
    return;
  }

  if (!arg[0]) {
    repondre("Please specify 'on' or 'off' to enable/disable anti-spam feature.");
    return;
  }

  const action = arg[0].toLowerCase();
  const chatId = dest;

  if (action === 'on') {
    antiSpamEnabled.set(chatId, true);
    // Clear any existing history when enabling
    clearGroupSpamHistory(chatId);
    repondre("✅ Anti-spam feature has been enabled. Repeated messages will be detected and action will be taken.");
  } else if (action === 'off') {
    antiSpamEnabled.delete(chatId);
    // Clear all spam history for this group
    clearGroupSpamHistory(chatId);
    repondre("❌ Anti-spam feature has been disabled.");
  } else {
    repondre("Invalid option. Please use 'on' or 'off'.");
  }
});

// Function to clear spam history for a group
function clearGroupSpamHistory(groupId) {
  // Clear message history
  for (const [key, value] of userMessageHistory.entries()) {
    if (key.startsWith(groupId)) {
      userMessageHistory.delete(key);
    }
  }
  // Clear warning history
  for (const [key, value] of userWarnings.entries()) {
    if (key.startsWith(groupId)) {
      userWarnings.delete(key);
    }
  }
}

// Function to get user key
function getUserKey(groupId, userId) {
  return `${groupId}:${userId}`;
}

// Message handler for detecting spam
zk.ev.on('messages.upsert', async ({ messages }) => {
  for (const message of messages) {
    const chatId = message.key.remoteJid;
    
    // Check if this is a group and anti-spam is enabled
    if (chatId?.endsWith('@g.us') && antiSpamEnabled.has(chatId)) {
      const sender = message.key.participant || message.key.remoteJid;
      const messageContent = message.message?.conversation || 
                           message.message?.extendedTextMessage?.text ||
                           message.message?.imageMessage?.caption ||
                           'multimedia_message'; // For non-text messages
      
      if (!messageContent) continue;

      const userKey = getUserKey(chatId, sender);
      
      // Get or initialize user's message history
      if (!userMessageHistory.has(userKey)) {
        userMessageHistory.set(userKey, {
          lastMessage: messageContent,
          count: 1,
          timestamp: Date.now(),
          messages: [message.key]
        });
      } else {
        const history = userMessageHistory.get(userKey);
        
        // Reset count if it's been more than 30 seconds since last message
        if (Date.now() - history.timestamp > 30000) {
          history.count = 1;
          history.messages = [message.key];
        } else if (history.lastMessage === messageContent) {
          // Increment count for same message
          history.count++;
          history.messages.push(message.key);
        } else {
          // Different message, reset count
          history.count = 1;
          history.messages = [message.key];
        }
        
        history.lastMessage = messageContent;
        history.timestamp = Date.now();
        
        // Check if spam threshold is reached (4 or more same messages)
        if (history.count >= 4) {
          try {
            // Delete all spam messages
            for (const msgKey of history.messages) {
              await zk.sendMessage(chatId, { delete: msgKey });
            }
            
            // Get or initialize warning count
            const warnings = userWarnings.get(userKey) || 0;
            userWarnings.set(userKey, warnings + 1);
            
            const senderName = '@' + sender.split('@')[0];
            
            if (warnings >= 1) {
              // Second offense: Remove user from group
              await zk.groupParticipantsUpdate(chatId, [sender], "remove");
              
              await zk.sendMessage(chatId, {
                text: `🛡️ *Anti-Spam Protection*\n\n• User: ${senderName}\n• Action: Removed from group\n• Reason: Multiple spam violations\n\n_Spamming is not allowed in this group._`,
                mentions: [sender]
              });
            } else {
              // First offense: Warning
              await zk.sendMessage(chatId, {
                text: `⚠️ *Anti-Spam Warning*\n\n• User: ${senderName}\n• Action: Messages Deleted\n• Warning: ${warnings + 1}/2\n\n_Continuing to spam will result in removal from the group._`,
                mentions: [sender]
              });
            }
            
            // Reset message history
            history.count = 0;
            history.messages = [];
            
          } catch (error) {
            console.error('Error handling spam:', error);
          }
        }
      }
    }
  }
});
