const { hango } = require("../framework/hango");
const axios = require("axios");

hango({
  nomCom: "lyrics2",
  desc: "Fetch and display lyrics of a song.",
  categorie: "Search",
}, async (dest, hn, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const query = arg.join(" ");

  if (!query) {
    return repondre("🎵 Please provide a song name and artist...\nEg: .lyrics not afraid Eminem");
  }

  try {
    const apiURL = `https://lyricsapi.fly.dev/api/lyrics?q=${encodeURIComponent(query)}`;
    const res = await axios.get(apiURL);
    const data = res.data;

    if (!data.success || !data.result || !data.result.lyrics) {
      return repondre("❌ Lyrics not found for the provided query.");
    }

    const { title, artist, image, link, lyrics } = data.result;
    const shortLyrics = lyrics.length > 4096 ? lyrics.slice(0, 4093) + "..." : lyrics;

    const caption =
      `🎶 *EliTechWiz-V4 LYRICS!*\n\n` +
      `*Title:* ${title}\n` +
      `*Artist:* ${artist}\n` +
      `*Link:* ${link}\n\n` +
      `📜 *Lyrics:*\n\n` +
      `${shortLyrics}`;

    await hn.sendMessage(dest, {
      image: { url: image },
      caption,
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363402252728845@newsletter",
          newsletterName: "EliTechWiz-V4",
          serverMessageId: -1,
        },
      },
    }, { quoted: ms });

  } catch (err) {
    console.error("[LYRICS ERROR]", err);
    repondre("⚠️ An error occurred while fetching lyrics. Please try again later.");
  }
});
