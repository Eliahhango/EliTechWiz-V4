const { hango } = require('../framework/hango');
const yts = require('yt-search');

hango({
    nomCom: "yts",
    categorie: "Download",
    alias: ["ytsearch"],
    reaction: "🔎",
    desc: "Search and get details from YouTube.",
    filename: __filename
}, async (dest, hn, commandeOptions) => {
    const { arg, msg } = commandeOptions;
    const query = arg.join(" ").trim();

    if (!query) {
        return await hn.sendMessage(dest, { text: "*Please provide search keywords.*" }, { quoted: msg });
    }

    try {
        const results = await yts(query);
        const videos = results.all;

        if (!videos || videos.length === 0) {
            return await hn.sendMessage(dest, { text: "*No results found.*" }, { quoted: msg });
        }

        let message = "*🔍 YouTube Search Results:*\n\n";
        videos.slice(0, 5).forEach((video, index) => {
            message += `*${index + 1}. ${video.title}*\n🔗 ${video.url}\n\n`;
        });

        message += "> ©EliTechWiz-V4 is Speed🤎";

        await hn.sendMessage(dest, {
            text: message.trim(),
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                              newsletterJid: "120363402252728845@newsletter",
                    newsletterName: "EliTechWiz-V4 🤎",
                    serverMessageId: -1
                }
            }
        }, { quoted: msg });

    } catch (e) {
        console.log("YTS ERROR:", e);
        await hn.sendMessage(dest, { text: "*❌ An error occurred while searching YouTube.*" }, { quoted: msg });
    }
});
