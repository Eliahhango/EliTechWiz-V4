'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalizePhone, formatPairingCode, maskPhone } = require('../lib/phone');

test('normalizes local numbers with a dial code', () => {
  const result = normalizePhone('0712345678', '255');
  assert.equal(result.ok, true);
  assert.equal(result.phone, '255712345678');
});

test('keeps international numbers intact', () => {
  const result = normalizePhone('+255 712 345 678', '255');
  assert.equal(result.ok, true);
  assert.equal(result.phone, '255712345678');
});

test('rejects short numbers', () => {
  const result = normalizePhone('123', '255');
  assert.equal(result.ok, false);
});

test('formats pairing codes into four-character groups', () => {
  assert.equal(formatPairingCode('abcd1234'), 'ABCD-1234');
});

test('masks phone numbers', () => {
  assert.equal(maskPhone('255712345678'), '255***78');
});
