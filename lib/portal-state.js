'use strict';

const { EventEmitter } = require('events');
const { formatPairingCode, maskPhone } = require('./phone');

const STATUS = {
  DISCONNECTED: 'disconnected',
  INITIALIZING: 'initializing',
  AWAITING_AUTH: 'awaiting_auth',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  ERROR: 'error',
};

class PortalState extends EventEmitter {
  constructor() {
    super();
    this.status = STATUS.DISCONNECTED;
    this.mode = null;
    this.qr = null;
    this.qrDataUrl = null;
    this.pairingCode = null;
    this.message = 'WhatsApp is not connected.';
    this.connectedUser = null;
    this.socket = null;
    this.pendingPhone = null;
    this.lastError = null;
    this.updatedAt = Date.now();
    this.pairingInFlight = false;
    this.authBusy = false;
    this.pairingActive = false;
    this.lastPairingPhone = null;
  }

  snapshot() {
    return {
      status: this.status,
      mode: this.mode,
      qrDataUrl: this.qrDataUrl,
      pairingCode: this.pairingCode,
      message: this.message,
      connectedUser: this.connectedUser,
      lastError: this.lastError,
      updatedAt: this.updatedAt,
      registered: !!(this.socket && this.socket.authState && this.socket.authState.creds && this.socket.authState.creds.registered),
      socketReady: !!this.socket,
    };
  }

  setStatus(status, extra) {
    extra = extra || {};
    this.status = status;
    if (extra.message !== undefined) this.message = extra.message;
    if (extra.mode !== undefined) this.mode = extra.mode;
    if (extra.lastError !== undefined) this.lastError = extra.lastError;
    this.updatedAt = Date.now();
    this.emit('change', this.snapshot());
  }

  bindSocket(sock) {
    this.socket = sock || null;
    this.updatedAt = Date.now();
    this.emit('socket-ready', sock);
    this.emit('change', this.snapshot());
    if (this.pendingPhone && sock) {
      const phone = this.pendingPhone;
      this.pendingPhone = null;
      this.requestPairing(phone).catch((err) => {
        this.setStatus(STATUS.ERROR, {
          lastError: safeError(err),
          message: safeError(err),
        });
      });
    }
  }

  async applyUpdate(update) {
    if (!update || typeof update !== 'object') return;
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      this.qr = qr;
      if (this.pairingActive) {
        this.mode = 'pairing';
        this.setStatus(STATUS.AWAITING_AUTH, {
          message: this.pairingCode
            ? 'Keep WhatsApp open. Enter the pairing code, then confirm the device-link notification on your phone.'
            : 'Pairing handshake sent. Waiting for WhatsApp to confirm this device.',
          lastError: null,
          mode: 'pairing',
        });
        return;
      }
      this.mode = this.mode || 'qr';
      try {
        const qrcode = require('qrcode');
        this.qrDataUrl = await qrcode.toDataURL(qr, {
          width: 320,
          margin: 2,
          color: { dark: '#07111f', light: '#ffffff' },
        });
      } catch (err) {
        this.qrDataUrl = null;
        this.lastError = 'Unable to render the QR code.';
      }
      this.setStatus(STATUS.AWAITING_AUTH, {
        message:
          this.mode === 'pairing'
            ? 'Enter the pairing code in WhatsApp, or scan the QR code instead.'
            : 'Scan the QR code in WhatsApp Linked Devices.',
        lastError: null,
      });
      return;
    }

    if (connection === 'connecting') {
      if (this.status !== STATUS.AWAITING_AUTH) {
        this.setStatus(STATUS.CONNECTING, {
          message: 'Connecting to WhatsApp...',
          lastError: null,
        });
      }
      return;
    }

    if (connection === 'open') {
      this.qr = null;
      this.qrDataUrl = null;
      this.pairingCode = null;
      this.pendingPhone = null;
      this.pairingInFlight = false;
      this.authBusy = false;
      const id = this.socket && this.socket.user && this.socket.user.id;
      this.connectedUser = maskPhone(String(id || '').split(':')[0].split('@')[0]);
      this.setStatus(STATUS.CONNECTED, {
        message: 'WhatsApp is connected. EliTechWiz is online.',
        lastError: null,
        mode: null,
      });
      return;
    }

    if (connection === 'close') {
      const boom = lastDisconnect && lastDisconnect.error;
      const code = boom && boom.output ? boom.output.statusCode : null;
      const reason = boom && boom.message ? String(boom.message) : 'Connection Closed';
      console.log('[wa] connection closed', { code, reason });
      if (code === 401 || code === 411) {
        this.resetPairing();
        this.connectedUser = null;
        this.setStatus(STATUS.DISCONNECTED, {
          message: 'WhatsApp rejected the previous session. Request a new pairing code.',
          lastError: 'logged_out',
        });
        return;
      }
      if (this.pairingActive && this.pairingCode && code !== 428 && code !== 408) {
        this.setStatus(STATUS.RECONNECTING, {
          message: 'WhatsApp refreshed the socket. Keep the pairing code. Confirm the link notification if it appears.',
          lastError: reason,
          mode: 'pairing',
        });
        return;
      }
      this.qr = null;
      this.qrDataUrl = null;
      if (!this.pairingActive) this.pairingCode = null;
      if (this.status === STATUS.CONNECTED) {
        this.setStatus(STATUS.RECONNECTING, {
          message: 'Connection interrupted. Reconnecting...',
        });
        return;
      }
      this.setStatus(STATUS.DISCONNECTED, {
        message: reason === 'Connection Closed'
          ? 'WhatsApp closed the socket. Reconnecting and waiting for a fresh QR code.'
          : 'Disconnected from WhatsApp: ' + reason,
        lastError: reason,
      });
    }
  }

  resetPairing() {
    this.pairingCode = null;
    this.pairingActive = false;
    this.pairingInFlight = false;
    this.authBusy = false;
    this.pendingPhone = null;
    this.lastPairingPhone = null;
    this.qr = null;
    this.qrDataUrl = null;
  }

  async requestPairing(phone) {
    if (this.pairingInFlight) {
      const err = new Error('A pairing request is already in progress.');
      err.code = 'busy';
      throw err;
    }
    if (this.status === STATUS.CONNECTED) {
      const err = new Error('This bot is already linked to a WhatsApp account.');
      err.code = 'already_connected';
      throw err;
    }
    this.mode = 'pairing';
    this.pairingCode = null;
    this.lastError = null;
    this.authBusy = true;
    this.pairingActive = true;
    this.lastPairingPhone = phone;
    this.setStatus(STATUS.INITIALIZING, {
      message: 'Requesting a pairing code from WhatsApp...',
      mode: 'pairing',
      lastError: null,
    });

    const sock = this.socket;
    if (!sock) {
      this.pendingPhone = phone;
      this.setStatus(STATUS.INITIALIZING, {
        message: 'Starting WhatsApp connection. The pairing code will appear shortly.',
        mode: 'pairing',
      });
      return { queued: true, phone };
    }
    if (sock.authState && sock.authState.creds && sock.authState.creds.registered) {
      const err = new Error('This bot is already linked to a WhatsApp account.');
      err.code = 'already_connected';
      throw err;
    }
    if (typeof sock.requestPairingCode !== 'function') {
      const err = new Error('Pairing codes are not supported by the installed WhatsApp library.');
      err.code = 'unsupported';
      throw err;
    }

    this.pairingInFlight = true;
    try {
      await this.waitUntilPairable(sock);
      if (process.env.PAIRING_DELAY_MS !== '0' && !isSocketOpen(sock)) {
        const err = new Error('WhatsApp connection closed before pairing. Wait for a QR code, then retry.');
        err.code = 'connection_closed';
        throw err;
      }
      const { sendCompanionHello } = require('./pairing');
      let code;
      try {
        code = await sendCompanionHello(sock, phone);
      } catch (helloErr) {
        console.log('[wa] custom pairing handshake failed, falling back:', helloErr && helloErr.message);
        code = await sock.requestPairingCode(phone);
      }
      this.pairingCode = formatPairingCode(code);
      this.pendingPhone = null;
      this.pairingActive = true;
      this.setStatus(STATUS.AWAITING_AUTH, {
        message: 'Enter this code in WhatsApp, then confirm the "Link a device" notification on your phone. Keep this page open.',
        mode: 'pairing',
        lastError: null,
      });
      return { queued: false, code: this.pairingCode };
    } catch (err) {
      this.pairingActive = false;
      this.lastError = safeError(err);
      this.setStatus(STATUS.ERROR, {
        message: safeError(err),
        lastError: safeError(err),
        mode: 'pairing',
      });
      throw err;
    } finally {
      this.pairingInFlight = false;
      this.authBusy = false;
    }
  }

  startQr() {
    if (this.status === STATUS.CONNECTED) {
      const err = new Error('This bot is already linked to a WhatsApp account.');
      err.code = 'already_connected';
      throw err;
    }
    this.mode = 'qr';
    this.pairingCode = null;
    this.pendingPhone = null;
    if (this.qrDataUrl) {
      this.setStatus(STATUS.AWAITING_AUTH, {
        message: 'Scan the QR code in WhatsApp Linked Devices.',
        mode: 'qr',
        lastError: null,
      });
      return { ready: true };
    }
    this.setStatus(STATUS.INITIALIZING, {
      message: this.socket
        ? 'Waiting for WhatsApp to issue a QR code...'
        : 'Starting WhatsApp connection. The QR code will appear shortly.',
      mode: 'qr',
      lastError: null,
    });
    return { ready: false };
  }

  markInitializing() {
    if (this.status === STATUS.CONNECTED) return;
    this.setStatus(STATUS.INITIALIZING, {
      message: 'Initializing WhatsApp connection...',
      lastError: null,
    });
  }

  waitUntilPairable(sock) {
    if (process.env.PAIRING_DELAY_MS === '0') return Promise.resolve();
    if (sock && sock.ws && sock.ws.isOpen === false) {
      return Promise.reject(new Error('WhatsApp connection closed before pairing. Wait for a QR code, then retry.'));
    }
    if (this.qr && isSocketOpen(sock)) {
      const extra = Number(process.env.PAIRING_DELAY_MS || 800);
      return extra > 0 ? wait(extra) : Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.off('change', onChange);
        if (this.qr && isSocketOpen(sock)) return resolve();
        reject(new Error('WhatsApp is not ready for pairing yet. Wait until a QR code appears, then retry.'));
      }, 25000);
      const onChange = () => {
        if (this.qr && isSocketOpen(sock)) {
          clearTimeout(timeout);
          this.off('change', onChange);
          resolve();
        }
        if (this.status === STATUS.ERROR) {
          clearTimeout(timeout);
          this.off('change', onChange);
          reject(new Error(this.message || 'WhatsApp connection failed before pairing.'));
        }
        if (this.status === STATUS.DISCONNECTED && !isSocketOpen(sock)) {
          clearTimeout(timeout);
          this.off('change', onChange);
          reject(new Error('WhatsApp connection closed. Retry pairing after the session reconnects.'));
        }
      };
      this.on('change', onChange);
    });
  }
}

function isSocketOpen(sock) {
  const ws = sock && sock.ws;
  if (!ws) return false;
  if (ws.isOpen === true) return true;
  if (typeof ws.readyState === 'number' && ws.readyState === 1) return true;
  return false;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function safeError(err) {
  const msg = err && err.message ? String(err.message) : 'WhatsApp authentication failed.';
  return msg.replace(/\n/g, ' ').slice(0, 180);
}

const portalState = new PortalState();

module.exports = portalState;
module.exports.PortalState = PortalState;
module.exports.STATUS = STATUS;
