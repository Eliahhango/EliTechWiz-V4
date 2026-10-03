const { hango } = require("../framework/hango");

hango({ nomCom: "debuggroup", categorie: 'tools' },
  async (dest, hn, commandeOptions) => {
    const {
      repondre,
      infosGroupe,
    } = commandeOptions;

    const groupMembers = infosGroupe.participants || [];
    const adminList = groupMembers.filter(m => m.admin !== null).map(m => `${m.id} (${m.admin})`);
    const botID = hn.user.id;

    await repondre(`🧪 *Group Debug Info:*\n\n` +
      `🤖 Bot ID: ${botID}\n` +
      `👥 Admins:\n${adminList.join("\n")}\n\n` +
      `👤 Total Members: ${groupMembers.length}`
    );
  }
);
