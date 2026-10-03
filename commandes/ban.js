const { hango } = require("../framework/hango");
const colors = require("../lib/colors.json");

hango({
  nomCom: "ban",
  aliases: ["kick", "remove"],
  categorie: "Group",
  reaction: "⛔",
  desc: "Ban/remove a group member (admins only)"
}, async (dest, hn, commandeOptions) => {
  const { ms, repondre, arg, msgRepondu, estAdmin } = commandeOptions;

  // ✅ Check if user is group admin
  if (!estAdmin) return repondre("❌ Only group admins can use this command.");

  // Fetch group metadata
  let groupMetadata;
  try {
    groupMetadata = await hn.groupMetadata(ms.key.remoteJid);
  } catch {
    return repondre("❌ Failed to fetch group metadata.");
  }

  // ✅ Check if bot is admin
  const botId = hn.user.id.split(":")[0] + "@s.whatsapp.net";
  const botIsAdmin = groupMetadata.participants
    .filter(p => p.admin) // includes isAdmin or isSuperAdmin
    .map(p => p.id)
    .includes(botId);

  if (!botIsAdmin) return repondre("❌ Bot must be admin to remove users.");

  // ✅ Determine target
  let target;
  if (msgRepondu) {
    target = msgRepondu.sender;
  } else if (ms.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
    target = ms.message.extendedTextMessage.contextInfo.mentionedJid[0];
  } else if (arg[0]) {
    target = arg[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";
  }

  if (!target) return repondre("⚠️ Mention or reply to the user you want to ban/remove.");

  // ✅ Prevent banning self or bot
  const senderId = ms.key.participant || ms.key.remoteJid;
  if (target === senderId) return repondre("❌ You cannot ban yourself.");
  if (target === botId) return repondre("❌ I cannot ban myself.");

  // ✅ Execute ban/remove
  try {
    await hn.groupParticipantsUpdate(ms.key.remoteJid, [target], "remove");
    repondre(`✅ User @${target.split("@")[0]} removed successfully.`);
  } catch (err) {
    console.error("BAN ERROR:", err);
    repondre("❌ Failed to remove user. They might be an admin or the bot lacks permissions.");
  }
});