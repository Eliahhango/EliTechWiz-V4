const { hango } = require("../framework/hango");
const axios = require('axios');
const ytSearch = require('yt-search');
const conf = require(__dirname + '/../set');
const { Catbox } = require("node-catbox");
const fs = require('fs-extra');
const ytdl = require('ytdl-core');

// Initialize Catbox
const catbox = new Catbox();

// Common contextInfo configuration
const getContextInfo = (title = '', userJid = '', thumbnailUrl = '') => ({
  mentionedJid: [userJid],
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363222395675670@newsletter",
    newsletterName: "EliTechWiz-V4",
    serverMessageId: Math.floor(100000 + Math.random() * 900000),
  },
  externalAdReply: {
    showAdAttribution: true,
    title: conf.BOT || 'EliTechWiz-V4',
    body: title || "Next Generation",
    thumbnailUrl: thumbnailUrl || conf.URL || '',
    sourceUrl: conf.GURL || '',
    mediaType: 1,
    renderLargerThumbnail: false
  }
});

// Upload to Catbox
async function uploadToCatbox(filePath) {
  try {
    if (!fs.existsSync(filePath)) throw new Error("File not found");
    return await catbox.uploadFile({ path: filePath });
  } catch (error) {
    console.error('Catbox error:', error);
    throw error;
  }
}

// YouTube search
async function searchYouTube(query) {
  try {
    const searchResults = await ytSearch(query);
    if (!searchResults?.videos?.length) throw new Error('No videos found');
    return searchResults.videos[0];
  } catch (error) {
    console.error('YouTube search error:', error);
    throw error;
  }
}

// Download from APIs
async function downloadFromApis(apis) {
  for (const api of apis) {
    try {
      const { data } = await axios.get(api, { timeout: 15000 });
      if (data?.success) return data;
    } catch (error) {
      console.warn(`API ${api} failed:`, error.message);
    }
  }
  throw new Error('All download APIs failed');
}

// Audio command
hango({
  nomCom: "play1",
  aliases: ["song", "audio", "mp3"],
  categorie: "Download",
  reaction: "🎵"
}, async (dest, hn, commandOptions) => {
  const { arg, ms, prefixe, auteurMessage } = commandOptions;

  try {
    if (!arg[0]) return hn.repondre("Please provide a song name");

    const query = arg.join(" ");
    const video = await searchYouTube(query);
    
    await hn.sendMessage(dest, { 
      text: "⬇️ Downloading audio...", 
      contextInfo: getContextInfo("Downloading", auteurMessage, video.thumbnail) 
    }, { quoted: ms });

    const apis = [
      `https://api.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(video.url)}`,
      `https://www.dark-yasiya-api.site/download/ytmp3?url=${encodeURIComponent(video.url)}`,
      `https://api.dreaded.site/api/ytdl/audio?url=${encodeURIComponent(video.url)}`
    ];

    const { result } = await downloadFromApis(apis);
    const { download_url, title } = result;

    await hn.sendMessage(dest, {
      audio: { url: download_url },
      mimetype: 'audio/mpeg',
      contextInfo: getContextInfo(title, auteurMessage, video.thumbnail)
    }, { quoted: ms });

  } catch (error) {
    console.error('Error:', error);
    hn.repondre(`Error: ${error.message}`);
  }
});

// Video command
hango({
  nomCom: "video1",
  aliases: ["mp4", "ytvideo"],
  categorie: "Download",
  reaction: "🎥"
}, async (dest, hn, commandOptions) => {
  const { arg, ms, auteurMessage } = commandOptions;

  try {
    if (!arg[0]) return hn.repondre("Please provide a video name");

    const query = arg.join(" ");
    const video = await searchYouTube(query);
    
    await hn.sendMessage(dest, { 
      text: "⬇️ Downloading video...", 
      contextInfo: getContextInfo("Downloading", auteurMessage, video.thumbnail) 
    }, { quoted: ms });

    const apis = [
      `https://api.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(video.url)}`,
      `https://www.dark-yasiya-api.site/download/ytmp4?url=${encodeURIComponent(video.url)}`,
      `https://api.dreaded.site/api/ytdl/video?url=${encodeURIComponent(video.url)}`
    ];

    const { result } = await downloadFromApis(apis);
    const { download_url, title } = result;

    await hn.sendMessage(dest, {
      video: { url: download_url },
      mimetype: 'video/mp4',
      contextInfo: getContextInfo(title, auteurMessage, video.thumbnail)
    }, { quoted: ms });

  } catch (error) {
    console.error('Error:', error);
    hn.repondre(`Error: ${error.message}`);
  }
});

// URL upload command
hango({
  nomCom: "upload",
  categorie: "Utility",
  reaction: "📤"
}, async (dest, hn, commandOptions) => {
  const { msgRepondu, auteurMessage, ms } = commandOptions;

  try {
    if (!msgRepondu) return hn.repondre("Reply to a media message");

    const mediaTypes = [
      'imageMessage', 'videoMessage', 'audioMessage',
      'documentMessage', 'stickerMessage'
    ];

    const mediaType = mediaTypes.find(type => msgRepondu.message?.[type]);
    if (!mediaType) return hn.repondre("Unsupported media type");

    const buffer = await hn.downloadMediaMessage(msgRepondu.message[mediaType]);
    const filePath = `./temp/${Date.now()}.${mediaType.replace('Message', '')}`;
    await fs.writeFile(filePath, buffer);
    
    const fileUrl = await uploadToCatbox(filePath);
    await fs.unlink(filePath);

    await hn.sendMessage(dest, {
      text: `📤 Download URL:\n${fileUrl}`,
      contextInfo: getContextInfo("Upload Complete", auteurMessage)
    });

  } catch (error) {
    console.error('Error:', error);
    hn.repondre(`Upload failed: ${error.message}`);
  }
});
