'use strict';

process.env.PAIRING_DELAY_MS = '0';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { PortalState, STATUS } = require('../lib/portal-state');

test('queues pairing until a socket is bound', async () => {
  const state = new PortalState();
  const result = await state.requestPairing('255712345678');
  assert.equal(result.queued, true);
  assert.equal(state.status, STATUS.INITIALIZING);
  assert.equal(state.pendingPhone, '255712345678');
});

test('requests a genuine pairing code from the bound socket', async () => {
  const state = new PortalState();
  state.bindSocket({
    requestPairingCode: async (phone) => {
      assert.equal(phone, '255712345678');
      return 'ab12cd34';
    },
    authState: { creds: { registered: false } },
  });
  const result = await state.requestPairing('255712345678');
  assert.equal(result.code, 'AB12-CD34');
  assert.equal(state.status, STATUS.AWAITING_AUTH);
});

test('refuses pairing when already connected', async () => {
  const state = new PortalState();
  state.status = STATUS.CONNECTED;
  await assert.rejects(() => state.requestPairing('255712345678'), /already linked/);
});

test('renders QR updates from Baileys connection events', async () => {
  const state = new PortalState();
  await state.applyUpdate({ qr: 'whatsapp-auth-payload' });
  assert.equal(state.status, STATUS.AWAITING_AUTH);
  assert.ok(state.qrDataUrl && state.qrDataUrl.startsWith('data:image/png;base64,'));
});

test('surfaces connection-closed pairing failures', async () => {
  const state = new PortalState();
  process.env.PAIRING_DELAY_MS = '1';
  state.qr = 'ready';
  state.bindSocket({
    ws: { isOpen: false },
    requestPairingCode: async () => {
      throw new Error('Connection Closed');
    },
    authState: { creds: { registered: false } },
  });
  await assert.rejects(() => state.requestPairing('255712345678'), /closed before pairing|Connection Closed|not ready for pairing/);
  process.env.PAIRING_DELAY_MS = '0';
});

test('marks the bot connected from an open connection update', async () => {
  const state = new PortalState();
  state.bindSocket({ user: { id: '255712345678:12@s.whatsapp.net' } });
  await state.applyUpdate({ connection: 'open' });
  assert.equal(state.status, STATUS.CONNECTED);
  assert.equal(state.pairingCode, null);
  assert.equal(state.connectedUser, '255***78');
});
