const { hango } = require('../framework/hango');
const { ffmpeg } = require('../lib/converter'); // helper ya ffmpeg
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

hango({
  nomCom: "volvideo",
  categorie: "Search",
  reaction: "🔊",
}, async (dest, hn, { ms, repondre, arg }) => {

  if (!arg[0]) return repondre("*Example: .volvideo 10*");

  try {
    // ✅ Pickup video: reply au video moja kwa moja
    const videoMsg = ms.quoted?.message?.videoMessage || ms.message?.videoMessage;
    if (!videoMsg) return repondre("❌ Send or reply to a video file!");

    // Download video to buffer
    const stream = await downloadContentFromMessage(videoMsg, 'video');
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    // Adjust volume using ffmpeg helper
    const processed = await ffmpeg(buffer, ['-filter:a', `volume=${arg[0]}`, '-c:v', 'copy'], 'mp4', 'mp4');

    // Send processed video
    await hn.sendMessage(dest, { video: processed.data, mimetype: "video/mp4" }, { quoted: ms });

    // Cleanup temporary file
    try { await processed.delete(); } catch(e) {}

  } catch (e) {
    console.error(e);
    repondre("❌ An error occurred while processing the video.");
  }
});
  