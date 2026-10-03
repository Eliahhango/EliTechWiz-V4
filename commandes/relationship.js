const { hango } = require("../framework/hango");
const Relationship = require("../models/Relationship");

hango({
  nomCom: "relationship",
  categorie: "fun",
  reaction: "💖",
  desc: "Show relationship status"
}, async (dest, hn, { auteurMessage, nomAuteurMessage, repondre }) => {

  try {

    let rel = await Relationship.findOne({ userId: auteurMessage });

    if (!rel) {
      rel = await Relationship.create({
        userId: auteurMessage,
        username: nomAuteurMessage || "User",
        partner: "EliTechWiz-V4",
        married: true
      });
    }

    const today = new Date();
    const startDate = new Date(rel.startedAt);
    const diffTime = today - startDate;
    const daysTogether = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const startedOn = startDate.toDateString();

    const text = `💖 *Relationship Status for ${rel.username}*

💑 Partner: ${rel.partner}
🗓 Days together: ${daysTogether}
💍 Married: ${rel.married ? "Yes" : "No"}
📅 Started on: ${startedOn}`;

    const imageUrl = "https://files.catbox.moe/2ecpa0.jpeg";

    await hn.sendMessage(dest, {
      image: { url: imageUrl },
      caption: text
    });

  } catch (err) {
    console.log("❌ RELATIONSHIP ERROR:", err);
    await repondre("Error: " + err.message);
  }

});