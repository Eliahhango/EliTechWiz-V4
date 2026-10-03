const { hango } = require("../framework/hango");
const eco = require("../lib/economy");

hango({
  nomCom: "transfer",
  desc: "Transfer money to another user",
  categorie: "Economy",
  reaction: "💸"
}, async (dest, hn, { ms, repondre, args }) => {
  try {
    const senderId = ms.key.participant || ms.key.remoteJid;
    const amount = parseInt(args[0]);
    const mentionArg = args[1];

    // Validate
    if (!amount || amount <= 0) return repondre("❌ Enter a valid amount.");
    if (!mentionArg) return repondre("❌ Mention a user to transfer to.");

    // Full WhatsApp ID
    const targetId = mentionArg.includes("@") ? mentionArg : mentionArg + "@s.whatsapp.net";

    // Auto-register target account
    eco.getBalance(targetId, true);

    // Check sender balance
    const senderBalance = eco.getBalance(senderId);
    if (senderBalance.wallet < amount) return repondre(`❌ Not enough balance. Your wallet: 🪙${senderBalance.wallet}`);

    // Cooldown (optional: prevent spam, like fishing)
    if (!global.transferCooldown) global.transferCooldown = new Map();
    const now = Date.now();
    if (global.transferCooldown.has(senderId)) {
      const last = global.transferCooldown.get(senderId);
      if (now - last < 1000) { // 1 second cooldown
        return repondre("⏳ Please wait a moment before making another transfer.");
      }
    }
    global.transferCooldown.set(senderId, now);

    // Perform transfer
    await eco.addMoney(senderId, -amount);
    await eco.addMoney(targetId, amount);

    const newBalance = eco.getBalance(senderId);

    // Send interactive message with mention
    const msg = `
💸 *Transfer Result*

👤 Sender: @${senderId.split("@")[0]}
🧑‍🤝‍🧑 Recipient: @${targetId.split("@")[0]}
💰 Amount Transferred: 🪙${amount.toLocaleString()}
💳 Your New Wallet Balance: 🪙${newBalance.wallet.toLocaleString()}
`;

    await hn.sendMessage(dest, {
      text: msg,
      mentions: [senderId, targetId]
    });

  } catch (e) {
    console.error("TRANSFER ERROR:", e);
    repondre("⚠️ Transfer failed. Check economy system.");
  }
});