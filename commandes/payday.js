const { hango } = require("../framework/hango");
const eco = require("../lib/monay");

hango({
  nomCom: "payday",
  desc: "Receive your daily salary",
  categorie: "Economy",
  reaction: "💰"
}, async (dest, hn, commandeOptions) => {

  const { repondre, auteurMessage } = commandeOptions;

  try {
    // Cooldown (24 hours)
    if (!global.paydayCooldown) global.paydayCooldown = new Map();
    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000; // 24h

    if (global.paydayCooldown.has(auteurMessage)) {
      const last = global.paydayCooldown.get(auteurMessage);
      const remaining = cooldown - (now - last);

      if (remaining > 0) {
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining / (1000 * 60)) % 60);
        return repondre(
  `⏳ You have already claimed your payday.\nTry again after *${hours}h ${minutes}m*`
);
      }
    }

    global.paydayCooldown.set(auteurMessage, now);

    // Payday reward
    const money = 5000;
    const xp = 30;

    if (eco.addMoney) eco.addMoney(auteurMessage, money);
    if (eco.addXP) eco.addXP(auteurMessage, xp);

    const imageUrl = "https://thumbs.dreamstime.com/b/money-bag-filled-dollars-24929385.jpg";

    let caption = `
💰 *PAYDAY RECEIVED!*

👤 Employee: @${auteurMessage.split("@")[0]}
🪙 Salary: *${money.toLocaleString()} NF*
✨ +${xp} XP

Come back tomorrow for your next payday 💼
`;

    await hn.sendMessage(dest, {
      image: { url: imageUrl },
      caption: caption,
      mentions: [auteurMessage]
    });

  } catch (e) {
    console.error(e);
    repondre("⚠️ Error while processing payday. Try again later.");
  }
});
