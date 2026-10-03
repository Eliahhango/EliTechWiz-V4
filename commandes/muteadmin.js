const { hango } = require("../framework/hango");
const isAdmin = require("../lib/isAdmin");
hango({
  nomCom: "muteadmin",
  categorie: "Group",
  reaction: "⬇️"
}, async (dest, hn, commandeOptions) => {
  const {
    repondre,
    msgRepondu,
    infosGroupe,
    auteurMsgRepondu,
    verifGroupe,
    auteurMessage,
    superUser,
    idBot,
    msg
  } = commandeOptions;

  if (!verifGroupe) return repondre("❌ This command is only for groups.");

  let groupMembers = infosGroupe.participants;
  const admins = groupMembers.filter(m => m.admin != null).map(m => m.id);
  const isTargetAdmin = admins.includes(auteurMsgRepondu);
  const isTargetMember = groupMembers.some(m => m.id === auteurMsgRepondu);
  const isSenderAdmin = admins.includes(auteurMessage);
  const isBotAdmin = admins.includes(idBot);

  try {
    if (!(isSenderAdmin || superUser)) return repondre("❌ You must be a group admin.");

    if (!msgRepondu) return repondre("❌ Reply to the admin you want to remove.");

    if (!isBotAdmin) return repondre("❌ I am not an admin in this group.");

    if (!isTargetMember) return repondre("❌ The user is not in the group.");
    if (!isTargetAdmin) return repondre("❌ The user is not an admin.");

    // ⚡ Demote
    await hn.groupParticipantsUpdate(dest, [auteurMsgRepondu], "demote");

    const removedBy = `@${auteurMessage.split("@")[0]}`;
    const removedUser = `@${auteurMsgRepondu.split("@")[0]}`;
    const now = new Date().toLocaleString();

    const successMsg = await hn.sendMessage(dest, {
      text: `✅ Successfully removed admin rights from ${removedUser}.`,
      mentions: [auteurMsgRepondu],
      quoted: msg
    });

    await hn.sendMessage(dest, {
      text: `*Admin Event*\n\n${removedBy} has removed admin rights from ${removedUser}.\n📅 Date: ${now}\n👥 Group: ${infosGroupe.subject}`,
      mentions: [auteurMsgRepondu, auteurMessage],
      quoted: successMsg.key
    });

  } catch (e) {
    return repondre("❌ Error: " + e);
  }
});