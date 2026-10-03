const { hango } = require(__dirname + '/../framework/hango');
const { format } = require(__dirname + '/../framework/mesfonctions');
const os = require('os');
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const fs = require("fs");
const path = require("path");


function createVCard() {
  return {
    'key': {
      'fromMe': false,
      'participant': '0@s.whatsapp.net',
      'remoteJid': 'status@broadcast'
    },
    'message': {
      'contactMessage': {
        'displayName': s.BOT_NAME,
        'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${s.BOT_NAME}\nitem1.TEL;waid=${s.NUMERO_OWNER}:${s.NUMERO_OWNER}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    }
  };
}

function getGreeting(name) {
  const hour = moment().hour();
  if (hour >= 5 && hour < 12) return `🌅☀️ Good morning, *${name}*!`;
  if (hour >= 12 && hour < 17) return `☀️😎 Good afternoon, *${name}*!`;
  if (hour >= 17 && hour < 20) return `🌆✨ Good evening, *${name}*!`;
  return `🌙😴 Good night, *${name}*!`;
}

function buildMenu(prefix, userName, allCommands) {
  moment.tz.setDefault("Africa/Nairobi");
  const name = userName.replace(/[*_~`]/g, '') || "User";
  const greeting = getGreeting(name);
  const invisible = String.fromCharCode(0x200e).repeat(4001);
  const time = moment().format('HH:mm:ss');
  const date = moment().format("DD/MM/YYYY");
  const total = os.totalmem();
  const used = total - os.freemem();
  const totalCmds = Object.values(allCommands).reduce((acc, val) => acc + val.length, 0);

  let commandList = "\n\n📜 COMMAND LIST\n";
  for (const category in allCommands) {
    commandList += `\n╭─「 *${category.toUpperCase()}* 」\n`;
    commandList += "│ " + allCommands[category].map(cmd => `${prefix}${cmd}`).join("\n│ ") + "\n";
    commandList += "╰───────────────⊷";
  }

  return `╭━━ ⌜  *${s.BOT_NAME}*  ⌟ ━━⊷❍
┃ 👤 ʙᴏᴛ ᴜsᴇʀ: *${name}*
┃ 🌍 ᴍᴏᴅᴇ: *${s.MODE.toLowerCase() !== 'yes' ? 'private' : 'public'}*
┃ 🔤 ᴘʀᴇғɪx: [ ${prefix} ]
┃ 💻 ᴘʟᴀᴛғᴏʀᴍ: *linux*
┃ 📅 ᴅᴀᴛᴇ: *${date}*
┃ ⏰ ᴛɪᴍᴇ: *${time}*
┃ 📚 ᴄᴏᴍᴍᴀɴᴅs: *${totalCmds}*
┃ 💾 ᴄᴀᴘᴀᴄɪᴛʏ: *${format(used)}/${format(total)}*
╰━━━━━━━━━━━━━━━━━━━━━━⊷❍

${greeting}

${invisible}
${commandList}`;
}

hango({
  nomCom: "menu",
  categorie: "General",
  reaction: '📋'
}, async (chatId, hn, { ms, repondre, prefixe, nomAuteurMessage }) => {
  try {
    const { cm } = require(__dirname + '/../framework/hango');
    const groupedCmds = {};

    cm.forEach(cmd => {
      if (!groupedCmds[cmd.categorie]) groupedCmds[cmd.categorie] = [];
      groupedCmds[cmd.categorie].push(cmd.nomCom);
    });

    const userName = ms.pushName || nomAuteurMessage || "User";

    let profilePic;

    // ================================
    // CUSTOM BOT IMAGE SYSTEM
    // ================================
    try {
      const DATA_FILE = path.join(__dirname, "../data/botimage.json");

      let botImages = {};

      if (fs.existsSync(DATA_FILE)) {
        try {
          botImages = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
        } catch (e) {
          console.error("❌ Failed to read botimage.json:", e);
        }
      }

      const botId = hn.user?.id || hn.user?.jid || "default";

      // If owner used .botimage, use that image
      if (botImages[botId]) {
        profilePic = botImages[botId];
      } else {
        // ================================
        // ORIGINAL BOT PROFILE PICTURE
        // ================================
        try {
          profilePic = await hn.profilePictureUrl(chatId, "image");
        } catch (e) {
          profilePic = s.URL || "https://files.catbox.moe/533oqh.jpg";
        }
      }

    } catch (imageError) {
      console.error("❌ Menu Image Error:", imageError);

      // Final fallback to original bot picture
      try {
        profilePic = await hn.profilePictureUrl(chatId, "image");
      } catch (e) {
        profilePic = s.URL || "https://files.catbox.moe/533oqh.jpg";
      }
    }

    await hn.sendMessage(chatId, {
      image: { url: profilePic },
      caption: buildMenu(prefixe, userName, groupedCmds),
      footer: `${s.BOT_NAME} • Powered by ${s.OWNER_NAME}`
    }, { quoted: createVCard() });

    // 🔥 MUSIC SECTION (ONLY CHANGED PART)
    const audioUrl = "https://files.catbox.moe/pnwvsy.mp3";

    try {
      await hn.sendMessage(chatId, {
        audio: { url: audioUrl },
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true
        }
      }, {
        quoted: ms
      });
    } catch (audioErr) {
      console.log("Audio Error:", audioErr);
    }

  } catch (err) {
    console.error("Menu Error:", err);
    repondre("❌ Error generating menu");
  }
});

