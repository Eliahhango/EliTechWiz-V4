const {
  hango
} = require("../framework/hango");
const {
  default: axios
} = require("axios");
hango({
  nomCom: "asthetic",
  reaction: '✌️',
  categorie: "ELITECHWIZ PICTURES"
}, async (message, sendMessage, { repondre, arg, ms }) => {
  try {
    const response = await fetch("https://api.maher-zubair.tech/wallpaper/asthetic");
    const data = await response.json();
    const imageUrl = data.urls.regular;

    const messageData = {
      image: {
        url: imageUrl
      },
      caption: "*POWERED BY 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰*"
    };

    await sendMessage(message, messageData, { quoted: ms });
  } catch (error) {
    console.error("Error fetching wallpaper:", error);
  }
});
