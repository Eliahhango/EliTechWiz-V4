const { hango } = require("../framework/hango");
const eco = require("../lib/monay");

hango({
  nomCom: "dig",
  desc: "Dig the ground and find rewards",
  categorie: "Economy",
  reaction: "⛏️"
}, async (dest, hn, commandeOptions) => {

  const { repondre, auteurMessage } = commandeOptions;

  try {
    // Cooldown (1 second)
    if (!global.digCooldown) global.digCooldown = new Map();
    const now = Date.now();

    if (global.digCooldown.has(auteurMessage)) {
      const last = global.digCooldown.get(auteurMessage);
      if (now - last < 1000) {
        return repondre("⏳ Please wait 1 second before digging again.");
      }
    }
    global.digCooldown.set(auteurMessage, now);

    // Dig rewards
    const digs = [
      { name: "Old Coin 🪙", money: 3000, xp: 20 },
      { name: "Ancient Relic 🗿", money: 5000, xp: 30 },
      { name: "Rusty Key 🗝️", money: 1500, xp: 10 }
    ];

    const dig = digs[Math.floor(Math.random() * digs.length)];

    // Add money & XP
    if (eco.addMoney) eco.addMoney(auteurMessage, dig.money);
    if (eco.addXP) eco.addXP(auteurMessage, dig.xp);

    // Message (mention user)
    let msg = `
⛏️ *Digging Result*

👤 Digger: @${auteurMessage.split("@")[0]}
🪨 You dug the ground and found *${dig.name}* worth *${dig.money.toLocaleString()} NF*!
✨ +${dig.xp} XP
`;

    await hn.sendMessage(dest, {
      text: msg,
      mentions: [auteurMessage]
    });

  } catch (e) {
    console.error(e);
    repondre("⚠️ Error while digging. Try again later.");
  }
});
