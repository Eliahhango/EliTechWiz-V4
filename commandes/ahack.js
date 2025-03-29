const {
  hango
} = require("../framework/hango");
hango({
  'nomCom': "hack",
  'categorie': "Fun",
  'reaction': '⚡'
}, async (dest, hn, commandOptions) => {
  const {
    repondre,
    arg,
    prefixe
  } = commandOptions;
  
  // Check if a target was specified
  const target = arg ? arg.join(" ").trim() : "target";
  
  try {
    // Define hacking animation messages with better formatting
    const hackMessages = [
      `\`\`\`⚡ 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4 initiating hack on ${target}...\`\`\``,
      `\`\`\`🔐 Bypassing security protocols...\n▓░░░░░░░░░░ 5%\`\`\``,
      `\`\`\`♻️ Accessing device storage...\n▓▓░░░░░░░░░ 15%\`\`\``,
      `\`\`\`📱 Downloading contacts...\n▓▓▓░░░░░░░░ 23%\`\`\``,
      `\`\`\`📷 Extracting photos and videos...\n▓▓▓▓▓░░░░░ 38%\`\`\``,
      `\`\`\`💬 Retrieving chat history...\n▓▓▓▓▓▓░░░░ 52%\`\`\``,
      `\`\`\`🔑 Breaking encryption...\n▓▓▓▓▓▓▓░░░ 68%\`\`\``,
      `\`\`\`🌐 Accessing browser history...\n▓▓▓▓▓▓▓▓░░ 75%\`\`\``,
      `\`\`\`💳 Extracting payment data...\n▓▓▓▓▓▓▓▓▓░ 88%\`\`\``,
      `\`\`\`📲 Cloning device...\n▓▓▓▓▓▓▓▓▓▓ 100%\`\`\``,
      `\`\`\`⚠️ HACK COMPLETE! Full access granted!\`\`\``,
    ];

    // Display initial animation with increasing delays for realism
    for (let i = 0; i < hackMessages.length; i++) {
      try {
        await repondre(hackMessages[i]);
        // Increasing delay as hack "progresses" for more realism
        const delay = 1000 + Math.floor(i * 300);
        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error) {
        console.error(`Error at message ${i}:`, error);
      }
    }

    // Extracting data messages
    const dataExtractionMessages = [
      `\`\`\`📂 Extracting sensitive files...\`\`\``,
      `\`\`\`📤 Uploading data to secure server...\`\`\``,
      `\`\`\`🔍 Analyzing security vulnerabilities...\`\`\``,
      `\`\`\`🧹 Covering tracks and removing evidence...\`\`\``
    ];

    for (const message of dataExtractionMessages) {
      try {
        await repondre(message);
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error("Error during data extraction phase:", error);
      }
    }

    // Countdown with actual numbers
    await repondre(`\`\`\`⚠️ System self-destruct sequence initiated!\`\`\``);
    
    const countdown = ['5', '4', '3', '2', '1'];
    for (const count of countdown) {
      try {
        await repondre(`\`\`\`💥 System will be wiped in ${count}...\`\`\``);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error during countdown:", error);
      }
    }

    // Final message with victim's name for personalization
    try {
      await repondre(`*💀 ${target}'s DEVICE SUCCESSFULLY COMPROMISED! 💀*\n\n_This was just a prank, no actual hacking occurred._`);
    } catch (error) {
      console.error("Error sending final message:", error);
    }
  } catch (error) {
    console.error("Critical error in hack command:", error);
    return await repondre("_⚠️ Hack operation failed: Target's security system detected our intrusion!_");
  }
});
