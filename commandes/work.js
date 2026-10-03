const { hango } = require("../framework/hango");
const colors = require("../lib/colors.json");

// Simple in-memory database (replace with MongoDB if you want)
global.workDB = global.workDB || {};
global.moneyDB = global.moneyDB || {};

hango({
  nomCom: "work",
  categorie: "Economy",
  reaction: "🛠️",
  desc: "Work and get paid",
  nomFichier: __filename
}, async (dest, hn, { auteurMessage, repondre }) => {
  try {
    const user = auteurMessage;

    const payment = Math.floor(Math.random() * 501); // 0–500 coins
    const timeout = 5 * 60 * 1000; // 5 minutes cooldown

    const lastWork = global.workDB[user];

    // Check cooldown
    if (lastWork && (Date.now() - lastWork) < timeout) {
      const remaining = timeout - (Date.now() - lastWork);
      const minutes = Math.ceil(remaining / 60000);

      return repondre(`⏳ Please wait *${minutes} minute(s)* before working again.`);
    }

    // Add money
    global.moneyDB[user] = (global.moneyDB[user] || 0) + payment;
    global.workDB[user] = Date.now();

    // Success message
    await hn.sendMessage(dest, {
      text:
        `🛠️ *WORK COMPLETED!*\n\n` +
        `🤲 You worked hard and earned some money.\n` +
        `💰 You received *${payment} coins!*\n\n` +
        `💳 Your current balance is: *${global.moneyDB[user]} coins*`,
    });

  } catch (err) {
    console.error("WORK ERROR:", err);
    repondre("❌ An error occurred while working.");
  }
});

global.moneyDB = global.moneyDB || {};
global.bankDB = global.bankDB || {};

hango({
  nomCom: "withdraw",
  categorie: "Economy",
  reaction: "🏦",
  desc: "Withdraw money from your bank",
  nomFichier: __filename
}, async (dest, hn, { auteurMessage, arg, repondre }) => {
  try {
    const user = auteurMessage;

    // Initialize balances if not existing
    global.moneyDB[user] = global.moneyDB[user] || 0;
    global.bankDB[user] = global.bankDB[user] || 0;

    if (!arg[0]) {
      return repondre("❌ Please specify an amount or use `with all`.");
    }

    // Withdraw ALL
    if (arg[0].toLowerCase() === "all") {
      const totalCash = global.bankDB[user];

      if (totalCash <= 0) {
        return repondre("❌ You have no money in your bank.");
      }

      global.moneyDB[user] += totalCash;
      global.bankDB[user] = 0;

      return hn.sendMessage(dest, {
        text:
          `🏦 *WITHDRAW SUCCESSFUL!*\n\n` +
          `✅ You withdrew *${totalCash} coins* from your bank.\n` +
          `💳 Wallet balance: *${global.moneyDB[user]} coins*`,
      });
    }

    // Withdraw specific amount
    const amount = parseInt(arg[0]);

    if (isNaN(amount) || amount <= 0) {
      return repondre("❌ Please enter a valid number.");
    }

    if (amount > global.bankDB[user]) {
      return repondre("❌ You don't have that much money in your bank.");
    }

    global.moneyDB[user] += amount;
    global.bankDB[user] -= amount;

    return hn.sendMessage(dest, {
      text:
        `🏦 *WITHDRAW SUCCESSFUL!*\n\n` +
        `✅ You withdrew *${amount} coins* from your bank.\n` +
        `💳 Wallet balance: *${global.moneyDB[user]} coins*`,
    });

  } catch (err) {
    console.error("WITHDRAW ERROR:", err);
    repondre("❌ An error occurred while withdrawing money.");
  }
});