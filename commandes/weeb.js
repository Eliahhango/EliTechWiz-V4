const axios = require('axios');
const fs = require('fs');
const { hango } = require("../framework/hango");
const { writeFile } = require('fs/promises')

// Commande waifu
hango({
  nomCom: "waifu",
  categorie: "Weeb",
  reaction: "😏"
},
async (origineMessage, hn, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://api.waifu.pics/sfw/waifu'; // Remplacez avec le lien réel de l'API waifu.pics

  try {
    
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      hn.sendMessage(origineMessage, { image: { url: imageUrl } }, { quoted: ms });
    }
  } catch (error) {
    repondre('Error occurred while retrieving the data. :', error);
  }
});

// Commande neko
hango({
  nomCom: "neko",
  categorie: "Weeb",
  reaction: "😺"
},
async (origineMessage, hn, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://api.waifu.pics/sfw/neko'; // Remplacez avec le lien réel de l'API waifu.pics ou une autre API de nekos

  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      hn.sendMessage(origineMessage, { image: { url: imageUrl } }, { quoted: ms });
    }
  } catch (error) {
    repondre('Error occurred while retrieving the data. :', error);
  }
});

// Commande shinobu
hango({
  nomCom: "shinobu",
  categorie: "Weeb",
  reaction: "🦋"
},
async (origineMessage, hn, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://api.waifu.pics/sfw/shinobu'; // Remplacez avec le lien réel de l'API waifu.pics ou une autre API avec des images de Shinobu

  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      hn.sendMessage(origineMessage, { image: { url: imageUrl } }, { quoted: ms });
    }
  } catch (error) {
    repondre('Error occurred while retrieving the data. :', error);
  }
});

// Commande megumin
hango({
  nomCom: "megumin",
  categorie: "Weeb",
  reaction: "💥"
},
async (origineMessage, hn, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const url = 'https://api.waifu.pics/sfw/megumin'; // Remplacez avec le lien réel de l'API waifu.pics ou une autre API avec des images de Megumin

  try {
    for (let i = 0; i < 5; i++) {
      const response = await axios.get(url);
      const imageUrl = response.data.url;

      hn.sendMessage(origineMessage,{ image: { url: imageUrl } }, { quoted: ms });
    }
  } catch (error) {
    repondre('Error occurred while retrieving the data. :', error);
  }
});



hango({
  nomCom: "cosplay",
  categorie: "Weeb",
  reaction: "😏"
},
async (origineMessage, hn, commandeOptions) => {
  const { repondre, ms } = commandeOptions;



  try {
    for (let i = 0; i < 5; i++) {
      let url = 'https://fantox-cosplay-api.onrender.com/'
      
   const response = await   axios.get(url, { responseType: 'arraybuffer' })

  

  const image = response.data;

   await writeFile('./cosplay.jpg', image)
      hn.sendMessage(origineMessage,{image : {url : `./cosplay.jpg`}},{quoted :ms}) }
  
  } catch (e) {
    repondre("je reçois malheureusement une erreur : " + e);
  }
});


hango({nomCom:"couplepp",categorie: "Weeb",reaction : "💞"},async(dest,hn,commandeOptions)=>{ const {repondre , ms} = commandeOptions;
    let api = 'https://smiling-hosiery-bear.cyclic.app/weeb/couplepp'
  try {
     repondre('she/he dont love you :)')
 const result = await axios.get(api)
  

    hn.sendMessage(dest, { image: { url: result.data.male }, caption: `For Man` }, { quoted: ms })
        hn.sendMessage(dest, { image: { url: result.data.female }, caption: `_For woman_` }, { quoted: ms })
    
  } catch (e) { repondre(e)}                                                                                        
  
}
      )

