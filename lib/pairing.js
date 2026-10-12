'use strict';

const crypto = require('crypto');

function loadBaileys() {
  return require('@whiskeysockets/baileys');
}

function generatePairingCode() {
  const baileys = loadBaileys();
  const bytesToCrockford = baileys.bytesToCrockford;
  if (typeof bytesToCrockford === 'function') {
    return String(bytesToCrockford(crypto.randomBytes(5))).toUpperCase();
  }
  const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const bytes = crypto.randomBytes(8);
  let out = '';
  for (let i = 0; i < 8; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

async function generatePairingKey(creds) {
  const baileys = loadBaileys();
  const salt = crypto.randomBytes(32);
  const randomIv = crypto.randomBytes(16);
  const key = baileys.derivePairingCodeKey(creds.pairingCode, salt);
  const ciphered = baileys.aesEncryptCTR(creds.pairingEphemeralKeyPair.public, key, randomIv);
  return Buffer.concat([salt, randomIv, ciphered]);
}

async function sendCompanionHello(sock, phone) {
  const baileys = loadBaileys();
  const creds = sock.authState && sock.authState.creds;
  if (!creds) throw new Error('WhatsApp credentials are not ready.');
  if (typeof sock.sendNode !== 'function') {
    throw new Error('This WhatsApp library cannot send a pairing handshake.');
  }

  const code = generatePairingCode();
  creds.pairingCode = code;
  creds.me = {
    id: baileys.jidEncode(phone, 's.whatsapp.net'),
    name: '~',
  };
  sock.ev.emit('creds.update', creds);

  const wrapped = await generatePairingKey(creds);
  const browser = Array.isArray(sock.browser) ? sock.browser : ['Ubuntu', 'Chrome', '22.04.4'];
  await sock.sendNode({
    tag: 'iq',
    attrs: {
      to: baileys.S_WHATSAPP_NET || 's.whatsapp.net',
      type: 'set',
      id: sock.generateMessageTag(),
      xmlns: 'md',
    },
    content: [
      {
        tag: 'link_code_companion_reg',
        attrs: {
          jid: creds.me.id,
          stage: 'companion_hello',
          should_show_push_notification: 'true',
        },
        content: [
          {
            tag: 'link_code_pairing_wrapped_companion_ephemeral_pub',
            attrs: {},
            content: wrapped,
          },
          {
            tag: 'companion_server_auth_key_pub',
            attrs: {},
            content: creds.noiseKey.public,
          },
          {
            tag: 'companion_platform_id',
            attrs: {},
            content: '49',
          },
          {
            tag: 'companion_platform_display',
            attrs: {},
            content: `${browser[1] || 'Chrome'} (${browser[0] || 'Ubuntu'})`,
          },
          {
            tag: 'link_code_pairing_nonce',
            attrs: {},
            content: Buffer.from([0]),
          },
        ],
      },
    ],
  });

  return code;
}

module.exports = {
  generatePairingCode,
  sendCompanionHello,
};
