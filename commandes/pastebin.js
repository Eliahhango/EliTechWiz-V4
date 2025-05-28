const { hango } = require("../framework/hango");
const axios = require("axios");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

// Use environment variables for sensitive data
const botToken = process.env.BOT_TOKEN; // Replace with your environment variable or configuration management
const baseUrl = `https://api.telegram.org/bot${botToken}`;

hango({
  nomCom: 'telesticker',
  categorie: 'Mods'
}, async (ms, repondre, arg, nomAuteurMessage, superUser) => {
  if (!superUser) {
    repondre("Only Mods can use this command");
    return;
  }

  if (!arg[0]) {
    repondre("Please provide a Telegram sticker link");
    return;
  }

  const stickerLink = arg.join(" ");
  const stickerSetName = stickerLink.split("/addstickers/")[1];
  const requestUrl = `${baseUrl}/getStickerSet?name=${encodeURIComponent(stickerSetName)}`;

  try {
    const response = await axios.get(requestUrl);
    const stickerSet = response.data.result;

    const isAnimated = stickerSet.is_animated || stickerSet.is_video;
    const stickerType = isAnimated ? "animated sticker" : "not animated sticker";
    const statusMessage = `
      Eliah-stickers-dl
      *Name:* ${stickerSet.name}
      *Type:* ${stickerType}
      *Length:* ${stickerSet.stickers.length}
      Downloading...
    `;

    await repondre(statusMessage);

    for (const sticker of stickerSet.stickers) {
      const fileResponse = await axios.get(`${baseUrl}/getFile?file_id=${sticker.file_id}`);
      const filePath = fileResponse.data.result.file_path;
      const fileData = await axios({
        method: 'get',
        url: `https://api.telegram.org/file/bot${botToken}/${filePath}`,
        responseType: 'arraybuffer'
      });

      // Adjust type according to your needs
      const stickerObject = new Sticker(fileData.data, {
        pack: nomAuteurMessage,
        author: "ELITECHWIZ",
        type: isAnimated ? StickerTypes.ANIMATED : StickerTypes.FULL, // Use appropriate type
        categories: ['🤩', '🎉'],
        id: "12345",
        quality: 50,  // Adjust quality as needed
        background: "#000000"
      });

      const stickerBuffer = await stickerObject.toBuffer();
      await ms.sendMessage(ms, { sticker: stickerBuffer }, { quoted: ms });
    }
  } catch (error) {
    repondre(`An error occurred: ${error.message}`);
  }
});
