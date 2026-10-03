const { hango } = require("../framework/hango");
const Canvas = require("canvas");
const fetch = require("node-fetch");

hango({
  nomCom: "respect",
  categorie: "Fun",
  reaction: "🫡",
  desc: "Mission passed respect image (Canvas Version)",
  nomFichier: __filename.split("/").pop()
}, async (dest, hn, { auteurMessage, mention, repondre }) => {
  try {
    const targetJid = mention?.[0] || auteurMessage;

    // Get profile picture
    let pp;
    try {
      pp = await hn.profilePictureUrl(targetJid, "image");
    } catch {
      pp = "https://i.imgur.com/8RKXAIV.png";
    }

    // Load profile picture
    const avatar = await Canvas.loadImage(pp);

    // Create canvas
    const canvas = Canvas.createCanvas(800, 450);
    const ctx = canvas.getContext("2d");

    // Background color
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw profile picture as circle
    const x = canvas.width / 2;
    const y = canvas.height / 2 - 50;
    const radius = 80;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(avatar, x - radius, y - radius, radius * 2, radius * 2);
    ctx.restore();

    // Draw "MISSION PASSED"
    ctx.fillStyle = "#ffff00";
    ctx.font = "bold 50px Impact";
    ctx.textAlign = "center";
    ctx.fillText("MISSION PASSED", canvas.width / 2, canvas.height - 100);

    // Convert to buffer
    const buffer = canvas.toBuffer();

    // Send image
    await hn.sendMessage(dest, {
      image: { buffer },
      caption: "🎮 *MISSION PASSED*\n🫡 *RESPECT +*"
    });

  } catch (err) {
    console.error(err);
    repondre("❌ Failed: " + err.message);
  }
});

