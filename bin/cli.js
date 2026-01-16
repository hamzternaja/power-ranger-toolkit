#!/usr/bin/env node

/**
 * 🦸 Power Ranger Toolkit CLI
 * AI-Enhanced Development Framework
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.magenta}${msg}${colors.reset}\n`),
};

// Banner
function showBanner() {
  console.log(`
${colors.red}╔═══════════════════════════════════════════════════════════╗${colors.reset}
${colors.red}║${colors.reset}                                                           ${colors.red}║${colors.reset}
${colors.red}║${colors.reset}   ${colors.bright}🦸 POWER RANGER TOOLKIT${colors.reset}                              ${colors.red}║${colors.reset}
${colors.red}║${colors.reset}   ${colors.cyan}AI-Enhanced Development Framework${colors.reset}                    ${colors.red}║${colors.reset}
${colors.red}║${colors.reset}                                                           ${colors.red}║${colors.reset}
${colors.red}║${colors.reset}   ${colors.yellow}70+ Skills${colors.reset} | ${colors.green}7 Agents${colors.reset} | ${colors.blue}Complete Memory System${colors.reset}   ${colors.red}║${colors.reset}
${colors.red}║${colors.reset}                                                           ${colors.red}║${colors.reset}
${colors.red}╚═══════════════════════════════════════════════════════════╝${colors.reset}
  `);
}

// Help message
function showHelp() {
  showBanner();
  console.log(`
${colors.bright}Usage:${colors.reset}
  npx power-ranger-toolkit <command> [options]

${colors.bright}Commands:${colors.reset}
  ${colors.green}install${colors.reset}     Install the framework to your system
  ${colors.green}update${colors.reset}      Update existing installation
  ${colors.green}list${colors.reset}        List installed components
  ${colors.green}help${colors.reset}        Show this help message

${colors.bright}Options:${colors.reset}
  ${colors.cyan}--quick${colors.reset}     Quick install with defaults
  ${colors.cyan}--skills${colors.reset}    Install only skills
  ${colors.cyan}--agents${colors.reset}    Install only agents
  ${colors.cyan}--all${colors.reset}       Install everything (default)

${colors.bright}Examples:${colors.reset}
  npx power-ranger-toolkit install
  npx power-ranger-toolkit install --quick
  npx power-ranger-toolkit update
  npx power-ranger-toolkit list

${colors.bright}Short alias:${colors.reset}
  npx prt install
  `);
}

// Get user home directory
function getUserHome() {
  return process.env.HOME || process.env.USERPROFILE;
}

// Get target paths
function getTargetPaths() {
  const home = getUserHome();
  return {
    antigravity: path.join(home, '.gemini', 'antigravity'),
    agent: path.join(home, '.gemini', 'antigravity'),
  };
}

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    log.warn(`Source not found: ${src}`);
    return 0;
  }

  fs.mkdirSync(dest, { recursive: true });
  let count = 0;

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      count += copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }

  return count;
}

// Install command
function install(options = {}) {
  showBanner();
  log.title('🚀 Installing Power Ranger Toolkit...');

  const srcDir = path.join(__dirname, '..', 'src');
  const targets = getTargetPaths();
  const home = getUserHome();

  let totalFiles = 0;

  // Install skills
  if (!options.agentsOnly) {
    log.info('Installing skills...');
    const skillsSrc = path.join(srcDir, 'skills');
    const skillsDest = path.join(targets.antigravity, 'skills');
    const skillCount = copyDir(skillsSrc, skillsDest);
    totalFiles += skillCount;
    log.success(`Installed ${skillCount} skill files`);
  }

  // Install agents
  if (!options.skillsOnly) {
    log.info('Installing agents...');
    const agentsSrc = path.join(srcDir, 'agents');
    const agentsDest = path.join(targets.antigravity, 'agents');
    const agentCount = copyDir(agentsSrc, agentsDest);
    totalFiles += agentCount;
    log.success(`Installed ${agentCount} agent files`);
  }

  // Install workflows
  log.info('Installing workflows...');
  const workflowsSrc = path.join(srcDir, 'workflows');
  const workflowsDest = path.join(targets.agent, 'workflows');
  const workflowCount = copyDir(workflowsSrc, workflowsDest);
  totalFiles += workflowCount;
  log.success(`Installed ${workflowCount} workflow files`);

  // Install knowledge
  log.info('Installing knowledge base...');
  const knowledgeSrc = path.join(srcDir, 'knowledge');
  const knowledgeDest = path.join(targets.agent, 'knowledge');
  const knowledgeCount = copyDir(knowledgeSrc, knowledgeDest);
  totalFiles += knowledgeCount;
  log.success(`Installed ${knowledgeCount} knowledge files`);

  // Install memory
  log.info('Installing memory system...');
  const memorySrc = path.join(srcDir, 'memory');
  const memoryDest = path.join(targets.agent, 'memory');
  const memoryCount = copyDir(memorySrc, memoryDest);
  totalFiles += memoryCount;
  log.success(`Installed ${memoryCount} memory files`);

  // Install GEMINI.md (user rules)
  log.info('Installing GEMINI.md user rules...');
  const geminiSrc = path.join(srcDir, 'GEMINI.md');
  const geminiDest = path.join(home, '.gemini', 'GEMINI.md');
  if (fs.existsSync(geminiSrc)) {
    fs.mkdirSync(path.join(home, '.gemini'), { recursive: true });
    fs.copyFileSync(geminiSrc, geminiDest);
    totalFiles += 1;
    log.success('Installed GEMINI.md user rules');
  }

  // Install .agent folder (knowledge base, solutions, lessons)
  log.info('Installing .agent knowledge base...');
  const agentFolderSrc = path.join(srcDir, '.agent');
  const agentFolderDest = path.join(home, '.gemini', 'antigravity', '.agent');
  const agentFolderCount = copyDir(agentFolderSrc, agentFolderDest);
  totalFiles += agentFolderCount;
  log.success(`Installed ${agentFolderCount} knowledge base files`);

  // Summary
  console.log('');
  log.title('✨ Installation Complete!');
  console.log(`
${colors.bright}Summary:${colors.reset}
  📁 Total files installed: ${colors.green}${totalFiles}${colors.reset}
  📍 Skills location: ${colors.cyan}${targets.antigravity}/skills${colors.reset}
  📍 Agents location: ${colors.cyan}${targets.antigravity}/agents${colors.reset}
  📍 Workflows location: ${colors.cyan}${targets.agent}/workflows${colors.reset}
  📍 GEMINI.md: ${colors.cyan}${path.join(home, '.gemini', 'GEMINI.md')}${colors.reset}
  📍 Knowledge base: ${colors.cyan}${agentFolderDest}${colors.reset}

${colors.bright}What's next?${colors.reset}
  1. Open your project in Antigravity IDE
  2. The skills and agents are now available!
  3. Try using the new skills in your development

${colors.green}🦸 Go Power Rangers! 🦸${colors.reset}
  `);
}

// List command
function list() {
  showBanner();
  log.title('📋 Installed Components');

  const targets = getTargetPaths();

  // Skills
  const skillsPath = path.join(targets.antigravity, 'skills');
  if (fs.existsSync(skillsPath)) {
    const skills = fs.readdirSync(skillsPath);
    console.log(`\n${colors.bright}Skills (${skills.length}):${colors.reset}`);
    skills.forEach(s => console.log(`  ${colors.green}✓${colors.reset} ${s}`));
  }

  // Agents
  const agentsPath = path.join(targets.antigravity, 'agents');
  if (fs.existsSync(agentsPath)) {
    const agents = fs.readdirSync(agentsPath);
    console.log(`\n${colors.bright}Agents (${agents.length}):${colors.reset}`);
    agents.forEach(a => console.log(`  ${colors.green}✓${colors.reset} ${a}`));
  }

  console.log('');
}

// Parse arguments
const args = process.argv.slice(2);
const command = args[0];
const options = {
  quick: args.includes('--quick'),
  skillsOnly: args.includes('--skills'),
  agentsOnly: args.includes('--agents'),
};

// Execute command
switch (command) {
  case 'install':
  case 'i':
    install(options);
    break;
  case 'update':
  case 'u':
    install(options); // Same as install (overwrites)
    break;
  case 'list':
  case 'ls':
    list();
    break;
  case 'help':
  case '--help':
  case '-h':
  case undefined:
    showHelp();
    break;
  default:
    log.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}
