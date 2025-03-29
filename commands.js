/**
 * EliTechWiz-V4 - Command Registry
 * This file contains a comprehensive list of all commands available in the bot
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

// Command Collection
const commands = new Map();
const categories = new Set();
const aliases = new Map();

/**
 * Register a command
 * @param {Object} command - Command object
 */
function registerCommand(command) {
  if (!command.name) throw new Error('Command must have a name');
  if (!command.category) command.category = 'Misc';
  
  commands.set(command.name, command);
  categories.add(command.category);
  
  if (command.aliases && Array.isArray(command.aliases)) {
    command.aliases.forEach(alias => {
      aliases.set(alias, command.name);
    });
  }
  
  console.log(chalk.green(`Registered command: ${command.name}`));
}

/**
 * Get a command by name or alias
 * @param {string} name - Command name or alias
 * @returns {Object|null} Command object or null if not found
 */
function getCommand(name) {
  // Check direct commands first
  if (commands.has(name)) {
    return commands.get(name);
  }
  
  // Check aliases
  if (aliases.has(name)) {
    const commandName = aliases.get(name);
    return commands.get(commandName);
  }
  
  return null;
}

/**
 * Get all commands in a category
 * @param {string} category - Category name
 * @returns {Array} Array of command objects
 */
function getCommandsByCategory(category) {
  return Array.from(commands.values()).filter(cmd => cmd.category === category);
}

/**
 * Get all categories
 * @returns {Array} Array of category names
 */
function getAllCategories() {
  return Array.from(categories);
}

/**
 * Get all commands
 * @returns {Array} Array of command objects
 */
function getAllCommands() {
  return Array.from(commands.values());
}

/**
 * Load commands from directory
 * @param {string} dir - Directory path
 */
async function loadCommandsFromDirectory(dir) {
  try {
    const items = await fs.readdir(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = await fs.stat(itemPath);
      
      if (stat.isDirectory()) {
        // Recursively load commands from subdirectories
        await loadCommandsFromDirectory(itemPath);
      } else if (item.endsWith('.js')) {
        // Load command file
        try {
          const command = require(itemPath);
          if (command.name) {
            registerCommand(command);
          }
        } catch (error) {
          console.error(chalk.red(`Error loading command from ${itemPath}: ${error.message}`));
        }
      }
    }
  } catch (error) {
    console.error(chalk.red(`Error loading commands: ${error.message}`));
  }
}

/**
 * Initialize commands
 */
async function initCommands() {
  const commandsDir = path.join(__dirname, 'commandes');
  await loadCommandsFromDirectory(commandsDir);
  console.log(chalk.blue(`Loaded ${commands.size} commands in ${categories.size} categories`));
}

// Export everything
module.exports = {
  registerCommand,
  getCommand,
  getCommandsByCategory,
  getAllCategories,
  getAllCommands,
  initCommands,
  commands,
  categories,
  aliases
}; 