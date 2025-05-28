const { hango } = require("../framework/hango");
const fs = require('fs');
const path = require('path');

// Command to convert group contacts to VCF file format
hango({
    nomCom: "vcf",
    categorie: "Group",
    reaction: "📄"
}, async (dest, hn, commandeOptions) => {
    const { repondre, verifGroupe, verifAdmin, ms } = commandeOptions;

    // Verify if the command is run in a group
    if (!verifGroupe) {
        return repondre("This command only works in groups!");
    }

    // Admin check removed to allow any member to create VCF files

    try {
        // Get group metadata (for participants)
        let groupMetadata = await hn.groupMetadata(dest);
        const participants = await groupMetadata.participants;
        
        // Create VCF content
        let vcfContent = '';
        
        // Add each participant to VCF
        for (let participant of participants) {
            // Get the phone number without the '@s.whatsapp.net'
            let phoneNumber = participant.id.split('@')[0];
            
            // Use participant name or default to their phone number
            let contactName = participant.name || participant.subject || "[Contact] +" + phoneNumber;
            
            // Create VCF entry for this contact
            vcfContent += `BEGIN:VCARD
VERSION:3.0
FN:${contactName}
TEL;type=CELL;waid=${phoneNumber}:+${phoneNumber}
END:VCARD
`;
        }

        // Notify user about the process
        await repondre(`Compiling ${participants.length} contacts into a vcf file...`);
        
        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        // Save VCF file
        const vcfPath = path.join(tempDir, 'contacts.vcf');
        fs.writeFileSync(vcfPath, vcfContent.trim());

        // Stylish caption with EliTechWiz branding
        const stylishCaption = `*『 𝓥𝓒𝓕 𝓒𝓸𝓷𝓽𝓪𝓬𝓽𝓼 』*

📁 *Group:* ${groupMetadata.subject}
👥 *Total Contacts:* ${participants.length}

╔══════════════════╗
  𝓟𝓸𝔀𝓮𝓻𝓮𝓭 𝓑𝔂 𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃
╚══════════════════╝`;

        // Send the VCF file
        const messageOptions = {
            ephemeralExpiration: 86400, // 24 hours
            quoted: ms
        };
        
        await hn.sendMessage(dest, {
            document: fs.readFileSync(vcfPath),
            mimetype: 'text/vcard',
            fileName: `${groupMetadata.subject}.vcf`,
            caption: stylishCaption
        }, messageOptions);

        // Clean up the temporary file
        fs.unlinkSync(vcfPath);
        
    } catch (error) {
        console.log("Error while creating or sending VCF:", error.message || error);
        repondre("An error occurred while processing the VCF. Please try again.");
    }
});
