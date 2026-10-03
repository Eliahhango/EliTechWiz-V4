'use strict';
// Shared helpers for the download commands.
const axios = require('axios');
const cheerio = require('cheerio');

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

/**
 * Resolve a MediaFire page into its direct download link(s).
 * @param {string} url - MediaFire file page URL
 * @returns {Promise<Array<{name:string, link:string, size:string}>>}
 */
async function mediafireDl(url) {
  const { data } = await axios.get(String(url), {
    headers: { 'User-Agent': UA },
    timeout: 30000,
    maxRedirects: 5
  });
  const $ = cheerio.load(data);
  const link =
    $('a#downloadButton').attr('href') ||
    $('a[aria-label="Download file"]').attr('href') ||
    $('a[href*="download.mediafire.com"]').first().attr('href');
  if (!link) throw new Error('MediaFire download link not found');

  const name = ($('.dl-btn-label').first().text() || $('title').text() || '').trim();
  const size = ($('.dl-info').first().text() || '').trim().replace(/\s+/g, ' ');
  return [{ name, link, size }];
}

async function fetchBuffer(url, options = {}) {
  const res = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: { 'User-Agent': UA },
    timeout: 60000,
    ...options
  });
  return Buffer.from(res.data);
}

module.exports = { mediafireDl, fetchBuffer };
