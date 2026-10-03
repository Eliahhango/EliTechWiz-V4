"use strict";

const { hango } = require("../framework/hango");

hango({
    nomCom: "test",
    reaction: "✅",
    nomFichier: __filename,
  },

  async (dest, hn, commandeOptions) => {
    const message =
      "🌟 Hi. I am 👑 *EliTechWiz-V4*, a friendly multi-device WhatsApp bot from *Tanzania🇹🇿*, proudly created by *Mr. EliTechWiz*.\n\n" +
      "✅ *System Test:* SUCCESSFUL\n" +
      "Everything is working perfectly on the system. 💯\n\n" +
      "Thanks for using *EliTechWiz-V4* — Stay connected and smart! 🧠🚀";

    // =========================
    // IMAGE
    // =========================
    const imageUrl =
      "https://files.catbox.moe/533oqh.jpg";

    // =========================
    // AUDIO
    // HII NDIYO URL INAYOFANYA KAZI KWENYE MENU YAKO
    // =========================
    const audioUrl =
      "https://files.catbox.moe/pnwvsy.mp3";

    let sentMsg;

    // =========================
    // SEND IMAGE
    // =========================
    try {
      sentMsg = await hn.sendMessage(
        dest,
        {
          image: {
            url: imageUrl,
          },
          caption: message,
        },
        {
          quoted: commandeOptions.ms,
        }
      );

      console.log(
        "[TEST] Image sent successfully."
      );

    } catch (imageError) {
      console.error(
        "[TEST] IMAGE ERROR:",
        imageError.message
      );

      // Send text if image fails
      try {
        sentMsg = await hn.sendMessage(
          dest,
          {
            text: message,
          },
          {
            quoted: commandeOptions.ms,
          }
        );
      } catch (textError) {
        console.error(
          "[TEST] TEXT ERROR:",
          textError.message
        );
      }
    }

    // =========================
    // WAIT
    // =========================
    await new Promise((resolve) =>
      setTimeout(resolve, 500)
    );

    // =========================
    // SEND AUDIO
    // =========================
    try {
      await hn.sendMessage(
        dest,
        {
          audio: {
            url: audioUrl,
          },
          mimetype: "audio/mpeg",
          fileName: "EliTechWiz-V4.mp3",
          ptt: false,
        },
        {
          quoted: sentMsg || commandeOptions.ms,
        }
      );

      console.log(
        "[TEST] Audio sent successfully."
      );

    } catch (audioError) {
      console.error(
        "[TEST] AUDIO ERROR:",
        audioError.message
      );

      try {
        await hn.sendMessage(
          dest,
          {
            text:
              "❌ Audio imeshindwa kutumwa.\n\n" +
              `Error: ${audioError.message}`,
          },
          {
            quoted: commandeOptions.ms,
          }
        );
      } catch (error) {
        console.error(
          "[TEST] ERROR MESSAGE ERROR:",
          error.message
        );
      }
    }
  }
);

console.log(
  "EliTechWiz-V4 test command loaded successfully"
);