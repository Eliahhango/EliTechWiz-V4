const {hango} = require("../framework/hango");
const conf = require("../set")
const {jidDecode}=require("@whiskeysockets/baileys")


hango( {
  nomCom : "profile",
 categorie : "Fun",
   },
      async(dest,hn, commandeOptions)=> {

        const {ms , arg, repondre,auteurMessage,nomAuteurMessage, msgRepondu , auteurMsgRepondu} = commandeOptions ;
        let jid = null 
          let nom = null ;

          



        if (!msgRepondu) {
            jid = auteurMessage;
           nom = nomAuteurMessage;

           try { ppUrl = await hn.profilePictureUrl(jid , 'image') ; } catch { ppUrl = conf.IMAGE_MENU};
          const status = await hn.fetchStatus(jid) ;

           mess = {
            image : { url : ppUrl },
            caption : '*Nom :* '+ nom + '\n*Status :*\n' + status.status
        }
          
        } else {
            jid = auteurMsgRepondu;
            nom ="@"+auteurMsgRepondu.split("@")[0] ;

            try { ppUrl = await hn.profilePictureUrl(jid , 'image') ; } catch { ppUrl = conf.IMAGE_MENU};
          const status = await hn.fetchStatus(jid) ;

             mess = {
              image : { url : ppUrl },
              caption : '*Name :* '+ nom + '\n*Status :*\n' + status.status,
               mentions:[auteurMsgRepondu]
          }
            
        } ;

     
      
      
         
            hn.sendMessage(dest,mess,{quoted : ms})
      });
