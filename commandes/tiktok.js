const { hango } = require("../framework/hango");
const axios = require("axios");

// Hapa tuna-store video data kwa chat temporary
const tikTokCache = new Map();

// Event listener global (avoid multiple listeners)
let listenerRegistered = false;

hango({
  nomCom: "tiktok",
  aliases: ["tikdl", "tiktokdl"],
  categorie: "Download",
  reaction: "📽️",
  desc: "Download TikTok videos by link"
}, async (dest, hn, commandOptions) => {
  const { repondre, arg } = commandOptions;

  if (!arg[0]) return repondre('⚠️ Please insert a public TikTok video link!');
  if (!arg[0].includes('tiktok.com')) return repondre("⚠️ That is not a valid TikTok link.");

  try {
    // Call TikWM API
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(arg[0])}`;
    const { data } = await axios.get(api);

    if (data.code !== 0) {
      return repondre("❌ Failed to fetch video. Check the link or try another one.");
    }

    const result = data.data;

    // Store data for this chat
    tikTokCache.set(dest, result);

    const caption = `
*EliTechWiz-V4 𝐓𝐈𝐊𝐓𝐎𝐊 𝐃𝐋*
|__________________________|
-᳆ *Title:*  
${result.title}
|_________________________
Reply with one of the numbers below:
-᳆ *1* SD quality
-᳆ *2* HD quality
-᳆ *3* Audio only
|__________________________|
`;

    // Send cover image + caption
    const sentMsg = await hn.sendMessage(dest, {
      image: { url: result.cover },
      caption
    });

    // Send forwarded channel message
    await hn.sendMessage(dest, {
      text: "Check out my channel for more updates!",
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363403345479886@newsletter",
          newsletterName: "EliTechWiz-V4 🤎",
          serverMessageId: -1
        }
      }
    });

    // Register listener once
    if (!listenerRegistered) {
      hn.ev.on("messages.upsert", async (update) => {
        const msg = update.messages[0];
        if (!msg.message) return;

        const chatId = msg.key.remoteJid;
        const userText = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const replyTo = msg.message.extendedTextMessage?.contextInfo?.stanzaId;

        // Only act if user replied to previous TikTok message
        const videoData = tikTokCache.get(chatId);
        if (!videoData) return;

        if (!['1','2','3'].includes(userText)) return;

        try {
          if (userText === '1') {
            await hn.sendMessage(chatId, {
              video: { url: videoData.play },
              caption: "*EliTechWiz-V4*"
            }, { quoted: msg });

          } else if (userText === '2') {
            await hn.sendMessage(chatId, {
              video: { url: videoData.hdplay },
              caption: "*EliTechWiz-V4*"
            }, { quoted: msg });

          } else if (userText === '3') {
            await hn.sendMessage(chatId, {
              audio: { url: videoData.music },
              mimetype: "audio/mpeg"
            }, { quoted: msg });
          }

          // Send channel message again
          await hn.sendMessage(chatId, {
            text: "Check out my channel for more updates!",
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: "120363403345479886@newsletter",
                newsletterName: "EliTechWiz-V4 🤎",
                serverMessageId: -1
              }
            }
          }, { quoted: msg });

          // Clear cache for this chat after sending
          tikTokCache.delete(chatId);

        } catch (err) {
          console.error("Error sending video/audio:", err);
        }

      });
      listenerRegistered = true;
    }

  } catch (error) {
    console.error(error);
    repondre('⚠️ An error occurred: ' + error.message);
  }
});
