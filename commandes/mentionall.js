const { hango } = require("../framework/hango");

hango({ nomCom: "mentionall", categorie: "Group", reaction: "📯" }, async (dest, hn, commandeOptions) => { const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

if (!verifGroupe) {
    return repondre("⚠️ This command can only be used in groups ❌");
}
if (!verifAdmin && !superUser) {
    return repondre("❌ This command is reserved for admins");
}

const mess = arg.length > 0 ? arg.join(" ") : "Aucun Message";
const membresGroupe = infosGroupe.participants || [];

let tag = `========================\n  
    🌟 *EliTechWiz-V4 TAG 🌟\n========================\n

👥 Group : ${nomGroupe} 🚀\n👤 Author : ${nomAuteurMessage} 👋\n📜 Message : ${mess} 📝\n========================\n\n`;

let emoji = ['😇', '👀', '😮‍💨', '👋', '✌️', '😇', '⚙️', '💪', '🎊', '✨', '🙏🏿', '⛔️', '$', '😎', '🤔', '⚡', '🚜'];

for (const membre of membresGroupe) {
    let randomEmoji = emoji[Math.floor(Math.random() * emoji.length)];
    tag += `${randomEmoji} @${membre.id.split("@")[0]}\n`;
}

await hn.sendMessage(dest, { text: tag, mentions: membresGroupe.map(m => m.id) }, { quoted: ms });

});

