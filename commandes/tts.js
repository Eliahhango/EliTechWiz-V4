const googleTTS = require('google-tts-api');
const {hango} = require("../framework/hango");


hango( {
  nomCom : "dit",
 categorie : "tts",
  reaction : "👄" },
      async(dest,hn, commandeOptions)=> {
 
const {ms,arg,repondre} = commandeOptions;
      if (!arg[0]) {repondre("Insert a word");return} ;
 const mots = arg.join(" ")

const url = googleTTS.getAudioUrl( mots, {
  lang: 'fr',
  slow: false,
  host: 'https://translate.google.com',
});
console.log(url); 
             hn.sendMessage(dest, { audio: { url:url},mimetype:'audio/mp4' }, { quoted: ms,ptt: true });


        
}
) ;

hango( {
  nomCom : "itta",
 categorie : "tts",
  reaction : "👄" },
      async(dest,hn, commandeOptions)=> {
 
const {ms,arg,repondre} = commandeOptions;
      if (!arg[0]) {repondre("Insert a word");return} ;
 const mots = arg.join(" ")

const url = googleTTS.getAudioUrl( mots, {
  lang: 'ja',
  slow: false,
  host: 'https://translate.google.com',
});
console.log(url); 
             hn.sendMessage(dest, { audio: { url:url},mimetype:'audio/mp4' }, { quoted: ms,ptt: true });


        
}
) ;

hango( {
  nomCom : "say",
 categorie : "tts",
  reaction : "👄" },
      async(dest,hn, commandeOptions)=> {
 
const {ms,arg,repondre} = commandeOptions;
      if (!arg[0]) {repondre("Insert a word");return} ;
 const mots = arg.join(" ")

const url = googleTTS.getAudioUrl( mots, {
  lang: 'en',
  slow: false,
  host: 'https://translate.google.com',
});
console.log(url); 
             hn.sendMessage(dest, { audio: { url:url},mimetype:'audio/mp4' }, { quoted: ms,ptt: true });


        
}
) ;

