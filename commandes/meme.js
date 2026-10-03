// commands/meme.js
const { hango } = require("../framework/hango");
const fetch = require("node-fetch");

hango({
  nomCom: "meme",
  categorie: "Fun",
  desc: "Get a Cheems meme",
}, async (jid, hn, { ms, repondre }) => {
  try {
    const response = await fetch('https://shizoapi.onrender.com/api/memes/cheems?apikey=shizo');

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('image')) {
      return repondre('❌ Failed to fetch meme. Invalid API response.');
    }

    const imageBuffer = await response.buffer();

    const buttons = [
      { buttonId: '.meme', buttonText: { displayText: '🎭 Another Meme' }, type: 1 },
      { buttonId: '.joke', buttonText: { displayText: '😄 Joke' }, type: 1 }
    ];

    await hn.sendMessage(jid, {
      image: imageBuffer,
      caption: "> Here's your cheems meme! 🐕",
      buttons: buttons,
      headerType: 1
    }, { quoted: ms });

  } catch (error) {
    console.error('Error in meme command:', error);
    return repondre('❌ Failed to fetch meme. Please try again later.');
  }
});
