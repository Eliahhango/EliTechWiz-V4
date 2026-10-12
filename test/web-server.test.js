'use strict';

const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const portalState = require('../lib/portal-state');
const { createApp } = require('../lib/web-server');

const originalPair = portalState.requestPairing;
const originalQr = portalState.startQr;
const originalSnap = portalState.snapshot;

const app = createApp();
const server = http.createServer(app);

after(() => {
  portalState.requestPairing = originalPair;
  portalState.startQr = originalQr;
  portalState.snapshot = originalSnap;
  return new Promise((resolve) => server.close(resolve));
});

function listen() {
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve(server.address().port));
  });
}

function request(port, method, path, body, headers, cookies) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: Object.assign(
          {
            'Content-Type': 'application/json',
            ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
            ...(cookies ? { Cookie: cookies } : {}),
          },
          headers || {}
        ),
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          let json = null;
          try {
            json = JSON.parse(text);
          } catch (e) {
            json = null;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            text,
            json,
            cookies: res.headers['set-cookie'] || [],
          });
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

test('serves the portal, health check, and pairing API', async () => {
  const port = await listen();
  const home = await request(port, 'GET', '/');
  assert.equal(home.status, 200);
  assert.match(home.text, /Connect WhatsApp/);

  const health = await request(port, 'GET', '/health');
  assert.equal(health.status, 200);
  assert.equal(health.json.ok, true);

  const cookie = String(home.cookies[0] || '').split(';')[0];
  const bad = await request(port, 'POST', '/api/pair', { phone: '12' }, null, cookie);
  assert.equal(bad.status, 400);
  assert.equal(bad.json.ok, false);

  portalState.requestPairing = async (phone) => {
    assert.equal(phone, '255712345678');
    return { queued: false, code: 'WXYZ-9876' };
  };
  portalState.pairingCode = 'WXYZ-9876';
  portalState.status = 'awaiting_auth';
  portalState.message = 'Enter this pairing code';

  const pair = await request(
    port,
    'POST',
    '/api/pair',
    { phone: '0712345678', dialCode: '255' },
    null,
    cookie
  );
  assert.equal(pair.status, 200);
  assert.equal(pair.json.ok, true);
  assert.equal(pair.json.pairingCode, 'WXYZ-9876');

  portalState.startQr = () => ({ ready: true });
  portalState.qrDataUrl = 'data:image/png;base64,abc';
  portalState.status = 'awaiting_auth';
  portalState.message = 'Scan the QR code';
  const qr = await request(port, 'POST', '/api/qr', {}, null, cookie);
  assert.equal(qr.status, 200);
  assert.equal(qr.json.ok, true);
  assert.equal(qr.json.qrDataUrl, 'data:image/png;base64,abc');
});
