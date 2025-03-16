const util = require('util');
const fs = require('fs-extra');
const { hango } = require(__dirname + "/../framework/hango");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

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

    moment.tz.setDefault('EAT');

// Créer une date et une heure en EAT
const temps = moment().format('HH:mm:ss');
const date = moment().format('DD/MM/YYYY');

  let infoMsg =  `
╔══✧『 *𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4* 』✧══❖
║ ⚜️┌─────────────────┐
║ ⚜️│    ⚡ BOT STATUS ⚡    
║ ⚜️│ ✦ 𝙾𝚠𝚗𝚎𝚛 : ${s.OWNER_NAME}
║ ⚜️│ ✦ 𝙿𝚛𝚎𝚏𝚒𝚡 : [ ${s.PREFIXE} ]
║ ⚜️│ ✦ 𝙼𝚘𝚍𝚎 : ${mode}
║ ⚜️│ ✦ 𝚃𝚒𝚖𝚎 : ${temps}
║ ⚜️│ ✦ 𝚁𝚊𝚖 : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB
║ ⚜️│ ✦ 𝙳𝚊𝚝𝚎 : ${date}
║ ⚜️│ ✦ 𝙲𝚛𝚎𝚊𝚝𝚘𝚛 : Eliah Hango
║ ⚜️│ ✦ 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜 : ${cm.length}
║ ⚜️└─────────────────┘
╚══✧『 *COMMANDS LIST* 』✧══❖\n`;

    let menuMsg = ``;
    
    for (const cat in coms) {
        menuMsg += `
━━━⊰ ${cat} ⊱━━━⊱
┃ ⛥╭──────────────────`; 
        for (const cmd of coms[cat]) {
            menuMsg += `          
┃ ⛥│ ❯ ${s.PREFIXE}${cmd}`;    
        }
        menuMsg += `
┃ ⛥╰──────────────────
┗━━━━━━━━━━━━━━━━⊱`;
    }
    
    menuMsg += `
>┏━━━ꨄ︎ *CREDITS* ꨄ︎━━━⊱
 ┃ Made by: *Eliah Hango*
 ┗━━━━━━━━━━━━━━━━⊱
`;

   var lien = mybotpic();

   if (lien.match(/\.(mp4|gif)$/i)) {
    try {
        hn.sendMessage(dest, { video: { url: lien }, caption:infoMsg + menuMsg, footer: "Je suis *hango-MD*, développé par Djalega++" , gifPlayback : true }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
} 
// Vérification pour .jpeg ou .png
else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
    try {
        hn.sendMessage(dest, { image: { url: lien }, caption:infoMsg + menuMsg, footer: "*Eliah Tech*" }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
} 
else {
    
    repondre(infoMsg + menuMsg);
    
}

});
