const { hango } = require("../framework/hango");
const eco = require("../lib/monay");

hango({
  nomCom: "roll",
  desc: "Choose a roll type and spend coins",
  categorie: "Economy",
  reaction: "🎲"
}, async (dest, hn, commandeOptions) => {
  const { auteurMessage, args, repondre } = commandeOptions;

  try {
    const balance = eco.getBalance(auteurMessage, false);

    /* =====================
       MENU SHOW
    ===================== */
    if (!args[0]) {
      const text =
`🎲 *Choose your roll type:*

💰 Normal: 100,000 coins
💎 Rare: 500,000 coins
⭐ Legendary: 1,000,000 coins

_Your Wallet:_ 🪙${balance.wallet}`;

      return await hn.sendMessage(dest, {
        text,
        footer: "NOVA • Card Rolls",
        buttonText: "Select Roll",
        sections: [
          {
            title: "🎲 Roll Types",
            rows: [
              { title: "Normal (100k)", description: "Basic roll", rowId: ".roll normal" },
              { title: "Rare (500k)", description: "Better rewards", rowId: ".roll rare" },
              { title: "Legendary (1M)", description: "Top tier roll", rowId: ".roll legendary" }
            ]
          }
        ]
      });
    }

    /* =====================
       PROCESS ROLL
    ===================== */
    const type = args[0].toLowerCase();
    const rolls = {
      normal: { cost: 100000, emoji: "💰" },
      rare: { cost: 500000, emoji: "💎" },
      legendary: { cost: 1000000, emoji: "⭐" }
    };

    const roll = rolls[type];
    if (!roll) return;

    if (balance.wallet < roll.cost) {
      return repondre(`❌ Not enough coins!\nNeed 🪙${roll.cost}`);
    }

    // Kata pesa
    await eco.addMoney(auteurMessage, -roll.cost);

    // Generate reward random
    const reward = Math.floor(Math.random() * roll.cost * 2) + 5000;
    await eco.addMoney(auteurMessage, reward);

    // Tuma result message moja tu
    return hn.sendMessage(dest, {
      text:
`${roll.emoji} *${type.toUpperCase()} ROLL!*

🎁 You won 🪙${reward}
💸 Cost: ${roll.cost}`
    });

  } catch (e) {
    console.error(e);
    repondre("⚠️ Roll command failed. Check economy system.");
  }
});