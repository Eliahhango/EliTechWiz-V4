const { hango } = require('../framework/hango');
const traduire = require("../framework/traduction") ;
const { default: axios } = require('axios');
const text2prompt = require('../framework/text2prompt')
const { ai } = require('../framework/mesfonctions')
const { react } = require('../framework/utils')
const conf = require('../set');




hango({nomCom:"Eliah",reaction:"📡",categorie:"Ai"},async(dest,hn,commandeOptions)=>{

  const {repondre,ms,arg}=commandeOptions;
  
    if(!arg || !arg[0])
    {return repondre("Nambie Nakusikiliza mkuu unasemaje.🤔")}
    //var quest = arg.join(' ');
  try{
    
    
const message = await traduire(arg.join(' '),{ to : 'en'});
 console.log(message)
fetch(`http://api.brainshop.ai/get?bid=182418&key=UQXAO1yyrPLRnhf6&uid=[uid]&msg=${message}`)
.then(response => response.json())
.then(data => {
  const botResponse = data.cnt;
  console.log(botResponse);

  traduire(botResponse, { to: 'en' })
    .then(translatedResponse => {
      repondre(translatedResponse);
    })
    .catch(error => {
      console.error('Error when translating into French :', error);
      repondre('Error when translating into French');
    });
})
.catch(error => {
  console.error('Error requesting BrainShop :', error);
  repondre('Error requesting BrainShop');
});

  }catch(e){ repondre("oops an error : "+e)}
    
  
  });  



  hango({ nomCom: "dalle", reaction: "📡", categorie: "Ai" }, async (dest, hn, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;
  
    try {
      if (!arg || arg.length === 0) {
        return repondre(`Please enter the necessary information to generate the image.`);
      }
  
      // Regrouper les arguments en une seule chaîne séparée par "-"
      const image = arg.join(' ');
      const response = await axios.get(`http://api.maher-zubair.tech/ai/photoleap?q=${image}`);
      
      const data = response.data;
      let caption = '┃powered by ⬡〘𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4〙⬡┃';
      
      if (data.status == 200) {
        // Utiliser les données retournées par le service
        const imageUrl = data.result;
        hn.sendMessage(dest, { image: { url: imageUrl }, caption: caption }, { quoted: ms });
      } else {
        repondre("Error during image generation.");
      }
    } catch (error) {
      console.error('Erreur:', error.message || 'Une erreur s\'est produite');
      repondre("Oops, an error occurred while processing your request");
    }
  });
  
  hango({ nomCom: "gpt", reaction: "📡", categorie: "Ai" }, async (dest, hn, commandeOptions) => {
    const { repondre, arg, ms } = commandeOptions;
  
    try {
      if (!arg || arg.length === 0) {
        return repondre(`Please ask a question.`);
      }
  
      // Regrouper les arguments en une seule chaîne séparée par "-"
      const question = arg.join(' ');
      const response = await axios.get(`http://api.maher-zubair.tech/ai/chatgpt4?q=${question}`);
      
      const data = response.data;
      if (data) {
        repondre(data.result);
      } else {
        repondre("Error during response generation.");
      }
    } catch (error) {
      console.error('Erreur:', error.message || 'Une erreur s\'est produite');
      repondre("Oops, an error occurred while processing your request.");
    }
  });

hango(
  {
    nomCom: 'gpt4',
    reaction: '📡',
    alias: ['chatgpt4'],
    categorie: 'Ai'
  },
  
  async (dest, hn, commandeOptions) => {
    const {ms, arg, repondre} = commandeOptions;
    if (!arg[0]) 
     return await repondre('ask something');
    const msg = await hn.sendMessage(dest,{text: 'thinking......'},{quoted: ms});
    res = await ai(arg.join(' '));
    if (res.status === 200) {
      await hn.sendMessage(dest, {text: res.reply, edit: msg.key}, {quoted: ms});
      await react(dest, hn, ms, '🤖');
    } else {
      await hn.sendMessage(dest, {text: 'an error occred generating resopnce', edit: msg.key}, {quoted: ms});
      await react(dest, hn, ms, '⚠️');
    }
  }
  )

hango(
  {
    nomCom:"text2prompt",
    reaction:"📡",
    categorie:"Ai"
  },
  
  async (dest, hn, commandeOptions) => {
    const { ms, arg, repondre} = commandeOptions;
    
    if (!arg[0])
      return await repondre(`text argument is required \n> try ${conf.PREFIXE}text2prompt a sad cat`)
      
    const text = await traduire(arg.join(' '), { to: 'en'} );
    
    await text2prompt(text).then(sus).catch(err)
    
    function sus(res) {
      if(res.status)
        return repondre(res.prompt)
      else
        repondre('an error occoured genrating prompt')
    }
    function err(e){
      console.log(`an error occoured at :${e}`)
      return repondre('an error occoured genrating prompt')
    }
    
  }
);
