const { hango } = require("../framework/hango");
const eco = require("../lib/monay");

hango({
  nomCom: "slots",
  desc: "Play the slot machine and try your luck",
  categorie: "Economy",
  reaction: "🎰"
}, async (dest, hn, commandeOptions) => {

  const { repondre, auteurMessage, nomAuteurMessage } = commandeOptions;

  try {
    // Get user's current balance safely
    let userBalance = 100000; // default
    if (eco.getBalance) {
      const result = await eco.getBalance(auteurMessage);
      if (typeof result === "number") userBalance = result;
      else if (result.balance) userBalance = result.balance;
    }

    // Bet amount
    const bet = 5000;
    if (userBalance < bet) {
      return repondre("⚠️ You don't have enough balance to play slots.");
    }

    // Deduct bet safely
    if (eco.removeMoney) {
      if (eco.removeMoney.constructor.name === "AsyncFunction") {
        await eco.removeMoney(auteurMessage, bet);
      } else {
        eco.removeMoney(auteurMessage, bet);
      }
    }

    // Slot symbols
    const symbols = ["🍊", "🍇", "7️⃣", "🍒", "🍋"];
    const slot1 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot2 = symbols[Math.floor(Math.random() * symbols.length)];
    const slot3 = symbols[Math.floor(Math.random() * symbols.length)];

    // Check win
    let win = false;
    if (slot1 === slot2 && slot2 === slot3) {
      win = true;
    }

    // Winnings
    let winnings = 0;
    if (win && eco.addMoney) {
      winnings = bet * 2; // payout
      if (eco.addMoney.constructor.name === "AsyncFunction") {
        await eco.addMoney(auteurMessage, winnings);
      } else {
        eco.addMoney(auteurMessage, winnings);
      }
    }

    // Get new balance directly from eco
    let newBalanceValue = userBalance - bet + winnings; // fallback
    if (eco.getBalance) {
      const result = await eco.getBalance(auteurMessage);
      if (typeof result === "number") newBalanceValue = result;
      else if (result.balance) newBalanceValue = result.balance;
    }

    // Dynamic bet name
    const betName = `${nomAuteurMessage} Fragment`;

    // Message
    let msg = `🎰 *Slots Result!*\n` +
      `${slot1} | ${slot2} | ${slot3}\n\n` +
      `💰 Bet: ${bet.toLocaleString()} *${betName}*\n` +
      `${win ? `🎉 Congratulations ${nomAuteurMessage}, you won! 💰 +${winnings}` : `😢 ${nomAuteurMessage}, no win this time.`}\n` +
      `💳 New Balance: ${newBalanceValue.toLocaleString()} NF`;

    await hn.sendMessage(dest, { text: msg });

  } catch (e) {
    console.error(e);
    repondre("⚠️ Error while playing slots. Try again later.");
  }
});
