const { hango } = require("../framework/hango");
const os = require("os");
const conf = require("../set");
const cpuStat = require("cpu-stat");
const moment = require("moment");
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
require("moment-duration-format");

hango({
  nomCom: "botinfo",
  categorie: "Utility",
  reaction: "📊",
  desc: "Shows detailed info about the bot"
}, async (dest, hn, { repondre }) => {
  try {
    cpuStat.usagePercent(async (err, percent) => {
      if (err) return repondre("❌ Error fetching CPU usage.");

      const uptime = moment.duration(process.uptime() * 1000).format(" D [days], H [hrs], m [mins], s [secs]");

      let infoText = `__*BOT STATS*__\n\n`;
      infoText += `⏳ Memory Usage: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB\n`;
      infoText += `⌚ Uptime: ${uptime}\n`;
      infoText += `👾 Node.js: ${process.version}\n`;
      infoText += `🤖 CPU: ${os.cpus().map(i => i.model)[0]}\n`;
      infoText += `🤖 CPU Usage: ${percent.toFixed(2)}%\n`;
      infoText += `🤖 Architecture: ${os.arch()}\n`;
      infoText += `💻 Platform: ${os.platform()}\n`;

      repondre(infoText);
    });
  } catch (e) {
    console.error("BOTINFO ERROR:", e);
    repondre("❌ Failed to fetch bot info.");
  }
});

hango({
    nomCom: "save",
    categorie: "Utility",
    reaction: "💾",
    desc: "Save replied image, video or audio to owner's private chat."
  },

  async (dest, hn, commandeOptions) => {

    const {
      ms,
      repondre,
      msgRepondu,
      isOwner,
      superUser
    } = commandeOptions;

    // OWNER CHECK
    if (!isOwner && !superUser) {
      return repondre("❌ You are not the owner!");
    }

    // CHECK REPLIED MESSAGE
    if (!msgRepondu) {
      return repondre(
        "❌ Please reply to an image, video or audio message."
      );
    }

    try {

      // DETECT MEDIA TYPE
      let mediaType = null;

      if (msgRepondu.imageMessage) {
        mediaType = "image";
      } else if (msgRepondu.videoMessage) {
        mediaType = "video";
      } else if (msgRepondu.audioMessage) {
        mediaType = "audio";
      } else {
        return repondre(
          "❌ Unsupported media.\n\nReply to an image, video or audio."
        );
      }

      // CREATE QUOTED MESSAGE OBJECT
      const quotedMessage = {
        key: {
          remoteJid: ms.key.remoteJid,
          fromMe: false,
          id: ms.message?.extendedTextMessage?.contextInfo?.stanzaId,
          participant:
            ms.message?.extendedTextMessage?.contextInfo?.participant
        },
        message: msgRepondu
      };

      // DOWNLOAD MEDIA
      const buffer = await downloadMediaMessage(
        quotedMessage,
        "buffer",
        {}
      );

      if (!buffer || !buffer.length) {
        return repondre(
          "❌ Failed to download media."
        );
      }

      // OWNER JID
      const ownerNumber = String(conf.NUMERO_OWNER)
        .replace(/[^0-9]/g, "");

      const ownerJid =
        ownerNumber + "@s.whatsapp.net";

      // SEND IMAGE
      if (mediaType === "image") {

        await hn.sendMessage(
          ownerJid,
          {
            image: buffer,
            caption: "💾 *EliTechWiz-V4 SAVE*\n\n✅ Image saved successfully."
          }
        );

      }

      // SEND VIDEO
      else if (mediaType === "video") {

        await hn.sendMessage(
          ownerJid,
          {
            video: buffer,
            caption: "💾 *EliTechWiz-V4 SAVE*\n\n✅ Video saved successfully."
          }
        );

      }

      // SEND AUDIO
      else if (mediaType === "audio") {

        await hn.sendMessage(
          ownerJid,
          {
            audio: buffer,
            mimetype: msgRepondu.audioMessage?.mimetype || "audio/mpeg",
            ptt: msgRepondu.audioMessage?.ptt || false
          }
        );
      }

      return repondre(
        "✅ Media saved and sent to your private chat!"
      );

    } catch (error) {

      console.error("[SAVE ERROR]", error);

      return repondre(
        `❌ Error while saving media.\n\n${error.message}`
      );
    }
  }
);