const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs-extra');
const { makeInMemoryStore } = require('@whiskeysockets/baileys');
const multer = require('multer');
const mime = require('mime-types');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const crypto = require('crypto');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set up session middleware with enhanced security
app.use(session({
  secret: process.env.SESSION_SECRET || 'elitechwiz-v4-secret',
  name: '_elitechwiz_sess', // Custom name to avoid default session ID name
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 4 * 60 * 60 * 1000, // 4 hours instead of 24 hours for security
    httpOnly: true,
    sameSite: 'strict',
    path: '/'
  }
}));

// Add session security middleware
app.use((req, res, next) => {
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Add session fingerprinting to prevent session hijacking
  if (req.session.isAuthenticated && !req.session.clientFingerprint) {
    // Create a fingerprint based on client info (user agent and partial IP)
    const userAgent = req.get('User-Agent') || 'unknown';
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const ipSegments = clientIP.split('.').slice(0, 2).join('.');
    
    req.session.clientFingerprint = crypto.createHash('sha256')
      .update(`${userAgent}:${ipSegments}:${process.env.SESSION_SECRET || 'elitechwiz-v4-secret'}`)
      .digest('hex');
  } else if (req.session.isAuthenticated && req.session.clientFingerprint) {
    // Verify fingerprint on each request to prevent session hijacking
    const userAgent = req.get('User-Agent') || 'unknown';
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const ipSegments = clientIP.split('.').slice(0, 2).join('.');
    
    const currentFingerprint = crypto.createHash('sha256')
      .update(`${userAgent}:${ipSegments}:${process.env.SESSION_SECRET || 'elitechwiz-v4-secret'}`)
      .digest('hex');
      
    if (currentFingerprint !== req.session.clientFingerprint) {
      // Potential session hijacking attempt - destroy session and redirect to login
      console.warn('Potential session hijacking detected - IP or browser changed during session');
      req.session.destroy();
      return res.redirect('/login');
    }
  }
  
  next();
});

// CSRF protection middleware
const csrfProtection = (req, res, next) => {
  // Skip for GET requests and non-API routes
  if (req.method === 'GET' || !req.path.startsWith('/api/')) {
    return next();
  }
  
  const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;
  
  if (!csrfToken || csrfToken !== req.session.csrfToken) {
    return res.status(403).json({ 
      success: false, 
      error: 'CSRF token validation failed' 
    });
  }
  
  next();
};

// Add CSRF protection after session middleware
app.use(csrfProtection);

// API endpoint to get CSRF token
app.get('/api/csrf-token', isAuthenticated, (req, res) => {
  // Generate a new CSRF token if none exists
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(64).toString('hex');
  }
  
  res.json({ csrfToken: req.session.csrfToken });
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'public', 'uploads');
    fs.ensureDirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = mime.extension(file.mimetype) || 'bin';
    cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
  }
});
const upload = multer({ storage: storage });

// Global storage for chats and contacts
const globalData = {
  chats: [],
  contacts: [],
  messages: {},
  unreadMessages: {},
  user: null,
  statusMessages: [],
  groupData: {}
};

// Set up Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Admin credentials storage with encryption
const ADMIN_CREDENTIALS_FILE = path.join(__dirname, 'admin_credentials.json');
let adminCredentials = [];

// Function to load admin credentials from file with decryption support
function loadAdminCredentials() {
  try {
    if (fs.existsSync(ADMIN_CREDENTIALS_FILE)) {
      const fileData = JSON.parse(fs.readFileSync(ADMIN_CREDENTIALS_FILE, 'utf8'));
      
      // Check if data is encrypted (v2 format)
      if (fileData.encrypted && fileData.version === 'v2') {
        const encryptionKey = crypto.createHash('sha256')
          .update(process.env.SESSION_SECRET || 'elitechwiz-v4-secret')
          .digest();
          
        try {
          // Decrypt the data
          const decryptedData = decryptData(fileData.data, encryptionKey);
          return JSON.parse(decryptedData);
        } catch (decryptError) {
          console.error('Failed to decrypt admin credentials:', decryptError);
          return []; // Return empty array to trigger creation of default admin
        }
      } else {
        // Legacy format or unencrypted data
        return fileData;
      }
    }
    return []; // No file exists
  } catch (error) {
    console.error('Error reading admin credentials file:', error);
    return []; // Return empty array to trigger creation of default admin
  }
}

// Initialize admin credentials
try {
  adminCredentials = loadAdminCredentials();
  
  if (!adminCredentials || (Array.isArray(adminCredentials) && adminCredentials.length === 0)) {
    // Use custom credentials with stronger encryption
    const defaultUsername = "elitechwiz"; // Custom username
    const defaultPassword = "@Elitechwiz1234"; // Custom password
    
    // Use stronger encryption for password with higher salt rounds
    const saltRounds = 14; // Higher salt rounds for better security
    const passwordHash = bcrypt.hashSync(defaultPassword, saltRounds);
    
    // Create admin credentials with additional security markers
    const securityKey = crypto.randomBytes(32).toString('hex');
    
    // Create admin data object
    adminCredentials = {
      username: defaultUsername,
      passwordHash: passwordHash, // Store as passwordHash for consistency
      role: 'admin',
      securityKey: securityKey,
      createdAt: new Date().toISOString(),
      passwordVersion: 2
    };
    
    // Add verification hash
    const verificationHash = crypto.createHash('sha256')
      .update(`${adminCredentials.username}:${adminCredentials.passwordHash}:${adminCredentials.securityKey}`)
      .digest('hex');
    adminCredentials.verificationHash = verificationHash;
    
    // Encrypt and save credentials
    const configPath = path.join(__dirname, 'config', 'admin.json');
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    
    const encryptedData = encryptAdminCredentials(adminCredentials);
    fs.writeFileSync(configPath, JSON.stringify(encryptedData));
    
    console.log('Default admin account created successfully');
  }
} catch (error) {
  console.error('Error setting up admin credentials:', error);
  // Create with defaults if error - using custom credentials
  const defaultUsername = "elitechwiz";
  const defaultPassword = "@Elitechwiz1234";
  const saltRounds = 14;
  const passwordHash = bcrypt.hashSync(defaultPassword, saltRounds);
  const securityKey = crypto.randomBytes(32).toString('hex');
  
  adminCredentials = {
    username: defaultUsername,
    passwordHash: passwordHash,
    role: 'admin',
    securityKey: securityKey,
    createdAt: new Date().toISOString(),
    passwordVersion: 2
  };
  
  console.warn('Created emergency admin credentials due to initialization error');
}

// Store for verification codes
const verificationCodes = new Map();

// Function to generate a secure verification code
function generateVerificationCode() {
  // Generate a 6-digit code
  return crypto.randomInt(100000, 999999).toString();
}

// Function to encrypt sensitive data
function encryptData(data, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to decrypt sensitive data
function decryptData(data, key) {
  const textParts = data.split(':');
  const iv = Buffer.from(textParts[0], 'hex');
  const encryptedText = Buffer.from(textParts[1], 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated && req.session.user) {
    return next();
  }
  res.redirect('/login');
};

// Admin role check middleware
const isAdmin = (req, res, next) => {
  if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'system-admin')) {
    return next();
  }
  res.status(403).send('Access denied: Admin privileges required');
};

// Login page
app.get('/login', (req, res) => {
  // If already authenticated, redirect to home
  if (req.session.isAuthenticated) {
    return res.redirect('/');
  }
  
  // Check if logo exists
  const logoExists = fs.existsSync(path.join(__dirname, 'public', 'img', 'logo.png'));
  
  // Render login page
  res.render('login', { logoExists });
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
    
    // Load admin credentials
    const adminData = loadAdminCredentials();
    
    // Handle legacy array format during transition
    if (Array.isArray(adminData)) {
      const admin = adminData.find(a => a.username.toLowerCase() === username.toLowerCase());
      
      if (!admin) {
        // Delay response for security
        await new Promise(resolve => setTimeout(resolve, 1000));
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      
      // Check if using old password field or new passwordHash
      const passwordToCheck = admin.passwordHash || admin.password;
      const isValidPassword = await bcrypt.compare(password, passwordToCheck);
      
      if (!isValidPassword) {
        // Delay response for security
        await new Promise(resolve => setTimeout(resolve, 1000));
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      
      // Set up session
      req.session.isAuthenticated = true;
      req.session.user = {
        username: admin.username,
        role: admin.role || 'admin',
        securityKey: admin.securityKey,
        passwordVersion: admin.passwordVersion || 1
      };
    } 
    // New object format
    else {
      // Check if username matches (case insensitive)
      if (username.toLowerCase() !== adminData.username.toLowerCase()) {
        // Delay response for security (prevent username enumeration)
        await new Promise(resolve => setTimeout(resolve, 1000));
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, adminData.passwordHash);
      if (!isValidPassword) {
        // Delay response for security
        await new Promise(resolve => setTimeout(resolve, 1000));
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      
      // Set up session
      req.session.isAuthenticated = true;
      req.session.user = {
        username: adminData.username,
        role: adminData.role,
        securityKey: adminData.securityKey,
        passwordVersion: adminData.passwordVersion || 1
      };
    }
    
    // Create fingerprint for the session
    const userAgent = req.get('User-Agent') || 'unknown';
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const ipSegments = clientIP.split('.').slice(0, 2).join('.');
    
    req.session.clientFingerprint = crypto.createHash('sha256')
      .update(`${userAgent}:${ipSegments}:${process.env.SESSION_SECRET || 'elitechwiz-v4-secret'}`)
      .digest('hex');
    
    // Log successful login with masked IP
    const maskedIP = clientIP.replace(/\d+\.\d+$/, 'XX.XX');
    console.log(`Successful login: ${req.session.user.username} from ${maskedIP}`);
    
    return res.json({ success: true, message: 'Login successful', redirect: '/' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Function to check if signup is allowed
function canSignup() {
  try {
    // Check if admin credentials exist
    const adminData = loadAdminCredentials();
    
    // Allow signup if no admin exists
    if (!adminData || (Array.isArray(adminData) && adminData.length === 0)) {
      return true;
    }
    
    // Additional checks can be added here for custom signup rules
    
    return false;
  } catch (error) {
    console.error('Error checking signup status:', error);
    return false;
  }
}

// Function to check if any admin credentials exist
function hasAdminCredentials() {
  try {
    const adminData = loadAdminCredentials();
    return !!adminData && (Array.isArray(adminData) ? adminData.length > 0 : true);
  } catch (error) {
    console.error('Error checking admin credentials:', error);
    return false;
  }
}

// Modified signup route to skip verification for first admin
app.get('/signup', (req, res) => {
  if (req.session.isAuthenticated) {
    return res.redirect('/');
  }
  
  // Only allow signup if no admins yet or in setup mode
  if (!canSignup()) {
    return res.redirect('/login');
  }
  
  // If any admin accounts already exist, require verification
  // For first admin account, no verification is needed
  const requireVerification = hasAdminCredentials();
  
  // Check if logo exists
  const logoExists = fs.existsSync(path.join(__dirname, 'public', 'img', 'logo.png'));
  
  res.render('signup', { 
    error: null, 
    success: null, 
    requireVerification,
    logoExists
  });
});

app.post('/signup', async (req, res) => {
  try {
    // Only allow signup if no admins yet or in setup mode
    if (!canSignup()) {
      return res.redirect('/login');
    }
    
    const { username, password, confirmPassword, ownerCode } = req.body;
    const requireVerification = hasAdminCredentials();
    
    // Check if logo exists
    const logoExists = fs.existsSync(path.join(__dirname, 'public', 'img', 'logo.png'));
    
    // Verify owner code only if verification is required
    if (requireVerification) {
      // Validate owner verification code
      if (!verificationCodes.has(ownerCode)) {
        return res.render('signup', { 
          error: 'Invalid verification code. Please request a new code.', 
          success: null,
          requireVerification,
          logoExists
        });
      }
      
      // Check if verification code has expired (15 minutes)
      const codeInfo = verificationCodes.get(ownerCode);
      const now = Date.now();
      if (now > codeInfo.expiry) {
        verificationCodes.delete(ownerCode);
        return res.render('signup', { 
          error: 'Verification code has expired. Please request a new code.', 
          success: null,
          requireVerification,
          logoExists
        });
      }
      
      // Verify that the code matches the intended owner's phone number
      if (codeInfo.phone !== process.env.NUMERO_OWNER) {
        return res.render('signup', { 
          error: 'This verification code is not valid for the bot owner.', 
          success: null,
          requireVerification,
          logoExists
        });
      }
    }
    
    // Validate password
    if (password !== confirmPassword) {
      return res.render('signup', { 
        error: 'Passwords do not match.', 
        success: null,
        requireVerification,
        logoExists
      });
    }
    
    // Check password strength (updated to match new requirements)
    if (password.length < 12) {
      return res.render('signup', { 
        error: 'Password must be at least 12 characters long', 
        success: null,
        requireVerification,
        logoExists
      });
    }
    
    // Check password complexity
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSpecial) {
      return res.render('signup', { 
        error: 'Password must include uppercase letters, lowercase letters, numbers, and special characters', 
        success: null,
        requireVerification,
        logoExists
      });
    }
    
    // Hash password with strong settings
    const saltRounds = 14;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const securityKey = crypto.randomBytes(32).toString('hex');
    
    // Create new admin data object
    const adminData = {
      username,
      passwordHash,
      role: 'admin',
      securityKey,
      createdAt: new Date().toISOString(),
      passwordVersion: 2,
      systemGenerated: false
    };
    
    // Add verification hash
    const verificationHash = crypto.createHash('sha256')
      .update(`${adminData.username}:${adminData.passwordHash}:${adminData.securityKey}`)
      .digest('hex');
    adminData.verificationHash = verificationHash;
    
    // Encrypt and save admin data
    const configPath = path.join(__dirname, 'config', 'admin.json');
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    
    const encryptedData = encryptAdminCredentials(adminData);
    fs.writeFileSync(configPath, JSON.stringify(encryptedData));
    
    // Delete the used verification code if verification was required
    if (requireVerification && ownerCode) {
      verificationCodes.delete(ownerCode);
    }
    
    // Show success message
    return res.render('signup', { 
      error: null, 
      success: 'Admin account created successfully! You can now log in.',
      requireVerification,
      logoExists
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    const logoExists = fs.existsSync(path.join(__dirname, 'public', 'img', 'logo.png'));
    res.render('signup', { 
      error: 'An error occurred during signup. Please try again.', 
      success: null,
      requireVerification: hasAdminCredentials(),
      logoExists
    });
  }
});

// Generate verification code and send to owner's WhatsApp
app.get('/generate-code', async (req, res) => {
  try {
    // Only allow generation if signup is possible
    if (!canSignup()) {
      return res.status(403).json({ 
        success: false, 
        error: 'Signup is not allowed at this time' 
      });
    }
    
    const ownerNumber = process.env.NUMERO_OWNER;
    
    // Validate owner number format - make sure it has @s.whatsapp.net
    const formattedOwnerNumber = ownerNumber.includes('@s.whatsapp.net') 
      ? ownerNumber 
      : `${ownerNumber}@s.whatsapp.net`;
    
    // Generate a verification code
    const code = generateVerificationCode();
    
    // Store the code with expiry (15 minutes) and the owner's phone
    verificationCodes.set(code, {
      phone: ownerNumber,
      expiry: Date.now() + (15 * 60 * 1000)  // 15 minutes in milliseconds
    });
    
    // Send the code to the owner's WhatsApp
    await hn.sendMessage(formattedOwnerNumber, {
      text: `🔐 EliTechWiz-V4 Admin Verification Code: ${code}\n\nThis code will expire in 15 minutes. Keep it confidential.`
    });
    
    res.json({ 
      success: true, 
      message: 'Verification code sent to your WhatsApp number'
    });
  } catch (error) {
    console.error('Error generating verification code:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send verification code'
    });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Protected routes
app.get('/', isAuthenticated, (req, res) => {
  res.render('index', { 
    title: 'EliTechWiz-V4 Web', 
    botName: process.env.BOT_NAME || '𝓔𝓵𝓲𝓣𝓮𝓬𝓱𝓦𝓲𝔃-𝓥4' 
  });
});

// API routes
app.get('/api/user', isAuthenticated, (req, res) => {
  res.json(globalData.user || {});
});

app.get('/api/chats', isAuthenticated, (req, res) => {
  res.json(globalData.chats);
});

app.get('/api/contacts', isAuthenticated, (req, res) => {
  res.json(globalData.contacts);
});

app.get('/api/messages/:chatId', isAuthenticated, (req, res) => {
  const { chatId } = req.params;
  res.json(globalData.messages[chatId] || []);
});

app.post('/api/user/status', isAuthenticated, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'Status text is required' });
    }
    await hn.updateProfileStatus(status);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/user/name', isAuthenticated, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    await hn.updateProfileName(name);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/user/picture', upload.single('image'), isAuthenticated, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Image file is required' });
    }
    const imageBuffer = await fs.readFile(req.file.path);
    await hn.updateProfilePicture(hn.user.id, imageBuffer);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Status/Story API
app.get('/api/status', isAuthenticated, (req, res) => {
  res.json(globalData.statusMessages);
});

app.post('/api/status', upload.single('media'), isAuthenticated, async (req, res) => {
  try {
    const { caption } = req.body;
    let mediaData;
    
    if (req.file) {
      // Handle media status
      const filePath = req.file.path;
      const buffer = await fs.readFile(filePath);
      const mimeType = req.file.mimetype;
      
      if (mimeType.startsWith('image/')) {
        mediaData = {
          image: { url: buffer },
          caption: caption || ''
        };
      } else if (mimeType.startsWith('video/')) {
        mediaData = {
          video: { url: buffer },
          caption: caption || ''
        };
      } else {
        return res.status(400).json({ success: false, error: 'Unsupported media type' });
      }
    } else if (caption) {
      // Handle text-only status
      mediaData = {
        text: caption
      };
    } else {
      return res.status(400).json({ success: false, error: 'Either media or caption is required' });
    }
    
    await hn.sendMessage('status@broadcast', mediaData);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Group Management API
app.get('/api/groups', isAuthenticated, (req, res) => {
  const groups = globalData.chats.filter(chat => chat.isGroup);
  res.json(groups);
});

app.get('/api/group/:groupId', isAuthenticated, async (req, res) => {
  try {
    const { groupId } = req.params;
    
    // Check if we have cached data
    if (globalData.groupData[groupId] && Date.now() - globalData.groupData[groupId].timestamp < 60000) {
      return res.json(globalData.groupData[groupId].data);
    }
    
    // Fetch from WhatsApp
    const metadata = await hn.groupMetadata(groupId);
    
    // Cache the result
    globalData.groupData[groupId] = {
      data: metadata,
      timestamp: Date.now()
    };
    
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/group/create', isAuthenticated, async (req, res) => {
  try {
    const { name, participants } = req.body;
    
    if (!name || !participants || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ success: false, error: 'Name and at least one participant are required' });
    }
    
    // Format participants to the required format
    const formattedParticipants = participants.map(p => p.endsWith('@s.whatsapp.net') ? p : `${p}@s.whatsapp.net`);
    
    const result = await hn.groupCreate(name, formattedParticipants);
    res.json({ success: true, group: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/group/participants/update', isAuthenticated, async (req, res) => {
  try {
    const { groupId, participants, action } = req.body;
    
    if (!groupId || !participants || !Array.isArray(participants) || participants.length === 0 || !action) {
      return res.status(400).json({ success: false, error: 'GroupId, participants array, and action are required' });
    }
    
    if (!['add', 'remove', 'promote', 'demote'].includes(action)) {
      return res.status(400).json({ success: false, error: 'Invalid action. Must be add, remove, promote, or demote' });
    }
    
    // Format participants
    const formattedParticipants = participants.map(p => p.endsWith('@s.whatsapp.net') ? p : `${p}@s.whatsapp.net`);
    
    const result = await hn.groupParticipantsUpdate(groupId, formattedParticipants, action);
    
    // Clear cached group data
    delete globalData.groupData[groupId];
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/group/settings/update', isAuthenticated, async (req, res) => {
  try {
    const { groupId, setting, value } = req.body;
    
    if (!groupId || !setting) {
      return res.status(400).json({ success: false, error: 'GroupId and setting are required' });
    }
    
    let result;
    
    switch (setting) {
      case 'subject':
        result = await hn.groupUpdateSubject(groupId, value);
        break;
      case 'description':
        result = await hn.groupUpdateDescription(groupId, value);
        break;
      case 'restrict':
        result = await hn.groupSettingUpdate(groupId, 'announcement');
        break;
      case 'announce':
        result = await hn.groupSettingUpdate(groupId, 'not_announcement');
        break;
      default:
        return res.status(400).json({ success: false, error: 'Invalid setting' });
    }
    
    // Clear cached group data
    delete globalData.groupData[groupId];
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/group/leave', isAuthenticated, async (req, res) => {
  try {
    const { groupId } = req.body;
    
    if (!groupId) {
      return res.status(400).json({ success: false, error: 'GroupId is required' });
    }
    
    await hn.groupLeave(groupId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/group/invite', isAuthenticated, async (req, res) => {
  try {
    const { groupId } = req.body;
    
    if (!groupId) {
      return res.status(400).json({ success: false, error: 'GroupId is required' });
    }
    
    const code = await hn.groupInviteCode(groupId);
    res.json({ success: true, code });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Message API endpoints
app.post('/api/message/send', isAuthenticated, async (req, res) => {
  try {
    const { chatId, text, quotedMessageId } = req.body;
    
    if (!chatId || !text) {
      return res.status(400).json({ success: false, error: 'ChatId and text are required' });
    }
    
    let quoted = undefined;
    if (quotedMessageId && globalData.messages[chatId]) {
      const quotedMsg = globalData.messages[chatId].find(m => m.id === quotedMessageId);
      if (quotedMsg) {
        // Create a quoted message object based on the original message
        quoted = {
          key: {
            remoteJid: chatId,
            id: quotedMessageId,
            fromMe: quotedMsg.fromMe
          },
          message: {
            conversation: quotedMsg.message
          }
        };
      }
    }
    
    const result = await hn.sendMessage(chatId, { text }, { quoted });
    res.json({ success: true, messageId: result.key.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/message/media', upload.single('media'), isAuthenticated, async (req, res) => {
  try {
    const { chatId, caption, type } = req.body;
    
    if (!chatId || !req.file) {
      return res.status(400).json({ success: false, error: 'ChatId and media file are required' });
    }
    
    const buffer = await fs.readFile(req.file.path);
    const mimeType = req.file.mimetype;
    let messageData;
    
    if (mimeType.startsWith('image/')) {
      messageData = {
        image: buffer,
        caption: caption || '',
        mimetype: mimeType
      };
    } else if (mimeType.startsWith('video/')) {
      messageData = {
        video: buffer,
        caption: caption || '',
        mimetype: mimeType
      };
    } else if (mimeType.startsWith('audio/')) {
      messageData = {
        audio: buffer,
        mimetype: mimeType,
        ptt: type === 'voice'
      };
    } else if (mimeType === 'application/pdf' || mimeType.includes('document')) {
      messageData = {
        document: buffer,
        mimetype: mimeType,
        fileName: req.file.originalname
      };
    } else {
      return res.status(400).json({ success: false, error: 'Unsupported media type' });
    }
    
    const result = await hn.sendMessage(chatId, messageData);
    res.json({ success: true, messageId: result.key.id });
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/message/read', isAuthenticated, async (req, res) => {
  try {
    const { chatId } = req.body;
    
    if (!chatId) {
      return res.status(400).json({ success: false, error: 'ChatId is required' });
    }
    
    // Mark messages as read
    await hn.readMessages([{ remoteJid: chatId, count: 999 }]);
    
    // Update local data
    globalData.unreadMessages[chatId] = 0;
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/message/delete', isAuthenticated, async (req, res) => {
  try {
    const { chatId, messageId, forEveryone } = req.body;
    
    if (!chatId || !messageId) {
      return res.status(400).json({ success: false, error: 'ChatId and messageId are required' });
    }
    
    const key = {
      remoteJid: chatId,
      id: messageId,
      fromMe: true
    };
    
    await hn.sendMessage(chatId, { delete: key }, { forEveryone: forEveryone });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Contact API endpoints
app.get('/api/contacts/blocked', isAuthenticated, async (req, res) => {
  try {
    const blockedContacts = await hn.fetchBlocklist();
    res.json(blockedContacts);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/contacts/block', isAuthenticated, async (req, res) => {
  try {
    const { jid } = req.body;
    
    if (!jid) {
      return res.status(400).json({ success: false, error: 'Contact JID is required' });
    }
    
    await hn.updateBlockStatus(jid, "block");
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/contacts/unblock', isAuthenticated, async (req, res) => {
  try {
    const { jid } = req.body;
    
    if (!jid) {
      return res.status(400).json({ success: false, error: 'Contact JID is required' });
    }
    
    await hn.updateBlockStatus(jid, "unblock");
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// IP-based access control system
const ipAccessControl = (() => {
  // Default to blocked if no allowed IPs specified
  let allowedIPs = [];
  let allowLocalAccess = true; // Allow access from localhost by default
  let ipAccessEnabled = false; // Disabled by default
  
  const configPath = path.join(__dirname, 'config', 'ip_access.json');
  
  // Load IP access configuration
  const loadConfig = () => {
    try {
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        allowedIPs = config.allowedIPs || [];
        allowLocalAccess = config.allowLocalAccess !== false;
        ipAccessEnabled = config.enabled === true;
        
        console.log(`IP access control ${ipAccessEnabled ? 'enabled' : 'disabled'}`);
        if (ipAccessEnabled) {
          console.log(`Allowed IPs: ${allowedIPs.length > 0 ? allowedIPs.join(', ') : 'None'}`);
          console.log(`Local access: ${allowLocalAccess ? 'Allowed' : 'Blocked'}`);
        }
      } else {
        // Create default configuration if it doesn't exist
        const defaultConfig = {
          enabled: false,
          allowedIPs: [],
          allowLocalAccess: true
        };
        fs.mkdirSync(path.dirname(configPath), { recursive: true });
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
      }
    } catch (error) {
      console.error('Error loading IP access configuration:', error.message);
    }
  };
  
  // Save IP access configuration
  const saveConfig = () => {
    try {
      const config = {
        enabled: ipAccessEnabled,
        allowedIPs,
        allowLocalAccess
      };
      fs.mkdirSync(path.dirname(configPath), { recursive: true });
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      console.error('Error saving IP access configuration:', error.message);
    }
  };
  
  // Initialize
  loadConfig();
  
  return {
    middleware: (req, res, next) => {
      // Skip if IP access control is disabled
      if (!ipAccessEnabled) {
        return next();
      }
      
      const clientIP = req.ip || req.connection.remoteAddress || '';
      
      // Always allow access to the login page
      if (req.path === '/login') {
        return next();
      }
      
      // Check if it's a local IP address
      const isLocalIP = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(clientIP) || 
                        clientIP.startsWith('192.168.') || 
                        clientIP.startsWith('10.') || 
                        clientIP.startsWith('172.16.');
      
      // Allow if it's a local IP and local access is allowed
      if (isLocalIP && allowLocalAccess) {
        return next();
      }
      
      // Check if the IP is in the allowed list
      if (allowedIPs.includes(clientIP)) {
        return next();
      }
      
      // If we get here, the IP is not allowed
      console.warn(`Access denied for IP: ${clientIP.replace(/\d+\.\d+$/, 'XX.XX')}`);
      return res.status(403).send('Access denied. Your IP is not authorized to access this server.');
    },
    addAllowedIP: (ip) => {
      if (!allowedIPs.includes(ip)) {
        allowedIPs.push(ip);
        saveConfig();
        return true;
      }
      return false;
    },
    removeAllowedIP: (ip) => {
      const index = allowedIPs.indexOf(ip);
      if (index !== -1) {
        allowedIPs.splice(index, 1);
        saveConfig();
        return true;
      }
      return false;
    },
    setLocalAccess: (allow) => {
      if (allowLocalAccess !== allow) {
        allowLocalAccess = allow;
        saveConfig();
      }
      return allowLocalAccess;
    },
    setEnabled: (enabled) => {
      if (ipAccessEnabled !== enabled) {
        ipAccessEnabled = enabled;
        saveConfig();
      }
      return ipAccessEnabled;
    },
    getConfig: () => {
      return {
        enabled: ipAccessEnabled,
        allowedIPs: [...allowedIPs],
        allowLocalAccess
      };
    },
    reloadConfig: () => {
      loadConfig();
      return {
        enabled: ipAccessEnabled,
        allowedIPs: [...allowedIPs],
        allowLocalAccess
      };
    }
  };
})();

// Apply IP access control middleware
app.use(ipAccessControl.middleware);

// API endpoint to manage IP access control (admin only)
app.post('/api/security/ip-access', isAuthenticated, isAdmin, (req, res) => {
  const { action, ip, enabled, allowLocal } = req.body;
  
  try {
    if (action === 'add' && ip) {
      const result = ipAccessControl.addAllowedIP(ip);
      res.json({ success: result, message: result ? 'IP added to whitelist' : 'IP already in whitelist' });
    } 
    else if (action === 'remove' && ip) {
      const result = ipAccessControl.removeAllowedIP(ip);
      res.json({ success: result, message: result ? 'IP removed from whitelist' : 'IP not found in whitelist' });
    }
    else if (action === 'setLocalAccess' && allowLocal !== undefined) {
      const result = ipAccessControl.setLocalAccess(!!allowLocal);
      res.json({ success: true, localAccess: result });
    }
    else if (action === 'setEnabled' && enabled !== undefined) {
      const result = ipAccessControl.setEnabled(!!enabled);
      res.json({ success: true, enabled: result });
    }
    else if (action === 'getConfig') {
      res.json({ success: true, config: ipAccessControl.getConfig() });
    }
    else if (action === 'reload') {
      const config = ipAccessControl.reloadConfig();
      res.json({ success: true, config });
    }
    else {
      res.status(400).json({ success: false, message: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error in IP access control API:', error);
    res.status(500).json({ success: false, message: 'Server error processing your request' });
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected to web interface');
  
  // Send initial data
  socket.emit('user-info', globalData.user);
  socket.emit('chats-update', globalData.chats);
  
  // Handle send message request from web interface
  socket.on('send-message', async (data) => {
    const { chatId, message } = data;
    try {
      // Send message via WhatsApp client
      await hn.sendMessage(chatId, { text: message });
      
      socket.emit('message-status', { 
        id: Date.now(), 
        status: 'sent', 
        chatId, 
        message 
      });
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('read-messages', async (data) => {
    try {
      const { chatId } = data;
      
      // Mark messages as read
      await hn.readMessages([{ remoteJid: chatId, count: 999 }]);
      
      // Update unread count
      globalData.unreadMessages[chatId] = 0;
      
      // Emit event
      io.emit('messages-read', { chatId });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });

  socket.on('fetch-group-info', async (data) => {
    try {
      const { groupId } = data;
      const metadata = await hn.groupMetadata(groupId);
      socket.emit('group-info', { groupId, metadata });
    } catch (error) {
      console.error('Error fetching group info:', error);
      socket.emit('error', { message: 'Failed to fetch group info' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from web interface');
  });
});

// Function to initialize the web server
const startWebServer = (hn, store) => {
  // Set port
  const PORT = process.env.PORT || 5000;
  
  // Start server
  server.listen(PORT, () => {
    console.log(`Web interface running on port ${PORT}`);
  });

  // Function to update chats
  const updateChats = async () => {
    try {
      if (store) {
        // Get all chats from the store
        const chats = store.chats.all();
        
        // Format chats for the web interface
        const formattedChats = chats.map(chat => {
          return {
            id: chat.id,
            name: chat.name || 'Unknown',
            lastMessage: chat.messages && chat.messages.length > 0 
              ? chat.messages[chat.messages.length - 1].message?.conversation || 'No messages'
              : 'No messages',
            timestamp: chat.messages && chat.messages.length > 0 
              ? chat.messages[chat.messages.length - 1].messageTimestamp 
              : Date.now(),
            unreadCount: globalData.unreadMessages[chat.id] || 0,
            isGroup: chat.id.endsWith('@g.us'),
            participants: chat.participants || []
          };
        });
        
        // Update global data
        globalData.chats = formattedChats;
        
        // Emit to all connected clients
        io.emit('chats-update', formattedChats);
      }
    } catch (error) {
      console.error('Error updating chats:', error);
    }
  };

  // Update user info
  const updateUserInfo = () => {
    try {
      if (hn.user) {
        globalData.user = {
          id: hn.user.id,
          name: hn.user.name,
          status: hn.user.status || 'Available',
          imgUrl: hn.profilePictureUrl
        };
        
        io.emit('user-info', globalData.user);
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  // Listen for WhatsApp events and update web interface
  
  // User authentication
  hn.ev.on('creds.update', updateUserInfo);
  
  // New message event
  hn.ev.on('messages.upsert', async (m) => {
    try {
      const { messages } = m;
      
      for (const message of messages) {
        const chatId = message.key.remoteJid;
        
        // Skip status messages
        if (chatId === 'status@broadcast') {
          // Handle status update
          const formattedStatus = {
            id: message.key.id,
            sender: message.key.participant || message.key.remoteJid,
            timestamp: message.messageTimestamp,
            type: Object.keys(message.message || {})[0],
            content: message.message
          };
          
          globalData.statusMessages.push(formattedStatus);
          io.emit('status-update', formattedStatus);
          continue;
        }
        
        // Initialize messages array for the chat if not exists
        if (!globalData.messages[chatId]) {
          globalData.messages[chatId] = [];
        }
        
        // Format message
        const formattedMessage = {
          id: message.key.id,
          chatId: chatId,
          sender: message.key.fromMe ? 'me' : message.pushName || chatId.split('@')[0],
          message: message.message?.conversation || 
                  message.message?.imageMessage?.caption || 
                  message.message?.videoMessage?.caption || 
                  message.message?.extendedTextMessage?.text ||
                  'Media message',
          timestamp: message.messageTimestamp,
          hasMedia: !!message.message?.imageMessage || 
                    !!message.message?.videoMessage || 
                    !!message.message?.audioMessage || 
                    !!message.message?.documentMessage,
          mediaType: message.message?.imageMessage ? 'image' : 
                    message.message?.videoMessage ? 'video' : 
                    message.message?.audioMessage ? 'audio' : 
                    message.message?.documentMessage ? 'document' : null,
          fromMe: message.key.fromMe,
          quoted: message.message?.extendedTextMessage?.contextInfo?.quotedMessage ? {
            id: message.message.extendedTextMessage.contextInfo.stanzaId,
            sender: message.message.extendedTextMessage.contextInfo.participant,
            message: message.message.extendedTextMessage.contextInfo.quotedMessage?.conversation ||
                    'Media message'
          } : null
        };
        
        // Add to messages array
        globalData.messages[chatId].push(formattedMessage);
        
        // Track unread messages
        if (!message.key.fromMe) {
          globalData.unreadMessages[chatId] = (globalData.unreadMessages[chatId] || 0) + 1;
        }
        
        // Update chats list
        updateChats();
        
        // Emit new message to clients
        io.emit('new-message', formattedMessage);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  // Read messages event
  hn.ev.on('message-read', async ({ jid, count }) => {
    try {
      // Reset unread count
      globalData.unreadMessages[jid] = 0;
      
      // Update chats
      updateChats();
      
      // Emit read event
      io.emit('messages-read', { chatId: jid });
    } catch (error) {
      console.error('Error processing read event:', error);
    }
  });
  
  // Contact update event
  hn.ev.on('contacts.update', async (contacts) => {
    try {
      for (const contact of contacts) {
        const index = globalData.contacts.findIndex(c => c.id === contact.id);
        
        if (index !== -1) {
          // Update existing contact
          globalData.contacts[index] = {
            ...globalData.contacts[index],
            ...contact
          };
        } else {
          // Add new contact
          globalData.contacts.push(contact);
        }
      }
      
      // Emit contacts update
      io.emit('contacts-update', globalData.contacts);
    } catch (error) {
      console.error('Error updating contacts:', error);
    }
  });
  
  // Group participants update
  hn.ev.on('group-participants.update', async (update) => {
    try {
      const { id, participants, action } = update;
      
      // Clear cached group data
      delete globalData.groupData[id];
      
      // Fetch updated group metadata
      const metadata = await hn.groupMetadata(id);
      
      // Update global data
      globalData.groupData[id] = {
        data: metadata,
        timestamp: Date.now()
      };
      
      // Emit event
      io.emit('group-update', { 
        groupId: id, 
        participants, 
        action,
        metadata 
      });
      
      // Update chats
      updateChats();
    } catch (error) {
      console.error('Error handling group participants update:', error);
    }
  });
  
  // Group settings update
  hn.ev.on('groups.update', async (updates) => {
    try {
      for (const update of updates) {
        const { id } = update;
        
        // Clear cached group data
        delete globalData.groupData[id];
        
        // Update global data
        if (globalData.groupData[id]) {
          globalData.groupData[id].data = {
            ...globalData.groupData[id].data,
            ...update
          };
          globalData.groupData[id].timestamp = Date.now();
        }
        
        // Emit event
        io.emit('group-settings-update', update);
      }
      
      // Update chats
      updateChats();
    } catch (error) {
      console.error('Error handling group settings update:', error);
    }
  });
  
  // Connection update
  hn.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'open') {
      console.log('WhatsApp connection is now open and ready');
      updateUserInfo();
      updateChats();
    }
    
    if (connection === 'close') {
      console.log('WhatsApp connection closed');
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      io.emit('connection-status', { status: 'disconnected', statusCode });
    }
    
    io.emit('connection-status', { status: connection });
  });
  
  // Initial load
  setTimeout(() => {
    updateUserInfo();
    updateChats();
  }, 5000);
  
  return {
    updateChats,
    updateUserInfo,
    getGlobalData: () => globalData
  };
};

// API endpoint for changing admin password
app.post('/api/account/change-password', isAuthenticated, isAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'Both current and new password are required' });
  }
  
  try {
    // Load admin credentials
    const adminData = loadAdminCredentials();
    
    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, adminData.passwordHash);
    if (!isValid) {
      // Delayed response for security
      await new Promise(resolve => setTimeout(resolve, 1000));
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    
    // Validate new password
    if (newPassword.length < 12) {
      return res.status(400).json({ success: false, message: 'Password must be at least 12 characters long' });
    }
    
    // Check password complexity
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumbers = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    
    if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSpecial) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must include uppercase letters, lowercase letters, numbers, and special characters' 
      });
    }
    
    // Hash new password
    const saltRounds = 14; // Increased for better security
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    
    // Update admin credentials
    adminData.passwordHash = newPasswordHash;
    adminData.passwordVersion = 2; // Mark as upgraded password hash
    adminData.securityKey = crypto.randomBytes(32).toString('hex'); // Refresh security key
    adminData.passwordLastChanged = new Date().toISOString();
    
    // Verify hash to prevent any accidental corruption
    const verificationHash = crypto.createHash('sha256')
      .update(`${adminData.username}:${adminData.passwordHash}:${adminData.securityKey}`)
      .digest('hex');
    adminData.verificationHash = verificationHash;
    
    // Save updated credentials
    const configPath = path.join(__dirname, 'config', 'admin.json');
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    
    // Encrypt admin data
    const encryptedData = encryptAdminCredentials(adminData);
    fs.writeFileSync(configPath, JSON.stringify(encryptedData));
    
    // Refresh session with new security data
    if (req.session.user) {
      req.session.user.securityKey = adminData.securityKey;
      req.session.user.passwordVersion = adminData.passwordVersion;
    }
    
    // Log the password change (with masked IP)
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const maskedIP = clientIP.replace(/\d+\.\d+$/, 'XX.XX');
    console.log(`Admin password changed successfully by ${req.session.user.username} from ${maskedIP}`);
    
    return res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (error) {
    console.error('Error changing admin password:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while changing the password' });
  }
});

// Function to encrypt admin credentials for secure storage
function encryptAdminCredentials(adminData) {
  try {
    // Generate encryption key from environment or fixed source
    const encryptKey = process.env.ENCRYPT_KEY || 'elitechwiz-v4-encryption-key';
    const iv = crypto.randomBytes(16);
    
    // Create cipher and encrypt
    const cipher = crypto.createCipheriv('aes-256-cbc', 
      crypto.createHash('sha256').update(encryptKey).digest(), iv);
    
    // Stringify and encrypt the admin data
    let encryptedData = cipher.update(JSON.stringify(adminData), 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    
    // Return encrypted data with IV and format version
    return {
      version: 'v2',
      iv: iv.toString('hex'),
      data: encryptedData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error encrypting admin credentials:', error);
    throw error;
  }
}

module.exports = { startWebServer }; 