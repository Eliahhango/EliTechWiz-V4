const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { hango } = require(__dirname + "/../framework/hango");
const os = require("os");
const moment = require("moment-timezone");
const set = require(__dirname + "/../set");

const AUDIO_URL = "https://files.catbox.moe/krme87.mp3"; // New audio URL
const THUMBNAIL_URL = "https://files.catbox.moe/vxxv26.jpeg"; // New image URL

moment.tz.setDefault(`${set.TZ}`);

const getTimeAndDate = () => {
    return {
        time: moment().format('HH:mm:ss'),
        date: moment().format('DD/MM/YYYY')
    };
};

// Ping Command
hango({ nomCom: "ping", categorie: "General" }, async (dest, hn, commandeOptions) => {
    let { ms } = commandeOptions;
    const { time, date } = getTimeAndDate();
    const ping = Math.floor(Math.random() * 100) + 1; // Generate a random ping between 1ms - 100ms

    try {
        await hn.sendMessage(dest, { 
            audio: { url: AUDIO_URL }, 
            mimetype: 'audio/mp4', 
            ptt: true, // Voice note form
            contextInfo: {
                externalAdReply: {
                    title: "🤖 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰🤖",
                    body: `🏓 *Pong:* ${ping}ms\n📅 *Date:* ${date}\n⏰ *Time:* ${time}`,
                    thumbnailUrl: THUMBNAIL_URL,
                    mediaType: 1,
                    renderSmallThumbnail: true // Small thumbnail rendering
                }
            }
        }, { quoted: ms });

    } catch (e) {
        console.log("❌ Ping Command Error: " + e);
        repondre("❌ Error: " + e);
    }
});
