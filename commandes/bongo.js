const { hango } = require("../framework/hango");
const axios = require("axios");
const Genius = require("genius-lyrics");
const Client = new Genius.Client("jKTbbU-6X2B9yWWl-KOm7Mh3_Z6hQsgE4mmvwV3P3Qe7oNa9-hsrLxQV5l5FiAZO");

/**
 * ═══════════════════════════════════════════════════
 *            ELITECHWIZ UTILITIES COMMANDS
 * ═══════════════════════════════════════════════════
 */

// ╔═════════════════════════════════════════════════╗
// ║              POLL CREATION COMMAND              ║
// ╚═════════════════════════════════════════════════╝

hango({
  nomCom: 'poll',
  reaction: '💠',
  categorie: "General"
}, async (dest, hn, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  // Join all arguments into a single string
  const pollText = arg.join(" ");
  
  // Split the input into question and options
  let [question, optionsText] = pollText.split('/');
  
  // Check if the format is correct
  if (pollText.split('/').length < 2) {
    return repondre("Incorrect format.\nExample: poll what is 1+1/2, 3, 4");
  }
  
  // Parse the options into an array
  let options = [];
  for (let option of optionsText.split(',')) {
    options.push(option.trim());
  }
  
  // Send the poll to the chat
  await hn.sendMessage(dest, {
    poll: {
      name: question.trim(),
      values: options
    }
  });
});

// ╔═════════════════════════════════════════════════╗
// ║              RANDOM FACT COMMAND                ║
// ╚═════════════════════════════════════════════════╝

hango({
  nomCom: 'fact',
  reaction: '👌',
  categorie: 'User'
}, async (dest, hn, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  try {
    // Fetch a random fact from the API
    const response = await fetch("https://nekos.life/api/v2/fact");
    const data = await response.json();
    
    // Format the response with EliTechWiz branding
    const formattedResponse = `╔══「 📚 *Random Fact* 」══╗\n\n💠 ${data.fact}\n\n╚══「 *𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4* 」══╝`;
    
    // Send the formatted fact
    repondre(formattedResponse);
  } catch (error) {
    console.error("Fact Error:", error);
    repondre("❌ *Error:* Failed to fetch a random fact. Please try again later.");
  }
});

// ╔═════════════════════════════════════════════════╗
// ║              RANDOM QUOTE COMMAND               ║
// ╚═════════════════════════════════════════════════╝

hango({
  nomCom: "quote",
  reaction: '🗿',
  categorie: 'User'
}, async (dest, hn, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  try {
    // Fetch a random quote from the API
    const response = await fetch('https://favqs.com/api/qotd');
    const data = await response.json();
    
    // Format the response with quote and author
    const formattedQuote = `╔══「 📜 *Daily Quote* 」══╗\n\n"${data.quote.body}"\n\n*— ${data.quote.author}*\n\n╚══「 *𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4* 」══╝`;
    
    // Send the formatted quote
    repondre(formattedQuote);
  } catch (error) {
    console.error("Quote Error:", error);
    repondre("❌ *Error:* Failed to fetch a quote. Please try again later.");
  }
});

// ╔═════════════════════════════════════════════════╗
// ║              URBAN DICTIONARY COMMAND           ║
// ╚═════════════════════════════════════════════════╝

hango({
  nomCom: 'define',
  reaction: '😁',
  categorie: "Search"
}, async (dest, hn, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  // Check if a term was provided
  if (!arg || arg.length === 0) {
    return repondre(`╔══「 📖 *Urban Dictionary* 」══╗\n\n💬 Please provide a term to define.\n\nExample: .define yeet\n\n╚═══════════════════╝`);
  }
  
  // Join arguments to form the search term
  const searchTerm = arg.join(" ");
  
  try {
    // Make request to Urban Dictionary API
    const { data } = await axios.get(`http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(searchTerm)}`);
    
    // Check if results were found
    if (data.list && data.list.length > 0) {
      // Clean up the response by removing brackets
      const definition = data.list[0].definition.replace(/\[/g, '').replace(/\]/g, '');
      const example = data.list[0].example.replace(/\[/g, '').replace(/\]/g, '');
      
      // Format the response
      const formattedDefinition = `╔══「 📖 *Urban Dictionary* 」══╗\n\n*Term:* ${searchTerm}\n\n*Definition:*\n${definition}\n\n*Example:*\n${example}\n\n╚══「 *𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4* 」══╝`;
      
      return repondre(formattedDefinition);
    } else {
      return repondre(`❌ No definition found for "${searchTerm}". Please try another term.`);
    }
  } catch (error) {
    console.error("Define Error:", error);
    return repondre(`❌ *Error:* Failed to search for "${searchTerm}". Please try again later.`);
  }
});

// ╔═════════════════════════════════════════════════╗
// ║              SONG LYRICS COMMAND                ║
// ╚═════════════════════════════════════════════════╝

hango({
  nomCom: "lyrics",
  reaction: '🎵',
  categorie: "Search"
}, async (dest, hn, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  
  try {
    // Check if a song name was provided
    if (!arg || arg.length === 0) {
      return repondre(`╔══「 🎵 *Song Lyrics* 」══╗\n\n💬 Please provide a song name.\n\nExample: .lyrics Bohemian Rhapsody\n\n╚═══════════════════╝`);
    }
    
    // Show processing message
    await repondre("🔍 *Searching for lyrics...*");
    
    // Join arguments to form the song name
    const songName = arg.join(" ");
    
    // Search for the song
    const searchResults = await Client.songs.search(songName);
    
    // Check if any songs were found
    if (searchResults.length === 0) {
      return repondre(`❌ No lyrics found for "${songName}". Try searching for a different song.`);
    }
    
    // Get the first matching song
    const song = searchResults[0];
    
    // Get the lyrics
    const lyrics = await song.lyrics();
    
    // Format the response
    const formattedLyrics = `╔══「 🎵 *Song Lyrics* 」══╗\n\n*Song:* ${song.title}\n*Artist:* ${song.artist.name}\n\n${lyrics}\n\n╚══「 *𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4* 」══╝`;
    
    // Send the lyrics
    await hn.sendMessage(dest, {
      text: formattedLyrics
    }, {
      quoted: ms
    });
  } catch (error) {
    console.error("Lyrics Error:", error);
    repondre(`❌ *Error:* Failed to find lyrics for "${arg.join(" ")}". Please try with a different song or check your spelling.`);
  }
});
