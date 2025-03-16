const { hango } = require("../framework");

hango({
    nomCom: "cat",
    categorie: "fun",
    reaction: "🐱",
    desc: "Send random cat images!",
  },
  async (dest, hn, commandeOptions) => {
    try {
      const imageUrl = "https://cataas.com/cat"; // API for cat images
      const fileName = "random_cat.jpg"; // Image file name

      await hn.sendImage(dest, imageUrl, fileName, "*Meowww!*");
    } catch (e) {
      console.log("Error sending cat image:", e); // Debugging
      await hn.sendText(dest, `❌ Error: ${e.message}`);
    }
  }
);
