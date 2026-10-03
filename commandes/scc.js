const mongoose = require("mongoose");
const { hango } = require("../framework/hango");
const CARDS = require("../lib/cards");
const UserCards = require("../models/UserCards");
const Canvas = require("@napi-rs/canvas");

// ===============================
// 1️⃣ MongoDB Connection
// ===============================
const MONGODB_URI = "mongodb+srv://kingmejakuntu:kJJHpgs8BEU7i9KP@cluster0.hv05qr1.mongodb.net/whatsappbot?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ===============================
// 2️⃣ SCC Command
// ===============================
hango({
  nomCom: "scc",
  desc: "Show card thumbnail",
  categorie: "CARDS",
  reaction: "🃏"
}, async (dest, hn, commandeOptions) => {
  const { repondre } = commandeOptions;
  const args = commandeOptions.args || []; // safeguard

  try {
    // ✅ Validate args
    if (!args[0]) return repondre("⚠️ Provide card index. Usage: .scc <number>");
    const cardIndex = parseInt(args[0]);
    if (isNaN(cardIndex)) return repondre("⚠️ Card index must be a number.");

    console.log("🔹 Fetching Card #", cardIndex);

    // 3️⃣ Fetch card from MongoDB first
    let card = await UserCards.findOne({ index: cardIndex });
    console.log("🔹 Card from MongoDB:", card);

    // 4️⃣ Fallback to local CARDS
    if (!card) {
      card = CARDS.find(c => c.index === cardIndex);
      console.log("🔹 Card from local CARDS:", card);
      if (!card) return repondre(`⚠️ Card #${cardIndex} not found.`);
    }

    // ===============================
    // 5️⃣ Canvas setup
    // ===============================
    const width = 600;
    const height = 800;
    const canvas = Canvas.createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#e0e0e0";
    ctx.fillRect(0, 0, width, height);

    // Border color based on Tier
    const tierColors = { T1: "#c0c0c0", T2: "#00ff00", T3: "#0000ff", T4: "#ff8c00", T5: "#ff0000" };
    ctx.strokeStyle = tierColors[card.tier] || "#8a2be2";
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, width, height);

    // Character Image
    console.log("🔹 Loading image from URL:", card.imageUrl);
    const img = await Canvas.loadImage(card.imageUrl);
    ctx.drawImage(img, 50, 50, 500, 400);

    // Text info
    ctx.fillStyle = "#000";
    ctx.font = "bold 28px Arial";
    ctx.fillText(`Card #${card.index}`, 50, 480);
    ctx.fillText(`Name: ${card.name}`, 50, 520);
    ctx.fillText(`Tier: ${card.tier}`, 50, 560);
    ctx.fillText(`Series: ${card.series}`, 50, 600);
    ctx.fillText(`Captcha: ${card.captcha}`, 50, 640);
    if (card.price) ctx.fillText(`Price: $${card.price}`, 50, 680);

    // Convert canvas to buffer
    const buffer = canvas.toBuffer("image/png");

    // Send image + caption
    console.log("🔹 Sending thumbnail image...");
    await hn.sendMessage(dest, { image: buffer, caption: `Card #${card.index} - ${card.name}` });
    console.log("✅ Card thumbnail sent successfully.");

  } catch (err) {
    console.error("❌ SCC Command Error:", err);
    repondre(`⚠️ Error generating card thumbnail: ${err.message}`);
  }
});