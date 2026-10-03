const { hango } = require("../framework/hango");
const nbx = require("noblox.js");

// WhatsApp IDs of admins
const adminIDs = [
  "255617834510"   // owner
];

// Map to store pending payouts
if (!global.pendingPayouts) global.pendingPayouts = new Map();

/**
 * STEP 1: INITIATE PAYOUT
 */
hango({
  nomCom: "payout",
  categorie: "Economy",
  reaction: "💰",
  desc: "Initiate a payout (admin only)"
}, async (dest, hn, { auteurMessage, arg, repondre }) => {
  try {
    const senderNumber = auteurMessage.split("@")[0];

    // Check if sender is admin
    if (!adminIDs.includes(senderNumber)) {
      return repondre("❌ You don't have permission to use this command!");
    }

    const robloxUsername = arg[0];
    const robuxAmount = parseInt(arg[1]);

    if (!robloxUsername || isNaN(robuxAmount) || robuxAmount <= 0) {
      return repondre("❌ Usage: .payout <robloxUsername> <amount>");
    }

    // Store pending payout
    global.pendingPayouts.set(senderNumber, { robloxUsername, robuxAmount });

    // Send confirmation message
    const confirmText = 
`⚠️ *Confirm payout*\n👤 User: ${robloxUsername}\n💰 Amount: ${robuxAmount} Robux
React with ✅ to confirm or ❌ to cancel within 60 seconds.`;

    await hn.sendMessage(dest, { text: confirmText });

  } catch (e) {
    console.error("PAYOUT INIT ERROR:", e);
    repondre("❌ Error initiating payout.");
  }
});

/**
 * STEP 2: CONFIRM PAYOUT
 */
hango({
  nomCom: "confirm",
  categorie: "Economy",
  reaction: "✅",
  desc: "Confirm pending payout"
}, async (dest, hn, { auteurMessage, repondre }) => {
  try {
    const senderNumber = auteurMessage.split("@")[0];

    if (!adminIDs.includes(senderNumber)) {
      return repondre("❌ You don't have permission to use this command!");
    }

    const data = global.pendingPayouts.get(senderNumber);
    if (!data) return repondre("❌ No pending payout to confirm.");

    const { robloxUsername, robuxAmount } = data;

    // ====== ⚠️ ROBLOX PAYOUT HAPA ======
    // Use your secondary Roblox account cookie
    await nbx.groupPayout({
      group: 4075500,               // Your Roblox group ID
      member: await nbx.getIdFromUsername(robloxUsername),
      amount: robuxAmount,
      recurring: false
    });

    // Remove pending payout
    global.pendingPayouts.delete(senderNumber);

    repondre(
      `✅ *PAYOUT CONFIRMED*\n\n👤 User: ${robloxUsername}\n💰 Amount: ${robuxAmount} Robux`
    );

  } catch (e) {
    console.error("PAYOUT CONFIRM ERROR:", e);
    repondre("❌ An error occurred during payout. Check the username.");
  }
});

/**
 * STEP 3: CANCEL PAYOUT
 */
hango({
  nomCom: "cancel",
  categorie: "Economy",
  reaction: "❌",
  desc: "Cancel pending payout"
}, async (dest, hn, { auteurMessage, repondre }) => {
  try {
    const senderNumber = auteurMessage.split("@")[0];

    const data = global.pendingPayouts.get(senderNumber);
    if (!data) return repondre("❌ No pending payout to cancel.");

    global.pendingPayouts.delete(senderNumber);
    repondre("❌ *Payout cancelled successfully.*");

  } catch (e) {
    console.error("PAYOUT CANCEL ERROR:", e);
    repondre("❌ Error cancelling payout.");
  }
});