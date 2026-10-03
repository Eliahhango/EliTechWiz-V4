const { hango } = require("../framework/hango");
const axios = require("axios");

hango({
  nomCom: "ig",
  categorie: "Download",
  reaction: "📥"
}, async (dest, hn, { ms, repondre, arg }) => {

  try {
    const text = arg.join(" ");

    if (!text) return repondre("⚠️ Weka link ya Instagram");

    if (!text.includes("instagram.com")) {
      return repondre("❌ Link sio sahihi");
    }

    await hn.sendMessage(dest, {
      react: { text: "🔄", key: ms.key }
    });

    // 🔥 hakuna res hapa
    const { data } = await axios.get(`${global.api}/igdl?url=${encodeURIComponent(text)}`);

    if (!data || !data.result || data.result.length === 0) {
      return repondre("❌ Imeshindwa kupata media");
    }

    for (let media of data.result) {

      if (media.type === "video") {
        await hn.sendMessage(dest, {
          video: { url: media.url },
          caption: "𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗗 𝗕𝗬 𝗞𝗡𝗜𝗚𝗛𝗧-𝗕𝗢𝗧"
        }, { quoted: ms });

      } else {
        await hn.sendMessage(dest, {
          image: { url: media.url },
          caption: "𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗗 𝗕𝗬 𝗞𝗡𝗜𝗚𝗛𝗧-𝗕𝗢𝗧"
        }, { quoted: ms });
      }
    }

  } catch (e) {
    console.log(e);
    repondre("❌ Error: " + e.message);
  }
});