const { hango } = require("../framework/hango");
const { igdl } = require("ruhend-scraper");
const axios = require("axios");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const webp = require("node-webpmux");
const crypto = require("crypto");

// === Helper: fetch buffer from URL ===
async function fetchBufferFromUrl(url) {
    try {
        const res = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': '*/*',
                'Accept-Encoding': 'identity'
            },
            timeout: 30000
        });
        if (!res.data || res.data.length === 0) throw new Error("Empty buffer from URL");
        return Buffer.from(res.data);
    } catch (e) {
        throw new Error(`Failed to fetch URL: ${e.message}`);
    }
}

// === Helper: check FFmpeg exists ===
function checkFFmpeg() {
    return new Promise((resolve) => {
        exec('ffmpeg -version', (err, stdout) => {
            resolve(!err);
        });
    });
}

// === Helper: convert buffer to sticker with WebP & EXIF metadata ===
async function convertBufferToStickerWebp(inputBuffer, isAnimated, cropSquare) {
    const tmpDir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const tempInput = path.join(tmpDir, `input_${Date.now()}.${isAnimated ? 'mp4' : 'jpg'}`);
    const tempOutput = path.join(tmpDir, `output_${Date.now()}.webp`);
    fs.writeFileSync(tempInput, inputBuffer);

    const vf = cropSquare
        ? `crop=min(iw\\,ih):min(iw\\,ih),scale=512:512${isAnimated ? ',fps=12' : ''}`
        : `scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000${isAnimated ? ',fps=12' : ''}`;

    const cmd = `ffmpeg -y -i "${tempInput}" ${isAnimated ? '-t 3' : ''} -vf "${vf}" -c:v libwebp -preset default -loop 0 -vsync 0 -pix_fmt yuva420p -quality 75 -compression_level 6 "${tempOutput}"`;

    try {
        await new Promise((resolve, reject) => {
            exec(cmd, (err, stdout, stderr) => {
                if (err) {
                    console.error("FFmpeg Error:", stderr);
                    return reject(err);
                }
                resolve();
            });
        });
    } catch (e) {
        throw new Error(`FFmpeg failed: ${e.message}`);
    }

    if (!fs.existsSync(tempOutput)) throw new Error("FFmpeg did not produce output file");

    const buffer = fs.readFileSync(tempOutput);
    const img = new webp.Image();
    await img.load(buffer);

    const json = {
        'sticker-pack-id': crypto.randomBytes(32).toString('hex'),
        'sticker-pack-name': settings.packname || 'KnightBot',
        'sticker-pack-publisher': settings.author || 'KnightDev',
        'emojis': ['📸']
    };

    const exifAttr = Buffer.from([0x49,0x49,0x2A,0x00,0x08,0x00,0x00,0x00,0x01,0x00,0x41,0x57,0x07,0x00,0x00,0x00,0x00,0x00,0x16,0x00,0x00,0x00]);
    const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
    const exif = Buffer.concat([exifAttr, jsonBuffer]);
    exif.writeUIntLE(jsonBuffer.length, 14, 4);
    img.exif = exif;

    const finalBuffer = await img.save(null);

    try { fs.unlinkSync(tempInput); } catch {}
    try { fs.unlinkSync(tempOutput); } catch {}

    return finalBuffer;
}

// === Command: .igs ===
hango({
    nomCom: "igs",
    categorie: "Download",
    reaction: "📸",
    desc: "Download Instagram post/reel and send as sticker"
}, async (dest, hn, { repondre, arg, ms }) => {
    try {
        if (!arg || arg.length === 0) return repondre("Send an Instagram link: .igs <url>");

        const ffmpegOk = await checkFFmpeg();
        if (!ffmpegOk) return repondre("❌ FFmpeg not found. Sticker cannot be created.");

        await hn.sendMessage(dest, { text: "🔄 Downloading media..." }, { quoted: ms });

        const downloadData = await igdl(arg[0]).catch(() => null);
        if (!downloadData || !downloadData.data) return repondre("❌ Failed to fetch media.");

        const rawItems = (downloadData?.data || []).filter(m => m && m.url);
        if (!rawItems.length) return repondre("❌ No media found.");

        const maxItems = Math.min(rawItems.length, 10);
        const seenHashes = new Set();

        for (let i = 0; i < maxItems; i++) {
            const media = rawItems[i];
            const mediaUrl = media.url;
            const isVideo = media?.type === "video" || /\.(mp4|mov|avi|mkv|webm)$/i.test(mediaUrl);

            try {
                const buffer = await fetchBufferFromUrl(mediaUrl);
                const hash = crypto.createHash("sha1").update(buffer).digest("hex");
                if (seenHashes.has(hash)) continue;
                seenHashes.add(hash);

                const stickerBuffer = await convertBufferToStickerWebp(buffer, isVideo, false);

                if (!stickerBuffer || stickerBuffer.length === 0) {
                    console.error("Sticker buffer empty for URL:", mediaUrl);
                    continue;
                }

                await hn.sendMessage(dest, { sticker: stickerBuffer }, { quoted: ms });
                if (i < maxItems - 1) await new Promise(r => setTimeout(r, 800));
            } catch (e) {
                console.error("Error processing media:", e.message);
            }
        }
    } catch (err) {
        console.error("IGS Command Error:", err);
        repondre("❌ Failed to create sticker.");
    }
});