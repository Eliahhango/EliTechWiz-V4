'use strict';

const http = require('http');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const portalState = require('./portal-state');
const { COUNTRIES, normalizePhone } = require('./phone');
const { rateLimit } = require('./rate-limit');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const COOKIE_NAME = 'elitechwiz_portal';
const COOKIE_TTL_MS = 12 * 60 * 60 * 1000;

function cookieSecret() {
  return process.env.PORTAL_SECRET || process.env.SESSION_SECRET || 'elitechwiz-portal-dev';
}

function sign(value) {
  const h = crypto.createHmac('sha256', cookieSecret()).update(value).digest('hex');
  return value + '.' + h;
}

function unsign(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const i = raw.lastIndexOf('.');
  if (i < 1) return null;
  const value = raw.slice(0, i);
  const sig = raw.slice(i + 1);
  const expected = crypto.createHmac('sha256', cookieSecret()).update(value).digest('hex');
  try {
    if (sig.length !== expected.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    return value;
  } catch (e) {
    return null;
  }
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const k = part.slice(0, idx).trim();
    const v = decodeURIComponent(part.slice(idx + 1).trim());
    out[k] = v;
  });
  return out;
}

function clientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (xf) return String(xf).split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

function setSessionCookie(res, sid) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    COOKIE_NAME +
      '=' +
      encodeURIComponent(sign(sid)) +
      '; HttpOnly; SameSite=Lax; Path=/; Max-Age=' +
      Math.floor(COOKIE_TTL_MS / 1000) +
      secure
  );
}

function requirePortalSession(req, res, next) {
  if (!req.portalSid) {
    return res.status(401).json({ ok: false, error: 'Portal session is missing or invalid. Reload the page.' });
  }

  const expectedToken = process.env.PORTAL_TOKEN;
  if (expectedToken) {
    const provided =
      req.headers['x-portal-token'] ||
      (req.headers.authorization && String(req.headers.authorization).replace(/^Bearer\s+/i, '')) ||
      (req.body && req.body.token);
    if (!provided || provided !== expectedToken) {
      return res.status(403).json({ ok: false, error: 'Portal access token is required.' });
    }
  }
  next();
}

function jsonLimit(req, res, next) {
  const ip = clientIp(req);
  const hit = rateLimit('json:' + ip, 120, 60 * 1000);
  if (!hit.ok) {
    res.setHeader('Retry-After', String(hit.retryAfter || 30));
    return res.status(429).json({ ok: false, error: 'Too many requests. Please wait and try again.' });
  }
  next();
}

function authLimit(req, res, next) {
  const ip = clientIp(req);
  const hit = rateLimit('auth:' + ip, 8, 15 * 60 * 1000);
  if (!hit.ok) {
    res.setHeader('Retry-After', String(hit.retryAfter || 60));
    return res.status(429).json({
      ok: false,
      error: 'Too many authentication attempts. Wait a few minutes before retrying.',
    });
  }
  next();
}

function publicSnapshot() {
  const snap = portalState.snapshot();
  return {
    status: snap.status,
    mode: snap.mode,
    qrDataUrl: snap.qrDataUrl,
    pairingCode: snap.status === 'awaiting_auth' ? snap.pairingCode : null,
    message: snap.message,
    connectedUser: snap.connectedUser,
    lastError: snap.lastError,
    updatedAt: snap.updatedAt,
    registered: snap.registered,
  };
}

function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    next();
  });

  app.use((req, res, next) => {
    const cookies = parseCookies(req);
    let sid = unsign(cookies[COOKIE_NAME]);
    if (!sid) {
      sid = crypto.randomBytes(16).toString('hex');
      setSessionCookie(res, sid);
    }
    req.portalSid = sid;
    next();
  });

  app.get('/health', (req, res) => {
    res.json({
      ok: true,
      service: 'EliTechWiz',
      status: portalState.status,
      uptime: Math.floor(process.uptime()),
    });
  });

  app.get('/api/meta', jsonLimit, (req, res) => {
    const conf = require('../set');
    res.json({
      ok: true,
      botName: conf.BOT || 'EliTechWiz',
      prefix: conf.PREFIXE || '.',
      ownerName: conf.OWNER_NAME || 'Owner',
      countries: COUNTRIES,
      tokenRequired: !!process.env.PORTAL_TOKEN,
      sessionModel: 'single',
    });
  });

  app.get('/api/status', jsonLimit, (req, res) => {
    res.json({ ok: true, ...publicSnapshot() });
  });

  app.get('/api/events', requirePortalSession, (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders && res.flushHeaders();

    const send = (payload) => {
      res.write('data: ' + JSON.stringify(payload) + '\n\n');
    };
    send({ type: 'status', ...publicSnapshot() });

    const onChange = () => send({ type: 'status', ...publicSnapshot() });
    portalState.on('change', onChange);
    const ping = setInterval(() => res.write(': ping\n\n'), 25000);

    req.on('close', () => {
      clearInterval(ping);
      portalState.off('change', onChange);
    });
  });

  app.post('/api/pair', requirePortalSession, jsonLimit, authLimit, async (req, res) => {
    try {
      const body = req.body || {};
      const parsed = normalizePhone(body.phone, body.dialCode);
      if (!parsed.ok) return res.status(400).json({ ok: false, error: parsed.error });

      const result = await portalState.requestPairing(parsed.phone);
      res.json({
        ok: true,
        queued: !!result.queued,
        pairingCode: result.code || portalState.pairingCode,
        status: portalState.status,
        message: portalState.message,
      });
    } catch (err) {
      const status = err && err.code === 'already_connected' ? 409 : err && err.code === 'busy' ? 409 : 500;
      res.status(status).json({ ok: false, error: userFacingPairError(err) });
    }
  });

  app.post('/api/qr', requirePortalSession, jsonLimit, authLimit, (req, res) => {
    try {
      const result = portalState.startQr();
      res.json({
        ok: true,
        ready: !!result.ready,
        qrDataUrl: portalState.qrDataUrl,
        status: portalState.status,
        message: portalState.message,
      });
    } catch (err) {
      const status = err && err.code === 'already_connected' ? 409 : 500;
      res.status(status).json({ ok: false, error: safeClientError(err) });
    }
  });

  app.post('/api/disconnect', requirePortalSession, jsonLimit, authLimit, async (req, res) => {
    try {
      const sock = portalState.socket;
      if (sock && typeof sock.logout === 'function') {
        await sock.logout();
      } else if (sock && typeof sock.end === 'function') {
        sock.end();
      }
      portalState.setStatus('disconnected', {
        message: 'Disconnected. Pair or scan again to reconnect.',
        lastError: null,
      });
      res.json({ ok: true, status: portalState.status, message: portalState.message });
    } catch (err) {
      res.status(500).json({ ok: false, error: safeClientError(err) });
    }
  });

  app.use(express.static(PUBLIC_DIR, { extensions: ['html'], maxAge: 0, etag: false }));

  app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ ok: false, error: 'Not found.' });
    }
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
  });

  return app;
}

function safeClientError(err) {
  const msg = err && err.message ? String(err.message) : 'Request failed.';
  return msg.replace(/\n/g, ' ').slice(0, 180);
}

function userFacingPairError(err) {
  const msg = safeClientError(err);
  if (/connection closed/i.test(msg)) {
    return 'WhatsApp closed the socket before pairing finished. Wait until a QR code appears, then request a new pairing code.';
  }
  return msg;
}

function startWebServer(options) {
  options = options || {};
  const port = Number(options.port || process.env.PORT || 5000);
  const host = options.host || '0.0.0.0';
  const app = createApp();
  const server = http.createServer(app);
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => {
      console.log('[portal] EliTechWiz web portal listening on ' + host + ':' + port);
      resolve({ app, server, port });
    });
  });
}

module.exports = {
  createApp,
  startWebServer,
  publicSnapshot,
};
