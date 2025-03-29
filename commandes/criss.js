const { hango } = require("../framework/hango")
//const { getGroupe } = require("../ess/groupe")
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const {ajouterOuMettreAJourJid,mettreAJourAction,verifierEtatJid} = require("../ess/antilien")
const {atbajouterOuMettreAJourJid,atbverifierEtatJid} = require("../ess/antibot")
const fs = require("fs-extra");
const conf = require("../set");
const { default: axios } = require('axios');


hango({ nomCom: "tagalladmin", categorie: 'Group', reaction: "📣" }, async (dest, hn, commandeOptions) => {

  const { ms, repondre, arg, verifGroupe, nomGroupe, infosGroupe, nomAuteurMessage, verifAdmin, superUser } = commandeOptions;

  if (!verifGroupe) { 
    repondre("✋🏿 ✋🏿 This command is reserved for groups ❌"); 
    return; 
  }

  if (!verifAdmin && !superUser) { 
    repondre("Command reserved for admins ❌"); 
    return; 
  }

  let mess = arg && arg !== ' ' ? arg.join(' ') : 'Aucun Message';

  let adminsGroupe = infosGroupe.participants.filter(membre => membre.admin); // Filtering only admins

  let tag = `  
╭─────────────━┈⊷ 
│🔰 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4
╰─────────────━┈⊷ \n
│👥 *Group* : ${nomGroupe} 
│👤 *Hey😀* : *${nomAuteurMessage}* 
│📜 *Message* : *${mess}* 
╰─────────────━┈⊷\n\n`;

  let emoji = ['🦴', '👀', '😮‍💨', '❌', '✔️', '😇', '⚙️', '🔧', '🎊', '😡', '🙏🏿', '⛔️', '$', '😟', '🥵', '🐅'];
  let random = Math.floor(Math.random() * emoji.length);

  for (const membre of adminsGroupe) {
    tag += `${emoji[random]}      @${membre.id.split("@")[0]}\n`;
  }

  hn.sendMessage(dest, { text: tag, mentions: adminsGroupe.map(i => i.id) }, { quoted: ms });

});
