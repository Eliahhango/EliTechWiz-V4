const axios = require("axios");
const {hango} = require("../framework/hango");
const traduire = require("../framework/traduction");
const {Sticker ,StickerTypes}= require('wa-sticker-formatter');

hango({
  nomCom: "ranime",
  categorie: "Fun",
  reaction: "📺"
},
async (origineMessage, hn, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  const jsonURL = "https://api.jikan.moe/v4/random/anime"; // Remplacez par votre URL JSON

  try {
    const response = await axios.get(jsonURL);
    const data = response.data.data;

    const title = data.title;
    const synopsis = data.synopsis;
    const imageUrl = data.images.jpg.image_url; // Utilisez l'URL de l'image JPG
    const episodes = data.episodes;
    const status = data.status;

    //const texttraduit = await traduire(synopsis,{ to: 'fr' })

    const message = `📺 Titre: ${title}\n🎬 Épisodes: ${episodes}\n📡 Statut: ${status}\n📝 Synopsis: ${synopsis}\n🔗 URL: ${data.url}`;
    
    // Envoyer l'image et les informations
    hn.sendMessage(origineMessage, { image: { url: imageUrl }, caption: message }, { quoted: ms });
  } catch (error) {
    console.error('Error retrieving data from JSON :', error);
    repondre('Error retrieving data from JSON.');
  }
});

hango({
  nomCom: "google",
  categorie: "Search",
  reaction: "🔍"
}, async (dest, hn, commandeOptions) => {
  const { arg, repondre } = commandeOptions;
  
  if (!arg || arg.length === 0) {
    repondre("Please provide a search query.\n*Example: .google What is a bot*");
    return;
  }

  try {
    const googleIt = require('google-it');
    const searchQuery = arg.join(" ");
    
    const results = await googleIt({
      query: searchQuery,
      limit: 8,  // Limit to 8 results for better readability
      disableConsole: true // Prevent console logs
    });

    if (!results || results.length === 0) {
      repondre("No results found for your search query.");
      return;
    }

    let msg = `🔍 *Google Search Results*\n\n`;
    msg += `*Query:* ${searchQuery}\n\n`;

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      msg += `*${i + 1}. ${result.title}*\n`;
      msg += `${result.snippet}\n`;
      msg += `🔗 ${result.link}\n\n`;
    }
    
    repondre(msg);
  } catch (error) {
    console.error('Google search error:', error);
    repondre("❌ An error occurred during the Google search. Please make sure the query is valid and try again.");
  }
});
hango({
  nomCom: "imdb",
  categorie: "Search"
}, async (dest, hn, commandeOptions) => {
  const { arg, repondre , ms } = commandeOptions;

  if (!arg[0] || arg === "") {
    repondre("give the name of a series or film.");
    return;
  }

  try {
    
    const response = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${arg}&plot=full`);
    const imdbData = response.data;

    let imdbInfo = "⚍⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚍\n";
    imdbInfo += " ``` 𝕀𝕄𝔻𝔹 𝕊𝔼𝔸ℝℂℍ```\n";
    imdbInfo += "⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎\n";
    imdbInfo += "🎬Title    : " + imdbData.Title + "\n";
    imdbInfo += "📅year      : " + imdbData.Year + "\n";
    imdbInfo += "⭐Assessment : " + imdbData.Rated + "\n";
    imdbInfo += "📆Release    : " + imdbData.Released + "\n";
    imdbInfo += "⏳Runtime     : " + imdbData.Runtime + "\n";
    imdbInfo += "🌀Genre      : " + imdbData.Genre + "\n";
    imdbInfo += "👨🏻‍💻Director : " + imdbData.Director + "\n";
    imdbInfo += "✍writers : " + imdbData.Writer + "\n";
    imdbInfo += "👨actors  : " + imdbData.Actors + "\n";
    imdbInfo += "📃Synopsis  : " + imdbData.Plot + "\n";
    imdbInfo += "🌐Language  : " + imdbData.Language + "\n";
    imdbInfo += "🌍Contry      : " + imdbData.Country + "\n";
    imdbInfo += "🎖️Awards : " + imdbData.Awards + "\n";
    imdbInfo += "📦BoxOffice : " + imdbData.BoxOffice + "\n";
    imdbInfo += "🏙️Production : " + imdbData.Production + "\n";
    imdbInfo += "🌟score : " + imdbData.imdbRating + "\n";
    imdbInfo += "❎imdbVotes : " + imdbData.imdbVotes + "";

    hn.sendMessage(dest, {
      image: {
        url: imdbData.Poster,
      },
      caption: imdbInfo,
    }, {
      quoted: ms,
    });
  } catch (error) {
    repondre("An error occurred while searching IMDb.");
  }
});

hango({
  nomCom: "movie",
  categorie: "Search"
}, async (dest, hn, commandeOptions) => {
  const { arg, repondre , ms } = commandeOptions;

  if (!arg[0] || arg === "") {
    repondre("give the name of a series or film.");
    return;
  }

  try {
    
    const response = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${arg}&plot=full`);
    const imdbData = response.data;

    let imdbInfo = "Tap on the link to join movie channel on telegram and download movies there : https://t.me/eliahtechai\n";
    imdbInfo += " ``` 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4 FILMS```\n";
    imdbInfo += "*Made by Eliah Hango*\n";
    imdbInfo += "🎬Title    : " + imdbData.Title + "\n";
    imdbInfo += "📅year      : " + imdbData.Year + "\n";
    imdbInfo += "⭐Assessment : " + imdbData.Rated + "\n";
    imdbInfo += "📆Release    : " + imdbData.Released + "\n";
    imdbInfo += "⏳Runtime     : " + imdbData.Runtime + "\n";
    imdbInfo += "🌀Genre      : " + imdbData.Genre + "\n";
    imdbInfo += "👨🏻‍💻Director : " + imdbData.Director + "\n";
    imdbInfo += "✍writers : " + imdbData.Writer + "\n";
    imdbInfo += "👨actors  : " + imdbData.Actors + "\n";
    imdbInfo += "📃Synopsis  : " + imdbData.Plot + "\n";
    imdbInfo += "🌐Language  : " + imdbData.Language + "\n";
    imdbInfo += "🌍Contry      : " + imdbData.Country + "\n";
    imdbInfo += "🎖️Awards : " + imdbData.Awards + "\n";
    imdbInfo += "📦BoxOffice : " + imdbData.BoxOffice + "\n";
    imdbInfo += "🏙️Production : " + imdbData.Production + "\n";
    imdbInfo += "🌟score : " + imdbData.imdbRating + "\n";
    imdbInfo += "❎imdbVotes : " + imdbData.imdbVotes + "";

    hn.sendMessage(dest, {
      image: {
        url: imdbData.Poster,
      },
      caption: imdbInfo,
    }, {
      quoted: ms,
    });
  } catch (error) {
    repondre("An error occurred while searching IMDb.");
  }
});

hango({
  nomCom: "emomix",
  categorie: "Conversion"
}, async (dest, hn, commandeOptions) => {
  const { arg, repondre,ms , nomAuteurMessage } = commandeOptions;

  if (!arg[0] || arg.length !== 1) {
    repondre("Incorrect use. Example: .emojimix 😀;🥰");
    return;
  }

  // Divisez la chaîne en deux emojis en utilisant le point-virgule comme séparateur
  const emojis = arg.join(' ').split(';');

  if (emojis.length !== 2) {
    repondre("Please specify two emojis using a ';' as a separator.");
    return;
  }

  const emoji1 = emojis[0].trim();
  const emoji2 = emojis[1].trim();

  try {
    const axios = require('axios');
    const response = await axios.get(`https://levanter.onrender.com/emix?q=${emoji1}${emoji2}`);

    if (response.data.status === true) {
      // Si la requête a réussi, envoyez l'image résultante
      
      let stickerMess = new Sticker(response.data.result, {
        pack: nomAuteurMessage,
        type: StickerTypes.CROPPED,
        categories: ["🤩", "🎉"],
        id: "12345",
        quality: 70,
        background: "transparent",
      });
      const stickerBuffer2 = await stickerMess.toBuffer();
      hn.sendMessage(dest, { sticker: stickerBuffer2 }, { quoted: ms });

    } else {
      repondre("Unable to create emoji mix.");
    }
  } catch (error) {
    repondre("An error occurred while creating the emoji mix." + error );
  }
});

// Map to store anti-sticker settings
const antiStickerEnabled = new Map();

// Maps to store anti-spam settings and user message history
const antiSpamEnabled = new Map();
const userMessageHistory = new Map();
const userWarnings = new Map();

hango({
  nomCom: "antispam",
  categorie: "Group",
  reaction: "🛡️"
}, async (dest, hn, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  // Check if the command is used in a group
  if (!dest.endsWith('@g.us')) {
    repondre("❌ This command can only be used in groups.");
    return;
  }

  // Check if user is admin
  const groupAdmins = await hn.groupAdmin(dest);
  const sender = ms.key.participant || ms.key.remoteJid;
  
  if (!groupAdmins.includes(sender)) {
    repondre("❌ This command can only be used by group admins.");
    return;
  }

  if (!arg[0]) {
    repondre("Please specify 'on' or 'off' to enable/disable anti-spam feature.");
    return;
  }

  const action = arg[0].toLowerCase();
  const chatId = dest;

  if (action === 'on') {
    antiSpamEnabled.set(chatId, true);
    // Clear any existing history when enabling
    clearGroupSpamHistory(chatId);
    repondre("✅ Anti-spam feature has been enabled. Repeated messages will be detected and action will be taken.");
  } else if (action === 'off') {
    antiSpamEnabled.delete(chatId);
    // Clear all spam history for this group
    clearGroupSpamHistory(chatId);
    repondre("❌ Anti-spam feature has been disabled.");
  } else {
    repondre("Invalid option. Please use 'on' or 'off'.");
  }
});

// Function to clear spam history for a group
function clearGroupSpamHistory(groupId) {
  // Clear message history
  for (const [key, value] of userMessageHistory.entries()) {
    if (key.startsWith(groupId)) {
      userMessageHistory.delete(key);
    }
  }
  // Clear warning history
  for (const [key, value] of userWarnings.entries()) {
    if (key.startsWith(groupId)) {
      userWarnings.delete(key);
    }
  }
}

// Function to get user key
function getUserKey(groupId, userId) {
  return `${groupId}:${userId}`;
}

// Message handler for detecting spam
hn.ev.on('messages.upsert', async ({ messages }) => {
  for (const message of messages) {
    const chatId = message.key.remoteJid;
    
    // Check if this is a group and anti-spam is enabled
    if (chatId?.endsWith('@g.us') && antiSpamEnabled.has(chatId)) {
      const sender = message.key.participant || message.key.remoteJid;
      const messageContent = message.message?.conversation || 
                           message.message?.extendedTextMessage?.text ||
                           message.message?.imageMessage?.caption ||
                           'multimedia_message'; // For non-text messages
      
      if (!messageContent) continue;

      const userKey = getUserKey(chatId, sender);
      
      // Get or initialize user's message history
      if (!userMessageHistory.has(userKey)) {
        userMessageHistory.set(userKey, {
          lastMessage: messageContent,
          count: 1,
          timestamp: Date.now(),
          messages: [message.key]
        });
      } else {
        const history = userMessageHistory.get(userKey);
        
        // Reset count if it's been more than 30 seconds since last message
        if (Date.now() - history.timestamp > 30000) {
          history.count = 1;
          history.messages = [message.key];
        } else if (history.lastMessage === messageContent) {
          // Increment count for same message
          history.count++;
          history.messages.push(message.key);
        } else {
          // Different message, reset count
          history.count = 1;
          history.messages = [message.key];
        }
        
        history.lastMessage = messageContent;
        history.timestamp = Date.now();
        
        // Check if spam threshold is reached (4 or more same messages)
        if (history.count >= 4) {
          try {
            // Delete all spam messages
            for (const msgKey of history.messages) {
              await hn.sendMessage(chatId, { delete: msgKey });
            }
            
            // Get or initialize warning count
            const warnings = userWarnings.get(userKey) || 0;
            userWarnings.set(userKey, warnings + 1);
            
            const senderName = '@' + sender.split('@')[0];
            
            if (warnings >= 1) {
              // Second offense: Remove user from group
              await hn.groupParticipantsUpdate(chatId, [sender], "remove");
              
              await hn.sendMessage(chatId, {
                text: `🛡️ *Anti-Spam Protection*\n\n• User: ${senderName}\n• Action: Removed from group\n• Reason: Multiple spam violations\n\n_Spamming is not allowed in this group._`,
                mentions: [sender]
              });
            } else {
              // First offense: Warning
              await hn.sendMessage(chatId, {
                text: `⚠️ *Anti-Spam Warning*\n\n• User: ${senderName}\n• Action: Messages Deleted\n• Warning: ${warnings + 1}/2\n\n_Continuing to spam will result in removal from the group._`,
                mentions: [sender]
              });
            }
            
            // Reset message history
            history.count = 0;
            history.messages = [];
            
          } catch (error) {
            console.error('Error handling spam:', error);
          }
        }
      }
    }
  }
});

// Map to store welcome settings
const welcomeEnabled = new Map();

// Array of welcome quotes
const welcomeQuotes = [
  "Every new friend is a new adventure... Welcome to our family! 🌟",
  "A warm welcome to you! May you feel at home and make wonderful memories here. 🏡",
  "Welcome aboard! We're excited to have you join our amazing community. 🚀",
  "A new member means new ideas and new energy! Welcome to the group! ✨",
  "Welcome! Your presence makes our group even more special. 🌈",
  "Glad to have you here! Let's create awesome moments together. 🎉",
  "Welcome to our wonderful community! We hope you'll enjoy your stay. 🌺",
  "A new star has joined our galaxy! Welcome and shine bright! ⭐",
  "Welcome! We're happy you're here to share this journey with us. 🌅",
  "A warm welcome and lots of good wishes on becoming part of our group. 🎊"
];

hango({
  nomCom: "welcome",
  categorie: "Group",
  reaction: "👋"
}, async (dest, hn, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  // Check if the command is used in a group
  if (!dest.endsWith('@g.us')) {
    repondre("❌ This command can only be used in groups.");
    return;
  }

  // Check if user is admin
  const groupAdmins = await hn.groupAdmin(dest);
  const sender = ms.key.participant || ms.key.remoteJid;
  
  if (!groupAdmins.includes(sender)) {
    repondre("❌ This command can only be used by group admins.");
    return;
  }

  if (!arg[0]) {
    repondre("Please specify 'on' or 'off' to enable/disable welcome messages.");
    return;
  }

  const action = arg[0].toLowerCase();
  const chatId = dest;

  if (action === 'on') {
    welcomeEnabled.set(chatId, true);
    repondre("✅ Welcome messages have been enabled for this group.");
  } else if (action === 'off') {
    welcomeEnabled.delete(chatId);
    repondre("❌ Welcome messages have been disabled for this group.");
  } else {
    repondre("Invalid option. Please use 'on' or 'off'.");
  }
});

// Function to get random welcome quote
function getRandomQuote() {
  return welcomeQuotes[Math.floor(Math.random() * welcomeQuotes.length)];
}

// Group event handler for welcome messages
hn.ev.on('group-participants.update', async (anu) => {
  try {
    const chatId = anu.id;
    
    // Only proceed if welcome messages are enabled for this group
    if (welcomeEnabled.has(chatId) && anu.action === 'add') {
      // Get group metadata
      const groupMetadata = await hn.groupMetadata(chatId);
      const groupName = groupMetadata.subject;

      for (const num of anu.participants) {
        try {
          // Get profile picture
          let ppUrl;
          try {
            ppUrl = await hn.profilePictureUrl(num, 'image');
          } catch {
            // Use default profile picture if unable to get user's profile picture
            ppUrl = 'https://i.ibb.co/4m0zj9r/welcome-default.png';
          }

          // Get random welcome quote
          const quote = getRandomQuote();

          // Create welcome message
          const welcomeText = `*Welcome to ${groupName}!* 👋\n\n` +
                            `@${num.split('@')[0]}\n\n` +
                            `${quote}\n\n` +
                            `🌟 Group Members: ${groupMetadata.participants.length}\n` +
                            `📅 Joined: ${new Date().toLocaleDateString()}\n\n` +
                            `_We hope you'll enjoy your time here!_`;

          // Send welcome message with profile picture
          await hn.sendMessage(chatId, {
            image: { url: ppUrl },
            caption: welcomeText,
            mentions: [num]
          });

        } catch (error) {
          console.error('Error sending welcome message:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error in group-participants event:', error);
  }
});

// Maps to store anti-badword settings and user warnings
const antiBadwordEnabled = new Map();
const badWordWarnings = new Map();

// Function to check text for inappropriate content using AI
async function checkInappropriateContent(text) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/moderations',
      { input: text },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const result = response.data.results[0];
    return {
      inappropriate: result.flagged,
      categories: Object.entries(result.categories)
        .filter(([_, value]) => value)
        .map(([key, _]) => key)
    };
  } catch (error) {
    console.error('Error checking content:', error);
    return { inappropriate: false, categories: [] };
  }
}

hango({
  nomCom: "antibadword",
  categorie: "Group",
  reaction: "🚫"
}, async (dest, hn, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  // Check if the command is used in a group
  if (!dest.endsWith('@g.us')) {
    repondre("❌ This command can only be used in groups.");
    return;
  }

  // Check if user is admin
  const groupAdmins = await hn.groupAdmin(dest);
  const sender = ms.key.participant || ms.key.remoteJid;
  
  if (!groupAdmins.includes(sender)) {
    repondre("❌ This command can only be used by group admins.");
    return;
  }

  if (!arg[0]) {
    repondre("Please specify 'on' or 'off' to enable/disable anti-badword feature.");
    return;
  }

  const action = arg[0].toLowerCase();
  const chatId = dest;

  if (action === 'on') {
    antiBadwordEnabled.set(chatId, true);
    // Clear any existing warnings when enabling
    clearBadWordWarnings(chatId);
    repondre("✅ Anti-badword feature has been enabled. Inappropriate messages will be detected and removed.");
  } else if (action === 'off') {
    antiBadwordEnabled.delete(chatId);
    // Clear all warnings for this group
    clearBadWordWarnings(chatId);
    repondre("❌ Anti-badword feature has been disabled.");
  } else {
    repondre("Invalid option. Please use 'on' or 'off'.");
  }
});

// Function to clear bad word warnings for a group
function clearBadWordWarnings(groupId) {
  for (const [key, value] of badWordWarnings.entries()) {
    if (key.startsWith(groupId)) {
      badWordWarnings.delete(key);
    }
  }
}

// Function to get user warning key
function getWarningKey(groupId, userId) {
  return `${groupId}:${userId}`;
}

// Message handler for detecting bad words
hn.ev.on('messages.upsert', async ({ messages }) => {
  for (const message of messages) {
    const chatId = message.key.remoteJid;
    
    // Check if this is a group and anti-badword is enabled
    if (chatId?.endsWith('@g.us') && antiBadwordEnabled.has(chatId)) {
      const messageContent = message.message?.conversation || 
                           message.message?.extendedTextMessage?.text ||
                           message.message?.imageMessage?.caption || '';
      
      if (!messageContent) continue;

      // Check content for inappropriate language
      const check = await checkInappropriateContent(messageContent);
      
      if (check.inappropriate) {
        const sender = message.key.participant || message.key.remoteJid;
        const warningKey = getWarningKey(chatId, sender);
        
        try {
          // Delete the inappropriate message
          await hn.sendMessage(chatId, { delete: message.key });
          
          // Get or initialize warning count
          const warnings = badWordWarnings.get(warningKey) || 0;
          badWordWarnings.set(warningKey, warnings + 1);
          
          const senderName = '@' + sender.split('@')[0];
          const categories = check.categories.map(cat => 
            cat.replace(/_/g, ' ').toLowerCase()
          ).join(', ');
          
          if (warnings >= 2) {
            // Third offense: Remove user from group
            await hn.groupParticipantsUpdate(chatId, [sender], "remove");
            
            await hn.sendMessage(chatId, {
              text: `🛡️ *Anti-Badword Protection*\n\n` +
                   `• User: ${senderName}\n` +
                   `• Action: Removed from group\n` +
                   `• Reason: Multiple violations of using inappropriate language\n\n` +
                   `_This group maintains a family-friendly environment._`,
              mentions: [sender]
            });
          } else {
            // First or second offense: Warning
            await hn.sendMessage(chatId, {
              text: `⚠️ *Inappropriate Language Warning*\n\n` +
                   `• User: ${senderName}\n` +
                   `• Action: Message Deleted\n` +
                   `• Warning: ${warnings + 1}/3\n` +
                   `• Type: ${categories}\n\n` +
                   `_Please maintain appropriate language in this group.\n` +
                   `Multiple violations will result in removal._`,
              mentions: [sender]
            });
          }
        } catch (error) {
          console.error('Error handling inappropriate message:', error);
        }
      }
    }
  }
});

