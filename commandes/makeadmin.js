const { hango } = require("../framework/hango");

hango({
    nomCom: "makeadmin",
    categorie: "Group",
    reaction: "👨🏿‍💼",
  },
  async (dest, hn, {
    repondre,
    msgRepondu,
    mention,
    infosGroupe,
    verifGroupe,
    auteurMessage,
    superUser,
    idBot,
    auteurMsgRepondu
  }) => {
    
    if (!verifGroupe) return repondre("❌ This command works only in groups.");

    // Chukua target kutoka reply, mention au fallback
    const target = 
      (msgRepondu?.message?.extendedTextMessage?.contextInfo?.participant) ||
      (msgRepondu?.message?.imageMessage?.contextInfo?.participant) ||
      (msgRepondu?.message?.videoMessage?.contextInfo?.participant) ||
      (msgRepondu?.message?.documentMessage?.contextInfo?.participant) ||
      (msgRepondu?.key?.participant) ||
      (mention && mention[0]) ||
      auteurMsgRepondu;

    if (!target) return repondre("❌ Reply to a USER message or mention someone.");

    const members = infosGroupe.participants.map(m => m.id);
    const admins = infosGroupe.participants.filter(m => m.admin).map(m => m.id);

    if (!admins.includes(auteurMessage) && !superUser) 
      return repondre("❌ Admin only.");
    if (!admins.includes(idBot)) 
      return repondre("❌ Bot must be admin.");
    if (!members.includes(target)) 
      return repondre("❌ User not in this group.");
    if (admins.includes(target)) 
      return repondre("ℹ️ User is already admin.");

    try {
      await hn.groupParticipantsUpdate(dest, [target], "promote");
      await hn.sendMessage(dest, {
        text: `🎊 @${target.split("@")[0]} is now admin.`,
        mentions: [target],
      });
    } catch (err) {
      console.error(err);
      repondre("❌ Failed to promote: " + err.message);
    }
  }
);