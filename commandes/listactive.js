const { hango } = require("../framework/hango");
const db = require("../lib/db");

hango({
  nomCom: "listactive",
  categorie: "Group",
  reaction: "📊",
  desc: "Show active users in the group"
}, async (dest, hn, { ms, repondre }) => {
  const chatId = ms.key.remoteJid;
  if (!chatId.endsWith("@g.us")) return repondre("❌ Command only for groups.");

  db.all(
    `SELECT userId, count FROM activity WHERE chatId = ? ORDER BY count DESC`,
    [chatId],
    async (err, rows) => {
      if (err) return repondre("❌ Failed to fetch active users.");
      if (!rows.length) return repondre("⚠️ No active users found in this group.");

      let message = `📊 *Active Users in Group*\n\n`;
      message += rows.map((user, i) => `🔹 ${i + 1}. @${user.userId.split("@")[0]} - *${user.count} messages*`).join("\n");

      await hn.sendMessage(chatId, {
        text: message,
        mentions: rows.map(u => u.userId)
      }, { quoted: ms });
    }
  );
});

hango({
  nomCom: "myrank",
  categorie: "Group",
  reaction: "🎖️",
  desc: "Show your rank in the group"
}, async (dest, hn, { ms, repondre }) => {
  const chatId = ms.key.remoteJid;
  const senderId = ms.key.participant || ms.key.remoteJid;
  if (!chatId.endsWith("@g.us")) return repondre("❌ This command works only in groups.");

  db.all(
    `SELECT userId, count FROM activity WHERE chatId = ? ORDER BY count DESC`,
    [chatId],
    async (err, rows) => {
      if (err) return repondre("❌ DB Error.");

      const user = rows.find(r => r.userId === senderId);
      if (!user) return repondre("⚠️ You don't have any activity yet.");

      const rank = rows.findIndex(r => r.userId === senderId) + 1;
      await repondre(`🎖️ *Your Rank:* #${rank}\n💬 *Messages Sent:* ${user.count}`);
    }
  );
});

// Command: .resetactivity
hango({
nomCom: "resetactivity",
categorie: "Group",
reaction: "♻️",
nomFichier: __filename,
}, async (msg, hn, { repondre, ms }) => {
const groupId = ms.key.remoteJid;
if (!groupId.endsWith("@g.us")) return await repondre("❌ This command works only in groups.");

db.run("DELETE FROM activity WHERE chatId = ?", [groupId], async (err) => {
if (err) return await repondre("❌ Failed to reset activity.");
await repondre("✅ Group activity has been reset.");
});
});

hango({
  nomCom: "addactivity",
  categorie: "Owner",
  reaction: "➕",
  desc: "Manually add activity to a user"
}, async (dest, hn, { ms, repondre, mention }) => {
  if (!mention?.length) return repondre("❌ Please mention a user to update.");

  const chatId = ms.key.remoteJid;

  mention.forEach(userId => {
    db.run(
      `INSERT INTO activity (chatId, userId, count) 
       VALUES (?, ?, 1)
       ON CONFLICT(chatId, userId) 
       DO UPDATE SET count = count + 1`,
      [chatId, userId],
      err => { if (err) console.error("❌ Failed to update activity:", err.message); }
    );
  });

  repondre(`✅ Activity manually updated for ${mention.length} user(s).`);
});

hango({
  nomCom: "userid",
  categorie: "Owner",
  reaction: "🔹",
  desc: "Get JID of all users in a group",
  nomFichier: __filename
}, async (dest, hn, { ms, repondre, superUser }) => {
  
  // Only bot owner
  if (!superUser) return repondre("❌ This command is only for the bot owner.");

  const chatId = ms.key.remoteJid;
  if (!chatId.endsWith("@g.us")) return repondre("❌ This command works only in groups.");

  try {
    const groupMetadata = await hn.groupMetadata(chatId);
    const participants = groupMetadata.participants || [];

    let text = `Here is JID address of all users of\n *${groupMetadata.subject}*\n\n`;
    for (let mem of participants) {
      text += `□ ${mem.id}\n`;
    }

    await repondre(text);

  } catch (e) {
    console.error(e);
    repondre("❌ Failed to fetch group participants.");
  }
});