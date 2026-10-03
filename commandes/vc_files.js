const { hango } = require("../framework/hango");
const moment = require("moment-timezone");
const { getBuffer } = require("../framework/dl/Function");
const { default: axios } = require('axios');

const runtime = function (seconds) { 
 seconds = Number(seconds); 
 var d = Math.floor(seconds / (3600 * 24)); 
 var h = Math.floor((seconds % (3600 * 24)) / 3600); 
 var m = Math.floor((seconds % 3600) / 60); 
 var s = Math.floor(seconds % 60); 
 var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " d, ") : ""; 
 var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " h, ") : ""; 
 var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " m, ") : ""; 
 var sDisplay = s > 0 ? s + (s == 1 ? " second" : " s") : ""; 
 return dDisplay + hDisplay + mDisplay + sDisplay; 
 } 


hango({ nomCom: 'vcf5',
    desc: 'To check runtime',
    Categorie: 'General',
    reaction: '📄', 
    fromMe: 'true', 


  },
  async (dest, hn, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;

                 await repondre(`*_please wait..._*`) 

   


  }
);


hango({ nomCom: 'getallmembers',
    desc: 'To check runtime',
    Categorie: 'General',
    reaction: '♻️', 
    fromMe: 'true', 


  },
  async (dest, hn, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;

                 await repondre(`*_getting all members_*`) 

   


  }
);



hango({ nomCom: 'channel',
    desc: 'To check runtime',
    Categorie: 'My Contact',
    reaction: '✌️', 
    fromMe: 'true', 


  },
  async (dest, hn, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;

                 await repondre(`Support Here My Owner By Follow This Channel Please :https://github.com/Eliahhango/EliTechWiz-V4`) 

   


  }
);


hango({ nomCom: 'done',
    desc: 'To check runtime',
    Categorie: 'My Contact',
    reaction: '🤭', 
    fromMe: 'true', 


  },
  async (dest, hn, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;

                 await repondre(`*Tap Here To Join EliTechWiz-V4 Telegram Chatroom* https://github.com/Eliahhango/EliTechWiz-V4`) 

   


  }
);


hango({ nomCom: 'update',
    desc: 'To check runtime',
    Categorie: 'General',
    reaction: '⚙️', 
    fromMe: 'true', 


  },
  async (dest, hn, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;

                 await repondre(`*_EliTechWiz-V4 is running on its latest vision_*`) 

   


  }
);


hango({ nomCom: 'vision',
    desc: 'To check runtime',
    Categorie: 'General',
    reaction: '🔎', 
    fromMe: 'true', 


  },
  async (dest, hn, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;

                 await repondre(`*_EliTechWiz-V4 bot_*`) 

   


  }
);


  
hango({ nomCom: 'done',
    desc: 'To check runtime',
    Categorie: 'My Contact',
    reaction: '♻️', 
    fromMe: 'true', 


  },
  async (dest, hn, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;

                 await repondre(`*Tap To Join EliTechWiz Md WhatsApp Chartroom Group* https://github.com/Eliahhango/EliTechWiz-V4`) 

   


  }
)


hango({ nomCom: 'hack2',
    desc: 'To check runtime',
    Categorie: 'My Contact',
    reaction: '🐅', 
    fromMe: 'true', 


  },
  async (dest, hn, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;

                 await repondre(`Injecting Malware",
    " █ 10%",
    " █ █ 20%",
    " █ █ █ 30%",
    " █ █ █ █ 40%",
    " █ █ █ █ █ 50%",
    " █ █ █ █ █ █ 60%",
    " █ █ █ █ █ █ █ 70%",
    " █ █ █ █ █ █ █ █ 80%",
    " █ █ █ █ █ █ █ █ █ 90%",
    " █ █ █ █ █ █ █ █ █ █ 100%",
    "System hijacking on process..\nConnecting to Server error to find 404",
    "Device successfully connected...\nReceiving data...",
    "Data hijacked from device 100% completed\nKilling all evidence, killing all malwares...",
    "HACKING COMPLETED",
    "SENDING LOG DOCUMENTS...",
    "SUCCESSFULLY SENT DATA AND Connection disconnected",
    "BACKLOGS CLEARED",
    "POWERED BY EliTechWiz-V4 BOT",
    "By Mr EliTechWiz`) 

   


  }
)

