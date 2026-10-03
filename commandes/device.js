const { hango } = require("../framework/hango");

hango({
nomCom: "device",
categorie: "Utility",
reaction: "📱",
},
async (dest, hn, options) => {

const { ms, repondre } = options;

const ctx = ms.message?.extendedTextMessage?.contextInfo;

if (!ctx?.quotedMessage) {
return repondre("❌ Please reply to a message to detect their device!");
}

try {

let device = "💻 WhatsApp Web";
const msgId = ms.key.id || "";

if (msgId.startsWith("3A")) device = "🤖 Android";
else if (msgId.startsWith("3EB")) device = "🍎 iPhone (iOS)";

const userId = ctx.participant || ms.key.remoteJid;
const userName = userId.split("@")[0];

const text = `╔══[EliTechWiz xmd is speed🔥]══╗
║➽ 📱 DEVICE DETECTOR
║➽ 👤 USER: @${userName}
║➽ 📲 DEVICE: ${device}
╚═══════ஜ۩۩ஜ═══════╝`;

await hn.sendMessage(dest,{ text, mentions:[userId] },{ quoted: ms });

} catch (err) {

console.log(err);
repondre("❌ Error detecting device");

}

});