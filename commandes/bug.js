const util = require('util');
const fs = require('fs-extra');
const { hango } = require(__dirname + "/../framework/hango");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206)
const Taphere = more.repeat(4001)

hango({ nomCom: "bugmenu", categorie: "Menu" }, async (dest, hn, commandeOptions) => {
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

    moment.tz.setDefault("Africa/Dar Es Salam");

// Créer une date et une heure en GMT
const temps = moment().format('HH:mm:ss');
const date = moment().format('DD/MM/YYYY');

let infoMsg =  `
╔══❃══『 *𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4* 』══❃══╗

┌─『 *BUG COMMANDS* 』─❖
│
├ 🔰 bug
├ 💥 crash
├ ⚡ loccrash
├ 🔄 amountbug <amount>
├ 💫 crashbug 255XXXX
├ 📱 pmbug 255XXXX
├ ⏱️ delaybug 255XXXX
├ 🌀 trollybug 255XXXX
├ 📄 docubug 254XXXX
├ ♾️ unlimitedbug 255XXXX
├ 💣 bombug 255XXXX
├ 🌪️ lagbug 255XXXX
├ 👥 gcbug <grouplink>
├ ⏳ delaygcbug <grouplink>
├ 🎭 trollygcbug <grouplink>
├ 📉 laggcbug <grouplink>
├ 💥 bomgcbug <grouplink>
├ 🔄 unlimitedgcbug <grouplink>
└ 📑 docugcbug <grouplink>

┌─『 *BOT INFO* 』─❖
│ ⏰ *TIME* : ${temps}
│ 📅 *DATE* : ${date}
└──────────────❖`;
    
let menuMsg = `
‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎

╭──────────────────➳
│*POWERED BY 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4*
╰──────────────────➳


╭───────➻⊷⊷➻────────❍ 
│╔════════✣═════════➻
│╏ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
│╏ ▓▓▒▒▒▒▒▒▒▒▒▒▒▒▓▓
│╏ ▓▓▒▒▒▒▒▒▒▒▒▒▒▒▓▓
│╏ ▓▓▓▓▓▓▓▓▓▒▒▒▒▒▓▓
│╏ ▓▓▒▒▒▒▓▓▓▒▒▒▒▒▓▓
│╏ ▓▓▒▒▓▓▓▓▓▒▒▒▒▒▓▓
│╏ ▓▓▒▒▒▒▓▓▓▒▒▒▒▒▓▓
│╏ ▓▓▒▒▓▓▓▓▓▒▒▒▒▒▓▓
│╏ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
│╚════════✣═════════➻
│*POWERED BY 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4*
╰───────➻⊷⊷➻────────❍ 

> ©𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4 PROJECT
`;

   var lien = mybotpic();

   if (lien.match(/\.(mp4|gif)$/i)) {
    try {
        hn.sendMessage(dest, { video: { url: lien }, caption:infoMsg + menuMsg, footer: "Je suis *𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4*, déveloper Eliah Tech" , gifPlayback : true }, { quoted: ms });
    }
    catch (e) {
        console.log("🤫🤫 Menu erreur " + e);
        repondre("🤫🤫 Menu erreur " + e);
    }
} 
// Vérification pour .jpeg ou .png
else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
    try {
        hn.sendMessage(dest, { image: { url: lien }, caption:infoMsg + menuMsg, footer: "Je suis *EliTechWiz*, déveloper EliahTech" }, { quoted: ms });
    }
    catch (e) {
        console.log("🤫🤫 Menu erreur " + e);
        repondre("🤫🤫 Menu erreur " + e);
    }
} 
else {
    
    repondre(infoMsg + menuMsg);
    
}

}); 

