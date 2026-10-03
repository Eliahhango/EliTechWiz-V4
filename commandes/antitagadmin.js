const { hango } = require("../framework/hango");
const { setStatus, getStatus } = require("../ess/antitagadmin");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


hango({
  nomCom: "antitagadmin",
  categorie: "Group",
  reaction: "🚨"
}, async (dest, hn, commandeOptions) => {
  const { arg, verifGroupe, verifAdmin, superUser, repondre } = commandeOptions;

  if (!verifGroupe) return repondre("❗ This command can only be used in groups.");
  if (!verifAdmin && !superUser) return repondre("⛔ Only group admins can use this command.");

  const jid = dest;
  const action = (arg[0] || "").toLowerCase();

  if (action === "on") {
    setStatus(jid, true);
    return repondre("✅ *AntiTagAdmin* has been *enabled*.\n\nIf a user tags an admin, action will be taken.");
  }

  if (action === "off") {
    setStatus(jid, false);
    return repondre("❌ *AntiTagAdmin* has been *disabled.*");
  }

  const status = getStatus(jid) ? "✅ Enabled" : "❌ Disabled";
  return repondre(`📌 Current status: ${status}\n\nUsage:\n- *antitagadmin on*\n- *antitagadmin off*`);
});


hango({
    nomCom: "removeadmins",
    aliases: ["kickadmins", "kickall3", "deladmins"],
    categorie: "Group"
  },

  async (dest, hn, commandeOptions) => {
    const { ms, repondre, estAdmin } = commandeOptions;

    // Check user is group admin
    if (!estAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }

    // Fetch group metadata
    let groupMetadata;
    try {
      groupMetadata = await hn.groupMetadata(ms.key.remoteJid);
    } catch (err) {
      console.log(err);
      return repondre("❌ Failed to fetch group metadata.");
    }

    const participants = groupMetadata.participants || [];

    // Get bot JID
    const botId = hn.user.id.split(":")[0] + "@s.whatsapp.net";

    // Check bot is admin
    const botIsAdmin = participants.some(
      p => p.id === botId && p.admin
    );

    if (!botIsAdmin) {
      return repondre("❌ Bot must be admin to remove admins.");
    }

    // Find all admins except bot
    const admins = participants.filter(
      p => p.admin && p.id !== botId
    );

    if (admins.length === 0) {
      return repondre("ℹ️ No other admins found.");
    }

    await repondre(
      `⚠️ Removing ${admins.length} group admin(s)...`
    );

    let removed = 0;
    let failed = 0;

    // Remove admins one by one
    for (const admin of admins) {
      try {
        await hn.groupParticipantsUpdate(
          ms.key.remoteJid,
          [admin.id],
          "remove"
        );

        removed++;

        // Wait 2 seconds before next removal
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (err) {
        failed++;
        console.log(
          `[REMOVEADMINS] Failed to remove ${admin.id}:`,
          err.message
        );
      }
    }

    return repondre(
      `✅ *REMOVE ADMINS COMPLETED*\n\n` +
      `👤 Removed: ${removed}\n` +
      `❌ Failed: ${failed}`
    );
  }
);