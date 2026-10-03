'use strict';
// Compatibility entry point for commands that import `../command`
// and expect `{ cmd, commands }` (command registrar + registry).
const { hango, cm } = require('../framework/hango');

module.exports = {
  cmd: hango,
  command: hango,
  commands: cm
};
