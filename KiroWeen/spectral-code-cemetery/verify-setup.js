#!/usr/bin/env node

/**
 * SPECTRAL Setup Verification Script
 * Checks if all required files and configurations are in place
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - MISSING`, 'red');
    return false;
  }
}

function checkDirectory(dirPath, description) {
  const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  if (exists) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - MISSING`, 'red');
    return false;
  }
}

function checkEnvFile(filePath, requiredVars) {
  if (!fs.existsSync(filePath)) {
    log(`❌ ${filePath} - MISSING`, 'red');
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const missingVars = requiredVars.filter(varName => !content.includes(varName));

  if (missingVars.length === 0) {
    log(`✅ ${filePath} - All required variables present`, 'green');
    return true;
  } else {
    log(`⚠️  ${filePath} - Missing variables: ${missingVars.join(', ')}`, 'yellow');
    return false;
  }
}

async function main() {
  // Change to script directory
  const scriptDir = __dirname;
  process.chdir(scriptDir);
  
  log('\n🎃 SPECTRAL Setup Verification\n', 'cyan');
  log(`📍 Checking directory: ${process.cwd()}\n`, 'blue');
  log('=' .repeat(50), 'blue');

  let allChecks = true;

  // Check project structure
  log('\n📁 Project Structure:', 'cyan');
  allChecks &= checkDirectory('frontend', 'Frontend directory');
  allChecks &= checkDirectory('backend', 'Backend directory');
  allChecks &= checkDirectory('frontend/src', 'Frontend source directory');
  allChecks &= checkDirectory('backend/src', 'Backend source directory');

  // Check frontend pages
  log('\n📄 Frontend Pages:', 'cyan');
  allChecks &= checkFile('frontend/src/pages/Landing.jsx', 'Landing page');
  allChecks &= checkFile('frontend/src/pages/Cemetery.jsx', 'Cemetery page');
  allChecks &= checkFile('frontend/src/pages/TimeTravel.jsx', 'TimeTravel page');
  allChecks &= checkFile('frontend/src/pages/Resurrection.jsx', 'Resurrection page');
  allChecks &= checkFile('frontend/src/pages/NotFound.jsx', 'NotFound page');

  // Check key frontend components
  log('\n🧩 Frontend Components:', 'cyan');
  allChecks &= checkFile('frontend/src/App.jsx', 'App component');
  allChecks &= checkFile('frontend/src/components/Cemetery/CemeteryLayout.jsx', 'CemeteryLayout component');
  allChecks &= checkFile('frontend/src/components/Tombstone/TombstoneCard.jsx', 'TombstoneCard component');
  allChecks &= checkFile('frontend/src/components/Effects/GhostParticles.jsx', 'GhostParticles component');

  // Check hooks
  log('\n🪝 Custom Hooks:', 'cyan');
  allChecks &= checkFile('frontend/src/hooks/useSpectralData.js', 'useSpectralData hook');
  allChecks &= checkFile('frontend/src/hooks/useResurrection.js', 'useResurrection hook');
  allChecks &= checkFile('frontend/src/hooks/useGitAnalysis.js', 'useGitAnalysis hook');

  // Check services
  log('\n🔧 Services:', 'cyan');
  allChecks &= checkFile('frontend/src/services/api.js', 'API service');
  allChecks &= checkFile('frontend/src/services/aiService.js', 'AI service');
  allChecks &= checkFile('frontend/src/services/repositoryService.js', 'Repository service');

  // Check utilities
  log('\n🛠️  Utilities:', 'cyan');
  allChecks &= checkFile('frontend/src/utils/dateFormatter.js', 'Date formatter');
  allChecks &= checkFile('frontend/src/utils/constants.js', 'Constants');
  allChecks &= checkFile('frontend/src/utils/fileHelpers.js', 'File helpers');

  // Check backend structure
  log('\n⚙️  Backend Structure:', 'cyan');
  allChecks &= checkFile('backend/src/server.js', 'Server entry point');
  allChecks &= checkDirectory('backend/src/controllers', 'Controllers directory');
  allChecks &= checkDirectory('backend/src/services', 'Services directory');
  allChecks &= checkDirectory('backend/src/routes', 'Routes directory');

  // Check configuration files
  log('\n⚙️  Configuration Files:', 'cyan');
  allChecks &= checkFile('frontend/package.json', 'Frontend package.json');
  allChecks &= checkFile('backend/package.json', 'Backend package.json');
  allChecks &= checkFile('frontend/vite.config.js', 'Vite config');
  allChecks &= checkFile('frontend/tailwind.config.js', 'Tailwind config');

  // Check environment files
  log('\n🔐 Environment Configuration:', 'cyan');
  checkEnvFile('backend/.env', ['PORT', 'GEMINI_API_KEY']);
  checkEnvFile('frontend/.env', ['VITE_API_URL']);

  // Check documentation
  log('\n📚 Documentation:', 'cyan');
  allChecks &= checkFile('README.md', 'README');
  allChecks &= checkFile('STATUS.md', 'Status document');
  allChecks &= checkFile('QUICKSTART.md', 'Quick start guide');
  allChecks &= checkFile('FINAL_COMPLETION.md', 'Completion report');

  // Check node_modules
  log('\n📦 Dependencies:', 'cyan');
  const frontendModules = fs.existsSync('frontend/node_modules');
  const backendModules = fs.existsSync('backend/node_modules');

  if (frontendModules) {
    log('✅ Frontend dependencies installed', 'green');
  } else {
    log('⚠️  Frontend dependencies not installed - Run: cd frontend && npm install', 'yellow');
  }

  if (backendModules) {
    log('✅ Backend dependencies installed', 'green');
  } else {
    log('⚠️  Backend dependencies not installed - Run: cd backend && npm install', 'yellow');
  }

  // Final summary
  log('\n' + '='.repeat(50), 'blue');
  if (allChecks && frontendModules && backendModules) {
    log('\n✅ All checks passed! Project is ready to run.', 'green');
    log('\nNext steps:', 'cyan');
    log('1. Start backend: cd backend && npm run dev', 'reset');
    log('2. Start frontend: cd frontend && npm run dev', 'reset');
    log('3. Open http://localhost:5173 in your browser', 'reset');
  } else {
    log('\n⚠️  Some checks failed. Please review the issues above.', 'yellow');
    if (!frontendModules || !backendModules) {
      log('\nInstall missing dependencies:', 'cyan');
      if (!frontendModules) log('  cd frontend && npm install', 'reset');
      if (!backendModules) log('  cd backend && npm install', 'reset');
    }
  }

  log('\n🎃 Happy Haunting!\n', 'cyan');
}

main().catch(console.error);
