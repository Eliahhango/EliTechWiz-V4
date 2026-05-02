const { hango } = require("../framework/hango");
const axios = require('axios');
const ytSearch = require('yt-search');
const conf = require(__dirname + '/../set');

// Define the command with aliases for play
hango({
  nomCom: "playy",
  aliases: ["song", "playdoc", "audio", "mp3"],
  categorie: "Search",
  reaction: "🧠"
}, async (dest, hn, commandOptions) => {
  const { arg, ms, repondre } = commandOptions;

  // Check if a query is provided
  if (!arg[0]) {
    return repondre("Please provide a video name.");
  }

  const query = arg.join(" ");

  try {
    // Perform a YouTube search based on the query
    const searchResults = await ytSearch(query);

    // Check if any videos were found
    if (!searchResults || !searchResults.videos.length) {
      return repondre('No video found for the specified query.');
    }

    const firstVideo = searchResults.videos[0];
    const videoUrl = firstVideo.url;

    // Function to get download data from APIs
    const getDownloadData = async (url) => {
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        console.error('Error fetching data from API:', error);
        return { success: false };
      }
    };

    // List of APIs to try
    const apis = [
      `https://api-rin-tohsaka.vercel.app/download/ytmp4?url=${encodeURIComponent(videoUrl)}`,
      `https://api.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      `https://www.dark-yasiya-api.site/download/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      `https://api.giftedtech.web.id/api/download/dlmp3?url=${encodeURIComponent(videoUrl)}&apikey=gifted-md`,
      `https://api.dreaded.site/api/ytdl/audio?url=${encodeURIComponent(videoUrl)}`
    ];
let downloadData;
    for (const api of apis) {
      downloadData = await getDownloadData(api);
      if (downloadData && downloadData.success) break;
    }

    // Check if a valid download URL was found
    if (!downloadData || !downloadData.success) {
      return repondre('Failed to retrieve download URL from all sources. Please try again later.');
    }

    const downloadUrl = downloadData.result.download_url;
    const songTitle = downloadData.result.title;
    const videoThumbnail = firstVideo.thumbnail;
    const videoChannel = downloadData.result.author;
    const videoPublished = downloadData.result.uploadDate;
    const videoViews = downloadData.result.viewCount;

    // Prepare the message with song details
    const messagePayload = {
      caption: `\n*EliTechWiz-V4 MUSIC*\n
╭━⊷
┃ *Title:* ${songTitle} 
┃ *Quality:* High
┃ *Duration:* ${firstVideo.timestamp}
╰━⊷
⦿ *Direct YtLink:* ${videoUrl}

╭━⊷
┃ *DOWNLOAD AND ENJOY YOUR DAY*
╰━━━━━━━━━━━━━━━━━⊷`,
      document: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        contextInfo: {
          externalAdReply: {
            title: "EliTechWiz-V4" ,
            body: "Tap her to follow our channel",
            mediaType: 1,
            sourceUrl:"https://whatsapp.com/channel/0029VaeEYF0BvvsZpaTPfL2s",
            thumbnailUrl: firstVideo.thumbnail,
            renderLargerThumbnail: false,
            showAdAttribution: true,
        }
      }
    };

    await hn.sendMessage(dest, messagePayload, { quoted: ms });

  } catch (error) {
    console.error('Error during download process:', error);
    return repondre(`Download failed due to an error: ${error.message || error}`);
  }
});
