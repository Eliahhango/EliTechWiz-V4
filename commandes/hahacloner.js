const util = require('util');
const fs = require('fs-extra');
const { hango } = require(__dirname + "/../framework/hango");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

const GITHUB_REPO = 'Eliahhango/EliTechWiz-V4';
const GITHUB_COMMITS_API = `https://api.github.com/repos/${GITHUB_REPO}/commits?per_page=1`;

hango({ nomCom: "menu", categorie: "General" }, async (dest, hn, commandeOptions) => {
    let { ms, repondre ,prefixe,nomAuteurMessage,mybotpic} = commandeOptions;
    let { cm } = require(__dirname + "/../framework//hango");
    var coms = {};
    var mode = "public";
    
    if ((s.MODE).toLocaleLowerCase() != "yes") {
        mode = "private";
    }


    
 cm.map(async (com, index) => {
        if (!coms[com.categorie])
            coms[com.categorie] = [];
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('Africa/Dar_es_Salaam');

// Créer une date et une heure en EAT
const temps = moment().format('HH:mm:ss');
const date = moment().format('DD/MM/YYYY');

  let infoMsg = `
┌─[ SYSTEM INITIATED ]─┐
│ 👾 EliTechWiz-V4 👾  │
└──────────────────────┘
┌─[ OPERATIONAL LOG ]─┐
│ ✦ OWNER   : ${s.OWNER_NAME}
│ ✦ PREFIX  : [ ${s.PREFIXE} ]
│ ✦ MODE    : ${mode}
│ ✦ TIME    : ${temps}
│ ✦ RAM     : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB
│ ✦ DATE    : ${date}
│ ✦ CREATOR : Eliah Hango
│ ✦ COMMANDS: ${cm.length}
└─────────────────────┘
┌─[ COMMAND INDEX ]─┐`;

    // --- ENHANCED MENU FEATURES ---
    const userName = nomAuteurMessage || "User";
    function runtime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secondsLeft = Math.floor(seconds % 60);
        return `${hours}h ${minutes}m ${secondsLeft}s`;
    }
    const uptime = runtime(process.uptime());
    const botVersion = "2.0.0";
    const tips = [
        "💡 Tip: Use !help to get detailed info about any command!",
        "💡 Did you know? You can invite me to your group for 24/7 fun!",
        "💡 Pro tip: Use !sticker to turn any image into a sticker!",
        "💡 Stay safe! Never share your OTP with anyone.",
        "💡 Use !meme for a quick laugh!"
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const categoryEmojis = {
        'General': '📁',
        'Fun': '🎲',
        'Admin': '🛡️',
        'Utility': '🛠️',
        'Music': '🎵',
        'Group': '👥',
        'Owner': '👑',
        'Downloads': '⬇️',
        'Anime': '🍥',
        'Games': '🎮',
        'Search': '🔎',
        'Other': '✨'
    };

    // Inspirational/hacker/tech quotes
    const quotes = [
        '💬 "The only way to do great work is to love what you do." — Steve Jobs',
        '💬 "Hack the planet. Change the world." — Anonymous',
        '💬 "Stay hungry, stay foolish." — Steve Jobs',
        '💬 "Talk is cheap. Show me the code." — Linus Torvalds',
        "💬 'Code is like humor. When you have to explain it, it's bad.' — Cory House",
        '💬 "Dream big. Dare bigger." — Elon Musk',
        '💬 "The quieter you become, the more you are able to hear." — Kali Linux',
        '💬 "First, solve the problem. Then, write the code." — John Johnson',
        '💬 "In a world of locked doors, the man with the key is king." — Mr. Robot',
        '💬 "Be the change you wish to see in the world." — Gandhi',
        '💬 "To err is human, but to really foul things up you need a computer." — Paul Ehrlich',
        '💬 "Security is not a product, but a process." — Bruce Schneier',
        '💬 "Innovation distinguishes between a leader and a follower." — Steve Jobs',
        '💬 "The best way to predict the future is to invent it." — Alan Kay',
        '💬 "If you can dream it, you can do it." — Walt Disney'
    ];

    const newsletterLink = "https://whatsapp.com/channel/0029VaeEYF0BvvsZpaTPfL2s";

    // --- MENU STYLE TEMPLATES ---
    function buildMenuStyle1() {
        let out = `┌─[ 🥷 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 INITIATED 🥷 ]─┐\n`;
        out += `│\n`;
        out += `│   User: ${userName}\n`;
        out += `│   Owner: ${s.OWNER_NAME}\n`;
        out += `│   Prefix: ${s.PREFIXE}\n`;
        out += `│   Mode: ${mode}\n`;
        out += `│   Time: ${temps} | Date: ${date}\n`;
        out += `│   RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | Uptime: ${uptime}\n`;
        out += `│   Commands: ${cm.length} | Version: v${botVersion}\n`;
        out += `│\n`;
        out += `│ 💡 ${randomTip}\n`;
        out += `│\n`;
        out += `│ 💬 ${randomQuote}\n`;
        out += `│\n`;
        out += `├─[ 📁 COMMAND MODULES 📁 ]─\n`;
        for (const cat in coms) {
            const emoji = categoryEmojis[cat] || '📁';
            out += `│\n${emoji} *${cat}* (${coms[cat].length})\n`;
            for (const cmd of coms[cat]) {
                out += `✦ root@command: ${s.PREFIXE}${cmd}\n`;
            }
        }
        out += `│\n`;
        out += `└─[ 🗂️ COMMAND CATEGORIES 🗂️ ]─\n`;
        out += `│\n`;
        out += `│ 📢 Official Channel: ${newsletterLink}\n`;
        out += `│ 🔗 [Support](https://t.me/) | [Website](https://youtube.com/@eliahhango)\n`;
        out += `└─[ 🏆 CREDITS 🏆 ]───────────────┘\n   Made by: Eliah Hango\n`;
        return out;
    }
    function buildMenuStyle2() {
        let out = `╔═━━━─────༺༻────━══╗\n`;
        out += `┃ 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 MENU\n`;
        out += `┃ User: ${userName} | Owner: ${s.OWNER_NAME}\n`;
        out += `┃ Prefix: ${s.PREFIXE} | Mode: ${mode}\n`;
        out += `┃ Time: ${temps} | Date: ${date}\n`;
        out += `┃ RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | Uptime: ${uptime}\n`;
        out += `┃ Version: v${botVersion} | Commands: ${cm.length}\n`;
        out += `╠═━━━─────༺༻────━══╣\n`;
        out += `┃ ${randomTip}\n`;
        out += `┃ ${randomQuote}\n`;
        for (const cat in coms) {
            const emoji = categoryEmojis[cat] || '✨';
            out += `\n${emoji} [${cat}] (${coms[cat].length})\n`;
            out += coms[cat].map(cmd => `   ➤ ${s.PREFIXE}${cmd}`).join("\n") + "\n";
        }
        out += `╠═━━━─────༺༻────━══╣\n`;
        out += `┃ 📢 Official Channel: ${newsletterLink}\n`;
        out += `┃ Support: https://t.me/\n`;
        out += `┃ Website: https://youtube.com/@eliahhango\n`;
        out += `╚═━━━─────༺༻────━══╝\n`;
        return out;
    }
    function buildMenuStyle3() {
        let out = `🖤━━━━━━━━━━━━━━━━━━━━━━🖤\n`;
        out += `💡 ${randomTip}\n`;
        out += `💬 ${randomQuote}\n`;
        out += `🖤━━━━━━━━━━━━━━━━━━━━━━🖤\n`;
        out += `👤: ${userName}   👑: ${s.OWNER_NAME}\n`;
        out += `⌚: ${temps}   📅: ${date}\n`;
        out += `🧠: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB   ⏳: ${uptime}\n`;
        out += `🏷️: ${s.PREFIXE}   🛠️: ${cm.length}   🏷️v${botVersion}\n`;
        out += `🖤━━━━━━━━━━━━━━━━━━━━━━🖤\n`;
        for (const cat in coms) {
            const emoji = categoryEmojis[cat] || '✨';
            out += `\n${emoji} ${cat} [${coms[cat].length}]\n`;
            out += coms[cat].map(cmd => `   • ${s.PREFIXE}${cmd}`).join("\n") + "\n";
        }
        out += `🖤━━━━━━━━━━━━━━━━━━━━━━🖤\n`;
        out += `📢 Official Channel: ${newsletterLink}\n`;
        out += `Support: https://t.me/ | Website: https://youtube.com/@eliahhango\n`;
        out += `🖤━━━━━━━━━━━━━━━━━━━━━━🖤\n`;
        return out;
    }
    function buildMenuStyle4() {
        let out = `╭─❒ 𝗘𝗹��𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 COMMANDS ❒─╮\n`;
        out += `│ User: ${userName}\n`;
        out += `│ Owner: ${s.OWNER_NAME}\n`;
        out += `│ Prefix: ${s.PREFIXE}\n`;
        out += `│ Mode: ${mode}\n`;
        out += `│ Time: ${temps}\n`;
        out += `│ Date: ${date}\n`;
        out += `│ RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB\n`;
        out += `│ Uptime: ${uptime}\n`;
        out += `│ Version: v${botVersion}\n`;
        out += `│ Commands: ${cm.length}\n`;
        out += `╰─❒──────────────────────❒─╯\n`;
        out += `💡 ${randomTip}\n`;
        out += `💬 ${randomQuote}\n`;
        for (const cat in coms) {
            const emoji = categoryEmojis[cat] || '✨';
            out += `\n${emoji} ${cat} (${coms[cat].length})\n`;
            out += coms[cat].map(cmd => `   ▸ ${s.PREFIXE}${cmd}`).join("\n") + "\n";
        }
        out += `────────────────────────────\n`;
        out += `📢 Official Channel: ${newsletterLink}\n`;
        out += `Support: https://t.me/ | Website: https://youtube.com/@eliahhango\n`;
        out += `────────────────────────────\n`;
        return out;
    }
    function buildMenuStyle5() {
        let out = `★彡[𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰]彡★\n`;
        out += `User: ${userName} | Owner: ${s.OWNER_NAME}\n`;
        out += `Prefix: ${s.PREFIXE} | Mode: ${mode}\n`;
        out += `Time: ${temps} | Date: ${date}\n`;
        out += `RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | Uptime: ${uptime}\n`;
        out += `Version: v${botVersion} | Commands: ${cm.length}\n`;
        out += `★━━━━━━━━━━━━━━━━━━━━━━━━━━━★\n`;
        out += `💡 ${randomTip}\n`;
        out += `💬 ${randomQuote}\n`;
        for (const cat in coms) {
            const emoji = categoryEmojis[cat] || '✨';
            out += `\n${emoji} ${cat} (${coms[cat].length})\n`;
            out += coms[cat].map(cmd => `   ✦ ${s.PREFIXE}${cmd}`).join("\n") + "\n";
        }
        out += `★━━━━━━━━━━━━━━━━━━━━━━━━━━━★\n`;
        out += `📢 Official Channel: ${newsletterLink}\n`;
        out += `Support: https://t.me/ | Website: https://youtube.com/@eliahhango\n`;
        out += `★━━━━━━━━━━━━━━━━━━━━━━━━━━━★\n`;
        return out;
    }
    // --- NEW MENU STYLES ---
    function buildMenuStyle6() {
        let out = `🟣═════════════════════════════🟣\n`;
        out += `   💎 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 💎\n`;
        out += `🟣═════════════════════════════🟣\n`;
        out += `👤 User: ${userName}\n👑 Owner: ${s.OWNER_NAME}\n`;
        out += `🏷️ Prefix: ${s.PREFIXE}   🌐 Mode: ${mode}\n`;
        out += `⏰ Time: ${temps}   🗓️ Date: ${date}\n`;
        out += `🧠 RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB   ⏳ Uptime: ${uptime}\n`;
        out += `🛠️ Commands: ${cm.length}   🏷️ Version: v${botVersion}\n`;
        out += `🟣═════════════════════════════🟣\n`;
        out += `💡 ${randomTip}\n`;
        out += `💬 ${randomQuote}\n`;
        for (const cat in coms) {
            const emoji = categoryEmojis[cat] || '🟣';
            out += `\n${emoji} ${cat} (${coms[cat].length})\n`;
            out += coms[cat].map(cmd => `   ➤ ${s.PREFIXE}${cmd}`).join("\n") + "\n";
        }
        out += `🟣═════════════════════════════🟣\n`;
        out += `📢 Official Channel: ${newsletterLink}\n`;
        out += `Support: https://t.me/ | Website: https://youtube.com/@eliahhango\n`;
        out += `🟣═════════════════════════════🟣\n`;
        return out;
    }
    function buildMenuStyle7() {
        let out = `╔══✦═══✦══╗\n`;
        out += `   𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 MENU\n`;
        out += `╚══✦═══✦══╝\n`;
        out += `💡 ${randomTip}\n`;
        out += `💬 ${randomQuote}\n`;
        out += `👤: ${userName} | 👑: ${s.OWNER_NAME}\n`;
        out += `🏷️: ${s.PREFIXE} | 🌐: ${mode}\n`;
        out += `⏰: ${temps} | 🗓️: ${date}\n`;
        out += `🧠: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | ⏳: ${uptime}\n`;
        out += `🛠️: ${cm.length} | v${botVersion}\n`;
        out += `╔══✦═══✦══╗\n`;
        for (const cat in coms) {
            const emoji = categoryEmojis[cat] || '✦';
            out += `\n${emoji} ${cat} (${coms[cat].length})\n`;
            out += coms[cat].map(cmd => `   ✦ ${s.PREFIXE}${cmd}`).join("\n") + "\n";
        }
        out += `╚══✦═══✦══╝\n`;
        out += `📢 Official Channel: ${newsletterLink}\n`;
        out += `Support: https://t.me/ | Website: https://youtube.com/@eliahhango\n`;
        return out;
    }
    function buildMenuStyle8() {
        let out = `🛸───────────────🛸\n`;
        out += `   👾 ELITECHWIZ V4 👾\n`;
        out += `🛸───────────────🛸\n`;
        out += `👤 ${userName} | 👑 ${s.OWNER_NAME}\n`;
        out += `🏷️ ${s.PREFIXE} | 🌐 ${mode}\n`;
        out += `⏰ ${temps} | 🗓️ ${date}\n`;
        out += `🧠 ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | ⏳ ${uptime}\n`;
        out += `🛠️ ${cm.length} | v${botVersion}\n`;
        out += `🛸───────────────🛸\n`;
        out += `💡 ${randomTip}\n`;
        out += `💬 ${randomQuote}\n`;
        for (const cat in coms) {
            const emoji = categoryEmojis[cat] || '👾';
            out += `\n${emoji} ${cat} (${coms[cat].length})\n`;
            out += coms[cat].map(cmd => `   👽 ${s.PREFIXE}${cmd}`).join("\n") + "\n";
        }
        out += `🛸───────────────🛸\n`;
        out += `📢 Official Channel: ${newsletterLink}\n`;
        out += `Support: https://t.me/ | Website: https://youtube.com/@eliahhango\n`;
        out += `🛸───────────────🛸\n`;
        return out;
    }
    function buildMenuStyle9() {
        let out = `🌟━━━━━━━━━━━━━━━🌟\n`;
        out += `   🌠 ELITECHWIZ V4 🌠\n`;
        out += `🌟━━━━━━━━━━━━━━━🌟\n`;
        out += `👤 ${userName}\n👑 ${s.OWNER_NAME}\n`;
        out += `🏷️ ${s.PREFIXE} | 🌐 ${mode}\n`;
        out += `⏰ ${temps} | 🗓️ ${date}\n`;
        out += `🧠 ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | ⏳ ${uptime}\n`;
        out += `🛠️ ${cm.length} | v${botVersion}\n`;
        out += `🌟━━━━━━━━━━━━━━━🌟\n`;
        out += `💡 ${randomTip}\n`;
        out += `💬 ${randomQuote}\n`;
        for (const cat in coms) {
            const emoji = categoryEmojis[cat] || '🌟';
            out += `\n${emoji} ${cat} (${coms[cat].length})\n`;
            out += coms[cat].map(cmd => `   ✨ ${s.PREFIXE}${cmd}`).join("\n") + "\n";
        }
        out += `🌟━━━━━━━━━━━━━━━🌟\n`;
        out += `📢 Official Channel: ${newsletterLink}\n`;
        out += `Support: https://t.me/ | Website: https://youtube.com/@eliahhango\n`;
        out += `🌟━━━━━━━━━━━━━━━🌟\n`;
        return out;
    }
    function buildMenuStyle10() {
        let out = `🦾═══════════════════════🦾\n`;
        out += `   🤖 ELITECHWIZ V4 🤖\n`;
        out += `🦾═══════════════════════🦾\n`;
        out += `👤 ${userName} | 👑 ${s.OWNER_NAME}\n`;
        out += `🏷️ ${s.PREFIXE} | 🌐 ${mode}\n`;
        out += `⏰ ${temps} | 🗓️ ${date}\n`;
        out += `🧠 ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB | ⏳ ${uptime}\n`;
        out += `🛠️ ${cm.length} | v${botVersion}\n`;
        out += `🦾═══════════════════════🦾\n`;
        out += `💡 ${randomTip}\n`;
        out += `💬 ${randomQuote}\n`;
        for (const cat in coms) {
            const emoji = categoryEmojis[cat] || '🦾';
            out += `\n${emoji} ${cat} (${coms[cat].length})\n`;
            out += coms[cat].map(cmd => `   🤖 ${s.PREFIXE}${cmd}`).join("\n") + "\n";
        }
        out += `🦾═══════════════════════🦾\n`;
        out += `📢 Official Channel: ${newsletterLink}\n`;
        out += `Support: https://t.me/ | Website: https://youtube.com/@eliahhango\n`;
        out += `🦾═══════════════════════🦾\n`;
        return out;
    }
    // Pick a random style
    const menuStyles = [buildMenuStyle1, buildMenuStyle2, buildMenuStyle3, buildMenuStyle4, buildMenuStyle5, buildMenuStyle6, buildMenuStyle7, buildMenuStyle8, buildMenuStyle9, buildMenuStyle10];
    const finalMenu = menuStyles[Math.floor(Math.random() * menuStyles.length)]();

   var lien = mybotpic();

   // WhatsApp Channel Newsletter Info
   const newsletterJid = '120363222395675670@newsletter';
   const newsletterName = 'EliTechWiz';
   const newsletterThumbnail = 'https://files.catbox.moe/vxxv26.jpeg';
   const newsletterSourceUrl = 'https://whatsapp.com/channel/0029VaeEYF0BvvsZpaTPfL2s';
   const newsletterContextInfo = {
       forwardingScore: 999,
       externalAdReply: {
           title: newsletterName,
           body: 'fast via',
           thumbnailUrl: newsletterThumbnail,
           sourceUrl: newsletterSourceUrl,
           mediaType: 1,
           renderLargerThumbnail: true
       }
   };

   if (lien.match(/\.(mp4|gif)$/i)) {
    try {
        hn.sendMessage(dest, { video: { url: lien }, caption: finalMenu, footer: "Je suis *hango-MD*, développé par Djalega++", gifPlayback: true, contextInfo: newsletterContextInfo }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
} 
// Vérification pour .jpeg ou .png
else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
    try {
        hn.sendMessage(dest, { image: { url: lien }, caption: finalMenu, footer: "*Eliah Tech*", contextInfo: newsletterContextInfo }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
} 
else {
    
    repondre(finalMenu);
    
}

});

// Add a test command to preview all menu styles at once
hango({ nomCom: "menutest", categorie: "General" }, async (dest, hn, commandeOptions) => {
    let { ms, repondre, nomAuteurMessage, mybotpic } = commandeOptions;
    // Use the same context as the main menu
    const userName = nomAuteurMessage || "User";
    function runtime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secondsLeft = Math.floor(seconds % 60);
        return `${hours}h ${minutes}m ${secondsLeft}s`;
    }
    const uptime = runtime(process.uptime());
    const botVersion = "2.0.0";
    const tips = [
        "💡 Tip: Use !help to get detailed info about any command!",
        "💡 Did you know? You can invite me to your group for 24/7 fun!",
        "💡 Pro tip: Use !sticker to turn any image into a sticker!",
        "💡 Stay safe! Never share your OTP with anyone.",
        "💡 Use !meme for a quick laugh!"
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    // Use the same coms, cm, etc. as the main menu
    // Use the same categoryEmojis and menu style functions
    const menuStyles = [buildMenuStyle1, buildMenuStyle2, buildMenuStyle3, buildMenuStyle4, buildMenuStyle5, buildMenuStyle6, buildMenuStyle7, buildMenuStyle8, buildMenuStyle9, buildMenuStyle10];
    for (let i = 0; i < menuStyles.length; i++) {
        const previewMenu = menuStyles[i]();
        await hn.sendMessage(dest, { text: `*Menu Style ${i+1}:*\n\n` + previewMenu }, { quoted: ms });
    }
    repondre("✅ All menu styles sent for preview!");
});
