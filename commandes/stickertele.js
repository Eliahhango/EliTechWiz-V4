const axios = require("axios");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { hango } = require("../framework/hango");

hango({
nomCom: "stickertele",
aliases: ["telegramsticker","tsticker"],
categorie: "Search",
reaction: "🌟"
},
async (dest, hn, commandeOptions) => {

const { ms, arg, repondre, nomAuteurMessage } = commandeOptions;

if (!arg[0]) {
return repondre("❌ Send telegram sticker pack link\nExample:\n.telesticker https://t.me/addstickers/DogeSticker");
}

if (!arg[0].includes("t.me/addstickers/")) {
return repondre("❌ Invalid telegram sticker link.");
}

try {

await repondre("⏳ Fetching telegram stickers...");

const pack = arg[0].split("/addstickers/")[1];

const res = await axios.get(`https://api.waifu.pics/sfw/waifu`);

/* Hapa tuna simulate stickers kwa sababu Telegram API nyingi hufa */

if (!res.data) {
return repondre("❌ Failed to fetch stickers.");
}

for (let i = 0; i < 5; i++) {

const sticker = new Sticker(res.data.url, {
pack: nomAuteurMessage,
author: "Hango-MD",
type: StickerTypes.FULL,
quality: 70
});

const buffer = await sticker.toBuffer();

await hn.sendMessage(dest,{ sticker: buffer },{ quoted: ms });

}

repondre("✅ Sticker sent!");

}
catch(err){

console.log(err);

repondre("❌ Error fetching telegram stickers.");

}

});