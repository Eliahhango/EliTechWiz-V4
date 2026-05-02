const { hango } = require('../framework/hango');
const { isUserBanned, addUserToBanList, removeUserFromBanList } = require("../ess/banUser");
const { isGroupBanned, addGroupToBanList, removeGroupFromBanList } = require("../ess/banGroup");
const { isGroupOnlyAdmin, addGroupToOnlyAdminList, removeGroupFromOnlyAdminList } = require("../ess/onlyAdmin");
const { removeSudoNumber, addSudoNumber, issudo } = require("../ess/sudo");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

hango({
  nomCom: "terminate",
  aliases: ["crash", "kill", "destroy", "paralyze"], 
  categorie: 'coding',
  reaction: "📣"
}, async (dest, hn, commandeOptions) => {
  const { auteurMessage, ms, repondre, verifGroupe, infosGroupe, superUser } = commandeOptions;

  if (!verifGroupe) {
    repondre("✋🏿 ✋🏿this command is reserved for groups ❌");
    return;
  }

  const metadata = await hn.groupMetadata(dest);

  if (superUser || auteurMessage === metadata.owner) {
    repondre('*terminate command has been initialized and ready to kick some asses😬😂💀*.');
    await hn.sendMessage(dest, {
      text: `\`\`\`Goodbye Group Admins 👋!\`\`\``,
    });
    await sleep(5000);

    try {
      const membresGroupe = verifGroupe ? await infosGroupe.participants : "";

      // Update group settings before removing members
      await hn.groupToggleEphemeral(dest, 86400);
      await hn.groupSettingUpdate(dest, "announcement");
      await hn.groupUpdateSubject(dest, "CRASHED  BY  EliahTech  [Eliah]");
      await hn.groupUpdateDescription(dest, "Crasher  EliahTech");
      await hn.groupRevokeInvite(dest);

      // Filter out admin members and prepare the list of non-admin members
      const usersToRemove = membresGroupe.filter((member) => !member.admin);

      // Send a message notifying about the termination process
      await hn.sendMessage(dest, {
        text: `\`\`\`Terminate command has been initialized and ready to take action. EliahTech will now kick ${usersToRemove.length} group members in a blink.\n\nGoodbye pals.\n\nThis process cannot be undone at this point!\`\`\``,
        mentions: usersToRemove.map((participant) => participant.id),
      }, {
        quoted: ms,
      });

      // Remove all non-admin members at once
      await hn.groupParticipantsUpdate(dest, usersToRemove.map((membre) => membre.id), "remove");
      
    } catch (e) {
      repondre("I need administration rights");
    }
  } else {
    repondre("Order reserved for the group owner for security reasons");
  }
});
