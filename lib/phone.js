'use strict';

const COUNTRIES = [
  { name: 'Tanzania', dial: '255', iso: 'TZ' },
  { name: 'Kenya', dial: '254', iso: 'KE' },
  { name: 'Uganda', dial: '256', iso: 'UG' },
  { name: 'Nigeria', dial: '234', iso: 'NG' },
  { name: 'Ghana', dial: '233', iso: 'GH' },
  { name: 'South Africa', dial: '27', iso: 'ZA' },
  { name: 'United States', dial: '1', iso: 'US' },
  { name: 'United Kingdom', dial: '44', iso: 'GB' },
  { name: 'India', dial: '91', iso: 'IN' },
  { name: 'Indonesia', dial: '62', iso: 'ID' },
  { name: 'Brazil', dial: '55', iso: 'BR' },
  { name: 'Pakistan', dial: '92', iso: 'PK' },
  { name: 'Bangladesh', dial: '880', iso: 'BD' },
  { name: 'Philippines', dial: '63', iso: 'PH' },
  { name: 'Egypt', dial: '20', iso: 'EG' },
  { name: 'Morocco', dial: '212', iso: 'MA' },
  { name: 'Ethiopia', dial: '251', iso: 'ET' },
  { name: 'Rwanda', dial: '250', iso: 'RW' },
  { name: 'Zambia', dial: '260', iso: 'ZM' },
  { name: 'Zimbabwe', dial: '263', iso: 'ZW' },
  { name: 'Malawi', dial: '265', iso: 'MW' },
  { name: 'Mozambique', dial: '258', iso: 'MZ' },
  { name: 'Cameroon', dial: '237', iso: 'CM' },
  { name: 'Ivory Coast', dial: '225', iso: 'CI' },
  { name: 'Senegal', dial: '221', iso: 'SN' },
  { name: 'United Arab Emirates', dial: '971', iso: 'AE' },
  { name: 'Saudi Arabia', dial: '966', iso: 'SA' },
  { name: 'Turkey', dial: '90', iso: 'TR' },
  { name: 'Germany', dial: '49', iso: 'DE' },
  { name: 'France', dial: '33', iso: 'FR' },
  { name: 'Italy', dial: '39', iso: 'IT' },
  { name: 'Spain', dial: '34', iso: 'ES' },
  { name: 'Netherlands', dial: '31', iso: 'NL' },
  { name: 'Canada', dial: '1', iso: 'CA' },
  { name: 'Mexico', dial: '52', iso: 'MX' },
  { name: 'Argentina', dial: '54', iso: 'AR' },
  { name: 'Malaysia', dial: '60', iso: 'MY' },
  { name: 'Singapore', dial: '65', iso: 'SG' },
  { name: 'Australia', dial: '61', iso: 'AU' },
  { name: 'China', dial: '86', iso: 'CN' },
  { name: 'Japan', dial: '81', iso: 'JP' },
];

function digitsOnly(value) {
  return String(value === null || value === undefined ? '' : value).replace(/[^0-9]/g, '');
}

function normalizePhone(input, dialCode) {
  let number = digitsOnly(input);
  const dial = digitsOnly(dialCode);

  if (!number) {
    return { ok: false, error: 'Enter a WhatsApp phone number including the country code.' };
  }

  if (number.startsWith('00')) number = number.slice(2);

  if (dial) {
    if (number.startsWith(dial)) {
      // already in international form
    } else if (number.startsWith('0')) {
      number = dial + number.replace(/^0+/, '');
    } else if (number.length <= 10) {
      number = dial + number;
    }
  }

  if (number.length < 8 || number.length > 15) {
    return {
      ok: false,
      error: 'Phone number must be 8 to 15 digits with the country code, for example 255712345678.',
    };
  }

  return { ok: true, phone: number };
}

function formatPairingCode(code) {
  const raw = String(code || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
  if (raw.length === 8) return raw.slice(0, 4) + '-' + raw.slice(4);
  return String(code || '').toUpperCase();
}

function maskPhone(phone) {
  const n = digitsOnly(phone);
  if (!n) return null;
  if (n.length < 6) return '***';
  return n.slice(0, 3) + '***' + n.slice(-2);
}

module.exports = {
  COUNTRIES,
  digitsOnly,
  normalizePhone,
  formatPairingCode,
  maskPhone,
};
