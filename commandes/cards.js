// ===============================
// 1️⃣ DEPENDENCIES
// ===============================
const mongoose = require("mongoose");
const { hango } = require("../framework/hango");
const CARDS = require("../lib/cards"); 
const UserCards = require("../models/UserCards"); // Schema yako ya MongoDB

// ===============================
// 2️⃣ MONGODB CONNECTION (HARDCODED URI)
// ===============================
const MONGODB_URI = "mongodb+srv://kingmejakuntu:kJJHpgs8BEU7i9KP@cluster0.hv05qr1.mongodb.net/whatsappbot?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected (Cards Game)");
  } catch (err) {
    console.error("❌ MongoDB error:", err);
  }
};

connectDB();

// ===============================
// 3️⃣ START GAME (CREATE ACCOUNT)
// ===============================
hango({
  nomCom: "startgame",
  categorie: "CARDS",
  reaction: "🎮"
}, async (dest, hn, { auteurMessage, repondre }) => {
  let user = await UserCards.findOne({ userId: auteurMessage });
  if (user) return repondre("ℹ️ You already have a game account.");

  await UserCards.create({
    userId: auteurMessage,
    collection: [],
    deck: []
  });

  repondre("🎮 Game account created! Use *.pull* to get your first card.");
});

// ===============================
// 4️⃣ VIEW AVAILABLE CARDS
// ===============================
hango({
  nomCom: "cards",
  categorie: "CARDS",
  reaction: "🃏"
}, async (dest, hn, { arg, repondre }) => {
  const tier = (arg[0] || "T1").toUpperCase();
  if (!CARDS[tier]) return repondre("❌ Invalid tier. Use T1 – T7");

  let text = `🃏 *AVAILABLE CARDS – ${tier}*\n\n`;

  CARDS[tier].forEach((c, i) => {
    text += `${i + 1}. ${c.name} | ${c.series}\n`;
  });

  repondre(text);
});

// ===============================
// 5️⃣ PULL CARD (GET RANDOM CARD)
// ===============================
hango({
  nomCom: "pull",
  categorie: "CARDS",
  reaction: "🎁"
}, async (dest, hn, { auteurMessage, repondre }) => {
  let user = await UserCards.findOne({ userId: auteurMessage });
  if (!user) return repondre("❌ Use *.startgame* first.");

  const tiers = Object.keys(CARDS);
  const tier = tiers[Math.floor(Math.random() * tiers.length)];
  const card = CARDS[tier][Math.floor(Math.random() * CARDS[tier].length)];

  user.collection.push({
    name: card.name,
    tier,
    series: card.series,
    captcha: Math.random().toString(36).substring(2, 7).toUpperCase()
  });

  await user.save();

  repondre(`🎁 You pulled:\n⭐ *${card.name}*\n💎 Tier: ${tier}\n🌍 Series: ${card.series}`);
});

// ===============================
// 6️⃣ VIEW COLLECTION
// ===============================

// ===============================
// 7️⃣ ADD CARD TO DECK (MAX 3)
// ===============================
hango({
  nomCom: "add2deck",
  categorie: "CARDS",
  reaction: "➕"
}, async (dest, hn, { auteurMessage, arg, repondre }) => {
  const index = parseInt(arg[0]) - 1;
  if (isNaN(index)) return repondre("❌ Use a valid index number.");

  let user = await UserCards.findOne({ userId: auteurMessage });
  if (!user) return repondre("❌ Use *.startgame* first.");

  if (user.deck.length >= 3)
    return repondre("⚠️ Deck limit reached (max 3 cards).");

  const card = user.collection.splice(index, 1)[0];
  if (!card) return repondre("❌ Card not found.");

  user.deck.push(card);
  await user.save();

  repondre(`✅ Added *${card.name}* to your deck.`);
});

// ===============================
// 8️⃣ VIEW DECK
// ===============================
hango({
  nomCom: "deck",
  categorie: "CARDS",
  reaction: "🛡️"
}, async (dest, hn, { auteurMessage, repondre }) => {
  let user = await UserCards.findOne({ userId: auteurMessage });
  if (!user || user.deck.length === 0)
    return repondre("🛡️ Your deck is empty.");

  let text = "🛡️ *YOUR DECK*\n\n";
  user.deck.forEach((c, i) => {
    text += `${i + 1}. ${c.name} | ${c.tier}\n`;
  });

  repondre(text);
});

// ===============================
// 9️⃣ REMOVE CARD FROM DECK
// ===============================
hango({
  nomCom: "deck2co",
  categorie: "CARDS",
  reaction: "➖",
  desc: "Remove a card from your deck and put it back in your collection"
}, async (dest, hn, { auteurMessage, arg, repondre }) => {

  try {
    // 1️⃣ Parse index
    const index = parseInt(arg[0]) - 1;
    if (isNaN(index)) return repondre("❌ Please provide a valid card index from your deck.");

    // 2️⃣ Fetch user
    let user = await UserCards.findOne({ userId: auteurMessage });
    if (!user || user.deck.length === 0) return repondre("⚠️ Your deck is empty. No card to remove.");

    // 3️⃣ Check index bounds
    if (index < 0 || index >= user.deck.length) return repondre(`❌ Invalid index. Your deck has ${user.deck.length} cards.`);

    // 4️⃣ Remove card from deck
    const removedCard = user.deck.splice(index, 1)[0];
    user.collection.push(removedCard); // add back to collection
    await user.save();

    // 5️⃣ Response message with full info
    let msg = `✅ Removed *${removedCard.name}* from deck.\n💎 Tier: ${removedCard.tier}\n🌍 Series: ${removedCard.series}\n\n📦 Deck now has ${user.deck.length} cards.`;
    repondre(msg);

  } catch (err) {
    console.error(err);
    repondre("❌ Failed to remove card from deck.");
  }

});


// ===============================
// 🔄 10️⃣ SWAP DECK WITH COLLECTION
// ===============================
hango({
  nomCom: "swapdeck",
  categorie: "CARDS",
  reaction: "🔄",
  desc: "Swap a card in your deck with a card in your collection"
}, async (dest, hn, { auteurMessage, arg, repondre }) => {
  let user = await UserCards.findOne({ userId: auteurMessage });
  if (!user) return repondre("❌ Use *.startgame* first.");

  const deckIndex = parseInt(arg[0]) - 1;
  const collectionIndex = parseInt(arg[1]) - 1;

  if (isNaN(deckIndex) || isNaN(collectionIndex))
    return repondre("❌ Provide valid indices: *.swapdeck <deckIndex> <collectionIndex>*");

  if (deckIndex < 0 || deckIndex >= user.deck.length)
    return repondre(`❌ Invalid deck index. Your deck has ${user.deck.length} cards.`);

  if (collectionIndex < 0 || collectionIndex >= user.collection.length)
    return repondre(`❌ Invalid collection index. Your collection has ${user.collection.length} cards.`);

  const temp = user.deck[deckIndex];
  user.deck[deckIndex] = user.collection[collectionIndex];
  user.collection[collectionIndex] = temp;

  await user.save();
  repondre(`🔄 Swapped *${user.deck[deckIndex].name}* in deck with *${user.collection[collectionIndex].name}* from collection.`);
});

// ===============================
// 11️⃣ VIEW DECK STATS
// ===============================
hango({
  nomCom: "mydeckstats",
  categorie: "CARDS",
  reaction: "📊",
  desc: "View statistics of your deck"
}, async (dest, hn, { auteurMessage, repondre }) => {
  let user = await UserCards.findOne({ userId: auteurMessage });
  if (!user || user.deck.length === 0) return repondre("🛡️ Your deck is empty.");

  const tiers = user.deck.map(c => parseInt(c.tier.replace('T','')));
  const avgTier = (tiers.reduce((a,b)=>a+b,0)/tiers.length).toFixed(2);

  let text = `📊 *YOUR DECK STATS*\n\n`;
  text += `🛡️ Deck Size: ${user.deck.length}\n`;
  text += `💎 Average Tier: T${avgTier}\n`;
  text += `🎴 Cards:\n`;
  user.deck.forEach((c, i) => {
    text += `${i + 1}. ${c.name} | ${c.tier} | ${c.series}\n`;
  });

  repondre(text);
});

// ===============================
// 12️⃣ DAILY REWARD
// ===============================
hango({
  nomCom: "dailyreward",
  categorie: "CARDS",
  reaction: "🎁",
  desc: "Claim your daily reward"
}, async (dest, hn, { auteurMessage, repondre }) => {
  let reward = await UserRewards.findOne({ userId: auteurMessage });
  const now = new Date();

  if (reward && (now - reward.lastClaim) < 24*60*60*1000)
    return repondre("❌ You have already claimed your daily reward. Try again tomorrow.");

  const tiers = Object.keys(CARDS);
  const tier = tiers[Math.floor(Math.random() * tiers.length)];
  const card = CARDS[tier][Math.floor(Math.random() * CARDS[tier].length)];

  let user = await UserCards.findOne({ userId: auteurMessage });
  if (!user) return repondre("❌ Use *.startgame* first.");

  user.collection.push({
    name: card.name,
    tier,
    series: card.series,
    captcha: Math.random().toString(36).substring(2, 7).toUpperCase()
  });

  await user.save();

  if (!reward) {
    reward = await UserRewards.create({ userId: auteurMessage, lastClaim: now });
  } else {
    reward.lastClaim = now;
    await reward.save();
  }

  repondre(`🎁 Daily reward claimed!\n⭐ You got *${card.name}*\n💎 Tier: ${tier}\n🌍 Series: ${card.series}`);
});

// ===============================
// 13️⃣ BATTLE
// ==============================

hango({
  nomCom: "battle",
  categorie: "CARDS",
  reaction: "⚔️",
  desc: "Battle a random bot"
}, async (dest, hn, { auteurMessage, repondre }) => {
  const user = await UserCards.findOne({ userId: auteurMessage });
  if (!user || user.deck.length === 0) return repondre("❌ Setup your deck first with *.add2deck*.");

  // Simulate bot deck (random cards)
  const botPower = Math.floor(Math.random() * 100) + 50;
  const userPower = user.deck.reduce((sum, c) => sum + parseInt(c.tier.replace('T',''))*10,0);

  let result = "";
  if (userPower >= botPower) {
    result = `✅ You won the battle!`;
    user.wins += 1;
    await addXP(user, 50);
    user.coins += 100;
  } else {
    result = `❌ You lost the battle.`;
    user.losses += 1;
    await addXP(user, 20);
    user.coins += 20;
  }

  await user.save();
  repondre(`⚔️ Battle result:\n${result}\n💰 Coins: ${user.coins}\n⭐ XP: ${user.xp} (Level ${user.level})`);
});

// ===============================
// 1️⃣ ADD CARD TO USER COLLECTION
// ===============================
hango({
  nomCom: "addcard",
  categorie: "CARDS",
  reaction: "➕",
  desc: "Add a card manually to a user's collection (owner only)"
}, async (dest, hn, { arg, auteurMessage, repondre }) => {
  try {
    const [userId, tier, name, series] = arg;
    if (!userId || !tier || !name || !series) 
      return repondre("❌ Usage: addcard <userId> <tier> <name> <series>");

    let user = await UserCards.findOne({ userId });
    if (!user) user = await UserCards.create({ userId, collection: [], deck: [] });

    user.collection.push({
      name,
      tier,
      series,
      captcha: Math.random().toString(36).substring(2,7).toUpperCase()
    });

    await user.save();
    repondre(`✅ Added card *${name}* (${tier} | ${series}) to user ${userId}.`);
  } catch (err) {
    console.error(err);
    repondre("❌ Failed to add card.");
  }
});

// ===============================
// 2️⃣ VIEW CARD GUIDE
// ===============================
hango({
  nomCom: "cardguide",
  categorie: "CARDS",
  reaction: "📖",
  desc: "View all tiers and sample cards"
}, async (dest, hn, { repondre }) => {
  let text = "📖 *CARD GUIDE*\n\n";
  for (const tier in CARDS) {
    text += `⭐ Tier ${tier}:\n`;
    CARDS[tier].slice(0,5).forEach(c => {
      text += `  - ${c.name} (${c.series})\n`;
    });
  }
  repondre(text);
});

// ===============================
// 3️⃣ CHECK USER COLLECTION
// ===============================
hango({
  nomCom: "usercl",
  categorie: "CARDS",
  reaction: "📦",
  desc: "Check collection of a user"
}, async (dest, hn, { arg, repondre }) => {
  try {
    const userId = arg[0];
    if (!userId) return repondre("❌ Usage: usercl <userId>");

    const user = await UserCards.findOne({ userId });
    if (!user || user.collection.length === 0) return repondre("📦 User has no cards.");

    let text = `📦 *${userId} COLLECTION*\n\n`;
    user.collection.forEach((c, i) => {
      text += `${i+1}. ${c.name} | ${c.tier} | ${c.series}\n`;
    });

    repondre(text);
  } catch (err) {
    console.error(err);
    repondre("❌ Failed to fetch user collection.");
  }
});

// ===============================
// 4️⃣ VIEW TIERS
// ===============================
hango({
  nomCom: "tiers",
  categorie: "CARDS",
  reaction: "📊",
  desc: "View all available tiers with emojis and descriptions"
}, async (dest, hn, { repondre }) => {

  const tiers = [
    { tier: "T1", emoji: "⭐", desc: "Beginner level cards, easy to collect" },
    { tier: "T2", emoji: "🌟", desc: "Low rarity cards, start building your deck" },
    { tier: "T3", emoji: "💠", desc: "Intermediate cards, slightly stronger" },
    { tier: "T4", emoji: "💎", desc: "Advanced cards, rare and powerful" },
    { tier: "T5", emoji: "🔥", desc: "High tier, strong and valuable cards" },
    { tier: "T6", emoji: "⚡", desc: "Very rare cards, for serious collectors" },
    { tier: "T7", emoji: "🌌", desc: "Top tier cards, ultimate power!" },
  ];

  let text = "📊 *Available Tiers*\n\n";
  tiers.forEach(t => {
    text += `${t.emoji} *${t.tier}* - ${t.desc}\n`;
  });

  text += `\n💡 Tip: Use *.tier <tier>* to see all cards in that tier.\nExample: *.tier T5*`;

  repondre(text);
});

// 5️⃣ VIEW COLLECTION BY TIER
// =============================

  hango({
  nomCom: "tier",
  categorie: "CARDS",
  reaction: "🔹",
  desc: "View cards of a specific tier"
}, async (dest, hn, { arg, repondre }) => {
  const tier = (arg[0] || "T1").toUpperCase();
  if (!CARDS[tier]) return repondre("❌ Invalid tier. Use T1–T7");

  let text = `🔹 *CARDS – Tier ${tier}*\n`;
  CARDS[tier].forEach((c, i) => {
    text += `${i+1}. ${c.name} | ${c.series}\n`;
  });
  repondre(text);
});
// ===============================
// 6️⃣ SEARCH CARD BY NAME
// ===============================
hango({
  nomCom: "searcht",
  categorie: "CARDS",
  reaction: "🔍",
  desc: "Search cards by name"
}, async (dest, hn, { arg, repondre }) => {
  const query = arg.join(" ").toLowerCase();
  if (!query) return repondre("❌ Usage: searcht <name>");

  let results = [];
  for (const tier in CARDS) {
    CARDS[tier].forEach(c => {
      if (c.name.toLowerCase().includes(query)) {
        results.push(`${c.name} | ${c.tier} | ${c.series}`);
      }
    });
  }

  if (results.length === 0) return repondre("❌ No cards found with that name.");
  repondre(`🔍 Search results:\n${results.join("\n")}`);
});

// ===============================
// 7️⃣ WISHLIST (SAVE CARD YOU WANT)
// ===============================
hango({
  nomCom: "wishlist",
  categorie: "CARDS",
  reaction: "📝",
  desc: "Add a card to your wishlist"
}, async (dest, hn, { arg, auteurMessage, repondre }) => {
  try {
    const cardName = arg.join(" ");
    if (!cardName) return repondre("❌ Usage: wishlist <card name>");

    let user = await UserCards.findOne({ userId: auteurMessage });
    if (!user) user = await UserCards.create({ userId: auteurMessage, collection: [], deck: [], wishlist: [] });

    if (!user.wishlist) user.wishlist = [];
    user.wishlist.push(cardName);
    await user.save();

    repondre(`✅ Added *${cardName}* to your wishlist.`);
  } catch (err) {
    console.error(err);
    repondre("❌ Failed to add to wishlist.");
  }
});

 hango({
  nomCom: "vcard",
  categorie: "CARDS",
  reaction: "🃏",
  desc: "View full details of a card"
}, async (dest, hn, { auteurMessage, arg, repondre }) => {
  const index = parseInt(arg[0]);
  if (!index) return repondre("❌ Usage: .vcard <index>");

  const user = await UserCards.findOne({ userId: auteurMessage });
  if (!user || user.collection.length === 0)
    return repondre("📦 You have no cards.");

  const card = user.collection[index - 1];
  if (!card) return repondre("❌ Card not found.");

  let text = `🃏 *CARD DETAILS*\n\n`;
  text += `⭐ Name: ${card.name}\n`;
  text += `💎 Tier: ${card.tier}\n`;
  text += `🌍 Series: ${card.series}\n`;
  text += `🆔 Captcha: ${card.captcha || "N/A"}\n`;
  text += `📦 Location: ${card.inDeck ? "Deck" : "Collection"}\n`;

  repondre(text);
});

hango({
  nomCom: "lockcard",
  categorie: "CARDS",
  reaction: "🔒",
  desc: "Lock a card"
}, async (dest, hn, { auteurMessage, arg, repondre }) => {
  const index = parseInt(arg[0]);
  if (!index) return repondre("❌ Usage: .lockcard <index>");

  const user = await UserCards.findOne({ userId: auteurMessage });
  const card = user?.collection[index - 1];
  if (!card) return repondre("❌ Card not found.");

  card.locked = true;
  await user.save();

  repondre(`🔒 *${card.name}* is now locked.`);
});


hango({
  nomCom: "p",
  categorie: "CARDS",
  reaction: "👤",
  desc: "View your profile"
}, async (dest, hn, { auteurMessage, repondre }) => {

  try {
    const user = await UserCards.findOne({ userId: auteurMessage });
    if (!user) return repondre("❌ No profile found.");

    let pp;
    try {
      pp = await hn.profilePictureUrl(auteurMessage, "image");
    } catch {

      pp = "https://i.imgur.com/6VBx3io.png";
    }

    let text = `👤 *PLAYER PROFILE*\n\n`;
    text += `📦 Total Cards: ${user.collection.length}\n`;
    text += `🛡 Deck Cards: ${user.deck.length}\n`;
    text += `💰 Coins: ${user.coins || 0}\n`;
    text += `🏆 Wins: ${user.wins || 0}\n`;
    text += `💀 Losses: ${user.losses || 0}\n`;

    await hn.sendMessage(dest, {
      image: { url: pp },
      caption: text,
      mentions: [auteurMessage]
    });

  } catch (err) {
    console.error(err);
    repondre("❌ Failed to load profile.");
  }
});

hango({
  nomCom: "leaderboard",
  categorie: "CARDS",
  reaction: "🏆",
  desc: "View top players"
}, async (dest, hn, { repondre }) => {
  const top = await UserCards.find().sort({ xp: -1 }).limit(10);

  let text = "–『 🏆 LEADERBOARD 🏆 』–\n\n";
  top.forEach((u, i) => {
    text += `${i+1}. ${u.userId} | Level: ${u.level} | XP: ${u.xp} | Coins: ${u.coins}\n`;
  });

  repondre(text);
});

hango({
  nomCom: "collection",
  categorie: "CARDS",
  reaction: "📦",
  desc: "View your card collection with summary and tips"
}, async (dest, hn, { auteurMessage, repondre }) => {
  let user = await UserCards.findOne({ userId: auteurMessage });
  if (!user || user.collection.length === 0) 
    return repondre("📦 Your collection is empty. Use *.pull* to get your first card!");

  // 1️⃣ Summary
  const totalCards = user.collection.length;
  const deckSize = user.deck.length;
  let tierCount = {};
  user.collection.forEach(c => {
    tierCount[c.tier] = (tierCount[c.tier] || 0) + 1;
  });

  // 2️⃣ Top 5 cards (by tier T7 > T6 > ... > T1)
  const sortedCards = user.collection.sort((a, b) => parseInt(b.tier.slice(1)) - parseInt(a.tier.slice(1)));
  const topCards = sortedCards.slice(0, 5).map(c => `⭐ ${c.name} | ${c.tier} | ${c.series}`).join("\n");

  // 3️⃣ Build message
  let text = `📦 *YOUR COLLECTION SUMMARY*\n\n`;
  text += `💠 Total cards: ${totalCards}\n`;
  text += `🛡️ Cards in deck: ${deckSize}\n`;
  text += `📊 Tier breakdown: ${Object.entries(tierCount).map(([t, n]) => `${t}: ${n}`).join(", ")}\n\n`;
  text += `🌟 *Top 5 Cards*:\n${topCards}\n\n`;
  text += `💡 Tips:\n`;
  text += `- Use *.vcard <index>* to view card details.\n`;
  text += `- Use *.add2deck <index>* to add a card to your deck (max 3).\n`;
  text += `- Use *.deck2co <index>* to remove a card from your deck.\n`;
  text += `- Use *.wishlist <card name>* to track cards you want.`;

  repondre(text);
});

hango({
  nomCom: "trade",
  categorie: "CARDS",
  reaction: "🔄",
  desc: "Trade cards with another user"
}, async (dest, hn, { auteurMessage, arg, repondre }) => {
  // arg: [userTag, yourCardIndex, theirCardIndex]
  if (arg.length < 3) return repondre("❌ Usage: .trade <@user> <your_card_index> <their_card_index>");

  const mention = arg[0]; // e.g. @username or phone number
  const yourIndex = parseInt(arg[1]);
  const theirIndex = parseInt(arg[2]);

  if (!yourIndex || !theirIndex) return repondre("❌ Card indexes must be numbers.");

  // Fetch both users
  const userA = await UserCards.findOne({ userId: auteurMessage });
  const userB = await UserCards.findOne({ userId: mention });

  if (!userA || !userB) return repondre("❌ One or both users do not have a card profile.");

  const cardA = userA.collection[yourIndex - 1];
  const cardB = userB.collection[theirIndex - 1];

  if (!cardA) return repondre("❌ Your selected card not found.");
  if (!cardB) return repondre("❌ The other user's card not found.");

  // Swap cards
  userA.collection[yourIndex - 1] = cardB;
  userB.collection[theirIndex - 1] = cardA;

  await userA.save();
  await userB.save();

  repondre(`✅ Trade successful!\n\n` +
           `You gave: ${cardA.name} | ${cardA.tier} | ${cardA.series}\n` +
           `You received: ${cardB.name} | ${cardB.tier} | ${cardB.series}`);
});

hango({
  nomCom: "addcoins",
  categorie: "Economy",
  reaction: "💰",
  desc: "Add coins to your account (admin only)"
}, async (dest, hn, { auteurMessage, arg, repondre, nomAuteurMessage }) => {
  console.log("DEBUG: addcoins fired", arg);

  try {
    const amount = parseInt(arg[0]);
    if (isNaN(amount) || amount <= 0) return repondre("❌ Usage: .addcoins <amount>");

    const user = await UserCards.findOne({ userId: auteurMessage });
    console.log("DEBUG: user found:", user);

    if (!user) return repondre("❌ You don't have a game account yet. Use *.startgame* first.");

    user.coins += amount;
    await user.save();

    repondre(`✅ Added *${amount} coins* to your balance. New balance: *${user.coins} coins*`);
  } catch (e) {
    console.error("ADDCOINS ERROR:", e);
    repondre(`❌ An error occurred: ${e.message}`);
  }
});

