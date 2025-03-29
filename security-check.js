#!/usr/bin/env node

/**
 * EliTechWiz-V4 Security Check Script
 * This script identifies potential security vulnerabilities in the project
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Define patterns to detect
const PATTERNS = {
  API_KEYS: {
    pattern: /(api[_-]?key|apikey|key|token|password|secret).*?["']([a-zA-Z0-9_\-]{20,})["']/gi,
    exclude: ['.env.example', 'exemple_de_set.env', 'README.md', 'security-check.js']
  },
  SQL_INJECTION: {
    pattern: /query\([`'"].*?\$\{.*?}/g,
    exclude: ['security-check.js']
  },
  HARDCODED_CREDENTIALS: {
    pattern: /(username|password|user|pass|pwd).*?["']([a-zA-Z0-9_\-]{3,})["']/gi,
    exclude: ['.env.example', 'exemple_de_set.env', 'README.md', 'security-check.js']
  },
  EXPOSED_DB_URL: {
    pattern: /(mongodb|postgres|mysql):\/\/[a-zA-Z0-9_\-]+:[a-zA-Z0-9_\-]+@[a-zA-Z0-9_\-\.]+/g,
    exclude: ['.env.example', 'exemple_de_set.env', 'README.md', 'security-check.js']
  },
  COMMAND_INJECTION: {
    pattern: /exec\(.*?\$\{.*?}/g,
    exclude: ['security-check.js']
  },
  INSECURE_ENV_USAGE: {
    pattern: /process\.env\.[A-Z_]+\s*\|\|\s*["'][a-zA-Z0-9_\-]{10,}["']/g,
    exclude: ['security-check.js']
  }
};

// Files and directories to exclude from scanning
const EXCLUDED_DIRS = [
  'node_modules',
  '.git',
  'temp',
  'auth'
];

// Track issues found
let totalIssues = 0;
const issueDetails = [];

// Function to recursively scan files in directory
async function scanFiles(directory) {
  const items = await fs.readdir(directory);
  
  for (const item of items) {
    const itemPath = path.join(directory, item);
    
    // Skip excluded directories
    if (EXCLUDED_DIRS.some(dir => itemPath.includes(dir))) {
      continue;
    }
    
    const stats = await fs.stat(itemPath);
    
    if (stats.isDirectory()) {
      await scanFiles(itemPath);
    } else if (itemPath.endsWith('.js') || itemPath.endsWith('.json') || itemPath.endsWith('.env')) {
      await scanFile(itemPath);
    }
  }
}

// Function to scan a single file for issues
async function scanFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // Check each pattern
    Object.entries(PATTERNS).forEach(([issueType, { pattern, exclude }]) => {
      // Skip if this file should be excluded for this pattern
      if (exclude && exclude.some(ex => filePath.includes(ex))) {
        return;
      }
      
      // Reset lastIndex for global regex
      pattern.lastIndex = 0;
      
      // Find matches
      let match;
      while ((match = pattern.exec(content)) !== null) {
        totalIssues++;
        const line = content.substring(0, match.index).split('\n').length;
        
        issueDetails.push({
          type: issueType,
          file: filePath,
          line,
          match: match[0].substring(0, 100) + (match[0].length > 100 ? '...' : '')
        });
      }
    });
  } catch (error) {
    console.error(`Error scanning file ${filePath}:`, error);
  }
}

// Function to check the .env file
function checkEnvFile() {
  console.log(chalk.blue('\n🔍 Checking .env file...'));
  
  if (!fs.existsSync('.env')) {
    console.log(chalk.yellow('⚠️ No .env file found. Make sure to create one before deployment.'));
    return;
  }
  
  const env = dotenv.parse(fs.readFileSync('.env', 'utf8'));
  const envVars = [
    { name: 'OPENAI_API_KEY', required: false },
    { name: 'SESSION_ID', required: true },
    { name: 'DATABASE_URL', required: false },
    { name: 'TENOR_API_KEY', required: false },
    { name: 'WEATHER_API_KEY', required: false },
    { name: 'NEWS_API_KEY', required: false },
    { name: 'OMDB_API_KEY', required: false },
    { name: 'SERPAPI_KEY', required: false }
  ];
  
  envVars.forEach(({ name, required }) => {
    if (required && (!env[name] || env[name].trim() === '')) {
      console.log(chalk.red(`❌ Required environment variable ${name} is missing or empty.`));
      totalIssues++;
    } else if (env[name] && env[name].trim() !== '' && name.includes('API_KEY') && env[name].length > 20) {
      console.log(chalk.green(`✅ ${name} is configured.`));
    } else if (!required) {
      console.log(chalk.yellow(`⚠️ Optional environment variable ${name} is ${!env[name] || env[name].trim() === '' ? 'not configured' : 'configured'}.`));
    }
  });
}

// Function to check for npm vulnerabilities
function checkNpmVulnerabilities() {
  console.log(chalk.blue('\n🔍 Checking for npm package vulnerabilities...'));
  
  try {
    const output = execSync('npm audit --json', { encoding: 'utf8' });
    const auditData = JSON.parse(output);
    
    // Extract vulnerability data
    const { vulnerabilities } = auditData;
    const totalVulnerabilities = Object.values(vulnerabilities).reduce((acc, curr) => acc + curr.length, 0);
    
    if (totalVulnerabilities > 0) {
      console.log(chalk.red(`❌ Found ${totalVulnerabilities} vulnerabilities in npm packages.`));
      console.log(chalk.yellow('  Run "npm audit fix" to attempt to fix them automatically.'));
      totalIssues += totalVulnerabilities;
    } else {
      console.log(chalk.green('✅ No npm package vulnerabilities found.'));
    }
  } catch (error) {
    // If the command fails or there are vulnerabilities
    console.log(chalk.red('❌ Error checking npm vulnerabilities.'));
    console.log(chalk.yellow('  Run "npm audit" manually to check for vulnerabilities.'));
  }
}

// Function to check if proper security headers are set for web servers
function checkSecurityHeaders() {
  console.log(chalk.blue('\n🔍 Checking for security headers in web server code...'));
  
  const webServerFiles = [
    'eliah.js',
    'framework/index.js'
  ];
  
  const securityHeaders = [
    { name: 'Content-Security-Policy', pattern: /Content-Security-Policy/i },
    { name: 'X-Content-Type-Options', pattern: /X-Content-Type-Options/i },
    { name: 'X-Frame-Options', pattern: /X-Frame-Options/i },
    { name: 'X-XSS-Protection', pattern: /X-XSS-Protection/i }
  ];
  
  let headerIssues = 0;
  
  webServerFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      securityHeaders.forEach(header => {
        if (!header.pattern.test(content)) {
          console.log(chalk.yellow(`⚠️ Security header "${header.name}" not found in ${file}.`));
          headerIssues++;
        }
      });
    }
  });
  
  if (headerIssues > 0) {
    console.log(chalk.yellow(`⚠️ ${headerIssues} security headers are missing in web server code.`));
    totalIssues += headerIssues;
  } else {
    console.log(chalk.green('✅ Security headers are properly configured.'));
  }
}

// Function to check for session storage security
function checkSessionSecurity() {
  console.log(chalk.blue('\n🔍 Checking session storage security...'));
  
  const mainFile = 'eliah.js';
  if (fs.existsSync(mainFile)) {
    const content = fs.readFileSync(mainFile, 'utf8');
    
    // Check for insecure session storage
    if (!content.includes('DisconnectReason.sessionExpired') || 
        !content.includes('DisconnectReason.connectionClosed')) {
      console.log(chalk.yellow('⚠️ Session handling might not properly handle expired or closed sessions.'));
      totalIssues++;
    } else {
      console.log(chalk.green('✅ Basic session expiration handling is implemented.'));
    }
    
    // Check for proper session cleanup
    if (!content.includes('rimraf') && !content.includes('fs.rm') && !content.includes('fs.unlink')) {
      console.log(chalk.yellow('⚠️ Session cleanup mechanism might be missing.'));
      totalIssues++;
    } else {
      console.log(chalk.green('✅ Session cleanup appears to be implemented.'));
    }
  }
}

// Main function
async function main() {
  console.log(chalk.blue('🔍 EliTechWiz-V4 Security Check'));
  console.log(chalk.blue('=============================='));
  
  console.log(chalk.blue('\n🔍 Scanning for security issues in code...'));
  await scanFiles('.');
  
  // Check .env file
  checkEnvFile();
  
  // Check for npm vulnerabilities
  checkNpmVulnerabilities();
  
  // Check for security headers
  checkSecurityHeaders();
  
  // Check for session security
  checkSessionSecurity();
  
  // Report findings
  console.log(chalk.blue('\n📊 Security Check Results'));
  console.log(chalk.blue('======================'));
  
  if (totalIssues === 0) {
    console.log(chalk.green('✅ No security issues found.'));
  } else {
    console.log(chalk.red(`❌ Found ${totalIssues} potential security issues.`));
    
    // Group issues by type
    const issuesByType = issueDetails.reduce((acc, issue) => {
      acc[issue.type] = acc[issue.type] || [];
      acc[issue.type].push(issue);
      return acc;
    }, {});
    
    // Display details of each type of issue
    Object.entries(issuesByType).forEach(([type, issues]) => {
      console.log(chalk.yellow(`\n${type} (${issues.length} issues):`));
      
      issues.slice(0, 5).forEach(issue => {
        console.log(chalk.yellow(`  - ${issue.file} (line ${issue.line}): ${issue.match}`));
      });
      
      if (issues.length > 5) {
        console.log(chalk.yellow(`  ... and ${issues.length - 5} more issues of this type.`));
      }
    });
    
    // Provide recommendations
    console.log(chalk.blue('\n🛠️ Recommendations:'));
    
    if (issuesByType.API_KEYS) {
      console.log(chalk.yellow('  1. Move all API keys to environment variables.'));
      console.log(chalk.yellow('  2. Use process.env.KEY_NAME instead of hardcoding keys.'));
    }
    
    if (issuesByType.SQL_INJECTION) {
      console.log(chalk.yellow('  3. Use parameterized queries for all database operations.'));
      console.log(chalk.yellow('  4. Validate user input before using it in database queries.'));
    }
    
    if (issuesByType.EXPOSED_DB_URL) {
      console.log(chalk.yellow('  5. Move database connection strings to environment variables.'));
    }
    
    console.log(chalk.yellow('  6. Run "npm audit fix" to address package vulnerabilities.'));
    console.log(chalk.yellow('  7. Implement proper error handling and logging throughout the application.'));
  }
}

// Run the main function
main().catch(error => {
  console.error('Error running security check:', error);
  process.exit(1);
}); 