const { hango } = require("../framework/hango");
const fs = require('fs');
const path = require('path');

hango({ 
    nomCom: "vv", 
    categorie: "General", 
    reaction: "😎" 
}, async (dest, hn, commandeOptions) => {
    const { ms, msgRepondu, repondre } = commandeOptions;

    try {
        // Check if the user replied to a message
        if (!msgRepondu) {
            return repondre("*Reply to a view-once message to decrypt it*");
        }

        // For debugging what we actually receive
        console.log("Message structure:", JSON.stringify(msgRepondu, null, 2));

        // Try multiple potential paths for view-once messages
        let viewOnceContent = null;
        let mediaType = null;
        let caption = "";

        // Check viewOnceMessageV2 path (newer WhatsApp versions)
        if (msgRepondu.viewOnceMessageV2?.message) {
            const msg = msgRepondu.viewOnceMessageV2.message;
            if (msg.imageMessage) {
                viewOnceContent = msg.imageMessage;
                mediaType = "image";
                caption = msg.imageMessage.caption || "";
            } else if (msg.videoMessage) {
                viewOnceContent = msg.videoMessage;
                mediaType = "video";
                caption = msg.videoMessage.caption || "";
            } else if (msg.audioMessage) {
                viewOnceContent = msg.audioMessage;
                mediaType = "audio";
            }
        }
        // Check viewOnceMessage path (older WhatsApp versions)
        else if (msgRepondu.viewOnceMessage?.message) {
            const msg = msgRepondu.viewOnceMessage.message;
            if (msg.imageMessage) {
                viewOnceContent = msg.imageMessage;
                mediaType = "image";
                caption = msg.imageMessage.caption || "";
            } else if (msg.videoMessage) {
                viewOnceContent = msg.videoMessage;
                mediaType = "video";
                caption = msg.videoMessage.caption || "";
            } else if (msg.audioMessage) {
                viewOnceContent = msg.audioMessage;
                mediaType = "audio";
            }
        }
        // Check direct message structure (another possible path)
        else if (msgRepondu.message) {
            // Try to find view-once content in the message structure
            if (msgRepondu.message.viewOnceMessage || msgRepondu.message.viewOnceMessageV2) {
                const vMsg = msgRepondu.message.viewOnceMessage || msgRepondu.message.viewOnceMessageV2;
                const msg = vMsg.message;
                
                if (msg?.imageMessage) {
                    viewOnceContent = msg.imageMessage;
                    mediaType = "image";
                    caption = msg.imageMessage.caption || "";
                } else if (msg?.videoMessage) {
                    viewOnceContent = msg.videoMessage;
                    mediaType = "video";
                    caption = msg.videoMessage.caption || "";
                } else if (msg?.audioMessage) {
                    viewOnceContent = msg.audioMessage;
                    mediaType = "audio";
                }
            }
        }

        // If we couldn't find the view-once content
        if (!viewOnceContent || !mediaType) {
            return repondre("*Could not detect view-once media or unsupported message type*");
        }

        // Process and send the media
        try {
            let mediaPath;
            try {
                // Try the downloadAndSaveMediaMessage function
                mediaPath = await hn.downloadAndSaveMediaMessage(viewOnceContent);
            } catch (dlError) {
                console.error("Download error:", dlError);
                // Fallback: try alternative method if available
                try {
                    const buffer = await hn.downloadMediaMessage(viewOnceContent);
                    const tempDir = path.join(__dirname, '../temp');
                    
                    // Create temp directory if it doesn't exist
                    if (!fs.existsSync(tempDir)) {
                        fs.mkdirSync(tempDir, { recursive: true });
                    }
                    
                    // Save buffer to file
                    const fileExt = mediaType === 'image' ? 'jpg' : mediaType === 'video' ? 'mp4' : 'ogg';
                    mediaPath = path.join(tempDir, `viewonce_${Date.now()}.${fileExt}`);
                    fs.writeFileSync(mediaPath, buffer);
                } catch (fallbackError) {
                    console.error("Fallback download error:", fallbackError);
                    return repondre("*Failed to download media content*");
                }
            }

            // Send the media based on its type
            if (mediaType === "image") {
                await hn.sendMessage(dest, {
                    image: { url: mediaPath },
                    caption: `*Decrypted View-Once Image*\n\n${caption}`,
                }, { quoted: ms });
            } else if (mediaType === "video") {
                await hn.sendMessage(dest, {
                    video: { url: mediaPath },
                    caption: `*Decrypted View-Once Video*\n\n${caption}`,
                }, { quoted: ms });
            } else if (mediaType === "audio") {
                await hn.sendMessage(dest, {
                    audio: { url: mediaPath },
                    mimetype: 'audio/mp4',
                    ptt: true,
                }, { quoted: ms });
            }

            // Clean up the temporary file
            try {
                if (fs.existsSync(mediaPath)) {
                    fs.unlinkSync(mediaPath);
                }
            } catch (cleanupError) {
                console.error("Error cleaning up temp file:", cleanupError);
            }

            return; // Success, no need for additional messages
            
        } catch (mediaError) {
            console.error("Media processing error:", mediaError);
            return repondre("*Error processing the media content*");
        }
        
    } catch (error) {
        console.error("Critical error in view-once command:", error);
        repondre("*Failed to process message. Something went wrong.*");
    }
});
