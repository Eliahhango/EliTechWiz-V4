const {hango} = require('../framework/hango');
const fs = require('fs');
const getFBInfo = require("@xaviabot/fb-downloader");
const { default: axios } = require('axios');

hango({nomCom : "igdl" , categorie : "Download"},async (dest , hn , commandeOptions)=>{
  const {ms,repondre,arg} = commandeOptions ;

  let link = arg.join(' ')

  if (!arg[0]) { repondre('Veillez insérer un lien video instagramme');return}; 

  try {
     
    let igvid = await axios('https://api.vihangayt.com/downloader/ig?url='+link)

    if (igvid.data.data.data[0].type == 'video') {
    hn.sendMessage(dest,{video : {url : igvid.data.data.data[0].url},caption : "ig video downloader powered by *EliTechWiz-V4*",gifPlayback : false },{quoted : ms}) 
    }
    else {
        hn.sendMessage(dest,{image : {url : igvid.data.data.data[0].url},caption : "ig image downloader powered by *QART-Md*"})
    }
  
  } catch (e) {repondre("erreur survenue lors du téléchargement \n " + e)}
  
});


hango({
  nomCom: "fbdl",
  categorie: "Download",
  reaction: "📽️"
},
async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  if (!arg[0]) {
    repondre('Insert a public facebook video link!');
    return;
  }

  const queryURL = arg.join(" ");

  try {
     getFBInfo(queryURL)
    .then((result) => {
       let caption = `
        📥 *FB Video by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰* 🚀\n🎬 *Title*: ${result.title}\n🔗 *Link*: ${result.url}\n━━━━━━━━━━━━━━━━━━━`;
       hn.sendMessage(dest,{image : { url : result.thumbnail}, caption : caption},{quoted : ms}) ;
       hn.sendMessage(dest, { video: { url: result.hd  }, caption: '📥 FB Video by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 🚀 | Download now!' }, { quoted: ms });
      
    })
    .catch((error) => {console.log("Error:", error)
                      repondre('try fbdl2 on this link')});


   
  } catch (error) {
    console.error('Erreur lors du téléchargement de la vidéo :', error);
    repondre('Erreur lors du téléchargement de la vidéo.' , error);
  }
});



hango({ nomCom: "tiktoklite", categorie: "Download", reaction: "🎵" }, async (dest, hn, commandeOptions) => {
  const { arg, ms, prefixe,repondre } = commandeOptions;
  if (!arg[0]) {
    repondre(`how to use this command:\n ${prefixe}tiktok tiktok_video_link`);
    return;
  }

  const videoUrl = arg.join(" ");

 let data = await axios.get('https://api.onesytex.my.id/api/tiktok-dl='+ videoUrl) ;

  let tik = data.data.data

      // Envoi du message avec le thumbnail de la vidéo
      const caption = `
Author: ${tik.author}
Description: ${tik.desc}
      `;

         
      hn.sendMessage(dest, { video: { url: tik.links[0].a} , caption : caption },{quoted : ms});    

  
});

hango({
  nomCom: "fbdl2",
  categorie: "Download",
  reaction: "📽️"
},
async (dest, hn, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  if (!arg[0]) {
    repondre('Insert a public facebook video link! !');
    return;
  }

  const queryURL = arg.join(" ");

  try {
     getFBInfo(queryURL)
    .then((result) => {
       let caption = `
        📥 *FB Video by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰* 🚀\n🎬 *Title*: ${result.title}\n🔗 *Link*: ${result.url}\n━━━━━━━━━━━━━━━━━━━`;
       hn.sendMessage(dest,{image : { url : result.thumbnail}, caption : caption},{quoted : ms}) ;
       hn.sendMessage(dest, { video: { url: result.sd  }, caption: '📥 FB Video by 𝗘𝗹𝗶𝗧𝗲𝗰𝗵𝗪𝗶𝘇-𝗩𝟰 🚀 | Download now!' }, { quoted: ms });
      
    })
    .catch((error) => {console.log("Error:", error)
                      repondre(error)});


   
  } catch (error) {
    console.error('Erreur lors du téléchargement de la vidéo :', error);
    repondre('Erreur lors du téléchargement de la vidéo.' , error);
  }
});
