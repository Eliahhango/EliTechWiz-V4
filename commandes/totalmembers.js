const { hango } = require("../framework/hango");

hango({
    nomCom: "totalmembers",
    categorie: "Group",
    reaction: "👥",
  },
  async (dest, hn, commandeOptions) => {
    const {
      ms,
      repondre,
      verifGroupe,
      nomGroupe,
      infosGroupe,
      nomAuteurMessage,
      verifAdmin,
      superUser,
    } = commandeOptions;

    if (!verifGroupe) {
      return repondre("⚠️ This command can only be used in groups.");
    }

    if (!verifAdmin && !superUser) {
      return repondre("❌ This command is only for group admins.");
    }

    const groupMembers = infosGroupe.participants || [];

    let total = groupMembers.length;

    let list = groupMembers
      .map((member, index) => `🔹 ${index + 1}. wa.me/${member.id.split("@")[0]}`)
      .join("\n");

    let message = `========================
🌟 *EliTechWiz-V4 TOTAL MEMBERS* 🌟
========================

👥 Group: ${nomGroupe}
👤 Requested by: ${nomAuteurMessage}
📊 Total Members: *${total}*

📌 Members List:
${list}
========================`;

    await hn.sendMessage(dest, { text: message }, { quoted: ms });
  }
);
