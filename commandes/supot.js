'use strict';

Object.defineProperty(exports, "__esModule", {
  'value': true
});

const { hango } = require("../framework/hango");

hango({
  'nomCom': "support",
  'reaction': '🐥',
  'categorie': "Support-Owner",
  'nomFichier': __filename
}, async (hn, dest) => {
    await hn.sendMessage(dest, {
        text: "*Holla*\n\n*Click on the button below to join the official WhatsApp Channel*",
        contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363222395675670@newsletter',
                newsletterName: "EliTechWiz σғғɪᴄᴇ",
                serverMessageId: 143,
            },
            forwardingScore: 999, // Score to indicate it has been forwarded
            externalAdReply: {
                title: "EliTechWiz-V4",
                body: "Next Generation",
                thumbnailUrl: 'https://files.catbox.moe/vxxv26.jpeg', // Add thumbnail URL if required 
                sourceUrl: 'https://whatsapp.com/channel/0029VaeEYF0BvvsZpaTPfL2s', // Add source URL if necessary
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    });
});
