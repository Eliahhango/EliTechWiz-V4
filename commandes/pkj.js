const { hango } = require("../framework/hango");
const { generateProfilePicture } = require("axios");
const { S_WHATSAPP_NET } = require('@whiskeysockets/baileys');
const fs = require("fs");

hango({
  nomCom: "fullpp",
  aliases: ["updatepp", "ppfull"],
  reaction: '⚔️',
  categorie: "search"
}, async (dest, hn, commandeOptions) => {
  const { repondre, msgRepondu, auteurMessage } = commandeOptions;

  if (msgRepondu) {
    repondre('quote an image');

    let media;
    if (msgRepondu.imageMessage) {
      media = msgRepondu.imageMessage;
    } else {
      repondre('This is not an image...');
      return;
    }

    try {
      var medis = await hn.downloadAndSaveMediaMessage(media);

      var { img } = await generateProfilePicture(medis);

      await hn.query({
        tag: 'iq',
        attrs: {
          target: undefined,
          to: S_WHATSAPP_NET,
          type: 'set',
          xmlns: 'w:profile:picture'
        },
        content: [
          {
            tag: 'picture',
            attrs: { type: 'image' },
            content: img
          }
        ]
      });

      fs.unlinkSync(medis);
      repondre("Bot Profile Picture Updated");
    } catch (error) {
      repondre("An error occurred while updating bot profile photo: " + error);
    }
  } else {
    repondre('No image was quoted.');
  }
});
