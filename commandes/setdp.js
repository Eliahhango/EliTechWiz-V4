const { hango } = require('../framework/hango');
const fs = require("fs");
const { exec } = require("child_process");

hango({
nomCom: "volvideo",
categorie: "Video",
reaction: "🔊"
}, async (dest, hn, { ms, repondre, arg }) => {

if (!arg[0]) return repondre("Example: .volvideo 10");

const quoted = ms.quoted;

// ✅ FIX: accept any video type
if (!quoted || !quoted.mtype?.includes("video")) {
return repondre("❌ Reply to a video file!");
}

try {
// Download the video
const media = await hn.downloadAndSaveMediaMessage(quoted, "vid");
const output = `vol_${Date.now()}.mp4`;

// Run ffmpeg to adjust volume  
exec(`ffmpeg -i "${media}" -filter:a "volume=${arg[0]}" -c:v copy "${output}"`, (err) => {  

  // Remove the original download  
  try { fs.unlinkSync(media); } catch (e) {}  

  if (err) {  
    console.error(err);  
    return repondre("❌ Error processing video!");  
  }  

  // Send the new video  
  const buffer = fs.readFileSync(output);  
  hn.sendMessage(dest, { video: buffer }, { quoted: ms });  

  // Delete the output file  
  try { fs.unlinkSync(output); } catch (e) {}  
});

} catch (e) {
console.error(e);
repondre("❌ Error occurred.");
}
});

// log excerpt: .volvideo 10
// reply to a video file is required

// (note)

const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// Convert a stream to buffer
async function streamToBuffer(stream) {
const chunks = [];
for await (const chunk of stream) {
chunks.push(chunk);
}
return Buffer.concat(chunks);
}

hango({
nomCom: "setdp",
categorie: "Group",
reaction: "🖼️",
nomFichier: __filename
}, async (dest, hn, { ms, repondre, auteurMessage, infosGroupe }) => {

// Allow only in group chats  
if (!dest.endsWith('@g.us')) {  
    return repondre("❌ This command only works in group chats.");  
}  

// Allow only group admins  
const isUserAdmin = infosGroupe?.participants?.find(p => p.id === auteurMessage)?.admin;  
if (!isUserAdmin) {  
    return repondre("⛔ Only group admins can use this command.");  
}  

// Reject if it's a reply to an image  
if (ms.quoted && (ms.quoted.message?.imageMessage ||  
                  ms.quoted.message?.ephemeralMessage?.message?.imageMessage ||  
                  ms.quoted.message?.viewOnceMessageV2?.message?.imageMessage)) {  
    return repondre("❌ This command only works when you send an image directly, not by replying.");  
}  

// Accept only directly sent image  
const imageMsg = ms.message?.imageMessage;  

if (!imageMsg) {  
    return repondre("🖼️ Please send an image directly with this command to set as group profile picture.");  
}  

try {  
    const stream = await downloadContentFromMessage(imageMsg, 'image');  
    const buffer = await streamToBuffer(stream);  
    await hn.updateProfilePicture(dest, buffer);  
    await repondre("✅ Group profile picture updated successfully!");  
} catch (error) {  
    console.error("Error:", error);  
    return repondre("❌ Failed to update group profile picture.");  
}

});
