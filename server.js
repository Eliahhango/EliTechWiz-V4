'use strict';

const { startWebServer } = require('./lib/web-server');

process.on('unhandledRejection', (err) => {
  console.error('[bot] unhandledRejection:', err && err.message ? err.message : err);
});

async function main() {
  const started = await startWebServer();
  global.__ELITECHWIZ_PORTAL__ = Promise.resolve(started);

  try {
    await require('./lib/baileys-connector').start();
    console.log('[bot] pairing client started. Commands load after WhatsApp connects.');
  } catch (err) {
    console.error('[bot] pairing client did not start:', err && err.message ? err.message : err);
  }
}

main().catch((err) => {
  console.error('[portal] fatal startup error:', err && err.message ? err.message : err);
  process.exit(1);
});
