const { hango } = require("../framework/hango");
const eco = require("../lib/monay");

hango({
  nomCom: "fish",
  desc: "Go fishing and earn coins",
  categorie: "Economy",
  reaction: "🎣"
}, async (dest, hn, commandeOptions) => {

  const { repondre, auteurMessage } = commandeOptions;

  try {
    // Cooldown (1 second)
    if (!global.fishCooldown) global.fishCooldown = new Map();
    const now = Date.now();

    if (global.fishCooldown.has(auteurMessage)) {
      const last = global.fishCooldown.get(auteurMessage);
      if (now - last < 1000) {
        return repondre("⏳ Please wait 1 second before using the bot again.");
      }
    }
    global.fishCooldown.set(auteurMessage, now);

    // Fish list
    const fishes = [
      { name: "Tilapia 🐟", money: 4001, xp: 25 },
      { name: "Catfish 🐠", money: 2500, xp: 20 },
      { name: "Sardine 🐡", money: 1800, xp: 15 }
    ];

    const fish = fishes[Math.floor(Math.random() * fishes.length)];

    // Add money & XP
    if (eco.addMoney) eco.addMoney(auteurMessage, fish.money);
    if (eco.addXP) eco.addXP(auteurMessage, fish.xp);

    // Message (mention user)
    let msg = `
🎣 *Fishing Result*

👤 Fisher: @${auteurMessage.split("@")[0]}
🐟 You went fishing and caught *${fish.name}* worth *${fish.money.toLocaleString()} NF*!
✨ +${fish.xp} XP
`;

    await hn.sendMessage(dest, {
      text: msg,
      mentions: [auteurMessage]
    });

  } catch (e) {
    console.error(e);
    repondre("⚠️ Error while fishing. Try again later.");
  }
});

hango({
  nomCom: "payloan",
  desc: "Pay back your loan (Wallet → Loan)",
  categorie: "Economy",
  reaction: "💸"
}, async (dest, hn, commandeOptions) => {
  const { repondre, auteurMessage, nomAuteurMessage, arg } = commandeOptions;

  try {
    const amount = parseInt(arg[0]);
    if (!amount || amount <= 0) 
      return repondre(`❌ Usage: .payloan <amount>`);

    // Get user's balance & loan
    let balance = eco.getBalance(auteurMessage, false);
    if (!balance) balance = { wallet: 0, bank: 0, loan: 0 };

    if (!balance.loan || balance.loan <= 0) 
      return repondre(`💰 You have no loan to pay.`);

    if (amount > balance.wallet) 
      return repondre(`❌ Not enough money in wallet.\n💰 Wallet: ${balance.wallet.toLocaleString()} NF`);

    const payAmount = amount > balance.loan ? balance.loan : amount;

    // Deduct amount
    balance.wallet -= payAmount;
    balance.loan -= payAmount;

    // Save updated balance
    eco.setBalance(auteurMessage, balance);

    // Build caption
    let msg = `✅ *PAYMENT SUCCESSFUL!*\n\n`;
    msg += `💰 Paid: _🪙${payAmount.toLocaleString()} NF_\n`;
    msg += `📊 Remaining Loan: _🪙${balance.loan.toLocaleString()} NF_\n`;
    msg += `💰 Wallet: _🪙${balance.wallet.toLocaleString()} NF_`;

    // Optional: send with an image
    await hn.sendMessage(dest, {
      image: { url: "https://files.catbox.moe/hj6q5m.jpeg" }, // replace with loan image
      caption: msg,
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
      }
    });

  } catch (e) {
    console.error(e);
    repondre(`⚠️ Error processing loan payment.\n\ncommand: payloan`);
  }
});