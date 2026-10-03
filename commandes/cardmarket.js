const { hango } = require("../framework/hango");
const UserCards = require("../models/UserCards");
const CardMarketplace = require("../models/CardMarketplace");

hango({
  nomCom: "sellcard",
  categorie: "CARDS",
  reaction: "💰",
  desc: "Sell a card to the marketplace"
}, async (dest, hn, { auteurMessage, arg, repondre, nomAuteurMessage }) => {
  const index = parseInt(arg[0]) - 1;
  const price = parseInt(arg[1]);

  if (isNaN(index) || isNaN(price) || price <= 0) 
    return repondre("❌ Usage: .sellcard <index> <price>");

  const user = await UserCards.findOne({ userId: auteurMessage });
  if (!user) return repondre("❌ You have no cards.");

  const card = user.collection.splice(index, 1)[0];
  if (!card) return repondre("❌ Card not found.");

  const captcha = Math.random().toString(36).substring(2, 7).toUpperCase();

  await CardMarketplace.create({
    name: card.name,
    tier: card.tier,
    series: card.series,
    ownerId: auteurMessage,
    ownerName: nomAuteurMessage || "Unknown",
    price,
    captcha,
    status: "available"
  });

  await user.save();

  repondre(`📦 You listed *${card.name}* (Tier: ${card.tier}, Series: ${card.series}) for *${price.toLocaleString()} coins*.\n🔐 CAPTCHA: ${captcha}`);
});

hango({
  nomCom: "cardmarket",
  categorie: "CARDS",
  reaction: "🛒",
  desc: "View the card marketplace"
}, async (dest, hn, { repondre }) => {
  try {
    const cards = await CardMarketplace.find({ status: "available" }).sort({ createdAt: 1 });

    if (!cards.length) return repondre("📦 Marketplace is empty.");

    let text = "–『 🃏 CARD MARKETPLACE 🃏 』–\n\n";

    cards.forEach((card, i) => {
      text += `📊 INDEX ${i + 1}\n`;
      text += `🃏 Card Name: ${card.name}\n`;
      text += `💎 Tier: ${card.tier}\n`;
      text += `🌐 Series: ${card.series}\n`;
      text += `💰 Price: ${card.price.toLocaleString()} coins\n`;
      text += `🔐 CAPTCHA: ${card.captcha}\n`;
      text += `👤 Owner: ${card.ownerName}\n`;
      text += "─────────────────────\n";
    });

    text += "💡 Use *.buycard <index>* to purchase a card.";
    repondre(text);
  } catch (err) {
    console.error("CARDMARKET ERROR:", err);
    repondre("⚠️ Error fetching marketplace data.");
  }
});

hango({
  nomCom: "buycard",
  categorie: "CARDS",
  reaction: "🛍️",
  desc: "Buy a card from the marketplace"
}, async (dest, hn, { auteurMessage, arg, repondre }) => {
  const index = parseInt(arg[0]) - 1;
  if (isNaN(index)) return repondre("❌ Usage: .buycard <index>");

  const user = await UserCards.findOne({ userId: auteurMessage });
  if (!user) return repondre("❌ You have no game account.");

  const marketCards = await CardMarketplace.find({ status: "available" }).sort({ createdAt: 1 });
  if (!marketCards[index]) return repondre("❌ Card not found.");

  const card = marketCards[index];

  if (user.coins < card.price) 
    return repondre(`❌ You don't have enough coins. Card price: ${card.price}, Your coins: ${user.coins}`);

  // Deduct coins and add card to collection
  user.coins -= card.price;
  user.collection.push({
    name: card.name,
    tier: card.tier,
    series: card.series,
    captcha: card.captcha
  });
  await user.save();

  // Mark card as sold
  card.status = "sold";
  await card.save();

  repondre(`✅ You purchased *${card.name}* (Tier: ${card.tier}, Series: ${card.series}) for *${card.price.toLocaleString()} coins*`);
});