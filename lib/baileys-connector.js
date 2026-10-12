'use strict';

const fs = require('fs');
const path = require('path');
const pino = require('pino');
const portalState = require('./portal-state');

const AUTH_DIR = path.join(__dirname, '..', 'auth');

function loadBaileys() {
  const baileys = require('@whiskeysockets/baileys');
  return baileys.default && baileys.useMultiFileAuthState ? baileys : baileys;
}

async function start(options) {
  options = options || {};
  if (global.__ELITECHWIZ_SOCKET_STARTED__) {
    return global.__ELITECHWIZ_SOCKET_STARTED__;
  }

  fs.mkdirSync(AUTH_DIR, { recursive: true });
  resetIncompleteSession();
  const baileys = loadBaileys();
  const makeWASocket = baileys.default || baileys.makeWASocket || baileys;
  const { useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = baileys;
  const makeCacheableSignalKeyStore = baileys.makeCacheableSignalKeyStore;
  const Boom = require('@hapi/boom').Boom;

  let version = [2, 3000, 1025195018];
  try {
    const latest = await fetchLatestBaileysVersion();
    if (latest && Array.isArray(latest.version)) version = latest.version;
  } catch (err) {
    console.log('[wa] using fallback WhatsApp version', version, err && err.message);
  }
  console.log('[wa] using WhatsApp web version', version.join('.'));

  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  const logger = pino({ level: 'silent' });
  const browser = (baileys.Browsers && baileys.Browsers.ubuntu)
    ? baileys.Browsers.ubuntu('Chrome')
    : ['Ubuntu', 'Chrome', '22.04.4'];
  const sockOptions = {
    version,
    logger,
    browser,
    printQRInTerminal: false,
    markOnlineOnConnect: false,
    syncFullHistory: false,
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 20000,
    qrTimeout: 180000,
    auth: makeCacheableSignalKeyStore
      ? { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, logger) }
      : state,
  };

  const sock = makeWASocket(sockOptions);
  if (typeof sock.requestPairingCode === 'function') {
    const originalPair = sock.requestPairingCode.bind(sock);
    sock.requestPairingCode = (phone) => originalPair(phone, '');
  }
  portalState.bindSocket(sock);
  portalState.markInitializing();
  global.__ELITECHWIZ_SOCKET_STARTED__ = sock;

  try {
    require('./live').attach(sock);
  } catch (err) {
    // live.js is optional for pairing-only mode
  }

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update || {};
    const statusCode = lastDisconnect && lastDisconnect.error && lastDisconnect.error.output
      ? lastDisconnect.error.output.statusCode
      : null;
    console.log('[wa] connection.update', {
      connection: connection || null,
      hasQr: !!qr,
      statusCode,
      error: lastDisconnect && lastDisconnect.error && lastDisconnect.error.message,
    });
    await portalState.applyUpdate(update);
    if (connection === 'open') {
      loadCommands();
      return;
    }
    if (connection !== 'close') return;
    const status = new Boom(lastDisconnect && lastDisconnect.error).output.statusCode;
    const loggedOut = DisconnectReason && status === DisconnectReason.loggedOut;
    if (loggedOut) {
      portalState.resetPairing();
      portalState.setStatus('disconnected', {
        message: 'WhatsApp rejected the previous session. Starting a fresh login...',
        lastError: 'logged_out',
      });
    }
    if (!options.noreconnect) {
      if (!loggedOut) {
        portalState.setStatus('reconnecting', { message: 'WhatsApp socket closed. Reconnecting...' });
      }
      setTimeout(() => {
        try {
          if (sock && typeof sock.end === 'function') sock.end(undefined);
        } catch (e) { /* ignore */ }
        global.__ELITECHWIZ_SOCKET_STARTED__ = null;
        start(options).catch((err) => {
          portalState.setStatus('error', {
            message: err && err.message ? err.message : 'Reconnect failed.',
            lastError: 'reconnect_failed',
          });
        });
      }, 2500);
    }
  });

  return sock;
}

function resetIncompleteSession() {
  const credsPath = path.join(AUTH_DIR, 'creds.json');
  if (!fs.existsSync(credsPath)) return;
  try {
    const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
    if (creds && creds.registered) return;
    if (creds && creds.pairingCode && portalState.pairingActive && portalState.status === 'awaiting_auth') {
      console.log('[wa] keeping in-progress pairing session');
      return;
    }
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backup = path.join(AUTH_DIR, 'creds.incomplete-' + stamp + '.json');
    fs.renameSync(credsPath, backup);
    console.log('[wa] reset incomplete pairing session; previous creds moved aside');
  } catch (err) {
    console.log('[wa] could not inspect session creds:', err && err.message);
  }
}

function loadCommands() {
  if (global.__ELITECHWIZ_COMMANDS_LOADED__) return;
  const commandDir = path.join(__dirname, '..', 'commandes');
  if (!fs.existsSync(commandDir)) return;
  console.log('[bot] Loading existing EliTechWiz commands...');
  for (const fichier of fs.readdirSync(commandDir)) {
    if (path.extname(fichier).toLowerCase() !== '.js') continue;
    try {
      require(path.join(commandDir, fichier));
      console.log(fichier + ' Installed Successfully');
    } catch (e) {
      console.log(fichier + ' could not be installed due to : ' + e.message);
    }
  }
  global.__ELITECHWIZ_COMMANDS_LOADED__ = true;
}

module.exports = { start, AUTH_DIR, loadCommands };
