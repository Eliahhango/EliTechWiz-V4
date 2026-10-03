const { hango } = require("../framework/hango");
const eco = require("../lib/monay");

hango({
  nomCom: "beg",
  desc: "Beg for some money",
  categorie: "Economy",
  reaction: "🤲"
}, async (dest, hn, commandeOptions) => {

  const { repondre, auteurMessage } = commandeOptions;
  try {
    // Cooldown (10 seconds)
    if (!global.begCooldown) global.begCooldown = new Map();
    const now = Date.now();
    const cooldown = 10 * 1000;

    if (global.begCooldown.has(auteurMessage)) {
      const last = global.begCooldown.get(auteurMessage);
      const remaining = cooldown - (now - last);

      if (remaining > 0) {
        const sec = Math.ceil(remaining / 1000);
        return repondre(`⏳ Please wait ${sec}s before begging again.`);
      }
    }
    global.begCooldown.set(auteurMessage, now);

    // Random money & XP
    const money = Math.floor(Math.random() * (600 - 100 + 1)) + 100;
    const xp = Math.floor(Math.random() * (15 - 5 + 1)) + 5;

    if (eco.addMoney) eco.addMoney(auteurMessage, money);
    if (eco.addXP) eco.addXP(auteurMessage, xp);

    // RANDOM images (SIZE KUBWA = THUMBNAIL)
    const begImages = [
      "https://img.icons8.com/?size=512&id=UaUPkdzCxbCt&format=png",
      "https://img.icons8.com/?size=512&id=8Jqv9F7hZL9D&format=png",
      "https://img.icons8.com/?size=512&id=G8g1LZzQ2xwC&format=png"
    ];

    const imageUrl = begImages[Math.floor(Math.random() * begImages.length)];

    // Message (NO EMPTY LINE AT TOP)
    const caption =
`🤲 *Begging Result*

🤲 An old man chuckled and handed you some NF.
💰 You received *${money} NF*!
✨ +${xp} XP`;

    await hn.sendMessage(dest, {
      image: { url: imageUrl },
      caption: caption
    });

  } catch (e) {
    console.error(e);
    repondre("⚠️ Error while begging. Try again later.");
  }
});

        