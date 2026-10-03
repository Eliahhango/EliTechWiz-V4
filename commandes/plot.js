"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

const { hango } = require("../framework/hango");

hango({
  nomCom: "repo",
  catégorie: "General",
  reaction: "✨",
  nomFichier: __filename
},

async (dest, hn) => {

  const githubRepo = "https://github.com/Eliahhango/EliTechWiz-V4";
  const apiRepo = "https://api.github.com/repos/Eliahhango/EliTechWiz-V4";

  const img = "https://files.catbox.moe/qfknws.jpg";

  const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363402252728845@newsletter",
      newsletterName: "EliTechWiz-V4 CHANNEL",
      serverMessageId: 1
    }
  };

  try {

    const response = await fetch(apiRepo);
    const data = await response.json();

    const text = `
┏━━━━━━━━━━━━━━━━━━━━━━━
┃ 🤖 *EliTechWiz-V4 v²*
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ 👤 *OWNER:* EliTechWiz
┃ ⭐ *STARS:* ${data.stargazers_count}
┃ 🍴 *FORKS:* ${data.forks_count}
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ 🚀 *WhatsApp Bot*
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ 🌐 *REPO:* 
┃ ${githubRepo}
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ ⭐ Don’t forget to star & 🍴 fork my repo
┗━━━━━━━━━━━━━━━━━━━━━━━
`;

    await hn.sendMessage(dest, {
      image: { url: img },
      caption: text,
      contextInfo
    });

  } catch (e) {

    console.log(e);

    await hn.sendMessage(dest, {
      text: "❌ Repo command failed.",
      contextInfo
    });

  }

});