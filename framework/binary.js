'use strict';
// Text <-> binary helpers used by the `binary` / `dbinary` commands.

function eBinary(text) {
  return Promise.resolve(
    Array.from(Buffer.from(String(text), 'utf8'))
      .map((b) => b.toString(2).padStart(8, '0'))
      .join(' ')
  );
}

function dBinary(bin) {
  const parts = String(bin).trim().split(/[\s,]+/).filter(Boolean);
  const bytes = parts.map((p) => {
    const value = parseInt(p, 2);
    if (Number.isNaN(value) || value < 0 || value > 255) {
      throw new Error('Invalid binary sequence');
    }
    return value;
  });
  return Promise.resolve(Buffer.from(bytes).toString('utf8'));
}

module.exports = { eBinary, dBinary };
