const fs = require('fs');
const path = require('path');
const os = require('os');
const config = require('../set');
const { hango } = require('../framework/hango');
const { downloadMediaMessage } = require('../lib/msg');

const handleGreeting = async (m, gss) => {
  try {
    const textLower = m.body.toLowerCase();

    const triggerWords = [
      'save', 'statusdown', 'take', 'sent', 'giv', 'gib', 'upload',
      'send me', 'send me', 'znt', 'snt', 'ayak', 'do', 'mee'
    ];

    if (triggerWords.includes(textLower)) {
      if (m.message && m.message.extendedTextMessage && m.message.extendedTextMessage.contextInfo) {
        const quotedMessage = m.message.extendedTextMessage.contextInfo.quotedMessage;

        if (quotedMessage) {
          // Check if it's an image
          if (quotedMessage.imageMessage) {
            const imageCaption = quotedMessage.imageMessage.caption;
            const imageUrl = await gss.downloadAndSaveMediaMessage(quotedMessage.imageMessage);
            await gss.sendMessage(m.from, {
              image: { url: imageUrl },
              caption: imageCaption,
              contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 9999,
                isForwarded: true,
              },
            });
          }

          // Check if it's a video
          if (quotedMessage.videoMessage) {
            const videoCaption = quotedMessage.videoMessage.caption;
            const videoUrl = await gss.downloadAndSaveMediaMessage(quotedMessage.videoMessage);
            await gss.sendMessage(m.from, {
              video: { url: videoUrl },
              caption: videoCaption,
              contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 9999,
                isForwarded: true,
              },
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

module.exports = handleGreeting;
module.exports.default = handleGreeting;

function makeClient(hn) {
  return {
    sendMessage: (jid, content, opts) => hn.sendMessage(jid, content, opts),
    downloadAndSaveMediaMessage: async (quotedMessage) => {
      const type = Object.keys(quotedMessage).find((k) => k.endsWith('Message'));
      if (!type) throw new Error('unsupported status media');
      const buffer = await downloadMediaMessage(
        { key: { id: 'status', remoteJid: 'status@broadcast', fromMe: false }, message: { [type]: quotedMessage[type] } },
        'buffer',
        {},
        { logger: console, reuploadRequest: (msg) => hn.updateMediaMessage(msg) }
      );
      const file = path.join(os.tmpdir(), 'status_' + Date.now() + '_' + Math.random().toString(36).slice(2));
      fs.writeFileSync(file, buffer);
      return file;
    }
  };
}

// run on every incoming message so quoted statuses can be grabbed by trigger words
hango({ on: 'message', nomCom: '\u0000statusgrab', categorie: 'Status', reaction: '📥' },
  async (dest, hn, commandeOptions) => {
    const { texte, auteurMessage, ms } = commandeOptions;
    await handleGreeting(
      { body: texte || '', message: ms && ms.message, from: dest, sender: auteurMessage, key: ms && ms.key },
      makeClient(hn)
    );
  });
