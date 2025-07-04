const { hango } = require('../framework/hango');
const { igdl } = require("ruhend-scraper");
const axios = require('axios');
const { downloadTiktok } = require('@mrnima/tiktok-downloader');
const { facebook } = require('@mrnima/facebook-downloader');  
const conf = require(__dirname + "/../set");

hango({
  nomCom: "instagram",
  aliases: ["igdl", "ig", "insta"],
  categorie: "Download",
  reaction: "📽️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  // Check if the argument (Instagram link) is provided
  if (!arg[0]) {
    return repondre('Please provide a valid public Instagram video link!');
  }

  // Validate the Instagram URL format
  if (!arg[0].includes('https://www.instagram.com/')) {
    return repondre("That is not a valid Instagram link.");
  }

  try {
    // Fetch the download data for the Instagram video
    let downloadData = await igdl(arg[0]);

    // Check if the data returned is valid
    if (!downloadData || !downloadData.data || downloadData.data.length === 0) {
      return repondre("No video found at the provided Instagram link.");
    }

    let videoData = downloadData.data;

    // Process the first 20 videos (if available)
    for (let i = 0; i < Math.min(20, videoData.length); i++) {
      let video = videoData[i];

      // Ensure the video object and URL are defined
      if (!video || !video.url) {
        continue; // Skip if the video data is incomplete
      }

      let videoUrl = video.url;

      // Send the video to the chat
      await hn.sendMessage(dest, {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        caption: `*Instagram Video Downloaded by ${conf.BOT}*`,
        contextInfo: {
          externalAdReply: {
            title: `${conf.BOT} IG DL`,
            body: conf.OWNER_NAME,
            thumbnailUrl: conf.URL,
            sourceUrl: conf.GURL,
            mediaType: 1,
            showAdAttribution: true
          }
        }
      }, { quoted: ms });
    }

  } catch (error) {
    // Catch and log any errors
    console.error(error);
    return repondre("An error occurred while processing the request. Please try again later.");
  }
});

hango({
  nomCom: "facebook",
  aliases: ["fbdl", "facebookdl", "fb"],
  categorie: "Download",
  reaction: "📽️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  // Check if there is a Facebook URL in the arguments
  if (!arg[0]) {
    return repondre('Please insert a public Facebook video link!');
  }

  // Validate that the argument contains "https://"
  if (!arg[0].includes('https://')) {
    return repondre("That is not a valid Facebook link.");
  }

  try {
    // Download the Facebook video data
    const videoData = await facebook(arg[0]);

    // Prepare the message caption with video details
    const caption = `
     📥 *FB Video by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰* 🚀
    ━━━━━━━━━━━━━━━━━━━
    🕒 *Duration*: ${videoData.result.duration}
    ━━━━━━━━━━━━━━━━━━━
    💡 *Reply with a number to download:*
    1️⃣ SD Quality
    2️⃣ HD Quality
    3️⃣ Audio
    4️⃣ Document
    5️⃣ Voice (PTT)
    ━━━━━━━━━━━━━━━━━━━
    `;

    // Send the image and caption with a reply
    const message = await hn.sendMessage(dest, {
      image: { url: videoData.result.thumbnail },
      caption: caption,
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          title: `${conf.BOT} FB DL`,
          body: `Duration: ${videoData.result.duration}`,
          thumbnailUrl: videoData.result.thumbnail,
          sourceUrl: conf.GURL,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: ms });

    const messageId = message.key.id;

    // Event listener for reply messages
    hn.ev.on("messages.upsert", async (update) => {
      const messageContent = update.messages[0];
      if (!messageContent.message) return;

      // Get the response text (from the conversation or extended message)
      const responseText = messageContent.message.conversation || messageContent.message.extendedTextMessage?.text;

      // Check if the message is a reply to the initial message
      const isReplyToMessage = messageContent.message.extendedTextMessage?.contextInfo.stanzaId === messageId;

      if (isReplyToMessage) {
        // React to the message
        await hn.sendMessage(dest, {
          react: { text: '⬇️', key: messageContent.key },
        });

        // Extract video details
        const videoDetails = videoData.result;

        // React with an upward arrow
        await hn.sendMessage(dest, {
          react: { text: '⬆️', key: messageContent.key },
        });

        // Send the requested media based on the user's response
        if (responseText === '1') {
          await hn.sendMessage(dest, {
            video: { url: videoDetails.links.SD },
            caption: "*EliahTech*",
          }, { quoted: messageContent });
        } else if (responseText === '2') {
          await hn.sendMessage(dest, {
            video: { url: videoDetails.links.HD },
            caption: "*EliahTech*",
          }, { quoted: messageContent });
        } else if (responseText === '3') {
          await hn.sendMessage(dest, {
            audio: { url: videoDetails.links.SD },
            mimetype: "audio/mpeg",
          }, { quoted: messageContent });
        } else if (responseText === '4') {
          await hn.sendMessage(dest, {
            document: {
              url: videoDetails.links.SD
            },
            mimetype: "audio/mpeg",
            fileName: "𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰.mp3",
            caption: "*EliahTech*"
          }, {
            quoted: messageContent
          });
        } else if (responseText === '5') {
          await hn.sendMessage(dest, {
            audio: {
              url: videoDetails.links.SD
            },
            mimetype: 'audio/mp4',
            ptt: true
          }, {
            quoted: messageContent
          });
        } else {
          // If the response is invalid, inform the user
          await hn.sendMessage(dest, {
            text: "Invalid option. Please reply with a valid number (1-5).",
            quoted: messageContent
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    repondre('An error occurred: try fbdl2 using this link' + error.message);
  }
});

hango({
  nomCom: "tiktok",
  aliases: ["tikdl", "tiktokdl"],
  categorie: "Download",
  reaction: "📽️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  if (!arg[0]) {
    return repondre('Please insert a public TikTok video link!');
  }

  if (!arg[0].includes('tiktok.com')) {
    return repondre("That is not a valid TikTok link.");
  }

  try {
    // Download the TikTok video data
    let tiktokData = await downloadTiktok(arg[0]);

    const caption = `
     🎵 *TikTok Video by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰* 👾
    ━━━━━━━━━━━━━━━━━━━
    🎬 *Title*: ${tiktokData.result.title}
    ━━━━━━━━━━━━━━━━━━━
    💡 *Reply with a number to download:*
    1️⃣ SD Quality
    2️⃣ HD Quality
    3️⃣ Audio
    ━━━━━━━━━━━━━━━━━━━
    `;

    // Send the image and caption with a reply
    const message = await hn.sendMessage(dest, {
      image: { url: tiktokData.result.image },
      caption: caption,
    });

    const messageId = message.key.id;

    // Event listener for reply messages
    hn.ev.on("messages.upsert", async (update) => {
      const messageContent = update.messages[0];
      if (!messageContent.message) return;

      const responseText = messageContent.message.conversation || messageContent.message.extendedTextMessage?.text;
      const keithdl = messageContent.key.remoteJid;

      // Check if the response is a reply to the message we sent
      const isReplyToMessage = messageContent.message.extendedTextMessage?.contextInfo.stanzaId === messageId;

      if (isReplyToMessage) {
        // React to the message
        await hn.sendMessage(keithdl, {
          react: { text: '⬇️', key: messageContent.key },
        });

        const tiktokLinks = tiktokData.result;

        await hn.sendMessage(keithdl, {
          react: { text: '⬆️', key: messageContent.key },
        });

        // Send the requested media based on the user's response
        if (responseText === '1') {
          await hn.sendMessage(keithdl, {
            video: { url: tiktokLinks.dl_link.download_mp4_1 },
            caption: "*EliahTech*",
          }, { quoted: messageContent });
        } else if (responseText === '2') {
          await hn.sendMessage(keithdl, {
            video: { url: tiktokLinks.dl_link.download_mp4_2 },
            caption: "*EliahTech*",
          }, { quoted: messageContent });
        } else if (responseText === '3') {
          await hn.sendMessage(keithdl, {
            audio: { url: tiktokLinks.dl_link.download_mp3 },
            mimetype: "audio/mpeg",
          }, { quoted: messageContent });
        }
      }
    });
  } catch (error) {
    console.error(error);
    repondre('An error occurred: ' + error.message);
  }
});

hango({
  nomCom: "spotify",
  aliases: ["sdl", "spotifydl"],
  reaction: '⚔️',
  categorie: "download"
}, async (dest, hn, params) => {
  const { repondre, arg, ms } = params;  
  const text = arg.join(" ").trim(); 

  if (!text) {
    return repondre("What song do you want to download?");
  }

  try {
    let data = await axios.get(`https://api.dreaded.site/api/spotifydl?title=${text}`);

    if (data.data.success) {
      const audio = data.data.result.downloadLink;
      const filename = data.data.result.title;

      await hn.sendMessage(dest, {
        document: { url: audio },
        mimetype: "audio/mpeg",
        fileName: `${filename}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: conf.BOT,
            body: "spotify download",
            mediaType: 1,
            sourceUrl: conf.GURL,
            thumbnailUrl: conf.URL,
            renderLargerThumbnail: false,
            showAdAttribution: true,
          },
        },
      }, { quoted: ms });

      await hn.sendMessage(dest, {
        audio: { url: audio },
        mimetype: "audio/mpeg",
        fileName: `${filename}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: conf.BOT,
            body: "spotify download",
            mediaType: 1,
            sourceUrl: conf.GURL,
            thumbnailUrl: conf.URL,
            renderLargerThumbnail: false,
            showAdAttribution: true,
          },
        },
      }, { quoted: ms });

      await hn.sendMessage(dest, {
        document: { url: audio },
        mimetype: "audio/mp4",
        fileName: `${filename}.mp4`,
        contextInfo: {
          externalAdReply: {
            title: conf.BOT,
            body: "spotify download",
            mediaType: 1,
            sourceUrl: conf.GURL,
            thumbnailUrl: conf.URL,
            renderLargerThumbnail: false,
            showAdAttribution: true,
          },
        },
      }, { quoted: ms });

    } else {
      await repondre("Failed to get a valid response from API endpoint");
    }

  } catch (error) {
    console.error("Error fetching the download link:", error);
    await repondre("Unable to fetch download link, try matching exact song name or with artist name.");
  }
});

