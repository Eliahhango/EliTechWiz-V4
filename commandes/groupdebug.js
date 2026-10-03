const { hango } = require("../framework/hango");

hango({
    nomCom: "groupdebug",
    categorie: "Group",
    reaction: "🔍",
  },
  async (dest, hn, { repondre, ms }) => {
    try {
      const metadata = await hn.groupMetadata(dest);
      const admins = metadata.participants
        .filter((p) => p.admin !== null)
        .map((p) => `${p.id} (${p.admin})`);

      const isBotAdmin = metadata.participants.find(
        (p) => p.id === hn.user.id
      )?.admin;

      repondre(
        `🧪 *Group Debug Info:*\n\n🤖 Bot ID: ${hn.user.id}\n👑 Bot Admin Status: ${isBotAdmin}\n\n👥 Admins:\n${admins.join("\n")}`
      );
    } catch (e) {
      console.log(e);
      repondre("❌ Error while fetching group info.");
    }
  }
);
