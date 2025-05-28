const util = require('util');
const fs = require('fs-extra');
const { hango } = require(__dirname + "/../framework/hango");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

hango({ nomCom: "menu", categorie: "Menu" }, async (dest, hn, commandeOptions) => {
    let { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;
    let { cm } = require(__dirname + "/../framework/hango");
    let coms = {};
    let mode = "public";

    if ((s.MODE).toLowerCase() !== "yes") {
        mode = "private";
    }

    cm.map((com) => {
        if (!coms[com.categorie]) {
            coms[com.categorie] = [];
        }
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('Etc/GMT');
    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    let infoMsg = `
╭━━✧★☞  η𝕖ⓧùⓢ-𝐀𝓘  😾💜✧━━❖
┊✺┌────••••────⊷
┃✇│◎ 𝙾𝚠𝚗𝚎𝚛 : ${s.OWNER_NAME}
┃✇│◎ 𝙿𝚛𝚎𝚏𝚒𝚡 : [ ${s.PREFIXE} ]
┃✇│◎ 𝙼𝚘𝚍𝚎 : ${mode}
┃✇│◎ 𝚁𝚊𝚖  : 8/132 GB
┃✇│◎ 𝙳𝚊𝚝𝚎  : ${date}
┃✇│◎ 𝙿𝚕𝚊𝚝𝚏𝚘𝚛𝚖 : ${os.platform()}
┃✇│◎ 𝙲𝚛𝚎𝚊𝚝𝚘𝚛 : 𝕻𝖐 𝖉𝖗𝖎𝖑𝖑𝖊𝖗
┃✇│◎ 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜 : ${cm.length}
┃✇│ 𝚃𝚑𝚎𝚖𝚎 :𝕹𝕰𝖃𝖀𝕾-𝕬𝕴
┊   └────••••────⊷
╰━━━••✧𝕹𝕰𝖃𝖀𝕾-𝕬𝕴✧••━━━◆ \n`;

    let menuMsg = `𝕹𝕰𝖃𝖀𝕾 𝕬𝕴`;
    
    for (const cat in coms) {
        menuMsg += `
╭━━━❂ *${cat}* ❂⁠⁠⁠⁠━━─••
║╭━━══••══━━••⊷ `;
        for (const cmd of coms[cat]) {
            menuMsg += `          
║┊◆ ${s.PREFIXE}  *${cmd}*`;    
        }
        menuMsg += `
║╰━━══••══━━••⊷
╰════────════◆◆◆`;
    }
    
    menuMsg += `
> @ℕ𝔼𝕏𝕌𝕊 𝔸𝕀\n`;

    try {
        const senderName = nomAuteurMessage || message.from;  // Use correct variable for sender name
        await hn.sendMessage(dest, {
            text: infoMsg + menuMsg,
            contextInfo: {
                mentionedJid: [senderName],
                externalAdReply: {
                    title: "𝕹𝕰𝖃𝖀𝕾 𝕬𝕴",
                    body: "Tap here my friend join channel update",
                    thumbnailUrl: "https://files.catbox.moe/p5dt66.jpeg",
                    sourceUrl: "https://whatsapp.com/channel/0029VaeEYF0BvvsZpaTPfL2s",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
    } catch (error) {
        console.error("Menu error: ", error);
        repondre("🥵🥵 Menu error: " + error);
    }
});
