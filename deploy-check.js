#!/usr/bin/env node

/**
 * EliTechWiz-V4 Deployment Check Script
 * This script verifies if the environment is ready for deployment
 */

const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');

// Define required files
const REQUIRED_FILES = [
  'eliah.js',
  'package.json',
  '.env',
  'set.js'
];

// Define deployment platforms and their requirements
const PLATFORMS = {
  'Heroku': {
    files: ['Procfile', 'app.json'],
    vars: ['SESSION_ID']
  },
  'Railway': {
    files: ['package.json'],
    vars: ['SESSION_ID']
  },
  'Render': {
    files: ['package.json'],
    vars: ['SESSION_ID']
  },
  'Koyeb': {
    files: ['Dockerfile', 'package.json'],
    vars: ['SESSION_ID']
  },
  'BotHosting.net': {
    files: ['package.json'],
    vars: ['SESSION_ID']
  },
  'GitHub Actions': {
    files: ['deploy.yml', '.github/workflows/deploy.yml'],
    vars: ['SESSION_ID']
  }
};

// Check for required files
console.log(chalk.blue('🔍 Checking for required files...'));
const missingFiles = REQUIRED_FILES.filter(file => !fs.existsSync(file));

if (missingFiles.length > 0) {
  console.log(chalk.red(`❌ Missing required files: ${missingFiles.join(', ')}`));
  process.exit(1);
} else {
  console.log(chalk.green('✅ All required files are present'));
}

// Check for .env file and environment variables
console.log(chalk.blue('\n🔍 Checking environment variables...'));
let envContent = {};

try {
  if (fs.existsSync('.env')) {
    const envFile = fs.readFileSync('.env', 'utf8');
    envFile.split('\n').forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const parts = line.split('=');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join('=').trim().replace(/^["'](.*)["']$/, '$1');
          envContent[key] = value;
        }
      }
    });
  }
} catch (error) {
  console.log(chalk.red(`❌ Error reading .env file: ${error.message}`));
}

// Check deployment platforms
console.log(chalk.blue('\n🔍 Checking deployment platform compatibility...'));

Object.entries(PLATFORMS).forEach(([platform, requirements]) => {
  console.log(chalk.yellow(`\n📦 ${platform}:`));
  
  // Check files
  const missingPlatformFiles = requirements.files.filter(file => {
    // If file contains a directory part, check if the directory exists
    if (file.includes('/')) {
      const dir = path.dirname(file);
      if (!fs.existsSync(dir)) {
        return true;
      }
    }
    return !fs.existsSync(file);
  });
  
  if (missingPlatformFiles.length > 0) {
    console.log(chalk.red(`  ❌ Missing files: ${missingPlatformFiles.join(', ')}`));
  } else {
    console.log(chalk.green('  ✅ All required files are present'));
  }
  
  // Check environment variables
  const missingVars = requirements.vars.filter(v => !process.env[v] && !envContent[v]);
  if (missingVars.length > 0) {
    console.log(chalk.red(`  ❌ Missing environment variables: ${missingVars.join(', ')}`));
  } else {
    console.log(chalk.green('  ✅ All required environment variables are present'));
  }
});

// Setup instructions
console.log(chalk.blue('\n📋 Deployment Instructions:'));
console.log(chalk.yellow('\n1. Heroku:'));
console.log('   - Click the "Deploy to Heroku" button in the README.md');
console.log('   - Or run: heroku create && git push heroku main');

console.log(chalk.yellow('\n2. Railway:'));
console.log('   - Connect your GitHub repository');
console.log('   - Or run: npm run railway');

console.log(chalk.yellow('\n3. Render:'));
console.log('   - Create a new Web Service using your GitHub repository');
console.log('   - Set build command: npm install');
console.log('   - Set start command: npm run render');

console.log(chalk.yellow('\n4. Koyeb:'));
console.log('   - Create a new App from your GitHub repository');
console.log('   - Set the start command to: npm run koyeb');

console.log(chalk.yellow('\n5. BotHosting.net:'));
console.log('   - Upload your files to BotHosting.net');
console.log('   - Set the start command to: npm run bothosting');

console.log(chalk.yellow('\n6. GitHub Actions:'));
console.log('   - Ensure .github/workflows/deploy.yml exists');
console.log('   - Push to your repository to trigger the workflow');

console.log(chalk.green('\n✅ Deployment check completed!')); 