const { hango } = require("../framework/hango");
const { getGroupAdmins } = require("../lib/groupdb");
const GroupDB = require("../lib/groupdb");
const kickQueue = new Map();

hango({
    nomCom: "listinactive",
    categorie: "Group",
    reaction: "⚠️",
    desc: "List inactive users in group"
  },
  async (dest, hn, commandeOptions) => {

    const { ms, repondre } = commandeOptions;

    const groupId = ms.key.remoteJid;

    // Check kama ni group
    if (!groupId.endsWith("@g.us")) {
      return repondre("❌ Command only for groups.");
    }

    // 1️⃣ Save activity
    await GroupDB.saveUserActivity(groupId, ms.key.participant || ms.key.remoteJid);

    // 2️⃣ Get metadata
    let metadata;
    try {
      metadata = await hn.groupMetadata(groupId);
    } catch {
      return repondre("❌ Failed to fetch group metadata.");
    }

    const allParticipants = metadata.participants.map(p => p.id);

    // 3️⃣ Active users
    const activeUsers = await GroupDB.getActiveUsers(groupId);
    const activeJids = activeUsers.map(u => u.jid);

    // 4️⃣ Inactive users
    const inactiveUsers = allParticipants.filter(jid => !activeJids.includes(jid));

    if (!inactiveUsers.length) {
      return repondre("✅ No inactive users found in this group.");
    }

    // 5️⃣ Message
    let message = `⚠️ *Inactive Users in Group*\n\n`;
    message += inactiveUsers.map((jid, i) => 
      `🔹 ${i + 1}. @${jid.split('@')[0]}`
    ).join("\n");

    // 6️⃣ Send
    await hn.sendMessage(
      groupId,
      { text: message, mentions: inactiveUsers },
      { quoted: ms }
    );
  }
);

hango({
nomCom: "kickinactive",
categorie: "Group"
}, async (dest, hn, commandeOptions) => {

const { ms, repondre, estAdmin } = commandeOptions;

if (!estAdmin) return repondre("❌ Only group admins can use this command.");

let groupMetadata;
try {
groupMetadata = await hn.groupMetadata(ms.key.remoteJid);
} catch {
return repondre("❌ Failed to fetch group metadata.");
}

const groupId = ms.key.remoteJid;

// check bot admin
const botId = hn.user.id.split(":")[0] + "@s.whatsapp.net";
const botIsAdmin = groupMetadata.participants
.filter(p => p.admin)
.map(p => p.id)
.includes(botId);

if (!botIsAdmin) return repondre("❌ Bot must be admin.");

// mfano wa inactive users (demo)
const participants = groupMetadata.participants
.filter(p => !p.admin)
.map(p => p.id);

if (participants.length === 0)
return repondre("⚠️ No inactive users found.");

// weka queue
kickQueue.set(groupId, participants);

let text = "🚨 Kicking inactive users in 25 seconds...\n";
text += "Use .cancelkick to cancel\n\n👥 Users:\n";

participants.forEach(u => {
text += "@" + u.split("@")[0] + "\n";
});

await hn.sendMessage(dest, { text, mentions: participants });

setTimeout(async () => {

// kama admin ame cancel  
if (!kickQueue.has(groupId)) return;  

const usersToKick = kickQueue.get(groupId);  

try {  
  await hn.groupParticipantsUpdate(groupId, usersToKick, "remove");  
} catch (e) {  
  console.log(e);  
}  

kickQueue.delete(groupId);

}, 25000);

});

/* ===============================
   CANCEL KICK
================================ */

hango({
  nomCom: "cancelkick",
  categorie: "Group"
}, async (dest, hn, commandeOptions) => {

  const { ms, repondre, estAdmin } = commandeOptions;

  if (!estAdmin)
    return repondre("❌ Only group admins can cancel kick.");

  const groupId = ms.key.remoteJid;

  if (!kickQueue.has(groupId))
    return repondre("⚠️ No kick operation is pending.");

  kickQueue.delete(groupId);

  repondre("✅ Kick operation has been canceled.");

});

hango({
  nomCom: "kickall",
  categorie: "Group",
}, async (dest, hn, commandeOptions) => {

  const { ms, repondre, estAdmin, estCreator, prefixe } = commandeOptions;

  // Check admin
  if (!estAdmin && !estCreator) {
    return repondre("❌ Only group admins can use this command.");
  }

  // Fetch group metadata
  let groupMetadata;
  try {
    groupMetadata = await hn.groupMetadata(ms.key.remoteJid);
  } catch {
    return repondre("❌ Failed to fetch group metadata.");
  }

  const groupId = ms.key.remoteJid;
  const botId = hn.user.id.split(":")[0] + "@s.whatsapp.net";

  // Check bot admin
  const botIsAdmin = groupMetadata.participants
    .filter(p => p.admin)
    .map(p => p.id)
    .includes(botId);

  if (!botIsAdmin) return repondre("❌ Bot must be admin.");

  // List ya admins
  const groupAdmins = groupMetadata.participants
    .filter(p => p.admin)
    .map(p => p.id);

  // Users to kick (exclude admins + bot)
  const usersToKick = groupMetadata.participants
    .filter(u => !groupAdmins.includes(u.id) && u.id !== botId)
    .map(u => u.id);

  if (!usersToKick.length) return repondre("✅ No users to kick.");

  // Warning message
  let text = `⚠️ *Kicking all members in 5 seconds...*\n`;
  text += `Use *${prefixe}cancelkick* to cancel\n\n👥 Affected:\n`;
  usersToKick.forEach(u => text += `@${u.split("@")[0]}\n`);

  await hn.sendMessage(dest, { text, mentions: usersToKick });

  // Set queue
  kickQueue.set(groupId, usersToKick);

  // Countdown 5 seconds
  setTimeout(async () => {
    if (!kickQueue.has(groupId)) return; // cancelled

    try {
      await hn.groupParticipantsUpdate(groupId, usersToKick, "remove");
      repondre("✅ All members have been kicked.");
    } catch (err) {
      console.log(err);
      repondre("❌ Failed to kick some users. Bot might not have permissions.");
    }

    kickQueue.delete(groupId);
  }, 5000);
});


hango({
  nomCom: "addusers",
  categorie: "Group",
}, async (dest, hn, commandeOptions) => {

  const { ms, repondre, arg, msgRepondu, estCreator } = commandeOptions;

  // Fetch group metadata
  let groupMetadata;
  try {
    groupMetadata = await hn.groupMetadata(dest);
  } catch {
    return repondre("❌ Failed to fetch group metadata.");
  }

  const botId = hn.user.id.split(":")[0] + "@s.whatsapp.net";

  // Check bot is admin
  const botIsAdmin = groupMetadata.participants
    .filter(p => p.admin)
    .map(p => p.id)
    .includes(botId);

  if (!botIsAdmin) return repondre("❌ Bot must be admin to add users.");

  // Determine users to add
  // Either from reply or from arguments
  let usersToAdd = [];
  if (msgRepondu && msgRepondu.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
    usersToAdd = msgRepondu.message.extendedTextMessage.contextInfo.mentionedJid;
  } else if (arg.length) {
    usersToAdd = arg.map(a => a.replace(/[^0-9]/g,"") + "@s.whatsapp.net");
  }

  if (!usersToAdd.length) return repondre("⚠️ Mention or list phone numbers to add.");

  // Limit to 25 at a time
  if (usersToAdd.length > 25) usersToAdd = usersToAdd.slice(0,25);

  try {
    await hn.groupParticipantsUpdate(dest, usersToAdd, "add");
    repondre(`✅ Added ${usersToAdd.length} users successfully:\n${usersToAdd.map(u => `@${u.split("@")[0]}`).join(", ")}`, { mentions: usersToAdd });
  } catch (err) {
    console.log(err);
    repondre("❌ Failed to add some users. They might have privacy restrictions or bot lacks permissions.");
  }
});