const { hango } = require("../framework/hango");
const axios = require("axios");

hango({
  nomCom: "intro",
  desc: "Shows the intro of the bot owner.",
  categorie: "fun",
}, async (dest, hn, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  try {
    const surl = "https://github.com/Eliahhango/EliTechWiz-V4";
    const name = "Eliah Hango";
    const body = "𝑻𝑯𝑬 𝑷𝑶𝑾𝑬𝑹 ⚡";
    const image = "https://telegra.ph/file/1e60489705c851f74b55e.jpg";

    const text = `╭═══ ━ ━ ━ ━ • ━ ━ ━ ━ ═══♡᭄
│        「 𝗠𝗬 𝗜𝗡𝗧𝗥𝗢 」
│ Name       : Eliah Hango
│ Bot          : EliTechWiz-V4
│ Phone      : wa.me/255617834510
│ Repo       : https://github.com/Eliahhango/EliTechWiz-V4
│ Status      : ᴅᴇᴠᴇʟᴏᴘᴇʀ | ʙᴏᴛ ᴄʀᴇᴀᴛᴏʀ
╰═══ ━ ━ ━ ━ • ━ ━ ━ ━ ═══♡᭄`;

    await hn.sendMessage(
      dest,
      {
        image: { url: image },
        caption: text,
        contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          externalAdReply: {
            title: name,
            body: body,
            thumbnailUrl: image,
            sourceUrl: surl,
            mediaType: 1,
            renderLargerThumbnail: true,
          },
        },
      },
      { quoted: ms }
    );
  } catch (e) {
    console.error("[INTRO COMMAND ERROR]", e);
    repondre(`❌ Error showing intro:\n${e.message}`);
  }
});