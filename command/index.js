'use strict';
// Compatibility entry point for commands that import `../command`
// and expect `{ cmd, commands }` (command registrar + registry).
const { hango, cm } = require('../framework/hango');
// `cmd` handlers use the (conn, mek, m, context) signature
const cmd = (obj, fn) => {
  if (obj && typeof obj === 'object' && !obj.__style) obj.__style = 'cmd';
  return hango(obj, fn);
};

module.exports = {
  cmd,
  command: cmd,
  commands: cm
};
