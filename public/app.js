const statusNames = {
  disconnected: 'Disconnected',
  initializing: 'Initializing',
  awaiting_auth: 'Awaiting Authentication',
  connecting: 'Connecting',
  connected: 'Connected',
  reconnecting: 'Reconnecting',
  error: 'Error',
};

const els = {
  botName: document.getElementById('botName'),
  statusChip: document.getElementById('statusChip'),
  statusLabel: document.getElementById('statusLabel'),
  statusMessage: document.getElementById('statusMessage'),
  dialCode: document.getElementById('dialCode'),
  phone: document.getElementById('phone'),
  pairForm: document.getElementById('pairForm'),
  pairBtn: document.getElementById('pairBtn'),
  codeCard: document.getElementById('codeCard'),
  pairingCode: document.getElementById('pairingCode'),
  qrBtn: document.getElementById('qrBtn'),
  qrImage: document.getElementById('qrImage'),
  qrPlaceholder: document.getElementById('qrPlaceholder'),
  errorBox: document.getElementById('errorBox'),
  disconnectBtn: document.getElementById('disconnectBtn'),
  connectedUser: document.getElementById('connectedUser'),
};

function showError(msg) {
  if (!msg) {
    els.errorBox.hidden = true;
    els.errorBox.textContent = '';
    return;
  }
  els.errorBox.hidden = false;
  els.errorBox.textContent = msg;
}

function applyStatus(data) {
  const status = data.status || 'disconnected';
  els.statusChip.dataset.state = status;
  els.statusLabel.textContent = statusNames[status] || status;
  els.statusMessage.textContent = data.message || '';
  els.connectedUser.textContent = data.connectedUser ? 'Linked number: ' + data.connectedUser : '';
  els.disconnectBtn.hidden = status !== 'connected';

  const liveCode = data.pairingCode && status === 'awaiting_auth' ? data.pairingCode : '';
  if (liveCode) {
    els.codeCard.hidden = false;
    els.pairingCode.textContent = liveCode;
  } else {
    els.codeCard.hidden = true;
    els.pairingCode.textContent = '';
  }

  if (data.qrDataUrl) {
    els.qrImage.src = data.qrDataUrl;
    els.qrImage.hidden = false;
    els.qrPlaceholder.hidden = true;
  } else if (status === 'connected') {
    els.qrImage.hidden = true;
    els.qrPlaceholder.hidden = false;
    els.qrPlaceholder.textContent = 'WhatsApp is already connected.';
  }
}

async function api(path, options) {
  const res = await fetch(path, Object.assign({ credentials: 'same-origin' }, options));
  const data = await res.json().catch(() => ({ ok: false, error: 'Invalid server response.' }));
  if (!res.ok || data.ok === false) throw new Error(data.error || 'Request failed.');
  return data;
}

function bindTabs() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
    });
  });
}

async function loadMeta() {
  const meta = await api('/api/meta');
  els.botName.textContent = meta.botName || 'EliTechWiz';
  els.dialCode.innerHTML = (meta.countries || [])
    .map((c) => '<option value="' + c.dial + '">+' + c.dial + ' ' + c.name + '</option>')
    .join('');
  els.dialCode.value = '255';
}

function listenEvents() {
  const es = new EventSource('/api/events');
  es.onmessage = (ev) => {
    try {
      applyStatus(JSON.parse(ev.data));
    } catch (e) { /* ignore malformed frames */ }
  };
  es.onerror = () => {
    api('/api/status').then(applyStatus).catch(() => {});
  };
}

els.pairForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  showError('');
  els.pairBtn.disabled = true;
  try {
    const data = await api('/api/pair', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: els.phone.value,
        dialCode: els.dialCode.value,
      }),
    });
    applyStatus(data);
    if (data.pairingCode) {
      els.codeCard.hidden = false;
      els.pairingCode.textContent = data.pairingCode;
    }
  } catch (err) {
    showError(err.message);
  } finally {
    els.pairBtn.disabled = false;
  }
});

els.qrBtn.addEventListener('click', async () => {
  showError('');
  els.qrBtn.disabled = true;
  try {
    const data = await api('/api/qr', { method: 'POST' });
    applyStatus(data);
  } catch (err) {
    showError(err.message);
  } finally {
    els.qrBtn.disabled = false;
  }
});

els.disconnectBtn.addEventListener('click', async () => {
  if (!confirm('Disconnect this WhatsApp account from EliTechWiz?')) return;
  try {
    const data = await api('/api/disconnect', { method: 'POST' });
    applyStatus(data);
  } catch (err) {
    showError(err.message);
  }
});

bindTabs();
loadMeta().catch((err) => showError(err.message));
api('/api/status').then(applyStatus).catch(() => {});
listenEvents();
