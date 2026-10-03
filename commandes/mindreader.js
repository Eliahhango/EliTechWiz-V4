const { hango } = require("../framework/hango");

hango({
  nomCom: "mindreader",
  categorie: "fun",
  reaction: "🧠",
  nomFichier: __filename,
  use: ".mindreader",
}, async (msg, hn, { repondre, ms }) => {
  let userId = ms.key.participant || ms.key.remoteJid || msg.from;
  let chatId = ms.key.remoteJid || msg.from;

  let userName = "Friend";

  try {
    // Try to get the real user name from contacts
    userName = await hn.getName(userId);
    if (!userName) {
      userName = userId.split("@")[0];
    }
  } catch (e) {
    userName = userId.split("@")[0];
  }

  const mindreaderMessages = [
    "I'm sure you're thinking about lunch right now 🍕",
    "You're about to receive some unexpected money 💸",
    "You're wondering if you locked the door 😅",
    "You should really get some rest 🛌",
    "You're thinking of someone special right now 💖",
    "You're ready for a new adventure 🚀",
    "You need a good cup of coffee ☕",
    "You're about to make someone smile 😊",
    "You're doubting yourself, but you shouldn't 💪",
    "You're more amazing than you realize 🌟"
  ];

  const randomIndex = Math.floor(Math.random() * mindreaderMessages.length);
  const selectedMessage = mindreaderMessages[randomIndex];

  await hn.sendMessage(chatId, {
    text: `🤖 *Mindreader* 🤖\n\n@${userName}, ${selectedMessage}`,
    mentions: [userId],
  }, { quoted: ms });
});
