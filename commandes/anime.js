const axios = require("axios");
const {hango} = require("../framework/hango");
const hn = require("../lib/live");
const traduire = require("../framework/traduction");
const {Sticker ,StickerTypes}= require('wa-sticker-formatter');

hango({
  nomCom: "ranime",
  categorie: "Fun",
  reaction: "📺"
},
async (origineMessage, hn, commandeOptions) => {
  const { repondre, ms } = commandeOptions;

  try {
    repondre("🔎 *Searching for a random anime...*");
    const jsonURL = "https://api.jikan.moe/v4/random/anime";

    const response = await axios.get(jsonURL);
    const data = response.data.data;

    // Extract anime information
    const title = data.title;
    const title_japanese = data.title_japanese || "N/A";
    const synopsis = data.synopsis || "No synopsis available.";
    const imageUrl = data.images.jpg.large_image_url || data.images.jpg.image_url;
    const episodes = data.episodes || "Unknown";
    const status = data.status || "Unknown";
    const score = data.score || "N/A";
    const rating = data.rating || "N/A";
    const year = data.year || "Unknown";
    const genres = data.genres ? data.genres.map(genre => genre.name).join(", ") : "Unknown";

    // Create star rating visualization
    const stars = getStarRating(score);
    
    // Format message with improved styling
    let message = `╔═══『 📺 𝐀𝐧𝐢𝐦𝐞 𝐈𝐧𝐟𝐨 』═══╗\n\n`;
    message += `*🎬 ${title}*\n`;
    message += `🇯🇵 *Japanese:* ${title_japanese}\n\n`;
    
    message += `${stars} *${score}*/10\n\n`;
    
    // Anime details section
    message += `🎯 *Status:* ${status}\n`;
    message += `🔢 *Episodes:* ${episodes}\n`;
    message += `📅 *Year:* ${year}\n`;
    message += `🔞 *Rating:* ${rating}\n`;
    message += `🎭 *Genres:* ${genres}\n\n`;
    
    // Synopsis section
    message += `📝 *Synopsis:*\n${synopsis}\n\n`;
    
    // Add link to MyAnimeList
    message += `🔗 *MyAnimeList:* ${data.url}\n\n`;
    
    // Add EliTechWiz branding
    message += `╔═════════════════╗\n`;
    message += ` 𝓟𝓸𝔀𝓮𝓻𝓮𝓭 𝓑𝔂 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃\n`;
    message += `╚═════════════════╝`;

    // Send the message with the anime image
    await hn.sendMessage(origineMessage, { 
      image: { url: imageUrl }, 
      caption: message 
    }, { quoted: ms });
    
  } catch (error) {
    console.error('Error retrieving anime data:', error);
    repondre('❌ *Error:* Could not fetch anime data. The API might be down. Please try again later.');
  }
});

hango({
  nomCom: "google",
  categorie: "Search",
  reaction: "🔍"
}, async (dest, hn, commandeOptions) => {
  const { arg, repondre, ms } = commandeOptions;
  
  if (!arg || arg.length === 0) {
    repondre("⚠️ Please provide a search query.\n*Example:* .google What is a bot");
    return;
  }

  try {
    // Show typing indicator
    await repondre("🔍 *Searching Google...*");
    
    const googleIt = require('google-it');
    const searchQuery = arg.join(" ");
    
    const results = await googleIt({
      query: searchQuery,
      limit: 5,  // Limit to 5 results for better readability
      disableConsole: true // Prevent console logs
    });

    if (!results || results.length === 0) {
      repondre("❌ No results found for your search query.");
      return;
    }

    // Format the search results in an attractive way
    let msg = `╔═══『 🔍 𝐆𝐨𝐨𝐠𝐥𝐞 𝐒𝐞𝐚𝐫𝐜𝐡 』═══╗\n\n`;
    msg += `🔎 *Query:* ${searchQuery}\n\n`;

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      msg += `*${i + 1}. ${result.title}*\n`;
      msg += `${result.snippet}\n`;
      msg += `🔗 ${result.link}\n\n`;
    }
    
    // Add EliTechWiz branding
    msg += `╔═════════════════╗\n`;
    msg += ` 𝓟𝓸𝔀𝓮𝓻𝓮𝓭 𝓑𝔂 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃\n`;
    msg += `╚═════════════════╝`;
    
    await hn.sendMessage(dest, { text: msg }, { quoted: ms });
  } catch (error) {
    console.error('Google search error:', error);
    repondre("❌ *Error:* An error occurred during the Google search. Please try again later.");
  }
});

hango({
  nomCom: "imdb",
  categorie: "Search",
  reaction: "🎬"
}, async (dest, hn, commandeOptions) => {
  const { arg, repondre, ms } = commandeOptions;

  if (!arg[0] || arg.length === 0) {
    repondre("⚠️ Please provide the name of a movie or TV series.\n*Example:* .imdb Inception");
    return;
  }

  try {
    // Show typing indicator
    await repondre("🔍 *Searching IMDB database...*");
    
    const searchQuery = arg.join(" ");
    const response = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${searchQuery}&plot=full`);
    const imdbData = response.data;

    if (imdbData.Response === "False") {
      return repondre(`❌ *Not Found:* "${searchQuery}" could not be found in the IMDB database.`);
    }

    const rating = imdbData.imdbRating;
    const ratingStars = getStarRating(rating);

    let imdbInfo = `╔═══『 🎬 𝐈𝐌𝐃𝐁 𝐒𝐞𝐚𝐫𝐜𝐡 』═══╗\n\n`;
    
    // Title section with bold formatting
    imdbInfo += `*📽️ ${imdbData.Title}* (${imdbData.Year})\n`;
    imdbInfo += `${ratingStars} *${rating}*/10 (${imdbData.imdbVotes} votes)\n\n`;
    
    // Main info section
    imdbInfo += `🏆 *Rated:* ${imdbData.Rated}\n`;
    imdbInfo += `⏱️ *Runtime:* ${imdbData.Runtime}\n`;
    imdbInfo += `🎭 *Genre:* ${imdbData.Genre}\n`;
    imdbInfo += `📅 *Released:* ${imdbData.Released}\n\n`;
    
    // Creative team section
    imdbInfo += `🎬 *Director:* ${imdbData.Director}\n`;
    imdbInfo += `✍️ *Writers:* ${imdbData.Writer}\n`;
    imdbInfo += `🎭 *Actors:* ${imdbData.Actors}\n\n`;
    
    // Story section with plot
    imdbInfo += `📖 *Plot:*\n${imdbData.Plot}\n\n`;
    
    // Additional info section
    imdbInfo += `🌐 *Language:* ${imdbData.Language}\n`;
    imdbInfo += `🌍 *Country:* ${imdbData.Country}\n`;
    
    if (imdbData.Awards && imdbData.Awards !== "N/A") {
      imdbInfo += `🏅 *Awards:* ${imdbData.Awards}\n`;
    }
    
    // Box office info if available
    if (imdbData.BoxOffice && imdbData.BoxOffice !== "N/A") {
      imdbInfo += `💰 *Box Office:* ${imdbData.BoxOffice}\n`;
    }
    
    if (imdbData.Production && imdbData.Production !== "N/A") {
      imdbInfo += `🏢 *Production:* ${imdbData.Production}\n`;
    }
    
    // Add IMDB link
    imdbInfo += `🔗 *IMDB:* https://www.imdb.com/title/${imdbData.imdbID}\n\n`;
    
    // Footer with EliTechWiz branding
    imdbInfo += `╔═════════════════╗\n`;
    imdbInfo += ` 𝓟𝓸𝔀𝓮𝓻𝓮𝓭 𝓑𝔂 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃\n`;
    imdbInfo += `╚═════════════════╝`;

    await hn.sendMessage(dest, {
      image: {
        url: imdbData.Poster !== "N/A" ? imdbData.Poster : "https://i.imgur.com/Z2MYNbj.png",
      },
      caption: imdbInfo,
    }, {
      quoted: ms,
    });
  } catch (error) {
    console.error("IMDB search error:", error);
    repondre("❌ *Error:* An error occurred while searching IMDB. Please try again later.");
  }
});

hango({
  nomCom: "movie",
  categorie: "Search",
  reaction: "🎥"
}, async (dest, hn, commandeOptions) => {
  const { arg, repondre, ms } = commandeOptions;

  if (!arg[0] || arg.length === 0) {
    repondre("⚠️ Please provide the name of a movie.\n*Example:* .movie The Avengers");
    return;
  }

  try {
    // Show typing indicator
    await repondre("🔍 *Searching for movie details...*");
    
    const searchQuery = arg.join(" ");
    const response = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${searchQuery}&plot=full`);
    const movieData = response.data;

    if (movieData.Response === "False") {
      return repondre(`❌ *Not Found:* "${searchQuery}" could not be found in the database.`);
    }

    // Create star rating visualization
    const rating = movieData.imdbRating;
    const stars = getStarRating(rating);

    let movieInfo = `╔═══『 🎥 𝐌𝐨𝐯𝐢𝐞 𝐃𝐞𝐭𝐚𝐢𝐥𝐬 』═══╗\n\n`;
    
    // Add telegram channel link
    movieInfo += `🔗 *Download Movies:* https://t.me/eliahtechai\n\n`;
    
    // Title section with bold formatting
    movieInfo += `*🎬 ${movieData.Title}* (${movieData.Year})\n`;
    movieInfo += `${stars} *${rating}*/10\n\n`;
    
    // Main info section with improved formatting
    movieInfo += `🏆 *Rated:* ${movieData.Rated}\n`;
    movieInfo += `📅 *Released:* ${movieData.Released}\n`;
    movieInfo += `⏱️ *Runtime:* ${movieData.Runtime}\n`;
    movieInfo += `🎭 *Genre:* ${movieData.Genre}\n\n`;
    
    // Creative team section
    movieInfo += `🎬 *Director:* ${movieData.Director}\n`;
    movieInfo += `✍️ *Writers:* ${movieData.Writer}\n`;
    movieInfo += `🎭 *Actors:* ${movieData.Actors}\n\n`;
    
    // Plot section
    movieInfo += `📖 *Plot:*\n${movieData.Plot}\n\n`;
    
    // Additional details section
    movieInfo += `🌐 *Language:* ${movieData.Language}\n`;
    movieInfo += `🌍 *Country:* ${movieData.Country}\n`;
    
    if (movieData.Awards && movieData.Awards !== "N/A") {
      movieInfo += `🏅 *Awards:* ${movieData.Awards}\n`;
    }
    
    if (movieData.BoxOffice && movieData.BoxOffice !== "N/A") {
      movieInfo += `💰 *Box Office:* ${movieData.BoxOffice}\n`;
    }
    
    if (movieData.Production && movieData.Production !== "N/A") {
      movieInfo += `🏢 *Production:* ${movieData.Production}\n`;
    }
    
    // Footer with EliTechWiz branding
    movieInfo += `\n╔═════════════════╗\n`;
    movieInfo += ` 𝓟𝓸𝔀𝓮𝓻𝓮𝓭 𝓑𝔂 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃\n`;
    movieInfo += `╚═════════════════╝`;

    await hn.sendMessage(dest, {
      image: {
        url: movieData.Poster !== "N/A" ? movieData.Poster : "https://i.imgur.com/Z2MYNbj.png",
      },
      caption: movieInfo,
    }, {
      quoted: ms,
    });
  } catch (error) {
    console.error("Movie search error:", error);
    repondre("❌ *Error:* An error occurred while searching for the movie. Please try again later.");
  }
});

hango({
  nomCom: "emojimix",
  categorie: "Conversion",
  reaction: "🎨"
}, async (dest, hn, commandeOptions) => {
  const { arg, repondre, ms, nomAuteurMessage } = commandeOptions;

  if (!arg[0] || arg.length === 0) {
    repondre("⚠️ Please provide two emojis separated by a semicolon.\n*Example:* .emojimix 😀;🥰");
    return;
  }

  // Split the emojis using the semicolon as separator
  const inputText = arg.join(' ');
  const emojis = inputText.split(';');

  if (emojis.length !== 2) {
    repondre("⚠️ Please provide exactly two emojis separated by a semicolon (;).\n*Example:* .emojimix 😀;🥰");
    return;
  }

  const emoji1 = emojis[0].trim();
  const emoji2 = emojis[1].trim();

  try {
    // Show typing indicator
    await repondre("🎨 *Mixing emojis...*");
    
    const response = await axios.get(`https://levanter.onrender.com/emix?q=${emoji1}${emoji2}`);

    if (response.data.status === true) {
      // Create sticker from the resulting image
      let stickerMess = new Sticker(response.data.result, {
        pack: "EliTechWiz",
        author: nomAuteurMessage,
        type: StickerTypes.CROPPED,
        categories: ["🤩", "🎉"],
        id: "12345",
        quality: 70,
        background: "transparent",
      });
      
      const stickerBuffer = await stickerMess.toBuffer();
      await hn.sendMessage(dest, { sticker: stickerBuffer }, { quoted: ms });
    } else {
      repondre("❌ *Error:* Could not mix these emojis. Please try different emojis.");
    }
  } catch (error) {
    console.error("Emoji mix error:", error);
    repondre("❌ *Error:* Failed to mix emojis. The service might be down or the emojis are not compatible.");
  }
});

// Function to generate star rating visualization
function getStarRating(rating) {
  const numRating = parseFloat(rating);
  if (isNaN(numRating)) return "⭐ Unknown";
  
  const fullStars = Math.floor(numRating / 2);
  const halfStar = numRating % 2 >= 1 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  
  return "⭐".repeat(fullStars) + (halfStar ? "✮" : "") + "☆".repeat(emptyStars);
}

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

