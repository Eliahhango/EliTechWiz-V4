'use strict';
// Live socket bridge.
//
// A few command files register `hn.ev.on(...)` listeners at module scope,
// i.e. before (or independently of) the WhatsApp socket being available.
// This module buffers those subscriptions and replays them as soon as
// `attach()` is called with the connected socket.

let sock = null;
let readyResolve;
const ready = new Promise((resolve) => {
  readyResolve = resolve;
});
const buffered = [];

function flush() {
  for (const item of buffered.splice(0)) {
    try {
      if (item.type === 'ev') {
        sock.ev.on(item.event, item.fn);
      } else if (item.type === 'send') {
        Promise.resolve(sock.sendMessage(...item.args)).then(item.resolve, item.reject);
      }
    } catch (e) {
      console.error('[live] deferred handler failed:', e.message);
    }
  }
}

function attach(socket) {
  sock = socket;
  flush();
  readyResolve(socket);
  return socket;
}

const ev = {
  on(event, fn) {
    if (sock) sock.ev.on(event, fn);
    else buffered.push({ type: 'ev', event, fn });
    return ev;
  },
  off(event, fn) {
    if (sock && typeof sock.ev.off === 'function') sock.ev.off(event, fn);
    return ev;
  }
};

const target = {
  ev,
  attach,
  ready,
  isReady: () => !!sock,
  sendMessage(...args) {
    if (sock) return sock.sendMessage(...args);
    return new Promise((resolve, reject) =>
      buffered.push({ type: 'send', args, resolve, reject })
    );
  }
};

module.exports = new Proxy(target, {
  get(t, p) {
    if (p in t) return t[p];
    if (typeof p === 'symbol' || p === 'then' || p === 'inspect') return undefined;
    // Unknown member: forward to the real socket once it exists.
    return (...args) =>
      ready.then((s) => {
        const value = s[p];
        return typeof value === 'function' ? value.apply(s, args) : value;
      });
  }
});
