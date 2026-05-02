"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { hango } = require("../framework/hango");

hango({ nomCom: "channel", reaction: "😌", nomFichier: __filename }, async (dest, hn, commandeOptions) => {
    console.log("Commande saisie !!!s");
    let z = 'Salut je m\'appelle *EliahTech* \n\n ' + 'je suis un bot Whatsapp Multi-appareil voici la chaîne';
    let d = ' developpé par *Eliah*';
    let varmess = z + d;
    var lien = 'https://whatsapp.com/channel/0029VaeEYF0BvvsZpaTPfL2s';  // Remplacez cet URL par le lien que vous souhaitez envoyer
    await hn.sendMessage(dest, { text: varmess + "\n" + lien });
});

console.log("mon test");

});
console.log("mon test");
/*module.exports.commande = () => {
  var nomCom = ["test","t"]
  var reaction="☺️"
  return { nomCom, execute,reaction }
};

async function  execute  (origineMessage,zok) {
  console.log("Commande saisie !!!s")
   let z ='Salut je m\'appelle *𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰* \n\n '+'je suis un bot Whatsapp Multi-appareil '
      let d =' developpé par *Thomas*'
      let varmess=z+d
      var img='https://files.catbox.moe/vxxv26.jpeg'
await  zok.sendMessage(origineMessage,  { image:{url:img},caption:varmess});
}  */ 
