"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc); 
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const logger_1 = __importDefault(require("@whiskeysockets/baileys/lib/Utils/logger"));
const logger = logger_1.default.child({});
logger.level = 'silent';
const pino = require("pino");
const boom_1 = require("@hapi/boom");
const conf = require("./set");
const axios = require("axios");
let fs = require("fs-extra");
let path = require("path");
const FileType = require('file-type');
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
// Add atob function for Node.js environment
const atob = (data) => Buffer.from(data, 'base64').toString('binary');
//import chalk from 'chalk'
const { verifierEtatJid , recupererActionJid } = require("./ess/antilien");
const { atbverifierEtatJid , atbrecupererActionJid } = require("./ess/antibot");
let evt = require(__dirname + "/framework/hango");
const {isUserBanned , addUserToBanList , removeUserFromBanList} = require("./ess/banUser");
const  {addGroupToBanList,isGroupBanned,removeGroupFromBanList} = require("./ess/banGroup");
const {isGroupOnlyAdmin,addGroupToOnlyAdminList,removeGroupFromOnlyAdminList} = require("./ess/onlyAdmin");
//const //{loadCmd}=require("/framework/mesfonctions")
let { reagir } = require(__dirname + "/framework/app");
var session = conf.session.replace(/hango-MD-WHATSAPP-BOT;;;=>/g,"");
const prefixe = conf.PREFIXE;
const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

async function authentification() {
  try {
    if (!session || session === "hann" || session.length < 10) {
      console.log("Invalid session data. Please check your session configuration.");
      return false;
    }
    
    // Create auth directory if it doesn't exist
    if (!fs.existsSync(__dirname + "/auth")) {
      fs.mkdirSync(__dirname + "/auth", { recursive: true });
      console.log("Created auth directory");
    }
    
    if (!fs.existsSync(__dirname + "/auth/creds.json")) {
      console.log("Connection in progress...");
      try {
        await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
        console.log("Session credentials written successfully");
        return true;
      } catch (e) {
        console.error("Error decoding session data:", e);
        return false;
      }
    } else if (fs.existsSync(__dirname + "/auth/creds.json") && session !== "hann") {
      try {
        const decodedSession = atob(session);
        // Validate that the decoded session is valid JSON
        JSON.parse(decodedSession);
        await fs.writeFileSync(__dirname + "/auth/creds.json", decodedSession, "utf8");
        console.log("Session credentials updated successfully");
        return true;
      } catch (e) {
        console.error("Error updating session: Invalid session data format", e);
        return false;
      }
    }
    return true;
  } catch (e) {
    console.error("Session authentication error:", e);
    return false;
  }
}

// Execute authentication
const authSuccess = await authentification();
if (!authSuccess) {
  console.error("Authentication failed. Please check your session configuration.");
  process.exit(1);
}

const store = (0, baileys_1.makeInMemoryStore)({
    logger: pino().child({ level: "silent", stream: "store" }),
});
setTimeout(() => {
    async function main() {
        const { version, isLatest } = await (0, baileys_1.fetchLatestBaileysVersion)();
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(__dirname + "/auth");
        const sockOptions = {
            version,
            logger: pino({ level: "silent" }),
            browser: [' 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4', "safari", "1.0.0"],
            printQRInTerminal: true,
            fireInitQueries: false,
            shouldSyncHistoryMessage: true,
            downloadHistory: true,
            syncFullHistory: true,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: false,
            keepAliveIntervalMs: 30_000,
            /* auth: state*/ auth: {
                creds: state.creds,
                /** caching makes the store faster to send/recv messages */
                keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
            },
            //////////
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg.message || undefined;
                }
                return {
                    conversation: 'An Error Occurred, Repeat Command!'
                };
            }
            ///////
        };
        const hn = (0, baileys_1.default)(sockOptions);
        store.bind(hn.ev);
        
        

// Function to get the current date and time in Kenya
function getCurrentDateTime() {
    const options = {
        timeZone: 'Africa/Nairobi', // Kenya time zone
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24-hour format
    };
    const dateTime = new Intl.DateTimeFormat('en-KE', options).format(new Date());
    return dateTime;
}

// Import web interface
const { startWebServer } = require('./web/server');

// Initialize web interface with WhatsApp client
const webInterface = startWebServer(hn, store);

// Auto Bio Update Interval
setInterval(async () => {
    if (conf.AUTO_BIO === "yes") {
        const currentDateTime = getCurrentDateTime(); // Get the current date and time
        const bioText = `💫 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4 💫 is online.!\n${currentDateTime}`; // Format the bio text
        await hn.updateProfileStatus(bioText); // Update the bio
        console.log(`Updated Bio: ${bioText}`); // Log the updated bio
    }
}, 60000); // Update bio every 60 seconds

// Function to handle deleted messages
// Other functions (auto-react, anti-delete, etc.) as needed
        hn.ev.on("call", async (callData) => {
  if (conf.ANTICALL === 'no') {
    const callId = callData[0].id;
    const callerId = callData[0].from;

    await hn.rejectCall(callId, callerId);
    await hn.sendMessage(callerId, {
      text: "Am 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4,, My owner is unavailable try again later"
    });
  }
});
// Utility function for delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Track the last reaction time to prevent overflow
let lastReactionTime = 0;

// Auto-react to status updates, handling each status one-by-one without tracking
if (conf.AUTO_REACT_STATUS === "yes") {
    console.log("AUTO_REACT_STATUS is enabled. Listening for status updates...");

    hn.ev.on("messages.upsert", async (m) => {
        const { messages } = m;

        for (const message of messages) {
            // Check if the message is a status update
            if (message.key && message.key.remoteJid === "status@broadcast") {
                console.log("Detected status update from:", message.key.remoteJid);

                // Ensure throttling by checking the last reaction time
                const now = Date.now();
                if (now - lastReactionTime < 5000) {  // 5-second interval
                    console.log("Throttling reactions to prevent overflow.");
                    continue;
                }

                // Check if bot user ID is available
                const hango = hn.user && hn.user.id ? hn.user.id.split(":")[0] + "@s.whatsapp.net" : null;
                if (!hango) {
                    console.log("Bot's user ID not available. Skipping reaction.");
                    continue;
                }

                // React to the status with a green heart
                await hn.sendMessage(message.key.remoteJid, {
                    react: {
                        key: message.key,
                        text: "💙", // Reaction emoji
                    },
                }, {
                    statusJidList: [message.key.participant, hango],
                });

                // Log successful reaction and update the last reaction time
                lastReactionTime = Date.now();
                console.log(`Successfully reacted to status update by ${message.key.remoteJid}`);

                // Delay to avoid rapid reactions
                await delay(2000); // 2-second delay between reactions
            }
        }
    });
}
        hn.ev.on("messages.upsert", async (m) => {
            const { messages } = m;
            const ms = messages[0];
            if (!ms.message)
                return;
            const decodeJid = (jid) => {
                if (!jid)
                    return jid;
                if (/:\d+@/gi.test(jid)) {
                    let decode = (0, baileys_1.jidDecode)(jid) || {};
                    return decode.user && decode.server && decode.user + '@' + decode.server || jid;
                }
                else
                    return jid;
            };
            var mtype = (0, baileys_1.getContentType)(ms.message);
            var texte = mtype == "conversation" ? ms.message.conversation : mtype == "imageMessage" ? ms.message.imageMessage?.caption : mtype == "videoMessage" ? ms.message.videoMessage?.caption : mtype == "extendedTextMessage" ? ms.message?.extendedTextMessage?.text : mtype == "buttonsResponseMessage" ?
                ms?.message?.buttonsResponseMessage?.selectedButtonId : mtype == "listResponseMessage" ?
                ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId : mtype == "messageContextInfo" ?
                (ms?.message?.buttonsResponseMessage?.selectedButtonId || ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId || ms.text) : "";
            var origineMessage = ms.key.remoteJid;
            var idBot = decodeJid(hn.user.id);
            var servBot = idBot.split('@')[0];
            /* const dj='22559763447';
             const dj2='254751284190';
             const luffy='254762016957'*/
            /*  var superUser=[servBot,dj,dj2,luffy].map((s)=>s.replace(/[^0-9]/g)+"@s.whatsapp.net").includes(auteurMessage);
              var dev =[dj,dj2,luffy].map((t)=>t.replace(/[^0-9]/g)+"@s.whatsapp.net").includes(auteurMessage);*/
            const verifGroupe = origineMessage?.endsWith("@g.us");
            var infosGroupe = verifGroupe ? await hn.groupMetadata(origineMessage) : "";
            var nomGroupe = verifGroupe ? infosGroupe.subject : "";
            var msgRepondu = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
            var auteurMsgRepondu = decodeJid(ms.message?.extendedTextMessage?.contextInfo?.participant);
            //ms.message.extendedTextMessage?.contextInfo?.mentionedJid
            // ms.message.extendedTextMessage?.contextInfo?.quotedMessage.
            var mr = ms.Message?.extendedTextMessage?.contextInfo?.mentionedJid;
            var utilisateur = mr ? mr : msgRepondu ? auteurMsgRepondu : "";
            var auteurMessage = verifGroupe ? (ms.key.participant ? ms.key.participant : ms.participant) : origineMessage;
            if (ms.key.fromMe) {
                auteurMessage = idBot;
            }
            
            var membreGroupe = verifGroupe ? ms.key.participant : '';
            const { getAllSudoNumbers } = require("./ess/sudo");
            const nomAuteurMessage = ms.pushName;
            const dj = '255617834510';
            const dj2 = '255755566045';
            const dj3 = "255688164510";
            const luffy = '255617834510';
            const sudo = await getAllSudoNumbers();
            const superUserNumbers = [servBot, dj, dj2, dj3, luffy, conf.NUMERO_OWNER].map((s) => s.replace(/[^0-9]/g) + "@s.whatsapp.net");
            const allAllowedNumbers = superUserNumbers.concat(sudo);
            const superUser = allAllowedNumbers.includes(auteurMessage);
            
            var dev = [dj, dj2,dj3,luffy].map((t) => t.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(auteurMessage);
            function repondre(mes) { hn.sendMessage(origineMessage, { text: mes }, { quoted: ms }); }
            console.log("\t𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4");
            console.log("=========== written message===========");
            if (verifGroupe) {
                console.log("message provenant du groupe : " + nomGroupe);
            }
            console.log("message envoyé par : " + "[" + nomAuteurMessage + " : " + auteurMessage.split("@s.whatsapp.net")[0] + " ]");
            console.log("type de message : " + mtype);
            console.log("------ contenu du message ------");
            console.log(texte);
            /**  */
            function groupeAdmin(membreGroupe) {
                let admin = [];
                for (m of membreGroupe) {
                    if (m.admin == null)
                        continue;
                    admin.push(m.id);
                }
                // else{admin= false;}
                return admin;
            }

            var etat =conf.ETAT;
            if(etat==1)
            {await hn.sendPresenceUpdate("available",origineMessage);}
            else if(etat==2)
            {await hn.sendPresenceUpdate("composing",origineMessage);}
            else if(etat==3)
            {
            await hn.sendPresenceUpdate("recording",origineMessage);
            }
            else
            {
                await hn.sendPresenceUpdate("unavailable",origineMessage);
            }

            const mbre = verifGroupe ? await infosGroupe.participants : '';
            //  const verifAdmin = verifGroupe ? await mbre.filter(v => v.admin !== null).map(v => v.id) : ''
            let admins = verifGroupe ? groupeAdmin(mbre) : '';
            const verifAdmin = verifGroupe ? admins.includes(auteurMessage) : false;
            var verifhangoAdmin = verifGroupe ? admins.includes(idBot) : false;
            /** ** */
            /** ***** */
            const arg = texte ? texte.trim().split(/ +/).slice(1) : null;
            const verifCom = texte ? texte.startsWith(prefixe) : false;
            const com = verifCom ? texte.slice(1).trim().split(/ +/).shift().toLowerCase() : false;
           
         
            const lien = conf.URL.split(',')  

            
            // Utiliser une boucle for...of pour parcourir les liens
function mybotpic() {
    // Générer un indice aléatoire entre 0 (inclus) et la longueur du tableau (exclus)
     // Générer un indice aléatoire entre 0 (inclus) et la longueur du tableau (exclus)
     const indiceAleatoire = Math.floor(Math.random() * lien.length);
     // Récupérer le lien correspondant à l'indice aléatoire
     const lienAleatoire = lien[indiceAleatoire];
     return lienAleatoire;
  }
            var commandeOptions = {
                superUser, dev,
                verifGroupe,
                mbre,
                membreGroupe,
                verifAdmin,
                infosGroupe,
                nomGroupe,
                auteurMessage,
                nomAuteurMessage,
                idBot,
                verifhangoAdmin,
                prefixe,
                arg,
                repondre,
                mtype,
                groupeAdmin,
                msgRepondu,
                auteurMsgRepondu,
                ms,
                mybotpic
            
            };

            /************************ anti-delete-message */

            if(ms.message.protocolMessage && ms.message.protocolMessage.type === 0 && (conf.ADM).toLocaleLowerCase() === 'yes' ) {

                if(ms.key.fromMe || ms.message.protocolMessage.key.fromMe) { console.log('Message supprimer me concernant') ; return }
        
                                console.log(`Message supprimer`)
                                let key =  ms.message.protocolMessage.key ;
                                
        
                               try {
        
                                  let st = './store.json' ;
        
                                const data = fs.readFileSync(st, 'utf8');
        
                                const jsonData = JSON.parse(data);
        
                                    let message = jsonData.messages[key.remoteJid] ;
                                
                                    let msg ;
        
                                    for (let i = 0 ; i < message.length ; i++) {
        
                                        if (message[i].key.id === key.id) {
                                            
                                            msg = message[i] ;
        
                                            break 
                                        }
        
                                    } 
        
                                  //  console.log(msg)
        
                                    if(msg === null || !msg ||msg === 'undefined') {console.log('Message non trouver') ; return } 
        
                                await hn.sendMessage(idBot,{ image : { url : './media/deleted-message.jpg'},caption : `        *Deleted message detected*\n\n 🚮 Deleted by @${msg.key.participant.split('@')[0]}​` , mentions : [msg.key.participant]},)
                                .then( () => {
                                    hn.sendMessage(idBot,{forward : msg},{quoted : msg}) ;
                                })
                               
                              
        
                               } catch (e) {
                                    console.log(e)
                               }
                            }
        
            /** ****** gestion auto-status  */
            if (ms.key && ms.key.remoteJid === "status@broadcast" && conf.AUTO_READ_STATUS === "yes") {
                await hn.readMessages([ms.key]);
            }
            if (ms.key && ms.key.remoteJid === 'status@broadcast' && conf.AUTO_DOWNLOAD_STATUS === "yes") {
                /* await hn.readMessages([ms.key]);*/
                if (ms.message.extendedTextMessage) {
                    var stTxt = ms.message.extendedTextMessage.text;
                    await hn.sendMessage(idBot, { text: stTxt }, { quoted: ms });
                }
                else if (ms.message.imageMessage) {
                    var stMsg = ms.message.imageMessage.caption;
                    var stImg = await hn.downloadAndSaveMediaMessage(ms.message.imageMessage);
                    await hn.sendMessage(idBot, { image: { url: stImg }, caption: stMsg }, { quoted: ms });
                }
                else if (ms.message.videoMessage) {
                    var stMsg = ms.message.videoMessage.caption;
                    var stVideo = await hn.downloadAndSaveMediaMessage(ms.message.videoMessage);
                    await hn.sendMessage(idBot, {
                        video: { url: stVideo }, caption: stMsg
                    }, { quoted: ms });
                }
                /** *************** */
                // console.log("*nouveau status* ");
            }
            /** ******fin auto-status */
            if (!dev && origineMessage == "120363158701337904@g.us") {
                return;
            }
            
 //---------------------------------------rang-count--------------------------------
             if (texte && auteurMessage.endsWith("s.whatsapp.net")) {
  const { ajouterOuMettreAJourUserData } = require("./ess/level"); 
  try {
    await ajouterOuMettreAJourUserData(auteurMessage);
  } catch (e) {
    console.error(e);
  }
              }
            
                /////////////////////////////   Mentions /////////////////////////////////////////
         
              try {
        
                if (ms.message[mtype].contextInfo.mentionedJid && (ms.message[mtype].contextInfo.mentionedJid.includes(idBot) ||  ms.message[mtype].contextInfo.mentionedJid.includes(conf.NUMERO_OWNER + '@s.whatsapp.net'))    /*texte.includes(idBot.split('@')[0]) || texte.includes(conf.NUMERO_OWNER)*/) {
            
                    if (origineMessage == "120363158701337904@g.us") {
                        return;
                    } ;
            
                    if(superUser) {console.log('hummm') ; return ;} 
                    
                    let mbd = require('./ess/mention') ;
            
                    let alldata = await mbd.recupererToutesLesValeurs() ;
            
                        let data = alldata[0] ;
            
                    if ( data.status === 'non') { console.log('mention pas actifs') ; return ;}
            
                    let msg ;
            
                    if (data.type.toLocaleLowerCase() === 'image') {
            
                        msg = {
                                image : { url : data.url},
                                caption : data.message
                        }
                    } else if (data.type.toLocaleLowerCase() === 'video' ) {
            
                            msg = {
                                    video : {   url : data.url},
                                    caption : data.message
                            }
            
                    } else if (data.type.toLocaleLowerCase() === 'sticker') {
            
                        let stickerMess = new Sticker(data.url, {
                            pack: conf.NOM_OWNER,
                            type: StickerTypes.FULL,
                            categories: ["🤩", "🎉"],
                            id: "12345",
                            quality: 70,
                            background: "transparent",
                          });
            
                          const stickerBuffer2 = await stickerMess.toBuffer();
            
                          msg = {
                                sticker : stickerBuffer2 
                          }
            
                    }  else if (data.type.toLocaleLowerCase() === 'audio' ) {
            
                            msg = {
            
                                audio : { url : data.url } ,
                                mimetype:'audio/mp4',
                                 }
                        
                    }
            
                    hn.sendMessage(origineMessage,msg,{quoted : ms})
            
                }
            } catch (error) {
                
            } 


     //anti-lien
     try {
        const yes = await verifierEtatJid(origineMessage)
        if (texte.includes('https://') && verifGroupe &&  yes  ) {

         console.log("lien detecté")
            var verifZokAdmin = verifGroupe ? admins.includes(idBot) : false;
            
             if(superUser || verifAdmin || !verifZokAdmin  ) { console.log('je fais rien'); return};
                        
                                    const key = {
                                        remoteJid: origineMessage,
                                        fromMe: false,
                                        id: ms.key.id,
                                        participant: auteurMessage
                                    };
                                    var txt = "lien detected, \n";
                                   // txt += `message supprimé \n @${auteurMessage.split("@")[0]} rétiré du groupe.`;
                                    const gifLink = "https://raw.githubusercontent.com/Eliahhango/EliTechWiz-V4/main/media/remover.gif";
                                    var sticker = new Sticker(gifLink, {
                                        pack: 'EliTechWiz',
                                        author: conf.OWNER_NAME,
                                        type: StickerTypes.FULL,
                                        categories: ['🤩', '🎉'],
                                        id: '12345',
                                        quality: 50,
                                        background: '#000000'
                                    });
                                    await sticker.toFile("st1.webp");
                                    // var txt = `@${auteurMsgRepondu.split("@")[0]} a été rétiré du groupe..\n`
                                    var action = await recupererActionJid(origineMessage);

                                      if (action === 'remove') {

                                        txt += `message deleted \n @${auteurMessage.split("@")[0]} removed from group.`;

                                    await hn.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
                                    (0, baileys_1.delay)(800);
                                    await hn.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                                    try {
                                        await hn.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                                    }
                                    catch (e) {
                                        console.log("antiien ") + e;
                                    }
                                    await hn.sendMessage(origineMessage, { delete: key });
                                    await fs.unlink("st1.webp"); } 
                                        
                                       else if (action === 'delete') {
                                        txt += `message deleted \n @${auteurMessage.split("@")[0]} avoid sending link.`;
                                        // await hn.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") }, { quoted: ms });
                                       await hn.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
                                       await hn.sendMessage(origineMessage, { delete: key });
                                       await fs.unlink("st1.webp");

                                    } else if(action === 'warn') {
                                        const {getWarnCountByJID ,ajouterUtilisateurAvecWarnCount} = require('./ess/warn') ;

                                let warn = await getWarnCountByJID(auteurMessage) ; 
                                let warnlimit = conf.WARN_COUNT
                             if ( warn >= warnlimit) { 
                              var kikmsg = `link detected , you will be remove because of reaching warn-limit`;
                                
                                 await hn.sendMessage(origineMessage, { text: kikmsg , mentions: [auteurMessage] }, { quoted: ms }) ;


                                 await hn.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
                                 await hn.sendMessage(origineMessage, { delete: key });


                                } else {
                                    var rest = warnlimit - warn ;
                                  var  msg = `Link detected , your warn_count was upgrade ;\n rest : ${rest} `;

                                  await ajouterUtilisateurAvecWarnCount(auteurMessage)

                                  await hn.sendMessage(origineMessage, { text: msg , mentions: [auteurMessage] }, { quoted: ms }) ;
                                  await hn.sendMessage(origineMessage, { delete: key });

                                }
                                    }
                                }
                                
                            }
                        
                    
                
            
        
    
    catch (e) {
        console.log("ess err " + e);
    }
    


    /** *************************anti-bot******************************************** */
    try {
        const botMsg = ms.key?.id?.startsWith('BAES') && ms.key?.id?.length === 16;
        const baileysMsg = ms.key?.id?.startsWith('BAE5') && ms.key?.id?.length === 16;
        if (botMsg || baileysMsg) {

            if (mtype === 'reactionMessage') { console.log('Je ne reagis pas au reactions') ; return} ;
            const antibotactiver = await atbverifierEtatJid(origineMessage);
            if(!antibotactiver) {return};

            if( verifAdmin || auteurMessage === idBot  ) { console.log('je fais rien'); return};
                        
            const key = {
                remoteJid: origineMessage,
                fromMe: false,
                id: ms.key.id,
                participant: auteurMessage
            };
            var txt = "bot detected, \n";
           // txt += `message supprimé \n @${auteurMessage.split("@")[0]} rétiré du groupe.`;
            const gifLink = "https://raw.githubusercontent.com/Eliahhango/EliTechWiz-V4/main/media/remover.gif";
            var sticker = new Sticker(gifLink, {
                pack: 'Zoou-Md',
                author: conf.OWNER_NAME,
                type: StickerTypes.FULL,
                categories: ['🤩', '🎉'],
                id: '12345',
                quality: 50,
                background: '#000000'
            });
            await sticker.toFile("st1.webp");
            // var txt = `@${auteurMsgRepondu.split("@")[0]} a été rétiré du groupe..\n`
            var action = await atbrecupererActionJid(origineMessage);

              if (action === 'remove') {

                txt += `message deleted \n @${auteurMessage.split("@")[0]} removed from group.`;

            await hn.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") });
            (0, baileys_1.delay)(800);
            await hn.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
            try {
                await hn.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
            }
            catch (e) {
                console.log("antibot ") + e;
            }
            await hn.sendMessage(origineMessage, { delete: key });
            await fs.unlink("st1.webp"); } 
                
               else if (action === 'delete') {
                txt += `message delete \n @${auteurMessage.split("@")[0]} Avoid sending link.`;
                //await hn.sendMessage(origineMessage, { sticker: fs.readFileSync("st1.webp") }, { quoted: ms });
               await hn.sendMessage(origineMessage, { text: txt, mentions: [auteurMessage] }, { quoted: ms });
               await hn.sendMessage(origineMessage, { delete: key });
               await fs.unlink("st1.webp");

            } else if(action === 'warn') {
                const {getWarnCountByJID ,ajouterUtilisateurAvecWarnCount} = require('./ess/warn') ;

let warn = await getWarnCountByJID(auteurMessage) ; 
let warnlimit = conf.WARN_COUNT
if ( warn >= warnlimit) { 
 var kikmsg = `bot detected ;you will be remove because of reaching warn-limit`;
    
     await hn.sendMessage(origineMessage, { text: kikmsg , mentions: [auteurMessage] }, { quoted: ms }) ;


     await hn.groupParticipantsUpdate(origineMessage, [auteurMessage], "remove");
     await hn.sendMessage(origineMessage, { delete: key });


} else {
    var rest = warnlimit - warn ;
  var  msg = `bot detected , your warn_count was upgrade ;\n rest : ${rest} `;

  await ajouterUtilisateurAvecWarnCount(auteurMessage)

  await hn.sendMessage(origineMessage, { text: msg , mentions: [auteurMessage] }, { quoted: ms }) ;
  await hn.sendMessage(origineMessage, { delete: key });

}
            }
        }
    }
    catch (er) {
        console.log('.... ' + er);
    }        
             
         
            /////////////////////////
            
            //execution des commandes   
            if (verifCom) {
                //await await hn.readMessages(ms.key);
                const cd = evt.cm.find((hango) => hango.nomCom === (com));
                if (cd) {
                    try {

            if ((conf.MODE).toLocaleLowerCase() != 'yes' && !superUser) {
                return;
            }

                         /******************* PM_PERMT***************/

            if (!superUser && origineMessage === auteurMessage&& conf.PM_PERMIT === "yes" ) {
                repondre("You don't have acces to commands here") ; return }
            ///////////////////////////////

             
            /*****************************banGroup  */
            if (!superUser && verifGroupe) {

                 let req = await isGroupBanned(origineMessage);
                    
                        if (req) { return }
            }

              /***************************  ONLY-ADMIN  */

            if(!verifAdmin && verifGroupe) {
                 let req = await isGroupOnlyAdmin(origineMessage);
                    
                        if (req) {  return }}

              /**********************banuser */
         
            
                if(!superUser) {
                    let req = await isUserBanned(auteurMessage);
                    
                        if (req) {repondre("You are banned from bot commands"); return}
                    

                } 

                        reagir(origineMessage, hn, ms, cd.reaction);
                        cd.fonction(origineMessage, hn, commandeOptions);
                    }
                    catch (e) {
                        console.log("😡😡 " + e);
                        hn.sendMessage(origineMessage, { text: "😡😡 " + e }, { quoted: ms });
                    }
                }
            }
            //fin exécution commandes
        });
        //fin événement message

/******** evenement groupe update ****************/
const { recupevents } = require('./ess/welcome'); 

hn.ev.on('group-participants.update', async (group) => {
    console.log(group);

    let ppgroup;
    try {
        ppgroup = await hn.profilePictureUrl(group.id, 'image');
    } catch {
        ppgroup = '';
    }

    try {
        const metadata = await hn.groupMetadata(group.id);

        if (group.action == 'add' && (await recupevents(group.id, "welcome") == 'on')) {
            let msg = `*ELITECHWIZ-BOT MD WELCOME MESSAGE*`;
            let membres = group.participants;
            for (let membre of membres) {
                msg += ` \n❒ *Hey* 🖐️ @${membre.split("@")[0]} WELCOME TO OUR GROUP. \n\n`;
            }

            msg += `❒ *READ THE GROUP DESCRIPTION TO AVOID GETTING REMOVED* `;

            hn.sendMessage(group.id, { image: { url: ppgroup }, caption: msg, mentions: membres });
        } else if (group.action == 'remove' && (await recupevents(group.id, "goodbye") == 'on')) {
            let msg = `one or somes member(s) left group;\n`;

            let membres = group.participants;
            for (let membre of membres) {
                msg += `@${membre.split("@")[0]}\n`;
            }

            hn.sendMessage(group.id, { text: msg, mentions: membres });

        } else if (group.action == 'promote' && (await recupevents(group.id, "antipromote") == 'on') ) {
            //  console.log(hn.user.id)
          if (group.author == metadata.owner || group.author  == conf.NUMERO_OWNER + '@s.whatsapp.net' || group.author == decodeJid(hn.user.id)  || group.author == group.participants[0]) { console.log('Cas de superUser je fais rien') ;return ;} ;


         await   hn.groupParticipantsUpdate(group.id ,[group.author,group.participants[0]],"demote") ;

         hn.sendMessage(
              group.id,
              {
                text : `@${(group.author).split("@")[0]} has violated the anti-promotion rule, therefore both ${group.author.split("@")[0]} and @${(group.participants[0]).split("@")[0]} have been removed from administrative rights.`,
                mentions : [group.author,group.participants[0]]
              }
         )

        } else if (group.action == 'demote' && (await recupevents(group.id, "antidemote") == 'on') ) {

            if (group.author == metadata.owner || group.author ==  conf.NUMERO_OWNER + '@s.whatsapp.net' || group.author == decodeJid(hn.user.id) || group.author == group.participants[0]) { console.log('Cas de superUser je fais rien') ;return ;} ;


           await  hn.groupParticipantsUpdate(group.id ,[group.author],"demote") ;
           await hn.groupParticipantsUpdate(group.id , [group.participants[0]] , "promote")

           hn.sendMessage(
                group.id,
                {
                  text : `@${(group.author).split("@")[0]} has violated the anti-demotion rule by removing @${(group.participants[0]).split("@")[0]}. Consequently, he has been stripped of administrative rights.` ,
                  mentions : [group.author,group.participants[0]]
                }
           )

     } 

    } catch (e) {
        console.error(e);
    }
});

/******** fin d'evenement groupe update *************************/



    /*****************************Cron setup */

        
    async  function activateCrons() {
        const cron = require('node-cron');
        const { getCron } = require('./ess/cron');

          let crons = await getCron();
          console.log(crons);
          if (crons.length > 0) {
        
            for (let i = 0; i < crons.length; i++) {
        
              if (crons[i].mute_at != null) {
                let set = crons[i].mute_at.split(':');

                console.log(`etablissement d'un automute pour ${crons[i].group_id} a ${set[0]} H ${set[1]}`)

                cron.schedule(`${set[1]} ${set[0]} * * *`, async () => {
                  await hn.groupSettingUpdate(crons[i].group_id, 'announcement');
                  hn.sendMessage(crons[i].group_id, { image : { url : './media/chrono.webp'} , caption: "Hello, it's time to close the group; sayonara." });

                }, {
                    timezone: "Africa/Nairobi"
                  });
              }
        
              if (crons[i].unmute_at != null) {
                let set = crons[i].unmute_at.split(':');

                console.log(`etablissement d'un autounmute pour ${set[0]} H ${set[1]} `)
        
                cron.schedule(`${set[1]} ${set[0]} * * *`, async () => {

                  await hn.groupSettingUpdate(crons[i].group_id, 'not_announcement');

                  hn.sendMessage(crons[i].group_id, { image : { url : './media/chrono.webp'} , caption: "Good morning; It's time to open the group." });

                 
                },{
                    timezone: "Africa/Nairobi"
                  });
              }
        
            }
          } else {
            console.log('Les crons n\'ont pas été activés');
          }

          return
        }

        
        //événement contact
        hn.ev.on("contacts.upsert", async (contacts) => {
            const insertContact = (newContact) => {
                for (const contact of newContact) {
                    if (store.contacts[contact.id]) {
                        Object.assign(store.contacts[contact.id], contact);
                    }
                    else {
                        store.contacts[contact.id] = contact;
                    }
                }
                return;
            };
            insertContact(contacts);
        });
        //fin événement contact 
        //événement connexion
        hn.ev.on("connection.update", async (con) => {
            const { lastDisconnect, connection } = con;
            if (connection === "connecting") {
                console.log("ℹ️ 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4 is connecting...");
            }
            else if (connection === 'open') {
                console.log("✅ 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4 Connected to WhatsApp! ☺️");
                console.log("--");
                await (0, baileys_1.delay)(200);
                console.log("------");
                await (0, baileys_1.delay)(300);
                console.log("------------------/-----");
                console.log("𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4 is Online 🕸\n\n");
                //chargement des commandes 
                console.log("Loading 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4 Commands ...\n");
                fs.readdirSync(__dirname + "/commandes").forEach((fichier) => {
                    if (path.extname(fichier).toLowerCase() == (".js")) {
                        try {
                            require(__dirname + "/commandes/" + fichier);
                            console.log(fichier + " Installed Successfully✔️");
                        }
                        catch (e) {
                            console.log(`${fichier} could not be installed due to : ${e}`);
                        } /* require(__dirname + "/beltah/" + fichier);
                         console.log(fichier + " Installed ✔️")*/
                        (0, baileys_1.delay)(300);
                    }
                });
                (0, baileys_1.delay)(700);
                var md;
                if ((conf.MODE).toLocaleLowerCase() === "yes") {
                    md = "public";
                }
                else if ((conf.MODE).toLocaleLowerCase() === "no") {
                    md = "private";
                }
                else {
                    md = "undefined";
                }
                console.log("Commands Installation Completed ✅");

                await activateCrons();
                
                if((conf.DP).toLowerCase() === 'yes') {     

                let cmsg =` ⁠⁠⁠⁠
╭━━━━━━━━━━━━━━━━━━━━╮
┃    *𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4*    
┃   System: Online ✨   
╰━━━━━━━━━━━━━━━━━━━━╯
┃
┃ ⚡ *Bot Details*
┃ ╭────────────────
┃ │ 🎯 Prefix: [ ${prefixe} ]
┃ │ 🌟 Mode: ${md}
┃ │ 📱 Version: 4.0.0
┃ ╰────────────────
┃
┃ 📢 *Updates Channel*
┃ ╭────────────────
┃ │ https://whatsapp.com/
┃ │ channel/0029VaeEYF0B
┃ │ vvsZpaTPfL2s
┃ ╰────────────────
╰━━━━━━━━━━━━━━━━━━━━╯

   _Powered by EliTechWiz_
                 `;
                    
                await hn.sendMessage(hn.user.id, { text: cmsg });
                }
            }
            else if (connection == "close") {
                let raisonDeconnexion = new boom_1.Boom(lastDisconnect?.error)?.output.statusCode;
                if (raisonDeconnexion === baileys_1.DisconnectReason.badSession) {
                    console.log('Session id error, rescan again...');
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionClosed) {
                    console.log('!!! connexion fermée, reconnexion en cours ...');
                    main();
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionLost) {
                    console.log('connection error 😞 ,,, trying to reconnect... ');
                    main();
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason?.connectionReplaced) {
                    console.log('connexion réplacée ,,, une sesssion est déjà ouverte veuillez la fermer svp !!!');
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.loggedOut) {
                    console.log('vous êtes déconnecté,,, veuillez rescanner le code qr svp');
                }
                else if (raisonDeconnexion === baileys_1.DisconnectReason.restartRequired) {
                    console.log('redémarrage en cours ▶️');
                    main();
                }   else {

                    console.log('redemarrage sur le coup de l\'erreur  ',raisonDeconnexion) ;         
                    //repondre("* Redémarrage du bot en cour ...*");

                                const {exec}=require("child_process") ;

                                console.log(chalk.green('Restart initiated...'));
                                // Add proper error handling for the exec command
                                exec("pm2 restart all", (error, stdout, stderr) => {
                                  if (error) {
                                    console.error(chalk.red('Error during restart:'), error);
                                    return;
                                  }
                                  if (stderr) {
                                    console.warn(chalk.yellow('Restart warning:'), stderr);
                                  }
                                  console.log(chalk.green('Restart successful:'), stdout);
                                });
                }
                // sleep(50000)
                console.log("hum " + connection);
                main(); //console.log(session)
            }
        });
        //fin événement connexion
        //événement authentification 
        hn.ev.on("creds.update", saveCreds);
        //fin événement authentification 
        //
        /** ************* */
        //fonctions utiles
        hn.downloadAndSaveMediaMessage = async (message, filename = '', attachExtension = true) => {
            let quoted = message.msg ? message.msg : message;
            let mime = (message.msg || message).mimetype || '';
            let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
            const stream = await (0, baileys_1.downloadContentFromMessage)(quoted, messageType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            let type = await FileType.fromBuffer(buffer);
            let trueFileName = './' + filename + '.' + type.ext;
            // save to file
            await fs.writeFileSync(trueFileName, buffer);
            return trueFileName;
        };


        hn.awaitForMessage = async (options = {}) =>{
            return new Promise((resolve, reject) => {
                if (typeof options !== 'object') reject(new Error('Options must be an object'));
                if (typeof options.sender !== 'string') reject(new Error('Sender must be a string'));
                if (typeof options.chatJid !== 'string') reject(new Error('ChatJid must be a string'));
                if (options.timeout && typeof options.timeout !== 'number') reject(new Error('Timeout must be a number'));
                if (options.filter && typeof options.filter !== 'function') reject(new Error('Filter must be a function'));
        
                const timeout = options?.timeout || undefined;
                const filter = options?.filter || (() => true);
                let interval = undefined
        
                /**
                 * 
                 * @param {{messages: Baileys.proto.IWebMessageInfo[], type: Baileys.MessageUpsertType}} data 
                 */
                let listener = (data) => {
                    let { type, messages } = data;
                    if (type == "notify") {
                        for (let message of messages) {
                            const fromMe = message.key.fromMe;
                            const chatId = message.key.remoteJid;
                            const isGroup = chatId.endsWith('@g.us');
                            const isStatus = chatId == 'status@broadcast';
        
                            const sender = fromMe ? hn.user.id.replace(/:.*@/g, '@') : (isGroup || isStatus) ? message.key.participant.replace(/:.*@/g, '@') : chatId;
                            if (sender == options.sender && chatId == options.chatJid && filter(message)) {
                                hn.ev.off('messages.upsert', listener);
                                clearTimeout(interval);
                                resolve(message);
                            }
                        }
                    }
                }
                hn.ev.on('messages.upsert', listener);
                if (timeout) {
                    interval = setTimeout(() => {
                        hn.ev.off('messages.upsert', listener);
                        reject(new Error('Timeout'));
                    }, timeout);
                }
            });
        }



        // fin fonctions utiles
        /** ************* */
        return hn;
    }
    let fichier = require.resolve(__filename);
    fs.watchFile(fichier, () => {
        fs.unwatchFile(fichier);
        console.log(`mise à jour ${__filename}`);
        delete require.cache[fichier];
        require(fichier);
    });
    main();
}, 5000);
