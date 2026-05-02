const { hango } = require('../framework/hango');
const gis = require('g-i-s');
const axios = require('axios');
const conf = require(__dirname + '/../set');
hango({
  nomCom: "screenswidth",
  categorie: "take-screenshots",
  reaction: "🎞️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  try {
    // Caption for the screenshot
    const cap = `🖼️✨ Screenshot by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 ⚡️ | 🚀 Stay Elite!`;

    // Check if a URL is provided
    if (!arg[0]) {
      return repondre('Please insert a website link to take a screenshot!');
    }

    // Construct the screenshot URL
    const image = `https://image.thum.io/get/width/${arg[0]}`;

    // Send the screenshot image with the caption
    await hn.sendMessage(dest, {
      image: { url: image },
      caption: cap
    }, { quoted: ms });

  } catch (error) {
    // Log the error and notify the user with a formatted error message
    console.error(error);
    repondre(`An error occurred while processing the screenshot: ${error.message}`);
  }
});
hango({
  nomCom: "screenscrop",
  categorie: "take-screenshots",
  reaction: "🎞️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  try {
    // Caption for the screenshot
    const cap = `🖼️✨ Screenshot by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 ⚡️ | 🚀 Stay Elite!`;

    // Check if a URL is provided
    if (!arg[0]) {
      return repondre('Please insert a website link to take a screenshot!');
    }

    // Construct the screenshot URL
    const image = `https://image.thum.io/get/crop/${arg[0]}`;

    // Send the screenshot image with the caption
    await hn.sendMessage(dest, {
      image: { url: image },
      caption: cap
    }, { quoted: ms });

  } catch (error) {
    // Log the error and notify the user with a formatted error message
    console.error(error);
    repondre(`An error occurred while processing the screenshot: ${error.message}`);
  }
});
hango({
  nomCom: "maxage",
  categorie: "take-screenshots",
  reaction: "🎞️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  try {
    // Caption for the screenshot
    const cap = `🖼️✨ Screenshot by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 ⚡️ | 🚀 Stay Elite!`;

    // Check if a URL is provided
    if (!arg[0]) {
      return repondre('Please insert a website link to take a screenshot!');
    }

    // Construct the screenshot URL
    const image = `https://image.thum.io/get/maxAge/${arg[0]}`;

    // Send the screenshot image with the caption
    await hn.sendMessage(dest, {
      image: { url: image },
      caption: cap
    }, { quoted: ms });

  } catch (error) {
    // Log the error and notify the user with a formatted error message
    console.error(error);
    repondre(`An error occurred while processing the screenshot: ${error.message}`);
  }
});
hango({
  nomCom: "jpg",
  categorie: "tak-screenshots",
  reaction: "🎞️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  try {
    // Caption for the screenshot
    const cap = `🖼️✨ Screenshot by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 ⚡️ | 🚀 Stay Elite!`;

    // Check if a URL is provided
    if (!arg[0]) {
      return repondre('Please insert a website link to take a screenshot!');
    }

    // Construct the screenshot URL
    const image = `https://image.thum.io/get/allowJPG/${arg[0]}`;

    // Send the screenshot image with the caption
    await hn.sendMessage(dest, {
      image: { url: image },
      caption: cap
    }, { quoted: ms });

  } catch (error) {
    // Log the error and notify the user with a formatted error message
    console.error(error);
    repondre(`An error occurred while processing the screenshot: ${error.message}`);
  }
});
hango({
  nomCom: "png",
  aliases: ["ss", "sshot"],
  categorie: "take-screenshots",
  reaction: "🎞️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  try {
    // Caption for the screenshot
    const cap = `🖼️✨ Screenshot by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 ⚡️ | 🚀 Stay Elite!`;

    // Check if a URL is provided
    if (!arg[0]) {
      return repondre('Please insert a website link to take a screenshot!');
    }

    // Construct the screenshot URL
    const image = `https://image.thum.io/get/png/${arg[0]}`;

    // Send the screenshot image with the caption
    await hn.sendMessage(dest, {
      image: { url: image },
      caption: cap
    }, { quoted: ms });

  } catch (error) {
    // Log the error and notify the user with a formatted error message
    console.error(error);
    repondre(`An error occurred while processing the screenshot: ${error.message}`);
  }
});
hango({
  nomCom: "noanimate",
  categorie: "take-screenshots",
  reaction: "🎞️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  try {
    // Caption for the screenshot
    const cap = `🖼️✨ Screenshot by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 ⚡️ | 🚀 Stay Elite!`;

    // Check if a URL is provided
    if (!arg[0]) {
      return repondre('Please insert a website link to take a screenshot!');
    }

    // Construct the screenshot URL
    const image = `https://image.thum.io/get/noanimate/${arg[0]}`;

    // Send the screenshot image with the caption
    await hn.sendMessage(dest, {
      image: { url: image },
      caption: cap
    }, { quoted: ms });

  } catch (error) {
    // Log the error and notify the user with a formatted error message
    console.error(error);
    repondre(`An error occurred while processing the screenshot: ${error.message}`);
  }
});
hango({
  nomCom: "wait",
  aliases: ["ss", "sshot"],
  categorie: "take-screenshots",
  reaction: "🎞️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  try {
    // Caption for the screenshot
    const cap = `🖼️✨ Screenshot take by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 ⚡️ | 🚀 Stay Elite!`;

    // Check if a URL is provided
    if (!arg[0]) {
      return repondre('Please insert a website link to take a screenshot!');
    }

    // Construct the screenshot URL
    const image = `https://image.thum.io/get/wait/${arg[0]}`;

    // Send the screenshot image with the caption
    await hn.sendMessage(dest, {
      image: { url: image },
      caption: cap
    }, { quoted: ms });

  } catch (error) {
    // Log the error and notify the user with a formatted error message
    console.error(error);
    repondre(`An error occurred while processing the screenshot: ${error.message}`);
  }
});
hango({
  nomCom: "viewportwidth",
  aliases: ["ss", "sshot"],
  categorie: "take-screenshots",
  reaction: "🎞️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  try {
    // Caption for the screenshot
    const cap = `🖼️✨ Screenshot taken by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 ⚡️ | 🚀 Stay Elite!`;

    // Check if a URL is provided
    if (!arg[0]) {
      return repondre('Please insert a website link to take a screenshot!');
    }

    // Construct the screenshot URL
    const image = `https://image.thum.io/get/viewportWidth/${arg[0]}`;

    // Send the screenshot image with the caption
    await hn.sendMessage(dest, {
      image: { url: image },
      caption: cap
    }, { quoted: ms });

  } catch (error) {
    // Log the error and notify the user with a formatted error message
    console.error(error);
    repondre(`An error occurred while processing the screenshot: ${error.message}`);
  }
});
hango({
  nomCom: "iphone5",
  categorie: "take-screenshots",
  reaction: "🎞️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  try {
    // Caption for the screenshot
    const cap = `🖼️✨ Screenshot taken by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 ⚡️ | 🚀 Stay Elite!`;

    // Check if a URL is provided
    if (!arg[0]) {
      return repondre('Please insert a website link to take a screenshot!');
    }

    // Construct the screenshot URL
    const image = `https://image.thum.io/get/iphone5/${arg[0]}`;

    // Send the screenshot image with the caption
    await hn.sendMessage(dest, {
      image: { url: image },
      caption: cap
    }, { quoted: ms });

  } catch (error) {
    // Log the error and notify the user with a formatted error message
    console.error(error);
    repondre(`An error occurred while processing the screenshot: ${error.message}`);
  }
});
hango({
  nomCom: "iphone6",
  aliases: ["ss", "sshot"],
  categorie: "take-screenshots",
  reaction: "🎞️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  try {
    // Caption for the screenshot
    const cap = `🖼️✨ Screenshot taken by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 ⚡️ | 🚀 Stay Elite!`;

    // Check if a URL is provided
    if (!arg[0]) {
      return repondre('Please insert a website link to take a screenshot!');
    }

    // Construct the screenshot URL
    const image = `https://image.thum.io/get/iphone6/${arg[0]}`;

    // Send the screenshot image with the caption
    await hn.sendMessage(dest, {
      image: { url: image },
      caption: cap
    }, { quoted: ms });

  } catch (error) {
    // Log the error and notify the user with a formatted error message
    console.error(error);
    repondre(`An error occurred while processing the screenshot: ${error.message}`);
  }
});
hango({
  nomCom: "iphone6plus",
  categorie: "take-screenshots",
  reaction: "🎞️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  try {
    // Caption for the screenshot
    const cap = `🖼️✨ Screenshot taken by 𝓔𝓵𝓲𝓣��𝓬𝓱𝓦𝓲𝔃-𝓥4 ⚡️ | 🚀 Stay Elite!`;

    // Check if a URL is provided
    if (!arg[0]) {
      return repondre('Please insert a website link to take a screenshot!');
    }

    // Construct the screenshot URL
    const image = `https://image.thum.io/get/iphone6plus/${arg[0]}`;

    // Send the screenshot image with the caption
    await hn.sendMessage(dest, {
      image: { url: image },
      caption: cap
    }, { quoted: ms });

  } catch (error) {
    // Log the error and notify the user with a formatted error message
    console.error(error);
    repondre(`An error occurred while processing the screenshot: ${error.message}`);
  }
});
hango({
  nomCom: "iphoneX",
  categorie: "take-screenshots",
  reaction: "🎞️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  try {
    // Caption for the screenshot
    const cap = `🖼️✨ Screenshot taken by 𝓔��𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4 ⚡️ | 🚀 Stay Elite!`;

    // Check if a URL is provided
    if (!arg[0]) {
      return repondre('Please insert a website link to take a screenshot!');
    }

    // Construct the screenshot URL
    const image = `https://image.thum.io/get/iphoneX/${arg[0]}`;

    // Send the screenshot image with the caption
    await hn.sendMessage(dest, {
      image: { url: image },
      caption: cap
    }, { quoted: ms });

  } catch (error) {
    // Log the error and notify the user with a formatted error message
    console.error(error);
    repondre(`An error occurred while processing the screenshot: ${error.message}`);
  }
});
hango({
  nomCom: "iphone12pro",
  aliases: ["ss", "sshot"],
  categorie: "take-screenshots",
  reaction: "🎞️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  try {
    // Caption for the screenshot
    const cap = `🖼️✨ Screenshot taken by 𝓔𝓵��𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4 ⚡️ | 🚀 Stay Elite!`;

    // Check if a URL is provided
    if (!arg[0]) {
      return repondre('Please insert a website link to take a screenshot!');
    }

    // Construct the screenshot URL
    const image = `https://image.thum.io/get/iphone12pro/${arg[0]}`;

    // Send the screenshot image with the caption
    await hn.sendMessage(dest, {
      image: { url: image },
      caption: cap
    }, { quoted: ms });

  } catch (error) {
    // Log the error and notify the user with a formatted error message
    console.error(error);
    repondre(`An error occurred while processing the screenshot: ${error.message}`);
  }
});
hango({
  nomCom: "iphone14promax",
  aliases: ["ss", "sshot"],
  categorie: "take-screenshots",
  reaction: "🎞️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  try {
    // Caption for the screenshot
    const cap = `🖼️✨ Screenshot taken by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 ⚡️ | 🚀 Stay Elite!`;

    // Check if a URL is provided
    if (!arg[0]) {
      return repondre('Please insert a website link to take a screenshot!');
    }

    // Construct the screenshot URL
    const image = `https://image.thum.io/get/iphone14promax/${arg[0]}`;

    // Send the screenshot image with the caption
    await hn.sendMessage(dest, {
      image: { url: image },
      caption: cap
    }, { quoted: ms });

  } catch (error) {
    // Log the error and notify the user with a formatted error message
    console.error(error);
    repondre(`An error occurred while processing the screenshot: ${error.message}`);
  }
});
hango({
  nomCom: "galaxys5",
  aliases: ["ss", "sshot"],
  categorie: "take-screenshots",
  reaction: "🎞️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  try {
    // Caption for the screenshot
    const cap = `🖼️✨ Screenshot taken by 𝓔𝓵𝓲��𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4 ⚡️ | 🚀 Stay Elite!`;

    // Check if a URL is provided
    if (!arg[0]) {
      return repondre('Please insert a website link to take a screenshot!');
    }

    // Construct the screenshot URL
    const image = `https://image.thum.io/get/galaxys5/${arg[0]}`;

    // Send the screenshot image with the caption
    await hn.sendMessage(dest, {
      image: { url: image },
      caption: cap
    }, { quoted: ms });

  } catch (error) {
    // Log the error and notify the user with a formatted error message
    console.error(error);
    repondre(`An error occurred while processing the screenshot: ${error.message}`);
  }
});
hango({
  nomCom: "screenshot",
  aliases: ["ss", "sshot"],
  categorie: "take-screenshots",
  reaction: "🎞️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  try {
    // Caption for the screenshot
    const cap = `🖼️✨ Screenshot taken by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 ⚡️ | 🚀 Stay Elite!`;

    // Check if a URL is provided
    if (!arg[0]) {
      return repondre('Please insert a website link to take a screenshot!');
    }

    // Construct the screenshot URL
    const image = `https://image.thum.io/get/fullpage/${arg[0]}`;

    // Send the screenshot image with the caption
    await hn.sendMessage(dest, {
      image: { url: image },
      caption: cap
    }, { quoted: ms });

  } catch (error) {
    // Log the error and notify the user with a formatted error message
    console.error(error);
    repondre(`An error occurred while processing the screenshot: ${error.message}`);
  }
});

hango({
  nomCom: "imgs",
  aliases: ["image", "images"],
  categorie: "mod-image",
  reaction: "📷"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  if (!arg[0]) {
    repondre('Which image?');
    return;
  }

  const searchTerm = arg.join(" ");
  gis(searchTerm, (error, results) => sendImage(error, results));

  function sendImage(error, results) {
    if (error) {
      repondre("Oops, an error occurred.");
      return;
    }

    if (!results || results.length === 0) {
      repondre("No images found.");
      return;
    }

    for (let i = 0; i < Math.min(results.length, 5); i++) {
      hn.sendMessage(dest, {
        image: { url: results[i].url },
        caption: `*Downloaded by ${conf.BOT}*`,
        contextInfo: {
          externalAdReply: {
            title: "Image Search Result",
            body: `Here's the image you searched for: ${searchTerm}`,
            thumbnailUrl: results[i].url,
            sourceUrl: conf.GURL,
            mediaType: 1,
            showAdAttribution: true
          }
        }
      }, { quoted: ms });
    }
  }
});

hango({
  nomCom: 'messi',
  categorie: 'mod-image',
  reaction: '🐐'
}, async (dest, hn, context) => {
  const { repondre: sendMessage, ms } = context;
  try {
    const response = await axios.get("https://raw.githubusercontent.com/Guru322/api/Guru/BOT-JSON/Messi.json");
    const images = response.data;

    if (!Array.isArray(images) || images.length === 0) {
      throw new Error("No images found in the response.");
    }

    for (let i = 0; i < 5; i++) {
      const randomImage = Math.floor(Math.random() * images.length);
      const image = images[randomImage];
      await hn.sendMessage(dest, {
        image: { url: image },
        caption: `*Downloaded by ${conf.BOT}*`,
        contextInfo: {
          externalAdReply: {
            title: "Modern-Logo Search Result",
            body: `Here's an inspiring logo related to: messi`,
            thumbnailUrl: image,
            sourceUrl: conf.GURL,
            mediaType: 1,
            showAdAttribution: true
          }
        }
      }, { quoted: ms });
    }
  } catch (error) {
    console.error("Error occurred while retrieving data:", error);
    sendMessage("Error occurred while retrieving data: " + error.message);
  }
});
hango({
  nomCom: "waifues",
  categorie: "mod-image",
  reaction: "🙄"
}, async (origineMessage, hn, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  const url = 'https://api.waifu.pics/nsfw/waifu'; // Replace with your actual URL

  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      await hn.sendMessage(origineMessage, {
        image: { url: imageUrl },
        caption: `*Downloaded by ${conf.BOT}*`,
        contextInfo: {
          externalAdReply: {
            title: "Image Search Result",
            body: `Here's a great image related to: waifu`,
            thumbnailUrl: imageUrl,
            sourceUrl: conf.GURL,
            mediaType: 1,
            showAdAttribution: true
          }
        }
      }, { quoted: ms });
    }
  } catch (error) {
    repondre('Error retrieving data: ' + error.message);
  }
});
hango({
  nomCom: "traps",
  categorie: "mod-image",
  reaction: "🙄"
}, async (origineMessage, hn, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  const url = 'https://api.waifu.pics/nsfw/trap'; // Replace with your actual URL

  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      await hn.sendMessage(origineMessage, {
        image: { url: imageUrl },
        caption: `*Downloaded by ${conf.BOT}*`,
        contextInfo: {
          externalAdReply: {
            title: "Image Search Result",
            body: `Here's a great image related to: waifu`,
            thumbnailUrl: imageUrl,
            sourceUrl: conf.GURL,
            mediaType: 1,
            showAdAttribution: true
          }
        }
      }, { quoted: ms });
    }
  } catch (error) {
    repondre('Error retrieving data: ' + error.message);
  }
});
hango({
  nomCom: "gneko",
  categorie: "mod-image",
  reaction: "🙄"
}, async (origineMessage, hn, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  const url = 'https://api.waifu.pics/nsfw/neko'; // Replace with your actual URL

  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      await hn.sendMessage(origineMessage, {
        image: { url: imageUrl },
        caption: `*Downloaded by ${conf.BOT}*`,
        contextInfo: {
          externalAdReply: {
            title: "Image Search Result",
            body: `Here's a great image related to: waifu`,
            thumbnailUrl: imageUrl,
            sourceUrl: conf.GURL,
            mediaType: 1,
            showAdAttribution: true
          }
        }
      }, { quoted: ms });
    }
  } catch (error) {
    repondre('Error retrieving data: ' + error.message);
  }
});
hango({
  nomCom: "blowjobs",
  categorie: "mod-image",
  reaction: "🙄"
}, async (origineMessage, hn, commandeOptions) => {
  const { repondre, ms } = commandeOptions;
  const url = 'https://api.waifu.pics/nsfw/blowjob'; // Replace with your actual URL

  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      await hn.sendMessage(origineMessage, {
        image: { url: imageUrl },
        caption: `*Downloaded by ${conf.BOT}*`,
        contextInfo: {
          externalAdReply: {
            title: "Image Search Result",
            body: `Here's a great image related to: waifu`,
            thumbnailUrl: imageUrl,
            sourceUrl: conf.GURL,
            mediaType: 1,
            showAdAttribution: true
          }
        }
      }, { quoted: ms });
    }
  } catch (error) {
    repondre('Error retrieving data: ' + error.message);
  }
});
hango({
  'nomCom': "lulcaty",
  'reaction': '📡',
  'categorie': 'mod-image'
}, async (user, message, context) => {
  const { repondre: sendMessage, arg, ms } = context;
  try {
    if (!arg || arg.length === 0) {
      return sendMessage("Provide some text.");
    }
    const text = arg.join(" ");
    const imageUrl = `https://api.popcat.xyz/lulcat?text=${text}`;
    message.sendMessage(user, {
      'image': { 'url': imageUrl },
      'caption': "*powered by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰"
    }, { 'quoted': ms });
  } catch (error) {
    console.error("Error:", error.message || "An error occurred");
    sendMessage("Oops, an error occurred while processing your request");
  }
});

// Sadcat Meme Command
hango({
  'nomCom': "sadcaty",
  'reaction': '📡',
  'categorie': 'mod-image'
}, async (user, message, context) => {
  const { repondre: sendMessage, arg, ms } = context;
  try {
    if (!arg || arg.length === 0) {
      return sendMessage("Provide some text.");
    }
    const text = arg.join(" ");
    const imageUrl = `https://api.popcat.xyz/sadcat?text=${text}`;
    message.sendMessage(user, {
      'image': { 'url': imageUrl },
      'caption': "*powered by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰"
    }, { 'quoted': ms });
  } catch (error) {
    console.error("Error:", error.message || "An error occurred");
    sendMessage("Oops, an error occurred while processing your request");
  }
});

// Nokia Meme Command
hango({
  'nomCom': "nokiah",
  'reaction': '📡',
  'categorie': 'mod-image'
}, async (user, message, context) => {
  const { repondre: sendMessage, arg, ms } = context;
  try {
    if (!arg || arg.length === 0) {
      return sendMessage("Provide some text.");
    }
    const text = arg.join(" ");
    const imageUrl = `https://api.popcat.xyz/nokia?image=${text}`;
    message.sendMessage(user, {
      'image': { 'url': imageUrl },
      'caption': "*powered by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰"
    }, { 'quoted': ms });
  } catch (error) {
    console.error("Error:", error.message || "An error occurred");
    sendMessage("Oops, an error occurred while processing your request");
  }
});

// Unforgivable Meme Command
hango({
  'nomCom': "unforgivab",
  'reaction': '📡',
  'categorie': 'mod-image'
}, async (user, message, context) => {
  const { repondre: sendMessage, arg, ms } = context;
  try {
    if (!arg || arg.length === 0) {
      return sendMessage("Provide some text.");
    }
    const text = arg.join(" ");
    const imageUrl = `https://api.popcat.xyz/unforgivable?text=${text}`;
    message.sendMessage(user, {
      'image': { 'url': imageUrl },
      'caption': "*powered by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰"
    }, { 'quoted': ms });
  } catch (error) {
    console.error("Error:", error.message || "An error occurred");
    sendMessage("Oops, an error occurred while processing your request");
  }
});

// Pooh Meme Command
hango({
  'nomCom': "poohh",
  'reaction': '📡',
  'categorie': 'mod-image'
}, async (user, message, context) => {
  const { repondre: sendMessage, arg, ms } = context;
  try {
    if (!arg || arg.length === 0) {
      return sendMessage("Provide some text.");
    }
    const text = arg.join(" ");
    const imageUrl = `https://api.popcat.xyz/pooh?text1=&text2=${text}`;
    message.sendMessage(user, {
      'image': { 'url': imageUrl },
      'caption': "*powered by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰"
    }, { 'quoted': ms });
  } catch (error) {
    console.error("Error:", error.message || "An error occurred");
    sendMessage("Oops, an error occurred while processing your request");
  }
});

// Oogway Meme Command
hango({
  'nomCom': "ohogway",
  'reaction': '📡',
  'categorie': 'mod-image'
}, async (user, message, context) => {
  const { repondre: sendMessage, arg, ms } = context;
  try {
    if (!arg || arg.length === 0) {
      return sendMessage("Provide a quote.");
    }
    const text = arg.join(" ");
    const imageUrl = `https://api.popcat.xyz/oogway?text=${text}`;
    message.sendMessage(user, {
      'image': { 'url': imageUrl },
      'caption': "*powered by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰"
    }, { 'quoted': ms });
  } catch (error) {
    console.error("Error:", error.message || "An error occurred");
    sendMessage("Oops, an error occurred while processing your request");
  }
});

// Biden Meme Command
hango({
  'nomCom': "jbiden",
  'reaction': '📡',
  'categorie': 'mod-image'
 }, async (user, message, context) => {
  const { repondre: sendMessage, arg, ms } = context;
  try {
    if (!arg || arg.length === 0) {
      return sendMessage("Provide some text.");
    }
    const text = arg.join(" ");
    const imageUrl = `https://api.popcat.xyz/biden?text=${text}`;
    message.sendMessage(user, {
      'image': { 'url': imageUrl },
      'caption': "*powered by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰"
    }, { 'quoted': ms });
  } catch (error) {
    console.error("Error:", error.message || "An error occurred");
    sendMessage("Oops, an error occurred while processing your request");
  }
});

// Drip Meme Command
hango({
  'nomCom': "hdrip",
  'reaction': '📡',
  'categorie': 'mod-image'
}, async (user, message, context) => {
  const { repondre: sendMessage, arg, ms } = context;
  try {
    if (!arg || arg.length === 0) {
      return sendMessage("Provide an image URL.");
    }
    const imageUrl = `https://api.popcat.xyz/drip?image=${arg.join(" ")}`;
    message.sendMessage(user, {
      'image': { 'url': imageUrl },
      'caption': "*powered by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰"
    }, { 'quoted': ms });
  } catch (error) {
    console.error("Error:", error.message || "An error occurred");
    sendMessage("Oops, an error occurred while processing your request");
  }
});

// Clown Meme Command
hango({
  'nomCom': "clowns",
  'reaction': '📡',
  'categorie': 'mod-image'
}, async (user, message, context) => {
  const { repondre: sendMessage, arg, ms } = context;
  try {
    if (!arg || arg.length === 0) {
      return sendMessage("Provide some text.");
    }
    const text = arg.join(" ");
    const imageUrl = `https://api.popcat.xyz/clown?text=${text}`;
    message.sendMessage(user, {
      'image': { 'url': imageUrl },
      'caption': "*powered by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰"
    }, { 'quoted': ms });
  } catch (error) {
    console.error("Error:", error.message || "An error occurred");
    sendMessage("Oops, an error occurred while processing your request");
  }
});


// Image generation command
hango({
  'nomCom': "imag-generate",
  'reaction': '📡',
  'category': 'mod-image'
}, async (user, message, context) => {
  const { respond: sendMessage, args, messageInstance } = context;
  try {
    if (!args || args.length === 0) {
      return sendMessage("Please enter the necessary information to generate the image.");
    }
    const prompt = args.join(" ");
    const generatedImageUrl = "https://www.samirxpikachu.run.place/marjia?prompt=" + prompt;
    message.sendMessage(user, {
      'image': {
        'url': generatedImageUrl
      },
      'caption': "*powered by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰"
    }, {
      'quoted': messageInstance
    });
  } catch (error) {
    console.error("Error:", error.message || "An error occurred");
    sendMessage("Oops, an error occurred while processing your request");
  }
});

// Image text extraction command
hango({
  'nomCom': "toextract",
  'reaction': '📡',
  'category': 'mod-image'
}, async (user, message, context) => {
  const { respond: sendMessage, args, messageInstance } = context;
  try {
    if (!args || args.length === 0) {
      return sendMessage("Please insert the image URL and 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 will extract the text for you.");
    }
    const imageUrl = args.join(" ");
    const extractedTextUrl = "https://www.samirxpikachu.run.place/extract/text?url=" + imageUrl;
    message.sendMessage(user, {
      'image': {
        'url': extractedTextUrl
      },
      'caption': "*powered by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰"
    }, {
      'quoted': messageInstance
    });
  } catch (error) {
    console.error("Error:", error.message || "An error occurred");
    sendMessage("Oops, an error occurred while processing your request");
  }
});

// Bing image generation command
hango({
  'nomCom': "flux-img",
  'reaction': '📡',
  'category': 'mod-image'
}, async (user, message, context) => {
  const { respond: sendMessage, args, messageInstance } = context;
  try {
    if (!args || args.length === 0) {
      return sendMessage("Please describe your image and 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 will generate it.");
    }
    const prompt = args.join(" ");
    const generatedImageUrl = "https://www.samirxpikachu.run.place/flux?prompt=" + prompt;
    message.sendMessage(user, {
      'image': {
        'url': generatedImageUrl
      },
      'caption': "*powered by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰*"
    }, {
      'quoted': messageInstance
    });
  } catch (error) {
    console.error("Error:", error.message || "An error occurred");
    sendMessage("Oops, an error occurred while processing your request");
  }
});



// Ilama image generation command
hango({
  'nomCom': "mi",
  'reaction': '📡',
  'category': 'mod-image'
}, async (user, message, context) => {
  const { respond: sendMessage, args, messageInstance } = context;
  try {
    if (!args || args.length === 0) {
      return sendMessage("Please describe your image and 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 will generate it.");
    }
    const prompt = args.join(" ");
    const generatedImageUrl = "https://www.samirxpikachu.run.place/multi/Ml?prompt=" + prompt;
    message.sendMessage(user, {
      'image': {
        'url': generatedImageUrl
      },
      'caption': "*powered by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰"
    }, {
      'quoted': messageInstance
    });
  } catch (error) {
    console.error("Error:", error.message || "An error occurred");
    sendMessage("Oops, an error occurred while processing your request");
  }
});

// Beautify image command
hango({
  'nomCom': "dbeautify",
  'reaction': '📡',
  'category': 'mod-image'
}, async (user, message, context) => {
  const { respond: sendMessage, args, messageInstance } = context;
  try {
    if (!args || args.length === 0) {
      return sendMessage("Kindly enter a valid image URL to beautify your image.");
    }
    const imageUrl = args.join(" ");
    const beautifiedImageUrl = "https://samirxpikachuio.onrender.com/remacne?url=" + imageUrl;
    message.sendMessage(user, {
      'image': {
        'url': beautifiedImageUrl
      },
      'caption': "*powered by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰"
    }, {
      'quoted': messageInstance
    });
  } catch (error) {
    console.error("Error:", error.message || "An error occurred");
    sendMessage("Oops, an error occurred while processing your request");
  }
});



